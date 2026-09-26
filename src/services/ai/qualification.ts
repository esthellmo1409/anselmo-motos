import { veiculosAtivos } from '@/data/veiculos';
import { normaliza } from '@/lib/format';
import { parseCredito, parsePlano } from '@/lib/simulation';
import type { DadosQualificacao, Interesse } from '@/types';

type Campo = keyof DadosQualificacao;

/**
 * Perguntas da qualificação, na ordem em que a IA tenta preencher.
 * Edite o texto à vontade. A IA faz UMA pergunta por vez e pula o que já sabe.
 */
export const PERGUNTAS: Partial<Record<Campo, string>> = {
  nome: 'Pra eu te atender melhor, qual é o seu nome?',
  cidade: 'Você é de qual cidade?',
  tipoVeiculo: 'Você está procurando carro ou moto?',
  veiculo: 'Já tem algum modelo em mente?',
  credito: 'Tem ideia do valor da carta, ou de quanto gostaria de pagar por mês?',
  plano: 'Prefere ver no Plano 100% ou no Plano 70%?',
  possuiVeiculo: 'Hoje você já tem carro ou moto?',
  objetivo: 'A ideia é trocar o seu veículo ou comprar mais um?',
  querVendedor: 'Quer que eu chame um especialista da loja pra continuar com você?',
};

/** Próximo dado que vale a pena perguntar. Retorna null quando não há mais nada útil. */
export function proximoCampo(d: DadosQualificacao): Campo | null {
  if (!d.nome) return 'nome';
  if (!d.cidade) return 'cidade';
  if (!d.tipoVeiculo) return 'tipoVeiculo';
  if (!d.veiculo) return 'veiculo';
  if (!d.credito && !d.faixaParcela) return 'credito';
  if (d.credito && !d.plano) return 'plano';
  if (d.possuiVeiculo === undefined) return 'possuiVeiculo';
  if (d.possuiVeiculo && !d.objetivo) return 'objetivo';
  if (d.querVendedor === undefined) return 'querVendedor';
  return null;
}

const SIM = /^(sim|s|claro|quero|pode|isso|com certeza|bora|ok|beleza|tenho|ja tenho)\b/;
const NAO = /^(nao|n|ainda nao|agora nao|nao tenho|depois)\b/;

