'use client';
import { useState } from 'react';
import Image from 'next/image';
import { veiculosAtivos } from '@/data/veiculos';
import { formatBRL } from '@/lib/format';
import type { TipoVeiculo } from '@/types';
import { useSimulador } from './SimuladorProvider';

const ABAS: { id: TipoVeiculo; label: string }[] = [
  { id: 'CARRO', label: 'Carros' },
  { id: 'MOTO', label: 'Motos' },
];

export function Veiculos() {
  const { escolherVeiculo } = useSimulador();
  const [aba, setAba] = useState<TipoVeiculo>('CARRO');
  const lista = veiculosAtivos(aba);

  return (
    <section id="veiculos" className="scroll-mt-16 px-4 py-16 sm:py-24" aria-labelledby="titulo-veiculos">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 id="titulo-veiculos" className="titulo-secao max-w-2xl text-3xl text-navy sm:text-5xl">Seu próximo carro ou sua próxima moto começa aqui</h2>
            <p className="mt-3 max-w-xl text-lg text-navy/70">Escolha o que você procura e veja a parcela da carta no simulador.</p>
          </div>
          <div role="tablist" aria-label="Tipo de veículo" className="inline-flex self-start rounded-2xl bg-nevoa p-1 lg:self-auto">
            {ABAS.map((a) => (
              <button
                key={a.id}
                role="tab"
                id={`aba-${a.id}`}
                aria-selected={aba === a.id}
                aria-controls="painel-veiculos"
                onClick={() => setAba(a.id)}
                className={`rounded-xl px-6 py-3 text-base font-black uppercase transition ${aba === a.id ? 'bg-navy text-white' : 'text-navy/70 hover:text-navy'}`}
                style={{ fontStretch: '115%' }}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>

        <div id="painel-veiculos" role="tabpanel" aria-labelledby={`aba-${aba}`} className="-mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3">
          {lista.map((v) => (
            <article key={v.id} className="group w-[78%] shrink-0 snap-start overflow-hidden rounded-3xl border border-nevoa bg-white transition hover:-translate-y-1 hover:shadow-[0_24px_40px_-24px_rgba(10,30,74,.45)] sm:w-auto">
              <div className="relative aspect-[4/3] bg-gradient-to-br from-nevoa to-white">
                <Image src={v.foto} alt={v.nome} fill sizes="(min-width:1024px) 33vw, 80vw" className="object-contain p-6 transition duration-500 group-hover:scale-105" />
                <span className="absolute left-4 top-4 rounded-full bg-navy px-3 py-1 text-xs font-bold text-white">{v.categoria}</span>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-black text-navy" style={{ fontStretch: '112%' }}>{v.nome}</h3>
                <p className="mt-1 text-navy/70">{v.descricao}</p>
                {v.preco !== undefined && <p className="num mt-2 font-bold text-navy">{formatBRL(v.preco)}</p>}
                <button onClick={() => escolherVeiculo(v.nome, v.tipo)} className="mt-4 w-full rounded-xl bg-navy px-4 py-3 text-sm font-black uppercase text-white transition hover:bg-eletrico">
                  {v.tipo === 'CARRO' ? 'Quero esse carro' : 'Quero essa moto'}
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
