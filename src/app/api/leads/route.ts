import { NextResponse } from 'next/server';
import { saveLead, generateWhatsAppMessage } from '@/services/ai/aiService';
import { getLinha, getParcela } from '@/lib/simulation';
import { linkWhatsApp } from '@/lib/whatsapp';
import { telefoneInternacional, telefoneValido } from '@/lib/format';
import type { PlanoId } from '@/types';

/** POST /api/leads — recebe o formulário do simulador. */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ erro: 'JSON inválido' }, { status: 400 });
  }

  const nome = String(body.nome ?? '').trim().slice(0, 80);
  const whatsapp = String(body.whatsapp ?? '');
  const cidade = String(body.cidade ?? '').trim().slice(0, 60) || undefined;
  const veiculo = String(body.veiculo ?? '').trim().slice(0, 80) || undefined;
  const tipoVeiculo = body.tipoVeiculo === 'CARRO' || body.tipoVeiculo === 'MOTO' ? body.tipoVeiculo : undefined;
  const credito = Number(body.credito) || undefined;
  const plano = body.plano === '70' || body.plano === '100' ? (body.plano as PlanoId) : undefined;

  if (nome.length < 2) return NextResponse.json({ erro: 'Informe seu nome.' }, { status: 422 });
  if (!telefoneValido(whatsapp)) return NextResponse.json({ erro: 'WhatsApp inválido.' }, { status: 422 });
  if (credito && !getLinha(credito)) return NextResponse.json({ erro: 'Carta fora da tabela.' }, { status: 422 });

  const utm = typeof body.utm === 'object' && body.utm ? (body.utm as Record<string, string>) : undefined;
  const origem = utm?.utm_source?.includes('insta') ? 'INSTAGRAM'
    : utm?.utm_source?.includes('face') || utm?.fbclid ? 'FACEBOOK'
    : utm?.utm_source?.includes('google') || utm?.gclid ? 'GOOGLE'
    : 'SITE';

  const lead = await saveLead({ nome, whatsapp: telefoneInternacional(whatsapp), cidade, tipoVeiculo, veiculo, credito, plano, origem, utm });
  const parcela = credito && plano ? getParcela(credito, plano) : null;
  const mensagem = generateWhatsAppMessage({ nome, cidade, tipoVeiculo, veiculo, credito, plano, parcela });

  return NextResponse.json({ id: lead.id, whatsappUrl: linkWhatsApp(mensagem) }, { status: 201 });
}
