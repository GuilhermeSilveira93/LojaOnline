import { Body, Controller, Param, Put, UseGuards } from '@nestjs/common';
import { ProdutosService } from '../produtos.service';
import { RolesGuard } from 'src/common/roles/roles.guard';
import { Role, Roles } from 'src/common/roles/roles.decorator';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AtualizarProdutoDto } from '../dto/AtualizarProduto.dto';
@ApiTags('Produtos')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(Role.ADMIN)
@Controller('produtos')
export class ProdutosUpdateController {
  constructor(private service: ProdutosService) {}
  @ApiResponse({
    status: 200,
    example: {
      success: true,
      data: {
        id: 'fb969321-fb4b-41da-8806-bba17dd79ff4',
        nome: 'Placa de vídeo 5080 TI - FOUNDERS EDITION',
        descricao: null,
        precoBase: '15000',
        descontoPercentual: 0,
        estoque: 500,
        ativo: true,
        createdAt: '2025-10-22T01:11:37.540Z',
        updatedAt: '2025-10-22T01:11:37.540Z',
      },
      message: 'Produto atualizado!',
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
  @Put(':idProduto')
  update(@Param('idProduto') idProduto: string, @Body() dto: AtualizarProdutoDto) {
    return this.service.update(idProduto, dto);
  }
}
