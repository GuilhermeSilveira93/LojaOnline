import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma.service';
import { CriarProdutoDto } from './dto/criarProduto.dto';
import { AtualizarProdutoDto } from './dto/AtualizarProduto.dto';


@Injectable()
export class ProdutosService {
  constructor(private db: PrismaService) { }

  create(userId, dto: CriarProdutoDto) {
    try {
      return this.db.$transaction(async (tx) => {
        const produto = await tx.produto.create({
          data: dto
        });
        await tx.produtoVendedor.create({
          data: {
            produtoId: produto.id,
            vendedorId: userId
          },
        });
        return produto;
      });
    } catch (error) {
      let message = error.message
      switch (error.code) {
        case "P2002":
          message = "Produto com este nome já existe"
        default:
          break
      }
      throw new ConflictException(message)
    }
  }
  findMany() {
    return this.db.produto.findMany();
  }
  findUnique(id: string) {
    return this.db.produto.findUnique({ where: { id } });
  }
  update(id: string, dto: AtualizarProdutoDto) {
    return this.db.produto.update({ where: { id }, data: dto });
  }
  delete(id: string) {
    return this.db.produto.delete({ where: { id } });
  }

  updateDescount(idProduto: string, desconto: number) {
    return this.db.produto.update({
      where: {
        id: idProduto
      },
      data: { descontoPercentual: desconto }
    })
  }
}
