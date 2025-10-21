import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { ProdutosService } from '../produtos.service';
import { RolesGuard } from 'src/common/roles/roles.guard';
import { Role, Roles } from 'src/common/roles/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AtualizarDescontoDto } from '../dto/atualizarDesconto.dto';
@ApiTags('Produtos')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(Role.ADMIN)
@Controller('produtos')
export class ProdutosAtualizarDescontoController {
  constructor(private service: ProdutosService) {}
  @Patch('desconto/:idProduto')
  atualizarDesconto(
    @Body() data: AtualizarDescontoDto,
    @Param('idProduto') idProduto: string,
  ) {
    return this.service.updateDescount(idProduto, data.desconto);
  }
}
