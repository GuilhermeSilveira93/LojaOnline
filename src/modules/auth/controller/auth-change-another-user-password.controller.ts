import {
  Body,
  Controller,
  UseGuards,
  Param,
  Patch,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { RolesGuard } from 'src/common/roles/roles.guard';
import { Role, Roles } from 'src/common/roles/roles.decorator';
import { ResetSenhaDto } from '../dto/resetSenha.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthChangeAnotherUserPasswordController {
  constructor(private readonly auth: AuthService) {}
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
