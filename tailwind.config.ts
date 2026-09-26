import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#0A1E4A', deep: '#050F2B', line: '#1B3470' },
        eletrico: { DEFAULT: '#1F6BFF', claro: '#5C95FF' },
        ouro: { DEFAULT: '#FFC21A', escuro: '#E0A500' },
        tinta: '#000000',
        nevoa: '#EEF3FF',
        papel: '#F4F4F4',
        grafite: '#161616',
        azul: { DEFAULT: '#0C447C', vivo: '#1565C0' },
      },
      fontFamily: { sans: ['var(--font-archivo)', 'system-ui', 'sans-serif'] },
      boxShadow: {
        carta: '0 30px 60px -20px rgba(5,15,43,.55), 0 0 0 1px rgba(255,255,255,.08) inset',
        botao: '0 10px 24px -8px rgba(255,194,26,.55)',
      },
      keyframes: {
        entrada: { from: { opacity: '0', transform: 'translateY(18px)' }, to: { opacity: '1', transform: 'none' } },
        pulso: { '0%,100%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.06)' } },
      },
      animation: {
        entrada: 'entrada .7s cubic-bezier(.2,.7,.2,1) both',
        pulso: 'pulso 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
export default config;
