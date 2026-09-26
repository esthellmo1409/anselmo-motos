/* Tipos centrais do domínio. Usados pelo site, pela API, pela IA e pelo painel. */

export type PlanoId = '100' | '70';

export type TipoVeiculo = 'CARRO' | 'MOTO';
export const TIPO_VEICULO_LABEL: Record<TipoVeiculo, string> = { CARRO: 'Carro', MOTO: 'Moto' };

export type LeadStatus =
  | 'NOVO'
  | 'IA_ATENDENDO'
  | 'QUALIFICADO'
  | 'AGUARDANDO_HUMANO'
  | 'EM_NEGOCIACAO'
  | 'CONVERTIDO'
  | 'PERDIDO';

export const LEAD_STATUS: { id: LeadStatus; label: string }[] = [
  { id: 'NOVO', label: 'Novo' },
  { id: 'IA_ATENDENDO', label: 'IA atendendo' },
  { id: 'QUALIFICADO', label: 'Qualificado' },
  { id: 'AGUARDANDO_HUMANO', label: 'Aguardando humano' },
  { id: 'EM_NEGOCIACAO', label: 'Em negociação' },
  { id: 'CONVERTIDO', label: 'Convertido' },
  { id: 'PERDIDO', label: 'Perdido' },
];

export type Interesse = 'BAIXO' | 'MEDIO' | 'ALTO';

export type LeadOrigem = 'SITE' | 'WHATSAPP' | 'INSTAGRAM' | 'FACEBOOK' | 'GOOGLE' | 'OUTRO';

export interface Simulacao {
  credito: number;
  plano: PlanoId;
  parcela: number;
  criadoEm: string;
}

/** Os 10 dados que a IA tenta coletar, sem repetir o que já sabe. */
export interface DadosQualificacao {
  nome?: string;
  cidade?: string;
  whatsapp?: string;
  tipoVeiculo?: TipoVeiculo;
  /** Modelo ou categoria de interesse (ex.: Honda CG 160, SUV). */
  veiculo?: string;
  credito?: number;
  plano?: PlanoId;
  faixaParcela?: number;
  possuiVeiculo?: boolean;
  objetivo?: 'TROCAR' | 'COMPRAR_NOVA';
  querVendedor?: boolean;
}

export interface Lead extends DadosQualificacao {
  id: string;
  nome: string;
  whatsapp: string;
  parcela?: number;
  interesse: Interesse;
  origem: LeadOrigem;
  status: LeadStatus;
  utm?: Record<string, string>;
  atendenteId?: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface Atendente {
  id: string;
  nome: string;
  whatsapp: string;
  ativo: boolean;
}

export type ModoConversa = 'IA' | 'HUMANO';

export interface Mensagem {
  id: string;
  conversaId: string;
  autor: 'CLIENTE' | 'IA' | 'ATENDENTE' | 'SISTEMA';
  texto: string;
  criadoEm: string;
}

export interface Conversa {
  id: string;
  leadId: string;
  canal: 'WHATSAPP';
  modo: ModoConversa;
  dados: DadosQualificacao;
  /** Último campo perguntado, para não repetir a mesma pergunta. */
  ultimaPergunta?: keyof DadosQualificacao;
  criadoEm: string;
  atualizadoEm: string;
}

export interface HistoricoStatus {
  id: string;
  leadId: string;
  de: LeadStatus | null;
  para: LeadStatus;
  autor: 'SISTEMA' | 'IA' | 'ATENDENTE';
  observacao?: string;
  criadoEm: string;
}

/** Botão de resposta rápida (WhatsApp interactive buttons, até 3). */
export interface BotaoRapido {
  id: 'CONTINUAR_SIMULACAO' | 'FALAR_ESPECIALISTA' | string;
  titulo: string;
}
