import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClientesService } from '../clientes.service';
import { RolesGuard } from 'src/common/roles/roles.guard';
import { Role, Roles } from 'src/common/roles/roles.decorator';

@ApiTags('Clientes')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(Role.ADMIN, Role.VENDEDOR)
@Controller('clientes')
export class ClientesDeleteController {
  constructor(private service: ClientesService) { }

  @ApiResponse({
    status: 201,
    example: {
      "sucesso": true,
      "message": "Cliente deletado",
      "data": {
        "id": "uuid",
        "nome": "nome do cliente",
        "email": "email do cliente",
        "documento": "document do cliente",
        "telefone": null,
        "createdAt": "2025-10-20T21:55:18.156Z",
        "updatedAt": "2025-10-20T21:55:18.156Z"
      }
    },
  })
  @ApiResponse({
    status: 401,
    example: {
      message: 'Unauthorized',
      statusCode: 401,
    },
  })
  @Delete(':idCliente')
  delete(@Param('idCliente') idCliente: string) {
    return this.service.delete(idCliente);
  }
}
