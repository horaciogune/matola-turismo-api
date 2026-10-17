import { Controller, Post, Delete, Get, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { FavoritosService } from './favoritos.service.js';
import { CreateFavoritoDto } from './dto/create-favorito.dto.js';

@ApiTags('Favoritos')
@Controller('favoritos')
export class FavoritosController {
  constructor(private readonly favoritosService: FavoritosService) {}

  @Post()
  @ApiOperation({ summary: 'Guardar uma publicação nos favoritos' })
  guardar(@Body() dto: CreateFavoritoDto) {
    return this.favoritosService.guardar(dto);
  }

  @Delete(':utilizador_id/:publicacao_id')
  @ApiOperation({ summary: 'Remover uma publicação dos favoritos' })
  remover(
    @Param('utilizador_id', ParseUUIDPipe) utilizador_id: string,
    @Param('publicacao_id', ParseUUIDPipe) publicacao_id: string,
  ) {
    return this.favoritosService.remover(utilizador_id, publicacao_id);
  }

  @Get(':utilizador_id')
  @ApiOperation({ summary: 'Listar os favoritos de um utilizador' })
  listarMeusFavoritos(@Param('utilizador_id', ParseUUIDPipe) utilizador_id: string) {
    return this.favoritosService.listarMeusFavoritos(utilizador_id);
  }
}