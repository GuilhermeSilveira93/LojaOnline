import { Controller, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CarrinhoService } from '../carrinho.service';
import { JwtAuthGuard } from '../../auth/jwt/jwt-auth.guard';

@ApiTags('Carrinho')
@ApiBearerAuth()
@Controller('carrinho')
export class CarrinhoDeleteController {
  constructor(private service: CarrinhoService) {}

  @Delete('deletar')
  deletarCarrinho(@Request() req) {
    return this.service.delete(req.user.sub);
  }
}
