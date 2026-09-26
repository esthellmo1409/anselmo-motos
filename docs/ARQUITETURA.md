# Arquitetura do funil

```mermaid
flowchart TD
  A[Anúncio: Instagram, Facebook, Google] --> B[Landing page]
  B --> C[Simulador: carro ou moto + carta + plano = parcela]
  C --> D[Formulário: carro ou moto, nome, WhatsApp, cidade, modelo]
  D -->|POST /api/leads| E[(Lead: NOVO)]
  D --> F[WhatsApp com mensagem pronta]
  F -->|webhook| G[AI Service]
  G --> H{Intenção de compra ou pediu humano?}
  H -- não --> I[Responde da tabela/FAQ e faz 1 pergunta]
  I --> G
  H -- sim --> J[handoffToHuman]
  J --> K[(Lead: AGUARDANDO_HUMANO, conversa em modo HUMANO)]
  J --> L[Resumo no WhatsApp do vendedor]
  L --> M[Vendedor: EM_NEGOCIACAO → CONVERTIDO / PERDIDO]
```

## Estados do lead

NOVO → IA_ATENDENDO → QUALIFICADO → AGUARDANDO_HUMANO → EM_NEGOCIACAO → CONVERTIDO | PERDIDO

## Dados coletados pela IA (sem repetir o que já sabe)

nome, cidade, WhatsApp (vem do próprio canal), carro ou moto, modelo, valor da carta, plano, faixa de parcela (só se não souber a carta), se já tem veículo, se quer trocar (só se já tem), se quer vendedor.
