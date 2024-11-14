import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './config/swagger/swagger.config';
import cookieParser from 'cookie-parser';
import { corsOptions } from './config/cors/cors.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(corsOptions);
  app.useGlobalPipes(new ValidationPipe());
  setupSwagger(app);
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
