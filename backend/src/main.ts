import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { createLogger } from 'src/logger/logger.factory';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.setGlobalPrefix('api/afisha');
  app.enableCors();
  const configService = app.get(ConfigService);
  app.useLogger(createLogger(configService));
  await app.listen(3000);
}
bootstrap();