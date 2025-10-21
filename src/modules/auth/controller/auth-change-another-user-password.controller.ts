import { Body, Controller, UseGuards, Param, Patch } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { RolesGuard } from 'src/common/roles/roles.guard';
import { Role, Roles } from 'src/common/roles/roles.decorator';
import { ResetSenhaDto } from '../dto/resetSenha.dto';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthChangeAnotherUserPasswordController {
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
