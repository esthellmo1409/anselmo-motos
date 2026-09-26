import Image from 'next/image';
import { SITE } from '@/config/site';
import { Reveal } from './Reveal';

export function Sobre() {
  const foto = SITE.fotoLoja || '/motos/cg.jpg';
  const alt = SITE.fotoLoja ? `Loja ${SITE.nome}` : 'Motocicleta em destaque na Anselmo Motos';

  return (
    <section id="sobre" className="scroll-mt-24 bg-white">
      <div className="grid min-h-[70vh] lg:grid-cols-2">
        <Reveal className="flex flex-col justify-center px-6 py-20 sm:px-12 lg:px-20">
          <p className="text-xs font-semibold tracking-[0.22em] text-azul-vivo">{SITE.cidade.toUpperCase()} · {SITE.uf}</p>
          <h2 className="mt-4 max-w-xl text-4xl font-semibold leading-[1.05] tracking-tight text-grafite sm:text-5xl">
            Mais do que uma loja. Uma experiência sobre duas rodas.
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-grafite/70">
            Confiança no atendimento, variedade para escolher e um caminho claro para sair de moto: financiamento, consórcio e o cuidado depois da compra.
          </p>
        </Reveal>
        <div className="relative min-h-[48vh]">
          <Image src={foto} alt={alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover object-[50%_55%]" />
        </div>
      </div>
    </section>
  );
}
