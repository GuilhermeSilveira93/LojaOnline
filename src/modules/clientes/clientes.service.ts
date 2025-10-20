import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma.service';
import { CriarClienteDto } from './dto/criarCliente.dto';
import { AtualizarClienteDto } from './dto/atualizarCliente.dto';
import { tryCatch } from 'src/common/patterns/try-catch';

@Injectable()
export class ClientesService {
  constructor(private db: PrismaService) { }
  async criar(dto: CriarClienteDto) {
    const [cliente, error] = await tryCatch(this.db.cliente.create({ data: dto as any }))
    if (error) throw new BadRequestException('Erro ao criar cliente');
    return { sucesso: true, message: 'Cliente criado com sucesso', data: cliente };
  }
  async findMany() {
    const [clientes, error] = await tryCatch(this.db.cliente.findMany())
    if (error) throw new NotFoundException('nenhum cliente encontrado');
    return { sucesso: true, message: 'Clientes encontrados', data: clientes };
  }
  async findUnique(id: string) {
    const [cliente, error] = await tryCatch(this.db.cliente.findUnique({ where: { id } }))
    if (error) throw new NotFoundException('cliente não encontrado');
    return { sucesso: true, message: 'Cliente encontrado', data: cliente };
  }
  async update(id: string, dto: AtualizarClienteDto) {
    const [cliente, error] = await tryCatch(this.db.cliente.update({ where: { id }, data: dto as any }))
    if (error) throw new BadRequestException('Não foi possivel atualizar o cliente');
    return { sucesso: true, message: 'Cliente atualizado', data: cliente };
  }
  async delete(id: string) {
    const [cliente, error] = await tryCatch(this.db.cliente.delete({ where: { id } }))
    if (error) throw new BadRequestException('Não foi possivel deletar o cliente');
    return { sucesso: true, message: 'Cliente deletado', data: cliente };
  }
}
