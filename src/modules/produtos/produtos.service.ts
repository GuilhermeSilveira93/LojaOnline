import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../shared/prisma.service';
import { CriarProdutoDto } from './dto/criarProduto.dto';
import { AtualizarProdutoDto } from './dto/AtualizarProduto.dto';
import { tryCatch } from 'src/common/patterns/try-catch';

@Injectable()
export class ProdutosService {
  constructor(private db: PrismaService) {}

  async create(dto: CriarProdutoDto) {
    try {
      const produto = await this.db.produto.create({
        data: dto,
      });
      return {
        success: true,
        data: produto,
        message: 'Produto incluido com sucesso!',
      };
    } catch (error) {
      let message = error.message;
      switch (error.code) {
        case 'P2002':
          message = 'Produto com este nome já existe';
        default:
          break;
      }
      throw new ConflictException(message);
    }
  }
  async findMany() {
    const [produtos, produtosError] = await tryCatch(
      this.db.produto.findMany(),
    );
    if (produtosError) {
      return {
        success: false,
        message: produtosError.message,
        data: {},
      };
    }
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
      return {
        success: false,
        data: {},
        message: produtoError?.message || 'Não existe produto',
      };
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
    if (produtoError) {
      return {
        success: false,
        message: produtoError.message,
        data: {},
      };
    }
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
    if (produtoError) {
      return {
        success: false,
        message: produtoError.message,
        data: {},
      };
    }
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
    if (produtoError) {
      return {
        success: false,
        message: produtoError.message,
        data: {},
      };
    }
    return {
      success: true,
      data: produto,
      message: 'Desconto atualizado no produto!',
    };
  }
}
