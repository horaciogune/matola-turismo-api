import { Controller, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TokenService } from './token.service.js';
import type { Request, Response } from 'express'; 

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private readonly tokenService: TokenService) {}

  @Post('refresh')
  @ApiOperation({ summary: 'Renovar o Access Token usando o Cookie HttpOnly' })
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies['refresh_token'];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh Token não encontrado nos cookies.');
    }

    const { accessToken, refreshToken: novoRefreshToken } = 
      await this.tokenService.renovarTokens(refreshToken);

    res.cookie('refresh_token', novoRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 dias
    });

    // 4. O frontend só recebe o novo Access Token
    return { 
      mensagem: 'Token renovado com sucesso!',
      access_token: accessToken 
    };
  }
}