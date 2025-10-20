import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PedidosService } from './pedidos.service';
import { CarrinhoService } from '../carrinho/carrinho.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { RolesGuard } from 'src/common/roles/roles.guard';
import { Role, Roles } from 'src/common/roles/roles.decorator';
import { PedidoStatus } from '@prisma/client';
import { StatusPedidoDto } from './dto/atualizarStatus.dto';
import { CriarPedidoDto } from './dto/criarPedido.dto';
import { ObterPorStatusDto } from './dto/obterPorCLiente.dto';
import { EmailService } from '../notificacoes/email.service';

export type carrinhoItem = Array<{ ID_PRODUTO: string; quantidade: number }>;

@ApiTags('Pedidos')
@ApiBearerAuth()
@Controller('pedidos')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.VENDEDOR)
export class PedidosController {
  constructor(
    private service: PedidosService,
    private carrinho: CarrinhoService,
    private readonly email: EmailService,
  ) {}

  @Post()
  async criar(@Request() req, @Body() dto: CriarPedidoDto) {
    const userId = req.user.sub;
    const carrinho = await this.carrinho.findUnique(userId);
    if (!carrinho || carrinho?.CarrinhoItem.length === 0)
      throw new BadRequestException('Carrinho vazio');
    return await this.service.criarAPartirDoCarrinho(
      userId,
      dto.clienteId,
      carrinho.CarrinhoItem,
    );
  }

  @Get()
  @ApiQuery({ name: 'status', required: false, enum: PedidoStatus })
  listar(@Request() req, @Query() query?: ObterPorStatusDto) {
    return this.service.listarPorStatusDoVendedor(req.user.sub, query?.status);
  }

  @Get(':idCliente')
  async obter(@Request() req, @Param('idCliente') idCliente: string) {
    return this.service.obter(req.user.sub, idCliente, req.user.role);
  }

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
    this.email.NovoStatusPedido(pedido.data.Cliente, dto.status);
  }
}
