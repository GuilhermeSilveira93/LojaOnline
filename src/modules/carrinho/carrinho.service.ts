import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/shared/prisma.service';
import { IncludeProductDto } from './dto/includeProduct.dto';

type Item = { produtoId: string; quantidade: number };
@Injectable()
export class CarrinhoService {
  constructor(private readonly db: PrismaService) { }

  private criarCarrinho(userId: string) {
    return this.db.carrinho.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId },
    })
  }

  findUnique(userId: string) {
    return this.db.carrinho.findUnique({
      select: {
        CarrinhoItem: {
          select: {
            ID_PRODUTO: true,
            quantidade: true
          }
        }
      },
      where: {
        id: userId
      }
    })
  }
  async adicionar(data: IncludeProductDto) {
    await this.criarCarrinho(data.userId)
    return this.db.$transaction(async tx => {
      const produto = await tx.produto.findUniqueOrThrow({
        where: { id: data.item.produtoId },
        select: { precoBase: true, descontoPercentual: true, ativo: true, estoque: true },
      });

      if (!produto.ativo) throw new Error("Produto inativo");
      if (produto.estoque < data.item.quantidade) throw new NotAcceptableException("Estoque insuficiente");

      const precoBase = new Prisma.Decimal(produto.precoBase); // Decimal(10,2)
      const fatorDesc = new Prisma.Decimal(100 - produto.descontoPercentual).div(100);
      const precoUnitSnapshot = precoBase.mul(fatorDesc);
      const subtotal = precoUnitSnapshot.mul(data.item.quantidade);
      await tx.carrinhoItem.upsert({
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
      })
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
      // await tx.produto.update({
      //   where: { id: productId },
      //   data: { estoque: { increment: item.quantidade } },
      // });

      return { sucesso: true };
    });
  }

  async delete(userId: string) {
    return this.db.carrinhoItem.deleteMany({
      where: {
        Carrinho: {
          id: userId
        }
      }
    })
  }
}

