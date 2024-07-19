import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3000', 'http://example.com'],
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PATCH', 'OPTION'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Access-Control-Allow-Origin',
    ],
    credentials: true,
  });
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api/blog/v1/');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(cookieParser());

  const port = configService.get('PORT') || 3030;
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(port);

  return app;
}
export default bootstrap();
