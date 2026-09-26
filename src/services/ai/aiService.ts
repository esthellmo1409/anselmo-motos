/**
 * ============================================================
 *  AI SERVICE — cérebro do atendimento no WhatsApp.
 *
 *  Fluxo: CLIENTE → WHATSAPP → IA → QUALIFICAÇÃO → EXPLICAÇÃO →
 *         SIMULAÇÃO → COLETA DE DADOS → TRANSFERÊNCIA PARA HUMANO
 *
 *  Princípio: números SEMPRE vêm da tabela (código), nunca do modelo
 *  de IA. O modelo só entra para conversa livre, e só se houver
 *  AI_API_KEY no servidor. Sem chave, tudo funciona por regras.
 * ============================================================
 */
import { SITE } from '@/config/site';
import { FAQ } from '@/data/faq';
import { PLANOS, TABELA } from '@/data/consorcioData';
import { formatBRL, formatCredito, formatCreditoCurto, normaliza } from '@/lib/format';
import { cartasAteParcela, getLinha, getParcela } from '@/lib/simulation';
import { montarMensagemLead, type DadosMensagem } from '@/lib/whatsapp';
import { getRepository, novoId } from '@/services/leads/leadRepository';
import { getWhatsAppProvider, type MensagemRecebida } from '@/services/whatsapp/whatsappProvider';
import type {
  BotaoRapido,
  Conversa,
  DadosQualificacao,
  Lead,
  LeadOrigem,
  PlanoId,
  TipoVeiculo,
} from '@/types';
import { TIPO_VEICULO_LABEL } from '@/types';
import {
  PERGUNTAS,
  calcularInteresse,
  detectarHandoff,
  extrairDados,
  proximoCampo,
} from './qualification';

export const BOTOES_SIMULACAO: BotaoRapido[] = [
  { id: 'CONTINUAR_SIMULACAO', titulo: 'Continuar simulação' },
  { id: 'FALAR_ESPECIALISTA', titulo: 'Falar com especialista' },
];

export const MENSAGEM_TRANSFERENCIA =
  'Perfeito! Vou encaminhar você para um de nossos especialistas da Anselmo Motos para continuar seu atendimento.\n\nSó um momento.';

/* ---------------------------------------------------------- */
/*  getConsorcioSimulation                                     */
/* ---------------------------------------------------------- */
export function getConsorcioSimulation(credito: number, plano?: PlanoId) {
  const linha = getLinha(credito);
  if (!linha) return null;
  const planos = PLANOS.filter((p) => !plano || p.id === plano).map((p) => ({
    plano: p.id,
    nome: p.nome,
    parcela: linha.parcelas[p.id],
  }));
  return { credito, planos };
}

export function textoSimulacao(credito: number) {
  const s = getConsorcioSimulation(credito);
  if (!s) {
    const min = formatCreditoCurto(TABELA[0].credito);
    const max = formatCreditoCurto(TABELA[TABELA.length - 1].credito);
    return `Não tenho essa carta na tabela. Os valores disponíveis vão de ${min} a ${max}.`;
  }
  return [
    `Claro! Para uma carta de ${formatCredito(credito)}, temos:`,
    '',
    ...s.planos.map((p) => `${p.nome}: ${formatBRL(p.parcela)}`),
    '',
    'Se quiser, posso continuar sua simulação e te encaminhar para um especialista.',
  ].join('\n');
}

/* ---------------------------------------------------------- */
/*  qualifyLead — responde a UMA mensagem do cliente           */
/* ---------------------------------------------------------- */
export interface RespostaIA {
  texto: string;
  botoes?: BotaoRapido[];
  dados: DadosQualificacao;
  ultimaPergunta?: keyof DadosQualificacao;
  /** Preenchido quando a conversa deve ir para um humano. */
  transferir?: string;
}

