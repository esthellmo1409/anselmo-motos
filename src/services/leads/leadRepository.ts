import type {
  Conversa,
  HistoricoStatus,
  Lead,
  LeadStatus,
  Mensagem,
} from '@/types';

/**
 * Contrato de persistência. Hoje existe uma implementação em memória
 * (boa para desenvolvimento). Para produção, crie uma implementação
 * com Prisma/Postgres seguindo prisma/schema.prisma e troque em getRepository().
 */
export interface Repository {
  criarLead(dados: Omit<Lead, 'id' | 'criadoEm' | 'atualizadoEm'>): Promise<Lead>;
  atualizarLead(id: string, dados: Partial<Lead>): Promise<Lead | null>;
  buscarLead(id: string): Promise<Lead | null>;
  buscarLeadPorWhatsapp(whatsapp: string): Promise<Lead | null>;
  listarLeads(filtro?: { status?: LeadStatus }): Promise<Lead[]>;
  mudarStatus(id: string, para: LeadStatus, autor: HistoricoStatus['autor'], obs?: string): Promise<Lead | null>;
  historico(leadId: string): Promise<HistoricoStatus[]>;

  buscarConversaAtiva(leadId: string): Promise<Conversa | null>;
  salvarConversa(c: Conversa): Promise<Conversa>;
  adicionarMensagem(m: Omit<Mensagem, 'id' | 'criadoEm'>): Promise<Mensagem>;
  mensagens(conversaId: string, limite?: number): Promise<Mensagem[]>;
}

const agora = () => new Date().toISOString();
export const novoId = () =>
  (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`);

class MemoryRepository implements Repository {
  leads = new Map<string, Lead>();
  conversas = new Map<string, Conversa>();
  msgs: Mensagem[] = [];
  hist: HistoricoStatus[] = [];

  async criarLead(dados: Omit<Lead, 'id' | 'criadoEm' | 'atualizadoEm'>) {
    const lead: Lead = { ...dados, id: novoId(), criadoEm: agora(), atualizadoEm: agora() };
    this.leads.set(lead.id, lead);
    this.hist.push({ id: novoId(), leadId: lead.id, de: null, para: lead.status, autor: 'SISTEMA', criadoEm: agora() });
    return lead;
  }
  async atualizarLead(id: string, dados: Partial<Lead>) {
    const atual = this.leads.get(id);
    if (!atual) return null;
    const novo = { ...atual, ...dados, id, atualizadoEm: agora() };
    this.leads.set(id, novo);
    return novo;
  }
  async buscarLead(id: string) {
    return this.leads.get(id) ?? null;
  }
  async buscarLeadPorWhatsapp(whatsapp: string) {
    return [...this.leads.values()].find((l) => l.whatsapp === whatsapp) ?? null;
  }
  async listarLeads(filtro?: { status?: LeadStatus }) {
    return [...this.leads.values()]
      .filter((l) => !filtro?.status || l.status === filtro.status)
      .sort((a, b) => b.criadoEm.localeCompare(a.criadoEm));
  }
  async mudarStatus(id: string, para: LeadStatus, autor: HistoricoStatus['autor'], observacao?: string) {
    const lead = this.leads.get(id);
    if (!lead) return null;
    this.hist.push({ id: novoId(), leadId: id, de: lead.status, para, autor, observacao, criadoEm: agora() });
    return this.atualizarLead(id, { status: para });
  }
  async historico(leadId: string) {
    return this.hist.filter((h) => h.leadId === leadId);
  }
  async buscarConversaAtiva(leadId: string) {
    return [...this.conversas.values()].find((c) => c.leadId === leadId) ?? null;
  }
  async salvarConversa(c: Conversa) {
    const salva = { ...c, atualizadoEm: agora() };
    this.conversas.set(c.id, salva);
    return salva;
  }
  async adicionarMensagem(m: Omit<Mensagem, 'id' | 'criadoEm'>) {
    const msg: Mensagem = { ...m, id: novoId(), criadoEm: agora() };
    this.msgs.push(msg);
    return msg;
  }
  async mensagens(conversaId: string, limite = 30) {
    return this.msgs.filter((m) => m.conversaId === conversaId).slice(-limite);
  }
}

// Mantém uma única instância entre recarregamentos no modo dev.
const g = globalThis as unknown as { __anselmoRepo?: Repository };
export function getRepository(): Repository {
  if (!g.__anselmoRepo) g.__anselmoRepo = new MemoryRepository();
  return g.__anselmoRepo;
}
