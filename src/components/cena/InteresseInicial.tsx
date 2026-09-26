'use client';

import { useEffect } from 'react';
import { VEICULOS } from '@/data/veiculos';
import { useSimulador } from '../SimuladorProvider';

/** Abre o simulador já com o modelo vindo de /motos/[id]. */
export function InteresseInicial({ id }: { id?: string }) {
  const { escolherVeiculo } = useSimulador();

  useEffect(() => {
    if (!id) return;
    const veiculo = VEICULOS.find((item) => item.id === id && item.ativo);
    if (veiculo) escolherVeiculo(veiculo.nome, veiculo.tipo);
  }, [id, escolherVeiculo]);

  return null;
}
