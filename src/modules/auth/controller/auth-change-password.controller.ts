import { Body, Controller, Request, Patch } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ResetSenhaDto } from '../dto/resetSenha.dto';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthChangePasswordController {
  constructor(private readonly auth: AuthService) {}

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    example: {
      message: 'Senha Alterada com sucesso',
      success: true,
      data: {
        id: 'bdb51aa3-84ae-402a-af87-0fc34fb',
        nome: 'nome',
        email: 'nome@email.com',
        role: 'role do usuario',
      },
    },
  })
  @ApiResponse({
    status: 403,
    example: {
      message: 'Acesso Negado',
      error: 'Forbidden',
      statusCode: 403,
    },
  })
  @Patch('change-password')
  async changePassword(@Request() req, @Body() body: ResetSenhaDto) {
    return this.auth.changePassword(req.user.sub, body.novaSenha);
  }
}
