import { Produto } from "../entities/produto.entitie";

export const PRODUTOSGATEWAYINTERFACE = 'PRODUTOSGATEWAYINTERFACE'
export interface ProdutosGatewayInterface {
  create(produto: Produto): Promise<Produto>;
  findMany(): Promise<Array<Produto>>;
  findUnique(id: string): Promise<Produto>;
  update(id: string, dto: Partial<Produto>): Promise<Produto>;
  delete(id: string): Promise<Produto>;
  updateDesconto(id: string, descontoPercentual: number): Promise<Produto>;
}