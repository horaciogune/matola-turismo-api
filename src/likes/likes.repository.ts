import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import { Like } from './interfaces/like.interface.js';
import { CreateLikeDto } from './dto/create-like.dto.js';

@Injectable()
export class LikesRepository {
  constructor(private readonly db: DatabaseService) {}

  // Adicionar ou reativar um like
  async darLike(dto: CreateLikeDto): Promise<Like> {
    const sql = `
      INSERT INTO likes (utilizador_id, publicacao_id, status)
      VALUES ($1, $2, 'ativo')
      ON CONFLICT (utilizador_id, publicacao_id) 
      DO UPDATE SET status = 'ativo'
      RETURNING *;
    `;
    const result = await this.db.query<Like>(sql, [dto.utilizador_id, dto.publicacao_id]);
    return result.rows[0];
  }

  // Remover um like (soft delete)
  async removerLike(utilizador_id: string, publicacao_id: string): Promise<Like | null> {
    const sql = `
      UPDATE likes 
      SET status = 'inativo' 
      WHERE utilizador_id = $1 AND publicacao_id = $2 
      RETURNING *;
    `;
    const result = await this.db.query<Like>(sql, [utilizador_id, publicacao_id]);
    return result.rows[0] ?? null;
  }

  // Contar quantos likes ativos uma publicação tem
  async contarLikes(publicacao_id: string): Promise<number> {
    const sql = `SELECT COUNT(*) FROM likes WHERE publicacao_id = $1 AND status = 'ativo'`;
    const result = await this.db.query(sql, [publicacao_id]);
    return parseInt(result.rows[0].count, 10);
  }
}