export async function qualifyLead(
  conversa: Pick<Conversa, 'dados' | 'ultimaPergunta'> & { id?: string },
  texto: string,
  botaoId?: string,
): Promise<RespostaIA> {
  const novos = extrairDados(texto, conversa.ultimaPergunta);
  const dados: DadosQualificacao = { ...conversa.dados, ...definidos(novos) };

  // 1. Regra de ouro: intenção de compra ou pedido de humano → transferir.
  const motivo = detectarHandoff(texto, botaoId) ?? (dados.querVendedor ? 'Aceitou falar com especialista' : null);
  if (motivo) return { texto: MENSAGEM_TRANSFERENCIA, dados: { ...dados, querVendedor: true }, transferir: motivo };

  const partes: string[] = [];
  let botoes: BotaoRapido[] | undefined;
  const t = normaliza(texto);
  const veioDoSite = /fiz uma simulacao na anselmo motos/.test(t);

  // 2. Mensagem vinda do simulador do site
  if (veioDoSite) {
    const p = dados.credito && dados.plano ? getParcela(dados.credito, dados.plano) : null;
    partes.push(
      `Oi${dados.nome ? `, ${dados.nome}` : ''}! Recebi sua simulação.` +
        (p && dados.credito && dados.plano
          ? ` Carta de ${formatCredito(dados.credito)} no Plano ${dados.plano}%, parcela de ${formatBRL(p)} pela nossa tabela.`
          : ''),
    );
  }
  // 3. Pergunta de valor ("quanto fica uma carta de 200 mil?")
  else if (novos.credito) {
    partes.push(textoSimulacao(novos.credito));
    botoes = BOTOES_SIMULACAO;
  }
  // 4. Cliente disse quanto quer pagar por mês
  else if (novos.faixaParcela) {
    const opcoes = cartasAteParcela(novos.faixaParcela).filter((o) => o.linha);
    partes.push(
      opcoes.length
        ? [
            `Com parcela de até ${formatBRL(novos.faixaParcela)}, pela tabela:`,
            ...opcoes.map((o) => `Plano ${o.plano}%: carta de ${formatCredito(o.linha!.credito)} (${formatBRL(o.linha!.parcelas[o.plano])})`),
          ].join('\n')
        : `A menor parcela da nossa tabela é ${formatBRL(Math.min(...TABELA.map((l) => l.parcelas['70'])))}. Um especialista pode ver outras opções com você.`,
    );
    botoes = BOTOES_SIMULACAO;
  }
  // 5. Dúvida frequente
  else {
    const faq = FAQ.find((f) => f.palavrasChave.some((k) => t.includes(normaliza(k))));
    if (faq) partes.push(faq.resposta);
    else if (novos.plano && dados.credito) {
      const p = getParcela(dados.credito, novos.plano)!;
      partes.push(`No Plano ${novos.plano}%, a carta de ${formatCredito(dados.credito)} fica em ${formatBRL(p)}.`);
    } else if (Object.keys(definidos(novos)).length === 0 && process.env.AI_API_KEY && conversa.id) {
      // 6. Conversa livre → modelo de IA (servidor), com a tabela no prompt.
      const { perguntarLLM } = await import('./llmClient');
      const repo = getRepository();
      const historico = await repo.mensagens(conversa.id);
      const r = await perguntarLLM(historico, JSON.stringify(dados));
      if (r) partes.push(r);
    } else if (!conversa.ultimaPergunta && !Object.keys(conversa.dados).length) {
      partes.push(`Olá! Aqui é o atendimento da ${SITE.nome}. Posso te mostrar a parcela de qualquer carta da nossa tabela e tirar suas dúvidas sobre o consórcio.`);
    }
  }

  // 7. Próxima pergunta (só uma, e só se ainda faz sentido)
  const campo = proximoCampo(dados);
  if (campo && campo !== conversa.ultimaPergunta && !botoes) partes.push(PERGUNTAS[campo]!);
  else if (campo && botoes) {
    // Com botões na tela, a pergunta vem depois que o cliente tocar em "Continuar".
  } else if (campo && campo === conversa.ultimaPergunta && partes.length === 0) {
    partes.push(`Sem problemas. ${PERGUNTAS[campo]}`);
  }
  if (botaoId === 'CONTINUAR_SIMULACAO' && campo && partes.length === 0) partes.push(PERGUNTAS[campo]!);
  if (!campo && partes.length === 0) partes.push('Posso te ajudar com mais alguma dúvida?');

  return {
    texto: partes.join('\n\n'),
    botoes,
    dados,
    ultimaPergunta: botoes ? conversa.ultimaPergunta : campo ?? undefined,
  };
}

