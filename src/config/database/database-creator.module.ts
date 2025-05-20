// database-creator.module.ts
import { Module } from '@nestjs/common';
import { DatabaseCreatorService } from './database-creator.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [DatabaseCreatorService],
  exports: [DatabaseCreatorService],
})
export class DatabaseCreatorModule {}
