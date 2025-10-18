import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma.service';
import { AtualizarClienteDto, CriarClienteDto } from './dto';

@Injectable()
export class ClientesService {
  constructor(private prisma: PrismaService) {}
  criar(dto: CriarClienteDto) {
    return this.prisma.cliente.create({ data: dto as any });
  }
  findMany() {
    return this.prisma.cliente.findMany();
  }
  findUnique(id: string) {
    return this.prisma.cliente.findUnique({ where: { id } });
  }
  update(id: string, dto: AtualizarClienteDto) {
    return this.prisma.cliente.update({ where: { id }, data: dto as any });
  }
  delete(id: string) {
    return this.prisma.cliente.delete({ where: { id } });
  }
}
