import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import { CreateFavoritoDto } from './dto/create-favorito.dto.js';

@Injectable()
export class FavoritosRepository {
  constructor(private readonly db: DatabaseService) {}

  // Adicionar ou reativar um favorito
  async guardar(dto: CreateFavoritoDto) {
    const sql = `
      INSERT INTO favoritos (utilizador_id, publicacao_id, status)
      VALUES ($1, $2, 'ativo')
      ON CONFLICT (utilizador_id, publicacao_id) 
      DO UPDATE SET status = 'ativo'
      RETURNING *;
    `;
    const result = await this.db.query(sql, [dto.utilizador_id, dto.publicacao_id]);
    return result.rows[0];
  }

  // Remover dos favoritos
  async remover(utilizador_id: string, publicacao_id: string) {
    const sql = `
      UPDATE favoritos 
      SET status = 'inativo' 
      WHERE utilizador_id = $1 AND publicacao_id = $2 
      RETURNING *;
    `;
    const result = await this.db.query(sql, [utilizador_id, publicacao_id]);
    return result.rows[0] ?? null;
  }

  // Listar os favoritos de um utilizador (com os dados da publicação)
  async listarFavoritosDoUtilizador(utilizador_id: string) {
    const sql = `
      SELECT f.id as favorito_id, p.* 
      FROM favoritos f
      INNER JOIN publicacoes p ON f.publicacao_id = p.id
      WHERE f.utilizador_id = $1 AND f.status = 'ativo'
      ORDER BY f.criado_em DESC;
    `;
    const result = await this.db.query(sql, [utilizador_id]);
    return result.rows;
  }
}