import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ProdutosService } from '../produtos.service';
import { RolesGuard } from 'src/common/roles/roles.guard';
import { Role, Roles } from 'src/common/roles/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CriarProdutoDto } from '../dto/criarProduto.dto';
@ApiTags('Produtos')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(Role.ADMIN)
@Controller('produtos')
export class ProdutosCreateController {
  constructor(private service: ProdutosService) {}
  @Post()
  create(@Body() dto: CriarProdutoDto, @Req() req) {
    return this.service.create(dto);
  }
}
