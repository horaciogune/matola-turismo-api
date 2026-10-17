import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreatePublicacaoDto {
  @ApiProperty({ example: '25ccb15a-02fd-401b-9c01-ec6c140d86f8' })
  @IsUUID()
  @IsNotEmpty()
  parceiro_id: string;

  @ApiProperty({ example: 'Prato do dia: Frango da Matola' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  titulo: string;

  @ApiProperty({ example: 'Hoje temos o melhor frango com arroz. Apenas 350 MZN!', required: false })
  @IsString()
  @IsOptional()
  conteudo?: string;

  @ApiProperty({ example: 'https://exemplo.com/foto.jpg', required: false })
  @IsString()
  @IsOptional()
  foto_url?: string;
}