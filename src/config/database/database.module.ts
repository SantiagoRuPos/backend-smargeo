import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { DatabaseCreatorService } from './database-creator.service';
import { Implante } from '../entities/implantes.entity';
import { EstadoTag } from '../entities/estados.entity';
import { ImplanteTag } from '../entities/Tag.entitys';
import { SeederService } from './seed/seeder.service';

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
            await dbCreator.createDatabaseIfNotExists(); // crea DB si no existe

            return {
              type: 'mysql',
              host: config.get<string>('DB_HOST'),
              port: config.get<number>('DB_PORT'),
              username: config.get<string>('DB_USER'),
              password: config.get<string>('DB_PASS'),
              database: config.get<string>('DB_NAME'),
              entities: [Implante, EstadoTag, ImplanteTag],
              synchronize: true, // en prod -> migraciones
              // logging: true,
            };
          },
        }),
        TypeOrmModule.forFeature([Implante, EstadoTag, ImplanteTag]),
      ],
      providers: [
        DatabaseCreatorService,
        SeederService,
        // 👇 Provider "bootstrap" que ejecuta seeds al iniciar
        {
          provide: 'SEEDER_BOOTSTRAP',
          useFactory: async (seeder: SeederService) => {
            await seeder.run();
            return true;
          },
          inject: [SeederService],
        },
      ],
      exports: [TypeOrmModule],
    };
  }
}