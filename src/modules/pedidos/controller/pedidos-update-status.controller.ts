import {
  Body,
  Controller,
  Param,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PedidosService } from '../pedidos.service';
import { RolesGuard } from 'src/common/roles/roles.guard';
import { Role, Roles } from 'src/common/roles/roles.decorator';
import { StatusPedidoDto } from '../dto/atualizarStatus.dto';
import { EmailService } from '../../notificacoes/email.service';

export type carrinhoItem = Array<{ ID_PRODUTO: string; quantidade: number }>;

@ApiTags('Pedidos')
@ApiBearerAuth()
@Controller('pedidos')
@UseGuards(RolesGuard)
@Roles(Role.VENDEDOR)
export class PedidosAtualizarStatusController {
  constructor(
    private service: PedidosService,
    private readonly email: EmailService,
  ) {}

  @Patch(':id/status')
  async atualizarStatus(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: StatusPedidoDto,
  ) {
    const pedido = await this.service.atualizarStatus(
      req.user.sub,
      id,
      dto.status,
    );
    this.email.NovoStatusPedido(
      pedido.data.Cliente,
      dto.status,
      pedido.data.id,
    );
  }
}
