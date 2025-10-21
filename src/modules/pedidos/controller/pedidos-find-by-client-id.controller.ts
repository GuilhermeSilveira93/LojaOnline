import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PedidosService } from '../pedidos.service';
import { RolesGuard } from 'src/common/roles/roles.guard';
import { Role, Roles } from 'src/common/roles/roles.decorator';

export type carrinhoItem = Array<{ ID_PRODUTO: string; quantidade: number }>;

@ApiTags('Pedidos')
@ApiBearerAuth()
@Controller('pedidos')
@UseGuards(RolesGuard)
@Roles(Role.VENDEDOR)
export class PedidosFindByClientIdController {
  constructor(private service: PedidosService) {}
  @Get(':idCliente')
  async findByClientId(@Request() req, @Param('idCliente') idCliente: string) {
    return this.service.findByClientId(req.user.sub, idCliente, req.user.role);
  }
}
