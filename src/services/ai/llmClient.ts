import 'server-only';
import type { Mensagem } from '@/types';
import { montarSystemPrompt } from './prompts';

/**
 * Cliente de IA. Roda somente no servidor; a chave vem de AI_API_KEY.
 * Retorna null se não houver chave configurada (o sistema cai no modo regras).
 * Para outro provedor, altere apenas esta função.
 */
export async function perguntarLLM(historico: Mensagem[], contextoExtra = ''): Promise<string | null> {
  const key = process.env.AI_API_KEY;
  if (!key) return null;

  const messages = historico
    .filter((m) => m.autor === 'CLIENTE' || m.autor === 'IA')
    .map((m) => ({ role: m.autor === 'CLIENTE' ? 'user' : 'assistant', content: m.texto }));
  if (!messages.length || messages[0].role !== 'user') return null;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.AI_MODEL ?? 'claude-sonnet-5',
        max_tokens: 400,
        system: montarSystemPrompt() + (contextoExtra ? `\n\nDADOS JÁ COLETADOS\n${contextoExtra}` : ''),
        messages,
      }),
    });
    if (!res.ok) {
      console.error('[ia] erro', res.status, await res.text());
      return null;
    }
    const data = await res.json();
    return (data.content ?? [])
      .filter((b: { type: string }) => b.type === 'text')
      .map((b: { text: string }) => b.text)
      .join('\n')
      .trim() || null;
  } catch (e) {
    console.error('[ia] falha de rede', e);
    return null;
  }
}
