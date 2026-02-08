import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.use((req: any, res: any, next: any) => {
    if (req.url.includes('api')) {
      console.log(`<<< [SERVER INCOMING] ${req.method} ${req.url}`);
      console.log('<<< [AUTH HEADER]', req.headers.authorization ? 'EXISTS: ' + req.headers.authorization.substring(0, 15) + '...' : 'MISSING');
      console.log('<<< [ALL HEADERS]', JSON.stringify(req.headers));
    }
    next();
  });

  const config = new DocumentBuilder()
    .setTitle('Backend API')
    .setDescription('The Backend API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT || 3000);
  console.log('--- BACKEND BOOTSTRAP CHECK ---');
  console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
  console.log('JWT_EXPIRES:', process.env.JWT_EXPIRES);
  console.log('--- APPLICATION RUNNING ON PORT 3000 ---');
}
bootstrap();
