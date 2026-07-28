import type { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import { REAL_MONEY_URL, SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Промокод Tower Rush 1win ADUNLOCK — бонус 500% на депозит',
  description:
    'Промокод Tower Rush для 1win: ADUNLOCK. Рабочий промокод 1win 2026 — бонус до 500% на первый депозит при регистрации. Введите ADUNLOCK и получите максимальный бонус для игры в Tower Rush.',
  keywords: [
    'промокод tower rush 1win',
    'промокод товер раш 1вин',
    'промокод 1win',
    'промокод 1win при регистрации',
    'промокод 1win 2026',
    '1win бонус при регистрации',
    'рабочий промокод 1win',
    'tower rush промокод',
  ],
  alternates: {
    canonical: `${SITE_URL}/promo`,
  },
  openGraph: {
    url: `${SITE_URL}/promo`,
    title: 'Промокод Tower Rush 1win ADUNLOCK — бонус до 500%',
    description:
      'Введите ADUNLOCK при регистрации на 1win и получите бонус до 500% на первый депозит для игры в Tower Rush.',
  },
};

const faq = [
  {
    q: 'Что такое промокод ADUNLOCK?',
    a: 'ADUNLOCK — официальный партнёрский промокод для регистрации на платформе 1win. При использовании этого кода вы получаете увеличенный приветственный бонус до 500% на первый депозит.',
  },
  {
    q: 'Как использовать промокод ADUNLOCK?',
    a: 'Перейдите на сайт 1win по кнопке «Зарегистрироваться на 1win» выше. При заполнении формы регистрации найдите поле «Промокод» или «Реферальный код» и введите ADUNLOCK. Бонус начисляется автоматически после первого пополнения счёта.',
  },
  {
    q: 'Сколько можно получить с промокодом ADUNLOCK?',
    a: 'Промокод ADUNLOCK активирует бонус до 500% на первый депозит. Например, при пополнении на 5 000 ₽ ваш игровой баланс составит до 30 000 ₽. Точный размер бонуса зависит от суммы депозита и актуальных условий акции на сайте 1win.',
  },
  {
    q: 'Работает ли промокод ADUNLOCK в 2025-2026 году?',
    a: 'Да, промокод ADUNLOCK актуален и действует. Мы регулярно проверяем его работоспособность. Если при вводе кода возникает ошибка, убедитесь, что вводите его заглавными буквами: ADUNLOCK.',
  },
  {
    q: 'На какие игры распространяется бонус?',
    a: 'Бонус по промокоду ADUNLOCK может быть использован на слоты, краш-игры (включая Tower Rush), настольные игры и live-казино на платформе 1win. Ознакомьтесь с полными условиями вейджера на сайте 1win.',
  },
  {
    q: 'Можно ли вывести бонусные деньги?',
    a: 'Бонусные средства необходимо отыграть согласно условиям вейджера 1win. После выполнения требований выигрыш переводится на реальный баланс и доступен для вывода. Подробные условия указаны в правилах акции на сайте 1win.',
  },
  {
    q: 'Что делать если промокод не принимается?',
    a: 'Убедитесь что: (1) вводите код заглавными буквами — ADUNLOCK, (2) вы создаёте новый аккаунт (промокод только для новых пользователей), (3) поле промокода заполнено до нажатия кнопки регистрации. При технических проблемах обратитесь в поддержку 1win через чат.',
  },
  {
    q: 'Есть ли ограничения по странам?',
    a: 'Промокод ADUNLOCK действителен для пользователей из стран, где платформа 1win ведёт деятельность. Уточните доступность сервиса в вашем регионе на официальном сайте 1win перед регистрацией.',
  },
  {
    q: 'Как связан Tower Rush с 1win?',
    a: 'Tower Rush — демонстрационная версия краш-игры в стиле 1win Casino. Демо-режим позволяет изучить механику, стратегии и поведение AI Аналитика перед игрой на реальные деньги. Промокод ADUNLOCK обеспечивает максимальный стартовый бонус при переходе на 1win.',
  },
  {
    q: 'Можно ли использовать промокод повторно?',
    a: 'Нет, промокод ADUNLOCK применяется один раз — при первой регистрации аккаунта на 1win. Бонус предназначен для новых игроков платформы. Повторное использование на том же аккаунте или при повторной регистрации невозможно.',
  },
];

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Tower Rush', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Промокод ADUNLOCK', item: `${SITE_URL}/promo` },
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

