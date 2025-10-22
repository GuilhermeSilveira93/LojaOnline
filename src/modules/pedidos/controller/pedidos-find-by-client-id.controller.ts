import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  @ApiResponse({
    status: 200,
    example: {
      message: 'pedido encontrado',
      data: {
        id: '529f6221-c4c6-4d40-adc8-1418476179ba',
        clienteId: 'ae6aee72-2596-49ce-898f-2d15911f98fd',
        vendedorId: '564fc420-646a-41d5-bd93-37ce323be7ad',
        status: 'CRIADO',
        totalBruto: '30000',
        totalDesconto: '0',
        totalLiquido: '30000',
        createdAt: '2025-10-22T01:18:42.237Z',
        updatedAt: '2025-10-22T01:18:42.237Z',
        PedidoItem: [
          {
            id: '1e1f6b3b-fead-4521-ad38-ebae63670768',
            pedidoId: '529f6221-c4c6-4d40-adc8-1418476179ba',
            produtoId: 'fb969321-fb4b-41da-8806-bba17dd79ff4',
            nomeSnapshot: 'Placa de vídeo 5080 TI - FOUNDERS EDITION',
            precoUnitarioSnapshot: '15000',
            quantidade: 2,
            subtotal: '30000',
          },
        ],
        Cliente: {
          nome: 'Cliente 2',
          email: 'pedinho@softrack.com.br',
        },
      },
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
    status: 404,
    example: {
      message: 'Pedido não encontrado',
      error: 'Not Found',
      statusCode: 404,
    },
  })
  @Get(':idCliente')
  async findByClientId(@Request() req, @Param('idCliente') idCliente: string) {
    return this.service.findByClientId(req.user.sub, idCliente, req.user.role);
  }
}
