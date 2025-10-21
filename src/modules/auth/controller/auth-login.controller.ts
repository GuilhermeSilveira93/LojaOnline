import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { LoginDto } from '../dto/login.dto';
import { Public } from 'src/common/roles/roles.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthLoginController {
  constructor(private readonly auth: AuthService) {}
  @Public()
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.senha);
  }
}
