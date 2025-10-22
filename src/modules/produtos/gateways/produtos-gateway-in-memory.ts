import { Produto } from "../entities/produto.entitie";
import { ProdutosGatewayInterface } from "./produtos-gateway-interface";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";

@Injectable()
export class ProdutosGatewayInMemory implements ProdutosGatewayInterface {
  produtos = new Map<string, Produto>();
  private readonly logger = new Logger(ProdutosGatewayInMemory.name)
  async create(produto: Produto): Promise<Produto> {
    produto.id = String(this.produtos.size + 1)
    produto.updatedAt = new Date()
    produto.createdAt = new Date()
    produto.ativo = true
    produto.descontoPercentual = produto.descontoPercentual || 0
    this.produtos.set(produto.id, produto)
    return produto
  }
  async findMany(): Promise<Array<Produto>> {
    return Array.from(this.produtos.values())
  }
  async findUnique(id: string): Promise<Produto> {
    const produto = this.produtos.get(id)
    if (!produto) {
      this.logger.error(`Nenhum produto encontrado com id: ${id}`);
      throw new NotFoundException('Nenhum produto encontrado.')
    }
    return produto
  }
  async update(id: string, dto: Partial<Produto>): Promise<Produto> {
    const produto = this.produtos.get(id)
    if (!produto) {
      this.logger.error(`Nenhum produto encontrado com id: ${id}`);
      throw new NotFoundException('Produto não encontrado.')
    }
    const updatedProduto = { ...produto, ...dto, updatedAt: new Date() }
    this.produtos.set(id, updatedProduto)
    return updatedProduto
  }
  async delete(id: string): Promise<Produto> {
    const produto = this.produtos.get(id)
    if (!produto) {
      this.logger.error(`Nenhum produto encontrado com id: ${id}`);
      throw new NotFoundException('Produto não encontrado.')
    }
    this.produtos.delete(id)
    return produto
  }
  async updateDesconto(idProduto: string, descontoPercentual: number): Promise<Produto> {
    const produto = this.produtos.get(idProduto)
    if (!produto) {
      this.logger.error(`Nenhum produto encontrado com id: ${idProduto}`);
      throw new NotFoundException('Produto não encontrado.')
    }
    produto.descontoPercentual = descontoPercentual
    this.produtos.set(idProduto, produto)
    return produto
  }
}