import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Param,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { RolesGuard } from 'src/common/roles/roles.guard';
import { Role, Roles } from 'src/common/roles/roles.decorator';
import { ResetSenhaDto } from './dto/resetSenha.dto';
import { CreateDto } from './dto/createUser.dto';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

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

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.senha);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  async changePassword(@Request() req, @Body() body: ResetSenhaDto) {
    return this.auth.changePassword(req.user.sub, body.novaSenha);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('change-password/:userId')
  async adminChangePassword(
    @Param('userId') userId: string,
    @Body() body: ResetSenhaDto,
  ) {
    return this.auth.changePassword(userId, body.novaSenha);
  }
}
