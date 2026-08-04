import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const express = app.getHttpAdapter().getInstance();
  express.set('trust proxy', 'loopback');
  
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3456',
    credentials: true,
  });
  app.setGlobalPrefix('api');
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(
    new GlobalExceptionFilter(app.get(HttpAdapterHost)),
  );

  const port = process.env.PORT || 3001;
  const host = process.env.NODE_ENV === 'production' ? '127.0.0.1' : '0.0.0.0';
  await app.listen(port, host);
  console.log(`Application is running on: http://localhost:${port}/api`);
}

bootstrap();
