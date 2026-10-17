import { Module } from '@nestjs/common';
import { PublicacoesController } from './publicacoes.controller.js';
import { PublicacoesService } from './publicacoes.service.js';
import { PublicacoesRepository } from './publicacoes.repository.js';
import { ParceirosModule } from '../parceiros/parceiros.module.js';

@Module({
  imports: [ParceirosModule],
  controllers: [PublicacoesController],
  providers: [PublicacoesService, PublicacoesRepository],
  exports: [PublicacoesService, PublicacoesRepository], 
})
export class PublicacoesModule {}