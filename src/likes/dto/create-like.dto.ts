import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateLikeDto {
  @ApiProperty({ example: 'id-do-utilizador-aqui' })
  @IsUUID()
  @IsNotEmpty()
  utilizador_id: string;

  @ApiProperty({ example: 'id-da-publicacao-aqui' })
  @IsUUID()
  @IsNotEmpty()
  publicacao_id: string;
}