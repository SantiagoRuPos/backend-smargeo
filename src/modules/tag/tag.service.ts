import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';
import { ImplanteTag } from 'src/config/entities/Tag.entitys';
import { Implante } from 'src/config/entities/implantes.entity';
import { EstadoTag } from 'src/config/entities/estados.entity';
import { DataSource } from 'typeorm';
import { CreateTagDto } from './DTO/Create-Tag.dto';
import { NotFoundException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { ConflictException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { In } from 'typeorm';
import { UpdateTagLocationDto } from './DTO/UpdateTagLocation.dto';



export interface DemoUbicacion {
    trackableId: string;
    latitude: number;
    longitude: number;
    accuracy: number | null;
    batteryLevel: number | null;
    timestamp: string | null;
  }
  
  interface AirpinpointLocation {
    id: string;
    trackableId: string;
    name?: string;
    latitude: number;
    longitude: number;
    timestamp: string;
    horizontalAccuracy?: number;
    batteryLevel?: number;
    isInaccurate?: boolean;
  }
  
@Injectable()
export class TagService {
    constructor(

        @InjectRepository(ImplanteTag) private readonly tagRepo: Repository<ImplanteTag>,
        @InjectRepository(Implante) private readonly implanteRepo: Repository<Implante>,
        @InjectRepository(EstadoTag) private readonly estadoRepo: Repository<EstadoTag>,
        @InjectRepository(UpdateTagLocationDto) private readonly UpdateTagLocationDto: Repository<UpdateTagLocationDto>,

        private readonly dataSource: DataSource,
    ) { }


    async executeDemo(dto: CreateTagDto) {
      // 1) Resolver implante (Id o correo)
      const implante = await this.resolveImplante(dto);
      if (!implante) throw new NotFoundException(
        dto.CorreoUsuarioImplante
          ? `No se encontró implante con el correo ${dto.CorreoUsuarioImplante}`
          : 'Implante no encontrado'
      );
    
      // 2) Resolver estado
      const codigo = (dto.EstadoCodigo ?? 'ACTIVO').toUpperCase();
      const estado = await this.estadoRepo.findOne({ where: { Codigo: codigo } });
      if (!estado) throw new BadRequestException(`Estado "${codigo}" no existe`);
    
      // 2.1) Validar coords
      if (dto.latitude == null || dto.longitude == null) {
        throw new BadRequestException('Se requiere latitude y longitude para registrar en modo demo');
      }
    
      // 3) Crear TAG en transacción
      return this.dataSource.transaction(async (manager) => {
        const tagRepoTx = manager.getRepository(ImplanteTag);
    
        const duplicated = await tagRepoTx.findOne({ where: { TrackableId: dto.TrackableId } });
        if (duplicated) throw new ConflictException('TrackableId ya registrado');
    
        const entity = tagRepoTx.create({
          ImplanteId: implante.Id, // ← se resuelve con el correo
          TrackableId: dto.TrackableId,
          Proveedor: dto.Proveedor ?? 'OTRO',
          Alias: dto.Alias ?? null,
          EstadoId: estado.Id,
          Metadata: { ...(dto.Metadata ?? {}), demo: true, source: 'phone@register' },
    
          UltimoLat: dto.latitude,
          UltimoLng: dto.longitude,
          UltimoAccuracy: dto.accuracy ?? null,
          UltimoBateria: dto.battery ?? null,
          UltimoTimestamp: new Date(),
        });
    
        const saved = await tagRepoTx.save(entity).catch((e) => {
          if (e?.code === 'ER_DUP_ENTRY' || e?.errno === 1062) {
            throw new ConflictException('TrackableId ya registrado');
          }
          throw e;
        });
    
        return manager.getRepository(ImplanteTag).findOne({
          where: { Id: saved.Id },
          relations: ['Implante', 'Estado'],
        });
      });
    }
    
    // === NUEVO: actualizar snapshot con ubicación del teléfono (al “buscar”) ===
    async updatePhoneSnapshot(tagId: string, body: { latitude: number; longitude: number; accuracy?: number; battery?: number }) {
      const tag = await this.tagRepo.findOne({ where: { Id: tagId } });
      if (!tag) throw new NotFoundException('Tag no encontrado');
  
      if (body.latitude == null || body.longitude == null) {
        throw new BadRequestException('latitude y longitude son requeridos');
      }
  
      tag.UltimoLat = body.latitude;
      tag.UltimoLng = body.longitude;
      tag.UltimoAccuracy = body.accuracy ?? null;
      tag.UltimoBateria = body.battery ?? null;
      tag.UltimoTimestamp = new Date();
      tag.Metadata = { ...(tag.Metadata || {}), demo: true, source: 'phone@search' };
  
      await this.tagRepo.save(tag);
  
      return {
        TagId: tag.Id,
        TrackableId: tag.TrackableId,
        Alias: tag.Alias,
        latitude: tag.UltimoLat,
        longitude: tag.UltimoLng,
        accuracy: tag.UltimoAccuracy,
        battery: tag.UltimoBateria,
        timestamp: tag.UltimoTimestamp,
      };
    }
  
 
  
    // === sin cambios (tu helper original) ===
    private async resolveImplante(dto: CreateTagDto): Promise<Implante | null> {
      if (dto.ImplanteId) {
        return this.implanteRepo.findOne({ where: { Id: dto.ImplanteId } });
      }
      if (dto.CorreoUsuarioImplante) {
        const lista = await this.implanteRepo.find({ where: { Correo: dto.CorreoUsuarioImplante } });
        if (lista.length === 0) throw new NotFoundException('No se encontró implante con ese correo');
        if (lista.length > 1) {
          throw new BadRequestException('El correo está asociado a múltiples implantes. Especifique ImplanteId.');
        }
        return lista[0];
      }
      throw new BadRequestException('Debe enviar ImplanteId o CorreoUsuarioImplante');
    }

  // Tu método actual (queda igual)
  async getLastLocation(tagId: string) {
    const tag = await this.tagRepo.findOne({ where: { Id: tagId } });
    if (!tag) throw new NotFoundException('Tag no encontrado');

    return {
      TagId: tag.Id,
      TrackableId: tag.TrackableId,
      Alias: tag.Alias,
      latitude: tag.UltimoLat,
      longitude: tag.UltimoLng,
      accuracy: tag.UltimoAccuracy,
      battery: tag.UltimoBateria,
      timestamp: tag.UltimoTimestamp,
      provider: tag.Proveedor,
      source: tag.Metadata?.source,
    };
  }

  // NUEVO: todas las últimas ubicaciones por correo
  async getLastLocationsByCorreo(
    correo: string,
    opts?: { onlyWithCoords?: boolean }
  ) {
    if (!correo) throw new BadRequestException('Correo requerido');

    const implantes = await this.implanteRepo.find({ where: { Correo: correo } });
    if (implantes.length === 0) {
      throw new NotFoundException(`No se encontraron implantes con el correo ${correo}`);
    }

    const implanteIds = implantes.map(i => i.Id);
    const tags = await this.tagRepo.find({
      where: { ImplanteId: In(implanteIds) },
      order: { UpdatedAt: 'DESC' },
    });

    let items = tags.map(t => ({
      TagId: t.Id,
      TrackableId: t.TrackableId,
      Alias: t.Alias,
      ImplanteId: t.ImplanteId,
      latitude: t.UltimoLat,
      longitude: t.UltimoLng,
      accuracy: t.UltimoAccuracy,
      battery: t.UltimoBateria,
      timestamp: t.UltimoTimestamp,
      provider: t.Proveedor,
      source: t.Metadata?.source,
    }));

    if (opts?.onlyWithCoords) {
      items = items.filter(x => x.latitude != null && x.longitude != null);
    }

    return {
      correo,
      countImplantes: implantes.length,
      countTags: items.length,
      items,
    };
  }

    async getLastLocationsGeoJSONByCorreo(correo: string) {
      const result = await this.getLastLocationsByCorreo(correo, { onlyWithCoords: true });
      return {
        type: 'FeatureCollection',
        features: result.items.map(i => ({
          type: 'Feature',
          properties: {
            tagId: i.TagId,
            trackableId: i.TrackableId,
            alias: i.Alias,
            accuracy: i.accuracy,
            battery: i.battery,
            timestamp: i.timestamp,
            provider: i.provider,
            source: i.source,
          },
          geometry: {
            type: 'Point',
            coordinates: [i.longitude, i.latitude],
          },
        })),
        meta: {
          correo: result.correo,
          countImplantes: result.countImplantes,
          countTags: result.countTags,
        },
      };
    }




    async updateLocation(dto: UpdateTagLocationDto) {
      if (!dto.latitude || !dto.longitude) {
        throw new BadRequestException('latitude y longitude son requeridos');
      }
  
      // 1) Resolver implante por correo
      const implante = await this.implanteRepo.findOne({
        where: { Correo: dto.CorreoUsuarioImplante },
      });
      if (!implante) {
        throw new NotFoundException(
          `No se encontró implante con el correo ${dto.CorreoUsuarioImplante}`,
        );
      }
  
      // 2) Buscar el TAG asociado a ese implante y con ese TrackableId
      const tag = await this.tagRepo.findOne({
        where: { ImplanteId: implante.Id, TrackableId: dto.TrackableId },
      });
      if (!tag) {
        throw new NotFoundException(
          `No se encontró TAG con TrackableId ${dto.TrackableId} para el implante de ${dto.CorreoUsuarioImplante}`,
        );
      }
  
      // 3) Actualizar solo ubicación
      tag.UltimoLat = dto.latitude;
      tag.UltimoLng = dto.longitude;
      tag.UltimoAccuracy = dto.accuracy ?? tag.UltimoAccuracy ?? null;
      tag.UltimoBateria = dto.battery ?? tag.UltimoBateria ?? null;
      tag.UltimoTimestamp = dto.timestamp ? new Date(dto.timestamp) : new Date();
  
      await this.tagRepo.save(tag);
  
      return {
        CorreoUsuarioImplante: dto.CorreoUsuarioImplante,
        TrackableId: tag.TrackableId,
        UltimoLat: tag.UltimoLat,
        UltimoLng: tag.UltimoLng,
        UltimoAccuracy: tag.UltimoAccuracy,
        UltimoBateria: tag.UltimoBateria,
        UltimoTimestamp: tag.UltimoTimestamp,
      };
    }

    
    }