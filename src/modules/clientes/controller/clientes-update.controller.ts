import { Body, Controller, Param, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClientesService } from '../clientes.service';
import { JwtAuthGuard } from '../../auth/jwt/jwt-auth.guard';
import { RolesGuard } from 'src/common/roles/roles.guard';
import { Role, Roles } from 'src/common/roles/roles.decorator';
import { AtualizarClienteDto } from '../dto/atualizarCliente.dto';

@ApiTags('Clientes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.VENDEDOR)
@Controller('clientes')
export class ClientesUpdateController {
  constructor(private service: ClientesService) {}
  @Put(':idCliente')
  update(
    @Param('idCliente') idCliente: string,
    @Body() dto: AtualizarClienteDto,
  ) {
    return this.service.update(idCliente, dto);
  }
}
