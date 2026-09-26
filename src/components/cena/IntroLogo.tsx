'use client';

import { useEffect, useState } from 'react';
import { Marca } from '../Marca';

const CHAVE = 'anselmo-intro';

export function IntroLogo() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (sessionStorage.getItem(CHAVE)) return;
    setVisivel(true);
    const t = window.setTimeout(() => {
      sessionStorage.setItem(CHAVE, '1');
      setVisivel(false);
    }, 2800);
    return () => window.clearTimeout(t);
  }, []);

  if (!visivel) return null;

  return (
    <div className="intro-sai fixed inset-0 z-[70] flex items-center justify-center bg-[#070707] text-white" role="presentation">
      <div className="relative w-[min(88vw,520px)]">
        <span className="linha-mecanica absolute -top-8 left-0 h-px w-full bg-white/70" />
        <span className="linha-mecanica absolute -bottom-8 left-0 h-px w-2/3 bg-[#1565C0]" style={{ animationDelay: '180ms' }} />
        <span className="absolute -left-6 top-0 h-full w-px origin-top bg-white/40" style={{ animation: 'linha-mecanica .6s .2s both', transformOrigin: 'top' }} />
        <div className="logo-encaixe mx-auto w-fit bg-black">
          <Marca className="h-20 w-72 sm:h-24 sm:w-80" />
        </div>
      </div>
      <button type="button" onClick={() => { sessionStorage.setItem(CHAVE, '1'); setVisivel(false); }} className="absolute bottom-8 right-8 text-[11px] uppercase tracking-[0.2em] text-white/60">
        Pular
      </button>
    </div>
  );
}
