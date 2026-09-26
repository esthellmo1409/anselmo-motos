'use client';

import { useEffect, useState } from 'react';
import { NAV } from '@/config/nav';
import { Marca } from './Marca';
import { BotaoWhats } from './BotaoWhats';

export function Header() {
  const [solido, setSolido] = useState(false);
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    const aoRolar = () => setSolido(window.scrollY > window.innerHeight * 0.72);
    aoRolar();
    window.addEventListener('scroll', aoRolar, { passive: true });
    return () => window.removeEventListener('scroll', aoRolar);
  }, []);

  useEffect(() => {
    document.body.style.overflow = aberto ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [aberto]);

  const claro = !solido && !aberto;

  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition duration-500 ${solido || aberto ? 'bg-white/95 text-[#141414] shadow-[0_1px_0_rgba(0,0,0,.08)]' : 'bg-transparent text-white'}`}>
      <div className="mx-auto flex h-[4.75rem] max-w-[1500px] items-center justify-between gap-8 px-5 md:px-10">
        <a href="/#inicio" aria-label="Anselmo Motos" onClick={() => setAberto(false)}>
          <Marca sobreFoto={claro} className="h-10 w-32 sm:h-11 sm:w-40" />
        </a>
        <nav className="hidden items-center gap-8 text-[13px] tracking-[0.14em] lg:flex" aria-label="Principal">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="uppercase transition hover:text-[#7eb0ff]">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <BotaoWhats origem="header" className={`hidden text-[12px] font-semibold uppercase tracking-[0.16em] transition lg:inline-flex ${claro ? 'text-white hover:text-[#9ec2ff]' : 'bg-[#1565C0] px-5 py-3 text-white hover:bg-[#0C447C]'}`}>
            WhatsApp
          </BotaoWhats>
          <button type="button" className="grid h-11 w-11 place-items-center lg:hidden" aria-expanded={aberto} aria-label={aberto ? 'Fechar menu' : 'Abrir menu'} onClick={() => setAberto((v) => !v)}>
            <span className="relative block h-3 w-6">
              <span className={`absolute left-0 h-px w-6 bg-current transition ${aberto ? 'top-1.5 rotate-45' : 'top-0'}`} />
              <span className={`absolute left-0 top-1.5 h-px w-6 bg-current transition ${aberto ? 'opacity-0' : ''}`} />
              <span className={`absolute left-0 h-px w-6 bg-current transition ${aberto ? 'top-1.5 -rotate-45' : 'top-3'}`} />
            </span>
          </button>
        </div>
      </div>
      <div className={`overflow-hidden bg-[#f7f5f2] text-[#141414] transition-[max-height] duration-500 lg:hidden ${aberto ? 'max-h-[100svh]' : 'max-h-0'}`}>
        <nav className="flex flex-col px-6 pb-8" aria-label="Menu">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setAberto(false)} className="border-b border-black/10 py-4 text-2xl font-medium tracking-tight">
              {item.label}
            </a>
          ))}
          <BotaoWhats origem="header-mobile" className="mt-6 bg-[#1565C0] px-6 py-4 text-center text-sm font-semibold uppercase tracking-[0.14em] text-white">
            WhatsApp
          </BotaoWhats>
        </nav>
      </div>
    </header>
  );
}
