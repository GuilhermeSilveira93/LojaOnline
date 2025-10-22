import { Controller, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CarrinhoService } from '../carrinho.service';

@ApiTags('Carrinho')
@ApiBearerAuth()
@Controller('carrinho')
export class CarrinhoDeleteProdutoController {
  constructor(private service: CarrinhoService) {}
  @ApiResponse({
    status: 200,
    example: {
      sucesso: true,
      message: 'Produto removido do carrinho',
    },
  })
  @ApiResponse({
    status: 404,
    example: {
      message: 'Item do carrinho não encontrado.',
      error: 'Not Found',
      statusCode: 404,
    },
  })
  @Delete(':produtoId')
  deletarProduto(@Request() req, @Param('produtoId') pid: string) {
    return this.service.deletarProduto(req.user.sub, pid);
  }
}
