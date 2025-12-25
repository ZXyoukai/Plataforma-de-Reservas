import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './modules/app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar validação global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Habilitar CORS se necessário
  app.enableCors();

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Plataforma de Reservas API')
    .setDescription(
      'API completa para gerenciamento de reservas de serviços. ' +
      'Permite que clientes encontrem e reservem serviços de provedores, ' +
      'com sistema de créditos e controle de permissões.'
    )
    .setVersion('1.0')
    .addTag('Autenticação', 'Endpoints para login e gerenciamento de autenticação')
    .addTag('Usuários', 'Cadastro e gerenciamento de usuários')
    .addTag('Serviços', 'CRUD de serviços oferecidos por provedores')
    .addTag('Reservas', 'Criação e gerenciamento de reservas')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Insira o token JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Plataforma de Reservas - API Docs',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/api/docs`);
}
bootstrap();
