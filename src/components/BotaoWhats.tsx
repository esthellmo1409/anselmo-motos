'use client';
import type { ReactNode } from 'react';
import { SITE } from '@/config/site';
import { linkWhatsApp } from '@/lib/whatsapp';
import { track } from '@/lib/analytics';

/** Link direto para o WhatsApp com mensagem de "falar com especialista". */
export function BotaoWhats({ children, className, origem, mensagem }: { children: ReactNode; className?: string; origem: string; mensagem?: string }) {
  return (
    <a
      href={linkWhatsApp(mensagem ?? SITE.mensagemEspecialista)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track('whatsapp_clique', { origem })}
      className={className}
    >
      {children}
    </a>
  );
}
