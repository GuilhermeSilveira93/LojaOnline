import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PedidosService } from '../pedidos.service';
import { CarrinhoService } from '../../carrinho/carrinho.service';
import { RolesGuard } from 'src/common/roles/roles.guard';
import { Role, Roles } from 'src/common/roles/roles.decorator';
import { CriarPedidoDto } from '../dto/criarPedido.dto';

export type carrinhoItem = Array<{ ID_PRODUTO: string; quantidade: number }>;

@ApiTags('Pedidos')
@ApiBearerAuth()
@Controller('pedidos')
@UseGuards(RolesGuard)
@Roles(Role.VENDEDOR)
export class PedidosCriarController {
  constructor(
    private service: PedidosService,
    private carrinho: CarrinhoService,
  ) {}

  @ApiResponse({
    status: 201,
    example: {
      success: true,
      data: {
        id: 'ccddc255-3e12-4d64-9db0-bb6d3073c3bc',
        clienteId: 'ab96f818-64d3-45fa-beb8-ab4ce9b6ed1d',
        vendedorId: '564fc420-646a-41d5-bd93-37ce323be7ad',
        status: 'CRIADO',
        totalBruto: '30000',
        totalDesconto: '6000',
        totalLiquido: '24000',
        createdAt: '2025-10-22T00:28:09.715Z',
        updatedAt: '2025-10-22T00:28:09.715Z',
        PedidoItem: [
          {
            id: '02bbb7dd-6c06-4aa7-b115-9e1153499988',
            pedidoId: 'ccddc255-3e12-4d64-9db0-bb6d3073c3bc',
            produtoId: '165e7158-8371-4660-bccd-26de430433ee',
            nomeSnapshot: 'Placa de vídeo 5090 TI - FOUNDERS EDITION',
            precoUnitarioSnapshot: '12000',
            quantidade: 2,
            subtotal: '24000',
          },
        ],
        Cliente: {
          id: 'ab96f818-64d3-45fa-beb8-ab4ce9b6ed1d',
          nome: 'Cliente 2',
          email: 'novoemail@gmail.com',
          documento: '40618812504',
          telefone: null,
          createdAt: '2025-10-21T19:43:21.647Z',
          updatedAt: '2025-10-21T19:43:33.147Z',
        },
      },
      message: 'Pedido criado com sucesso',
    },
  })
  @ApiBadRequestResponse({
    example: {
      message: 'Carrinho vazio',
      error: 'Bad Request',
      statusCode: 400,
    },
  })
  @Post()
  async criar(@Request() req, @Body() dto: CriarPedidoDto) {
    const userId = req.user.sub;
    const carrinho = await this.carrinho.findUnique(userId);
    if (!carrinho || carrinho?.data?.length === 0)
      throw new BadRequestException('Carrinho vazio');
    return await this.service.criarAPartirDoCarrinho(
      userId,
      dto.clienteId,
      carrinho?.data,
    );
  }
}
