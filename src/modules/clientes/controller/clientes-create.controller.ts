import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClientesService } from '../clientes.service';
import { CriarClienteDto } from '../dto/criarCliente.dto';
import { RolesGuard } from 'src/common/roles/roles.guard';
import { Role, Roles } from 'src/common/roles/roles.decorator';

@ApiTags('Clientes')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(Role.ADMIN, Role.VENDEDOR)
@Controller('clientes')
export class ClientesCreateController {
  constructor(private service: ClientesService) {}

  @ApiResponse({
    status: 201,
    example: {
      sucesso: true,
      message: 'Cliente criado com sucesso',
      data: {
        id: 'uuid',
        nome: 'nome do cliente',
        email: 'email do cliente',
        documento: 'document do cliente',
        telefone: null,
        createdAt: '2025-10-20T21:55:18.156Z',
        updatedAt: '2025-10-20T21:55:18.156Z',
      },
    },
  })
  @ApiResponse({
    status: 401,
    example: {
      message: 'Unauthorized',
      statusCode: 401,
    },
  })
  @Post()
  create(@Body() dto: CriarClienteDto) {
    return this.service.create(dto);
  }
}
