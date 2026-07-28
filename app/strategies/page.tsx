import type { Metadata } from 'next';
import { Check, X, TrendingUp, BookOpen, Shield, Zap, ChevronRight } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { REAL_MONEY_URL, SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Tower Rush стратегии — схема и тактики как выиграть',
  description:
    'Tower Rush стратегии и схема игры: как выиграть, на каком этаже забирать, таблица множителей, сигналы AI Аналитика. Консервативная, умеренная и агрессивная тактика.',
  keywords: [
    'tower rush стратегии',
    'tower rush схема',
    'как выиграть в tower rush',
    'tower rush тактика',
    'tower rush множители этажи',
    'tower rush ai сигналы',
    'краш игра стратегия',
  ],
  alternates: {
    canonical: `${SITE_URL}/strategies`,
  },
  openGraph: {
    url: `${SITE_URL}/strategies`,
    title: 'Стратегии Tower Rush — как выигрывать в краш-игру',
    description:
      'Таблица множителей, три проверенных стратегии и сигналы AI Аналитика для победы в Tower Rush.',
  },
};

const multipliers = [
  { floor: 1,  mult: 1.2,  risk: 'Минимальный', riskColor: 'text-emerald-400', barColor: 'bg-emerald-400', barW: '10%' },
  { floor: 2,  mult: 1.5,  risk: 'Низкий',      riskColor: 'text-green-400',   barColor: 'bg-green-400',   barW: '18%' },
  { floor: 3,  mult: 2.0,  risk: 'Умеренный',   riskColor: 'text-yellow-400',  barColor: 'bg-yellow-400',  barW: '28%' },
  { floor: 4,  mult: 2.5,  risk: 'Умеренный',   riskColor: 'text-yellow-400',  barColor: 'bg-yellow-400',  barW: '36%' },
  { floor: 5,  mult: 3.0,  risk: 'Повышенный',  riskColor: 'text-orange-400',  barColor: 'bg-orange-400',  barW: '46%' },
  { floor: 6,  mult: 4.0,  risk: 'Высокий',     riskColor: 'text-orange-500',  barColor: 'bg-orange-500',  barW: '56%' },
  { floor: 7,  mult: 5.0,  risk: 'Высокий',     riskColor: 'text-red-400',     barColor: 'bg-red-400',     barW: '66%' },
  { floor: 8,  mult: 7.0,  risk: 'Экстрем.',    riskColor: 'text-red-500',     barColor: 'bg-red-500',     barW: '78%' },
  { floor: 9,  mult: 10.0, risk: 'Макс.',       riskColor: 'text-pink-400',    barColor: 'bg-pink-400',    barW: '90%' },
  { floor: 10, mult: 15.0, risk: 'Джекпот',     riskColor: 'text-blue-400',    barColor: 'bg-blue-400',    barW: '100%' },
];

const strategies = [
  {
    level: 'Консервативная',
    floors: '1–2 этаж',
    mult: '×1.2 — ×1.5',
    borderColor: 'border-emerald-500/25',
    bgColor: 'from-emerald-950/60 to-emerald-950/20',
    badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
    multColor: 'text-emerald-400',
    pros: ['Стабильный доход при любом краше', 'Минимальный риск потери ставки', 'Идеально для новичков'],
    cons: ['Медленный рост баланса', 'Нужно больше раундов'],
    when: 'AI предсказал краш на 2–4 этаже',
  },
  {
    level: 'Умеренная',
    floors: '3–4 этаж',
    mult: '×2.0 — ×2.5',
    borderColor: 'border-yellow-500/25',
    bgColor: 'from-yellow-950/60 to-yellow-950/20',
    badgeColor: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/25',
    multColor: 'text-yellow-400',
    pros: ['Удвоение ставки за 3 этажа', 'Оптимальное соотношение риск/доход', 'Рекомендована AI при краше 5–7'],
    cons: ['Нельзя при краше 3–4 этажа', 'Требует внимания к прогнозу'],
    when: 'AI предсказал краш на 5–7 этаже',
  },
  {
    level: 'Агрессивная',
    floors: '5+ этаж',
    mult: '×3.0 — ×15.0',
    borderColor: 'border-red-500/25',
    bgColor: 'from-red-950/60 to-red-950/20',
    badgeColor: 'bg-red-500/15 text-red-300 border-red-500/25',
    multColor: 'text-red-400',
    pros: ['Потенциал до ×15 от ставки', 'Джекпот при краше 9–10'],
    cons: ['Высокий риск потери ставки', 'Только для опытных игроков'],
    when: 'AI предсказал краш на 8–10 этаже',
  },
];

