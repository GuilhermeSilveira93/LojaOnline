import { Endereco } from "@prisma/client"

export class Cliente {
  id: string
  nome: string
  email: string
  documento: string
  telefone: string | null
  endereco: Endereco
  createdAt: Date
  updatedAt: Date
  constructor(props: {
    id: string
    nome: string
    email: string
    documento: string
    telefone: string | null
    endereco: Endereco
  }) {
    this.id = props.id,
      this.documento = props.documento
    this.nome = props.nome
    this.email = props.email
    this.telefone = props.telefone
    this.endereco = props.endereco
    this.createdAt = new Date()
    this.updatedAt = new Date()
  }
}