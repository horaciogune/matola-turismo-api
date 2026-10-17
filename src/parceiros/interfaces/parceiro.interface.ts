export interface Parceiro {
  id: string; 
  nome_responsavel: string;
  email: string;
  senha_hash: string;
  telefone: string | null;
  nome_estabelecimento: string;
  categoria_id: number | null; 
  descricao: string | null;
  horario: string | null;
  endereco: string | null;
  latitude: number | null;
  longitude: number | null;
  foto_url: string | null;
  status: string;
  motivo_status: string | null;
  aprovado_por: number | null;
  aprovado_em: Date | null;
  criado_em: Date;
  atualizado_em: Date | null;
}

export interface ParceiroResposta {
  id: string; 
  nome_responsavel: string;
  email: string;
  telefone: string | null;
  nome_estabelecimento: string;
  categoria_id: number | null;
  descricao: string | null;
  horario: string | null;
  endereco: string | null;
  latitude: number | null;
  longitude: number | null;
  foto_url: string | null;
  status: string;
  criado_em: Date;
}