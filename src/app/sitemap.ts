import type { MetadataRoute } from 'next';
import { SITE } from '@/config/site';
import { veiculosAtivos } from '@/data/veiculos';

export default function sitemap(): MetadataRoute.Sitemap {
  const motos = veiculosAtivos('MOTO').map((moto) => ({
    url: `${SITE.url}/motos/${moto.id}`,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));
  return [
    { url: `${SITE.url}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE.url}/simulador`, changeFrequency: 'weekly', priority: 0.9 },
    ...motos,
  ];
}
