import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImplanteController } from './implante.controller';
import { ImplanteService } from './implante.service';
import { Implante } from 'src/config/entities/implantes.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Implante])],
  controllers: [ImplanteController],
  providers: [ImplanteService],
})
export class ImplantesModule {}