import Image from 'next/image';
import { Reveal } from './Reveal';

const DETALHES = ['Financiamento', 'Consórcio', 'Entrada facilitada'];

export function OfertaDestaque() {
  return (
    <section id="ofertas" className="scroll-mt-24 relative min-h-[82vh] text-white">
      <Image src="/motos/xre.jpg" alt="Motocicleta trail Honda" fill priority={false} sizes="100vw" className="object-cover object-[50%_40%]" />
      <div className="absolute inset-0 bg-black/45" />
      <div className="relative z-10 flex min-h-[82vh] flex-col justify-end px-6 py-16 sm:px-12 lg:px-20">
        <Reveal>
          <h2 className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            Condições especiais para você sair de moto nova.
          </h2>
          <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm tracking-wide">
            {DETALHES.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 bg-azul-vivo" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
          <a href="#consorcio" className="mt-10 inline-flex bg-azul-vivo px-7 py-4 text-sm font-semibold transition hover:bg-azul">
            Confira as ofertas
          </a>
        </Reveal>
      </div>
    </section>
  );
}
