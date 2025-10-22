import { Controller, Get, UseGuards } from '@nestjs/common';
import { ProdutosService } from '../produtos.service';
import { RolesGuard } from 'src/common/roles/roles.guard';
import { Role, Roles } from 'src/common/roles/roles.decorator';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('Produtos')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(Role.ADMIN)
@Controller('produtos')
export class ProdutosFindManyController {
  constructor(private service: ProdutosService) {}
  @ApiResponse({
    status: 201,
    example: {
      success: true,
      message: 'Produtos Encontrados',
      data: [
        {
          id: '165e7158-8371-4660-bccd-26de430433ee',
          nome: 'Placa de vídeo 5090 TI - FOUNDERS EDITION',
          descricao: null,
          precoBase: '15000',
          descontoPercentual: 0,
          estoque: 234,
          ativo: true,
          createdAt: '2025-10-20T21:50:37.306Z',
          updatedAt: '2025-10-22T00:53:35.425Z',
        },
      ],
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
  @Get()
  findMany() {
    return this.service.findMany();
  }
}
