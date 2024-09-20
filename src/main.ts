import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './core/filters/http.filter';
import { ValidationPipe } from '@nestjs/common';
import { IpDev, IpProd } from './shares/ipAddress';

async function bootstrap() {
  const ip = process.env.IP === 'prod' ? IpProd : IpDev;

  // console.log(ip);

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api/v1');
  app.enableCors({
    credentials: true,
    origin: [
      // 'http://150.95.30.174:4041',
      'http://localhost:3000',
      'https://studio.apollographql.com',
    ],
  });
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  // console.log(process.env.ENV);

  await app.listen(8081);
}
bootstrap();
