import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { DatabaseModule } from './database/database.module.js';
import { ParceirosModule } from './parceiros/parceiros.module.js';
import { PublicacoesModule } from './publicacoes/publicacoes.module.js';
import { LikesModule } from './likes/likes.module.js';      
import { FavoritosModule } from './favoritos/favoritos.module.js'; 

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    ParceirosModule,
    PublicacoesModule,
    LikesModule,     
    FavoritosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}