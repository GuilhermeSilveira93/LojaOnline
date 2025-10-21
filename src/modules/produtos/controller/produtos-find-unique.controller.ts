import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ProdutosService } from '../produtos.service';
import { RolesGuard } from 'src/common/roles/roles.guard';
import { JwtAuthGuard } from '../../auth/jwt/jwt-auth.guard';
import { Role, Roles } from 'src/common/roles/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
@ApiTags('Produtos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('produtos')
export class ProdutosFindUniqueController {
  constructor(private service: ProdutosService) {}
  @Get(':id')
  findUnique(@Param('id') id: string) {
    return this.service.findUnique(id);
  }
}
