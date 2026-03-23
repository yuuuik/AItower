'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { Coins, Zap, Target, RotateCcw, AlertTriangle } from 'lucide-react';
import { Sounds } from '@/lib/sounds';
import { useState } from 'react';

export default function BalancePanel() {
  const { balance, bet, setBet, resetDemo, attempts, maxAttempts, phase } = useGameStore();
  const [inputVal, setInputVal] = useState(String(bet));
  const [betFocused, setBetFocused] = useState(false);

  const commitBet = (raw: string) => {
    const v = parseInt(raw.replace(/\D/g, ''), 10);
    const clamped = isNaN(v) || v < 1 ? 1 : v;
    setBet(clamped);
    setInputVal(String(clamped));
  };

  const isPlaying = phase === 'playing';
  const lowAttempts = attempts <= 2;

  return (
    <div className="flex items-center gap-2 w-full">

      {/* ── Balance pill ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={balance}
          initial={{ y: -6, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center gap-2.5 rounded-2xl px-4 h-10 border shrink-0"
          style={{
            background: 'linear-gradient(135deg, rgba(234,179,8,0.13) 0%, rgba(234,179,8,0.05) 100%)',
            borderColor: 'rgba(234,179,8,0.28)',
            boxShadow: '0 0 18px rgba(234,179,8,0.07)',
          }}
        >
          <div className="w-6 h-6 rounded-lg bg-yellow-500/20 flex items-center justify-center shrink-0">
            <Coins size={13} className="text-yellow-400" strokeWidth={2} />
          </div>
          <div>
            <p className="text-yellow-400/50 text-[9px] uppercase tracking-widest leading-none font-semibold">Баланс</p>
            <p className="text-white font-black text-sm leading-tight tabular-nums">
              {balance.toLocaleString('ru-RU')}
              <span className="text-yellow-400/60 text-xs ml-0.5">₽</span>
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── Bet pill ── */}
      <div
        className="flex items-center gap-2.5 rounded-2xl px-4 h-10 border cursor-text transition-all duration-200 shrink-0"
        style={{
          background: betFocused
            ? 'linear-gradient(135deg, rgba(37,99,235,0.18) 0%, rgba(37,99,235,0.07) 100%)'
            : 'linear-gradient(135deg, rgba(37,99,235,0.09) 0%, rgba(37,99,235,0.03) 100%)',
          borderColor: betFocused ? 'rgba(37,99,235,0.55)' : 'rgba(37,99,235,0.22)',
          boxShadow: betFocused ? '0 0 18px rgba(37,99,235,0.14)' : 'none',
        }}
      >
        <div className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
          <Zap size={12} className="text-blue-400" strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-blue-400/50 text-[9px] uppercase tracking-widest leading-none font-semibold">Ставка</p>
          <div className="flex items-center gap-0.5">
            <input
              type="text"
              inputMode="numeric"
              value={inputVal}
              disabled={isPlaying}
              onChange={e => setInputVal(e.target.value.replace(/\D/g, ''))}
              onFocus={() => setBetFocused(true)}
              onBlur={e => { setBetFocused(false); commitBet(e.target.value); }}
              onKeyDown={e => e.key === 'Enter' && commitBet(inputVal)}
              className={`w-16 bg-transparent font-black text-sm text-white outline-none tabular-nums leading-tight
                ${isPlaying ? 'opacity-40 cursor-not-allowed' : 'cursor-text'}`}
            />
            <span className="text-blue-400/60 text-xs font-bold">₽</span>
          </div>
        </div>
      </div>

      {/* ── Attempts pill ── */}
      <div
        className="flex items-center gap-2.5 rounded-2xl px-4 h-10 border shrink-0 transition-all duration-300"
        style={{
          background: lowAttempts
            ? 'linear-gradient(135deg, rgba(239,68,68,0.12) 0%, rgba(239,68,68,0.05) 100%)'
            : 'linear-gradient(135deg, rgba(34,197,94,0.09) 0%, rgba(34,197,94,0.03) 100%)',
          borderColor: lowAttempts ? 'rgba(239,68,68,0.35)' : 'rgba(34,197,94,0.22)',
        }}
      >
        <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
          lowAttempts ? 'bg-red-500/20' : 'bg-green-500/20'
        }`}>
          {lowAttempts
            ? <AlertTriangle size={12} className="text-red-400" strokeWidth={2.5} />
            : <Target size={12} className="text-green-400" strokeWidth={2.5} />
          }
        </div>
        <div>
          <p className="text-white/30 text-[9px] uppercase tracking-widest leading-none font-semibold">Попытки</p>
          <div className="flex items-center gap-1.5">
            <p className="font-black text-sm leading-tight tabular-nums">
              <span className={lowAttempts ? 'text-red-400' : 'text-white'}>{attempts}</span>
              <span className="text-white/20 text-xs">/{maxAttempts}</span>
            </p>
            <div className="flex gap-0.5 items-center">
              {Array.from({ length: maxAttempts }).map((_, i) => (
                <div
                  key={i}
                  className={`rounded-full transition-all duration-300 ${
                    i < attempts
                      ? lowAttempts
                        ? 'bg-red-400 w-1 h-2'
                        : 'bg-green-400 w-1 h-2'
                      : 'bg-white/10 w-0.5 h-1.5'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* ── Reset button ── */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => { Sounds.click(); resetDemo(); setInputVal('100'); setBet(100); }}
        className="h-10 px-3.5 rounded-2xl flex items-center gap-1.5 border border-white/8 bg-white/[0.04] hover:bg-white/[0.08] text-white/35 hover:text-white/70 text-xs font-medium transition-all"
        title="Сбросить демо"
      >
        <RotateCcw size={12} strokeWidth={2.5} />
        <span>Сброс</span>
      </motion.button>

    </div>
  );
}
