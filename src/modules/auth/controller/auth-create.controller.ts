import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Public, Role, Roles } from 'src/common/roles/roles.decorator';
import { CreateDto } from '../dto/createUser.dto';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthCreateController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post('create')
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    example: {
      id: 'UUID do usuário',
      nome: 'nome',
      email: 'email do usuario',
      senhaHash: 'hash',
      role: Role,
      ativo: true,
      createdAt: '2025-10-19T18:31:40.847Z',
      updatedAt: '2025-10-19T18:31:40.847Z',
    },
  })
  @ApiResponse({
    status: 409,
    example: {
      message: 'Usuário com este email já existe',
      error: 'Conflict',
    },
  })
  async create(@Body() dto: CreateDto) {
    return this.auth.create(dto.email, dto.senha, dto.role);
  }
}
