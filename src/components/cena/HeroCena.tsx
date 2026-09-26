'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { SITE } from '@/config/site';
import { SLIDES_HERO } from '@/data/heroSlides';
import { linkWhatsApp } from '@/lib/whatsapp';

const DURACAO = 7000;

export function HeroCena() {
  const slides = SLIDES_HERO;
  const [indice, setIndice] = useState(0);
  const [pausa, setPausa] = useState(false);
  const [toqueX, setToqueX] = useState<number | null>(null);
  const slide = slides[indice];

  const ir = useCallback((passo: number) => {
    setIndice((atual) => (atual + passo + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (pausa || slides.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = window.setTimeout(() => ir(1), DURACAO);
    return () => window.clearTimeout(t);
  }, [indice, pausa, ir, slides.length]);

  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      const hero = document.getElementById('inicio');
      if (!hero) return;
      if (hero.getBoundingClientRect().bottom < 80) return;
      if (e.key === 'ArrowRight') ir(1);
      if (e.key === 'ArrowLeft') ir(-1);
    };
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, [ir]);

  if (!slide) return null;

  const curto = slide.titulo.replace(/\s/g, '').length <= 5;
  const whats = linkWhatsApp('Olá! Vim pelo site da Anselmo Motos e quero conhecer as motos.');

  return (
    <section
      id="inicio"
      className="relative h-[100dvh] min-h-[640px] overflow-hidden bg-black text-white"
      onMouseEnter={() => setPausa(true)}
      onMouseLeave={() => setPausa(false)}
      onPointerDown={(e) => {
        if ((e.target as HTMLElement).closest('a, button')) return;
        setToqueX(e.clientX);
      }}
      onPointerUp={(e) => {
        if (toqueX == null) return;
        const dx = e.clientX - toqueX;
        if (dx > 70) ir(-1);
        if (dx < -70) ir(1);
        setToqueX(null);
      }}
    >
      <div className="absolute inset-x-0 top-0 z-30 h-[3px] bg-[#1565C0]" />

      <div
        className="absolute inset-0 flex h-full will-change-transform transition-transform duration-[900ms] ease-[cubic-bezier(.76,0,.24,1)] motion-reduce:transition-none"
        style={{ transform: `translate3d(-${indice * 100}%,0,0)` }}
      >
        {slides.map((item, i) => (
          <div key={item.id} className="relative h-full w-full min-w-full shrink-0 overflow-hidden">
            <Image
              src={item.foto}
              alt={item.alt}
              fill
              priority={i === 0}
              sizes="100vw"
              className={`object-cover ${i === indice ? 'hero-foto-ativa' : ''}`}
              style={{ objectPosition: item.enquadramento }}
            />
            <div className={`absolute inset-0 ${item.textoClaro ? 'bg-[linear-gradient(180deg,rgba(0,0,0,.45)_0%,rgba(0,0,0,.05)_28%,transparent_46%,rgba(0,0,0,.55)_100%)]' : 'bg-[linear-gradient(180deg,rgba(0,0,0,.28)_0%,transparent_18%,transparent_70%,rgba(0,0,0,.45)_100%)]'}`} />
          </div>
        ))}
      </div>

      <div className="pointer-events-none relative z-10 flex h-full flex-col justify-between px-5 pb-8 pt-24 sm:px-14 sm:pb-10 sm:pt-28">
        <div key={slide.id} className={`hero-texto text-center ${slide.textoClaro ? 'text-white' : 'text-[#111]'}`}>
          <h1 className="text-[11px] font-semibold uppercase tracking-[0.62em] sm:text-xs">Anselmo Motos</h1>
          <p
            className="titulo-campanha mt-1 sm:mt-3"
            style={{ fontSize: curto ? 'clamp(5rem, 16vw, 13rem)' : 'clamp(3.2rem, 9vw, 8.4rem)' }}
          >
            {slide.titulo}
          </p>
        </div>

        <div key={`${slide.id}-base`} className="hero-texto flex items-end justify-between gap-6 text-white">
          <p className="max-w-xs text-sm uppercase tracking-[0.22em] sm:text-base">{slide.linha}</p>
          <div className="text-right">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70">{SITE.cidade} · {SITE.uf}</p>
            <a href="#motos" className="pointer-events-auto mt-3 block text-[13px] font-semibold uppercase tracking-[0.2em] underline decoration-white/40 underline-offset-[6px]">Ver motos</a>
            <a href={whats} target="_blank" rel="noopener noreferrer" className="pointer-events-auto mt-2 block text-[13px] font-semibold uppercase tracking-[0.2em] text-white/80 underline decoration-white/30 underline-offset-[6px]">WhatsApp</a>
          </div>
        </div>
      </div>

      <button type="button" aria-label="Foto anterior" onClick={() => ir(-1)} className="absolute left-3 top-1/2 z-20 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/70 bg-black/20 text-3xl leading-none text-white transition hover:bg-white hover:text-black sm:left-7 sm:h-[3.75rem] sm:w-[3.75rem]">
        <span aria-hidden>‹</span>
      </button>
      <button type="button" aria-label="Próxima foto" onClick={() => ir(1)} className="absolute right-3 top-1/2 z-20 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/70 bg-black/20 text-3xl leading-none text-white transition hover:bg-white hover:text-black sm:right-7 sm:h-[3.75rem] sm:w-[3.75rem]">
        <span aria-hidden>›</span>
      </button>

      <p className="absolute bottom-11 left-1/2 z-20 -translate-x-1/2 text-[11px] tabular-nums tracking-[0.35em] text-white/80">
        {String(indice + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
      </p>
      <div className="absolute inset-x-0 bottom-0 z-20 h-[3px] bg-white/20">
        <div key={`${indice}-${pausa ? 'p' : 'a'}`} className={`h-full origin-left bg-[#1565C0] ${pausa ? 'w-full' : 'hero-progresso'}`} />
      </div>
    </section>
  );
}
