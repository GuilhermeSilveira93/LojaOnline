import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CarrinhoService } from '../carrinho.service';
import { JwtAuthGuard } from '../../auth/jwt/jwt-auth.guard';

@ApiTags('Carrinho')
@ApiBearerAuth()
@Controller('carrinho')
export class CarrinhoGetController {
  constructor(private service: CarrinhoService) {}
  @Get()
  findUnique(@Request() req) {
    return this.service.findUnique(req.user.sub);
  }
}
