import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Tower Rush',
    short_name: 'Tower Rush',
    description: 'Демо краш-игра с AI Аналитиком. Стратегии, схема, промокод MARCHTOWER на 1win.',
    start_url: '/',
    display: 'standalone',
    background_color: '#141415',
    theme_color: '#141415',
    orientation: 'portrait',
    icons: [
      {
        src: '/towerrush.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['games', 'entertainment'],
  };
}
