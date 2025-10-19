import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClientesService } from './clientes.service';
import { CriarClienteDto } from './dto/criarCliente.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { RolesGuard } from 'src/common/roles/roles.guard';
import { Role, Roles } from 'src/common/roles/roles.decorator';
import { AtualizarClienteDto } from './dto/atualizarCliente.dto';

@ApiTags('Clientes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.VENDEDOR)
@Controller('clientes')
export class ClientesController {
  constructor(private service: ClientesService) { }

  @Post()
  criar(@Body() dto: CriarClienteDto) {
    return this.service.criar(dto);
  }
  @Get()
  listfindManyar() {
    return this.service.findMany();
  }
  @Get(':id')
  findUnique(@Param('id') id: string) {
    return this.service.findUnique(id);
  }
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: AtualizarClienteDto) {
    return this.service.update(id, dto);
  }
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
