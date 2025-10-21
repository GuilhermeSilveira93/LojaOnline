import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClientesService } from '../clientes.service';
import { RolesGuard } from 'src/common/roles/roles.guard';
import { Role, Roles } from 'src/common/roles/roles.decorator';

@ApiTags('Clientes')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(Role.ADMIN, Role.VENDEDOR)
@Controller('clientes')
export class ClientesFindByVendorIdController {
  constructor(private service: ClientesService) {}
  @Get(':idVendedor')
  findUnique(@Param('idVendedor') idVendedor: string) {
    return this.service.findUnique(idVendedor);
  }
}
