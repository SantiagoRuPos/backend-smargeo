// src/database/database.module.ts
import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { DatabaseCreatorService } from './database-creator.service';
import { Implante } from '../entities/implantes.entity';

@Module({})
export class DatabaseModule {
  static async forRootAsync(): Promise<DynamicModule> {
    return {
      module: DatabaseModule,
      imports: [
        ConfigModule,
        TypeOrmModule.forRootAsync({
          inject: [ConfigService],
          useFactory: async (config: ConfigService) => {
            const dbCreator = new DatabaseCreatorService(config);
            await dbCreator.createDatabaseIfNotExists(); // 💥 Crea DB antes de conectar

            return {
              type: 'mysql',
              host: config.get<string>('DB_HOST'),
              port: config.get<number>('DB_PORT'),
              username: config.get<string>('DB_USER'),
              password: config.get<string>('DB_PASS'),
              database: config.get<string>('DB_NAME'),
              entities: [Implante],
              synchronize: true,
            };
          },
        }),
        TypeOrmModule.forFeature([Implante]),
      ],
      providers: [],
      exports: [TypeOrmModule],
    };
  }
}
