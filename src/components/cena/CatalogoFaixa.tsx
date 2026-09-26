'use client';

import Image from 'next/image';
import { useState } from 'react';
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

  return (
    <section className="bg-[#111] py-16 text-white md:py-24" aria-labelledby="titulo-catalogo">
      <div className="flex items-end justify-between gap-6 px-6 md:px-10">
        <h2 id="titulo-catalogo" className="text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">A linha</h2>
      </div>
      <div className="mt-8 flex gap-6 overflow-x-auto px-6 text-[12px] uppercase tracking-[0.18em] md:px-10" role="tablist">
        {categorias.map((cat) => (
          <button key={cat} type="button" role="tab" aria-selected={filtro === cat} onClick={() => setFiltro(cat)} className={`shrink-0 border-b pb-2 ${filtro === cat ? 'border-[#1565C0] text-white' : 'border-transparent text-white/45'}`}>
            {cat}
          </button>
        ))}
      </div>
      <div className="catalogo-faixa mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-4 md:px-10">
        {lista.map((moto) => (
          <a key={moto.id} href={`/motos/${moto.id}`} className="group relative h-[78vh] w-[82vw] shrink-0 snap-start overflow-hidden bg-[#1a1a1a] md:w-[46vw]">
            <Image src={moto.foto} alt={moto.nome} fill sizes="80vw" className="object-cover transition duration-700 ease-out group-hover:scale-[1.06]" style={{ objectPosition: moto.enquadramento ?? 'center' }} />
            <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            <span className="absolute inset-x-0 bottom-0 p-6 transition duration-500 group-hover:-translate-y-2 md:p-8">
              <span className="block text-[11px] uppercase tracking-[0.22em] text-white/70">{moto.categoria}</span>
              <span className="mt-2 block text-4xl font-semibold tracking-tight">{nomeModelo(moto.nome)}</span>
              {moto.preco !== undefined && <span className="mt-2 block text-sm">A partir de {formatBRL(moto.preco)}</span>}
              <span className="mt-4 inline-block text-[12px] uppercase tracking-[0.16em] text-[#9ec2ff] md:translate-y-2 md:opacity-0 md:transition md:group-hover:translate-y-0 md:group-hover:opacity-100">Ver modelo</span>
            </span>
          </a>
        ))}
      </div>
      {carros.length > 0 && (
        <div className="mt-10 border-t border-white/10 px-6 pt-8 md:px-10">
          <p className="text-[11px] uppercase tracking-[0.22em] text-white/50">Carros no consórcio</p>
          <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
            {carros.map((carro) => (
              <button key={carro.id} type="button" onClick={() => escolherVeiculo(carro.nome, carro.tipo)} className="text-lg transition hover:text-[#9ec2ff]">
                {carro.nome}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
