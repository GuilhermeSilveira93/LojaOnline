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
import { RolesGuard } from 'src/common/roles/roles.guard';
import { Public, Role, Roles } from 'src/common/roles/roles.decorator';
import { ResetSenhaDto } from './dto/resetSenha.dto';
import { CreateDto } from './dto/createUser.dto';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
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
  @Public()
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.senha);
  }

  @ApiBearerAuth()
  @UseGuards()
  @Patch('change-password')
  async changePassword(@Request() req, @Body() body: ResetSenhaDto) {
    return this.auth.changePassword(req.user.sub, body.novaSenha);
  }

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('change-password/:userId')
  async adminChangePassword(
    @Param('userId') userId: string,
    @Body() body: ResetSenhaDto,
  ) {
    return this.auth.changePassword(userId, body.novaSenha);
  }
}
