import { PedidoStatus, Prisma } from "@prisma/client";
import { Pedido } from "../entities/pedido.entitie";
import { Cliente } from "src/modules/clientes/entities/cliente.entitie";
export type carrinhoItem = Array<{ ID_PRODUTO: string; quantidade: number }>;
export const PEDIDOSSGATEWAYINTERFACE = 'PEDIDOSSGATEWAYINTERFACE'
export interface PedidosGatewayInterface {
  findClientById(idCliente: string): Promise<Cliente>
  abaterEstoqueDepoisDoPedido(tx: Prisma.TransactionClient, itens: carrinhoItem): Promise<void>;
  calcularValorFinal(itens: carrinhoItem): Promise<{
    itensSnapshot: Array<{
      produtoId: string;
      nomeSnapshot: string;
      precoUnitarioSnapshot: number;
      quantidade: number;
      subtotal: number;
    }>;
    totalBruto: number;
    totalDesconto: number;
    totalLiquido: number;
  }>;
  criarPedidoAPartirDoCarrinho(vendedorId: string, clienteId: string, carrinho: carrinhoItem,): Promise<Pedido>
  listarPorStatusDoVendedor(vendedorId: string, status?: PedidoStatus): Promise<Array<Pedido>>
  atualizarStatus(vendedorId: string, idPedido: string, novoStatus: PedidoStatus): Promise<Pedido>
}