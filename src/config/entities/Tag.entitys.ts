import {Entity,PrimaryGeneratedColumn,Column,ManyToOne,JoinColumn,CreateDateColumn, UpdateDateColumn, Index} from 'typeorm';
import { Implante } from './implantes.entity';
import { EstadoTag } from './estados.entity';

export type TagProveedor = 'AIRPINPOINT' | 'OTRO';

@Entity('Implantes_tags')
export class ImplanteTag {
  @PrimaryGeneratedColumn('uuid')
  Id: string;

  @Index()
  @Column({ name: 'Implante_id', type: 'uuid' })
  ImplanteId: string;

  @ManyToOne(() => Implante, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'Implante_id', referencedColumnName: 'Id' })
  Implante: Implante;

  @Index({ unique: true })
  @Column({ name: 'Trackable_id' })
  TrackableId: string; // ej: tag_123456 de AirPinpoint

  @Column({ name: 'Proveedor', default: 'AIRPINPOINT' })
  Proveedor: TagProveedor;

  @Column({ name: 'Alias', nullable: true })
  Alias?: string;

  // --- Relación con tabla de estados ---
  @Column({ name: 'Estado_id', type: 'uuid', nullable: true })
  EstadoId: string;

  @ManyToOne(() => EstadoTag, { eager: true }) // eager para traer el estado por defecto
  @JoinColumn({ name: 'Estado_id', referencedColumnName: 'Id' })
  Estado: EstadoTag;

  // --- Snapshot de última ubicación ---
  @Column({ name: 'Ultimo_lat', type: 'double', nullable: true })
  UltimoLat?: number;

  @Column({ name: 'Ultimo_lng', type: 'double', nullable: true })
  UltimoLng?: number;

  @Column({ name: 'Ultimo_accuracy', type: 'double', nullable: true })
  UltimoAccuracy?: number;

  @Column({ name: 'Ultimo_bateria', type: 'double', nullable: true })
  UltimoBateria?: number;

  @Column({ name: 'Ultimo_timestamp', type: 'timestamp', nullable: true })
  UltimoTimestamp?: Date;

  @Column({ name: 'Metadata', type: 'json', nullable: true })
  Metadata?: Record<string, any>;

  @CreateDateColumn({ name: 'Created_at', type: 'timestamp' })
  CreatedAt: Date;

  @UpdateDateColumn({ name: 'Updated_at', type: 'timestamp' })
  UpdatedAt: Date;
}
