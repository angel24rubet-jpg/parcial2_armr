
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EventosCulturalesService } from './eventos-culturales.service';
import { EventosCulturalesController } from './eventos-culturales.controller';

import { EventoCultural } from './entities/eventos-culturale.entity';
import { Recinto } from '../recintos/entities/recinto.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventoCultural, Recinto]),
  ],
  controllers: [EventosCulturalesController],
  providers: [EventosCulturalesService],
  exports: [EventosCulturalesService],
})
export class EventosCulturalesModule {}
