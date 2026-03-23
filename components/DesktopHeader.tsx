'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { Minus, Plus } from 'lucide-react';
import { REAL_MONEY_URL } from '@/lib/constants';

export default function DesktopHeader() {
  const { balance, bet, setBet, attempts, maxAttempts, phase, isRealMode, realUserId } = useGameStore();
  const [inputVal, setInputVal] = useState(String(bet));
  const [betFocused, setBetFocused] = useState(false);

  const isPlaying = phase === 'playing';
  const lowAttempts = attempts <= 2;
  const step = bet < 100 ? 10 : bet < 1000 ? 50 : 100;

  const commitBet = (raw: string) => {
    const v = parseInt(raw.replace(/\D/g, ''), 10);
    const clamped = isNaN(v) || v < 1 ? 1 : v;
    setBet(clamped);
    setInputVal(String(clamped));
  };

  const adjustBet = (delta: number) => {
    if (isPlaying) return;
    const next = Math.max(1, Math.min(100000, bet + delta));
    setBet(next);
    setInputVal(String(next));
  };

  return (
    <header
      className="hidden md:flex items-center px-8 shrink-0 select-none"
      style={{
        height: 68,
        background: '#1c1c1e',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 4px 32px rgba(0,0,0,0.35)',
      }}
    >

      {/* ═══ LEFT ═══ */}
      <div className="flex items-center gap-5">

        {/* Mode badge */}
        {isRealMode ? (
          <div className="flex flex-col gap-0.5 shrink-0">
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" style={{ boxShadow: '0 0 5px rgba(239,68,68,0.8)' }} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: '#f87171' }}>REAL</span>
            </div>
            <p className="text-white/20 text-[9px] font-mono text-center">ID {realUserId}</p>
          </div>
        ) : (
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg shrink-0"
            style={{ background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.15)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shrink-0" style={{ boxShadow: '0 0 5px rgba(34,197,94,0.7)' }} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: 'rgba(74,222,128,0.85)' }}>ДЕМО</span>
          </div>
        )}

        {/* Balance + Bet — hidden in real mode */}
        {!isRealMode && (
          <>
            <div className="h-7 w-px shrink-0" style={{ background: 'rgba(255,255,255,0.06)' }} />

            {/* Balance */}
            <div className="flex flex-col gap-1 shrink-0">
              <span className="text-[9px] uppercase tracking-[0.18em] font-semibold leading-none" style={{ color: '#4a4d60' }}>
                Баланс
              </span>
              <AnimatePresence mode="wait">
                <motion.div
                  key={balance}
                  initial={{ y: -6, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-baseline gap-1 leading-none"
                >
                  <span className="text-[19px] font-black tabular-nums" style={{ color: '#ffffff', letterSpacing: '-0.01em' }}>
                    {balance.toLocaleString('ru-RU')}
                  </span>
                  <span className="text-[12px] font-bold" style={{ color: '#c9973a' }}>₽</span>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="h-7 w-px shrink-0" style={{ background: 'rgba(255,255,255,0.06)' }} />

            {/* Bet control */}
            <div className="flex flex-col gap-1 shrink-0">
              <span className="text-[9px] uppercase tracking-[0.18em] font-semibold leading-none" style={{ color: '#4a4d60' }}>
                Ставка
              </span>
              <div className="flex items-center gap-2 leading-none">
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => adjustBet(-step)}
                  disabled={isPlaying}
                  className="flex items-center justify-center rounded-lg transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
                  style={{ width: 22, height: 22, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <Minus size={11} strokeWidth={2.5} style={{ color: 'rgba(255,255,255,0.5)' }} />
                </motion.button>

                <div
                  className="flex items-baseline gap-1 cursor-text"
                  onClick={() => !isPlaying && document.getElementById('bet-input-desktop')?.focus()}
                >
                  <motion.div
                    animate={betFocused ? { boxShadow: '0 0 0 2px rgba(37,99,235,0.3)' } : { boxShadow: '0 0 0 0px rgba(37,99,235,0)' }}
                    className="rounded-md"
                  >
                    <input
                      id="bet-input-desktop"
                      type="text"
                      inputMode="numeric"
                      value={betFocused ? inputVal : bet.toLocaleString('ru-RU')}
                      disabled={isPlaying}
                      onChange={e => setInputVal(e.target.value.replace(/\D/g, ''))}
                      onFocus={() => { setBetFocused(true); setInputVal(String(bet)); }}
                      onBlur={e => { setBetFocused(false); commitBet(e.target.value); }}
                      onKeyDown={e => e.key === 'Enter' && commitBet(inputVal)}
                      className="text-[19px] font-black tabular-nums bg-transparent outline-none text-center disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ color: '#ffffff', width: 72, letterSpacing: '-0.01em' }}
                    />
                  </motion.div>
                  <span className="text-[12px] font-bold" style={{ color: '#3b82f6' }}>₽</span>
                </div>

                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => adjustBet(step)}
                  disabled={isPlaying}
                  className="flex items-center justify-center rounded-lg transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
                  style={{ width: 22, height: 22, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <Plus size={11} strokeWidth={2.5} style={{ color: 'rgba(255,255,255,0.5)' }} />
                </motion.button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Spacer ── */}
      <div className="flex-1" />

      {/* ═══ RIGHT ═══ */}
      <div className="flex items-center gap-5">

        {/* Attempts (hidden in real mode) */}
        {!isRealMode && (
          <>
            <div className="flex flex-col gap-1 shrink-0">
              <span
                className="text-[9px] uppercase tracking-[0.18em] font-semibold leading-none"
                style={{ color: lowAttempts ? 'rgba(239,68,68,0.7)' : '#4a4d60' }}
              >
                Попытки
              </span>
              <div className="flex items-center gap-2.5 leading-none">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={attempts}
                    initial={{ y: -4, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="text-[19px] font-black tabular-nums"
                    style={{ color: lowAttempts ? '#ef4444' : '#ffffff', letterSpacing: '-0.01em' }}
                  >
                    {attempts}
                    <span className="text-[11px] font-normal" style={{ color: 'rgba(255,255,255,0.2)' }}>
                      /{maxAttempts}
                    </span>
                  </motion.span>
                </AnimatePresence>

                <div className="flex items-end gap-[3px]">
                  {Array.from({ length: maxAttempts }).map((_, i) => {
                    const active = i < attempts;
                    return (
                      <motion.div
                        key={i}
                        animate={{ height: active ? 14 : 8, opacity: active ? 1 : 0.18 }}
                        transition={{ duration: 0.3, delay: i * 0.02 }}
                        className="rounded-full"
                        style={{
                          width: 4,
                          background: active
                            ? lowAttempts
                              ? 'linear-gradient(180deg, #ff6b6b, #ef4444)'
                              : 'linear-gradient(180deg, #4ade80, #22c55e)'
                            : 'rgba(255,255,255,0.12)',
                          boxShadow: active
                            ? lowAttempts
                              ? '0 0 5px rgba(239,68,68,0.5)'
                              : '0 0 5px rgba(34,197,94,0.5)'
                            : 'none',
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="h-7 w-px shrink-0" style={{ background: 'rgba(255,255,255,0.06)' }} />
          </>
        )}

        {/* Play */}
        <a href={REAL_MONEY_URL} target="_blank" rel="noopener noreferrer">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="relative flex items-center px-6 rounded-xl font-black text-[12px] uppercase tracking-[0.12em] overflow-hidden shrink-0"
            style={{
              height: 40,
              background: 'linear-gradient(135deg, #00e87a 0%, #00ba62 100%)',
              color: '#00200e',
              boxShadow: '0 4px 20px rgba(0,200,100,0.22), 0 0 0 1px rgba(0,232,122,0.15)',
            }}
          >
            <span className="relative z-10 whitespace-nowrap">Играть на 1WIN</span>
            <motion.div
              animate={{ x: ['-120%', '220%'] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'linear', repeatDelay: 1.8 }}
              className="absolute inset-y-0 w-1/3 pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)',
                transform: 'skewX(-12deg)',
              }}
            />
          </motion.button>
        </a>
      </div>

    </header>
  );
}
