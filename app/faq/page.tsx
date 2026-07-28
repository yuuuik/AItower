import type { Metadata } from 'next';
import { BarChart3, ExternalLink } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { REAL_MONEY_URL, SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Как играть в Tower Rush — вопросы и ответы',
  description:
    'Как играть в Tower Rush: правила, механика краша, что предсказывает AI Аналитик, промокод ADUNLOCK, как скачать APK. Ответы на все частые вопросы.',
  keywords: [
    'как играть в tower rush',
    'tower rush правила',
    'tower rush как работает',
    'tower rush faq',
    'tower rush вопросы',
    'tower rush краш что это',
    'промокод tower rush',
  ],
  alternates: {
    canonical: `${SITE_URL}/faq`,
  },
  openGraph: {
    url: `${SITE_URL}/faq`,
    title: 'Частые вопросы о Tower Rush — FAQ',
    description:
      'Ответы на все вопросы об игре Tower Rush: механика краша, AI Аналитик, промокоды и стратегии.',
  },
};

const faq = [
  { q: 'Как работает игра Tower Rush?', a: 'Tower Rush — симулятор краш-слота со стратегическим элементом. Перед каждым раундом AI Аналитик объявляет этаж краша башни. Добавляйте этажи и в любой момент нажмите «Забрать», получив ставку с текущим множителем. На этаже краша башня рухнет и ставка будет потеряна.' },
  { q: 'Что такое этаж краша?', a: 'Заранее запрограммированный уровень, на котором башня обрушится. Алгоритм определяет его до начала раунда. Чаще всего краш на 3–6 этаже, реже — 8–10. Краш может произойти и на 1 этаже — в таком случае AI рекомендует пропустить раунд.' },
  { q: 'Как AI Аналитик помогает в игре?', a: 'AI выполняет три функции: объявляет точный этаж краша, рекомендует безопасный этаж для выхода, и в реальном времени предупреждает когда до краша остаётся 2 и 1 этаж. Цветовые сигналы: зелёный — всё нормально, жёлтый — осторожно, красный — немедленно забирайте.' },
  { q: 'Что делать если краш на 1 этаже?', a: 'Если AI объявил краш на 1 этаже, появятся две кнопки: «Пропустить (−1 ₽)» — теряете всего 1 рубль и переходите к следующему раунду, или «Крашнуть» — теряете полную ставку. Рекомендуется всегда пропускать такие раунды.' },
  { q: 'Как использовать промокод ADUNLOCK?', a: 'Для реальных денег: при регистрации на 1win введите ADUNLOCK в поле промокода — получите бонус до 500% на первый депозит. Для демо-баланса: раздел «Промокод» в меню → введите ADUNLOCK → нажмите «Применить».' },
  { q: 'Какие ставки доступны в демо?', a: 'Минимальная ставка 1 ₽, максимальная 100 000 ₽. Вводится вручную в поле «Ставка» в верхней панели. По умолчанию 100 ₽. Изменить можно только между раундами.' },
  { q: 'Что делать когда заканчиваются попытки?', a: 'Введите ADUNLOCK в разделе «Промокод» — попытки сбросятся. Либо нажмите «Сброс» в верхней панели для полного обнуления баланса до 10 000 ₽ и 10 попыток.' },
  { q: 'Почему AI всегда точно знает этаж краша?', a: 'Алгоритм определяет этаж краша до начала раунда, и AI действительно имеет доступ к этой информации. Предсказание — не оценка вероятности, а точный факт. Это ключевая механика Tower Rush.' },
  { q: 'Как сбросить демо-баланс?', a: 'Нажмите «Сброс» в верхней панели. Баланс вернётся к 10 000 ₽, попытки — к 10. Доступно в любой момент кроме активного раунда.' },
  { q: 'Как скачать Tower Rush на Android?', a: 'APK для Android доступен в разделе «APK». Требования: Android 8.0+, 50 МБ. Только официальный источник — не загружайте APK со сторонних сайтов. iOS-версия в разработке.' },
];

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Tower Rush', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'FAQ', item: `${SITE_URL}/faq` },
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map(item => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a,
    },
  })),
};

export default function FAQPage() {
  return (
    <PageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="min-h-full" style={{ background: '#141415' }}>
        <article className="max-w-2xl mx-auto px-6 py-10 text-white">

          <header className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-bold uppercase tracking-widest mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Справочный центр
            </div>
            <h1 className="text-3xl font-black leading-tight mb-3">
              Часто задаваемые вопросы<br />
              <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">о Tower Rush</span>
            </h1>
            <p className="text-white/50 text-sm leading-relaxed">
              Всё о механике игры, AI Аналитике, промокодах и технических вопросах.
            </p>
          </header>

          <section aria-label="Вопросы и ответы" className="flex flex-col gap-3 mb-10">
            {faq.map((item, i) => (
              <div key={i} className="rounded-2xl border border-white/8 bg-white/[0.025] overflow-hidden">
                <div className="px-5 py-4">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="font-mono font-black text-[10px] text-blue-400">{String(i + 1).padStart(2, '0')}</span>
                    </div>
                    <div>
                      <h2 className="text-white font-bold text-sm leading-snug mb-2">{item.q}</h2>
                      <p className="text-white/50 text-sm leading-relaxed">{item.a}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </section>

          <nav aria-label="Связанные разделы" className="grid grid-cols-2 gap-3 mb-6">
            <a href="/strategies" className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 hover:bg-blue-500/10 transition-colors group">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 flex items-center justify-center mb-3">
                <BarChart3 size={18} className="text-blue-400" strokeWidth={2} />
              </div>
              <p className="text-white font-bold text-sm group-hover:text-blue-300 transition-colors">Стратегии</p>
              <p className="text-white/35 text-xs mt-0.5">Тактики и советы</p>
            </a>
            <a href={REAL_MONEY_URL} target="_blank" rel="noopener noreferrer" className="rounded-2xl border border-green-500/20 bg-green-500/5 p-4 hover:bg-green-500/10 transition-colors group">
              <div className="w-9 h-9 rounded-xl bg-green-500/20 flex items-center justify-center mb-3">
                <ExternalLink size={18} className="text-green-400" strokeWidth={2} />
              </div>
              <p className="text-white font-bold text-sm group-hover:text-green-300 transition-colors">Реальная игра</p>
              <p className="text-white/35 text-xs mt-0.5">1win · Промокод ADUNLOCK</p>
            </a>
          </nav>

          <p className="text-white/15 text-xs text-center">18+ · Tower Rush — демонстрационная игра · Виртуальный баланс</p>
        </article>
      </div>
    </PageLayout>
  );
}
