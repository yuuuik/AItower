'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, FLOOR_MULTIPLIERS } from '@/store/gameStore';
import { REAL_MONEY_URL } from '@/lib/constants';
import { Gift, TrendingUp, Play, ChevronRight } from 'lucide-react';

export default function RealMoneyModal() {
  const showRealMoneyModal = useGameStore(s => s.showRealMoneyModal);
  const setShowRealMoneyModal = useGameStore(s => s.setShowRealMoneyModal);
  const bet = useGameStore(s => s.bet);
  const currentFloor = useGameStore(s => s.currentFloor);

  const mult = FLOOR_MULTIPLIERS[Math.max(currentFloor, 1)] ?? 1.2;
  const potential = Math.floor(bet * Math.max(mult, 1.5));

  return (
    <AnimatePresence>
      {showRealMoneyModal && (
        <>
          {/* Backdrop — no blur (expensive), just dark overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowRealMoneyModal(false)}
            className="fixed inset-0 z-50 bg-black/80"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 12 }}
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
              className="pointer-events-auto w-full max-w-sm"
            >
              {/* Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/70">
                {/* Background layers */}
                <div className="absolute inset-0" style={{ background: '#1c1c1e' }} />
                {/* Top glow blob */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-72 h-40 bg-yellow-500/8 rounded-full pointer-events-none" />
                {/* Border */}
                <div className="absolute inset-0 rounded-3xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }} />

                <div className="relative px-7 py-8 flex flex-col items-center gap-5 text-center">
                  {/* Close */}
                  <button
                    onClick={() => setShowRealMoneyModal(false)}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/12 border border-white/10 text-white/40 hover:text-white/80 flex items-center justify-center text-xs transition-all"
                  >✕</button>

                  {/* Icon — tower rush logo */}
                  <motion.div
                    animate={{ rotate: [0, -8, 8, -5, 5, 0], scale: [1, 1.12, 1] }}
                    transition={{ duration: 0.9, delay: 0.15 }}
                    className="w-20 h-20 rounded-2xl overflow-hidden"
                    style={{ boxShadow: '0 0 32px rgba(250,204,21,0.25)' }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/towerrush.png" alt="Tower Rush" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </motion.div>

                  {/* Headline */}
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-widest font-medium mb-2">5 раундов сыграно</p>
                    <h2 className="text-[22px] font-extrabold text-white leading-snug">
                      Это могли быть<br />
                      <span className="bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                        реальные деньги!
                      </span>
                    </h2>
                  </div>

                  {/* Potential amount card */}
                  <div className="w-full rounded-2xl bg-gradient-to-br from-yellow-500/12 to-orange-500/8 border border-yellow-500/25 px-5 py-4">
                    <div className="flex items-center justify-center gap-2 mb-1.5">
                      <TrendingUp size={13} className="text-yellow-500/60" />
                      <p className="text-white/40 text-xs">Ваш потенциальный выигрыш</p>
                    </div>
                    <motion.p
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3, type: 'spring' }}
                      className="text-4xl font-black text-yellow-400 tracking-tight"
                    >
                      +{potential.toLocaleString('ru-RU')} ₽
                    </motion.p>
                    <p className="text-white/25 text-xs mt-1">при ставке {bet.toLocaleString('ru-RU')} ₽ в реальной игре</p>
                  </div>

                  {/* Promo highlight */}
                  <div className="w-full rounded-2xl px-4 py-3.5 flex items-center gap-3 text-left" style={{ background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)' }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(37,99,235,0.15)' }}>
                      <Gift size={18} className="text-blue-300" />
                    </div>
                    <div>
                      <p className="text-white/40 text-xs">Промокод при регистрации на 1win</p>
                      <p className="font-mono font-bold text-base text-blue-300 tracking-widest leading-tight">MARCHTOWER</p>
                      <p className="text-green-400 text-xs font-medium mt-0.5">Бонус до 500% на первый депозит</p>
                    </div>
                  </div>

                  {/* Primary CTA */}
                  <a href={REAL_MONEY_URL} target="_blank" rel="noopener noreferrer" className="w-full block">
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full py-4 rounded-2xl font-bold text-[15px] text-center flex items-center justify-center gap-2"
                      style={{ background: 'linear-gradient(135deg, #15803d 0%, #16a34a 60%, #4ade80 100%)', color: '#052e16' }}
                    >
                      <Play size={16} fill="currentColor" />
                      Начать играть на реальные деньги
                    </motion.div>
                  </a>

                  {/* Demo continue — styled button */}
                  <motion.button
                    onClick={() => setShowRealMoneyModal(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 bg-white/4 hover:bg-white/8 transition-colors"
                  >
                    <ChevronRight size={14} className="text-white/30" />
                    <span className="text-white/45 text-[13px] font-medium hover:text-white/65 transition-colors">
                      Продолжить в демо-режиме
                    </span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
