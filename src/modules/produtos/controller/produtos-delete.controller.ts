import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { ProdutosService } from '../produtos.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/common/roles/roles.guard';
import { Role, Roles } from 'src/common/roles/roles.decorator';
@ApiTags('Produtos')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(Role.ADMIN)
@Controller('produtos')
export class ProdutosDeleteController {
  constructor(private service: ProdutosService) {}
  @ApiResponse({
    status: 201,
    example: {
      success: true,
      data: {
        id: 'ae7162b9-a3bc-40bf-bb1e-e00d14351031',
        nome: 'Placa de vídeo 5080 TI - FOUNDERS EDITION',
        descricao: null,
        precoBase: '15000',
        descontoPercentual: 0,
        estoque: 500,
        ativo: true,
        createdAt: '2025-10-22T00:59:50.200Z',
        updatedAt: '2025-10-22T00:59:50.200Z',
      },
      message: 'Produto deletado!',
    },
  })
  @ApiResponse({
    status: 403,
    example: {
      message: 'Acesso Negado',
      error: 'Forbidden',
      statusCode: 403,
    },
  })
  @ApiResponse({
    status: 404,
    example: {
      message: 'Produto não encontrado.',
      error: 'Not Found',
      statusCode: 404,
    },
  })
  @Delete(':idProduto')
  delete(@Param('idProduto') idProduto: string) {
    console.log('Delete chamado para idProduto:', idProduto);
    return this.service.delete(idProduto);
  }
}
