'use client';
import { TIPO_VEICULO_LABEL, type TipoVeiculo } from '@/types';

/** Escolha Carro | Moto. Clicar de novo no ativo desmarca (o campo é opcional). */
export function TipoVeiculoToggle({
  valor,
  onChange,
  escuro = false,
}: {
  valor: TipoVeiculo | null;
  onChange: (t: TipoVeiculo | null) => void;
  escuro?: boolean;
}) {
  return (
    <div role="radiogroup" aria-label="Carro ou moto" className={`inline-flex rounded-2xl p-1 ${escuro ? 'bg-white/10' : 'bg-nevoa'}`}>
      {(Object.keys(TIPO_VEICULO_LABEL) as TipoVeiculo[]).map((t) => {
        const ativo = valor === t;
        return (
          <button
            key={t}
            type="button"
            role="radio"
            aria-checked={ativo}
            onClick={() => onChange(ativo ? null : t)}
            className={`rounded-xl px-5 py-2.5 text-sm font-black uppercase transition ${
              ativo ? 'bg-eletrico text-white shadow' : escuro ? 'text-white/70 hover:text-white' : 'text-navy/70 hover:text-navy'
            }`}
            style={{ fontStretch: '115%' }}
          >
            {TIPO_VEICULO_LABEL[t]}
          </button>
        );
      })}
    </div>
  );
}
