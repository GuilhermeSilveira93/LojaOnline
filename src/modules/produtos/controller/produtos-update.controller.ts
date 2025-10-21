import { Body, Controller, Param, Put, UseGuards } from '@nestjs/common';
import { ProdutosService } from '../produtos.service';
import { RolesGuard } from 'src/common/roles/roles.guard';
import { JwtAuthGuard } from '../../auth/jwt/jwt-auth.guard';
import { Role, Roles } from 'src/common/roles/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AtualizarProdutoDto } from '../dto/AtualizarProduto.dto';
@ApiTags('Produtos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('produtos')
export class ProdutosUpdateController {
  constructor(private service: ProdutosService) {}
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: AtualizarProdutoDto) {
    return this.service.update(id, dto);
  }
}
