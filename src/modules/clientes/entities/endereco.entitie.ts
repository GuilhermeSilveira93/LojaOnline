export class Endereco {
  id: string
  id_cliente: string
  rua: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  uf: string
  cep: string
  constructor(props: {
    id: string
    id_cliente: string
    rua: string
    numero: string
    complemento: string
    bairro: string
    cidade: string
    uf: string
    cep: string
  }) {
    this.id = props.id
    this.id_cliente = props.id_cliente
    this.rua = props.rua
    this.numero = props.numero
    this.complemento = props.complemento
    this.bairro = props.bairro
    this.cidade = props.cidade
    this.uf = props.uf
    this.cep = props.cep
  }
}