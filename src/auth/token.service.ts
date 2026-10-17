import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../database/database.service.js';
import * as crypto from 'crypto';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly db: DatabaseService,
  ) {}

  // 1. Gerar o par de tokens (Access + Refresh)
  async gerarTokens(payload: any, tipo: 'utilizador' | 'parceiro') {
    // Access Token: Curto (15 minutos)
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });

    // Refresh Token: Longo (30 dias)
    const refreshToken = crypto.randomBytes(40).toString('hex');
    
    // Guardar o Hash do Refresh Token na base de dados
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const expiraEm = new Date();
    expiraEm.setDate(expiraEm.getDate() + 30);

    const utilizadorId = tipo === 'utilizador' ? payload.sub : null;
    const parceiroId = tipo === 'parceiro' ? payload.sub : null;

    await this.db.query(
      `INSERT INTO refresh_tokens (token_hash, utilizador_id, parceiro_id, expira_em) 
       VALUES ($1, $2, $3, $4)`,
      [tokenHash, utilizadorId, parceiroId, expiraEm],
    );

    return { accessToken, refreshToken };
  }

  // 2. Validar e Rotacionar o Refresh Token
  async renovarTokens(refreshToken: string) {
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    const result = await this.db.query(
      `SELECT * FROM refresh_tokens 
       WHERE token_hash = $1 AND revogado = FALSE AND expira_em > NOW()`,
      [tokenHash],
    );

    const tokenDb = result.rows[0];
    if (!tokenDb) {
      throw new UnauthorizedException('Refresh Token inválido ou expirado.');
    }

    // Revogar o token antigo (Rotação de Token)
    await this.db.query(
      `UPDATE refresh_tokens SET revogado = TRUE WHERE id = $1`,
      [tokenDb.id],
    );

    // Recriar o payload
    const payload = {
      sub: tokenDb.utilizador_id || tokenDb.parceiro_id,
      tipo: tokenDb.utilizador_id ? 'utilizador' : 'parceiro',
    };

    // Devolver novos tokens
    return this.gerarTokens(payload, payload.tipo as 'utilizador' | 'parceiro');  }
}