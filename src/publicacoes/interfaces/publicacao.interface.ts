export interface Publicacao {
  id: string; 
  parceiro_id: string; 
  titulo: string;
  conteudo: string | null;
  foto_url: string | null;
  status: string;
  motivo_status: string | null;
  criado_em: Date;
  atualizado_em: Date | null;
}