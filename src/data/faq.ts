import { SITE } from '@/config/site';

/**
 * Perguntas frequentes. Edite as respostas livremente.
 * Evite prometer prazo de contemplação ou condição que não esteja no contrato.
 * Este mesmo conteúdo é usado pela IA para responder no WhatsApp.
 */
export interface ItemFaq {
  id: string;
  pergunta: string;
  resposta: string;
  /** Palavras que ajudam a IA (modo regras) a reconhecer a pergunta. */
  palavrasChave: string[];
}

export const FAQ: ItemFaq[] = [
  {
    id: 'como-funciona',
    pergunta: 'Como funciona o consórcio?',
    resposta:
      'Você escolhe o valor da carta de crédito e entra em um grupo de pessoas que pagam parcelas mensais. Periodicamente acontecem assembleias, e os participantes são contemplados por sorteio ou lance, conforme as regras do grupo. Quando você é contemplado, usa o crédito para adquirir o carro ou a moto. Consulte as condições vigentes do grupo.',
    palavrasChave: ['como funciona', 'funciona o consorcio', 'o que e consorcio', 'explica'],
  },
  {
    id: 'carta',
    pergunta: 'O que é carta de crédito?',
    resposta:
      'É o valor que você terá disponível para a compra quando for contemplado. Na simulação, você escolhe esse valor e vê a parcela correspondente na tabela.',
    palavrasChave: ['o que e carta', 'carta de credito e', 'que e uma carta'],
  },
  {
    id: 'planos',
    pergunta: 'Qual a diferença entre Plano 70% e Plano 100%?',
    resposta:
      'Para a mesma carta, o Plano 70% apresenta uma parcela menor que a do Plano 100%. As regras de cada plano (como e até quando vale a parcela reduzida) estão no contrato, e um especialista explica os detalhes. Consulte as condições vigentes do grupo.',
    palavrasChave: ['diferenca', 'qual plano', 'plano 70 e', 'plano 100 e'],
  },
  {
    id: 'carro-ou-moto',
    pergunta: 'Posso usar o consórcio para carro ou para moto?',
    resposta:
      'A Anselmo Motos atende quem procura carro e quem procura moto, incluindo motos Honda. Conte qual veículo você quer e o especialista confirma como usar sua carta. Consulte as condições vigentes do grupo.',
    palavrasChave: ['carro ou moto', 'serve para carro', 'posso comprar carro', 'posso escolher', 'moto honda'],
  },
  {
    id: 'simulacao',
    pergunta: 'Como faço uma simulação?',
    resposta:
      'No simulador do site, diga se procura carro ou moto, escolha o valor da carta e o plano. A parcela aparece na hora. Depois, informe seu nome e WhatsApp para continuar com um especialista.',
    palavrasChave: ['como simular', 'como faco uma simulacao', 'fazer simulacao'],
  },
  {
    id: 'ofertas',
    pergunta: 'Quais condições o consórcio oferece?',
    resposta:
      'Seu usado entra como lance. O lance pode ser parcelado em 4x no boleto ou em 18x nos cartões. Há consórcio com contemplação na 1ª parcela e consórcio já contemplado, no ponto de transferir. O crédito vai de 12 mil a 1 milhão. A carta contemplada e a contemplação na 1ª parcela dependem da disponibilidade. Confirme no WhatsApp ' +
      SITE.whatsappExibicao +
      '.',
    palavrasChave: ['lance', 'contempl', 'usado', 'boleto', 'cartao', 'cartão', '12 mil', '1 milhao', '1 milhão', 'transferir'],
  },
  {
    id: 'consultor',
    pergunta: 'Como falar com um consultor?',
    resposta:
      `Fale no WhatsApp ${SITE.whatsappExibicao}. Toque em qualquer botão de WhatsApp do site. O atendimento continua por lá.`,
    palavrasChave: ['como falar com'],
  },
  {
    id: 'depois',
    pergunta: 'O que acontece depois que eu enviar meus dados?',
    resposta:
      'Você é levado ao WhatsApp da Anselmo Motos com sua simulação já escrita na mensagem. A partir daí, nossa equipe continua o atendimento e tira suas dúvidas.',
    palavrasChave: ['depois que eu enviar', 'meus dados'],
  },
  {
    id: 'atendimento',
    pergunta: 'Como funciona o atendimento?',
    resposta:
      'O atendimento é feito pelo WhatsApp. Primeiro respondemos suas dúvidas sobre a simulação e, quando você quiser avançar, um especialista da loja assume a conversa.',
    palavrasChave: ['como funciona o atendimento', 'horario de atendimento'],
  },
];
