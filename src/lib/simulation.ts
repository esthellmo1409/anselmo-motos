import { TABELA, PLANOS } from '@/data/consorcioData';
import type { PlanoId } from '@/types';
import { normaliza } from './format';

export const CREDITOS = TABELA.map((l) => l.credito);

export const getLinha = (credito: number) => TABELA.find((l) => l.credito === credito);

/** Parcela exatamente como está na tabela. Retorna null se a carta não existir. */
export function getParcela(credito: number, plano: PlanoId): number | null {
  return getLinha(credito)?.parcelas[plano] ?? null;
}

export const nomePlano = (plano: PlanoId) =>
  PLANOS.find((p) => p.id === plano)?.nome ?? `Plano ${plano}%`;

/**
 * Lê um valor de carta escrito pelo cliente: "200 mil", "200k", "R$ 200.000", "200000".
 * Só devolve valores que existem na tabela. Nada é arredondado ou inventado.
 */
export function parseCredito(texto: string): number | null {
  const t = normaliza(texto);
  const padroes: [RegExp, (m: RegExpMatchArray) => number][] = [
    [/(\d{2,3})\s*(mil|k)\b/, (m) => Number(m[1]) * 1000],
    [/(\d{2,3})[.\s](\d{3})(?:,\d{2})?(?!\d)/, (m) => Number(m[1] + m[2])],
    [/\b(\d{5,6})\b/, (m) => Number(m[1])],
  ];
  for (const [re, fn] of padroes) {
    const m = t.match(re);
    if (m) {
      const v = fn(m);
      if (getLinha(v)) return v;
    }
  }
  return null;
}

/** Identifica o plano citado ("plano 70", "70%", "setenta"). */
export function parsePlano(texto: string): PlanoId | null {
  const t = normaliza(texto);
  if (/\b70\s*%|plano\s*(de\s*)?70|setenta/.test(t)) return '70';
  if (/\b100\s*%|plano\s*(de\s*)?100|cem por cento|integral/.test(t)) return '100';
  return null;
}

/** Maior carta cuja parcela cabe no valor informado, por plano. */
export function cartasAteParcela(valorMaximo: number) {
  return (['100', '70'] as PlanoId[]).map((plano) => {
    const cabem = TABELA.filter((l) => l.parcelas[plano] <= valorMaximo);
    const maior = [...cabem].sort((a, b) => b.credito - a.credito)[0];
    return { plano, linha: maior ?? null };
  });
}
