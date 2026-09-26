const ITENS = [
  { titulo: 'Financiamento', texto: 'Condições para quem quer sair de moto agora.', href: '#financiamento' },
  { titulo: 'Consórcio', texto: 'Cartas, lance e contemplação com a equipe da loja.', href: '#consorcio' },
  { titulo: 'Ofertas', texto: 'O que está disponível para a sua próxima moto.', href: '#ofertas' },
  { titulo: 'Pós-venda', texto: 'Acompanhamento depois que a moto sai da loja.', href: '#contato' },
  { titulo: 'Peças e acessórios', texto: 'Fale com a equipe para o que a sua moto precisa.', href: '#contato' },
  { titulo: 'Contato', texto: 'WhatsApp direto com um consultor.', href: '#contato' },
];

export function Servicos() {
  return (
    <section id="servicos" className="scroll-mt-24 bg-papel px-5 py-20 md:px-10 md:py-28 lg:px-16">
      <div className="mx-auto max-w-[1100px]">
        <h2 className="text-4xl font-semibold tracking-tight text-grafite sm:text-5xl">Serviços</h2>
        <ul className="mt-12 border-t border-black/10">
          {ITENS.map((item) => (
            <li key={item.titulo}>
              <a href={item.href} className="group grid gap-2 border-b border-black/10 py-6 transition sm:grid-cols-[220px_1fr_auto] sm:items-center sm:gap-8">
                <span className="flex items-center gap-4 text-lg font-medium text-grafite">
                  <span className="h-px w-6 bg-azul-vivo transition group-hover:w-10" aria-hidden="true" />
                  {item.titulo}
                </span>
                <span className="text-grafite/60">{item.texto}</span>
                <span className="text-sm font-semibold text-azul-vivo">Ver</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
