
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';

import { EventosCulturalesService } from './eventos-culturales.service';
import { CreateEventoCulturalDto } from './dto/create-eventos-culturale.dto';
import { UpdateEventoCulturalDto } from './dto/update-eventos-culturale.dto';

@Controller('eventos-culturales')
export class EventosCulturalesController {
  constructor(
    private readonly eventosCulturalesService: EventosCulturalesService,
  ) {}

  @Post()
  create(@Body() createEventoCulturalDto: CreateEventoCulturalDto) {
    return this.eventosCulturalesService.create(createEventoCulturalDto);
  }

  @Get()
  findAll() {
    return this.eventosCulturalesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.eventosCulturalesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventoCulturalDto: UpdateEventoCulturalDto,
  ) {
    return this.eventosCulturalesService.update(id, updateEventoCulturalDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.eventosCulturalesService.remove(id);
  }
}
