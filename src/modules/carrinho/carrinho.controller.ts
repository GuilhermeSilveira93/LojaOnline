import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CarrinhoService } from './carrinho.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { ItemDto } from './dto/includeProduct.dto';

@ApiTags('Carrinho')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('carrinho')
export class CarrinhoController {
  constructor(private service: CarrinhoService) {}

  @Post('adicionar-produto')
  adicionarProduto(@Request() req, @Body() body: ItemDto) {
    return this.service.adicionarProduto({ userId: req.user.sub, item: body });
  }
  @Get()
  findUnique(@Request() req) {
    return this.service.findUnique(req.user.sub);
  }
  @Delete(':produtoId')
  deletarProduto(@Request() req, @Param('produtoId') pid: string) {
    return this.service.deletarProduto(req.user.sub, pid);
  }

  @Delete('deletar')
  deletarCarrinho(@Request() req) {
    return this.service.delete(req.user.sub);
  }
}
