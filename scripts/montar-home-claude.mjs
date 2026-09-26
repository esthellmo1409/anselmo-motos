import fs from 'fs';

const origem = 'C:/Users/novoa/OneDrive/Área de Trabalho/anselmo-motos-site MOVO/index.html';
const destino = 'C:/Users/novoa/OneDrive/Área de Trabalho/anselmo-motos/public/nova/index.html';

let html = fs.readFileSync(origem, 'utf8');
html = html.replaceAll('images/', '/images/');
html = html.replaceAll('src="anselmo-intro.js"', 'src="/anselmo-intro.js"');
html = html.replace('[21e4,2255.35,1843.53]', '[21e4,2255.35,1443.53]');

const rastreio = `<script>
document.addEventListener('click', function (e) {
  var a = e.target.closest('a[href*="wa.me"]');
  if (!a) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: 'whatsapp_clique', origem: 'home' });
  if (window.fbq) window.fbq('track', 'Contact', { origem: 'home' });
});
</script>`;

html = html.replace('</body>', rastreio + '</body>');
fs.mkdirSync('public/nova', { recursive: true });
fs.writeFileSync(destino, html);
console.log('ok', html.includes('5599982609990'), html.includes('1443.53'), html.includes('1843.53') === false);
