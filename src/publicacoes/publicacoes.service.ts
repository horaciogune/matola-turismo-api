import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PublicacoesRepository } from './publicacoes.repository.js';
import { ParceirosRepository } from '../parceiros/parceiros.repository.js';
import { CreatePublicacaoDto } from './dto/create-publicacao.dto.js';

@Injectable()
export class PublicacoesService {
  constructor(
    private readonly repository: PublicacoesRepository,
    private readonly parceirosRepository: ParceirosRepository,
  ) {}

  // 1. Criar uma publicação
  async criar(dto: CreatePublicacaoDto) {
    // Verificar se o parceiro existe
    const parceiro = await this.parceirosRepository.buscarPorId(dto.parceiro_id);
    if (!parceiro) {
      throw new NotFoundException('Parceiro não encontrado.');
    }

    // Verificar se o parceiro está aprovado (regra de negócio)
    if (parceiro.status !== 'aprovado') {
      throw new BadRequestException(
        `Não podes publicar. O teu estado é: ${parceiro.status}. Aguarda aprovação do Admin.`,
      );
    }

    const publicacao = await this.repository.criar(dto);
    return publicacao;
  }

  // 2. Listar o feed (apenas publicações ativas)
  async listarFeed() {
    return this.repository.listarFeed();
  }

  // 3. Buscar publicação por ID
  async buscarPorId(id: string) {
    const publicacao = await this.repository.buscarPorId(id);
    if (!publicacao) {
      throw new NotFoundException(`Publicação com ID ${id} não encontrada.`);
    }
    return publicacao;
  }

  // 4. Remover publicação (soft delete)
  async remover(id: string, motivo: string = 'Removido pelo autor') {
    const publicacao = await this.repository.buscarPorId(id);
    if (!publicacao) {
      throw new NotFoundException(`Publicação com ID ${id} não encontrada.`);
    }

    const removida = await this.repository.remover(id, motivo);
    if (!removida) {
      throw new NotFoundException(`Erro ao remover a publicação com ID ${id}.`);
    }

    return removida;
  }
}