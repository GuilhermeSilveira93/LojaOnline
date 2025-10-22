import { PrismaService } from "src/shared/prisma.service";
import { Produto } from "../entities/produto.entitie";
import { ProdutosGatewayInterface } from "./produtos-gateway-interface";
import { ConflictException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { tryCatch } from "src/common/patterns/try-catch";

@Injectable()
export class ProdutosGatewayPrisma implements ProdutosGatewayInterface {
  private readonly logger = new Logger(ProdutosGatewayPrisma.name);
  constructor(private readonly db: PrismaService) { }
  async create(produto: Produto): Promise<Produto> {
    const [createdProduto, produtoError] = await tryCatch(this.db.produto.create({
      data: {
        nome: produto.nome,
        descricao: produto.descricao,
        precoBase: produto.precoBase,
        estoque: produto.estoque,
      }
    }))
    if (!produto || produtoError) {
      this.logger.error(`Erro ao criar produto: ${produtoError?.message}`);
      throw new ConflictException('Erro ao criar produto.');
    }
    return createdProduto
  }
  async findMany(): Promise<Array<Produto>> {
    const [produtos, produtosError] = await tryCatch(
      this.db.produto.findMany(),
    );
    if (produtosError) {
      throw new NotFoundException('Nenhum produto encontrado.');
    }
    return produtos
  }
  async findUnique(id: string): Promise<Produto> {
    const [produto, produtoError] = await tryCatch(
      this.db.produto.findUnique({ where: { id } }),
    );
    if (!produto || produtoError) {
      this.logger.error(`Nenhum produto encontrado error: ${produtoError?.message}`);
      throw new NotFoundException('Nenhum produto encontrado.')
    }
    return produto
  }
  async update(id: string, dto: Partial<Produto>): Promise<Produto> {
    const [produto, produtoError] = await tryCatch(
      this.db.produto.update({ where: { id }, data: dto }),
    );
    if (produtoError || !produto) {
      this.logger.error(`update produto: ${produtoError?.message}`);
      throw new NotFoundException('Produto não encontrado.')
    }
    return produto
  }
  async delete(id: string): Promise<Produto> {
    const [produto, produtoError] = await tryCatch(
      this.db.produto.delete({ where: { id } }),
    );
    if (produtoError || !produto) {
      this.logger.error(`delete produto: ${produtoError?.message}`);
      throw new NotFoundException('Produto não encontrado.')
    }
    return produto
  }
  async updateDesconto(idProduto: string, descontoPercentual: number): Promise<Produto> {
    const [produto, produtoError] = await tryCatch(
      this.db.produto.update({
        where: {
          id: idProduto,
        },
        data: { descontoPercentual },
      }),
    );
    if (produtoError || !produto) {
      this.logger.error(`delete produto: ${produtoError?.message}`);
      throw new NotFoundException('Produto não encontrado.')
    }
    return produto
  }
}