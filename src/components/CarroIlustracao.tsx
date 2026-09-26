/** Ilustração original de carro (não é foto oficial). */
export function CarroIlustracao({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 660 330" className={className} role="img" aria-label="Ilustração de carro">
      <defs>
        <linearGradient id="lataria" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#C9D6F5" />
        </linearGradient>
        <radialGradient id="brilhoCarro" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#1F6BFF" stopOpacity=".5" />
          <stop offset="1" stopColor="#1F6BFF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="330" cy="300" rx="310" ry="20" fill="url(#brilhoCarro)" />
      <path d="M30 240 L48 196 Q58 178 92 174 L196 166 L268 112 Q284 100 312 100 L454 100 Q486 100 506 120 L556 168 Q612 176 626 204 L632 240 Q632 256 616 256 L46 256 Q30 256 30 240Z" fill="url(#lataria)" />
      <path d="M284 118 L378 118 L378 170 L222 172Z" fill="#0A1E4A" />
      <path d="M392 118 L452 118 Q472 118 488 134 L522 168 L392 170Z" fill="#0A1E4A" />
      <path d="M44 214 L630 206" stroke="#1F6BFF" strokeWidth="8" />
      <path d="M596 190 L626 196 L628 212 L600 210Z" fill="#FFC21A" />
      <path d="M34 200 L52 198 L48 214 L34 216Z" fill="#1F6BFF" />
      {[160, 506].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="256" r="58" fill="#050F2B" />
          <circle cx={cx} cy="256" r="46" fill="#000" stroke="#1B3470" strokeWidth="3" />
          <circle cx={cx} cy="256" r="28" fill="none" stroke="#5C95FF" strokeWidth="3" strokeDasharray="6 8" />
          <circle cx={cx} cy="256" r="10" fill="#FFC21A" />
        </g>
      ))}
    </svg>
  );
}
