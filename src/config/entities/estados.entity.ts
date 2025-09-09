import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index} from 'typeorm';

@Entity('Estados')
export class EstadoTag {
    @PrimaryGeneratedColumn('uuid')
    Id: string;

    @Index({ unique: true })
    @Column({ name: 'Codigo', type: 'varchar', length: 50 })
    Codigo: string; // ej: ACTIVO, INACTIVO, PERDIDO

    @Column({ name: 'Descripcion', type: 'varchar', length: 255, nullable: true })
    Descripcion?: string;

    @CreateDateColumn({ name: 'Created_at', type: 'timestamp' })
    CreatedAt: Date;

    @UpdateDateColumn({ name: 'Updated_at', type: 'timestamp' })
    UpdatedAt: Date;
}
