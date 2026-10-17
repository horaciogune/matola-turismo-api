import { Module } from '@nestjs/common';
import { LikesController } from './likes.controller.js';
import { LikesService } from './likes.service.js';
import { LikesRepository } from './likes.repository.js';
import { PublicacoesModule } from '../publicacoes/publicacoes.module.js'; // Importante

@Module({
  imports: [PublicacoesModule],
  controllers: [LikesController],
  providers: [LikesService, LikesRepository],
})
export class LikesModule {}