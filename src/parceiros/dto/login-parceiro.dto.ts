import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginParceiroDto {
  @ApiProperty({ example: 'joao@restaurante.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'minhasenha123', minLength: 6 })
  @IsString()
  @MinLength(8)
  senha: string;
}