export default function PromoPage() {
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
        <article className="max-w-lg mx-auto px-6 py-10 text-white">

          {/* Hero badge */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/25 text-yellow-400 text-xs font-bold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
              Эксклюзивный промокод
            </div>
          </div>

          <h1 className="text-3xl font-black text-center mb-8 leading-tight">
            Промокод <span className="font-mono text-blue-300">ADUNLOCK</span><br />
            <span className="bg-gradient-to-r from-yellow-300 to-green-400 bg-clip-text text-transparent text-2xl">бонус до 500% на 1win</span>
          </h1>

          {/* Main promo card */}
          <div className="relative rounded-3xl overflow-hidden mb-10 shadow-2xl shadow-black/50">
            <div className="absolute inset-0" style={{ background: '#1c1c1e' }} />
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/8 via-transparent to-green-600/8" />
            <div className="absolute inset-0 rounded-3xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }} />

            <div className="relative px-8 py-10 flex flex-col items-center gap-6 text-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-xl font-black text-white shadow-lg shadow-blue-500/30">
                  1W
                </div>
                <div className="text-left">
                  <p className="text-white font-bold text-lg leading-none">1win</p>
                  <p className="text-white/40 text-xs mt-0.5">Официальный партнёр</p>
                </div>
              </div>

              {/* Code display */}
              <div>
                <p className="text-white/40 text-xs uppercase tracking-widest mb-3">Промокод при регистрации</p>
                <div className="relative group inline-block">
                  <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-blue-500 to-green-400 opacity-60 blur-sm group-hover:opacity-80 transition" />
                  <div className="relative px-10 py-4 rounded-2xl border border-white/10" style={{ background: '#141415' }}>
                    <p className="font-mono font-black text-3xl tracking-[0.2em] text-white">
                      AD<span className="text-blue-300">UNLOCK</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 w-full">
                {[
                  { value: '500%', label: 'Бонус на депозит', color: 'text-yellow-400' },
                  { value: '200+', label: 'Игр в казино', color: 'text-blue-300' },
                  { value: '24/7', label: 'Поддержка', color: 'text-green-400' },
                ].map(item => (
                  <div key={item.label} className="rounded-2xl bg-white/5 border border-white/8 py-3 px-2">
                    <p className={`text-xl font-black ${item.color}`}>{item.value}</p>
                    <p className="text-white/35 text-[10px] mt-0.5 leading-tight">{item.label}</p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <a href={REAL_MONEY_URL} target="_blank" rel="nofollow sponsored noopener noreferrer" className="w-full block">
                <div
                  className="w-full py-4 rounded-2xl font-bold text-base text-white text-center shadow-xl shadow-green-900/25 hover:shadow-green-900/40 transition-shadow cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #15803d 0%, #16a34a 55%, #4ade80 100%)' }}
                >
                  🎰 Зарегистрироваться на 1win
                </div>
              </a>

              <p className="text-white/25 text-[11px] leading-relaxed">
                Введите ADUNLOCK в поле промокода при регистрации.
                Бонус зачисляется после первого депозита.
              </p>
            </div>
          </div>

          {/* How it works */}
          <section className="mb-10">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="w-1 h-5 rounded-full bg-gradient-to-b from-blue-400 to-green-400 inline-block" />
              Как получить бонус на 1win
            </h2>
            <div className="flex flex-col gap-3">
              {[
                { num: '01', title: 'Перейдите на 1win', desc: 'Нажмите «Зарегистрироваться на 1win» выше. Откроется официальный сайт.' },
                { num: '02', title: 'Введите промокод', desc: 'При регистрации найдите поле «Промокод» и введите ADUNLOCK заглавными буквами.' },
                { num: '03', title: 'Пополните счёт', desc: 'Внесите первый депозит. Бонус до 500% зачисляется автоматически.' },
                { num: '04', title: 'Играйте в Tower Rush', desc: 'Примените бонусный баланс в краш-играх казино, включая Tower Rush.' },
              ].map(step => (
                <div key={step.num} className="flex gap-4 items-start p-4 rounded-2xl border border-white/6 bg-white/[0.02]">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center text-blue-400 font-mono font-bold text-xs shrink-0">
                    {step.num}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{step.title}</p>
                    <p className="text-white/40 text-xs mt-0.5 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-8">
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
              <span className="w-1 h-5 rounded-full bg-gradient-to-b from-blue-400 to-green-400 inline-block" />
              Вопросы о промокоде ADUNLOCK
            </h2>
            <div className="flex flex-col gap-3">
              {faq.map((item, i) => (
                <div key={i} className="rounded-2xl border border-white/8 bg-white/[0.025] p-5">
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-xs text-blue-400/60 font-bold mt-0.5 shrink-0 w-5">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="text-white font-bold text-sm leading-snug mb-1.5">{item.q}</h3>
                      <p className="text-white/50 text-sm leading-relaxed">{item.a}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <p className="text-white/15 text-xs text-center">
            18+ · Играйте ответственно · Условия бонуса уточняйте на сайте 1win
          </p>
        </article>
      </div>
    </PageLayout>
  );
}
