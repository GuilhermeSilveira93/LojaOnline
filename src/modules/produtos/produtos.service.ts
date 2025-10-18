import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma.service';
import {
  AplicarDescontoDto,
  AtualizarProdutoDto,
  CriarProdutoDto,
} from './dto';

@Injectable()
export class ProdutosService {
  constructor(private prisma: PrismaService) {}

  create(dto: CriarProdutoDto) {
    return this.prisma.produto.create({ data: dto });
  }
  findMany() {
    return this.prisma.produto.findMany();
  }
  findUnique(id: string) {
    return this.prisma.produto.findUnique({ where: { id } });
  }
  update(id: string, dto: AtualizarProdutoDto) {
    return this.prisma.produto.update({ where: { id }, data: dto });
  }
  delete(id: string) {
    return this.prisma.produto.delete({ where: { id } });
  }
}
