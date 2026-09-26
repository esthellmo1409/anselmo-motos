'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motosEmDestaque, nomeModelo } from '@/data/veiculos';
import { formatBRL } from '@/lib/format';

export function Vitrine() {
  const motos = motosEmDestaque();
  const [indice, setIndice] = useState(0);
  const moto = motos[indice];
  if (!moto) return null;

  const ir = (passo: number) => {
    setIndice((atual) => (atual + passo + motos.length) % motos.length);
  };

  return (
    <section id="motos" className="scroll-mt-20 bg-[#f4f1eb] text-[#141414]">
      <div className="grid min-h-[100svh] lg:grid-cols-[minmax(280px,0.78fr)_1.22fr]">
        <div className="flex flex-col justify-between px-6 py-16 sm:px-10 lg:px-14 lg:py-20">
          <p className="text-sm tabular-nums tracking-[0.28em] text-[#1565C0]">{String(indice + 1).padStart(2, '0')}</p>
          <div key={moto.id} className="texto-entra">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#141414]/50">Honda</p>
            <h2 className="mt-3 text-5xl font-semibold leading-[0.92] tracking-[-0.04em] sm:text-7xl">{nomeModelo(moto.nome)}</h2>
            <p className="mt-6 max-w-sm text-lg text-[#141414]/70">{moto.descricao}</p>
            {moto.preco !== undefined && <p className="mt-4 text-sm">A partir de {formatBRL(moto.preco)}</p>}
            <a href={`/motos/${moto.id}`} className="mt-8 inline-flex border border-[#141414] px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] transition hover:bg-[#1565C0] hover:border-[#1565C0] hover:text-white">
              Ver modelo
            </a>
          </div>
          <div className="mt-12 flex items-center gap-6 text-[12px] uppercase tracking-[0.16em]">
            <button type="button" onClick={() => ir(-1)} className="border-b border-transparent pb-1 transition hover:border-[#1565C0]">Anterior</button>
            <button type="button" onClick={() => ir(1)} className="border-b border-transparent pb-1 transition hover:border-[#1565C0]">Próxima</button>
          </div>
        </div>
        <div className="relative min-h-[72vh] overflow-hidden bg-[#d9d4cb] lg:min-h-[100svh]">
          <Image
            key={moto.id}
            src={moto.foto}
            alt={moto.nome}
            fill
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="moto-entra object-cover"
            style={{ objectPosition: moto.enquadramento ?? 'center' }}
          />
        </div>
      </div>
    </section>
  );
}
