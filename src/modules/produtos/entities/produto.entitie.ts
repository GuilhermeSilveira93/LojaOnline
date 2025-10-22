export class Produto {
  id?: string;
  nome: string;
  descricao?: string | null;
  precoBase: number;
  descontoPercentual?: number;
  estoque: number;
  ativo?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  constructor(props: {
    id?: string;
    nome: string;
    descricao?: string | null;
    precoBase: number;
    descontoPercentual?: number;
    estoque: number;
    ativo?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = props.id;
    this.nome = props.nome;
    this.descricao = props.descricao;
    this.precoBase = props.precoBase;
    this.descontoPercentual = props.descontoPercentual;
    this.estoque = props.estoque;
    this.ativo = props.ativo;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

}