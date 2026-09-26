import type { Metadata } from 'next';
import { Simulador } from '@/components/Simulador';
import { LeadForm } from '@/components/LeadForm';
import { SimuladorProvider } from '@/components/SimuladorProvider';
import { Marca } from '@/components/Marca';

/** Página curta para anúncios: /simulador (vai direto ao ponto). */
export const metadata: Metadata = {
  title: 'Simulador de consórcio de carro e moto',
  description: 'Escolha a carta de crédito, o plano e veja a parcela do seu consórcio de carro ou moto na hora.',
  alternates: { canonical: '/simulador' },
};

export default function PaginaSimulador() {
  return (
    <SimuladorProvider>
      <header className="bg-navy-deep px-4 py-4"><a href="/"><Marca /></a></header>
      <main><Simulador /></main>
      <LeadForm />
    </SimuladorProvider>
  );
}
