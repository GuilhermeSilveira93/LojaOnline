import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { ProdutosService } from '../produtos.service';
import { RolesGuard } from 'src/common/roles/roles.guard';
import { Role, Roles } from 'src/common/roles/roles.decorator';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AtualizarDescontoDto } from '../dto/atualizarDesconto.dto';
@ApiTags('Produtos')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(Role.ADMIN)
@Controller('produtos')
export class ProdutosAtualizarDescontoController {
  constructor(private service: ProdutosService) {}
  @ApiResponse({
    status: 201,
    example: {
      success: true,
      data: {
        id: '165e7158-8371-4660-bccd-26de430433ee',
        nome: 'Placa de vídeo 5090 TI - FOUNDERS EDITION',
        descricao: null,
        precoBase: '15000',
        descontoPercentual: 20,
        estoque: 240,
        ativo: true,
        createdAt: '2025-10-20T21:50:37.306Z',
        updatedAt: '2025-10-21T18:37:46.448Z',
      },
      message: 'Desconto atualizado no produto!',
    },
  })
  @ApiResponse({
    status: 400,
    example: {
      message: [
        'desconto must not be less than 0',
        'desconto must not be greater than 100',
      ],
      error: 'Bad Request',
      statusCode: 400,
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
  @ApiResponse({
    status: 403,
    example: {
      message: 'Acesso Negado',
      error: 'Forbidden',
      statusCode: 403,
    },
  })
  @Patch('desconto/:idProduto')
  atualizarDesconto(
    @Body() data: AtualizarDescontoDto,
    @Param('idProduto') idProduto: string,
  ) {
    return this.service.updateDescount(idProduto, data.desconto);
  }
}
