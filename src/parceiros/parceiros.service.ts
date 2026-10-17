import {
    Injectable,
    ConflictException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { ParceirosRepository } from './parceiros.repository.js';
import { CreateParceiroDto } from './dto/create-parceiro.dto.js';
import { UpdateParceiroDto } from './dto/update-parceiro.dto.js';
import { LoginParceiroDto } from './dto/login-parceiro.dto.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ParceirosService {
    constructor(private readonly repository: ParceirosRepository) { }

    // 1. Registo de um novo parceiro
    async criar(dto: CreateParceiroDto) {
        const parceiroExistente = await this.repository.buscarPorEmail(dto.email);
        if (parceiroExistente) {
            throw new ConflictException('Este email já está registado.');
        }

        const saltRounds = 10;
        const senhaHash = await bcrypt.hash(dto.senha, saltRounds);

        const novoParceiro = await this.repository.criar(dto, senhaHash);

        const { senha_hash, ...resposta } = novoParceiro;
        return resposta;
    }

    // 2. Listar todos os parceiros aprovados (para o público)
    async listarAprovados() {
        const parceiros = await this.repository.listarAprovados();
        return parceiros.map(({ senha_hash, ...p }) => p);
    }

    // 3. Listar parceiros pendentes (para o Admin)
    async listarPendentes() {
        const parceiros = await this.repository.listarPendentes();
        return parceiros.map(({ senha_hash, ...p }) => p);
    }

    // 4. Buscar um parceiro pelo ID
    async buscarPorId(id: string) {
        const parceiro = await this.repository.buscarPorId(id);

        if (!parceiro) {
            throw new NotFoundException(`Parceiro com ID ${id} não encontrado.`);
        }

        const { senha_hash, ...resposta } = parceiro;
        return resposta;
    }

    // 5. Atualizar dados do parceiro
    // 5. Atualizar dados do parceiro
    async atualizar(id: string, dto: UpdateParceiroDto) {
        const parceiroExistente = await this.repository.buscarPorId(id);
        if (!parceiroExistente) {
            throw new NotFoundException(`Parceiro com ID ${id} não encontrado.`);
        }

        // O segredo está aqui: dizemos que é um Record<string, any>
        const dadosParaAtualizar: Record<string, any> = { ...dto };

        // Se o utilizador quiser mudar a senha, encriptamos
        if (dto.senha) {
            const saltRounds = 10;
            dadosParaAtualizar.senha_hash = await bcrypt.hash(dto.senha, saltRounds);
            delete dadosParaAtualizar.senha;
        }

        const parceiroAtualizado = await this.repository.atualizar(id, dadosParaAtualizar);

        if (!parceiroAtualizado) {
            throw new NotFoundException(`Erro ao atualizar o parceiro com ID ${id}.`);
        }

        const { senha_hash, ...resposta } = parceiroAtualizado;
        return resposta;
    }

    // 6. Aprovar um parceiro (Ação do Admin)
    async aprovar(id: string, adminId: number = 1) {
        const parceiro = await this.repository.buscarPorId(id);
        if (!parceiro) {
            throw new NotFoundException(`Parceiro com ID ${id} não encontrado.`);
        }

        const parceiroAprovado = await this.repository.aprovar(id, adminId);

        // Verificação de nulidade para o TypeScript ficar feliz
        if (!parceiroAprovado) {
            throw new NotFoundException(`Erro ao aprovar o parceiro com ID ${id}.`);
        }

        const { senha_hash, ...resposta } = parceiroAprovado;
        return resposta;
    }

    // 7. Login (Verificar credenciais)
    async login(dto: LoginParceiroDto) {
        const parceiro = await this.repository.buscarPorEmail(dto.email);

        if (!parceiro) {
            throw new UnauthorizedException('Credenciais inválidas.');
        }

        const senhaValida = await bcrypt.compare(dto.senha, parceiro.senha_hash);
        if (!senhaValida) {
            throw new UnauthorizedException('Credenciais inválidas.');
        }

        if (parceiro.status !== 'aprovado') {
            throw new UnauthorizedException(`A sua conta está com o estado: ${parceiro.status}.`);
        }

        return { mensagem: 'Login efetuado com sucesso!', parceiro_id: parceiro.id };
    }
}