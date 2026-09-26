/* Testes rápidos da lógica central: tabela, mensagens e atendimento da IA (modo regras).
   Rode com: npm run test:core */
import assert from 'node:assert/strict';
import { TABELA } from '@/data/consorcioData';
import { getParcela, parseCredito, parsePlano } from '@/lib/simulation';
import { montarMensagemLead } from '@/lib/whatsapp';
import { telefoneValido, mascaraTelefone } from '@/lib/format';
import { qualifyLead, textoSimulacao, getLeadSummary, processarMensagemRecebida, saveLead } from '@/services/ai/aiService';
import { detectarHandoff } from '@/services/ai/qualification';
import { getRepository } from '@/services/leads/leadRepository';

(async () => {
  // Tabela intacta
  assert.equal(TABELA.length, 29);
  assert.equal(getParcela(100000, '100'), 1198.31);
  assert.equal(getParcela(210000, '70'), 1443.53);
  assert.equal(getParcela(300000, '100'), 3013.0);
  assert.equal(getParcela(290000, '100'), null); // não existe, não é inventada
  const soma100 = TABELA.reduce((s, l) => s + l.parcelas['100'], 0);
  const soma70 = TABELA.reduce((s, l) => s + l.parcelas['70'], 0);
  console.log('Soma de controle 100%:', soma100.toFixed(2), '| 70%:', soma70.toFixed(2));

  // Leitura de valores
  assert.equal(parseCredito('Quanto fica uma carta de 200 mil?'), 200000);
  assert.equal(parseCredito('carta de R$ 150.000'), 150000);
  assert.equal(parseCredito('uns 290 mil'), null);
  assert.equal(parsePlano('prefiro o plano 70'), '70');
  assert.equal(parsePlano('Plano: 100%'), '100');

  // Telefone
  assert.ok(telefoneValido('(99) 98888-7777'));
  assert.ok(!telefoneValido('(99) 8888-7777'));
  assert.equal(mascaraTelefone('99988887777'), '(99) 98888-7777');

  // Mensagem do site
  const msg = montarMensagemLead({ nome: 'João', tipoVeiculo: 'CARRO', veiculo: 'SUV', credito: 100000, plano: '100', parcela: 1198.31, cidade: 'Bacabal' });
  console.log('\n--- Mensagem WhatsApp ---\n' + msg);
  assert.ok(msg.includes('Carta de crédito: R$ 100.000'));
  assert.ok(msg.includes('Parcela apresentada: R$ 1.198,31'));
  assert.ok(msg.includes('Tenho interesse em: Carro'));

  // Resposta da IA para "quanto fica 200 mil"
  const r1 = await qualifyLead({ dados: {} }, 'Quanto fica uma carta de 200 mil?');
  console.log('\n--- IA: 200 mil ---\n' + r1.texto, r1.botoes?.map((b) => `[${b.titulo}]`).join(' '));
  assert.ok(r1.texto.includes('Plano 100%: R$ 2.147,95'));
  assert.ok(r1.texto.includes('Plano 70%: R$ 1.755,74'));

  // Transferência
  assert.equal(detectarHandoff('Quero fechar.'), 'Cliente quer fechar');
  assert.equal(detectarHandoff('quero falar com um vendedor'), 'Pediu atendimento humano');
  assert.equal(detectarHandoff('oi tudo bem'), null);

  // Fluxo completo simulado: lead do site → WhatsApp → qualificação → humano
  const numero = '5599988887777';
  await saveLead({ nome: 'João', whatsapp: numero, cidade: 'Bacabal', tipoVeiculo: 'CARRO', veiculo: 'SUV', credito: 100000, plano: '100' });
  const conversa = [
    msg,
    'sim, já tenho um carro',
    'quero trocar',
    'Quero fechar.',
    'alô?',
  ];
  console.log('\n--- Conversa simulada ---');
  for (const texto of conversa) {
    console.log(`\nCLIENTE: ${texto.split('\n')[0]}${texto.includes('\n') ? ' (...)' : ''}`);
    const out = await processarMensagemRecebida({ de: numero, texto });
    console.log('IA:', out.respondeu ? out.texto : '(silêncio: conversa com humano)');
  }
  const lead = await getRepository().buscarLeadPorWhatsapp(numero);
  assert.equal(lead?.status, 'AGUARDANDO_HUMANO');
  console.log('\n--- Resumo para o vendedor ---\n' + getLeadSummary(lead!));
  // Cliente que chega direto no WhatsApp
  const n2 = '5599977776666';
  for (const texto of ['oi, quero consórcio de moto', 'Maria', 'Bacabal', 'uma bros 160', 'quanto fica 150 mil?']) {
    const out = await processarMensagemRecebida({ de: n2, texto });
    console.log(`\nCLIENTE: ${texto}\nIA: ${out.respondeu ? out.texto : ''}`);
  }
  const l2 = await getRepository().buscarLeadPorWhatsapp(n2);
  assert.equal(l2?.tipoVeiculo, 'MOTO');
  assert.equal(l2?.veiculo, 'Honda NXR 160 Bros');
  console.log('\n' + textoSimulacao(290000));
  console.log('\nOK: todos os testes passaram.');
})();
