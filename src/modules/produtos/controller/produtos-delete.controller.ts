import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { ProdutosService } from '../produtos.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/common/roles/roles.guard';
import { Role, Roles } from 'src/common/roles/roles.decorator';
@ApiTags('Produtos')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(Role.ADMIN)
@Controller('produtos')
export class ProdutosDeleteController {
  constructor(private service: ProdutosService) {}
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
