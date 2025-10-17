import { Body, Controller, Post, UseGuards, Request, ForbiddenException, Param, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { RolesGuard } from 'src/common/roles/roles.guard';
import { Role, Roles } from 'src/common/roles/roles.decorator';
import { ResetSenhaDto } from './dto/resetSebga.dto';
import { CreateDto } from './dto/createUser.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) { }

  @Post('create')
  async createUser(@Body() dto: CreateDto) {
    return this.auth.createUser(dto.email, dto.senha, dto.role);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.senha);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  async changePassword(@Request() req, @Body() body: ResetSenhaDto) {
    return this.auth.changePassword(req.user.userId, body.novaSenha);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('change-password/:userId')
  async adminChangePassword(@Param('userId') userId: string, @Body() body: ResetSenhaDto) {
    return this.auth.adminChangePassword(userId, body.novaSenha);
  }
}
