import type { Metadata, Viewport } from 'next';
import { Archivo } from 'next/font/google';
import { SITE } from '@/config/site';
import './globals.css';

const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  style: ['normal', 'italic'],
  variable: '--font-archivo',
  display: 'swap',
});

const titulo = `Consórcio de Carro e Moto em ${SITE.cidade} | ${SITE.nome}`;
const descricao = `Simule seu consórcio de carro ou moto Canopus na ${SITE.nome}, em ${SITE.cidade}-${SITE.uf}. Escolha a carta de crédito, veja a parcela na hora e fale com um especialista pelo WhatsApp.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: titulo, template: `%s | ${SITE.nome}` },
  description: descricao,
  keywords: ['consórcio de carro', 'consórcio de moto', 'consórcio Canopus', 'consórcio Honda', 'moto Honda', `consórcio de carro em ${SITE.cidade}`, `consórcio de motos em ${SITE.cidade}`, 'comprar carro no consórcio', 'comprar moto no consórcio', SITE.nome],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: '/',
    siteName: SITE.nome,
    title: titulo,
    description: descricao,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: `${SITE.nome}: simule seu consórcio de carro ou moto` }],
  },
  twitter: { card: 'summary_large_image', title: titulo, description: descricao, images: ['/og.png'] },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: '#0C447C', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={archivo.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
