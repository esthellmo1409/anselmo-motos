import { SITE } from '@/config/site';
import { TIPO_VEICULO_LABEL, type PlanoId, type TipoVeiculo } from '@/types';
import { formatBRL, formatCredito } from './format';

export interface DadosMensagem {
  nome?: string;
  cidade?: string;
  tipoVeiculo?: TipoVeiculo;
  veiculo?: string;
  credito?: number;
  plano?: PlanoId;
  parcela?: number | null;
}

/** Mensagem que o cliente envia ao sair do site para o WhatsApp. */
export function montarMensagemLead(d: DadosMensagem) {
  const linhas = [
    d.nome ? `Olá! Meu nome é ${d.nome.trim()}.` : 'Olá!',
    'Fiz uma simulação na Anselmo Motos.',
    '',
  ];
  if (d.tipoVeiculo) linhas.push(`Tenho interesse em: ${TIPO_VEICULO_LABEL[d.tipoVeiculo]}`);
  if (d.credito) linhas.push(`Carta de crédito: ${formatCredito(d.credito)}`);
  if (d.plano) linhas.push(`Plano: ${d.plano}%`);
  if (d.parcela) linhas.push(`Parcela apresentada: ${formatBRL(d.parcela)}`);
  if (d.veiculo) linhas.push(`Modelo de interesse: ${d.veiculo}`);
  if (d.cidade) linhas.push(`Cidade: ${d.cidade}`);
  linhas.push('', 'Gostaria de saber mais sobre o consórcio.');
  return linhas.join('\n');
}

export function linkWhatsApp(mensagem: string, numero: string = SITE.whatsapp) {
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
}
