/** Ilustração original (não é foto oficial). Troque por foto Honda autorizada em Hero.tsx se preferir. */
export function MotoIlustracao({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 640 380" className={className} role="img" aria-label="Ilustração de motocicleta">
      <defs>
        <linearGradient id="tanque" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#5C95FF" />
          <stop offset="1" stopColor="#1F6BFF" />
        </linearGradient>
        <radialGradient id="brilho" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#1F6BFF" stopOpacity=".55" />
          <stop offset="1" stopColor="#1F6BFF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="320" cy="345" rx="290" ry="22" fill="url(#brilho)" />
      {[150, 490].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="270" r="82" fill="none" stroke="#000" strokeWidth="22" />
          <circle cx={cx} cy="270" r="82" fill="none" stroke="#1B3470" strokeWidth="3" />
          <circle cx={cx} cy="270" r="52" fill="none" stroke="#5C95FF" strokeWidth="3" strokeDasharray="6 10" />
          <circle cx={cx} cy="270" r="16" fill="#FFC21A" />
        </g>
      ))}
      <path d="M150 270 L300 238 L312 252 L160 282Z" fill="#1B3470" />
      <path d="M260 196 h96 a14 14 0 0 1 14 14 v44 a14 14 0 0 1-14 14 h-80 a16 16 0 0 1-16-16Z" fill="#0A1E4A" stroke="#5C95FF" strokeWidth="2" />
      <path d="M180 150 Q236 128 300 142 L298 162 Q236 158 184 172Z" fill="#000" />
      <path d="M112 146 L186 148 L180 170 L126 166Z" fill="#1F6BFF" />
      <path d="M286 146 Q344 96 424 116 L440 162 Q362 176 292 184Z" fill="url(#tanque)" />
      <path d="M300 160 Q350 132 410 138" stroke="#FFC21A" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M430 126 L490 270" stroke="#9BA9C6" strokeWidth="12" strokeLinecap="round" />
      <path d="M422 100 L476 90 Q496 116 470 150 L438 150Z" fill="#0A1E4A" stroke="#5C95FF" strokeWidth="2" />
      <path d="M470 104 L486 110 L478 132 L466 126Z" fill="#FFC21A" />
      <path d="M400 104 L446 92" stroke="#000" strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
}