const aiSignals = [
  { color: 'bg-emerald-400', label: 'Зелёный', text: 'До краша 3+ этажа. Можно добавлять этажи по стратегии.' },
  { color: 'bg-yellow-400',  label: 'Жёлтый',  text: '2 этажа до краша. Готовьтесь к выходу.' },
  { color: 'bg-red-400',     label: 'Красный', text: '1 этаж до краша. СТОП — немедленно нажмите «Забрать»!' },
  { color: 'bg-white/20',    label: 'Краш',    text: 'Башня рухнула. Ставка потеряна. Следующий раунд.' },
];

const bankrollTips = [
  { Icon: Shield,   title: 'Правило 10%',           text: 'Не ставьте более 10% баланса за один раунд. При 5 000 ₽ — ставка не более 500 ₽.' },
  { Icon: TrendingUp, title: 'Фиксируйте прибыль', text: 'Заработали ×2 от стартового баланса? Снизьте ставку и зафиксируйте результат.' },
  { Icon: Zap,      title: 'Без погони за потерями', text: 'Три проигрыша подряд — снизьте ставку. Серия проигрышей не гарантирует победу.' },
  { Icon: BookOpen, title: 'Используйте промокоды', text: 'Промокод ADUNLOCK на 1win даёт бонус до 500% — больше баланса, больше возможностей.' },
];

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Tower Rush', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Стратегии', item: `${SITE_URL}/strategies` },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Стратегии Tower Rush: как правильно выходить из игры',
  description:
    'Таблица множителей по этажам, три стратегии игры и советы по управлению банкроллом в краш-игре Tower Rush.',
  author: { '@type': 'Organization', name: 'Tower Rush' },
  publisher: { '@type': 'Organization', name: 'Tower Rush' },
};

