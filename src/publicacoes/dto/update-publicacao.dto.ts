import { PartialType } from '@nestjs/swagger';
import { CreatePublicacaoDto } from './create-publicacao.dto.js';

export class UpdatePublicacaoDto extends PartialType(CreatePublicacaoDto) {}