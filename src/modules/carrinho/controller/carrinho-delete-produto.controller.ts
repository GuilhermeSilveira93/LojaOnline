import { Controller, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CarrinhoService } from '../carrinho.service';
import { JwtAuthGuard } from '../../auth/jwt/jwt-auth.guard';

@ApiTags('Carrinho')
@ApiBearerAuth()
@Controller('carrinho')
export class CarrinhoDeleteProdutoController {
  constructor(private service: CarrinhoService) {}
  @Delete(':produtoId')
  deletarProduto(@Request() req, @Param('produtoId') pid: string) {
    return this.service.deletarProduto(req.user.sub, pid);
  }
}
