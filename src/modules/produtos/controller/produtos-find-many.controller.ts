import { Controller, Get, UseGuards } from '@nestjs/common';
import { ProdutosService } from '../produtos.service';
import { RolesGuard } from 'src/common/roles/roles.guard';
import { Role, Roles } from 'src/common/roles/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
@ApiTags('Produtos')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(Role.ADMIN)
@Controller('produtos')
export class ProdutosFindManyController {
  constructor(private service: ProdutosService) {}
  @Get()
  findMany() {
    return this.service.findMany();
  }
}
