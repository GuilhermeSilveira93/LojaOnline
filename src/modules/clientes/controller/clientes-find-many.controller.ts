import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClientesService } from '../clientes.service';
import { RolesGuard } from 'src/common/roles/roles.guard';
import { Role, Roles } from 'src/common/roles/roles.decorator';

@ApiTags('Clientes')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(Role.ADMIN, Role.VENDEDOR)
@Controller('clientes')
export class ClientesFindManyController {
  constructor(private service: ClientesService) {}
  @Get()
  findMany() {
    return this.service.findMany();
  }
}
