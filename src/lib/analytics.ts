/**
 * Eventos do funil. Funciona com Google Tag Manager (dataLayer) e Meta Pixel (fbq)
 * se estiverem instalados; caso contrário, não faz nada.
 */
type Evento =
  | 'simulador_valor'
  | 'simulador_plano'
  | 'form_aberto'
  | 'lead_enviado'
  | 'whatsapp_clique'
  | 'veiculo_escolhido'
  | 'simulador_tipo';

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    fbq?: (...args: unknown[]) => void;
  }
}

export function track(evento: Evento, dados: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;
  window.dataLayer?.push({ event: evento, ...dados });
  if (evento === 'lead_enviado') window.fbq?.('track', 'Lead', dados);
  if (evento === 'whatsapp_clique') window.fbq?.('track', 'Contact', dados);
}

/** Lê utm_source, utm_campaign etc. da URL para salvar junto com o lead. */
export function lerUtm(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const p = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  p.forEach((v, k) => {
    if (k.startsWith('utm_') || k === 'gclid' || k === 'fbclid') utm[k] = v;
  });
  return utm;
}
