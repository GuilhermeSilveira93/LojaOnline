import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma.service';
import { PedidoStatus, Prisma } from '@prisma/client';
import { ErrorCodes } from '../../common/errors/error-codes';
import { CarrinhoService } from '../carrinho/carrinho.service';
import { carrinhoItem } from './pedidos.controller';
import { EmailService } from '../notificacoes/email.service';

@Injectable()
export class PedidosService {
  constructor(private prisma: PrismaService, private carrinho: CarrinhoService) { }

  private async abaterEstoqueDepoisDoPedido(
    tx: Prisma.TransactionClient,
    itens: carrinhoItem,
  ) {
    for (const i of itens) {
      const updated = await tx.produto.updateMany({
        where: { id: i.ID_PRODUTO, estoque: { gte: i.quantidade }, ativo: true },
        data: { estoque: { decrement: i.quantidade } },
      });
      if (updated.count === 0) {
        throw new BadRequestException(ErrorCodes.STOCK_INSUFFICIENT);
      }
    }
  }

  private async calcValorFinal(itens: carrinhoItem) {
    const produtos = await this.prisma.produto.findMany({ where: { id: { in: itens.map(i => i.ID_PRODUTO) } } });
    let totalBruto = 0, totalDesconto = 0;
    const itensSnapshot = itens.map(i => {
      const p = produtos.find(pp => pp.id === i.ID_PRODUTO);
      if (!p) throw new BadRequestException('Produto inexistente');
      if (!p.ativo || p.estoque < i.quantidade) throw new BadRequestException(ErrorCodes.STOCK_INSUFFICIENT);
      const precoDesc = Number(p.precoBase) * (1 - p.descontoPercentual / 100);
      const subtotal = precoDesc * i.quantidade;
      totalBruto += Number(p.precoBase) * i.quantidade;
      totalDesconto += (Number(p.precoBase) - precoDesc) * i.quantidade;
      return { produtoId: p.id, nomeSnapshot: p.nome, precoUnitarioSnapshot: precoDesc, quantidade: i.quantidade, subtotal };
    });
    const totalLiquido = totalBruto - totalDesconto;
    return { itensSnapshot, totalBruto, totalDesconto, totalLiquido };
  }

  async criarAPartirDoCarrinho(vendedorId: string, clienteId: string, carrinho: carrinhoItem) {
    console.log(clienteId)
    const { itensSnapshot, totalBruto, totalDesconto, totalLiquido } = await this.calcValorFinal(carrinho);
    for (const i of carrinho) {
      await this.prisma.produto.update({ where: { id: i.ID_PRODUTO }, data: { estoque: { decrement: i.quantidade } } });
    }

    const pedido = await this.prisma.$transaction(async (tx) => {
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

    return pedido;
  }

  async listarPorStatusDoVendedor(vendedorId: string, status?: PedidoStatus) {
    return this.prisma.pedido.findMany({ where: { vendedorId, ...(status ? { status: PedidoStatus[status] } : {}) } });
  }

  async obter(vendedorId: string, id: string, userRole: string) {
    const ped = await this.prisma.pedido.findUnique({ where: { id }, include: { PedidoItem: true, Cliente: true } });
    if (!ped) throw new NotFoundException();
    if (userRole === 'VENDEDOR' && ped.vendedorId !== vendedorId) throw new ForbiddenException(ErrorCodes.FORBIDDEN_OWNERSHIP);
    return ped;
  }

  async atualizarStatus(vendedorId: string, idPedido: string, novo: PedidoStatus) {
    const ped = await this.prisma.pedido.findUnique({ where: { id: idPedido }, include: { PedidoItem: true, Cliente: true } });
    if (!ped) throw new NotFoundException();
    if (ped.vendedorId !== vendedorId) throw new ForbiddenException(ErrorCodes.FORBIDDEN_OWNERSHIP);
    const ordem = [PedidoStatus.CRIADO, PedidoStatus.EM_PROCESSAMENTO, PedidoStatus.ENVIADO, PedidoStatus.ENTREGUE];
    if (ordem.indexOf(novo) < ordem.indexOf(ped.status)) throw new BadRequestException(ErrorCodes.STATUS_REGRESSION);
    const updated = await this.prisma.pedido.update({ where: { id: idPedido }, data: { status: novo }, include: { PedidoItem: true, Cliente: true } });
    return updated;
  }
}
