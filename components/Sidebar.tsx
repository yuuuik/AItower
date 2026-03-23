'use client';

import { motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { Gamepad2, BarChart3, Gift, HelpCircle, Smartphone, Zap } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';

const items = [
  { id: 'demo',       label: 'Демо',       Icon: Gamepad2,   href: '/' },
  { id: 'strategies', label: 'Стратегии',  Icon: BarChart3,  href: '/strategies' },
  { id: 'promo',      label: 'Промокод',   Icon: Gift,       href: '/promo' },
  { id: 'faq',        label: 'FAQ',        Icon: HelpCircle, href: '/faq' },
  { id: 'apk',        label: 'APK',        Icon: Smartphone, href: '/apk' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isRealMode, setShowLimitModal, resetDemo } = useGameStore();

  return (
    <aside className="flex flex-col h-full w-full px-5 py-8 gap-2 select-none" style={{ background: '#1c1c1e', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-1 mb-8">
        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/towerrush.png"
            alt="Tower Rush"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>
        <span className="text-white font-black text-xl tracking-widest leading-tight uppercase">TOWER<br/>RUSH</span>
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        {items.map(({ id, label, Icon, href }) => {
          const isActive = pathname === href;
          const isDemo = id === 'demo';
          const displayLabel = isDemo && isRealMode ? 'REAL' : label;
          const realActive = isDemo && isRealMode;

          return (
            <motion.button
              key={id}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push(href)}
              className="relative w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-200"
              style={isActive
                ? realActive
                  ? { background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#ffffff' }
                  : { background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.3)', color: '#ffffff' }
                : { color: '#9aa1b1', border: '1px solid transparent' }
              }
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all"
                style={isActive
                  ? realActive
                    ? { background: 'rgba(239,68,68,0.15)', color: '#f87171' }
                    : { background: 'rgba(59,130,246,0.15)', color: '#3b82f6' }
                  : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }
                }
              >
                <Icon size={19} strokeWidth={2} />
              </div>
              <span className="flex-1 text-left text-sm font-medium">{displayLabel}</span>
              {isActive && (
                <span
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{
                    background: realActive ? '#f87171' : '#3b82f6',
                    boxShadow: realActive ? '0 0 6px rgba(239,68,68,0.8)' : '0 0 6px rgba(59,130,246,0.8)',
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Bottom action */}
      <div className="mt-2 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        {isRealMode ? (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => resetDemo()}
            className="w-full py-3 rounded-xl text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.35)' }}
          >
            Вернуться в демо
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowLimitModal(true)}
            className="w-full py-3.5 rounded-2xl font-black text-[12px] uppercase tracking-wider flex items-center justify-center gap-2 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #15803d 0%, #16a34a 60%, #4ade80 100%)',
              color: '#052e16',
              boxShadow: '0 4px 20px rgba(34,197,94,0.25)',
            }}
          >
            <motion.div
              animate={{ x: ['-120%', '220%'] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
              className="absolute inset-y-0 w-1/3 pointer-events-none"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)', transform: 'skewX(-12deg)' }}
            />
            <Zap size={14} fill="currentColor" />
            Подключить REAL
          </motion.button>
        )}
      </div>
    </aside>
  );
}
