import { SITE } from '@/config/site';
import { FAQ } from '@/data/faq';
import { Header } from '@/components/Header';
import { HeroHome } from '@/components/home/HeroHome';
import { Catalogo } from '@/components/home/Catalogo';
import { Mosaico } from '@/components/home/Mosaico';
import { OfertaDestaque } from '@/components/home/OfertaDestaque';
import { Financeiro } from '@/components/home/Financeiro';
import { Sobre } from '@/components/home/Sobre';
import { Servicos } from '@/components/home/Servicos';
import { Simulador } from '@/components/Simulador';
import { Consorcio } from '@/components/Consorcio';
import { Faq } from '@/components/Faq';
import { CtaFinal } from '@/components/CtaFinal';
import { Footer } from '@/components/Footer';
import { LeadForm } from '@/components/LeadForm';
import { BarraFixa } from '@/components/BarraFixa';
import { SimuladorProvider } from '@/components/SimuladorProvider';

export default function Home() {
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
      <Header />
      <main>
        <HeroHome />
        <Catalogo />
        <Mosaico />
        <OfertaDestaque />
        <Financeiro />
        <Consorcio />
        <Simulador />
        <Sobre />
        <Servicos />
        <Faq />
        <CtaFinal />
      </main>
      <Footer />
      <LeadForm />
      <BarraFixa />
    </SimuladorProvider>
  );
}
