const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const brlInteiro = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

/** Troca o espaço não separável do Intl por espaço normal (melhor no WhatsApp). */
const limpa = (s: string) => s.replace(/\u00a0/g, ' ');

/** R$ 1.198,31 */
export const formatBRL = (v: number) => limpa(brl.format(v));
/** R$ 100.000 */
export const formatCredito = (v: number) => limpa(brlInteiro.format(v));
/** R$ 100 mil */
export const formatCreditoCurto = (v: number) =>
  v >= 1000 ? `R$ ${(v / 1000).toLocaleString('pt-BR')} mil` : formatCredito(v);

export const soDigitos = (s: string) => s.replace(/\D/g, '');

/** Máscara (99) 99999-9999 enquanto o usuário digita. */
export function mascaraTelefone(valor: string) {
  const d = soDigitos(valor).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : '';
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/** Celular BR válido: DDD + 9 dígitos começando com 9 (aceita DDI 55). */
export function telefoneValido(valor: string) {
  let d = soDigitos(valor);
  if (d.length === 13 && d.startsWith('55')) d = d.slice(2);
  return d.length === 11 && d[2] === '9';
}

/** Normaliza para o formato internacional usado pelo WhatsApp: 55 + DDD + número. */
export function telefoneInternacional(valor: string) {
  const d = soDigitos(valor);
  return d.startsWith('55') && d.length >= 12 ? d : `55${d}`;
}

/** Remove acentos e deixa minúsculo (usado na leitura de mensagens). */
export const normaliza = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
