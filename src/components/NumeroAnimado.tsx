'use client';
import { useEffect, useRef, useState } from 'react';

/** Conta até o novo valor quando ele muda (respeita "reduzir movimento"). */
export function NumeroAnimado({ valor, formatar }: { valor: number; formatar: (v: number) => string }) {
  const [exibido, setExibido] = useState(valor);
  const anterior = useRef(valor);

  useEffect(() => {
    const inicio = anterior.current;
    anterior.current = valor;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return setExibido(valor);
    const t0 = performance.now();
    let raf = 0;
    const passo = (t: number) => {
      const k = Math.min(1, (t - t0) / 450);
      const e = 1 - Math.pow(1 - k, 3);
      setExibido(inicio + (valor - inicio) * e);
      if (k < 1) raf = requestAnimationFrame(passo);
    };
    raf = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(raf);
  }, [valor]);

  return <>{formatar(exibido)}</>;
}
