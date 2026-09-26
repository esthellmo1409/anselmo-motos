import { FAQ } from '@/data/faq';
import { BotaoWhats } from './BotaoWhats';

export function Faq() {
  return (
    <section id="duvidas" className="scroll-mt-16 px-4 py-16 sm:py-24" aria-labelledby="titulo-faq">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <h2 id="titulo-faq" className="titulo-secao text-3xl text-navy sm:text-5xl">Ainda tem dúvidas?</h2>
          <p className="mt-3 text-lg text-navy/70">Se a sua não estiver aqui, pergunte direto a um especialista.</p>
          <BotaoWhats origem="faq" className="mt-6 inline-block bg-azul-vivo px-6 py-4 text-sm font-semibold text-white transition hover:bg-azul">Quero saber mais</BotaoWhats>
        </div>
        <div className="divide-y divide-nevoa border-y border-nevoa">
          {FAQ.map((f) => (
            <details key={f.id} className="group py-1">
              <summary className="flex cursor-pointer items-center justify-between gap-4 py-4 text-lg font-bold text-navy">
                {f.pergunta}
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-nevoa text-navy transition group-open:rotate-45" aria-hidden="true">+</span>
              </summary>
              <p className="pb-5 pr-10 text-navy/75">{f.resposta}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
