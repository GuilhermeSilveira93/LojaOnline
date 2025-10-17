import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import PrismaModule from 'src/shared/prisma.module';
import EnvModule from 'src/common/Env/env.module';

@Module({
  imports: [
    EnvModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule
  ],
})
export class AppModule { }
