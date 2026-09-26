import Image from 'next/image';
import { OFERTAS_CONSORCIO } from '@/data/consorcioData';
import { SITE } from '@/config/site';
import { BotaoWhats } from '../BotaoWhats';
import { IconCheck } from '../Icons';
import { Reveal } from './Reveal';

export function Financeiro() {
  return (
    <section id="financiamento" className="scroll-mt-24 bg-white">
      <article className="grid min-h-[70vh] lg:grid-cols-2">
        <div className="relative min-h-[46vh]">
          <Image src="/motos/pcx-studio.jpg" alt="Scooter Honda" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </div>
        <Reveal className="flex flex-col justify-center px-6 py-16 sm:px-12 lg:px-20">
          <p className="text-xs font-semibold tracking-[0.22em] text-azul-vivo">FINANCIAMENTO</p>
          <h2 className="mt-4 max-w-md text-4xl font-semibold tracking-tight text-grafite sm:text-5xl">Encontre as melhores condições para sua nova moto.</h2>
          <BotaoWhats origem="financiamento" mensagem={SITE.mensagemFinanciamento} className="mt-8 inline-flex w-fit bg-azul-vivo px-7 py-4 text-sm font-semibold text-white transition hover:bg-azul">
            Simular financiamento
          </BotaoWhats>
        </Reveal>
      </article>

      <article className="grid min-h-[70vh] lg:grid-cols-2">
        <Reveal className="order-2 flex flex-col justify-center bg-papel px-6 py-16 sm:px-12 lg:order-1 lg:px-16">
          <p className="text-xs font-semibold tracking-[0.22em] text-azul-vivo">CONSÓRCIO</p>
          <h2 className="mt-4 max-w-md text-4xl font-semibold tracking-tight text-grafite sm:text-5xl">Planeje sua próxima moto com tranquilidade.</h2>
          <ul className="mt-8 max-w-lg space-y-3">
            {OFERTAS_CONSORCIO.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm font-medium text-grafite">
                <span className="mt-0.5 text-azul-vivo"><IconCheck className="h-4 w-4" /></span>
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <BotaoWhats origem="consorcio-destaque" className="inline-flex bg-azul-vivo px-7 py-4 text-center text-sm font-semibold text-white transition hover:bg-azul">
              WhatsApp {SITE.whatsappExibicao}
            </BotaoWhats>
            <a href="#simulador" className="inline-flex border border-grafite px-7 py-4 text-center text-sm font-semibold text-grafite transition hover:border-azul-vivo hover:text-azul-vivo">
              Ver minha parcela
            </a>
          </div>
        </Reveal>
        <div className="relative order-1 min-h-[46vh] lg:order-2">
          <Image src="/motos/bros.jpg" alt="Honda Bros" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover object-[40%_center]" />
        </div>
      </article>
    </section>
  );
}
