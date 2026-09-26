'use client';
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { CREDITO_PADRAO, PLANO_PADRAO } from '@/data/consorcioData';
import { getParcela } from '@/lib/simulation';
import { track } from '@/lib/analytics';
import type { PlanoId, TipoVeiculo } from '@/types';

interface Estado {
  credito: number;
  plano: PlanoId;
  tipoVeiculo: TipoVeiculo | null;
  veiculo: string;
  parcela: number | null;
  formAberto: boolean;
  setCredito: (v: number) => void;
  setPlano: (p: PlanoId) => void;
  setTipoVeiculo: (t: TipoVeiculo | null) => void;
  setVeiculo: (m: string) => void;
  escolherVeiculo: (nome: string, tipo: TipoVeiculo) => void;
  abrirForm: () => void;
  fecharForm: () => void;
}

const Ctx = createContext<Estado | null>(null);

export function SimuladorProvider({ children }: { children: ReactNode }) {
  const [credito, setCredito] = useState(CREDITO_PADRAO);
  const [plano, setPlano] = useState<PlanoId>(PLANO_PADRAO);
  const [tipoVeiculo, setTipoVeiculo] = useState<TipoVeiculo | null>(null);
  const [veiculo, setVeiculo] = useState('');
  const [formAberto, setFormAberto] = useState(false);

  const escolherVeiculo = useCallback((nome: string, tipo: TipoVeiculo) => {
    setVeiculo(nome);
    setTipoVeiculo(tipo);
    track('veiculo_escolhido', { veiculo: nome, tipo });
    document.getElementById('simulador')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const value = useMemo<Estado>(
    () => ({
      credito,
      plano,
      tipoVeiculo,
      veiculo,
      parcela: getParcela(credito, plano),
      formAberto,
      setCredito,
      setPlano,
      setTipoVeiculo,
      setVeiculo,
      escolherVeiculo,
      abrirForm: () => {
        setFormAberto(true);
        track('form_aberto', { credito, plano, tipoVeiculo });
      },
      fecharForm: () => setFormAberto(false),
    }),
    [credito, plano, tipoVeiculo, veiculo, formAberto, escolherVeiculo],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSimulador() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useSimulador precisa estar dentro de <SimuladorProvider>');
  return c;
}
