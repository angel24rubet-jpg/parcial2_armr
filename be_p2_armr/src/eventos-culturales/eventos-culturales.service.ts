
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";

import { InjectRepository } from "@nestjs/typeorm";
import { Repository, IsNull } from "typeorm";

import { EventoCultural } from "./entities/eventos-culturale.entity";

import { Recinto } from "../recintos/entities/recinto.entity";

import { CreateEventoCulturalDto } from "./dto/create-eventos-culturale.dto";
import { UpdateEventoCulturalDto } from "./dto/update-eventos-culturale.dto";

@Injectable()
export class EventosCulturalesService {
  constructor(
    @InjectRepository(EventoCultural)
    private readonly eventoRepository: Repository<EventoCultural>,

    @InjectRepository(Recinto)
    private readonly recintoRepository: Repository<Recinto>,
  ) {}

  // Verificar si el recinto ya tiene un evento en esa fecha
  async validarDisponibilidad(
    idRecinto: number,
    fechaEvento: string,
    idEventoExcluir?: number,
  ) {
    const eventoExistente = await this.eventoRepository.findOne({
      where: {
        recinto: { id: idRecinto },
        fechaEvento,
        fechaEliminacion: IsNull(),
      },
    });

    if (eventoExistente && eventoExistente.id !== idEventoExcluir) {
      throw new BadRequestException(
        "El recinto seleccionado ya está ocupado en esta fecha",
      );
    }
  }

  async create(createEventoCulturalDto: CreateEventoCulturalDto) {
    const recinto = await this.recintoRepository.findOne({
      where: {
        id: createEventoCulturalDto.idRecinto,
        fechaEliminacion: IsNull(),
      },
    });

    if (!recinto) {
      throw new BadRequestException(
        "El recinto seleccionado no existe o está eliminado",
      );
    }

    await this.validarDisponibilidad(
      createEventoCulturalDto.idRecinto,
      createEventoCulturalDto.fechaEvento,
    );

    const evento = this.eventoRepository.create({
      ...createEventoCulturalDto,
      recinto,
    });

    return await this.eventoRepository.save(evento);
  }

  async findAll() {
    return await this.eventoRepository.find({
      where: { fechaEliminacion: IsNull() },
      relations: {
        recinto: true,
      },
      order: { fechaEvento: "ASC" },
    });
  }

  async findOne(id: number) {
    const evento = await this.eventoRepository.findOne({
      where: {
        id,
        fechaEliminacion: IsNull(),
      },
      relations: {
        recinto: true,
      },
    });

    if (!evento) {
      throw new NotFoundException(`Evento con ID ${id} no encontrado`);
    }

    return evento;
  }

  async update(id: number, updateEventoCulturalDto: UpdateEventoCulturalDto) {
    const evento = await this.findOne(id);

    const nuevoIdRecinto =
      updateEventoCulturalDto.idRecinto ?? evento.idRecinto;

    const nuevaFecha =
      updateEventoCulturalDto.fechaEvento ?? evento.fechaEvento;

    const recinto = await this.recintoRepository.findOne({
      where: {
        id: nuevoIdRecinto,
        fechaEliminacion: IsNull(),
      },
    });

    if (!recinto) {
      throw new BadRequestException(
        "El recinto seleccionado no existe o está eliminado",
      );
    }

    await this.validarDisponibilidad(
      nuevoIdRecinto,
      nuevaFecha,
      id,
    );

    evento.recinto = recinto;
    evento.idRecinto = recinto.id;

    Object.assign(evento, updateEventoCulturalDto);

    return await this.eventoRepository.save(evento);
  }

  async remove(id: number) {
    const evento = await this.findOne(id);

    await this.eventoRepository.softDelete(id);

    return {
      mensaje: "Evento cultural eliminado correctamente",
      id: evento.id,
    };
  }
}
