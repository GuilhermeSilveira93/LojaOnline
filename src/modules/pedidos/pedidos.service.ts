import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { PrismaService } from '../../shared/prisma.service';
import { PedidoStatus, Prisma } from '@prisma/client';
import { ErrorCodes } from '../../common/errors/error-codes';
import { CarrinhoService } from '../carrinho/carrinho.service';
import { carrinhoItem } from './controller/pedidos-update-status.controller';
import { EmailService } from '../notificacoes/email.service';
import { tryCatch } from 'src/common/patterns/try-catch';
import { Pedido } from './entities/pedido.entitie';
import { PedidosGatewayInterface, PEDIDOSSGATEWAYINTERFACE } from './gateways/pedidos-gateway-interface';
@Injectable()
export class PedidosService {
  constructor(
    @Inject(PEDIDOSSGATEWAYINTERFACE)
    private PedidosGatewayPrisma: PedidosGatewayInterface,
    private db: PrismaService,
    private carrinho: CarrinhoService,
    private emailService: EmailService,
  ) { }

  private async abaterEstoqueDepoisDoPedido(
    tx: Prisma.TransactionClient,
    itens: carrinhoItem,
  ) {

  }

  private async calcularValorFinal(itens: carrinhoItem) {
    const produtos = await this.db.produto.findMany({
      where: { id: { in: itens.map((i) => i.ID_PRODUTO) } },
    });
    let totalBruto = 0,
      totalDesconto = 0;
    const itensSnapshot = itens.map((i) => {
      const p = produtos.find((pp) => pp.id === i.ID_PRODUTO);
      if (!p) throw new BadRequestException('Produto inexistente');
      if (!p.ativo || p.estoque < i.quantidade)
        throw new BadRequestException(ErrorCodes.STOCK_INSUFFICIENT);
      const precoDesc = Number(p.precoBase) * (1 - p.descontoPercentual / 100);
      const subtotal = precoDesc * i.quantidade;
      totalBruto += Number(p.precoBase) * i.quantidade;
      totalDesconto += (Number(p.precoBase) - precoDesc) * i.quantidade;
      return {
        produtoId: p.id,
        nomeSnapshot: p.nome,
        precoUnitarioSnapshot: precoDesc,
        quantidade: i.quantidade,
        subtotal,
      };
    });
    const totalLiquido = totalBruto - totalDesconto;
    return { itensSnapshot, totalBruto, totalDesconto, totalLiquido };
  }

  async criarAPartirDoCarrinho(
    vendedorId: string,
    clienteId: string,
    carrinho: carrinhoItem,
  ) {
    const pedido = await this.PedidosGatewayPrisma.criarPedidoAPartirDoCarrinho(vendedorId, clienteId, carrinho)
    return {
      success: true,
      data: pedido,
      message: 'Pedido criado com sucesso',
    };
  }

  async listarPorStatusDoVendedor(vendedorId: string, status?: PedidoStatus) {
    const [pedidos, pedError] = await tryCatch(
      this.db.pedido.findMany({
        where: {
          vendedorId,
          ...(status ? { status: PedidoStatus[status] } : {}),
        },
      }),
    );
    if (pedError)
      return {
        message: pedError.message || 'pedido não encontrado',
        data: [],
        success: false,
      };
    return { message: 'Pedidos encontrados.', data: pedidos, success: true };
  }

  async findByClientId(
    vendedorId: string,
    idCliente: string,
    userRole: string,
  ) {
    const [ped, pedError] = await tryCatch(
      this.db.pedido.findFirst({ where: { clienteId: idCliente } }),
    );
    if (pedError || !ped) throw new NotFoundException('Pedido não encontrado');
    if (userRole === 'VENDEDOR' && ped.vendedorId !== vendedorId)
      throw new ForbiddenException(ErrorCodes.FORBIDDEN_OWNERSHIP);
    return {
      message: 'pedido encontrado',
      data: ped,
      success: true,
    };
  }

  async atualizarStatus(
    vendedorId: string,
    idPedido: string,
    novoStatus: PedidoStatus,
  ) {
    const [ped, pedError] = await tryCatch(
      this.db.pedido.findUnique({
        where: { id: idPedido },
        include: { PedidoItem: true, Cliente: true },
      }),
    );
    if (!ped || pedError)
      throw new NotFoundException(pedError?.message ?? 'pedido não encontrado');
    if (ped.vendedorId !== vendedorId)
      throw new ForbiddenException(ErrorCodes.FORBIDDEN_OWNERSHIP);
    const ordem = [
      PedidoStatus.CRIADO,
      PedidoStatus.EM_PROCESSAMENTO,
      PedidoStatus.ENVIADO,
      PedidoStatus.ENTREGUE,
    ];
    if (ordem.indexOf(novoStatus) < ordem.indexOf(ped.status))
      throw new BadRequestException(ErrorCodes.STATUS_REGRESSION);
    const updated = await this.db.pedido.update({
      where: { id: idPedido },
      data: { status: novoStatus },
      include: { PedidoItem: true, Cliente: true },
    });
    this.emailService.NovoStatusPedido(updated.Cliente, novoStatus, idPedido);
    return {
      success: true,
      message: 'status atualizado com sucesso',
      data: updated,
    };
  }
}
