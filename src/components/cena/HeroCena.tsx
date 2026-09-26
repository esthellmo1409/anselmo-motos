'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { IMAGEM_HERO } from '@/data/veiculos';

export function HeroCena() {
  const [progresso, setProgresso] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const aoRolar = () => {
      const limite = window.innerHeight;
      setProgresso(Math.min(1, Math.max(0, window.scrollY / limite)));
    };
    aoRolar();
    window.addEventListener('scroll', aoRolar, { passive: true });
    return () => window.removeEventListener('scroll', aoRolar);
  }, []);

  const escala = 1.12 - progresso * 0.12;
  const desloca = progresso * -48;

  return (
    <section id="inicio" className="relative h-[100svh] overflow-hidden bg-[#0b0b0b] text-white">
      <div
        className="absolute inset-0 will-change-transform"
        style={{ transform: `translate3d(0, ${desloca}px, 0) scale(${escala})` }}
      >
        <Image
          src={IMAGEM_HERO}
          alt="Honda CB 500F na Anselmo Motos"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: '68% 58%' }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

      <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-20 pt-28 sm:px-10 md:w-[min(640px,58%)] md:px-14 lg:pb-24">
        <p className="hero-esq text-[11px] font-semibold uppercase tracking-[0.42em] text-white/80">Anselmo Motos</p>
        <h1 className="hero-esq-2 mt-5 text-[3.4rem] font-semibold leading-[0.9] tracking-[-0.04em] sm:text-7xl lg:text-[6.4rem]">
          Encontre
          <span className="block">a moto.</span>
        </h1>
        <p className="hero-esq-3 mt-6 max-w-sm text-base text-white/75 sm:text-lg">Novas experiências começam sobre duas rodas.</p>
        <a href="#motos" className="hero-esq-3 mt-8 inline-flex w-fit border border-white/80 px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.18em] transition hover:bg-white hover:text-[#111]">
          Conhecer motos
        </a>
      </div>

      <a href="#motos" className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-white/70">
        Rolar
        <span className="block h-10 w-px bg-white/70" />
      </a>
    </section>
  );
}
