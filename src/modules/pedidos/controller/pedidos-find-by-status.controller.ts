import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PedidosService } from '../pedidos.service';
import { RolesGuard } from 'src/common/roles/roles.guard';
import { Role, Roles } from 'src/common/roles/roles.decorator';
import { PedidoStatus } from '@prisma/client';
import { ObterPorStatusDto } from '../dto/obterPorCLiente.dto';

export type carrinhoItem = Array<{ ID_PRODUTO: string; quantidade: number }>;

@ApiTags('Pedidos')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(Role.VENDEDOR)
@Controller('pedidos')
export class PedidosFindByStatusController {
  constructor(private service: PedidosService) {}

  @Get()
  @ApiQuery({ name: 'status', required: false, enum: PedidoStatus })
  listar(@Request() req, @Query() query?: ObterPorStatusDto) {
    return this.service.listarPorStatusDoVendedor(req.user.sub, query?.status);
  }
}
