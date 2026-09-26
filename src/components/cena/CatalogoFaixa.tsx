'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { nomeModelo, veiculosAtivos } from '@/data/veiculos';
import { formatBRL } from '@/lib/format';
import { useSimulador } from '../SimuladorProvider';

export function CatalogoFaixa() {
  const motos = veiculosAtivos('MOTO');
  const carros = veiculosAtivos('CARRO');
  const { escolherVeiculo } = useSimulador();
  const categorias = ['Todas', ...Array.from(new Set(motos.map((m) => m.categoria)))];
  const [filtro, setFiltro] = useState('Todas');
  const lista = filtro === 'Todas' ? motos : motos.filter((m) => m.categoria === filtro);
  const faixa = useRef<HTMLDivElement>(null);

  const rolar = (direcao: number) => {
    const el = faixa.current;
    if (!el) return;
    el.scrollBy({ left: direcao * Math.round(el.clientWidth * 0.86), behavior: 'smooth' });
  };

  return (
    <section id="motos" className="scroll-mt-20 bg-[#f2f2f2] py-14 text-[#111] md:py-20" aria-labelledby="titulo-catalogo">
      <div className="flex items-end justify-between gap-6 px-5 sm:px-10">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#1565C0]">Modelos</p>
          <h2 id="titulo-catalogo" className="titulo-campanha mt-2 text-5xl sm:text-7xl">A linha</h2>
        </div>
        <div className="hidden gap-3 sm:flex">
          <button type="button" aria-label="Modelos anteriores" onClick={() => rolar(-1)} className="grid h-12 w-12 place-items-center rounded-full border border-black/30 text-2xl leading-none transition hover:bg-black hover:text-white">‹</button>
          <button type="button" aria-label="Próximos modelos" onClick={() => rolar(1)} className="grid h-12 w-12 place-items-center rounded-full border border-black/30 text-2xl leading-none transition hover:bg-black hover:text-white">›</button>
        </div>
      </div>

      <div className="mt-8 flex gap-7 overflow-x-auto px-5 text-[12px] font-semibold uppercase tracking-[0.2em] sm:px-10" role="tablist">
        {categorias.map((cat) => (
          <button key={cat} type="button" role="tab" aria-selected={filtro === cat} onClick={() => setFiltro(cat)} className={`shrink-0 border-b-2 pb-2 ${filtro === cat ? 'border-[#1565C0] text-[#111]' : 'border-transparent text-black/40'}`}>
            {cat}
          </button>
        ))}
      </div>

      <div ref={faixa} className="catalogo-faixa mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:px-10">
        {lista.map((moto) => (
          <a key={moto.id} href={`/motos/${moto.id}`} className="group w-[86vw] shrink-0 snap-start sm:w-[62vw] lg:w-[44vw]">
            <span className="relative block h-[68vh] overflow-hidden bg-[#d8d8d8]">
              <Image
                src={moto.foto}
                alt={moto.nome}
                fill
                sizes="(min-width: 1024px) 44vw, 86vw"
                className="object-cover transition duration-700 ease-out group-hover:scale-[1.05]"
                style={{ objectPosition: moto.enquadramento ?? 'center' }}
              />
            </span>
            <span className="mt-4 flex items-end justify-between gap-4">
              <span>
                <span className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-black/45">{moto.categoria}</span>
                <span className="titulo-campanha mt-1 block text-4xl sm:text-5xl">{nomeModelo(moto.nome)}</span>
                {moto.preco !== undefined && <span className="mt-1 block text-sm">A partir de {formatBRL(moto.preco)}</span>}
              </span>
              <span className="pb-1 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#1565C0]">Ver</span>
            </span>
          </a>
        ))}
      </div>

      {carros.length > 0 && (
        <div className="mt-12 border-t border-black/10 px-5 pt-8 sm:px-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-black/45">Carros no consórcio</p>
          <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
            {carros.map((carro) => (
              <button key={carro.id} type="button" onClick={() => escolherVeiculo(carro.nome, carro.tipo)} className="text-lg transition hover:text-[#1565C0]">
                {carro.nome}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
