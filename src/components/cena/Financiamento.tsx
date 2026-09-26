import { SITE } from '@/config/site';
import { BotaoWhats } from '../BotaoWhats';

export function Financiamento() {
  return (
    <section id="financiamento" className="scroll-mt-20 grid min-h-[70vh] bg-[#f4f1eb] text-[#141414] lg:grid-cols-[1.1fr_.9fr]">
      <div className="flex flex-col justify-center px-6 py-20 sm:px-12 lg:px-16">
        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#1565C0]">Financiamento</p>
        <h2 className="mt-4 max-w-xl text-4xl font-semibold leading-[0.95] tracking-[-0.04em] sm:text-6xl">A condição certa para sair de moto.</h2>
        <p className="mt-6 max-w-md text-lg text-[#141414]/70">O consultor confirma prazo, entrada e parceiro. Nada disso fica inventado no site.</p>
        <BotaoWhats origem="financiamento" mensagem={SITE.mensagemFinanciamento} className="mt-10 inline-flex w-fit bg-[#1565C0] px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#0C447C]">
          Falar com um consultor
        </BotaoWhats>
      </div>
      <div className="flex items-end border-t border-black/10 px-6 py-12 sm:px-12 lg:border-l lg:border-t-0">
        <p className="max-w-sm text-sm uppercase tracking-[0.18em] text-[#141414]/45">Parceiros e bancos entram aqui quando a loja enviar as marcas.</p>
      </div>
    </section>
  );
}
