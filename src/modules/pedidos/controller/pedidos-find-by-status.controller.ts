import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  @ApiResponse({
    status: 200,
    example: {
      message: 'Pedidos encontrados.',
      data: [
        {
          id: 'ccddc255-3e12-4d64-9db0-bb6d3073c3bc',
          clienteId: 'ab96f818-64d3-45fa-beb8-ab4ce9b6ed1d',
          vendedorId: '564fc420-646a-41d5-bd93-37ce323be7ad',
          status: 'CRIADO',
          totalBruto: '30000',
          totalDesconto: '6000',
          totalLiquido: '24000',
          createdAt: '2025-10-22T00:28:09.715Z',
          updatedAt: '2025-10-22T00:28:09.715Z',
        },
      ],
      success: true,
    },
  })
  @ApiResponse({
    status: 403,
    example: {
      message: 'Acesso Negado',
      error: 'Forbidden',
      statusCode: 403,
    },
  })
  @ApiResponse({
    status: 400,
    example: {
      message: [
        'status must be one of the following values: CRIADO, EM_PROCESSAMENTO, ENVIADO, ENTREGUE',
      ],
      error: 'Bad Request',
      statusCode: 400,
    },
  })
  @Get()
  @ApiQuery({ name: 'status', required: false, enum: PedidoStatus })
  listar(@Request() req, @Query() query?: ObterPorStatusDto) {
    return this.service.listarPorStatusDoVendedor(req.user.sub, query?.status);
  }
}
