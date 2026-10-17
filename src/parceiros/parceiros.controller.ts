import { Controller, Get, Post, Body, Param, Patch, ParseUUIDPipe, Res } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import type { Response } from 'express';
import { ParceirosService } from './parceiros.service.js';
import { CreateParceiroDto } from './dto/create-parceiro.dto.js';
import { UpdateParceiroDto } from './dto/update-parceiro.dto.js';
import { LoginParceiroDto } from './dto/login-parceiro.dto.js';

@ApiTags('Parceiros')
@Controller('parceiros')
export class ParceirosController {
  constructor(private readonly parceirosService: ParceirosService) {}

  @Post()
  @ApiOperation({ summary: 'Registar um novo parceiro' })
  criar(@Body() dto: CreateParceiroDto) {
    return this.parceirosService.criar(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar parceiros aprovados' })
  listarAprovados() {
    return this.parceirosService.listarAprovados();
  }

  @Get('pendentes')
  @ApiOperation({ summary: 'Listar parceiros pendentes (Admin)' })
  listarPendentes() {
    return this.parceirosService.listarPendentes();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um parceiro por ID' })
  buscarPorId(@Param('id', ParseUUIDPipe) id: string) {
    return this.parceirosService.buscarPorId(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um parceiro' })
  atualizar(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateParceiroDto) {
    return this.parceirosService.atualizar(id, dto);
  }

  @Patch(':id/aprovar')
  @ApiOperation({ summary: 'Aprovar um parceiro' })
  aprovar(@Param('id', ParseUUIDPipe) id: string) {
    return this.parceirosService.aprovar(id);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login do parceiro (Devolve Cookie HttpOnly)' })
  async login(@Body() dto: LoginParceiroDto, @Res({ passthrough: true }) res: Response) {
    const resultado = await this.parceirosService.login(dto);

    // Colocar o Refresh Token no Cookie
    res.cookie('refresh_token', resultado.refresh_token, {
      httpOnly: true, // O JavaScript não consegue ler
      secure: process.env.NODE_ENV === 'production', // Só HTTPS em produção
      sameSite: 'strict', // Protege contra CSRF
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 dias
    });

    // Remover o refresh_token da resposta JSON (o frontend não precisa dele)
    const { refresh_token, ...respostaSemRefresh } = resultado;
    return respostaSemRefresh; // Devolve apenas o access_token
  }
}