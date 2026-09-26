import { NextResponse } from 'next/server';
import { lerWebhookMeta } from '@/services/whatsapp/whatsappProvider';
import { processarMensagemRecebida } from '@/services/ai/aiService';

/**
 * Webhook do WhatsApp Cloud API.
 * Configure na Meta: URL = https://SEU-DOMINIO/api/whatsapp/webhook
 * Verify token = valor de WHATSAPP_VERIFY_TOKEN.
 */
export async function GET(req: Request) {
  const p = new URL(req.url).searchParams;
  if (p.get('hub.mode') === 'subscribe' && p.get('hub.verify_token') === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new Response(p.get('hub.challenge') ?? '', { status: 200 });
  }
  return new Response('Forbidden', { status: 403 });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const mensagens = lerWebhookMeta(body);
  for (const m of mensagens) {
    try {
      await processarMensagemRecebida(m);
    } catch (e) {
      console.error('[webhook] erro ao processar', e);
    }
  }
  // A Meta exige 200 rápido; erros são registrados no log.
  return NextResponse.json({ ok: true });
}