export default function StrategiesPage() {
  return (
    <PageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <div className="min-h-full" style={{ background: '#141415' }}>
        <article className="max-w-2xl mx-auto px-6 py-10 text-white">

          {/* Header */}
          <header className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-300 text-xs font-bold uppercase tracking-widest mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Гайд по игре
            </div>
            <h1 className="text-3xl font-black leading-tight mb-3">
              Стратегии Tower Rush:<br />
              <span className="bg-gradient-to-r from-blue-300 to-green-400 bg-clip-text text-transparent">
                как правильно выходить из игры
              </span>
            </h1>
            <p className="text-white/50 text-sm leading-relaxed max-w-lg">
              В Tower Rush этаж краша известен заранее — AI Аналитик объявляет его перед каждым раундом.
              Ваша задача — выбрать оптимальный момент для выхода, балансируя риск и доходность.
            </p>
          </header>

          {/* Multiplier table */}
          <section className="mb-10">
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
              <span className="w-1 h-5 rounded-full bg-gradient-to-b from-blue-400 to-green-400 inline-block" />
              Таблица множителей по этажам
            </h2>
            <div className="rounded-2xl border border-white/8 overflow-hidden bg-white/[0.02]">
              {multipliers.map((row, i) => (
                <div key={row.floor} className={`flex items-center gap-4 px-4 py-3 ${i > 0 ? 'border-t border-white/5' : ''}`}>
                  <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-white/50 font-mono font-bold text-xs shrink-0">{row.floor}</div>
                  <div className="w-14 shrink-0">
                    <p className={`font-mono font-black text-sm ${row.riskColor}`}>×{row.mult}</p>
                  </div>
                  <div className="flex-1">
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className={`h-full rounded-full ${row.barColor} opacity-70`} style={{ width: row.barW }} />
                    </div>
                  </div>
                  <span className={`text-xs font-medium w-20 text-right shrink-0 ${row.riskColor}`}>{row.risk}</span>
                  <span className="text-white/30 text-xs w-20 text-right shrink-0 hidden sm:block">
                    {(1000 * row.mult).toLocaleString('ru-RU')} ₽
                  </span>
                </div>
              ))}
              <div className="px-4 py-2 bg-white/[0.02] border-t border-white/5">
                <p className="text-white/20 text-xs">* Доход при ставке 1 000 ₽</p>
              </div>
            </div>
          </section>

          {/* Strategies */}
          <section className="mb-10">
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
              <span className="w-1 h-5 rounded-full bg-gradient-to-b from-blue-400 to-green-400 inline-block" />
              Три проверенных стратегии
            </h2>
            <div className="flex flex-col gap-4">
              {strategies.map(s => (
                <div key={s.level} className={`rounded-2xl border ${s.borderColor} overflow-hidden`}>
                  <div className={`bg-gradient-to-br ${s.bgColor} px-5 py-5`}>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${s.badgeColor} mb-1 inline-block`}>{s.level}</span>
                        <h3 className="text-white font-black text-lg">{s.floors}</h3>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-white/30 text-xs">Множитель</p>
                        <p className={`font-black text-lg ${s.multColor}`}>{s.mult}</p>
                      </div>
                    </div>
                    <div className="flex gap-4 text-xs mb-3">
                      <div className="flex-1">
                        <p className="text-white/40 mb-1.5 font-medium uppercase text-[10px] tracking-wide">Плюсы</p>
                        {s.pros.map(p => (
                          <div key={p} className="flex items-start gap-1.5 mb-1">
                            <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                              <Check size={9} className="text-green-400" strokeWidth={3} />
                            </div>
                            <p className="text-white/65 leading-relaxed">{p}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex-1">
                        <p className="text-white/40 mb-1.5 font-medium uppercase text-[10px] tracking-wide">Минусы</p>
                        {s.cons.map(c => (
                          <div key={c} className="flex items-start gap-1.5 mb-1">
                            <div className="w-4 h-4 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                              <X size={9} className="text-red-400" strokeWidth={3} />
                            </div>
                            <p className="text-white/40 leading-relaxed">{c}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-xl bg-black/20 border border-white/5 px-3 py-2 text-xs flex items-center gap-2">
                      <ChevronRight size={12} className="text-white/30 shrink-0" />
                      <span className="text-white/30">Когда применять: </span>
                      <span className="text-white/65">{s.when}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* AI signals */}
          <section className="mb-10">
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
              <span className="w-1 h-5 rounded-full bg-gradient-to-b from-blue-400 to-green-400 inline-block" />
              Как читать сигналы AI Аналитика
            </h2>
            <div className="flex flex-col gap-2.5">
              {aiSignals.map(s => (
                <div key={s.label} className="flex items-start gap-3 rounded-xl border border-white/6 bg-white/[0.025] px-4 py-3">
                  <div className={`w-3 h-3 rounded-full ${s.color} shrink-0 mt-1`} />
                  <div>
                    <span className="text-white font-semibold text-sm">{s.label} — </span>
                    <span className="text-white/55 text-sm">{s.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Bankroll */}
          <section className="mb-10">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="w-1 h-5 rounded-full bg-gradient-to-b from-blue-400 to-green-400 inline-block" />
              Управление банкроллом
            </h2>
            <div className="rounded-2xl border border-white/8 bg-white/[0.02] divide-y divide-white/5">
              {bankrollTips.map(({ Icon, title, text }) => (
                <div key={title} className="flex gap-3 px-4 py-3.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center shrink-0">
                    <Icon size={14} className="text-blue-400" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{title}</p>
                    <p className="text-white/40 text-xs mt-0.5 leading-relaxed">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="relative rounded-3xl overflow-hidden shadow-xl shadow-green-900/20">
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #141f14 0%, #141415 100%)' }} />
            <div className="absolute inset-0 border border-green-500/20 rounded-3xl" />
            <div className="relative px-6 py-7 flex flex-col items-center gap-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-green-500/15 border border-green-500/25 flex items-center justify-center">
                <TrendingUp size={22} className="text-green-400" strokeWidth={2} />
              </div>
              <div>
                <p className="text-white font-black text-lg">Готовы к реальной игре?</p>
                <p className="text-white/40 text-sm mt-1">Применяйте стратегии с бонусом 1win</p>
              </div>
              <a href={REAL_MONEY_URL} target="_blank" rel="nofollow sponsored noopener noreferrer" className="w-full">
                <div className="w-full py-3.5 rounded-2xl font-bold text-sm text-white text-center cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #15803d 0%, #16a34a 60%, #4ade80 100%)' }}>
                  Играть на реальные деньги · Промокод ADUNLOCK
                </div>
              </a>
            </div>
          </div>

          <p className="text-white/15 text-xs text-center mt-8">18+ · Демо-режим · Стратегии не гарантируют выигрыш</p>
        </article>
      </div>
    </PageLayout>
  );
}
