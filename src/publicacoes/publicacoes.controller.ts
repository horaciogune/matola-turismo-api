import { Controller, Get, Post, Body, Param, Delete, Query, ParseUUIDPipe, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { PublicacoesService } from './publicacoes.service.js';
import { CreatePublicacaoDto } from './dto/create-publicacao.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import type { Request } from 'express'; 

@ApiTags('Publicações')
@Controller('publicacoes')
export class PublicacoesController {
  constructor(private readonly publicacoesService: PublicacoesService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar uma nova publicação (Requer Login)' })
  criar(@Body() dto: CreatePublicacaoDto, @Req() req: Request) {

    const parceiroId = (req as any).user.userId;

    return this.publicacoesService.criar(dto, parceiroId);
  }

  @Get()
  @ApiOperation({ summary: 'Ver o Feed (público)' })
  listarFeed() {
    return this.publicacoesService.listarFeed();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar publicação por ID' })
  buscarPorId(@Param('id', ParseUUIDPipe) id: string) {
    return this.publicacoesService.buscarPorId(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover uma publicação (Requer Login)' })
  @ApiQuery({ name: 'motivo', required: false })
  remover(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('motivo') motivo?: string,
  ) {
    return this.publicacoesService.remover(id, motivo);
  }
}