/* ---------------------------------------------------------- */
/*  generateWhatsAppMessage                                    */
/* ---------------------------------------------------------- */
export function generateWhatsAppMessage(d: DadosMensagem) {
  return montarMensagemLead(d);
}

/* ---------------------------------------------------------- */
/*  saveLead                                                   */
/* ---------------------------------------------------------- */
export interface NovoLead {
  nome: string;
  whatsapp: string;
  cidade?: string;
  tipoVeiculo?: TipoVeiculo;
  veiculo?: string;
  credito?: number;
  plano?: PlanoId;
  origem?: LeadOrigem;
  utm?: Record<string, string>;
}

export async function saveLead(input: NovoLead): Promise<Lead> {
  const repo = getRepository();
  const parcela = input.credito && input.plano ? getParcela(input.credito, input.plano) ?? undefined : undefined;
  const existente = await repo.buscarLeadPorWhatsapp(input.whatsapp);
  if (existente) {
    return (await repo.atualizarLead(existente.id, { ...definidos(input), parcela }))!;
  }
  return repo.criarLead({
    ...input,
    parcela,
    origem: input.origem ?? 'SITE',
    status: 'NOVO',
    interesse: calcularInteresse(input, false),
  });
}

/* ---------------------------------------------------------- */
/*  getLeadSummary — o que o vendedor recebe                   */
/* ---------------------------------------------------------- */
const ORIGEM_LABEL: Record<LeadOrigem, string> = {
  SITE: 'Site Anselmo Motos',
  WHATSAPP: 'WhatsApp',
  INSTAGRAM: 'Instagram',
  FACEBOOK: 'Facebook',
  GOOGLE: 'Google',
  OUTRO: 'Outro',
};

export function getLeadSummary(lead: Lead, motivo?: string) {
  const parcela = lead.parcela ?? (lead.credito && lead.plano ? getParcela(lead.credito, lead.plano) : null);
  const linhas = [
    'LEAD',
    `Nome: ${lead.nome || 'Não informado'}`,
    `WhatsApp: ${lead.whatsapp}`,
    `Cidade: ${lead.cidade ?? 'Não informada'}`,
    `Tipo: ${lead.tipoVeiculo ? TIPO_VEICULO_LABEL[lead.tipoVeiculo] : 'Não informado'}`,
    `Modelo: ${lead.veiculo ?? 'Não informado'}`,
    `Carta: ${lead.credito ? formatCredito(lead.credito) : 'Não informada'}`,
    `Plano: ${lead.plano ? `${lead.plano}%` : 'Não informado'}`,
    `Parcela apresentada: ${parcela ? formatBRL(parcela) : '-'}`,
  ];
  if (lead.faixaParcela) linhas.push(`Parcela desejada: até ${formatBRL(lead.faixaParcela)}`);
  if (lead.possuiVeiculo !== undefined) linhas.push(`Já tem veículo: ${lead.possuiVeiculo ? 'Sim' : 'Não'}`);
  if (lead.objetivo) linhas.push(`Objetivo: ${lead.objetivo === 'TROCAR' ? 'Trocar' : 'Comprar nova'}`);
  linhas.push(`Interesse: ${lead.interesse}`, `Origem: ${ORIGEM_LABEL[lead.origem]}`);
  if (motivo) linhas.push(`Motivo da transferência: ${motivo}`);
  return linhas.join('\n');
}

