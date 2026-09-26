import Image from 'next/image';
import { BotaoWhats } from './BotaoWhats';

export function CtaFinal() {
  return (
    <section className="relative min-h-[78vh] text-white">
      <Image src="/motos/cb500f.jpg" alt="Honda CB 500F" fill sizes="100vw" className="object-cover object-[60%_center]" />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 flex min-h-[78vh] flex-col justify-end px-6 py-16 sm:px-12 lg:px-20">
        <h2 className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">Pronto para encontrar sua próxima moto?</h2>
        <p className="mt-5 max-w-xl text-lg text-white/80">Fale com nossa equipe e encontre o modelo ideal para você.</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <BotaoWhats origem="cta-final" className="bg-azul-vivo px-7 py-4 text-center text-sm font-semibold transition hover:bg-azul">
            Falar com um consultor
          </BotaoWhats>
          <a href="#motos" className="border border-white/70 px-7 py-4 text-center text-sm font-semibold transition hover:bg-white hover:text-grafite">
            Ver motos
          </a>
        </div>
      </div>
    </section>
  );
}
