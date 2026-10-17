import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';
import helmet from 'helmet';
import cookieParser from 'cookie-parser'; // <--- IMPORT DEFAULT CORRIGIDO

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Segurança
  app.use(helmet());
  app.use(cookieParser()); 


  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true, 
  });

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // 3. Swagger
  const config = new DocumentBuilder()
    .setTitle('Matola Turismo API')
    .setDescription('Plataforma Digital de Turismo da Matola')
    .setVersion('1.0')
    .addBearerAuth() 
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`API a correr em: http://localhost:${port}`);
  console.log(`Swagger: http://localhost:${port}/api/docs`);
}

bootstrap();