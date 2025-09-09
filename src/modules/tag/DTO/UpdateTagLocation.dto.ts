// src/tag/dto/update-tag-location.dto.ts
import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateTagLocationDto {
  @IsEmail()
  CorreoUsuarioImplante!: string;

  @IsString()
  TrackableId!: string;

  @IsNumber()
  latitude!: number;

  @IsNumber()
  longitude!: number;

  @IsOptional()
  @IsNumber()
  accuracy?: number;

  @IsOptional()
  @IsNumber()
  battery?: number;

  @IsOptional()
  timestamp?: Date;
}
