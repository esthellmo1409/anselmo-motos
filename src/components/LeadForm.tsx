'use client';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { PLANOS } from '@/data/consorcioData';
import { veiculosAtivos } from '@/data/veiculos';
import { CREDITOS, getParcela } from '@/lib/simulation';
import { formatBRL, formatCredito, mascaraTelefone, telefoneValido } from '@/lib/format';
import { linkWhatsApp, montarMensagemLead } from '@/lib/whatsapp';
import { lerUtm, track } from '@/lib/analytics';
import type { PlanoId } from '@/types';
import { useSimulador } from './SimuladorProvider';
import { IconWhats, IconX } from './Icons';
import { TipoVeiculoToggle } from './TipoVeiculoToggle';

export function LeadForm() {
  const { formAberto, fecharForm, credito, plano, tipoVeiculo, veiculo, setCredito, setPlano, setTipoVeiculo, setVeiculo } = useSimulador();
  const [nome, setNome] = useState('');
  const [whats, setWhats] = useState('');
  const [cidade, setCidade] = useState('');
  const [erros, setErros] = useState<Record<string, string>>({});
  const [enviando, setEnviando] = useState(false);
  const primeiro = useRef<HTMLInputElement>(null);
  const parcela = getParcela(credito, plano);

  useEffect(() => {
    if (!formAberto) return;
    const t = setTimeout(() => primeiro.current?.focus(), 250);
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && fecharForm();
    document.addEventListener('keydown', esc);
    document.body.style.overflow = 'hidden';
    return () => {
      clearTimeout(t);
      document.removeEventListener('keydown', esc);
      document.body.style.overflow = '';
    };
  }, [formAberto, fecharForm]);

  if (!formAberto) return null;

  function enviar(e: FormEvent) {
    e.preventDefault();
    const erro: Record<string, string> = {};
    if (nome.trim().length < 2) erro.nome = 'Digite seu nome.';
    if (!telefoneValido(whats)) erro.whats = 'Digite um celular com DDD, ex.: (99) 98888-7777.';
    setErros(erro);
    if (Object.keys(erro).length) return;


    setEnviando(true);
    const dados = { nome: nome.trim(), cidade: cidade.trim(), tipoVeiculo: tipoVeiculo ?? undefined, veiculo, credito, plano };
    const url = linkWhatsApp(montarMensagemLead({ ...dados, parcela }));

    // Salva o lead sem segurar o cliente: sendBeacon continua mesmo se a página sair.
    const corpo = JSON.stringify({ ...dados, whatsapp: whats, utm: lerUtm() });
    let enviado = false;
    try {
      enviado = navigator.sendBeacon?.('/api/leads', new Blob([corpo], { type: 'application/json' })) ?? false;
    } catch {
      /* navegador sem suporte: usa fetch abaixo */
    }
    if (!enviado) fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: corpo, keepalive: true }).catch(() => {});

    track('lead_enviado', { credito, plano, tipoVeiculo, veiculo });
    track('whatsapp_clique', { origem: 'formulario' });
    // Abre no mesmo gesto do clique (evita bloqueio de pop-up); se bloquear, navega direto.
    const aba = window.open(url, '_blank');
    if (aba) aba.opener = null;
    else window.location.href = url;
    setTimeout(() => setEnviando(false), 1200);
  }

  const campo = 'mt-1.5 w-full rounded-xl border-2 border-nevoa bg-white px-4 py-3.5 text-base text-navy outline-none transition focus:border-eletrico';

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-labelledby="titulo-form">
      <button className="absolute inset-0 bg-navy-deep/70 backdrop-blur-sm" onClick={fecharForm} aria-label="Fechar formulário" />
      <form onSubmit={enviar} noValidate className="relative max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-[28px] bg-white p-6 pb-8 animate-entrada sm:rounded-[28px]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="titulo-form" className="titulo-secao text-2xl text-navy">Falta pouco</h2>
            <p className="mt-1 text-navy/60">Seus dados vão junto com a simulação para o WhatsApp.</p>
          </div>
          <button type="button" onClick={fecharForm} className="rounded-full p-2 text-navy/60 hover:bg-nevoa" aria-label="Fechar"><IconX /></button>
        </div>

        <div className="mt-5 rounded-2xl bg-navy p-4 text-white">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="text-xs text-white/60">Tenho interesse em</span>
            <TipoVeiculoToggle valor={tipoVeiculo} onChange={setTipoVeiculo} escuro />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs text-white/60">Valor da carta
              <select value={credito} onChange={(e) => setCredito(Number(e.target.value))} className="num mt-1 w-full rounded-lg bg-white/10 px-2 py-2 text-base font-bold text-white">
                {CREDITOS.map((c) => <option key={c} value={c} className="text-navy">{formatCredito(c)}</option>)}
              </select>
            </label>
            <label className="text-xs text-white/60">Plano escolhido
              <select value={plano} onChange={(e) => setPlano(e.target.value as PlanoId)} className="mt-1 w-full rounded-lg bg-white/10 px-2 py-2 text-base font-bold text-white">
                {PLANOS.map((p) => <option key={p.id} value={p.id} className="text-navy">{p.nome}</option>)}
              </select>
            </label>
          </div>
          <p className="mt-3 text-sm text-white/70">Parcela estimada: <strong className="num text-ouro">{parcela ? formatBRL(parcela) : 'consulte'}</strong></p>
        </div>

        <div className="mt-5 space-y-4">
          <label className="block text-sm font-bold text-navy">Nome
            <input ref={primeiro} value={nome} onChange={(e) => { setNome(e.target.value); if (erros.nome) setErros((x) => ({ ...x, nome: '' })); }} autoComplete="given-name" className={campo} aria-invalid={!!erros.nome} aria-describedby="erro-nome" />
            {erros.nome && <span id="erro-nome" className="mt-1 block text-sm font-medium text-red-600">{erros.nome}</span>}
          </label>
          <label className="block text-sm font-bold text-navy">WhatsApp
            <input value={whats} onChange={(e) => { setWhats(mascaraTelefone(e.target.value)); if (erros.whats) setErros((x) => ({ ...x, whats: '' })); }} inputMode="tel" autoComplete="tel-national" placeholder="(99) 98888-7777" className={campo} aria-invalid={!!erros.whats} aria-describedby="erro-whats" />
            {erros.whats && <span id="erro-whats" className="mt-1 block text-sm font-medium text-red-600">{erros.whats}</span>}
          </label>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-3">
            <label className="block text-sm font-bold text-navy">Cidade
              <input value={cidade} onChange={(e) => setCidade(e.target.value)} autoComplete="address-level2" placeholder="Bacabal" className={campo} />
            </label>
            <label className="block text-sm font-bold text-navy">{tipoVeiculo === 'CARRO' ? 'Qual carro você procura?' : tipoVeiculo === 'MOTO' ? 'Qual moto você procura?' : 'Qual modelo você procura?'}
              <input value={veiculo} onChange={(e) => setVeiculo(e.target.value)} list="lista-veiculos" placeholder="Opcional" className={campo} />
              <datalist id="lista-veiculos">{veiculosAtivos(tipoVeiculo ?? undefined).map((v) => <option key={v.id} value={v.nome} />)}</datalist>
            </label>
          </div>
        </div>

        <button type="submit" disabled={enviando} className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1FAF5A] px-6 py-4 text-lg font-black uppercase text-white transition hover:brightness-110 disabled:opacity-60">
          <IconWhats className="h-6 w-6" /> {enviando ? 'Abrindo WhatsApp…' : 'Continuar no WhatsApp'}
        </button>
        <p className="mt-3 text-center text-xs text-navy/50">Usamos seus dados só para este atendimento.</p>
      </form>
    </div>
  );
}
