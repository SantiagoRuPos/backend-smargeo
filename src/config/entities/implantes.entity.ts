import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('implantes')
export class Implante {
  @PrimaryGeneratedColumn('uuid')
  Id: string;

  @Column({ name: 'nombres' }) Nombres: string;
  @Column({ name: 'apellidos' }) Apellidos: string;
  @Column({ name: 'tipo_documento' }) TipoDocumento: string;
  @Column({ name: 'numero_documento' }) NumeroDocumento: string;
  @Column({ name: 'fecha_nacimiento', type: 'date' }) FechaNacimiento: string;
  @Column({ name: 'edad' }) Edad: number;
  @Column({ name: 'genero' }) Genero: string;
  @Column({ name: 'telefono' }) Telefono: string;
  @Column({ name: 'correo' }) Correo: string;
  @Column({ name: 'ciudad' }) Ciudad: string;
  @Column({ name: 'departamento' }) Departamento: string;
  @Column({ name: 'es_menor' }) EsMenor: boolean;

  @Column({ name: 'acudiente_nombre', nullable: true }) AcudienteNombre: string;
  @Column({ name: 'acudiente_documento', nullable: true }) AcudienteDocumento: string;
  @Column({ name: 'acudiente_telefono', nullable: true }) AcudienteTelefono: string;
  @Column({ name: 'acudiente_correo', nullable: true }) AcudienteCorreo: string;

  @Column({ name: 'tiene_discapacidad', default: 'no' }) TieneDiscapacidad: string;
  @Column({ name: 'tipo_discapacidad', nullable: true }) TipoDiscapacidad: string;
  @Column({ name: 'tipo_dispositivo', nullable: true }) TipoDispositivo: string;
  @Column({ name: 'marca_dispositivo', nullable: true }) MarcaDispositivo: string;
  @Column({ name: 'modelo_dispositivo', nullable: true }) ModeloDispositivo: string;
  @Column({ name: 'fecha_entrega', type: 'date', nullable: true }) FechaEntrega: string;
  @Column({ name: 'ha_perdido_dispositivo', default: 'no' }) HaPerdidoDispositivo: string;
  @Column({ name: 'tiene_poliza', default: 'no' }) TienePoliza: string;

  @Column({ name: 'eps', nullable: true }) Eps: string;
  @Column({ name: 'regimen', nullable: true }) Regimen: string;
  @Column({ name: 'otro_seguro', default: 'no' }) OtroSeguro: string;
  @Column({ name: 'cual_otro_seguro', nullable: true }) CualOtroSeguro: string;
  
  @Column({ name: 'codigo_qr', unique: true })
  CodigoQR: string;
}
