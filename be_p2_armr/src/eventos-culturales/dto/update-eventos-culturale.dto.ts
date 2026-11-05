
import { PartialType } from '@nestjs/mapped-types';
import { CreateEventoCulturalDto } from './create-eventos-culturale.dto';

export class UpdateEventoCulturalDto extends PartialType(
  CreateEventoCulturalDto,
) {}
