// src/app.module.ts
import { Module, DynamicModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { DatabaseCreatorModule } from './config/database/database-creator.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { ImplanteService } from './modules/implante/implante.service';
import { ImplantesModule } from './modules/implante/implante.module';

@Module({
  providers: [AppService, ImplanteService],
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    DatabaseCreatorModule,
    ImplantesModule,
    // DatabaseModule lo importarás desde main.ts
  ],
})
export class AppModule {}
