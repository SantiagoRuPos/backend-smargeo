// src/database/seeder.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { EstadoTag } from '../../entities/estados.entity';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(private readonly dataSource: DataSource) {}

  async run(): Promise<void> {
    // Permitir apagar seeds por env
    if (process.env.SEED_ENABLE === 'false') {
      this.logger.log('SEED_ENABLE=false → seeding desactivado');
      return;
    }

    await this.seedEstadosTagIfNeeded();
  }

  private async seedEstadosTagIfNeeded(): Promise<void> {
    // ✅ Idempotente: sólo si no hay registros
    const repo = this.dataSource.getRepository(EstadoTag);
    const count = await repo.count();
    if (count > 0) {
      this.logger.log(`EstadosTag: ya existen (${count}), no se generan seeds.`);
      return;
    }

    this.logger.log('EstadosTag: no hay registros. Insertando seeds base…');

    const estados = [
      { Codigo: 'ACTIVO',        Descripcion: 'Tag operativo' },
      { Codigo: 'INACTIVO',      Descripcion: 'Tag deshabilitado/desasociado' },
      { Codigo: 'PERDIDO',       Descripcion: 'Reportado como perdido' },
      { Codigo: 'SIN_BATERIA',   Descripcion: 'Batería agotada' },
      { Codigo: 'FUERA_DE_RANGO',Descripcion: 'Sin señal / cobertura' },
    ];

    // Inserción en bloque con control de errores
    await repo.insert(estados);

    this.logger.log(`EstadosTag: ${estados.length} seeds insertados.`);
  }
}
