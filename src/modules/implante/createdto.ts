import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsBoolean,
  IsOptional,
  IsDateString,
  IsNumber,
} from 'class-validator';

export class RegisterImplanteDto  {
  @IsString()
  @IsNotEmpty()
  Nombres: string;

  @IsString()
  @IsNotEmpty()
  Apellidos: string;

  @IsString()
  @IsNotEmpty()
  TipoDocumento: string;

  @IsString()
  @IsNotEmpty()
  NumeroDocumento: string;

  @IsDateString()
  FechaNacimiento: string;

  @IsNumber()
  Edad: number;

  @IsString()
  Genero: string;

  @IsString()
  Telefono: string;

  @IsEmail()
  Correo: string;

  @IsString()
  Ciudad: string;

  @IsString()
  Departamento: string;

  @IsBoolean()
  EsMenor: boolean;

  @IsOptional()
  @IsString()
  AcudienteNombre?: string;

  @IsOptional()
  @IsString()
  AcudienteDocumento?: string;

  @IsOptional()
  @IsString()
  AcudienteTelefono?: string;

  @IsOptional()
  @IsEmail()
  AcudienteCorreo?: string;

  @IsString()
  TieneDiscapacidad: string;

  @IsOptional()
  @IsString()
  TipoDiscapacidad?: string;

  @IsOptional()
  @IsString()
  TipoDispositivo?: string;

  @IsOptional()
  @IsString()
  MarcaDispositivo?: string;

  @IsOptional()
  @IsString()
  ModeloDispositivo?: string;

  @IsOptional()
  @IsDateString()
  FechaEntrega?: string;

  @IsString()
  HaPerdidoDispositivo: string;

  @IsString()
  TienePoliza: string;

  @IsOptional()
  @IsString()
  Eps?: string;

  @IsOptional()
  @IsString()
  Regimen?: string;

  @IsString()
  OtroSeguro: string;

  @IsOptional()
  @IsString()
  CualOtroSeguro?: string;
}
