import { NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import {
  VersioningType,
  ValidationPipe,
  ClassSerializerInterceptor,
} from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Enable validation pipe
  // whitelist removes any property of query that is not part of DTO
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  // Enable class serializer interceptor (used for serialization and deserialization of objects)
  // This will automatically transform the response objects to the DTOs (making sure to use exclude)
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Nest API')
    .setVersion('1.0')
    .addOAuth2({
      type: 'oauth2',
      flows: {
        password: {
          tokenUrl: 'http://localhost:8080/docs/login',
          scopes: {},
        },
      },
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      initOAuth: {
        clientSecret: process.env.JWT_SECRET,
        appName: 'Nest API',
      },
    },
  });

  const PORT = process.env.PORT;
  await app.listen(PORT);

  // log api docs
  console.log(`Application is running on: http://localhost:${PORT}/`);
  console.log(`Swagger is running on: http://localhost:${PORT}/api`);
}
bootstrap();
