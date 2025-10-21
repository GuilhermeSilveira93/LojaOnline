import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { LoginDto } from '../dto/login.dto';
import { Public } from 'src/common/roles/roles.decorator';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthLoginController {
  constructor(private readonly auth: AuthService) {}
  @Public()
  @ApiResponse({
    status: 201,
    example: {
      message: 'Login realizado com sucesso',
      success: true,
      data: {
        token:
          'ey2984AS8D4AEC8sdf8as7eFC8SADC48A.eyJzdWIiOiJiZGI1M0ZmIiLCJub21lIjoiZ3VpbGhlcm1lLnNpbHZlaXJhQGdtYWlsLmNvbS5iciIsImVtYWlsIjoiZ3VpbGhlcm1lLnNpbHZlaXJhQGdtYWlsLmNvbS5iciIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc2MTA3MTI5MSwiZXhwIjoxNzYxNjc2MDkxfQ.JIXF0wIHbox3gl-ySUn6hBCuCXNuadSSYtLUrBlppjc',
      },
    },
  })
  @ApiResponse({
    status: 401,
    example: {
      message: 'Login ou senha inválidos',
      statusCode: 401,
    },
  })
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.senha);
  }
}
