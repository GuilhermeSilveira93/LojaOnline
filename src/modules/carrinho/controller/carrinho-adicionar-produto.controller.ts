import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CarrinhoService } from '../carrinho.service';
import { ItemDto } from '../dto/includeProduct.dto';

@ApiTags('Carrinho')
@ApiBearerAuth()
@Controller('carrinho')
export class CarrinhoAdicionarProdutoController {
  constructor(private service: CarrinhoService) {}
  @ApiResponse({
    status: 201,
    example: {
      sucesso: true,
      data: {
        id: 'uuid-do-item',
        quantidade: 2,
        preco_unitario_snapshot: 29.99,
        subtotal: 59.98,
        ID_CARRINHO: 'uuid-do-carrinho',
        ID_PRODUTO: 'uuid-do-produto',
      },
      message: 'Produto adicionado ao carrinho com sucesso',
    },
  })
  @ApiResponse({
    status: 401,
    example: {
      message: 'Unauthorized',
      statusCode: 401,
    },
  })
  @ApiResponse({
    status: 406,
    example: {
      message: 'Estoque insuficiente',
      error: 'Not Acceptable',
      statusCode: 406,
    },
  })
  @Post('adicionar-produto')
  adicionarProduto(@Request() req, @Body() body: ItemDto) {
    return this.service.adicionarProduto({ userId: req.user.sub, item: body });
  }
}
