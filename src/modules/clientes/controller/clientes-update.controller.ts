import { Body, Controller, Param, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClientesService } from '../clientes.service';
import { JwtAuthGuard } from '../../auth/jwt/jwt-auth.guard';
import { RolesGuard } from 'src/common/roles/roles.guard';
import { Role, Roles } from 'src/common/roles/roles.decorator';
import { AtualizarClienteDto } from '../dto/atualizarCliente.dto';

@ApiTags('Clientes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.VENDEDOR)
@Controller('clientes')
export class ClientesUpdateController {
  constructor(private service: ClientesService) { }
  @ApiResponse({
    status: 201,
    example: {
      "sucesso": true,
      "message": "Cliente atualizado",
      "data": {
        "id": "uuid cliente",
        "nome": "nome",
        "email": "email",
        "documento": "documento",
        "telefone": null,
        "createdAt": "2025-10-20T21:55:18.156Z",
        "updatedAt": "2025-10-20T21:55:18.156Z"
      }
    },
  })
  @ApiResponse({
    status: 404,
    example: {
      "message": "Não foi possivel atualizar o cliente",
      "error": "Not Found",
      "statusCode": 404
    },
  })
  @Put(':idCliente')
  update(
    @Param('idCliente') idCliente: string,
    @Body() dto: AtualizarClienteDto,
  ) {
    return this.service.update(idCliente, dto);
  }
}
