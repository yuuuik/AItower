import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SITE_URL } from '@/lib/constants';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Tower Rush играть онлайн — бесплатное демо с AI предсказателем',
    template: '%s | Tower Rush',
  },
  description:
    'Tower Rush играть онлайн бесплатно — краш-игра с AI Аналитиком. Предсказание этажа краша, стратегии, схема, промокод MARCHTOWER на 1win +500%.',
  keywords: [
    'tower rush играть',
    'tower rush стратегии',
    'tower rush схема',
    'tower rush взлом',
    'tower rush дюп',
    'tower rush 1win',
    'tower rush предсказатель',
    'краш игра стратегия',
    'промокод marchtower',
    '1win tower rush',
  ],
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: SITE_URL,
    siteName: 'Tower Rush',
    title: 'Tower Rush — Демо-игра с AI Аналитиком',
    description:
      'Бесплатная демо краш-игра Tower Rush с AI Аналитиком. Тренируйте стратегии и получите бонус до 500% с промокодом MARCHTOWER на 1win.',
    images: [
      {
        url: '/towerrush.png',
        width: 512,
        height: 512,
        alt: 'Tower Rush — Краш-игра с AI Аналитиком',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tower Rush играть онлайн — бесплатное демо с AI предсказателем',
    description:
      'Tower Rush играть онлайн бесплатно. AI предсказывает этаж краша. Промокод MARCHTOWER — бонус +500% на 1win.',
    images: ['/towerrush.png'],
  },
  icons: {
    icon: '/towerrush.png',
    apple: '/towerrush.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Tower Rush',
  url: SITE_URL,
  description:
    'Tower Rush — бесплатная демо краш-игра с AI Аналитиком. Стратегии, схема игры, промокод MARCHTOWER на 1win.',
  inLanguage: 'ru',
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/faq`,
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className="h-full">
      <body className={`${inter.className} text-white overflow-hidden select-none h-full`} style={{ background: '#141415' }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
