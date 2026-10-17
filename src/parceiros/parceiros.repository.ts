import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import { Parceiro } from './interfaces/parceiro.interface.js';
import { CreateParceiroDto } from './dto/create-parceiro.dto.js';

@Injectable()
export class ParceirosRepository {
    constructor(private readonly db: DatabaseService) { }

    async criar(dados: CreateParceiroDto, senhaHash: string): Promise<Parceiro> {
        const sql = `
      INSERT INTO parceiros (
        nome_responsavel, email, senha_hash, telefone,
        nome_estabelecimento, categoria_id, descricao,
        horario, endereco, latitude, longitude, foto_url,
        status
      ) VALUES (
        $1, $2, $3, $4,
        $5, $6, $7,
        $8, $9, $10, $11, $12,
        'pendente'
      )
      RETURNING *;
    `;

        const valores = [
            dados.nome_responsavel,
            dados.email,
            senhaHash,
            dados.telefone ?? null,
            dados.nome_estabelecimento,
            dados.categoria_id ?? null,
            dados.descricao ?? null,
            dados.horario ?? null,
            dados.endereco ?? null,
            dados.latitude ?? null,
            dados.longitude ?? null,
            dados.foto_url ?? null,
        ];

        const result = await this.db.query<Parceiro>(sql, valores);
        return result.rows[0];
    }

    async buscarPorEmail(email: string): Promise<Parceiro | null> {
        const result = await this.db.query<Parceiro>(
            `SELECT * FROM parceiros WHERE email = $1`,
            [email],
        );
        return result.rows[0] ?? null;
    }

    async buscarPorId(id: string): Promise<Parceiro | null> {
        const result = await this.db.query<Parceiro>(
            `SELECT * FROM parceiros WHERE id = $1`,
            [id],
        );
        return result.rows[0] ?? null;
    }

    async listarAprovados(): Promise<Parceiro[]> {
        const result = await this.db.query<Parceiro>(
            `SELECT * FROM parceiros WHERE status = 'aprovado' ORDER BY nome_estabelecimento ASC`,
        );
        return result.rows;
    }

    async listarPendentes(): Promise<Parceiro[]> {
        const result = await this.db.query<Parceiro>(
            `SELECT * FROM parceiros WHERE status = 'pendente' ORDER BY criado_em ASC`,
        );
        return result.rows;
    }

    async aprovar(id: string, adminId: number): Promise<Parceiro | null> {
        const result = await this.db.query<Parceiro>(
            `UPDATE parceiros 
       SET status = 'aprovado', aprovado_por = $1, aprovado_em = NOW(), atualizado_em = NOW() 
       WHERE id = $2 
       RETURNING *`,
            [adminId, id],
        );
        return result.rows[0] ?? null;
    }

    async atualizar(id: string, dados: any): Promise<Parceiro | null> {
        const campos = Object.keys(dados);
        if (campos.length === 0) return this.buscarPorId(id);

        const setClause = campos.map((campo, index) => `${campo} = $${index + 1}`).join(', ');
        const valores = campos.map((campo) => dados[campo]);

        const result = await this.db.query<Parceiro>(
            `UPDATE parceiros 
       SET ${setClause}, atualizado_em = NOW() 
       WHERE id = $${campos.length + 1} 
       RETURNING *`,
            [...valores, id],
        );
        return result.rows[0] ?? null;
    }
}