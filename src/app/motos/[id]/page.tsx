import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { OFERTAS_CONSORCIO } from '@/data/consorcioData';
import { nomeModelo, VEICULOS, veiculosAtivos } from '@/data/veiculos';
import { SITE } from '@/config/site';
import { formatBRL } from '@/lib/format';
import { linkWhatsApp } from '@/lib/whatsapp';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export function generateStaticParams() {
  return veiculosAtivos('MOTO').map((moto) => ({ id: moto.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const moto = VEICULOS.find((item) => item.id === id);
  if (!moto) return { title: 'Moto' };
  return {
    title: moto.nome,
    description: moto.descricao,
    alternates: { canonical: `/motos/${moto.id}` },
  };
}

export default async function PaginaMoto({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const moto = veiculosAtivos('MOTO').find((item) => item.id === id);
  if (!moto) notFound();

  const fotos = [moto.foto, ...(moto.galeria ?? [])].filter((foto, i, lista) => lista.indexOf(foto) === i);
  const mensagem = `Olá! Vim pelo site da Anselmo Motos e tenho interesse na ${moto.nome}.`;

  return (
    <>
      <Header />
      <main className="bg-[#0c0c0c] text-white">
        <section className="relative min-h-[100svh]">
          <Image src={moto.foto} alt={moto.nome} fill priority sizes="100vw" className="object-cover" style={{ objectPosition: moto.enquadramento ?? 'center' }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/30" />
          <div className="relative z-10 flex min-h-[100svh] flex-col justify-end px-6 pb-16 pt-32 sm:px-12">
            <p className="text-[11px] uppercase tracking-[0.32em] text-white/70">{moto.categoria}</p>
            <h1 className="mt-3 max-w-4xl text-5xl font-semibold leading-[0.9] tracking-[-0.045em] sm:text-7xl lg:text-8xl">{nomeModelo(moto.nome)}</h1>
            <p className="mt-5 max-w-md text-lg text-white/80">{moto.descricao}</p>
            {moto.preco !== undefined && <p className="mt-4 text-sm">A partir de {formatBRL(moto.preco)}</p>}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={linkWhatsApp(mensagem)} target="_blank" rel="noopener noreferrer" className="bg-[#1565C0] px-7 py-4 text-center text-[12px] font-semibold uppercase tracking-[0.16em]">
                Tenho interesse
              </a>
              <a href={`/?interesse=${moto.id}#simulador`} className="border border-white/70 px-7 py-4 text-center text-[12px] font-semibold uppercase tracking-[0.16em]">
                Simular consórcio
              </a>
            </div>
          </div>
        </section>

        {fotos.length > 1 && (
          <section className="grid md:grid-cols-2">
            {fotos.slice(1).map((foto) => (
              <div key={foto} className="relative min-h-[60vh]">
                <Image src={foto} alt="" fill sizes="50vw" className="object-cover" />
              </div>
            ))}
          </section>
        )}

        <section className="px-6 py-20 sm:px-12 lg:px-16">
          <p className="text-[11px] uppercase tracking-[0.28em] text-[#7eb0ff]">Condições</p>
          <h2 className="mt-3 max-w-xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Consórcio e financiamento.</h2>
          <ul className="mt-8 max-w-xl border-t border-white/15">
            {OFERTAS_CONSORCIO.map((item) => (
              <li key={item} className="border-b border-white/15 py-4">{item}</li>
            ))}
          </ul>
          <a href={linkWhatsApp(mensagem)} target="_blank" rel="noopener noreferrer" className="mt-10 inline-flex bg-white px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#111]">
            Quero essa moto · {SITE.whatsappExibicao}
          </a>
        </section>
      </main>
      <Footer />
    </>
  );
}
