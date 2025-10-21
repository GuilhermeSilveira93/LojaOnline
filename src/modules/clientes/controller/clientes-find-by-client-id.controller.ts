import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClientesService } from '../clientes.service';
import { RolesGuard } from 'src/common/roles/roles.guard';
import { Role, Roles } from 'src/common/roles/roles.decorator';

@ApiTags('Clientes')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(Role.ADMIN, Role.VENDEDOR)
@Controller('clientes')
export class ClientesFindByVendorIdController {
  constructor(private service: ClientesService) { }
  @ApiResponse({
    status: 201,
    example: {
      "sucesso": true,
      "message": "Cliente encontrado",
      "data": {
        "id": "20cad1cb-58c8-4804-8e11-5c2f292bd540",
        "nome": "Cliente 2",
        "email": "pedinho@softrack.com.br",
        "documento": "40618812504",
        "telefone": null,
        "createdAt": "2025-10-20T21:55:18.156Z",
        "updatedAt": "2025-10-20T21:55:18.156Z"
      }
    },
  })
  @ApiResponse({
    status: 404,
    example: {
      "message": "cliente não encontrado",
      "error": "Not Found",
      "statusCode": 404
    },
  })
  @Get(':idCliente')
  findUnique(@Param('idCliente') idCliente: string) {
    return this.service.findUnique(idCliente);
  }
}
