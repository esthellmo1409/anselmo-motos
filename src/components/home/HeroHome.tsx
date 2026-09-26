'use client';

import Image from 'next/image';
import { useEffect, useState, type MouseEvent } from 'react';
import { BotaoWhats } from '../BotaoWhats';

const SLIDES = [
  { src: '/motos/cb500f.jpg', alt: 'Honda CB 500F na concessionária', pos: '62% 42%' },
  { src: '/motos/bros.jpg', alt: 'Honda Bros', pos: '42% 45%' },
  { src: '/motos/pcx-studio.jpg', alt: 'Scooter Honda', pos: '50% 50%' },
];

export function HeroHome() {
  const [atual, setAtual] = useState(0);
  const [pausa, setPausa] = useState(false);
  const [shift, setShift] = useState({ x: 0, y: 0 });
  const [fino, setFino] = useState(false);

  useEffect(() => {
    const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setFino(window.matchMedia('(pointer: fine)').matches && !reduzido);
    if (reduzido || pausa) return;
    const t = window.setInterval(() => setAtual((n) => (n + 1) % SLIDES.length), 7000);
    return () => window.clearInterval(t);
  }, [pausa]);

  const mover = (e: MouseEvent<HTMLElement>) => {
    if (!fino) return;
    const r = e.currentTarget.getBoundingClientRect();
    setShift({
      x: ((e.clientX - r.left) / r.width - 0.5) * 18,
      y: ((e.clientY - r.top) / r.height - 0.5) * 10,
    });
  };

  return (
    <section
      id="inicio"
      className="bg-[#efefef] pt-[4.5rem]"
      onMouseMove={mover}
      onMouseEnter={() => setPausa(true)}
      onMouseLeave={() => {
        setShift({ x: 0, y: 0 });
        setPausa(false);
      }}
    >
      <div className="grid min-h-[calc(100svh-4.5rem)] lg:grid-cols-[minmax(0,.86fr)_minmax(0,1.14fr)]">
        <div className="relative flex flex-col justify-center px-6 py-14 sm:px-10 lg:px-16 lg:py-20">
          <span className="absolute left-0 top-16 hidden h-24 w-px bg-azul-vivo lg:block" aria-hidden="true" />
          <p className="hero-esq text-xs font-semibold tracking-[0.28em] text-azul-vivo">ANSELMO MOTOS</p>
          <h1 className="hero-esq-2 mt-5 max-w-[11ch] text-[2.6rem] font-semibold leading-[1.02] tracking-tight text-grafite sm:text-6xl lg:text-[4.4rem]">
            Encontre a moto que combina com você.
          </h1>
          <p className="hero-esq-3 mt-6 max-w-md text-lg text-grafite/70">Novas experiências começam sobre duas rodas.</p>
          <div className="hero-esq-3 mt-10 flex flex-col gap-3 sm:flex-row">
            <a href="#motos" className="bg-azul-vivo px-7 py-4 text-center text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-azul">
              Ver motos
            </a>
            <BotaoWhats origem="hero" className="border border-grafite/20 px-7 py-4 text-center text-sm font-semibold text-grafite transition hover:-translate-y-0.5 hover:border-azul-vivo hover:text-azul-vivo">
              Falar com consultor
            </BotaoWhats>
          </div>
        </div>

        <div className="relative min-h-[68vh] overflow-hidden lg:min-h-full lg:-ml-10">
          {SLIDES.map((slide, i) => {
            const ativo = i === atual;
            return (
              <Image
                key={slide.src}
                src={slide.src}
                alt={slide.alt}
                fill
                priority={i === 0}
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover transition-[opacity,transform] duration-1000 ease-out"
                style={{
                  objectPosition: slide.pos,
                  opacity: ativo ? 1 : 0,
                  transform: ativo ? `translate3d(${shift.x}px, ${shift.y}px, 0) scale(1.05)` : 'translate3d(28px, 0, 0) scale(1)',
                }}
              />
            );
          })}
          <div className="absolute inset-x-0 bottom-0 flex items-center gap-4 bg-gradient-to-t from-black/50 to-transparent px-6 py-6">
            {SLIDES.map((slide, i) => (
              <button key={slide.src} type="button" aria-label={`Banner ${i + 1}`} onClick={() => setAtual(i)} className="relative h-px w-14 overflow-hidden bg-white/40">
                {i === atual && <span className="barra-hero absolute inset-0 bg-azul-vivo" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
