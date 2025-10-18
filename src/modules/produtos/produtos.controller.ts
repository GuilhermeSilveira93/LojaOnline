import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProdutosService } from './produtos.service';
import {
  AtualizarProdutoDto,
  CriarProdutoDto,
} from './dto';
import { RolesGuard } from 'src/common/roles/roles.guard';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { Role, Roles } from 'src/common/roles/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Produtos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('produtos')
export class ProdutosController {
  constructor(private db: ProdutosService) {}
  @Post()
  create(@Body() dto: CriarProdutoDto) {
    return this.db.create(dto);
  }
  @Get()
  findMany() {
    return this.db.findMany();
  }
  @Get(':id')
  findUnique(@Param('id') id: string) {
    return this.db.findUnique(id);
  }
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: AtualizarProdutoDto) {
    return this.db.update(id, dto);
  }
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.db.delete(id);
  }
}
