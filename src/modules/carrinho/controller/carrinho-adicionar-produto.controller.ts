import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CarrinhoService } from '../carrinho.service';
import { ItemDto } from '../dto/includeProduct.dto';

@ApiTags('Carrinho')
@ApiBearerAuth()
@Controller('carrinho')
export class CarrinhoAdicionarProdutoController {
  constructor(private service: CarrinhoService) {}
  @Post('adicionar-produto')
  adicionarProduto(@Request() req, @Body() body: ItemDto) {
    return this.service.adicionarProduto({ userId: req.user.sub, item: body });
  }
}
