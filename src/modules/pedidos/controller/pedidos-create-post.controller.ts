import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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

  @Post()
  async criar(@Request() req, @Body() dto: CriarPedidoDto) {
    const userId = req.user.sub;
    const carrinho = await this.carrinho.findUnique(userId);
    if (!carrinho || carrinho?.data?.CarrinhoItem.length === 0)
      throw new BadRequestException('Carrinho vazio');
    return await this.service.criarAPartirDoCarrinho(
      userId,
      dto.clienteId,
      carrinho?.data?.CarrinhoItem!,
    );
  }
}
