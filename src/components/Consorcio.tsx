import { OFERTAS_CONSORCIO, TABELA_INFO } from '@/data/consorcioData';
import { SITE } from '@/config/site';
import { BotaoWhats } from './BotaoWhats';

const ETAPAS = [
  { t: 'Você escolhe sua carta', d: 'Define o valor de crédito e o plano que cabem no seu planejamento.' },
  { t: 'Entra no grupo', d: 'Passa a pagar as parcelas junto com outros participantes.' },
  { t: 'Participa das assembleias', d: 'As contemplações acontecem por sorteio ou lance, conforme as regras do grupo.' },
  { t: 'Usa o crédito', d: 'Quando contemplado, utiliza a carta conforme as regras aplicáveis.' },
];

export function Consorcio() {
  return (
    <section id="consorcio" className="scroll-mt-20 bg-[#f7f5f2] text-[#141414]" aria-labelledby="titulo-consorcio">
      <div className="grid lg:grid-cols-[1.15fr_.85fr]">
        <div className="px-6 py-20 sm:px-12 lg:px-16 lg:py-28">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#1565C0]">{TABELA_INFO.administradora}</p>
          <h2 id="titulo-consorcio" className="mt-4 max-w-xl text-4xl font-semibold leading-[0.92] tracking-[-0.04em] sm:text-6xl">
            Seu próximo veículo pode começar aqui.
          </h2>
          <p className="mt-6 max-w-md text-lg text-[#141414]/70">Uma forma planejada de comprar carro ou moto. A carta contemplada e a contemplação na 1ª parcela dependem da disponibilidade.</p>
          <ul className="mt-10 max-w-lg border-t border-black/10">
            {OFERTAS_CONSORCIO.map((item) => (
              <li key={item} className="border-b border-black/10 py-4 text-base font-medium">{item}</li>
            ))}
          </ul>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <BotaoWhats origem="consorcio" className="bg-[#1565C0] px-7 py-4 text-center text-[12px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#0C447C]">
              WhatsApp {SITE.whatsappExibicao}
            </BotaoWhats>
            <a href="#simulador" className="border border-[#141414] px-7 py-4 text-center text-[12px] font-semibold uppercase tracking-[0.16em] transition hover:bg-[#141414] hover:text-white">Ver minha parcela</a>
          </div>
        </div>
        <ol className="flex flex-col justify-center gap-8 border-t border-black/10 px-6 py-16 sm:px-12 lg:border-l lg:border-t-0 lg:px-14">
          {ETAPAS.map((etapa, i) => (
            <li key={etapa.t}>
              <span className="text-[11px] tracking-[0.22em] text-[#1565C0]">0{i + 1}</span>
              <h3 className="mt-2 text-xl font-semibold">{etapa.t}</h3>
              <p className="mt-1 text-[#141414]/65">{etapa.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
