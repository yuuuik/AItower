import type { Metadata } from 'next';
import { CheckCircle2, HelpCircle } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { REAL_MONEY_URL, SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Играть в Tower Rush 1win — правила игры и демо-режим',
  description:
    'Играть в Tower Rush 1win: правила краш-игры, демо-режим без регистрации, что означает этаж и множитель, промокод ADUNLOCK на бонус 500%.',
  keywords: [
    'играть в tower rush 1win',
    'tower rush 1win demo',
    'tower rush правила игры',
    'tower rush демо без регистрации',
    'tower rush этажи множитель',
  ],
  alternates: {
    canonical: `${SITE_URL}/guide`,
  },
  openGraph: {
    title: 'Играть в Tower Rush 1win — правила игры и демо-режим',
    description: 'Правила краш-игры Tower Rush, демо-режим без регистрации и промокод на бонус 500%.',
    url: `${SITE_URL}/guide`,
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tower Rush 1win — правила игры и демо',
    description: 'Как играть в Tower Rush: правила, демо-режим бесплатно, промокод на бонус.',
  },
};

const faq = [
  {
    q: 'Как играть в Tower Rush на 1win?',
    a: 'Перейдите на 1win по кнопке регистрации, пополните счёт удобным способом (карта, СБП, криптовалюта) и выберите Tower Rush в разделе краш-игр. Введите промокод ADUNLOCK при регистрации, чтобы получить бонус до 500% на первый депозит.',
  },
  {
    q: 'Что означает этаж и множитель в Tower Rush?',
    a: 'Башня растёт этаж за этажом, и с каждым этажом увеличивается множитель ставки. Игрок решает, на каком этаже зафиксировать выигрыш («вывести»), пока башня не «упала» — если башня падает раньше вывода, ставка сгорает.',
  },
  {
    q: 'Можно ли играть в Tower Rush 1win demo бесплатно?',
    a: 'Да, демо-режим на этом сайте доступен сразу — без регистрации и без реальных денег, с виртуальным балансом. Это позволяет изучить механику и AI-сигналы перед игрой на реальные ставки.',
  },
  {
    q: 'Как работает AI Аналитик в Tower Rush?',
    a: 'AI Аналитик подсвечивает цветовым сигналом (зелёный/жёлтый/красный) вероятность продолжения роста башни на текущем этаже, помогая принимать более информированное решение о моменте вывода.',
  },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Главная', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Гайд', item: `${SITE_URL}/guide` },
  ],
};

export default function GuidePage() {
  return (
    <PageLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <div className="min-h-full" style={{ background: '#141415' }}>
        <article className="max-w-2xl mx-auto px-6 py-10 text-white">

          <header className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-bold uppercase tracking-widest mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              Полное руководство
            </div>
            <h1 className="text-3xl font-black leading-tight mb-3">
              Играть в Tower Rush 1win:<br />
              <span className="bg-gradient-to-r from-purple-300 to-blue-400 bg-clip-text text-transparent">
                правила и демо-режим
              </span>
            </h1>
            <p className="text-white/50 text-sm leading-relaxed max-w-lg">
              Tower Rush — краш-игра, где башня растёт этаж за этажом. Разбираем правила, демо-режим
              без регистрации и промокод на бонус при регистрации на 1win.
            </p>
          </header>

          <section className="mb-10 rounded-2xl border border-white/8 bg-white/[0.02] px-5 py-5">
            <h2 className="text-sm font-bold text-white/60 uppercase tracking-widest mb-4">Правила игры Tower Rush</h2>
            <div className="flex flex-col gap-3">
              {[
                'Сделайте ставку перед началом раунда',
                'Башня начинает расти — с каждым этажом множитель увеличивается',
                'AI Аналитик подсказывает вероятность продолжения роста цветовым сигналом',
                'Нажмите «Вывести» в любой момент, чтобы зафиксировать текущий множитель',
                'Если башня падает раньше вашего вывода — ставка сгорает',
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <p className="text-white/65 text-sm leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
              <span className="w-1 h-5 rounded-full bg-gradient-to-b from-purple-400 to-blue-400 inline-block" />
              Демо-режим и промокод
            </h2>
            <p className="text-white/65 text-sm leading-relaxed mb-4">
              Демо-режим на этом сайте доступен сразу, без регистрации — вы получаете виртуальный баланс
              и можете тренироваться сколько угодно. Когда будете готовы играть на реальные деньги,
              перейдите на 1win и введите промокод <strong>ADUNLOCK</strong> при регистрации для получения
              бонуса до 500% на первый депозит.
            </p>
            <p className="text-white/65 text-sm leading-relaxed">
              Подробные тактики по этажам вывода — в разделе{' '}
              <a href="/strategies" className="text-purple-300 underline underline-offset-2">Стратегии Tower Rush</a>,
              а актуальные условия промокода — на странице{' '}
              <a href="/promo" className="text-purple-300 underline underline-offset-2">Промокод ADUNLOCK</a>.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-purple-400" />
              Частые вопросы
            </h2>
            <div className="flex flex-col gap-3">
              {faq.map(({ q, a }) => (
                <div key={q} className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
                  <p className="text-white font-semibold text-sm mb-2">{q}</p>
                  <p className="text-white/55 text-sm leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </section>

          <a
            href={REAL_MONEY_URL}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="w-full block text-center rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-4 px-6 hover:opacity-90 transition-opacity"
          >
            Перейти на 1win и играть на реальные деньги
          </a>

        </article>
      </div>
    </PageLayout>
  );
}
