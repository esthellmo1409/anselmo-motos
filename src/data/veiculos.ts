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
  foto: string;
  preco?: number;
  ativo: boolean;
}

const FOTO_CARRO = '/veiculos/placeholder-carro.svg';

export const VEICULOS: Veiculo[] = [
  // ---------- CARROS ---------- [EDITAR] troque pelos modelos que a loja trabalha
  { id: 'hatch', tipo: 'CARRO', nome: 'Hatch', categoria: 'Compacto', descricao: 'Fácil de estacionar e prático para a cidade.', foto: FOTO_CARRO, ativo: true },
  { id: 'seda', tipo: 'CARRO', nome: 'Sedã', categoria: 'Família', descricao: 'Mais espaço no porta-malas para a família.', foto: FOTO_CARRO, ativo: true },
  { id: 'suv', tipo: 'CARRO', nome: 'SUV', categoria: 'Utilitário', descricao: 'Posição de dirigir mais alta e espaço interno.', foto: FOTO_CARRO, ativo: true },
  { id: 'picape', tipo: 'CARRO', nome: 'Picape', categoria: 'Trabalho', descricao: 'Para quem precisa de caçamba no trabalho ou no campo.', foto: FOTO_CARRO, ativo: true },

  // ---------- MOTOS ----------
  { id: 'cg-160', tipo: 'MOTO', nome: 'Honda CG 160', categoria: 'Street', descricao: 'Para quem usa a moto todo dia, no trabalho e na cidade.', foto: '/motos/cg.jpg', ativo: true },
  { id: 'biz-125', tipo: 'MOTO', nome: 'Honda Biz 125', categoria: 'Cub', descricao: 'Prática para deslocamentos curtos e rotina urbana.', foto: '/motos/pcx-studio.jpg', ativo: true },
  { id: 'pop-110i', tipo: 'MOTO', nome: 'Honda Pop 110i', categoria: 'Entrada', descricao: 'Uma porta de entrada para quem vai ter a primeira moto.', foto: '/motos/pcx.jpg', ativo: true },
  { id: 'bros-160', tipo: 'MOTO', nome: 'Honda NXR 160 Bros', categoria: 'Trail', descricao: 'Para quem alterna asfalto e estrada de terra.', foto: '/motos/bros.jpg', ativo: true },
  { id: 'sahara-300', tipo: 'MOTO', nome: 'Honda Sahara 300', categoria: 'Trail', descricao: 'Para viagens e caminhos mais longos.', foto: '/motos/xre.jpg', ativo: true },
  { id: 'cb-500f', tipo: 'MOTO', nome: 'Honda CB 500F', categoria: 'Naked', descricao: 'Para quem quer subir de categoria.', foto: '/motos/cb500f.jpg', ativo: true },
];

export const veiculosAtivos = (tipo?: TipoVeiculo) =>
  VEICULOS.filter((v) => v.ativo && (!tipo || v.tipo === tipo));
