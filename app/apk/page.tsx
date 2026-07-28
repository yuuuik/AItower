import type { Metadata } from 'next';
import { Smartphone, Share2, Plus, MoreVertical, Home, Check, Apple, Monitor } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { REAL_MONEY_URL, SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Tower Rush скачать на Android и iPhone — установка приложения',
  description:
    'Tower Rush скачать на телефон бесплатно — без App Store и Google Play. Установите приложение на Android (Chrome) или iPhone (Safari) за 2 шага.',
  keywords: [
    'tower rush скачать',
    'tower rush скачать на андроид',
    'tower rush apk',
    'tower rush приложение',
    'tower rush на телефон',
    'tower rush ios скачать',
    'скачать краш игру',
  ],
  alternates: {
    canonical: `${SITE_URL}/apk`,
  },
  openGraph: {
    url: `${SITE_URL}/apk`,
    title: 'Установить Tower Rush на телефон — Android и iOS',
    description:
      'Добавьте Tower Rush на экран телефона без App Store и Google Play. Инструкция для Android и iPhone.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Tower Rush', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Скачать приложение', item: `${SITE_URL}/apk` },
  ],
};

export default function APKPage() {
  return (
    <PageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="min-h-full" style={{ background: '#141415' }}>
        <article className="max-w-lg mx-auto px-5 py-10 text-white">

          {/* Hero */}
          <header className="flex flex-col items-center text-center mb-10">
            <div className="relative mb-5">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-blue-500/10 to-green-500/10 blur-2xl" />
              <div className="relative w-24 h-24 rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/15 border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/towerrush.png" alt="Tower Rush" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/25 text-green-300 text-xs font-bold uppercase tracking-widest mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Без App Store и Google Play
            </div>

            <h1 className="text-3xl font-black leading-tight mb-3">
              Установка<br />
              <span className="bg-gradient-to-r from-blue-300 to-green-400 bg-clip-text text-transparent">приложения</span>
            </h1>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              Установите наш веб-сервис как приложение для мгновенного доступа к сигналам.
            </p>
          </header>

          {/* Advantages row */}
          <div className="grid grid-cols-3 gap-2.5 mb-9">
            {[
              { icon: <Check size={14} className="text-green-400" />, label: 'Бесплатно' },
              { icon: <Check size={14} className="text-green-400" />, label: 'Без регистрации' },
              { icon: <Check size={14} className="text-green-400" />, label: 'На любой телефон' },
            ].map(({ icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 justify-center py-2.5 rounded-xl text-xs font-semibold"
                style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)', color: 'rgba(255,255,255,0.55)' }}
              >
                {icon}
                {label}
              </div>
            ))}
          </div>

          {/* ── Android section ── */}
          <section className="mb-6">
            {/* Section header */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)' }}
              >
                {/* Android robot head SVG */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M6 12.5V8.5C6 5.462 8.686 3 12 3s6 2.462 6 5.5v4c0 3.038-2.686 5.5-6 5.5s-6-2.462-6-5.5z" fill="rgba(34,197,94,0.9)" />
                  <circle cx="9.5" cy="9.5" r="1" fill="#141415" />
                  <circle cx="14.5" cy="9.5" r="1" fill="#141415" />
                  <path d="M3 10.5h1.5M19.5 10.5H21M8.5 3L7 1M15.5 3L17 1" stroke="rgba(34,197,94,0.9)" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M9 18.5v2M15 18.5v2" stroke="rgba(34,197,94,0.7)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-widest font-bold" style={{ color: 'rgba(34,197,94,0.7)' }}>Для Android</p>
                <p className="text-white font-black text-base leading-tight">Браузер Chrome</p>
              </div>
            </div>

            {/* Steps */}
            <div className="flex flex-col gap-3">
              {/* Step 1 */}
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div className="px-4 py-4 flex gap-3.5 items-start">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm shrink-0 mt-0.5"
                    style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.2)', color: '#4ade80' }}
                  >
                    1
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <MoreVertical size={14} className="text-white/60 shrink-0" />
                      <p className="text-white font-bold text-[14px]">Открыть настройки Chrome</p>
                    </div>
                    <p className="text-white/40 text-xs leading-relaxed">
                      Нажмите на иконку трёх точек <span className="text-white/60 font-bold">⋮</span> в правом верхнем углу браузера.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div className="px-4 py-4 flex gap-3.5 items-start">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm shrink-0 mt-0.5"
                    style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.2)', color: '#4ade80' }}
                  >
                    2
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Plus size={14} className="text-white/60 shrink-0" />
                      <p className="text-white font-bold text-[14px]">Добавить на экран</p>
                    </div>
                    <p className="text-white/40 text-xs leading-relaxed">
                      Выберите пункт <span className="text-white/65 font-semibold">«Установить приложение»</span> или <span className="text-white/65 font-semibold">«Добавить на гл. экран»</span>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <span className="text-white/20 text-xs uppercase tracking-widest font-bold">или</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
          </div>

          {/* ── iOS section ── */}
          <section className="mb-9">
            {/* Section header */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: 'rgba(200,200,220,0.08)', border: '1px solid rgba(200,200,220,0.15)' }}
              >
                <Apple size={20} className="text-white/70" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-widest font-bold" style={{ color: 'rgba(200,200,220,0.5)' }}>Для iOS (iPhone)</p>
                <p className="text-white font-black text-base leading-tight">Браузер Safari</p>
              </div>
            </div>

            {/* Steps */}
            <div className="flex flex-col gap-3">
              {/* Step 1 */}
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div className="px-4 py-4 flex gap-3.5 items-start">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm shrink-0 mt-0.5"
                    style={{ background: 'rgba(180,180,220,0.1)', border: '1px solid rgba(180,180,220,0.15)', color: 'rgba(200,200,240,0.8)' }}
                  >
                    1
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Share2 size={14} className="text-white/60 shrink-0" />
                      <p className="text-white font-bold text-[14px]">Нажать «Поделиться»</p>
                    </div>
                    <p className="text-white/40 text-xs leading-relaxed">
                      В браузере Safari нажмите на центральную иконку со стрелкой вверх <span className="text-white/60 font-bold">↑</span> внизу экрана.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div className="px-4 py-4 flex gap-3.5 items-start">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm shrink-0 mt-0.5"
                    style={{ background: 'rgba(180,180,220,0.1)', border: '1px solid rgba(180,180,220,0.15)', color: 'rgba(200,200,240,0.8)' }}
                  >
                    2
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Home size={14} className="text-white/60 shrink-0" />
                      <p className="text-white font-bold text-[14px]">Экран «Домой»</p>
                    </div>
                    <p className="text-white/40 text-xs leading-relaxed">
                      Прокрутите список функций и нажмите кнопку <span className="text-white/65 font-semibold">«На экран Домой»</span>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Desktop hint */}
          <div
            className="rounded-2xl px-5 py-4 flex items-center gap-4 mb-8"
            style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.2)' }}
            >
              <Monitor size={17} className="text-blue-400" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Десктоп (Chrome / Edge)</p>
              <p className="text-white/35 text-xs mt-0.5 leading-relaxed">
                Нажмите на иконку <span className="text-white/55 font-semibold">«Установить»</span> в адресной строке справа — и сайт появится как отдельное приложение.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div
            className="relative rounded-3xl overflow-hidden shadow-xl"
            style={{ background: 'linear-gradient(135deg, #141f14 0%, #141415 100%)', border: '1px solid rgba(34,197,94,0.2)' }}
          >
            <div className="px-6 py-6 flex flex-col items-center gap-4 text-center">
              <div className="w-10 h-10 rounded-2xl bg-green-500/15 border border-green-500/25 flex items-center justify-center">
                <Smartphone size={18} className="text-green-400" strokeWidth={2} />
              </div>
              <div>
                <p className="text-white font-black text-base">Играйте на реальные деньги</p>
                <p className="text-white/35 text-sm mt-1">
                  Промокод <span className="text-blue-300 font-mono font-bold">ADUNLOCK</span> — бонус до 500% на 1win
                </p>
              </div>
              <a href={REAL_MONEY_URL} target="_blank" rel="nofollow sponsored noopener noreferrer" className="w-full">
                <div
                  className="w-full py-3.5 rounded-2xl font-bold text-sm text-center"
                  style={{ background: 'linear-gradient(135deg, #15803d 0%, #4ade80 100%)', color: '#052e16' }}
                >
                  Начать играть на 1win
                </div>
              </a>
            </div>
          </div>

          <p className="text-white/15 text-xs text-center mt-8">18+ · Ответственная игра</p>
        </article>
      </div>
    </PageLayout>
  );
}
