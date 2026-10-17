import { Module } from '@nestjs/common';
import { ParceirosController } from './parceiros.controller.js';
import { ParceirosService } from './parceiros.service.js';
import { ParceirosRepository } from './parceiros.repository.js';

@Module({
  controllers: [ParceirosController],
  providers: [ParceirosService, ParceirosRepository],
  exports: [ParceirosService, ParceirosRepository], 
})
export class ParceirosModule {}