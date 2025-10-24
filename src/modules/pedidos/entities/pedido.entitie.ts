import { PedidoStatus } from "@prisma/client"

export class Pedido {
  id?: string
  clienteId: string
  vendedorId: string
  status: PedidoStatus
  totalBruto: number
  totalDesconto: number
  totalLiquido: number
  createdAt?: Date
  updatedAt?: Date
  constructor(props: {
    id?: string
    clienteId: string
    vendedorId: string
    status: PedidoStatus
    totalBruto: number
    totalDesconto: number
    totalLiquido: number
  }) {
    this.id = props.id
    this.clienteId = props.clienteId
    this.vendedorId = props.vendedorId
    this.status = props.status
    this.totalBruto = props.totalBruto
    this.totalDesconto = props.totalDesconto
    this.totalLiquido = props.totalLiquido
    this.createdAt = new Date()
    this.updatedAt = new Date()
  }

}