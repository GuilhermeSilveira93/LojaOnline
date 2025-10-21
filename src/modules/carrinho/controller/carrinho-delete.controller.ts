import { Controller, Delete, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CarrinhoService } from '../carrinho.service';

@ApiTags('Carrinho')
@ApiBearerAuth()
@Controller('carrinho')
export class CarrinhoDeleteController {
  constructor(private service: CarrinhoService) {}

  @ApiResponse({
    status: 200,
    example: {
      sucesso: true,
      message: 'Carrinho deletado com sucesso',
    },
  })
  @ApiResponse({
    status: 401,
    example: {
      message: 'Unauthorized',
      statusCode: 401,
    },
  })
  @Delete('deletar')
  deletarCarrinho(@Request() req) {
    return this.service.delete(req.user.sub);
  }
}
