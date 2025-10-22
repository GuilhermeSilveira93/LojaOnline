import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ProdutosService } from '../produtos.service';
import { RolesGuard } from 'src/common/roles/roles.guard';
import { Role, Roles } from 'src/common/roles/roles.decorator';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CriarProdutoDto } from '../dto/criarProduto.dto';
@ApiTags('Produtos')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(Role.ADMIN)
@Controller('produtos')
export class ProdutosCreateController {
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
        descontoPercentual: 0,
        estoque: 500,
        ativo: true,
        createdAt: '2025-10-20T21:50:37.306Z',
        updatedAt: '2025-10-20T21:50:37.306Z',
      },
      message: 'Produto incluido com sucesso!',
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
    status: 409,
    example: {
      message: 'Erro ao criar produto.',
      error: 'Conflict',
      statusCode: 409,
    },
  })
  @Post()
  create(@Body() dto: CriarProdutoDto, @Req() req) {
    return this.service.create(dto);
  }
}
