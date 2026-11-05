import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsNumber,
  IsDateString,
  IsEnum,
  Min,
  MaxLength,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { EstadoEvento } from '../entities/eventos-culturale.entity';

export class CreateEventoCulturalDto {
  @ApiProperty({ example: 1, description: 'ID del recinto donde se realizará el evento' })
  @IsInt()
  @Min(1)
  idRecinto: number;

  @ApiProperty({ example: 'Festival Cultural de Sucre', maxLength: 150 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  titulo: string;

  @ApiProperty({ example: 'Los Kjarkas', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  artistaPrincipal: string;

  @ApiProperty({ example: 120, description: 'Duración del evento en minutos' })
  @IsInt()
  @Min(1)
  duracionMinutos: number;

  @ApiProperty({ example: 85.50, description: 'Precio de la entrada' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  precioEntrada: number;

  @ApiProperty({ example: '2026-12-15', description: 'Fecha del evento' })
  @IsDateString()
  fechaEvento: string;

  @ApiProperty({
    enum: EstadoEvento,
    example: EstadoEvento.PROGRAMADO,
    description: 'Estado actual del evento',
  })
  @IsEnum(EstadoEvento)
  estado: EstadoEvento;
}