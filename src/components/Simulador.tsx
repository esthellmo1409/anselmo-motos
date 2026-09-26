'use client';
import { useState, type CSSProperties } from 'react';
import { OFERTAS_CONSORCIO, PLANOS, TABELA, TABELA_INFO } from '@/data/consorcioData';
import { CREDITOS } from '@/lib/simulation';
import { formatBRL, formatCredito, formatCreditoCurto } from '@/lib/format';
import { track } from '@/lib/analytics';
import { useSimulador } from './SimuladorProvider';
import { NumeroAnimado } from './NumeroAnimado';
import { TipoVeiculoToggle } from './TipoVeiculoToggle';
import { IconCheck, IconMais, IconMenos, IconX } from './Icons';

export function Simulador() {
  const { credito, plano, parcela, tipoVeiculo, veiculo, setCredito, setPlano, setTipoVeiculo, setVeiculo, abrirForm } = useSimulador();
  const [verTabela, setVerTabela] = useState(false);
  const [mexeu, setMexeu] = useState({ valor: false, plano: false });
  const idx = Math.max(0, CREDITOS.indexOf(credito));
  const progresso = mexeu.valor && mexeu.plano ? 66 : mexeu.valor || mexeu.plano ? 33 : 10;

  const mudarIdx = (i: number) => {
    const n = CREDITOS[Math.min(CREDITOS.length - 1, Math.max(0, i))];
    setCredito(n);
    setMexeu((m) => ({ ...m, valor: true }));
    track('simulador_valor', { credito: n });
  };

  return (
    <section id="simulador" className="scroll-mt-24 bg-papel px-4 py-16 sm:py-24" aria-labelledby="titulo-simulador">
      <div className="mx-auto max-w-5xl">
        <h2 id="titulo-simulador" className="max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-[#141414] sm:text-6xl">
          Qual é o valor do carro ou da moto que você procura?
        </h2>
        <p className="mt-3 max-w-xl text-lg text-navy/70">Arraste, escolha o plano e veja a parcela na hora.</p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          {/* Controles */}
          <div className="border border-black/10 bg-white p-5 sm:p-8">
            <div className="mb-6" aria-hidden="true">
              <div className="flex justify-between text-xs font-semibold text-navy/60">
                <span>Valor</span><span>Plano</span><span>Seus dados</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-nevoa">
                <div className="h-full rounded-full bg-eletrico transition-all duration-500" style={{ width: `${progresso}%` }} />
              </div>
            </div>

            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <p className="text-base font-bold text-navy">O que você procura?</p>
              <TipoVeiculoToggle
                valor={tipoVeiculo}
                onChange={(t) => {
                  setTipoVeiculo(t);
                  setVeiculo('');
                  track('simulador_tipo', { tipo: t });
                }}
              />
            </div>

            {veiculo && (
              <div className="mb-5 flex items-center justify-between gap-3 rounded-2xl border border-eletrico/30 bg-eletrico/5 px-4 py-3">
                <p className="text-sm text-navy"><span className="text-navy/60">Modelo de interesse: </span><strong>{veiculo}</strong></p>
                <button onClick={() => setVeiculo('')} className="rounded-full p-1 text-navy/60 hover:bg-white" aria-label="Remover modelo de interesse"><IconX className="h-4 w-4" /></button>
              </div>
            )}

            <label htmlFor="faixa-credito" className="block text-base font-bold text-navy">Quanto você pretende investir?</label>
            <div className="mt-3 flex items-center gap-3">
              <button type="button" onClick={() => mudarIdx(idx - 1)} disabled={idx === 0} className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-nevoa text-navy transition active:scale-95 disabled:opacity-40" aria-label="Diminuir valor da carta"><IconMenos /></button>
              <output htmlFor="faixa-credito" className="num flex-1 text-center text-4xl font-black tracking-tight text-navy sm:text-5xl" style={{ fontStretch: '115%' }}>
                {formatCredito(credito)}
              </output>
              <button type="button" onClick={() => mudarIdx(idx + 1)} disabled={idx === CREDITOS.length - 1} className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-nevoa text-navy transition active:scale-95 disabled:opacity-40" aria-label="Aumentar valor da carta"><IconMais /></button>
            </div>
            <input
              id="faixa-credito"
              type="range"
              min={0}
              max={CREDITOS.length - 1}
              step={1}
              value={idx}
              onChange={(e) => mudarIdx(Number(e.target.value))}
              aria-valuetext={formatCredito(credito)}
              className="faixa mt-3"
              style={{ '--p': `${(idx / (CREDITOS.length - 1)) * 100}%` } as CSSProperties}
            />
            <div className="flex justify-between text-xs font-medium text-navy/50">
              <span>{formatCreditoCurto(CREDITOS[0])}</span>
              <span>{formatCreditoCurto(CREDITOS[CREDITOS.length - 1])}</span>
            </div>

            <fieldset className="mt-7">
              <legend className="text-base font-bold text-navy">Escolha seu plano</legend>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {PLANOS.map((p) => {
                  const ativo = p.id === plano;
                  return (
                    <label key={p.id} className={`cursor-pointer rounded-2xl border-2 p-4 transition ${ativo ? 'border-navy bg-navy text-white' : 'border-nevoa bg-white text-navy hover:border-eletrico/40'}`}>
                      <input
                        type="radio"
                        name="plano"
                        value={p.id}
                        checked={ativo}
                        onChange={() => {
                          setPlano(p.id);
                          setMexeu((m) => ({ ...m, plano: true }));
                          track('simulador_plano', { plano: p.id });
                        }}
                        className="sr-only"
                      />
                      <span className="block text-lg font-black uppercase" style={{ fontStretch: '115%' }}>{p.nome}</span>
                      <span className={`num mt-1 block text-sm ${ativo ? 'text-white/70' : 'text-navy/60'}`}>{formatBRL(TABELA[idx].parcelas[p.id])}/mês</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
            <ul className="mt-6 grid gap-2 text-sm text-navy/80">
              {OFERTAS_CONSORCIO.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-eletrico text-white"><IconCheck className="h-3 w-3" /></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Carta: o elemento assinatura */}
          <div className="flex flex-col">
            <div className="relative overflow-hidden bg-[#111] p-6 text-white sm:p-8" aria-live="polite">
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-white/60">Carta de crédito</p>
                  <p className="num mt-1 text-3xl font-black sm:text-4xl" style={{ fontStretch: '115%' }}>{formatCredito(credito)}</p>
                </div>
                <div className="h-1 w-12 bg-azul-vivo" aria-hidden="true" />
              </div>
              <div className="relative mt-10">
                <p className="text-sm font-semibold text-white/60">Parcela estimada no Plano {plano}%</p>
                <p className="num mt-1 text-5xl font-black text-white sm:text-6xl" style={{ fontStretch: '110%' }}>
                  {parcela !== null ? <NumeroAnimado valor={parcela} formatar={formatBRL} /> : 'Consulte'}
                </p>
              </div>
              <p className="relative mt-6 text-xs leading-relaxed text-white/50">{TABELA_INFO.administradora}. {TABELA_INFO.aviso}</p>
            </div>

            <button onClick={abrirForm} className="mt-5 w-full bg-azul-vivo px-6 py-5 text-lg font-semibold text-white transition hover:bg-azul">
              Quero receber mais informações
            </button>
            <p className="mt-3 text-center text-sm text-navy/60">Leva menos de 30 segundos. Você continua pelo WhatsApp.</p>

            <button onClick={() => setVerTabela((v) => !v)} aria-expanded={verTabela} className="mt-6 self-center text-sm font-semibold text-eletrico underline underline-offset-4">
              {verTabela ? 'Esconder tabela completa' : 'Ver tabela completa'}
            </button>
          </div>
        </div>

        {verTabela && (
          <div className="mt-6 overflow-x-auto rounded-3xl bg-white p-2 shadow-sm">
            <table className="w-full min-w-[420px] text-left text-sm">
              <caption className="sr-only">Tabela de cartas de crédito e parcelas</caption>
              <thead className="text-navy/60">
                <tr><th className="p-3">Carta de crédito</th>{PLANOS.map((p) => <th key={p.id} className="p-3">{p.nome}</th>)}</tr>
              </thead>
              <tbody className="num">
                {TABELA.map((l) => (
                  <tr key={l.credito} className={`border-t border-nevoa ${l.credito === credito ? 'bg-azul-vivo/10 font-bold' : ''}`}>
                    <td className="p-3"><button className="underline-offset-2 hover:underline" onClick={() => { setCredito(l.credito); setMexeu((m) => ({ ...m, valor: true })); }}>{formatCredito(l.credito)}</button></td>
                    {PLANOS.map((p) => <td key={p.id} className="p-3">{formatBRL(l.parcelas[p.id])}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
