import { NAV } from '@/config/nav';
import { SITE } from '@/config/site';
import { Marca } from './Marca';
import { BotaoWhats } from './BotaoWhats';

export function Footer() {
  const enderecoReal = !SITE.endereco.rua.includes('[') && !SITE.endereco.rua.startsWith('Rua /');

  return (
    <footer id="contato" className="scroll-mt-24 bg-[#0d0d0d] px-5 py-16 text-white/70 md:px-10 lg:px-16">
      <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[1.2fr_.8fr_1fr]">
        <div>
          <Marca className="h-16 w-52" />
          <p className="mt-6 max-w-xs text-sm leading-relaxed">Concessionária de motos em {SITE.cidade}-{SITE.uf}. Consórcio Canopus, financiamento e atendimento direto.</p>
        </div>
        <nav aria-label="Rodapé">
          <p className="text-xs font-semibold tracking-[0.18em] text-white">NAVEGUE</p>
          <ul className="mt-4 space-y-2 text-sm">
            {NAV.map((item) => (
              <li key={item.href}><a href={item.href} className="transition hover:text-white">{item.label}</a></li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-white">CONTATO</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><BotaoWhats origem="rodape" className="transition hover:text-white">WhatsApp {SITE.whatsappExibicao}</BotaoWhats></li>
            <li><a href={`tel:+${SITE.whatsapp}`} className="transition hover:text-white">Telefone {SITE.whatsappExibicao}</a></li>
            <li><a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="transition hover:text-white">Instagram {SITE.instagramUsuario}</a></li>
            <li>{SITE.cidade}-{SITE.uf}</li>
            {enderecoReal && (
              <li>
                {SITE.endereco.mapsUrl ? (
                  <a href={SITE.endereco.mapsUrl} target="_blank" rel="noopener noreferrer" className="transition hover:text-white">
                    {SITE.endereco.rua}, {SITE.endereco.bairro}
                  </a>
                ) : (
                  <>{SITE.endereco.rua}, {SITE.endereco.bairro}</>
                )}
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-14 max-w-[1440px] border-t border-white/10 pt-6 text-xs leading-relaxed text-white/40">
        <p>Simulações com valores de referência informados pela Anselmo Motos. Crédito de 12 mil a 1 milhão. Lance, carta contemplada e transferência dependem da disponibilidade. Confirme pelo WhatsApp {SITE.whatsappExibicao}.</p>
        <p className="mt-2">Honda e Canopus são marcas de seus respectivos titulares. Imagens ilustrativas até a chegada das fotos da loja.</p>
        <p className="mt-2">© {new Date().getFullYear()} {SITE.nome}</p>
      </div>
    </footer>
  );
}
