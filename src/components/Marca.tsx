import Image from 'next/image';

/** Logo oficial. O recorte tira a margem preta da foto da fachada. */
export function Marca({ className = 'h-12 w-40' }: { claro?: boolean; className?: string }) {
  return (
    <span className={`block overflow-hidden bg-black ${className}`}>
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
