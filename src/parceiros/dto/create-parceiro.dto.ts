import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  IsNumber,
} from 'class-validator';

export class CreateParceiroDto {
  @ApiProperty({ example: 'João Silva' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nome_responsavel: string;

  @ApiProperty({ example: 'joao@restaurante.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'minhasenha123', minLength: 8 })
  @IsString()
  @MinLength(6)
  senha: string;

  @ApiProperty({ example: '+258840000000', required: false })
  @IsString()
  @IsOptional()
  telefone?: string;

  @ApiProperty({ example: 'Restaurante do João' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nome_estabelecimento: string;

  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @IsOptional()
  categoria_id?: number;

  @ApiProperty({ example: 'O melhor frango da Matola', required: false })
  @IsString()
  @IsOptional()
  descricao?: string;

  @ApiProperty({ example: '10h - 22h', required: false })
  @IsString()
  @IsOptional()
  horario?: string;

  @ApiProperty({ example: 'Av. da Liberdade, 123', required: false })
  @IsString()
  @IsOptional()
  endereco?: string;

  @ApiProperty({ example: -25.9622, required: false })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiProperty({ example: 32.4589, required: false })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiProperty({ example: 'https://exemplo.com/foto.jpg', required: false })
  @IsString()
  @IsOptional()
  foto_url?: string;
}