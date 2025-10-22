import {
  Body,
  Controller,
  Param,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  @ApiResponse({
    status: 200,
    example: {
      success: true,
      message: 'status atualizado com sucesso',
      data: {
        id: '529f6221-c4c6-4d40-adc8-1418476179ba',
        clienteId: 'ae6aee72-2596-49ce-898f-2d15911f98fd',
        vendedorId: '564fc420-646a-41d5-bd93-37ce323be7ad',
        status: 'ENTREGUE',
        totalBruto: '30000',
        totalDesconto: '0',
        totalLiquido: '30000',
        createdAt: '2025-10-22T01:18:42.237Z',
        updatedAt: '2025-10-22T01:38:36.443Z',
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
          id: 'ae6aee72-2596-49ce-898f-2d15911f98fd',
          nome: 'Cliente 2',
          email: 'pedinho@softrack.com.br',
          documento: '40618812504',
          telefone: null,
          createdAt: '2025-10-22T01:17:33.071Z',
          updatedAt: '2025-10-22T01:17:33.071Z',
        },
      },
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
      message: 'pedido não encontrado',
      error: 'Not Found',
      statusCode: 404,
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
  @Patch(':idPedido/status')
  async atualizarStatus(
    @Request() req,
    @Param('idPedido') idPedido: string,
    @Body() dto: StatusPedidoDto,
  ) {
    const pedido = await this.service.atualizarStatus(
      req.user.sub,
      idPedido,
      dto.status,
    );
    this.email.NovoStatusPedido(
      pedido.data.Cliente,
      dto.status,
      pedido.data.id,
    );
    return pedido;
  }
}
