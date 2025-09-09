// src/<tu-path>/tag.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TagService } from './tag.service';
import { TagController } from './tag.controller';

import { ImplanteTag } from 'src/config/entities/Tag.entitys';
import { Implante } from 'src/config/entities/implantes.entity';
import { EstadoTag } from 'src/config/entities/estados.entity';
import { UpdateTagLocationDto } from './DTO/UpdateTagLocation.dto';

@Module({
  imports: [TypeOrmModule.forFeature([ImplanteTag, Implante, EstadoTag, UpdateTagLocationDto])],
  controllers: [TagController],
  providers: [TagService],
  exports: [TagService],
})
export class TagModule {}
