import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger/swagger.config';
import cookieParser from 'cookie-parser';
import { corsOptions } from './config/cors/cors.config';
import { ExceptionHandler } from './common/exception/exception.handler';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(corsOptions);
  app.useGlobalFilters(new ExceptionHandler());
  setupSwagger(app);
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
