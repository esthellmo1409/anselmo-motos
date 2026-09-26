import { SITE } from '@/config/site';
import { FAQ } from '@/data/faq';
import { Header } from '@/components/Header';
import { HeroCena } from '@/components/cena/HeroCena';
import { CatalogoFaixa } from '@/components/cena/CatalogoFaixa';
import { Financiamento } from '@/components/cena/Financiamento';
import { Seminovas } from '@/components/cena/Seminovas';
import { InteresseInicial } from '@/components/cena/InteresseInicial';
import { Simulador } from '@/components/Simulador';
import { Consorcio } from '@/components/Consorcio';
import { Faq } from '@/components/Faq';
import { CtaFinal } from '@/components/CtaFinal';
import { Footer } from '@/components/Footer';
import { LeadForm } from '@/components/LeadForm';
import { BarraFixa } from '@/components/BarraFixa';
import { SimuladorProvider } from '@/components/SimuladorProvider';

export default async function Home({ searchParams }: { searchParams: Promise<{ interesse?: string }> }) {
  const { interesse } = await searchParams;
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'AutoDealer',
      name: SITE.nome,
      url: SITE.url,
      telephone: `+${SITE.whatsapp}`,
      sameAs: [SITE.instagram],
      address: {
        '@type': 'PostalAddress',
        streetAddress: SITE.endereco.rua,
        addressLocality: SITE.cidade,
        addressRegion: SITE.uf,
        postalCode: SITE.endereco.cep,
        addressCountry: 'BR',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.pergunta, acceptedAnswer: { '@type': 'Answer', text: f.resposta } })),
    },
  ];

  return (
    <SimuladorProvider>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <InteresseInicial id={interesse} />
      <Header />
      <main>
        <HeroCena />
        <CatalogoFaixa />
        <Consorcio />
        <Simulador />
        <Financiamento />
        <Seminovas />
        <section id="sobre" className="scroll-mt-20 bg-white px-6 py-24 text-[#141414] sm:px-12 lg:px-16">
          <p className="text-[11px] uppercase tracking-[0.32em] text-[#1565C0]">{SITE.cidade} · {SITE.uf}</p>
          <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-[0.95] tracking-[-0.04em] sm:text-6xl">Mais do que uma loja. Uma experiência sobre duas rodas.</h2>
          <p className="mt-6 max-w-xl text-lg text-[#141414]/70">Atendimento direto, motos para escolher, financiamento, consórcio Canopus e o cuidado depois da compra.</p>
        </section>
        <Faq />
        <CtaFinal />
      </main>
      <Footer />
      <LeadForm />
      <BarraFixa />
    </SimuladorProvider>
  );
}
