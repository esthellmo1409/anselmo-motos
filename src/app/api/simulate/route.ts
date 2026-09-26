import { NextResponse } from 'next/server';
import { getConsorcioSimulation } from '@/services/ai/aiService';
import { TABELA, PLANOS, TABELA_INFO } from '@/data/consorcioData';

/** GET /api/simulate?credito=200000  — ou sem parâmetro para a tabela completa. */
export async function GET(req: Request) {
  const credito = Number(new URL(req.url).searchParams.get('credito'));
  if (!credito) return NextResponse.json({ planos: PLANOS, tabela: TABELA, info: TABELA_INFO });
  const s = getConsorcioSimulation(credito);
  return s
    ? NextResponse.json(s)
    : NextResponse.json({ erro: 'Carta fora da tabela', disponiveis: TABELA.map((l) => l.credito) }, { status: 404 });
}
