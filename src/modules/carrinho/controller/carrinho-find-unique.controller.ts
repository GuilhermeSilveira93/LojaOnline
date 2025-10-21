import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CarrinhoService } from '../carrinho.service';
import { JwtAuthGuard } from '../../auth/jwt/jwt-auth.guard';

@ApiTags('Carrinho')
@ApiBearerAuth()
@Controller('carrinho')
export class CarrinhoGetController {
  constructor(private service: CarrinhoService) { }
  @ApiResponse({
    status: 200,
    example: {
      success: true,
      data: [
        {
          id: 'uuid',
          quantidade: 2,
          preco_unitario_snapshot: '12000',
          subtotal: '24000',
          ID_CARRINHO: '564fc420-646a-41d5-bd93-37ce323be7ad',
          ID_PRODUTO: '165e7158-8371-4660-bccd-26de430433ee',
        },
      ],
      message: 'Carrinho encontrado',
    },
  })
  @ApiResponse({
    status: 404,
    example: {
      message: "Carrinho não encontrado.",
      error: "Not Found",
      statusCode: 404
    },
  })
  @Get()
  findUnique(@Request() req) {
    return this.service.findUnique(req.user.sub);
  }
}
