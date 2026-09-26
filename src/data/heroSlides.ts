/** Fotos de abertura. Troque o arquivo em /public/images/hero sem mudar o restante. */
export interface SlideHero {
  id: string;
  foto: string;
  alt: string;
  titulo: string;
  linha: string;
  enquadramento: string;
  /** true = letra branca. false = letra preta, para céu claro. */
  textoClaro: boolean;
}

export const SLIDES_HERO: SlideHero[] = [
  {
    id: 'africa',
    foto: '/images/hero/africa-twin.jpg',
    alt: 'Honda Africa Twin',
    titulo: 'Africa Twin',
    linha: 'Trail Honda.',
    enquadramento: 'center 48%',
    textoClaro: false,
  },
  {
    id: 'cbr',
    foto: '/images/hero/cbr.jpg',
    alt: 'Honda CBR branca',
    titulo: 'CBR',
    linha: 'Esportiva Honda.',
    enquadramento: 'center 64%',
    textoClaro: false,
  },
  {
    id: 'rua',
    foto: '/images/hero/honda-rua.jpg',
    alt: 'Honda vermelha na rua',
    titulo: 'Honda',
    linha: 'Na Anselmo Motos.',
    enquadramento: '62% 48%',
    textoClaro: true,
  },
];
