import { PartialType } from '@nestjs/swagger';
import { CreateParceiroDto } from './create-parceiro.dto.js';

export class UpdateParceiroDto extends PartialType(CreateParceiroDto) {}