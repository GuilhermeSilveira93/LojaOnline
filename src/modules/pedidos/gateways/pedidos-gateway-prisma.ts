import { Prisma, PedidoStatus } from "@prisma/client";
import { Pedido } from "../entities/pedido.entitie";
import { carrinhoItem, PedidosGatewayInterface } from "./pedidos-gateway-interface";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ErrorCodes } from "src/common/errors/error-codes";
import { PrismaService } from "src/shared/prisma.service";
import { Cliente } from "src/modules/clientes/entities/cliente.entitie";
import { Endereco } from "src/modules/clientes/entities/endereco.entitie";
import { CarrinhoService } from "src/modules/carrinho/carrinho.service";

@Injectable()
export class PedidosGatewayPrisma implements PedidosGatewayInterface {
  constructor(private readonly db: PrismaService, private carrinho: CarrinhoService) { }
  async findClientById(idCliente: string): Promise<Cliente> {
    const cliente = await this.db.cliente.findUnique({ where: { id: idCliente }, include: { endereco: true } })
    if (!cliente) {
      throw new NotFoundException('Cliente não encontrado')
    }
    const newAddress = new Endereco({
      bairro: cliente.endereco?.bairro!,
      cep: cliente.endereco?.cep!,
      cidade: cliente.endereco?.cidade!,
      complemento: cliente.endereco?.complemento!,
      numero: cliente.endereco?.numero!,
      rua: cliente.endereco?.rua!,
      uf: cliente.endereco?.uf!,
      id: cliente.endereco?.id!,
      id_cliente: cliente.id
    })
    const newClient = new Cliente({
      id: cliente.id,
      endereco: newAddress,
      documento: cliente.documento,
      email: cliente.email,
      nome: cliente.nome,
      telefone: cliente.telefone
    })
    return newClient
  }
  async abaterEstoqueDepoisDoPedido(tx: Prisma.TransactionClient, itens: carrinhoItem): Promise<void> {
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
  async calcularValorFinal(itens: carrinhoItem): Promise<{ itensSnapshot: Array<{ produtoId: string; nomeSnapshot: string; precoUnitarioSnapshot: number; quantidade: number; subtotal: number; }>; totalBruto: number; totalDesconto: number; totalLiquido: number; }> {
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
  async criarPedidoAPartirDoCarrinho(vendedorId: string, clienteId: string, carrinho: carrinhoItem): Promise<Pedido> {
    const [
      cliente,
      { itensSnapshot, totalBruto, totalDesconto, totalLiquido },
    ] = await Promise.all([
      this.findClientById(clienteId),
      this.calcularValorFinal(carrinho),
    ]);
    if (!cliente) throw new BadRequestException('Cliente inexistente');
    const novoPedido = new Pedido({
      clienteId,
      status: PedidoStatus.CRIADO,
      totalBruto,
      totalDesconto,
      totalLiquido,
      vendedorId,
    })
    const pedido = await this.db.$transaction(async (tx) => {
      await this.abaterEstoqueDepoisDoPedido(tx, carrinho);
      const pedidoCriado = await tx.pedido.create({
        data: {
          clienteId: novoPedido.clienteId,
          vendedorId: novoPedido.vendedorId,
          totalBruto: novoPedido.totalBruto,
          totalDesconto: novoPedido.totalDesconto,
          totalLiquido: novoPedido.totalLiquido,
          status: novoPedido.status,
          PedidoItem: {
            create: itensSnapshot.map((i) => ({ ...i })),
          },
        },
      });
      await this.carrinho.delete(vendedorId);
      novoPedido.id = pedidoCriado.id
      novoPedido.createdAt = pedidoCriado.createdAt
      novoPedido.updatedAt = pedidoCriado.updatedAt
      return novoPedido;
    });
    await Promise.all(
      carrinho.map((i) =>
        this.db.produto.update({
          where: { id: i.ID_PRODUTO },
          data: { estoque: { decrement: i.quantidade } },
        }),
      ),
    );
    return pedido

  }
  listarPorStatusDoVendedor(vendedorId: string, status?: PedidoStatus): Promise<Array<Pedido>> {
    throw new Error("Method not implemented.");
  }
  atualizarStatus(vendedorId: string, idPedido: string, novoStatus: PedidoStatus): Promise<Pedido> {
    throw new Error("Method not implemented.");
  }
}