/** Lê dados da mensagem do cliente. Usa a última pergunta para entender respostas curtas. */
export function extrairDados(texto: string, ultima?: Campo): DadosQualificacao {
  const t = normaliza(texto);
  const d: DadosQualificacao = {};

  // Mensagem vinda do site ("Meu nome é João. ... Carta de crédito: R$ 100.000 ...")
  const nome = texto.match(/(?:meu nome [eé]|me chamo|aqui [eé] o|aqui [eé] a|sou o|sou a)\s+([A-Za-zÀ-ú]+(?:\s+[A-Za-zÀ-ú]+)?)/i);
  if (nome) d.nome = nome[1].trim();
  const cidade = texto.match(/cidade:\s*([^\n]+)/i) ?? texto.match(/\b(?:sou de|moro em)\s+([A-Za-zÀ-ú\s]+?)(?:[.,!\n]|$)/i);
  if (cidade) d.cidade = cidade[1].trim();
  const modeloLinha = texto.match(/modelo de interesse:\s*([^\n]+)/i);
  if (modeloLinha) d.veiculo = modeloLinha[1].trim();

  // Carro ou moto
  const tipoLinha = t.match(/tenho interesse em:\s*(carro|moto)/);
  if (tipoLinha) d.tipoVeiculo = tipoLinha[1] === 'carro' ? 'CARRO' : 'MOTO';
  else if (/\b(carro|automovel|suv|picape|pickup|seda|sedan|hatch)\b/.test(t)) d.tipoVeiculo = 'CARRO';
  else if (/\b(moto|motocicleta|motinha)\b/.test(t)) d.tipoVeiculo = 'MOTO';

  const credito = parseCredito(texto);
  if (credito) d.credito = credito;
  const plano = parsePlano(texto);
  if (plano) d.plano = plano;

  const faixa = t.match(/(?:ate|no maximo|uns|cerca de|por volta de)\s*r?\$?\s*(\d{1,2}\.?\d{3}|\d{3,4})(?:,\d{2})?/);
  if (faixa && !credito) {
    const v = Number(faixa[1].replace('.', ''));
    if (v > 50 && v < 20000) d.faixaParcela = v;
  }

  if (!d.veiculo) {
    const v = veiculosAtivos().find((ve) => {
      // Reconhece pelo nome do modelo: "bros", "cg", "sahara", "suv"...
      const palavras = normaliza(ve.nome).split(' ').filter((w) => w !== 'honda' && /[a-z]{2,}/.test(w));
      return palavras.some((w) => new RegExp(`\\b${w}\\b`).test(t));
    });
    if (v) {
      d.veiculo = v.nome;
      d.tipoVeiculo ??= v.tipo;
    }
  }

  if (/\btrocar\b|\btroca\b/.test(t)) d.objetivo = 'TROCAR';
  if (/\b(outro|outra|mais um|mais uma|novo|nova|segundo|segunda)\b.*\b(carro|moto)|comprar (um |uma )?(novo|nova)/.test(t)) d.objetivo ??= 'COMPRAR_NOVA';

  // Respostas curtas à pergunta anterior
  switch (ultima) {
    case 'nome':
      if (!d.nome && /^[a-zà-ú]+(\s[a-zà-ú]+)?$/i.test(texto.trim())) d.nome = capitaliza(texto.trim());
      break;
    case 'cidade':
      if (!d.cidade && texto.trim().length <= 40 && !/\d/.test(texto)) d.cidade = capitaliza(texto.trim());
      break;
    case 'veiculo':
      if (!d.veiculo) d.veiculo = NAO.test(t) ? 'Ainda não definiu' : capitaliza(texto.trim()).slice(0, 60);
      break;
    case 'possuiVeiculo':
      if (SIM.test(t)) d.possuiVeiculo = true;
      else if (NAO.test(t)) d.possuiVeiculo = false;
      break;
    case 'objetivo':
      if (!d.objetivo) d.objetivo = /troc/.test(t) ? 'TROCAR' : 'COMPRAR_NOVA';
      break;
    case 'querVendedor':
      if (SIM.test(t)) d.querVendedor = true;
      else if (NAO.test(t)) d.querVendedor = false;
      break;
  }
  if (/\bja tenho (um |uma )?(carro|moto)|tenho (um carro|uma moto)\b/.test(t)) d.possuiVeiculo = true;
  if (/\bnao tenho (carro|moto|veiculo)\b/.test(t)) d.possuiVeiculo = false;
  return d;
}

/**
 * REGRA DE TRANSFERÊNCIA PARA HUMANO.
 * Se qualquer padrão bater, a IA para de vender e chama um atendente.
 */
const GATILHOS_HUMANO: { motivo: string; re: RegExp }[] = [
  { motivo: 'Cliente quer fechar', re: /\b(quero fechar|vamos fechar|fechar negocio|fechado|pode fechar|quero contratar|quero assinar|como pago|quero entrar no grupo)\b/ },
  { motivo: 'Cliente quer comprar', re: /\b(quero comprar|vou comprar|quero adquirir|quero essa)\b/ },
  { motivo: 'Pediu atendimento humano', re: /\b(falar com (um |uma )?(vendedor|vendedora|atendente|humano|pessoa|especialista|consultor|gerente)|atendente humano|pessoa de verdade|nao quero robo|e um robo)\b/ },
  { motivo: 'Negociação de condição', re: /\b(desconto|lance|negociar|entrada|contemplacao garantida|garantia de contemplacao)\b/ },
  { motivo: 'Reclamação', re: /\b(reclama|problema com|insatisfeit|procon)\b/ },
];

export function detectarHandoff(texto: string, botaoId?: string): string | null {
  if (botaoId === 'FALAR_ESPECIALISTA') return 'Pediu atendimento humano';
  const t = normaliza(texto);
  return GATILHOS_HUMANO.find((g) => g.re.test(t))?.motivo ?? null;
}

export function calcularInteresse(d: DadosQualificacao, sinalCompra: boolean): Interesse {
  if (sinalCompra || d.querVendedor) return 'ALTO';
  if (d.credito && d.plano) return 'MEDIO';
  return 'BAIXO';
}

function capitaliza(s: string) {
  return s.toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase());
}
