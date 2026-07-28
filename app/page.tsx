import type { Metadata } from 'next';
import HomeClient from '@/components/HomeClient';
import { SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Tower Rush 1win Demo — играть онлайн с AI предсказателем',
  description:
    'Tower Rush 1win demo — играть онлайн бесплатно, краш-игра с AI Аналитиком, который точно предсказывает этаж краша. Тренируйте стратегии в демо и переходите на реальные деньги с промокодом ADUNLOCK на 1win.',
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    url: SITE_URL,
    title: 'Tower Rush 1win Demo — играть онлайн с AI предсказателем',
    description:
      'Tower Rush 1win demo — AI предсказывает краш. Промокод ADUNLOCK — бонус +500% на 1win.',
  },
};

export default function Home() {
  return (
    <>
      <HomeClient />
      {/* SEO text block — server-rendered, visible to crawlers */}
      <section aria-label="О Tower Rush" className="sr-only">
        <h2>Tower Rush — краш-игра с AI Аналитиком на 1win</h2>
        <p>
          Tower Rush играть онлайн бесплатно в демо-режиме. Краш-игра с AI Аналитиком, который
          предсказывает точный этаж краша перед каждым раундом. Используйте стратегии и схемы
          для максимального выигрыша.
        </p>
        <h3>Стратегии и схема Tower Rush</h3>
        <p>
          Консервативная стратегия — выход на 1–2 этаже (×1.2–×1.5). Умеренная — на 3–4 этаже
          (×2.0–×2.5). Агрессивная — 5+ этаж (×3.0–×15.0). AI сигналы: зелёный, жёлтый, красный.
        </p>
        <h3>Промокод ADUNLOCK для 1win</h3>
        <p>
          Введите промокод ADUNLOCK при регистрации на 1win и получите бонус до 500% на первый
          депозит. Рабочий промокод 1win 2026.
        </p>
        <h3>Tower Rush скачать на Android и iPhone</h3>
        <p>
          Скачать Tower Rush на телефон бесплатно — установите приложение через Chrome (Android)
          или Safari (iOS) без App Store и Google Play.
        </p>
      </section>
    </>
  );
}
