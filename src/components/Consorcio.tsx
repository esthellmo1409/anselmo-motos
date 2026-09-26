import { OFERTAS_CONSORCIO } from '@/data/consorcioData';
import { SITE } from '@/config/site';
import { BotaoWhats } from './BotaoWhats';
import { IconCheck } from './Icons';

const ETAPAS = [
  { t: 'Você escolhe sua carta', d: 'Define o valor de crédito e o plano que cabem no seu planejamento.' },
  { t: 'Entra no grupo', d: 'Passa a pagar as parcelas junto com outros participantes.' },
  { t: 'Participa das assembleias', d: 'As contemplações acontecem por sorteio ou lance, conforme as regras do grupo.' },
  { t: 'Usa o crédito', d: 'Quando contemplado, utiliza a carta conforme as regras aplicáveis.' },
];

const MOTIVOS = [
  { t: 'Planejamento', d: 'Você organiza a compra com uma parcela mensal definida na contratação.' },
  { t: 'Carta do seu tamanho', d: 'Escolhe o valor de crédito de acordo com o carro ou a moto que procura.' },
  { t: 'Atendimento próximo', d: 'Um especialista da Anselmo Motos acompanha você pelo WhatsApp.' },
];

export function Consorcio() {
  return (
    <section id="consorcio" className="scroll-mt-24 bg-white px-5 py-20 text-grafite sm:px-10 sm:py-28 lg:px-16" aria-labelledby="titulo-consorcio">
      <div className="mx-auto max-w-[1200px]">
        <h2 id="titulo-consorcio" className="max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">O que é um consórcio?</h2>
        <p className="mt-4 max-w-xl text-lg text-grafite/65">Uma forma planejada de comprar seu carro ou sua moto, em quatro passos.</p>

        <ol className="mt-14 grid gap-10 border-t border-black/10 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {ETAPAS.map((e, i) => (
            <li key={e.t}>
              <span className="text-sm font-semibold tracking-[0.18em] text-azul-vivo">0{i + 1}</span>
              <h3 className="mt-3 text-xl font-semibold">{e.t}</h3>
              <p className="mt-2 text-grafite/65">{e.d}</p>
            </li>
          ))}
        </ol>

        <div className="mt-20 grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Por que considerar um consórcio?</h2>
          <dl className="border-t border-black/10">
            {MOTIVOS.map((m) => (
              <div key={m.t} className="grid gap-1 border-b border-black/10 py-5 sm:grid-cols-[180px_1fr] sm:gap-8">
                <dt className="font-semibold">{m.t}</dt>
                <dd className="text-grafite/65">{m.d}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-20">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">O plano de consórcio</h2>
          <p className="mt-4 max-w-2xl text-grafite/65">Estas são as condições que a Anselmo Motos trabalha. A carta contemplada e a contemplação na 1ª parcela dependem da disponibilidade.</p>
          <ul className="mt-8 grid gap-x-12 sm:grid-cols-2">
            {OFERTAS_CONSORCIO.map((item) => (
              <li key={item} className="flex items-start gap-3 border-b border-black/10 py-4">
                <span className="mt-0.5 text-azul-vivo"><IconCheck className="h-4 w-4" /></span>
                <span className="font-medium">{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <BotaoWhats origem="consorcio" className="bg-azul-vivo px-7 py-4 text-center text-sm font-semibold text-white transition hover:bg-azul">
              WhatsApp {SITE.whatsappExibicao}
            </BotaoWhats>
            <a href="#simulador" className="border border-grafite px-7 py-4 text-center text-sm font-semibold transition hover:border-azul-vivo hover:text-azul-vivo">Ver minha parcela</a>
          </div>
        </div>
      </div>
    </section>
  );
}