/* ---------------------------------------------------------- */
/*  handoffToHuman — IA sai, vendedor entra                    */
/* ---------------------------------------------------------- */
export async function handoffToHuman(lead: Lead, conversa: Conversa, motivo: string) {
  const repo = getRepository();
  const wa = getWhatsAppProvider();

  // A partir daqui a IA não responde mais nesta conversa.
  await repo.salvarConversa({ ...conversa, modo: 'HUMANO' });
  const atualizado = (await repo.atualizarLead(lead.id, {
    ...definidos(conversa.dados),
    interesse: 'ALTO',
    querVendedor: true,
  }))!;
  await repo.mudarStatus(lead.id, 'AGUARDANDO_HUMANO', 'IA', motivo);

  const resumo = getLeadSummary(atualizado, motivo);
  const vendedores = (process.env.SELLER_WHATSAPP_NUMBERS ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  await Promise.all(
    vendedores.map((v) =>
      wa.enviarTexto(v, `${resumo}\n\nResponder: https://wa.me/${lead.whatsapp}`),
    ),
  );
  await repo.adicionarMensagem({ conversaId: conversa.id, autor: 'SISTEMA', texto: `Transferido para humano: ${motivo}` });
  return { resumo, mensagemCliente: MENSAGEM_TRANSFERENCIA };
}

/* ---------------------------------------------------------- */
/*  Orquestrador usado pelo webhook do WhatsApp                */
/* ---------------------------------------------------------- */
export async function processarMensagemRecebida(msg: MensagemRecebida) {
  const repo = getRepository();
  const wa = getWhatsAppProvider();

  let lead = await repo.buscarLeadPorWhatsapp(msg.de);
  if (!lead) {
    lead = await repo.criarLead({
      nome: msg.nome ?? '',
      whatsapp: msg.de,
      origem: 'WHATSAPP',
      status: 'NOVO',
      interesse: 'BAIXO',
    });
  }
  const origemSite = lead.origem === 'SITE';

  let conversa = await repo.buscarConversaAtiva(lead.id);
  if (!conversa) {
    conversa = await repo.salvarConversa({
      id: novoId(),
      leadId: lead.id,
      canal: 'WHATSAPP',
      modo: 'IA',
      dados: definidos({
        nome: lead.nome || undefined,
        cidade: lead.cidade,
        tipoVeiculo: lead.tipoVeiculo,
        veiculo: lead.veiculo,
        credito: lead.credito,
        plano: lead.plano,
        whatsapp: lead.whatsapp,
      }),
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
    });
  }

  await repo.adicionarMensagem({ conversaId: conversa.id, autor: 'CLIENTE', texto: msg.texto });

  // Conversa já está com humano: a IA fica em silêncio.
  if (conversa.modo === 'HUMANO') return { respondeu: false as const };

  if (lead.status === 'NOVO') await repo.mudarStatus(lead.id, 'IA_ATENDENDO', 'IA');

  const r = await qualifyLead(conversa, msg.texto, msg.botaoId);
  conversa = await repo.salvarConversa({ ...conversa, dados: r.dados, ultimaPergunta: r.ultimaPergunta });
  lead = (await repo.atualizarLead(lead.id, {
    ...definidos(r.dados),
    nome: r.dados.nome ?? lead.nome,
    interesse: calcularInteresse(r.dados, !!r.transferir),
  }))!;

  if (r.botoes) await wa.enviarBotoes(msg.de, r.texto, r.botoes);
  else await wa.enviarTexto(msg.de, r.texto);
  await repo.adicionarMensagem({ conversaId: conversa.id, autor: 'IA', texto: r.texto });

  if (r.transferir) {
    await handoffToHuman(lead, conversa, r.transferir);
  } else if (!proximoCampo(r.dados) && lead.status !== 'QUALIFICADO') {
    await repo.mudarStatus(lead.id, 'QUALIFICADO', 'IA');
  }
  return { respondeu: true as const, texto: r.texto, origemSite };
}

/** Remove chaves undefined para não apagar dados já coletados. */
function definidos<T extends object>(o: T): Partial<T> {
  return Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && v !== '')) as Partial<T>;
}
