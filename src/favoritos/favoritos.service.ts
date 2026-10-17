import { Injectable, NotFoundException } from '@nestjs/common';
import { FavoritosRepository } from './favoritos.repository.js';
import { PublicacoesRepository } from '../publicacoes/publicacoes.repository.js';
import { DatabaseService } from '../database/database.service.js';
import { CreateFavoritoDto } from './dto/create-favorito.dto.js';

@Injectable()
export class FavoritosService {
  constructor(
    private readonly repository: FavoritosRepository,
    private readonly publicacoesRepository: PublicacoesRepository,
    private readonly db: DatabaseService,
  ) {}

  async guardar(dto: CreateFavoritoDto) {
    const publicacao = await this.publicacoesRepository.buscarPorId(dto.publicacao_id);
    if (!publicacao) throw new NotFoundException('Publicação não encontrada.');

    const utilizador = await this.db.query(
      'SELECT id FROM utilizadores WHERE id = $1 AND status = $2',
      [dto.utilizador_id, 'ativo']
    );
    if (utilizador.rowCount === 0) throw new NotFoundException('Utilizador não encontrado.');

    await this.repository.guardar(dto);
    return { mensagem: 'Publicação guardada nos favoritos!' };
  }

  async remover(utilizador_id: string, publicacao_id: string) {
    const removido = await this.repository.remover(utilizador_id, publicacao_id);
    if (!removido) throw new NotFoundException('Favorito não encontrado.');
    return { mensagem: 'Removido dos favoritos.' };
  }

  async listarMeusFavoritos(utilizador_id: string) {
    return this.repository.listarFavoritosDoUtilizador(utilizador_id);
  }
}