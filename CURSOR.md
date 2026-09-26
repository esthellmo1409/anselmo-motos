# Como finalizar no Cursor

## 1. Abrir e rodar

1. Descompacte o .zip e abra a pasta `anselmo-motos` no Cursor (File > Open Folder).
2. Abra o terminal do Cursor (Ctrl + `) e rode:

```bash
npm install
cp .env.example .env.local
npm run dev
```

3. Acesse http://localhost:3000. O painel fica em http://localhost:3000/admin (usuário e senha do `.env.local`).
4. Para conferir a lógica da tabela e da IA: `npm run test:core`.

Precisa de Node 20 ou mais novo. A pasta `.cursor/rules` já ensina ao Cursor as regras do projeto (não inventar valores, onde fica cada arquivo etc.), então você pode pedir as coisas em linguagem normal.

A pasta `docs/previa/index.html` tem a versão de demonstração que funciona só abrindo no navegador.

## 2. Dados que faltam (procure por `[PREENCHER]` e `[EDITAR]`)

- [ ] WhatsApp real da loja: `src/config/site.ts`
- [ ] Endereço, CEP, link do Maps, horário e Instagram: `src/config/site.ts`
- [ ] Modelos reais de carro (hoje estão por categoria): `src/data/veiculos.ts`
- [ ] Fotos dos carros e motos em `public/veiculos/`
- [ ] Texto oficial do Plano 70% e do Plano 100%: `src/data/consorcioData.ts`
- [ ] Conferir com a Canopus as cartas de R$ 140 mil e R$ 300 mil (Plano 100%) e R$ 210 mil (Plano 70%)
- [ ] Logo real no lugar da marca provisória: `src/components/Marca.tsx` e `src/app/icon.svg`
- [ ] Imagem de compartilhamento: `public/og.png` (1200 x 630)

## 3. Prompts prontos para colar no chat do Cursor (modo Agent)

Faça na ordem. Depois de cada um, confira no navegador.

**Primeiro: garantir que compila**
> Rode `npm run build` e corrija todos os erros de TypeScript e de build, sem mudar comportamento, textos nem valores da tabela. Depois rode `npm run test:core`.

**Dados da loja**
> Atualize `src/config/site.ts` com: WhatsApp [NÚMERO], endereço [ENDEREÇO], bairro [BAIRRO], CEP [CEP], horário [HORÁRIOS], Instagram [PERFIL], link do Maps [LINK].

**Modelos de carro**
> Em `src/data/veiculos.ts`, substitua os carros por categoria por estes modelos: [LISTA]. Mantenha `tipo: 'CARRO'`, escreva descrições curtas sem inventar especificações nem preços.

**Fotos**
> Coloquei as fotos em `public/veiculos/`. Ligue cada veículo em `src/data/veiculos.ts` à foto com o mesmo nome do id.

**Tabela separada para motos (se a Canopus tiver)**
> Crie uma segunda tabela em `src/data/consorcioData.ts` só para motos, com estes valores exatos: [VALORES]. Faça o simulador, o formulário, a API e a IA usarem a tabela de moto quando o tipo for MOTO e a de carro quando for CARRO. Não corrija nem interpole valores. Atualize `scripts/test-core.ts`.

**Banco de dados**
> Ative o Prisma com PostgreSQL usando `prisma/schema.prisma`. Crie `PrismaRepository` implementando a interface `Repository` de `src/services/leads/leadRepository.ts` e troque em `getRepository()` quando `DATABASE_URL` existir. Adicione `DATABASE_URL` ao `.env.example`.

**Tabela editável pelo painel**
> Crie no `/admin` uma tela para editar a tabela do consórcio usando o modelo `TabelaConsorcio` do Prisma. O simulador deve ler do banco com fallback para `consorcioData.ts`.

**Login do painel**
> Troque a senha básica do `src/middleware.ts` por login com NextAuth (e-mail e senha) e crie o cadastro de atendentes usando o modelo `Atendente`.

**WhatsApp**
> Vou conectar a WhatsApp Cloud API. Revise `src/services/whatsapp/whatsappProvider.ts` e o webhook, valide a assinatura `X-Hub-Signature-256` com `WHATSAPP_APP_SECRET` e me passe o passo a passo para configurar na Meta.

**IA**
> Configurei `AI_API_KEY`. Teste o fluxo em `src/services/ai/aiService.ts` com 5 conversas de exemplo (carro e moto) e confirme que nenhum valor sai do modelo, só da tabela.

**Rastreamento dos anúncios**
> Adicione Google Tag Manager e Meta Pixel via `next/script`, com IDs em variáveis de ambiente, e confirme que os eventos de `src/lib/analytics.ts` disparam.

**Publicar**
> Me guie para publicar na Vercel com o domínio [DOMÍNIO], configurando todas as variáveis do `.env.example`.

## 4. Antes de ir ao ar

- `npm run build` sem erros
- Simulação testada no celular até abrir o WhatsApp certo
- Todos os `[PREENCHER]` trocados
- `ADMIN_PASSWORD` forte
- Banco ligado (o repositório em memória apaga os leads a cada reinício)
