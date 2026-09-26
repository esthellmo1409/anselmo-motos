import type { BotaoRapido } from '@/types';

/**
 * Camada de envio de mensagens. O resto do sistema só conhece esta interface,
 * então dá para trocar Meta Cloud API por Z-API, Evolution API, Twilio etc.
 * criando outra classe que implemente WhatsAppProvider.
 */
export interface WhatsAppProvider {
  enviarTexto(para: string, texto: string): Promise<void>;
  enviarBotoes(para: string, texto: string, botoes: BotaoRapido[]): Promise<void>;
}

export interface MensagemRecebida {
  de: string; // número do cliente (55DDDNUMERO)
  nome?: string; // nome do perfil do WhatsApp
  texto: string;
  botaoId?: string; // quando o cliente toca em um botão
}

/** Meta WhatsApp Cloud API (graph.facebook.com). */
class MetaCloudProvider implements WhatsAppProvider {
  constructor(private token: string, private phoneNumberId: string) {}

  private async post(body: unknown) {
    const res = await fetch(`https://graph.facebook.com/v21.0/${this.phoneNumberId}/messages`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) console.error('[whatsapp] falha no envio', res.status, await res.text());
  }

  enviarTexto(para: string, texto: string) {
    return this.post({ messaging_product: 'whatsapp', to: para, type: 'text', text: { body: texto } });
  }

  enviarBotoes(para: string, texto: string, botoes: BotaoRapido[]) {
    return this.post({
      messaging_product: 'whatsapp',
      to: para,
      type: 'interactive',
      interactive: {
        type: 'button',
        body: { text: texto },
        action: {
          buttons: botoes.slice(0, 3).map((b) => ({
            type: 'reply',
            reply: { id: b.id, title: b.titulo.slice(0, 20) },
          })),
        },
      },
    });
  }
}

/** Usado enquanto o WhatsApp não está conectado: só registra no log. */
class ConsoleProvider implements WhatsAppProvider {
  async enviarTexto(para: string, texto: string) {
    console.info(`[whatsapp:simulado] -> ${para}\n${texto}`);
  }
  async enviarBotoes(para: string, texto: string, botoes: BotaoRapido[]) {
    console.info(`[whatsapp:simulado] -> ${para}\n${texto}\n[${botoes.map((b) => b.titulo).join('] [')}]`);
  }
}

export function getWhatsAppProvider(): WhatsAppProvider {
  const token = process.env.WHATSAPP_TOKEN;
  const id = process.env.WHATSAPP_PHONE_NUMBER_ID;
  return token && id ? new MetaCloudProvider(token, id) : new ConsoleProvider();
}

/** Extrai as mensagens do payload do webhook da Meta. */
export function lerWebhookMeta(body: any): MensagemRecebida[] {
  const out: MensagemRecebida[] = [];
  for (const entry of body?.entry ?? []) {
    for (const change of entry?.changes ?? []) {
      const v = change?.value;
      const contatos = v?.contacts ?? [];
      for (const m of v?.messages ?? []) {
        const nome = contatos.find((c: any) => c.wa_id === m.from)?.profile?.name;
        if (m.type === 'text') out.push({ de: m.from, nome, texto: m.text?.body ?? '' });
        if (m.type === 'interactive') {
          const r = m.interactive?.button_reply ?? m.interactive?.list_reply;
          out.push({ de: m.from, nome, texto: r?.title ?? '', botaoId: r?.id });
        }
        if (m.type === 'button') out.push({ de: m.from, nome, texto: m.button?.text ?? '' });
      }
    }
  }
  return out;
}
