import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClientesService } from '../clientes.service';
import { CriarClienteDto } from '../dto/criarCliente.dto';
import { RolesGuard } from 'src/common/roles/roles.guard';
import { Role, Roles } from 'src/common/roles/roles.decorator';

@ApiTags('Clientes')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(Role.ADMIN, Role.VENDEDOR)
@Controller('clientes')
export class ClientesCreateController {
  constructor(private service: ClientesService) {}

  @Post()
  create(@Body() dto: CriarClienteDto) {
    return this.service.create(dto);
  }
}
