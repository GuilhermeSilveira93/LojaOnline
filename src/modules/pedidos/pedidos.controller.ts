import { BadRequestException, Body, Controller, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PedidosService } from './pedidos.service';
import { CarrinhoService } from '../carrinho/carrinho.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { RolesGuard } from 'src/common/roles/roles.guard';
import { Role, Roles } from 'src/common/roles/roles.decorator';
import { CriarPedidoDto } from './dto/criarProduto.dto';
import { PedidoStatus } from '@prisma/client';
import { StatusPedidoDto } from './dto/atualizarStatus.dto';

export type carrinhoItem = Array<{ ID_PRODUTO: string; quantidade: number; }>

@ApiTags('Pedidos')
@ApiBearerAuth()
@Controller('pedidos')
export class PedidosController {
  constructor(private service: PedidosService, private carrinho: CarrinhoService) { }

  @Post()
  async criar(@Request() req, @Body() dto: CriarPedidoDto) {
    const userId = req.user.sub
    const carrinho = await this.carrinho.findUnique(userId);
    if (!carrinho?.CarrinhoItem || carrinho?.CarrinhoItem.length === 0) throw new BadRequestException('Carrinho vazio')
    return await this.service.criarAPartirDoCarrinho(req.user.userId, dto.clienteId, carrinho.CarrinhoItem);
  }

  @Get()
  @ApiQuery({ name: 'status', required: false, enum: PedidoStatus })
  listar(@Request() req, @Query() query?: StatusPedidoDto) {
    return this.service.listarPorStatusDoVendedor(req.user.sub, query?.status);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VENDEDOR)
  @Get(':id')
  async obter(@Request() req, @Param('id') id: string) {
    return this.service.obter(req.user.sub, id, req.user.role);
  }

  @Patch(':id/status')
  atualizarStatus(@Request() req, @Param('id') id: string, @Body() dto: StatusPedidoDto) {
    return this.service.atualizarStatus(req.user.sub, id, dto.status);
  }
}
