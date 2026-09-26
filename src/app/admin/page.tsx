'use client';
import { useCallback, useEffect, useState } from 'react';
import { LEAD_STATUS, TIPO_VEICULO_LABEL, type Lead, type LeadStatus } from '@/types';
import { formatBRL, formatCredito } from '@/lib/format';

interface Resposta {
  resumo: { hoje: number; novos: number; emAtendimento: number; transferidos: number; convertidos: number };
  leads: Lead[];
}

const COR: Record<LeadStatus, string> = {
  NOVO: 'bg-eletrico/10 text-eletrico',
  IA_ATENDENDO: 'bg-purple-100 text-purple-700',
  QUALIFICADO: 'bg-sky-100 text-sky-700',
  AGUARDANDO_HUMANO: 'bg-ouro/25 text-navy',
  EM_NEGOCIACAO: 'bg-orange-100 text-orange-700',
  CONVERTIDO: 'bg-green-100 text-green-700',
  PERDIDO: 'bg-gray-100 text-gray-500',
};

export default function Painel() {
  const [dados, setDados] = useState<Resposta | null>(null);
  const [filtro, setFiltro] = useState<LeadStatus | ''>('');
  const [erro, setErro] = useState('');

  const carregar = useCallback(async () => {
    try {
      const r = await fetch(`/api/admin/leads${filtro ? `?status=${filtro}` : ''}`, { cache: 'no-store' });
      if (!r.ok) throw new Error(String(r.status));
      setDados(await r.json());
      setErro('');
    } catch {
      setErro('Não foi possível carregar os leads. Verifique a conexão e tente de novo.');
    }
  }, [filtro]);

  useEffect(() => {
    carregar();
    const t = setInterval(carregar, 15000);
    return () => clearInterval(t);
  }, [carregar]);

  async function mudar(id: string, status: LeadStatus) {
    await fetch(`/api/admin/leads/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    carregar();
  }

  const cards = dados
    ? [
        ['Leads hoje', dados.resumo.hoje],
        ['Novos leads', dados.resumo.novos],
        ['Em atendimento', dados.resumo.emAtendimento],
        ['Transferidos para humano', dados.resumo.transferidos],
        ['Convertidos', dados.resumo.convertidos],
      ] as const
    : [];

  return (
    <main className="min-h-screen bg-nevoa px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="titulo-secao text-3xl text-navy">Painel de leads</h1>
        {erro && <p className="mt-4 rounded-xl bg-red-50 p-3 text-red-700">{erro}</p>}
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5">
          {cards.map(([t, v]) => (
            <div key={t} className="rounded-2xl bg-white p-4">
              <p className="text-sm text-navy/60">{t}</p>
              <p className="num mt-1 text-3xl font-black text-navy">{v}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {[{ id: '' as const, label: 'Todos' }, ...LEAD_STATUS].map((s) => (
            <button key={s.id} onClick={() => setFiltro(s.id)} className={`rounded-full px-3 py-1.5 text-sm font-semibold ${filtro === s.id ? 'bg-navy text-white' : 'bg-white text-navy'}`}>{s.label}</button>
          ))}
        </div>

        <div className="mt-4 overflow-x-auto rounded-2xl bg-white">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="text-navy/60">
              <tr>{['Nome', 'WhatsApp', 'Veículo', 'Carta', 'Plano', 'Parcela', 'Origem', 'Status', 'Data'].map((h) => <th key={h} className="p-3">{h}</th>)}</tr>
            </thead>
            <tbody>
              {dados?.leads.length === 0 && (
                <tr><td colSpan={9} className="p-8 text-center text-navy/60">Nenhum lead ainda. Os leads do simulador e do WhatsApp aparecem aqui.</td></tr>
              )}
              {dados?.leads.map((l) => (
                <tr key={l.id} className="border-t border-nevoa">
                  <td className="p-3 font-semibold text-navy">{l.nome || '-'}</td>
                  <td className="p-3"><a className="text-eletrico underline" href={`https://wa.me/${l.whatsapp}`} target="_blank" rel="noopener noreferrer">{l.whatsapp}</a></td>
                  <td className="p-3">{l.tipoVeiculo ? TIPO_VEICULO_LABEL[l.tipoVeiculo] : '-'}{l.veiculo ? `: ${l.veiculo}` : ''}</td>
                  <td className="num p-3">{l.credito ? formatCredito(l.credito) : '-'}</td>
                  <td className="p-3">{l.plano ? `${l.plano}%` : '-'}</td>
                  <td className="num p-3">{l.parcela ? formatBRL(l.parcela) : '-'}</td>
                  <td className="p-3">{l.origem}</td>
                  <td className="p-3">
                    <select value={l.status} onChange={(e) => mudar(l.id, e.target.value as LeadStatus)} className={`rounded-lg px-2 py-1 text-xs font-bold ${COR[l.status]}`} aria-label={`Status de ${l.nome}`}>
                      {LEAD_STATUS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                    </select>
                  </td>
                  <td className="p-3 text-navy/60">{new Date(l.criadoEm).toLocaleString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
