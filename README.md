# Anselmo Motos — consórcio de carros e motos com simulador, captação de leads e base para IA no WhatsApp

Funil: **anúncio → site → simulação → WhatsApp → IA → qualificação → vendedor → venda**.

## Rodar

Vai finalizar no Cursor? Leia primeiro o `CURSOR.md`.

```bash
npm install
cp .env.example .env.local   # preencha os valores
npm run dev                  # http://localhost:3000
npm run test:core            # testa tabela, mensagem do WhatsApp e fluxo da IA
```

Deploy recomendado: Vercel (conecte o repositório e cole as variáveis do `.env.local`).

## Estrutura de pastas

```
src/
  app/
    page.tsx                  Landing page (hero, simulador, carros e motos, consórcio, FAQ, rodapé)
    simulador/page.tsx        Página enxuta só com o simulador (ótima para anúncios)
    admin/page.tsx            Painel de leads (protegido por senha)
    api/leads                 POST: salva o lead do formulário e devolve o link do WhatsApp
    api/simulate              GET: parcelas de uma carta ou a tabela completa
    api/whatsapp/webhook      Recebe mensagens do WhatsApp e aciona a IA
    api/admin/leads           GET: lista e contadores do painel | PATCH [id]: muda status
    layout.tsx                SEO: title, description, Open Graph, fontes
    sitemap.ts, robots.ts     SEO técnico
  components/                 Peças visuais reutilizáveis
  config/site.ts              >>> DADOS DA LOJA (WhatsApp, endereço, horário, Instagram)
  data/consorcioData.ts       >>> TABELA DO CONSÓRCIO
  data/veiculos.ts            >>> CARROS E MOTOS DOS CARDS
  data/faq.ts                 >>> PERGUNTAS E RESPOSTAS (usadas no site e pela IA)
  lib/                        Formatação, simulação, montagem da mensagem, analytics
  services/
    ai/aiService.ts           AI SERVICE (simulação, qualificação, transferência, resumo)
    ai/qualification.ts       Perguntas, leitura das respostas e REGRAS DE TRANSFERÊNCIA
    ai/prompts.ts             Prompt do agente (montado a partir da tabela e do FAQ)
    ai/llmClient.ts           Chamada ao modelo de IA (só no servidor)
    leads/leadRepository.ts   Persistência (memória hoje, banco depois)
    whatsapp/whatsappProvider.ts  Envio/recebimento (Meta Cloud API ou simulado)
  middleware.ts               Senha do painel /admin
prisma/schema.prisma          Modelo do banco: clientes, leads, simulações, conversas, atendentes, histórico
scripts/test-core.ts          Testes da lógica
```

## Alterar os valores do consórcio

Abra `src/data/consorcioData.ts`. Cada linha é uma carta:

```ts
{ credito: 100000, parcelas: { '100': 1198.31, '70': 915.12 } },
```

Troque o número (ponto como separador decimal). Para nova carta, adicione uma linha; para remover, apague. Simulador, tabela, formulário, IA e mensagem do WhatsApp se atualizam sozinhos. O texto dos planos e o aviso legal ficam no mesmo arquivo (`PLANOS` e `TABELA_INFO`).

Para o administrador editar sem mexer em código, o schema já tem o modelo `TabelaConsorcio`: basta trocar a leitura de `TABELA` por uma consulta ao banco e criar uma tela no `/admin`.

## Alterar o WhatsApp

`src/config/site.ts` → `whatsapp: '5599000000000'` (DDI 55 + DDD + número, só dígitos) e `whatsappExibicao`. Todos os botões usam essa variável.

## Alterar os dados da loja

Mesmo arquivo `src/config/site.ts`: Instagram, endereço, link do Maps, horário e o texto padrão de "falar com especialista". Tudo marcado com `[PREENCHER]` é placeholder.

## Cadastrar carros e motos

`src/data/veiculos.ts`: copie um bloco, defina `tipo: 'CARRO'` ou `tipo: 'MOTO'` (é isso que decide a aba), e mude `id`, `nome`, `categoria`, `descricao` e `foto`. Coloque a foto em `public/veiculos/` (ex.: `/veiculos/cg-160.webp`). `preco` é opcional; `ativo: false` esconde sem apagar. Os carros vieram cadastrados por categoria (Hatch, Sedã, SUV, Picape) porque os modelos ainda não foram informados: troque pelos nomes reais. O botão "Quero esse carro / Quero essa moto" leva o modelo e o tipo ao simulador e à mensagem.

## Conectar o WhatsApp (Meta Cloud API)

1. Crie um app em developers.facebook.com, adicione o produto WhatsApp e cadastre o número da loja.
2. Preencha `WHATSAPP_TOKEN` (token permanente) e `WHATSAPP_PHONE_NUMBER_ID`.
3. Em Webhooks, use a URL `https://SEU-DOMINIO/api/whatsapp/webhook` e o token de `WHATSAPP_VERIFY_TOKEN`. Assine o campo `messages`.
4. Em `SELLER_WHATSAPP_NUMBERS`, coloque os números dos vendedores que recebem o resumo.

Sem token, o sistema funciona em modo simulado (mensagens aparecem no log). Para usar Z-API, Evolution API ou Twilio, crie outra classe que implemente `WhatsAppProvider`.

Observação: enquanto a IA não estiver ligada, o botão do site só abre o WhatsApp da loja com a mensagem pronta, e o atendimento é 100% humano.

## Conectar a IA

Preencha `AI_API_KEY` (e `AI_MODEL`) no servidor. A chave nunca vai para o navegador. Para outro provedor, altere somente `services/ai/llmClient.ts`.

Como é dividido:
- **Números sempre vêm do código**, nunca do modelo. Perguntas como "quanto fica 200 mil" são respondidas direto da tabela.
- Dúvidas do FAQ também são respondidas por regras.
- O modelo só entra na conversa livre, com a tabela, o FAQ e as regras no prompt (`prompts.ts`).
- Sem chave, tudo continua funcionando no modo regras.

Funções do AI Service: `getConsorcioSimulation()`, `qualifyLead()`, `generateWhatsAppMessage()`, `handoffToHuman()`, `saveLead()`, `getLeadSummary()`.

## Transferência da IA para o vendedor

Regras em `services/ai/qualification.ts` → `GATILHOS_HUMANO`. A IA transfere quando o cliente:
- quer fechar, contratar ou comprar;
- pede vendedor, atendente, pessoa ou especialista (inclusive pelo botão);
- fala em lance, desconto, entrada ou negociação;
- reclama;
- aceita a oferta "quer que eu chame um especialista?".

Ao transferir: a IA manda a mensagem de encaminhamento, a conversa muda para `modo: HUMANO` (a IA fica em silêncio dali em diante), o lead vai para `AGUARDANDO_HUMANO` com interesse `ALTO`, e cada vendedor recebe no WhatsApp o resumo (`getLeadSummary`) com link para responder. Quando o vendedor muda o status no painel para "Em negociação", a IA também para.

## Antes de ir ao ar

- Trocar todos os `[PREENCHER]`.
- Colocar fotos reais em `public/veiculos/` e, se quiser, a foto do hero.
- Trocar `public/og.png` por uma arte com a logo real.
- Definir `ADMIN_PASSWORD` forte.
- Para produção com volume, ligar o banco (Prisma) no lugar do repositório em memória, que é apagado a cada reinício do servidor.
