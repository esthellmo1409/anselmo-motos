'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { veiculosAtivos, type Veiculo } from '@/data/veiculos';
import { formatBRL } from '@/lib/format';
import { useSimulador } from '../SimuladorProvider';
import { Reveal } from './Reveal';

const FILTROS = ['Todas', 'Motos', 'Scooters', 'Trail', 'Street', 'Esportivas', 'Usadas', 'Carros'] as const;
type Filtro = (typeof FILTROS)[number];

function grupo(v: Veiculo) {
  if (v.tipo === 'CARRO') return 'Carros';
  if (v.id === 'biz-125' || v.id === 'pop-110i') return 'Scooters';
  if (v.id === 'bros-160' || v.id === 'sahara-300') return 'Trail';
  if (v.id === 'cb-500f') return 'Esportivas';
  return 'Street';
}

const ENQUADRE: Record<string, string> = {
  'cg-160': '50% 62%',
  'pop-110i': '30% 58%',
  'bros-160': '46% 42%',
  'cb-500f': '64% 46%',
};

export function Catalogo() {
  const { escolherVeiculo } = useSimulador();
  const [filtro, setFiltro] = useState<Filtro>('Todas');
  const lista = useMemo(() => {
    const todos = veiculosAtivos();
    if (filtro === 'Todas') return todos;
    if (filtro === 'Motos') return todos.filter((v) => v.tipo === 'MOTO');
    if (filtro === 'Usadas') return [];
    if (filtro === 'Carros') return todos.filter((v) => v.tipo === 'CARRO');
    return todos.filter((v) => grupo(v) === filtro);
  }, [filtro]);

  return (
    <section id="motos" className="scroll-mt-24 bg-white px-5 py-20 md:px-10 md:py-28 lg:px-16">
      <div className="mx-auto max-w-[1440px]">
        <Reveal>
          <h2 className="max-w-xl text-4xl font-semibold tracking-tight text-grafite sm:text-5xl">Encontre sua próxima moto</h2>
          <p className="mt-4 text-grafite/60">Escolha o modelo que combina com seu estilo.</p>
        </Reveal>

        <div className="mt-10 flex gap-6 overflow-x-auto border-b border-black/10" role="tablist" aria-label="Categorias">
          {FILTROS.map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={filtro === item}
              onClick={() => setFiltro(item)}
              className={`shrink-0 border-b-2 pb-3 text-sm transition ${filtro === item ? 'border-azul-vivo text-grafite' : 'border-transparent text-grafite/45 hover:text-grafite'}`}
            >
              {item}
            </button>
          ))}
        </div>

        {lista.length === 0 ? (
          <p className="py-24 text-lg text-grafite/55">Nenhuma moto usada cadastrada no momento. Fale com um consultor para ver o que chegou.</p>
        ) : (
          <div className="mt-10 grid gap-x-6 gap-y-14 md:grid-cols-2">
            {lista.map((v, i) => (
              <Reveal key={v.id} delay={i % 2 === 0 ? 0 : 80} className={i === 0 && filtro === 'Todas' ? 'md:col-span-2' : ''}>
                <article className="group">
                  <div className={`relative overflow-hidden bg-[#e8e8e8] ${i === 0 && filtro === 'Todas' ? 'aspect-[4/5] sm:aspect-[16/8]' : 'aspect-[4/5] sm:aspect-[16/11]'}`}>
                    <Image
                      src={v.foto}
                      alt={v.nome}
                      fill
                      sizes={i === 0 && filtro === 'Todas' ? '100vw' : '(min-width: 768px) 50vw, 100vw'}
                      className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                      style={{ objectPosition: ENQUADRE[v.id] ?? 'center' }}
                    />
                  </div>
                  <div className="mt-5 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                      <p className="text-xs font-semibold tracking-[0.18em] text-azul-vivo">{v.categoria.toUpperCase()}</p>
                      <h3 className="mt-1 text-2xl font-semibold tracking-tight text-grafite">{v.nome}</h3>
                      <p className="mt-2 max-w-md text-sm text-grafite/60">{v.descricao}</p>
                      {v.preco !== undefined && <p className="mt-2 text-sm font-medium text-grafite">A partir de {formatBRL(v.preco)}</p>}
                    </div>
                    <button
                      type="button"
                      onClick={() => escolherVeiculo(v.nome, v.tipo)}
                      className="shrink-0 border border-transparent bg-grafite px-4 py-3 text-sm font-semibold text-white transition group-hover:bg-azul-vivo"
                    >
                      Tenho interesse
                    </button>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
