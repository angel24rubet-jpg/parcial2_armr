
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

import { Recinto } from '../../recintos/entities/recinto.entity';

export enum EstadoEvento {
  PROGRAMADO = 'Programado',
  AGOTADO = 'Agotado',
  CANCELADO = 'Cancelado',
}

@Entity('eventos_culturales')
export class EventoCultural {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'id_recinto', type: 'integer' })
  idRecinto: number;

  @ManyToOne(() => Recinto, { nullable: false })
  @JoinColumn({ name: 'id_recinto' })
  recinto: Recinto;

  @Column({ type: 'varchar', length: 150 })
  titulo: string;

  @Column({ name: 'artista_principal', type: 'varchar', length: 100 })
  artistaPrincipal: string;

  @Column({ name: 'duracion_minutos', type: 'integer' })
  duracionMinutos: number;

  @Column({
    name: 'precio_entrada',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  precioEntrada: number;

  @Column({ name: 'fecha_evento', type: 'date' })
  fechaEvento: string;

  @Column({
    type: 'enum',
    enum: EstadoEvento,
    enumName: 'estado_evento_enum',
    default: EstadoEvento.PROGRAMADO,
  })
  estado: EstadoEvento;

  //agregamos la nueva propiedad

    @Column({
    name: 'modalidad_ingreso',
    type: 'varchar',
    length: 30,
    default: 'Entrada pagada',
  })
  modalidadIngreso: string;

  @CreateDateColumn({
    name: 'fecha_creacion',
    type: 'timestamp',
  })
  fechaCreacion: Date;

  @UpdateDateColumn({
    name: 'fecha_modificacion',
    type: 'timestamp',
  })
  fechaModificacion: Date;

  @DeleteDateColumn({
    name: 'fecha_eliminacion',
    type: 'timestamp',
    nullable: true,
  })
  fechaEliminacion: Date | null;
}
