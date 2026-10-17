import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
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
    
    // Rate Limiter: Máximo de 10 pedidos por minuto
    ThrottlerModule.forRoot([{
      ttl: 60000, 
      limit: 50,  
    }]),

    DatabaseModule,
    ParceirosModule,
    PublicacoesModule,
    LikesModule,
    FavoritosModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}