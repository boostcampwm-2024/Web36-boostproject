import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('QLab')
    .setDescription('QLab API 명세서')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/api-docs', app, document, {
    swaggerOptions: {
      defaultModelsExpandDepth: 5,
      defaultModelExpandDepth: 5,
    },
  });
}
