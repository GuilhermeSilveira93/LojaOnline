import { PedidoStatus } from "@prisma/client"

export class PedidoItem {
  id?: string
  pedidoId: string
  produtoId: string
  nomeSnapshot: string
  precoUnitarioSnapshot: number
  quantidade: number
  subtotal: number
  constructor(props: {
    id?: string
    pedidoId: string
    produtoId: string
    nomeSnapshot: string
    precoUnitarioSnapshot: number
    quantidade: number
    subtotal: number
  }) {
    this.id = props.id
    this.pedidoId = props.pedidoId
    this.produtoId = props.produtoId
    this.nomeSnapshot = props.nomeSnapshot
    this.precoUnitarioSnapshot = props.precoUnitarioSnapshot
    this.quantidade = props.quantidade
    this.subtotal = props.subtotal
  }

}