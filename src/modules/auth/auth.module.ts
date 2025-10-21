import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt/jwt.strategy';
import { EnvService } from 'src/common/Env/env.service';
import { AuthChangeAnotherUserPasswordController } from './controller/auth-change-another-user-password.controller';
import { AuthChangePasswordController } from './controller/auth-change-password.controller';
import { AuthLoginController } from './controller/auth-login.controller';
import { AuthCreateController } from './controller/auth-create.controller';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [EnvService],
      useFactory: (env: EnvService) => ({
        global: true,
        signOptions: { expiresIn: '7 days', algorithm: 'HS256' },
        secret: env.get('JWT_PRIVATE_KEY'),
      }),
    }),
  ],
  controllers: [
    AuthChangeAnotherUserPasswordController,
    AuthChangePasswordController,
    AuthLoginController,
    AuthCreateController,
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
