import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../shared/prisma.service';
import { CriarProdutoDto } from './dto/criarProduto.dto';
import { AtualizarProdutoDto } from './dto/AtualizarProduto.dto';
import { tryCatch } from 'src/common/patterns/try-catch';

@Injectable()
export class ProdutosService {
  constructor(private db: PrismaService) {}

  async create(dto: CriarProdutoDto) {
    const [produto, produtoError] = await tryCatch(
      this.db.produto.create({
        data: dto,
      }),
    );
    if (!produto || produtoError)
      throw new BadRequestException('Erro ao criar produto.');
    return {
      success: true,
      data: produto,
      message: 'Produto incluido com sucesso!',
    };
  }
  async findMany() {
    const [produtos, produtosError] = await tryCatch(
      this.db.produto.findMany(),
    );
    if (produtosError || !produtos)
      throw new NotFoundException('Nenhum produto encontrado.');
    return {
      success: true,
      message: 'Produtos Encontrados',
      data: produtos,
    };
  }
  async findUnique(id: string) {
    const [produto, produtoError] = await tryCatch(
      this.db.produto.findUnique({ where: { id } }),
    );
    if (!produto || produtoError)
      throw new NotFoundException('Nenhum produto encontrado.');

    return {
      success: true,
      data: produto,
      message: 'Produto encontrado!',
    };
  }
  async update(id: string, dto: AtualizarProdutoDto) {
    const [produto, produtoError] = await tryCatch(
      this.db.produto.update({ where: { id }, data: dto }),
    );
    if (produtoError || !produto)
      throw new NotFoundException('Produto não encontrado.');
    return {
      success: true,
      data: produto,
      message: 'Produto atualizado!',
    };
  }
  async delete(id: string) {
    const [produto, produtoError] = await tryCatch(
      this.db.produto.delete({ where: { id } }),
    );
    if (produtoError || !produto)
      throw new NotFoundException('Produto não encontrado.');
    return {
      success: true,
      data: produto,
      message: 'Produto deletado!',
    };
  }

  async updateDescount(idProduto: string, desconto: number) {
    const [produto, produtoError] = await tryCatch(
      this.db.produto.update({
        where: {
          id: idProduto,
        },
        data: { descontoPercentual: desconto },
      }),
    );
    if (produtoError || !produto)
      throw new NotFoundException('Produto não encontrado.');
    return {
      success: true,
      data: produto,
      message: 'Desconto atualizado no produto!',
    };
  }
}
