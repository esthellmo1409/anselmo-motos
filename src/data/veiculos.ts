import type { TipoVeiculo } from '@/types';

/**
 * ============================================================
 *  CARROS E MOTOS EXIBIDOS NO SITE — cadastre, edite ou remova aqui.
 *
 *  tipo:  'CARRO' ou 'MOTO' (define em qual aba o card aparece).
 *  foto:  coloque a imagem em /public/veiculos/ e informe o caminho.
 *         Use fotos que a loja tenha direito de usar.
 *  preco: opcional. Deixe sem para não mostrar preço.
 *  ativo: false esconde o card sem apagar o cadastro.
 *
 *  Os carros abaixo estão por CATEGORIA porque os modelos ainda
 *  não foram informados. Troque pelo nome real quando tiver.
 * ============================================================
 */
export interface Veiculo {
  id: string;
  tipo: TipoVeiculo;
  nome: string;
  categoria: string;
  descricao: string;
  /** Arquivo em /public/images/motos/<id>/principal.jpg — troque a foto sem mudar o restante. */
  foto: string;
  /** Fotos extras do mesmo modelo. Deixe vazio até existirem. */
  galeria?: string[];
  /** Recorte da foto principal, no formato do CSS object-position. */
  enquadramento?: string;
  preco?: number;
  ativo: boolean;
  /** true quando a moto for seminova. Não inventar ano nem quilometragem. */
  seminova?: boolean;
}

/** Foto da primeira tela. Substitua o arquivo em /public/images/hero/principal.jpg */
export const IMAGEM_HERO = '/images/hero/africa-twin.jpg';

export function nomeModelo(nome: string) {
  return nome.replace(/^Honda\s+/i, '');
}

const FOTO_CARRO = '/veiculos/placeholder-carro.svg';

export const VEICULOS: Veiculo[] = [
  // ---------- CARROS ---------- [EDITAR] troque pelos modelos que a loja trabalha
  { id: 'hatch', tipo: 'CARRO', nome: 'Hatch', categoria: 'Compacto', descricao: 'Fácil de estacionar e prático para a cidade.', foto: FOTO_CARRO, ativo: true },
  { id: 'seda', tipo: 'CARRO', nome: 'Sedã', categoria: 'Família', descricao: 'Mais espaço no porta-malas para a família.', foto: FOTO_CARRO, ativo: true },
  { id: 'suv', tipo: 'CARRO', nome: 'SUV', categoria: 'Utilitário', descricao: 'Posição de dirigir mais alta e espaço interno.', foto: FOTO_CARRO, ativo: true },
  { id: 'picape', tipo: 'CARRO', nome: 'Picape', categoria: 'Trabalho', descricao: 'Para quem precisa de caçamba no trabalho ou no campo.', foto: FOTO_CARRO, ativo: true },

  // ---------- MOTOS ----------
  { id: 'cg-160', tipo: 'MOTO', nome: 'Honda CG 160', categoria: 'Street', descricao: 'Para quem usa a moto todo dia, no trabalho e na cidade.', foto: '/images/motos/cg-160/principal.jpg', enquadramento: '55% 42%', ativo: true },
  { id: 'biz-125', tipo: 'MOTO', nome: 'Honda Biz 125', categoria: 'Cub', descricao: 'Prática para deslocamentos curtos e rotina urbana.', foto: '/images/motos/biz-125/principal.jpg', enquadramento: '50% 45%', ativo: true },
  { id: 'pop-110i', tipo: 'MOTO', nome: 'Honda Pop 110i', categoria: 'Entrada', descricao: 'Uma porta de entrada para quem vai ter a primeira moto.', foto: '/images/motos/pop-110i/principal.jpg', enquadramento: '28% 55%', ativo: true },
  { id: 'bros-160', tipo: 'MOTO', nome: 'Honda NXR 160 Bros', categoria: 'Trail', descricao: 'Para quem alterna asfalto e estrada de terra.', foto: '/images/motos/bros-160/principal.jpg', enquadramento: '42% 40%', ativo: true },
  { id: 'sahara-300', tipo: 'MOTO', nome: 'Honda Sahara 300', categoria: 'Trail', descricao: 'Para viagens e caminhos mais longos.', foto: '/images/motos/sahara-300/principal.jpg', enquadramento: 'center', ativo: true },
  { id: 'cb-500f', tipo: 'MOTO', nome: 'Honda CB 500F', categoria: 'Naked', descricao: 'Para quem quer subir de categoria.', foto: '/images/motos/cb-500f/principal.jpg', enquadramento: '64% 48%', ativo: true },
];

/** Motos da vitrine, com a foto mais forte na frente. */
export function motosEmDestaque() {
  return [...veiculosAtivos('MOTO')].sort((a, b) => Number(b.id === 'cb-500f') - Number(a.id === 'cb-500f'));
}

export const veiculosAtivos = (tipo?: TipoVeiculo) =>
  VEICULOS.filter((v) => v.ativo && (!tipo || v.tipo === tipo));
