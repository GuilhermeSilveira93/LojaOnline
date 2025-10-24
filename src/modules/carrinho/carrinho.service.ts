import {
  ForbiddenException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/shared/prisma.service';
import { IncludeProductDto } from './dto/includeProduct.dto';
import { tryCatch } from 'src/common/patterns/try-catch';

@Injectable()
export class CarrinhoService {
  constructor(private readonly db: PrismaService) {}

  async findUnique(userId: string) {
    const [carrinho, carrinhoError] = await tryCatch(
      this.db.carrinho.findUnique({
        include: {
          CarrinhoItem: true,
        },
        where: {
          id: userId,
        },
      }),
    );
    if (carrinhoError || !carrinho)
      throw new NotFoundException('Carrinho não encontrado.');
    return {
      success: true,
      data: carrinho.CarrinhoItem,
      message: 'Carrinho encontrado',
    };
  }
  async adicionarProduto(data: IncludeProductDto) {
    await this.db.carrinho.upsert({
      where: { id: data.userId },
      update: {},
      create: { id: data.userId },
    });
    const carrinho = await this.db.$transaction(async (tx) => {
      const produto = await tx.produto.findUnique({
        where: { id: data.item.produtoId, ativo: true },
        select: {
          precoBase: true,
          descontoPercentual: true,
          ativo: true,
          estoque: true,
        },
      });
      if (!produto) throw new NotFoundException('Produto inativo ou inexistente');
      if (produto.estoque < data.item.quantidade)
        throw new NotAcceptableException('Estoque insuficiente');

      const precoBase = new Prisma.Decimal(produto.precoBase);
      const fatorDesc = new Prisma.Decimal(
        100 - produto.descontoPercentual,
      ).div(100);
      const precoUnitSnapshot = precoBase.mul(fatorDesc);
      const subtotal = precoUnitSnapshot.mul(data.item.quantidade);
      return await tx.carrinhoItem.upsert({
        where: {
          ID_CARRINHO_ID_PRODUTO: {
            ID_CARRINHO: data.userId,
            ID_PRODUTO: data.item.produtoId,
          },
        },
        update: {
          quantidade: { increment: data.item.quantidade },
          subtotal: { increment: subtotal },
        },
        create: {
          ID_CARRINHO: data.userId,
          ID_PRODUTO: data.item.produtoId,
          quantidade: data.item.quantidade,
          preco_unitario_snapshot: precoUnitSnapshot,
          subtotal: subtotal,
        },
      });
    });
    return {
      sucesso: true,
      data: carrinho,
      message: 'Produto adicionado ao carrinho',
    };
  }
  async deletarProduto(userId: string, productId: string) {
    return this.db.$transaction(async (tx) => {
      const item = await tx.carrinhoItem.findUnique({
        where: {
          ID_CARRINHO_ID_PRODUTO: {
            ID_CARRINHO: userId,
            ID_PRODUTO: productId,
          },
        },
        select: { quantidade: true },
      });
      if (!item) {
        throw new NotFoundException('Item do carrinho não encontrado.');
      }
      await tx.carrinhoItem.delete({
        where: {
          ID_CARRINHO_ID_PRODUTO: {
            ID_CARRINHO: userId,
            ID_PRODUTO: productId,
          },
        },
      });
      return { sucesso: true, message: 'Produto removido do carrinho' };
    });
  }

  async delete(userId: string) {
    const [carrinhoDeletado, error] = await tryCatch(
      this.db.carrinhoItem.deleteMany({
        where: {
          Carrinho: {
            id: userId,
          },
        },
      }),
    );
    if (error || !carrinhoDeletado)
      throw new NotFoundException('Carrinho não encontrado.');
    return { sucesso: true, message: 'Carrinho deletado com sucesso' };
  }
}
