import Image from 'next/image';
import { SITE } from '@/config/site';
import { veiculosAtivos } from '@/data/veiculos';
import { formatBRL } from '@/lib/format';
import { BotaoWhats } from '../BotaoWhats';

export function Seminovas() {
  const lista = veiculosAtivos('MOTO').filter((m) => m.seminova);

  return (
    <section id="seminovas" className="scroll-mt-20 bg-[#0c0c0c] px-6 py-20 text-white md:px-12 md:py-28">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.32em] text-white/50">Seminovas</p>
          <h2 className="mt-4 max-w-xl text-4xl font-semibold leading-[0.95] tracking-[-0.04em] sm:text-6xl">Motos selecionadas.</h2>
        </div>
        <BotaoWhats origem="seminovas" mensagem={`${SITE.mensagemEspecialista} Quero ver as seminovas.`} className="inline-flex w-fit border border-white/70 px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.16em] transition hover:bg-white hover:text-[#111]">
          Ver seminovas
        </BotaoWhats>
      </div>
      {lista.length > 0 ? (
        <div className="mx-auto mt-14 grid max-w-[1400px] gap-10 md:grid-cols-2">
          {lista.map((moto) => (
            <a key={moto.id} href={`/motos/${moto.id}`} className="group block">
              <div className="relative aspect-[16/10] overflow-hidden bg-[#1a1a1a]">
                <Image src={moto.foto} alt={moto.nome} fill sizes="50vw" className="object-cover transition duration-700 group-hover:scale-105" style={{ objectPosition: moto.enquadramento ?? 'center' }} />
              </div>
              <h3 className="mt-4 text-3xl font-semibold">{moto.nome}</h3>
              {moto.preco !== undefined && <p className="mt-1">{formatBRL(moto.preco)}</p>}
            </a>
          ))}
        </div>
      ) : (
        <p className="mx-auto mt-16 max-w-lg text-lg text-white/60">A seleção de seminovas é confirmada com a equipe. Ano e quilometragem aparecem aqui quando estiverem cadastrados.</p>
      )}
    </section>
  );
}
