import { Controller, Get, Post, Body, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { PublicacoesService } from './publicacoes.service.js';
import { CreatePublicacaoDto } from './dto/create-publicacao.dto.js';

@ApiTags('Publicações')
@Controller('publicacoes')
export class PublicacoesController {
  constructor(private readonly publicacoesService: PublicacoesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova publicação (Feed)' })
  criar(@Body() dto: CreatePublicacaoDto) {
    return this.publicacoesService.criar(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Ver o Feed (publicações ativas de parceiros aprovados)' })
  listarFeed() {
    return this.publicacoesService.listarFeed();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar publicação por ID' })
  buscarPorId(@Param('id', ParseUUIDPipe) id: string) {
    return this.publicacoesService.buscarPorId(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma publicação' })
  @ApiQuery({ name: 'motivo', required: false, description: 'Motivo da remoção' })
  remover(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('motivo') motivo?: string,
  ) {
    return this.publicacoesService.remover(id, motivo);
  }
}