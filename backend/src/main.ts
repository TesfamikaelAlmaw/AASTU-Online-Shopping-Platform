import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,       // remove extra fields
      forbidNonWhitelisted: true, // error if extra fields sent
      transform: true,       // auto convert types
    }),
  );
   app.enableCors({
    origin: ' http://localhost:5173', // React dev server
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 4000);
  app.useGlobalFilters(new HttpExceptionFilter());

}
bootstrap();
