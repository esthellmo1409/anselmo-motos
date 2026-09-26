'use client';

import { useEffect, useState } from 'react';
import { NAV } from '@/config/nav';
import { Marca } from './Marca';
import { BotaoWhats } from './BotaoWhats';

export function Header() {
  const [rolou, setRolou] = useState(false);
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 8);
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

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition duration-500 ${rolou || aberto ? 'border-b border-black/10 bg-white/95 shadow-[0_8px_24px_-20px_rgba(0,0,0,.45)] backdrop-blur-md' : 'bg-transparent'}`}>
      <div className="mx-auto flex h-[4.5rem] max-w-[1440px] items-center justify-between gap-6 px-5 md:px-10">
        <a href="#inicio" aria-label="Anselmo Motos, início" onClick={() => setAberto(false)}>
          <Marca className="h-12 w-40 sm:h-14 sm:w-48" />
        </a>

        <nav className="hidden items-center gap-7 text-[13px] font-medium tracking-wide text-grafite/80 lg:flex" aria-label="Principal">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="transition hover:text-azul-vivo">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <BotaoWhats origem="header" className="hidden bg-azul-vivo px-5 py-3 text-sm font-semibold text-white transition hover:bg-azul sm:inline-flex">
            Fale com um consultor
          </BotaoWhats>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center lg:hidden"
            aria-expanded={aberto}
            aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setAberto((v) => !v)}
          >
            <span className="relative block h-3.5 w-5">
              <span className={`absolute left-0 h-px w-5 bg-grafite transition ${aberto ? 'top-1.5 rotate-45' : 'top-0'}`} />
              <span className={`absolute left-0 top-1.5 h-px w-5 bg-grafite transition ${aberto ? 'opacity-0' : ''}`} />
              <span className={`absolute left-0 h-px w-5 bg-grafite transition ${aberto ? 'top-1.5 -rotate-45' : 'top-3'}`} />
            </span>
          </button>
        </div>
      </div>

      {aberto && (
        <nav className="flex h-[calc(100svh-4.5rem)] flex-col bg-white px-6 py-8 lg:hidden" aria-label="Menu">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setAberto(false)} className="border-b border-black/10 py-4 text-2xl font-medium tracking-tight text-grafite">
              {item.label}
            </a>
          ))}
          <BotaoWhats origem="header-mobile" className="mt-8 bg-azul-vivo px-6 py-4 text-center text-base font-semibold text-white" >
            Fale com um consultor
          </BotaoWhats>
        </nav>
      )}
    </header>
  );
}
