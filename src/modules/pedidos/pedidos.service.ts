import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../shared/prisma.service';
import { PedidoStatus, Prisma } from '@prisma/client';
import { ErrorCodes } from '../../common/errors/error-codes';
import { CarrinhoService } from '../carrinho/carrinho.service';
import { carrinhoItem } from './controller/pedidos-update-status.controller';
import { EmailService } from '../notificacoes/email.service';
import { tryCatch } from 'src/common/patterns/try-catch';

@Injectable()
export class PedidosService {
  constructor(
    private db: PrismaService,
    private carrinho: CarrinhoService,
    private emailService: EmailService,
  ) {}

  private async abaterEstoqueDepoisDoPedido(
    tx: Prisma.TransactionClient,
    itens: carrinhoItem,
  ) {
    for (const i of itens) {
      const updated = await tx.produto.updateMany({
        where: {
          id: i.ID_PRODUTO,
          estoque: { gte: i.quantidade },
          ativo: true,
        },
        data: { estoque: { decrement: i.quantidade } },
      });
      if (updated.count === 0) {
        throw new BadRequestException(ErrorCodes.STOCK_INSUFFICIENT);
      }
    }
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
    const { itensSnapshot, totalBruto, totalDesconto, totalLiquido } =
      await this.calcularValorFinal(carrinho);
    const pedido = await this.db.$transaction(async (tx) => {
      await this.abaterEstoqueDepoisDoPedido(tx, carrinho);

      const created = await tx.pedido.create({
        data: {
          clienteId,
          vendedorId,
          totalBruto,
          totalDesconto,
          totalLiquido,
          status: PedidoStatus.CRIADO,
          PedidoItem: {
            create: itensSnapshot.map((i) => ({ ...i })),
          },
        },
        include: { PedidoItem: true, Cliente: true },
      });
      await this.carrinho.delete(vendedorId);
      return created;
    });
    await Promise.all(
      carrinho.map((i) =>
        this.db.produto.update({
          where: { id: i.ID_PRODUTO },
          data: { estoque: { decrement: i.quantidade } },
        }),
      ),
    );
    return pedido;
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

  async findByClientId(vendedorId: string, id: string, userRole: string) {
    const [ped, pedError] = await tryCatch(
      this.db.pedido.findUnique({
        where: { id },
        include: { PedidoItem: true, Cliente: true },
      }),
    );
    if (pedError) throw new BadRequestException();
    if (!ped) {
      return {
        message: 'pedido não encontrado',
        data: {},
        success: false,
      };
    }
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
