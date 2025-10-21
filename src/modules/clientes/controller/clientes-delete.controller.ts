import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClientesService } from '../clientes.service';
import { RolesGuard } from 'src/common/roles/roles.guard';
import { Role, Roles } from 'src/common/roles/roles.decorator';

@ApiTags('Clientes')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(Role.ADMIN, Role.VENDEDOR)
@Controller('clientes')
export class ClientesDeleteController {
  constructor(private service: ClientesService) {}

  @Delete(':idCliente')
  delete(@Param('idCliente') idCliente: string) {
    return this.service.delete(idCliente);
  }
}
