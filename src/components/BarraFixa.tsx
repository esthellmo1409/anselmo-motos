'use client';
import { useEffect, useState } from 'react';
import { BotaoWhats } from './BotaoWhats';
import { IconWhats } from './Icons';
import { useSimulador } from './SimuladorProvider';

/** Botão flutuante do WhatsApp + barra fixa no celular (some quando o simulador está na tela). */
export function BarraFixa() {
  const { formAberto } = useSimulador();
  const [mostrarBarra, setMostrarBarra] = useState(false);

  useEffect(() => {
    const sim = document.getElementById('simulador');
    const hero = document.getElementById('inicio');
    if (!sim || !hero) return;
    const vis = { sim: false, hero: true };
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.target === sim) vis.sim = en.isIntersecting;
        if (en.target === hero) vis.hero = en.isIntersecting;
      });
      setMostrarBarra(!vis.sim && !vis.hero);
    }, { threshold: 0.15 });
    obs.observe(sim);
    obs.observe(hero);
    return () => obs.disconnect();
  }, []);

  if (formAberto) return null;
  return (
    <>
      <BotaoWhats origem="flutuante" className="fixed bottom-24 right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#1FAF5A] text-white shadow-lg transition hover:scale-105 sm:bottom-6 sm:right-6 sm:h-16 sm:w-16">
        <IconWhats className="h-7 w-7" /><span className="sr-only">Falar no WhatsApp</span>
      </BotaoWhats>
      <div className={`fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-navy-deep/95 p-3 backdrop-blur transition-transform duration-300 sm:hidden ${mostrarBarra ? 'translate-y-0' : 'translate-y-full'}`} style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
        <a href="#simulador" className="block bg-azul-vivo py-3.5 text-center font-semibold text-white">Ver minha parcela</a>
      </div>
    </>
  );
}
