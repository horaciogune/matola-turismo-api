import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import { Publicacao } from './interfaces/publicacao.interface.js';
import { CreatePublicacaoDto } from './dto/create-publicacao.dto.js';

@Injectable()
export class PublicacoesRepository {
  constructor(private readonly db: DatabaseService) {}

  // 1. Criar uma publicação (O ID do parceiro vem no dto)
  async criar(dto: CreatePublicacaoDto): Promise<Publicacao> {
    const sql = `
      INSERT INTO publicacoes (parceiro_id, titulo, conteudo, foto_url, status)
      VALUES ($1, $2, $3, $4, 'ativo')
      RETURNING *;
    `;

    const valores = [
      dto.parceiro_id,
      dto.titulo,
      dto.conteudo ?? null,
      dto.foto_url ?? null,
    ];

    const result = await this.db.query<Publicacao>(sql, valores);
    return result.rows[0];
  }

  // 2. Listar o feed (Apenas publicações ativas de parceiros aprovados)
  async listarFeed(): Promise<any[]> {
    const sql = `
      SELECT p.*, par.nome_estabelecimento, par.foto_url AS parceiro_foto_url
      FROM publicacoes p
      INNER JOIN parceiros par ON p.parceiro_id = par.id
      WHERE p.status = 'ativo' AND par.status = 'aprovado'
      ORDER BY p.criado_em DESC;
    `;
    const result = await this.db.query(sql);
    return result.rows;
  }

  // 3. Buscar uma publicação por ID
  async buscarPorId(id: string): Promise<Publicacao | null> {
    const result = await this.db.query<Publicacao>(
      `SELECT * FROM publicacoes WHERE id = $1`,
      [id],
    );
    return result.rows[0] ?? null;
  }

  // 4. Remover (soft delete) uma publicação
  async remover(id: string, motivo: string): Promise<Publicacao | null> {
    const result = await this.db.query<Publicacao>(
      `UPDATE publicacoes 
       SET status = 'removido', motivo_status = $1, atualizado_em = NOW() 
       WHERE id = $2 
       RETURNING *`,
      [motivo, id],
    );
    return result.rows[0] ?? null;
  }
}