import { formatBRL, formatCreditoCurto } from '@/lib/format';
import { TABELA } from '@/data/consorcioData';
import { BotaoWhats } from './BotaoWhats';
import { IconCheck, IconWhats } from './Icons';
import { MotoIlustracao } from './MotoIlustracao';
import { CarroIlustracao } from './CarroIlustracao';

const CONFIANCA = ['Atendimento especializado', 'Consórcio Canopus', 'Carros e motos', 'Atendimento pelo WhatsApp'];

export function Hero() {
  const primeira = TABELA[0];
  return (
    <section id="inicio" className="relative overflow-hidden bg-navy-deep pb-14 pt-28 text-white sm:pb-20 sm:pt-36">
      <div className="linhas-velocidade absolute inset-0" aria-hidden="true" />
      <div className="absolute -right-40 top-10 h-[520px] w-[520px] rounded-full bg-eletrico/25 blur-[120px]" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-4 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <h1 className="titulo-largo text-[2.5rem] sm:text-6xl lg:text-[4.1rem]">
            <span className="block animate-entrada">Seu carro ou sua moto.</span>
            <span className="block animate-entrada text-ouro [animation-delay:120ms]">Comece pelo seu consórcio.</span>
          </h1>
          <p className="mt-5 max-w-lg animate-entrada text-lg text-white/75 [animation-delay:240ms]">
            Escolha sua carta de crédito, veja uma estimativa de parcela e fale com um especialista da Anselmo Motos pelo WhatsApp.
          </p>
          <div className="mt-8 flex animate-entrada flex-col gap-3 [animation-delay:360ms] sm:flex-row">
            <a href="#simulador" className="whitespace-nowrap rounded-2xl bg-ouro px-6 py-4 text-center text-base font-black uppercase text-navy-deep shadow-botao transition hover:-translate-y-0.5 hover:bg-[#FFCD45]">
              Simular meu consórcio
            </a>
            <BotaoWhats origem="hero" className="flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl border-2 border-white/25 px-6 py-4 text-base font-black uppercase transition hover:border-white/60">
              <IconWhats /> Falar com especialista
            </BotaoWhats>
          </div>
          <ul className="mt-8 grid animate-entrada grid-cols-2 gap-x-4 gap-y-2 text-sm text-white/80 [animation-delay:480ms] sm:flex sm:flex-wrap sm:gap-x-6">
            {CONFIANCA.map((c) => (
              <li key={c} className="flex items-center gap-2"><span className="grid h-5 w-5 place-items-center rounded-full bg-eletrico text-white"><IconCheck className="h-3 w-3" /></span>{c}</li>
            ))}
          </ul>
        </div>

        <div className="relative animate-entrada [animation-delay:200ms]">
          {/* Para usar foto real: <Image src="/hero/veiculos.webp" alt="Carro e moto" width={1200} height={800} priority /> */}
          <div className="relative pb-[20%] pt-16">
            <CarroIlustracao className="w-[88%] drop-shadow-[0_30px_40px_rgba(0,0,0,.5)]" />
            <MotoIlustracao className="absolute -bottom-2 -right-2 w-[54%] drop-shadow-[0_30px_40px_rgba(0,0,0,.6)]" />
          </div>
          <a href="#simulador" className="absolute left-2 top-2 rounded-2xl sm:left-6 border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md transition hover:bg-white/15">
            <span className="block text-xs text-white/70">Carta de {formatCreditoCurto(primeira.credito)} no Plano 70%</span>
            <span className="num block text-xl font-black text-ouro">{formatBRL(primeira.parcelas['70'])}/mês</span>
          </a>
        </div>
      </div>
    </section>
  );
}
