import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";

import { InjectRepository } from "@nestjs/typeorm";
import { Repository, IsNull } from "typeorm";

import { Recinto } from "./entities/recinto.entity";
import { CreateRecintoDto } from "./dto/create-recinto.dto";
import { UpdateRecintoDto } from "./dto/update-recinto.dto";

@Injectable()
export class RecintosService {
  constructor(
    @InjectRepository(Recinto)
    private readonly recintoRepository: Repository<Recinto>,
  ) {}

  // Verificar si ya existe un recinto con el mismo nombre y ciudad
  async validarRecinto(nombre: string, ciudad: string, idExcluir?: number) {
    const normalizar = (texto: string) =>
      texto.trim().replace(/\s+/g, " ").toLowerCase();

    const recintos = await this.recintoRepository.find({
      where: { fechaEliminacion: IsNull() },
    });

    const recintoExistente = recintos.find(
      (recinto) =>
        normalizar(recinto.nombre) === normalizar(nombre) &&
        normalizar(recinto.ciudad) === normalizar(ciudad) &&
        recinto.id !== idExcluir,
    );

    if (recintoExistente) {
      throw new BadRequestException(
        "Ya existe un recinto con ese nombre en esta ciudad",
      );
    }
  }

  async create(createRecintoDto: CreateRecintoDto) {
    await this.validarRecinto(createRecintoDto.nombre, createRecintoDto.ciudad);

    const recinto = this.recintoRepository.create({
      ...createRecintoDto,
      nombre: createRecintoDto.nombre.trim().replace(/\s+/g, " "),
      ciudad: createRecintoDto.ciudad.trim().replace(/\s+/g, " "),
    });

    return await this.recintoRepository.save(recinto);
  }

  async findAll() {
    return await this.recintoRepository.find({
      where: { fechaEliminacion: IsNull() },
      order: { nombre: "ASC" },
    });
  }

  async findOne(id: number) {
    const recinto = await this.recintoRepository.findOne({
      where: {
        id,
        fechaEliminacion: IsNull(),
      },
    });

    if (!recinto) {
      throw new NotFoundException(`Recinto con ID ${id} no encontrado`);
    }

    return recinto;
  }

  async update(id: number, updateRecintoDto: UpdateRecintoDto) {
    const recinto = await this.findOne(id);

    const nuevoNombre = updateRecintoDto.nombre ?? recinto.nombre;
    const nuevaCiudad = updateRecintoDto.ciudad ?? recinto.ciudad;

    await this.validarRecinto(nuevoNombre, nuevaCiudad, id);

    Object.assign(recinto, {
      ...updateRecintoDto,
      nombre: nuevoNombre.trim().replace(/\s+/g, " "),
      ciudad: nuevaCiudad.trim().replace(/\s+/g, " "),
    });

    return await this.recintoRepository.save(recinto);
  }

  async remove(id: number) {
    const recinto = await this.findOne(id);

    await this.recintoRepository.softDelete(id);

    return {
      mensaje: "Recinto eliminado correctamente",
      id: recinto.id,
    };
  }
}
