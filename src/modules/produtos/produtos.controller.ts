import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProdutosService } from './produtos.service';
import { RolesGuard } from 'src/common/roles/roles.guard';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { Role, Roles } from 'src/common/roles/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AtualizarDescontoDto } from './dto/atualizarDesconto.dto';
import { CriarProdutoDto } from './dto/criarProduto.dto';
import { AtualizarProdutoDto } from './dto/AtualizarProduto.dto';
@ApiTags('Produtos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('produtos')
export class ProdutosController {
  constructor(private service: ProdutosService) {}
  @Post()
  create(@Body() dto: CriarProdutoDto, @Req() req) {
    return this.service.create(dto);
  }
  @Get()
  findMany() {
    return this.service.findMany();
  }
  @Get(':id')
  findUnique(@Param('id') id: string) {
    return this.service.findUnique(id);
  }
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: AtualizarProdutoDto) {
    return this.service.update(id, dto);
  }
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }

  @Patch('desconto/:idProduto')
  atualizarDesconto(
    @Body() data: AtualizarDescontoDto,
    @Param('idProduto') idProduto: string,
  ) {
    return this.service.updateDescount(idProduto, data.desconto);
  }
}
