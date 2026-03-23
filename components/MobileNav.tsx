'use client';

import { motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { Gamepad2, BarChart3, Gift, HelpCircle, Smartphone } from 'lucide-react';

const items = [
  { id: 'demo',       label: 'Демо',      Icon: Gamepad2,   href: '/' },
  { id: 'strategies', label: 'Стратегии', Icon: BarChart3,  href: '/strategies' },
  { id: 'promo',      label: 'Промокод',  Icon: Gift,       href: '/promo' },
  { id: 'faq',        label: 'FAQ',       Icon: HelpCircle, href: '/faq' },
  { id: 'apk',        label: 'APK',       Icon: Smartphone, href: '/apk' },
];

export default function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav
      className="flex items-center backdrop-blur-xl px-1"
      style={{ height: 60, paddingBottom: 'env(safe-area-inset-bottom)', background: '#1c1c1e', borderTop: '1px solid rgba(255,255,255,0.06)' }}
    >
      {items.map(({ id, label, Icon, href }) => {
        const isActive = pathname === href;
        return (
          <motion.button
            key={id}
            whileTap={{ scale: 0.9 }}
            onClick={() => router.push(href)}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-1.5"
          >
            <div
              className="w-9 h-8 rounded-xl flex items-center justify-center transition-all duration-200"
              style={isActive
                ? { background: 'rgba(37,99,235,0.18)', border: '1px solid rgba(37,99,235,0.35)' }
                : { background: 'transparent' }
              }
            >
              <Icon
                size={16}
                strokeWidth={isActive ? 2.5 : 1.8}
                style={{ color: isActive ? '#2563eb' : 'rgba(255,255,255,0.35)' }}
              />
            </div>
            <span className={`text-[10px] font-medium transition-colors ${
              isActive ? 'text-white' : 'text-white/30'
            }`}>
              {label}
            </span>
          </motion.button>
        );
      })}
    </nav>
  );
}
