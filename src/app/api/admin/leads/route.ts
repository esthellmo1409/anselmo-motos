import { NextResponse } from 'next/server';
import { getRepository } from '@/services/leads/leadRepository';
import type { LeadStatus } from '@/types';

/** GET /api/admin/leads — protegido pelo middleware (senha do painel). */
export async function GET(req: Request) {
  const status = new URL(req.url).searchParams.get('status') as LeadStatus | null;
  const repo = getRepository();
  const leads = await repo.listarLeads(status ? { status } : undefined);
  const todos = status ? await repo.listarLeads() : leads;
  const hoje = new Date().toISOString().slice(0, 10);
  const conta = (s: LeadStatus[]) => todos.filter((l) => s.includes(l.status)).length;
  return NextResponse.json({
    resumo: {
      hoje: todos.filter((l) => l.criadoEm.startsWith(hoje)).length,
      novos: conta(['NOVO']),
      emAtendimento: conta(['IA_ATENDENDO', 'QUALIFICADO', 'EM_NEGOCIACAO']),
      transferidos: conta(['AGUARDANDO_HUMANO']),
      convertidos: conta(['CONVERTIDO']),
    },
    leads,
  });
}
