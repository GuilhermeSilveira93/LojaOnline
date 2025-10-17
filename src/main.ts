
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './modules/app.module';
import { ValidationPipe } from '@nestjs/common';
import { EnvService } from './common/Env/env.service';
const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { cors: { methods } }
  );
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const envService = app.get(EnvService)
  const port = envService.get('PORT') ?? 9999
  console.log(port)
  await app
    .listen(port, '0.0.0.0')
    .then(() => console.log(`App rodando na porta ${port}`))
}
bootstrap();
