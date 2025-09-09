import { Controller, Param } from '@nestjs/common';
import { TagService } from './tag.service';
import { Post } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { CreateTagDto } from './DTO/Create-Tag.dto';
import { Get } from '@nestjs/common';
import { Query } from '@nestjs/common';
import { Headers } from '@nestjs/common';
import { UpdateTagLocationDto } from './DTO/UpdateTagLocation.dto';

@Controller('tag')
export class TagController {
    constructor(private readonly tagService: TagService) {}

    @Post('registrar')
    async registrar(@Body() dto: CreateTagDto) {
      const tag = await this.tagService.executeDemo(dto); // <- método modificado (abajo)
      return {
        message: 'TAG registrado correctamente',
        data: {
          Id: tag!.Id,
          TrackableId: tag!.TrackableId,
          Proveedor: tag!.Proveedor,
          Alias: tag!.Alias,
          Estado: tag!.Estado?.Codigo,
          ImplanteId: tag!.ImplanteId,
          CreatedAt: tag!.CreatedAt,
          // snapshot
          UltimoLat: tag!.UltimoLat,
          UltimoLng: tag!.UltimoLng,
          UltimoAccuracy: tag!.UltimoAccuracy,
          UltimoBateria: tag!.UltimoBateria,
          UltimoTimestamp: tag!.UltimoTimestamp,
        },
      };
    }
  
    @Post(':id/buscar')
    async buscar(
      @Param('id') tagId: string,
      @Body() body: { latitude: number; longitude: number; accuracy?: number; battery?: number },
    ) {
      const result = await this.tagService.updatePhoneSnapshot(tagId, body);
      await new Promise(r => setTimeout(r, 1200));
      return {
        message: 'Se actualizó la última ubicación',
        data: result,
      };
    }
  
    @Get(':id/last-location')
    async last(@Param('id') tagId: string) {
      return { data: await this.tagService.getLastLocation(tagId) };
    }


    @Get('by-correo/:correo/last-locations')
    async lastByCorreo(
      @Param('correo') correo: string,
      @Query('onlyWithCoords') onlyWithCoords?: string,
    ) {
      const items = await this.tagService.getLastLocationsByCorreo(correo, {
        onlyWithCoords: String(onlyWithCoords).toLowerCase() === 'true',
      });
      return { data: items };
    }
  

    @Post('update-location')
    async updateLocation(@Body() dto: UpdateTagLocationDto) {
      return this.tagService.updateLocation(dto);
    }

}
