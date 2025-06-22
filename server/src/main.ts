import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('api');

  // Use PORT from .env or default to 3001
  const port = process.env.APP_PORT || 3001;
  await app.listen(port);
  console.log(`Application is running on port ${port}`);
}
bootstrap();
