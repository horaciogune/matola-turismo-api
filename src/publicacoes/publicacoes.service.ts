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

  async criar(dto: CreatePublicacaoDto, parceiroId: string) {
    const parceiro = await this.parceirosRepository.buscarPorId(parceiroId);
    if (!parceiro) {
      throw new NotFoundException('Parceiro não encontrado.');
    }

    if (parceiro.status !== 'aprovado') {
      throw new BadRequestException(
        `Não podes publicar. O teu estado é: ${parceiro.status}. Aguarda aprovação do Admin.`,
      );
    }

    // Passamos o parceiroId do Token para o Repository
    const publicacao = await this.repository.criar({
      ...dto,
      parceiro_id: parceiroId, 
    } as any);

    return publicacao;
  }

  async listarFeed() {
    return this.repository.listarFeed();
  }

  async buscarPorId(id: string) {
    const publicacao = await this.repository.buscarPorId(id);
    if (!publicacao) {
      throw new NotFoundException(`Publicação com ID ${id} não encontrada.`);
    }
    return publicacao;
  }

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