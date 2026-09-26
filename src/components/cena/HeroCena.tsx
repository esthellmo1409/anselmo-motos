'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { SITE } from '@/config/site';
import { motosEmDestaque, nomeModelo } from '@/data/veiculos';
import { linkWhatsApp } from '@/lib/whatsapp';

const DURACAO = 6800;

/** Só entram no carrossel da abertura as fotos que aguentam tela cheia. O restante fica na linha de modelos. */
const HERO = new Set(['cb-500f', 'bros-160']);

export function HeroCena() {
  const motos = motosEmDestaque().filter((m) => HERO.has(m.id));
  const [indice, setIndice] = useState(0);
  const [pausa, setPausa] = useState(false);
  const [toqueX, setToqueX] = useState<number | null>(null);
  const moto = motos[indice];

  const ir = useCallback((passo: number) => {
    setIndice((atual) => (atual + passo + motos.length) % motos.length);
  }, [motos.length]);

  useEffect(() => {
    if (pausa || motos.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = window.setTimeout(() => ir(1), DURACAO);
    return () => window.clearTimeout(t);
  }, [indice, pausa, ir, motos.length]);

  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      const hero = document.getElementById('inicio');
      if (!hero) return;
      const r = hero.getBoundingClientRect();
      if (r.bottom < 80) return;
      if (e.key === 'ArrowRight') ir(1);
      if (e.key === 'ArrowLeft') ir(-1);
    };
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, [ir]);

  if (!moto) return null;

  const nome = nomeModelo(moto.nome);
  const curto = nome.replace(/\s/g, '').length <= 8;
  const whats = linkWhatsApp(`Olá! Vim pelo site da Anselmo Motos e tenho interesse na ${moto.nome}.`);

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
        {motos.map((item, i) => (
          <div key={item.id} className="relative h-full w-full min-w-full shrink-0 overflow-hidden">
            <Image
              src={item.foto}
              alt={item.nome}
              fill
              priority={i < 2}
              sizes="100vw"
              className={`object-cover ${i === indice ? 'hero-foto-ativa' : 'scale-105'}`}
              style={{ objectPosition: item.id === 'cb-500f' ? '62% 34%' : 'center 42%' }}
            />
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.5)_0%,rgba(0,0,0,.12)_22%,transparent_46%,rgba(0,0,0,.62)_100%)]" />

      <div className="pointer-events-none relative z-10 flex h-full flex-col justify-between px-5 pb-10 pt-[4.5rem] sm:px-14 sm:pb-12 sm:pt-24">
        <div key={moto.id} className="hero-texto pt-2 text-center sm:pt-4">
          <h1 className="text-[11px] font-semibold uppercase tracking-[0.62em] text-white/75 sm:text-xs">Anselmo Motos</h1>
          <p
            className="titulo-campanha mt-2 text-white sm:mt-4"
            style={{ fontSize: curto ? 'clamp(4.4rem, 13.5vw, 11.2rem)' : 'clamp(2.7rem, 8.2vw, 7.6rem)' }}
          >
            {nome}
          </p>
        </div>

        <div key={`${moto.id}-rodape`} className="hero-texto flex items-end justify-between gap-8">
          <div className="max-w-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/65">{moto.categoria}</p>
            <p className="mt-2 max-w-xs text-[15px] leading-snug text-white sm:text-lg">{moto.descricao}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/65">{SITE.cidade} · {SITE.uf}</p>
            <a href={`/motos/${moto.id}`} className="pointer-events-auto mt-3 block text-[13px] font-semibold uppercase tracking-[0.2em] underline decoration-white/40 underline-offset-[6px] transition hover:decoration-white">
              Ver modelo
            </a>
            <a href={whats} target="_blank" rel="noopener noreferrer" className="pointer-events-auto mt-2 block text-[13px] font-semibold uppercase tracking-[0.2em] text-white/80 underline decoration-white/30 underline-offset-[6px] transition hover:text-white">
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      <button
        type="button"
        aria-label="Moto anterior"
        onClick={() => ir(-1)}
        className="absolute left-3 top-1/2 z-20 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/55 bg-black/25 text-3xl leading-none text-white transition hover:bg-white hover:text-black sm:left-7 sm:h-[3.75rem] sm:w-[3.75rem]"
      >
        <span aria-hidden>‹</span>
      </button>
      <button
        type="button"
        aria-label="Próxima moto"
        onClick={() => ir(1)}
        className="absolute right-3 top-1/2 z-20 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/55 bg-black/25 text-3xl leading-none text-white transition hover:bg-white hover:text-black sm:right-7 sm:h-[3.75rem] sm:w-[3.75rem]"
      >
        <span aria-hidden>›</span>
      </button>

      <p className="absolute bottom-12 left-1/2 z-20 -translate-x-1/2 text-[11px] tabular-nums tracking-[0.35em] text-white/70 sm:bottom-14">
        {String(indice + 1).padStart(2, '0')} / {String(motos.length).padStart(2, '0')}
      </p>

      <div className="absolute inset-x-0 bottom-0 z-20 h-[3px] bg-white/15">
        <div key={`${indice}-${pausa ? 'p' : 'a'}`} className={`h-full origin-left bg-[#1565C0] ${pausa ? 'w-full' : 'hero-progresso'}`} />
      </div>
    </section>
  );
}
