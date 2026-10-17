import { Controller, Post, Delete, Body, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LikesService } from './likes.service.js';
import { CreateLikeDto } from './dto/create-like.dto.js';

@ApiTags('Likes')
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post()
  @ApiOperation({ summary: 'Dar like numa publicação' })
  darLike(@Body() dto: CreateLikeDto) {
    return this.likesService.darLike(dto);
  }

  // O utilizador_id e publicacao_id vão na URL para facilitar o Delete
  @Delete(':utilizador_id/:publicacao_id')
  @ApiOperation({ summary: 'Remover like de uma publicação' })
  removerLike(
    @Param('utilizador_id', ParseUUIDPipe) utilizador_id: string,
    @Param('publicacao_id', ParseUUIDPipe) publicacao_id: string,
  ) {
    return this.likesService.removerLike(utilizador_id, publicacao_id);
  }
}