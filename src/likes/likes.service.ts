import { Injectable, NotFoundException } from '@nestjs/common';
import { LikesRepository } from './likes.repository.js';
import { PublicacoesRepository } from '../publicacoes/publicacoes.repository.js';
import { DatabaseService } from '../database/database.service.js';
import { CreateLikeDto } from './dto/create-like.dto.js';

@Injectable()
export class LikesService {
  constructor(
    private readonly repository: LikesRepository,
    private readonly publicacoesRepository: PublicacoesRepository,
    private readonly db: DatabaseService,
  ) {}

  async darLike(dto: CreateLikeDto) {
    // 1. Verificar se a publicação existe
    const publicacao = await this.publicacoesRepository.buscarPorId(dto.publicacao_id);
    if (!publicacao) {
      throw new NotFoundException('Publicação não encontrada.');
    }

    // 2. Verificar se o utilizador existe (consulta direta rápida)
    const utilizador = await this.db.query(
      'SELECT id FROM utilizadores WHERE id = $1 AND status = $2',
      [dto.utilizador_id, 'ativo']
    );
    if (utilizador.rowCount === 0) {
      throw new NotFoundException('Utilizador não encontrado ou inativo.');
    }

    // 3. Registar o like
    await this.repository.darLike(dto);

    // 4. Devolver a contagem atualizada
    const totalLikes = await this.repository.contarLikes(dto.publicacao_id);
    return { mensagem: 'Like registado com sucesso!', total_likes: totalLikes };
  }

  async removerLike(utilizador_id: string, publicacao_id: string) {
    const likeRemovido = await this.repository.removerLike(utilizador_id, publicacao_id);
    if (!likeRemovido) {
      throw new NotFoundException('Like não encontrado.');
    }

    const totalLikes = await this.repository.contarLikes(publicacao_id);
    return { mensagem: 'Like removido.', total_likes: totalLikes };
  }
}