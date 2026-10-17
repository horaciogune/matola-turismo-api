import { Module } from '@nestjs/common';
import { FavoritosController } from './favoritos.controller.js';
import { FavoritosService } from './favoritos.service.js';
import { FavoritosRepository } from './favoritos.repository.js';
import { PublicacoesModule } from '../publicacoes/publicacoes.module.js'; 

@Module({
  imports: [PublicacoesModule],
  controllers: [FavoritosController],
  providers: [FavoritosService, FavoritosRepository],
})
export class FavoritosModule {}