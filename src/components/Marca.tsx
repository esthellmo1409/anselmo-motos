import Image from 'next/image';

/** Logo oficial. O recorte tira a margem preta da foto da fachada. */
export function Marca({ className = 'h-12 w-40', sobreFoto = false }: { claro?: boolean; className?: string; sobreFoto?: boolean }) {
  return (
    <span className={`block overflow-hidden ${sobreFoto ? 'bg-transparent mix-blend-screen' : 'bg-black'} ${className}`}>
      <Image
        src="/logo-anselmo.jpg"
        alt="Anselmo Motos"
        width={640}
        height={280}
        priority
        className="h-full w-full object-contain object-center"
      />
    </span>
  );
}
