'use client';

import Image from 'next/image';
import { veiculosAtivos } from '@/data/veiculos';
import { useSimulador } from '../SimuladorProvider';

const IDS = ['cb-500f', 'bros-160', 'cg-160'] as const;

export function Mosaico() {
  const { escolherVeiculo } = useSimulador();
  const itens = IDS.map((id) => veiculosAtivos().find((v) => v.id === id)).filter((v) => v !== undefined);

  if (itens.length < 3) return null;
  const [grande, ...menores] = itens;

  return (
    <section className="bg-white px-3 pb-3 md:px-4" aria-label="Motos em destaque">
      <div className="grid gap-2 md:grid-cols-2 md:grid-rows-2">
        <Painel veiculo={grande} grande onEscolher={() => escolherVeiculo(grande.nome, grande.tipo)} />
        {menores.map((v) => (
          <Painel key={v.id} veiculo={v} onEscolher={() => escolherVeiculo(v.nome, v.tipo)} />
        ))}
      </div>
    </section>
  );
}

function Painel({
  veiculo,
  grande = false,
  onEscolher,
}: {
  veiculo: { id: string; nome: string; categoria: string; foto: string };
  grande?: boolean;
  onEscolher: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onEscolher}
      className={`group relative min-h-[320px] overflow-hidden bg-[#ddd] text-left ${grande ? 'md:row-span-2 md:min-h-[720px]' : 'md:min-h-[356px]'}`}
    >
      <Image
        src={veiculo.foto}
        alt={veiculo.nome}
        fill
        sizes={grande ? '(min-width: 768px) 50vw, 100vw' : '(min-width: 768px) 50vw, 100vw'}
        className="object-cover transition duration-700 ease-out group-hover:scale-[1.05]"
        style={{ objectPosition: veiculo.id === 'cb-500f' ? '62% 45%' : veiculo.id === 'cg-160' ? '50% 60%' : 'center' }}
      />
      <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent md:from-black/20 md:via-transparent md:transition md:duration-500 md:group-hover:from-black/70" />
      <span className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8 md:translate-y-2 md:opacity-0 md:transition md:duration-500 md:group-hover:translate-y-0 md:group-hover:opacity-100">
        <span className="block text-xs tracking-[0.2em]">{veiculo.categoria.toUpperCase()}</span>
        <span className="mt-2 block text-3xl font-semibold tracking-tight">{veiculo.nome}</span>
        <span className="mt-4 inline-block bg-azul-vivo px-4 py-2.5 text-sm font-semibold">Tenho interesse</span>
      </span>
    </button>
  );
}
