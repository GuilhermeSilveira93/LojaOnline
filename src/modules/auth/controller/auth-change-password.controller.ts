import {
  Body,
  Controller,
  Request,
  Patch,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ResetSenhaDto } from '../dto/resetSenha.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthChangePasswordController {
  constructor(private readonly auth: AuthService) {}

  @ApiBearerAuth()
  @Patch('change-password')
  async changePassword(@Request() req, @Body() body: ResetSenhaDto) {
    return this.auth.changePassword(req.user.sub, body.novaSenha);
  }
}
