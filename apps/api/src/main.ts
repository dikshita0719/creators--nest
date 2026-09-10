import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { csrfOriginMiddleware } from './auth/csrf-origin.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const webOrigin = process.env.CORS_ORIGIN ?? 'http://localhost:3000';
  if (process.env.NODE_ENV === 'production' && !webOrigin.startsWith('https://')) throw new Error('CORS_ORIGIN must be an HTTPS origin in production');
  app.enableCors({ origin: webOrigin, credentials: true });
  app.use(cookieParser());
  app.use(csrfOriginMiddleware);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const config = new DocumentBuilder().setTitle('Creators Marketplace API').setVersion('0.1.0').addBearerAuth().build();
  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, config));
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
