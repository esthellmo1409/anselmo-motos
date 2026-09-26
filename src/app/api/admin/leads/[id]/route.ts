import { NextResponse } from 'next/server';
import { getRepository } from '@/services/leads/leadRepository';
import { LEAD_STATUS, type LeadStatus } from '@/types';

/** PATCH /api/admin/leads/:id  { status } — o vendedor atualiza o funil. */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { status } = await req.json().catch(() => ({}));
  if (!LEAD_STATUS.some((s) => s.id === status)) return NextResponse.json({ erro: 'Status inválido' }, { status: 422 });
  const repo = getRepository();
  const lead = await repo.mudarStatus(id, status as LeadStatus, 'ATENDENTE');
  if (!lead) return NextResponse.json({ erro: 'Lead não encontrado' }, { status: 404 });
  // Quando o vendedor assume, a IA deixa de responder essa conversa.
  if (['EM_NEGOCIACAO', 'AGUARDANDO_HUMANO'].includes(status)) {
    const c = await repo.buscarConversaAtiva(id);
    if (c) await repo.salvarConversa({ ...c, modo: 'HUMANO' });
  }
  return NextResponse.json(lead);
}
