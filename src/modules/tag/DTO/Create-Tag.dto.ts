// src/tags/dto/create-tag.dto.ts
import { IsUUID, IsOptional, IsString, IsIn, Length, IsEmail, IsObject, ValidateIf, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateTagDto {
  @Transform(({ value }) => (value === '' || value === null ? undefined : value))
  @IsOptional()
  @IsUUID()
  ImplanteId?: string;

  @ValidateIf((o) => !o.ImplanteId)
  @IsEmail()
  CorreoUsuarioImplante?: string;


  @IsString()
  @Length(1, 191)
  TrackableId!: string;

  @IsIn(['AIRPINPOINT', 'OTRO'])
  @IsOptional()
  Proveedor?: 'AIRPINPOINT' | 'OTRO' = 'AIRPINPOINT';

  @IsString()
  @IsOptional()
  @Length(1, 191)
  Alias?: string;

  // Si no lo mandan, cae en ACTIVO
  @IsString()
  @IsOptional()
  EstadoCodigo?: string;

  @IsObject()
  @IsOptional()
  Metadata?: Record<string, any>;


  @IsNumber() latitude: number;
  @IsNumber() longitude: number;
  @IsOptional() @IsNumber() accuracy?: number;
  @IsOptional() @IsNumber() battery?: number;
}
