import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { ValidationPipe } from '@nestjs/common';
import { DatabaseModule } from './config/database/database.module';

async function bootstrap() {
  const app = await NestFactory.create({
    module: AppModule,
    imports: [await DatabaseModule.forRootAsync()], // 💥 AQUÍ SE EJECUTA
  });

  app.enableCors({ origin: '*', methods: ['GET', 'POST'] });
  app.use(helmet());
  app.use(
    rateLimit({
      windowMs: 60_000,
      max: 60,
      message: '⚠ Demasiadas solicitudes, inténtalo más tarde.',
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
