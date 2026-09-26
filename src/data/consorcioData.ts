import type { PlanoId } from '@/types';

/**
 * ============================================================
 *  TABELA DO CONSÓRCIO — edite só este arquivo para mudar valores.
 *
 *  Valores iniciais fornecidos pela Anselmo Motos, copiados
 *  exatamente como enviados. Não foram corrigidos nem interpolados.
 *
 *  Para alterar uma parcela: troque o número (use ponto como
 *  separador decimal: 1198.31).
 *  Para adicionar uma carta: inclua uma nova linha em TABELA.
 *  Para remover: apague a linha. O simulador se ajusta sozinho.
 * ============================================================
 */

/** Condições informadas pela Anselmo Motos para o plano de consórcio. */
export const OFERTAS_CONSORCIO = [
  'Seu usado como lance',
  'Lance parcelado em 4x no boleto',
  'Lance parcelado em 18x nos cartões',
  'Consórcio com contemplação na 1ª parcela',
  'Consórcio já contemplado, no ponto de transferir',
  'Crédito de 12 mil a 1 milhão',
] as const;

export const PLANOS: { id: PlanoId; nome: string; resumo: string }[] = [
  {
    id: '100',
    nome: 'Plano 100%',
    resumo: 'Parcela integral da carta.', // [EDITAR] texto oficial do plano
  },
  {
    id: '70',
    nome: 'Plano 70%',
    resumo: 'Parcela menor que a do Plano 100%.', // [EDITAR] regra oficial do plano
  },
];

export interface LinhaTabela {
  credito: number;
  parcelas: Record<PlanoId, number>;
}

export const TABELA: LinhaTabela[] = [
  { credito: 100000, parcelas: { '100': 1198.31, '70': 915.12 } },
  { credito: 110000, parcelas: { '100': 1318.14, '70': 1006.73 } },
  { credito: 120000, parcelas: { '100': 1434.97, '70': 1098.25 } },
  { credito: 130000, parcelas: { '100': 1557.8, '70': 1189.77 } },
  { credito: 140000, parcelas: { '100': 1503.57, '70': 1229.02 } },
  { credito: 150000, parcelas: { '100': 1610.96, '70': 1316.81 } },
  { credito: 160000, parcelas: { '100': 1718.36, '70': 1404.6 } },
  { credito: 170000, parcelas: { '100': 1825.76, '70': 1492.38 } },
  { credito: 180000, parcelas: { '100': 1933.16, '70': 1580.17 } },
  { credito: 190000, parcelas: { '100': 2040.55, '70': 1667.96 } },
  { credito: 200000, parcelas: { '100': 2147.95, '70': 1755.74 } },
  { credito: 210000, parcelas: { '100': 2255.35, '70': 1443.53 } },
  { credito: 220000, parcelas: { '100': 2362.75, '70': 1931.32 } },
  { credito: 230000, parcelas: { '100': 2470.14, '70': 2019.11 } },
  { credito: 240000, parcelas: { '100': 2577.54, '70': 2106.89 } },
  { credito: 250000, parcelas: { '100': 2684.94, '70': 2194.68 } },
  { credito: 260000, parcelas: { '100': 2792.34, '70': 2282.47 } },
  { credito: 270000, parcelas: { '100': 2899.74, '70': 2370.25 } },
  { credito: 280000, parcelas: { '100': 3007.13, '70': 2458.04 } },
  { credito: 300000, parcelas: { '100': 3013.0, '70': 2642.82 } },
  { credito: 320000, parcelas: { '100': 3212.8, '70': 2819.02 } },
  { credito: 340000, parcelas: { '100': 3413.6, '70': 2995.2 } },
  { credito: 360000, parcelas: { '100': 3614.4, '70': 3171.38 } },
  { credito: 380000, parcelas: { '100': 3815.2, '70': 3347.57 } },
  { credito: 400000, parcelas: { '100': 4016.0, '70': 3523.76 } },
  { credito: 420000, parcelas: { '100': 4216.8, '70': 3699.95 } },
  { credito: 440000, parcelas: { '100': 4417.6, '70': 3876.14 } },
  { credito: 460000, parcelas: { '100': 4618.4, '70': 4052.32 } },
  { credito: 480000, parcelas: { '100': 4819.2, '70': 4228.51 } },
];

/** Informações da tabela que ainda não foram fornecidas. Preencha quando tiver. */
export const TABELA_INFO = {
  administradora: 'Consórcio Canopus',
  atualizadaEm: null as string | null, // ex.: '2026-09-01'
  prazoMeses: null as number | null, // [PREENCHER] se houver prazo único
  grupo: null as string | null, // [PREENCHER]
  aviso:
    'Valores de referência informados pela Anselmo Motos. Parcela, prazo, taxas e regras dependem do grupo e das condições vigentes na contratação.',
};

/** Carta que abre selecionada no simulador. */
export const CREDITO_PADRAO = 100000;
export const PLANO_PADRAO: PlanoId = '100';
