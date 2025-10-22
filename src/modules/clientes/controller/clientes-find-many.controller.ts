import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClientesService } from '../clientes.service';
import { RolesGuard } from 'src/common/roles/roles.guard';
import { Role, Roles } from 'src/common/roles/roles.decorator';

@ApiTags('Clientes')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(Role.ADMIN, Role.VENDEDOR)
@Controller('clientes')
export class ClientesFindManyController {
  constructor(private service: ClientesService) {}
  @ApiResponse({
    status: 201,
    example: {
      sucesso: true,
      message: 'Clientes encontrados',
      data: [
        {
          id: 'uuid cliente',
          nome: 'nome',
          email: 'email',
          documento: 'documento',
          telefone: null,
          createdAt: '2025-10-20T21:55:18.156Z',
          updatedAt: '2025-10-20T21:55:18.156Z',
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    example: {
      message: 'cliente não encontrado',
      error: 'Not Found',
      statusCode: 404,
    },
  })
  @Get()
  findMany() {
    return this.service.findMany();
  }
}
