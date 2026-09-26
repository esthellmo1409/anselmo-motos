import Image from 'next/image';
import { IMAGEM_HERO } from '@/data/veiculos';
import { BotaoWhats } from './BotaoWhats';

export function CtaFinal() {
  return (
    <section className="relative min-h-[78vh] text-white">
      <Image src={IMAGEM_HERO} alt="" fill sizes="100vw" className="object-cover object-[70%_center]" />
      <div className="absolute inset-0 bg-black/55" />
      <div className="relative z-10 flex min-h-[78vh] flex-col justify-end px-6 py-16 sm:px-12 lg:px-16">
        <h2 className="max-w-3xl text-4xl font-semibold leading-[0.95] tracking-[-0.04em] sm:text-6xl">Pronto para encontrar sua próxima moto?</h2>
        <p className="mt-5 max-w-md text-lg text-white/75">Fale com a equipe e escolha o modelo.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <BotaoWhats origem="cta-final" className="bg-[#1565C0] px-7 py-4 text-center text-[12px] font-semibold uppercase tracking-[0.16em]">
            Falar com um consultor
          </BotaoWhats>
          <a href="#motos" className="border border-white/70 px-7 py-4 text-center text-[12px] font-semibold uppercase tracking-[0.16em]">Ver motos</a>
        </div>
      </div>
    </section>
  );
}
