/**
 * ============================================================
 *  DADOS DA LOJA — edite aqui.
 *  Tudo que aparece no site (WhatsApp, endereço, horário, redes)
 *  sai deste arquivo. Campos marcados com [PREENCHER] são
 *  placeholders e devem ser trocados pelos dados reais.
 * ============================================================
 */
export const SITE = {
  nome: 'Anselmo Motos',
  cidade: 'Bacabal',
  uf: 'MA',

  /** WhatsApp comercial: DDI + DDD + número, só dígitos. */
  whatsapp: '5599982609990',
  /** Como o número aparece escrito no site. */
  whatsappExibicao: '(99) 98260-9990',

  instagram: 'https://instagram.com/anselmomotos', // [PREENCHER] confirmar perfil
  instagramUsuario: '@anselmomotos', // [PREENCHER]

  endereco: {
    rua: 'Rua / Avenida, número', // [PREENCHER]
    bairro: 'Bairro', // [PREENCHER]
    cep: '65700-000', // [PREENCHER]
    mapsUrl: '', // [PREENCHER] link do Google Maps (opcional)
  },

  horario: [
    { dias: 'Segunda a sexta', horas: '00h às 00h' }, // [PREENCHER]
    { dias: 'Sábado', horas: '00h às 00h' }, // [PREENCHER]
  ],

  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.anselmomotos.com.br',

  /**
   * Foto da loja ou da equipe. Deixe vazio até ter o arquivo real.
   * Exemplo: '/motos/loja.jpg'
   */
  fotoLoja: '',

  /** Texto usado quando o cliente clica em "Falar com especialista" sem simular. */
  mensagemEspecialista:
    'Olá! Vim pelo site da Anselmo Motos e quero falar com um especialista sobre consórcio de carro ou moto.',
  mensagemFinanciamento:
    'Olá! Vim pelo site da Anselmo Motos e quero simular o financiamento de uma moto.',
} as const;
