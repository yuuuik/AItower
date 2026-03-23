'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, TrendingUp } from 'lucide-react';
import { REAL_MONEY_URL } from '@/lib/constants';
import { useGameStore } from '@/store/gameStore';

export default function PromoToast() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const roundsCompleted = useGameStore(s => s.roundsCompleted);
  const showRealMoneyModal = useGameStore(s => s.showRealMoneyModal);

  useEffect(() => {
    if (dismissed || showRealMoneyModal) return;
    if (roundsCompleted >= 3 && !visible) {
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, [roundsCompleted, dismissed, showRealMoneyModal, visible]);

  useEffect(() => {
    if (dismissed) return;
    const t = setTimeout(() => { if (!dismissed) setVisible(true); }, 25000);
    return () => clearTimeout(t);
  }, [dismissed]);

  useEffect(() => {
    if (showRealMoneyModal) setVisible(false);
  }, [showRealMoneyModal]);

  const dismiss = () => { setVisible(false); setDismissed(true); };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* ── Mobile toast (below md) — sits above bottom nav ── */}
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.93 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            className="md:hidden fixed z-[60] pointer-events-auto"
            style={{
              bottom: 'calc(env(safe-area-inset-bottom, 0px) + 68px)',
              left: 10,
              right: 10,
            }}
          >
            <ToastCard dismiss={dismiss} />
          </motion.div>

          {/* ── Desktop toast (md+) — bottom-right corner ── */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.93 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 32, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            className="hidden md:block fixed z-[60] pointer-events-auto"
            style={{
              bottom: 32,
              right: 28,
              width: 360,
            }}
          >
            <ToastCard dismiss={dismiss} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function ToastCard({ dismiss }: { dismiss: () => void }) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: '#0b0f1a',
        border: '1px solid rgba(34,197,94,0.45)',
        boxShadow: '0 0 40px rgba(34,197,94,0.15), 0 12px 48px rgba(0,0,0,0.75)',
      }}
    >
      {/* Top glow line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
        style={{ background: 'linear-gradient(90deg, transparent 0%, #22c55e 40%, #4ade80 60%, transparent 100%)' }}
      />

      <div className="px-5 py-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)' }}
            >
              <TrendingUp size={20} className="text-green-400" />
            </div>
            <div className="flex items-center gap-1.5">
              <Zap size={12} className="text-yellow-400" fill="currentColor" />
              <span
                className="text-[14px] font-black uppercase tracking-wide leading-none"
                style={{ color: '#22c55e' }}
              >
                Время реальной игры!
              </span>
            </div>
          </div>

          <button
            onClick={dismiss}
            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors hover:bg-white/10"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.35)' }}
          >
            <X size={13} strokeWidth={2.5} />
          </button>
        </div>

        {/* Body */}
        <p
          className="text-[13px] leading-[1.6] mb-4"
          style={{ color: 'rgba(255,255,255,0.45)' }}
        >
          Потренировался в демо? Пора забирать настоящий кэш! Переходи в реальный режим.
        </p>

        {/* CTA */}
        <a
          href={REAL_MONEY_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={dismiss}
          className="block w-full"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3.5 rounded-xl font-black text-[13px] tracking-[0.12em] text-center uppercase"
            style={{
              background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 60%, #4ade80 100%)',
              color: '#052e16',
              boxShadow: '0 4px 20px rgba(34,197,94,0.35)',
            }}
          >
            Забрать бонус 500%
          </motion.div>
        </a>
      </div>
    </div>
  );
}
