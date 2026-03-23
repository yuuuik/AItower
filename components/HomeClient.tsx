'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import DesktopHeader from '@/components/DesktopHeader';
import Modal from '@/components/Modal';
import RealMoneyModal from '@/components/RealMoneyModal';
import PromoToast from '@/components/PromoToast';
import { REAL_MONEY_URL } from '@/lib/constants';
import { Bot, X, Minus, Plus, Zap } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { AI_AGENTS } from '@/lib/aiLogic';
import { Sounds } from '@/lib/sounds';

const GameCanvas = dynamic(() => import('@/components/GameCanvas'), { ssr: false });
const AIChat = dynamic(() => import('@/components/AIChat'), { ssr: false });
const RealModePanel = dynamic(() => import('@/components/RealModePanel'), { ssr: false });

/** Compact bet + attempts bar — mobile only, hidden in real mode */
function MobileBetBar() {
  const { bet, setBet, attempts, maxAttempts, phase, isRealMode } = useGameStore();
  const [val, setVal] = useState(String(bet));
  const [focused, setFocused] = useState(false);
  const isPlaying = phase === 'playing';
  const lowAttempts = attempts <= 2;
  const step = bet < 100 ? 10 : bet < 1000 ? 50 : 100;

  if (isRealMode) return null;

  const commit = (raw: string) => {
    const v = parseInt(raw.replace(/\D/g, ''), 10);
    const c = isNaN(v) || v < 1 ? 1 : v;
    setBet(c); setVal(String(c));
  };
  const adjust = (d: number) => {
    if (isPlaying) return;
    const next = Math.max(1, Math.min(100000, bet + d));
    setBet(next); setVal(String(next)); Sounds.click();
  };

  return (
    <div
      className="md:hidden flex items-center px-3 gap-3 shrink-0"
      style={{
        height: 42,
        background: 'rgba(255,255,255,0.02)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <span className="text-[9px] uppercase tracking-[0.18em] font-semibold shrink-0" style={{ color: '#4a4d60' }}>
        Ставка
      </span>

      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={() => adjust(-step)}
        disabled={isPlaying}
        className="flex items-center justify-center rounded-lg shrink-0 disabled:opacity-30"
        style={{ width: 24, height: 24, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <Minus size={11} strokeWidth={2.5} style={{ color: 'rgba(255,255,255,0.5)' }} />
      </motion.button>

      <div className="flex items-baseline gap-0.5">
        <input
          type="text" inputMode="numeric"
          value={focused ? val : bet.toLocaleString('ru-RU')}
          disabled={isPlaying}
          onChange={e => setVal(e.target.value.replace(/\D/g, ''))}
          onFocus={() => { setFocused(true); setVal(String(bet)); }}
          onBlur={e => { setFocused(false); commit(e.target.value); }}
          onKeyDown={e => e.key === 'Enter' && commit(val)}
          className="text-[15px] font-black tabular-nums bg-transparent outline-none text-center disabled:opacity-40"
          style={{ color: '#fff', width: 64, letterSpacing: '-0.01em' }}
        />
        <span className="text-[11px] font-bold" style={{ color: '#3b82f6' }}>₽</span>
      </div>

      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={() => adjust(step)}
        disabled={isPlaying}
        className="flex items-center justify-center rounded-lg shrink-0 disabled:opacity-30"
        style={{ width: 24, height: 24, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <Plus size={11} strokeWidth={2.5} style={{ color: 'rgba(255,255,255,0.5)' }} />
      </motion.button>

      <div className="h-4 w-px mx-1 shrink-0" style={{ background: 'rgba(255,255,255,0.07)' }} />

      <span className="text-[9px] uppercase tracking-[0.18em] font-semibold shrink-0" style={{ color: lowAttempts ? 'rgba(239,68,68,0.7)' : '#4a4d60' }}>
        Попытки
      </span>
      <span className="text-[15px] font-black tabular-nums shrink-0" style={{ color: lowAttempts ? '#ef4444' : '#fff', letterSpacing: '-0.01em' }}>
        {attempts}<span className="text-[10px] font-normal" style={{ color: 'rgba(255,255,255,0.2)' }}>/{maxAttempts}</span>
      </span>
      <div className="flex items-end gap-[2px]">
        {Array.from({ length: maxAttempts }).map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all"
            style={{
              width: 3,
              height: i < attempts ? 12 : 6,
              background: i < attempts ? (lowAttempts ? '#ef4444' : '#22c55e') : 'rgba(255,255,255,0.1)',
              opacity: i < attempts ? 1 : 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function HomeClient() {
  const [showMobileAI, setShowMobileAI] = useState(false);
  const { balance, bet, selectedAgent, isRealMode, setShowLimitModal } = useGameStore();
  const agentCfg = AI_AGENTS[selectedAgent];

  return (
    <div className="flex h-[100dvh] w-screen overflow-hidden" style={{ background: '#141415' }}>

      {/* ── Sidebar (desktop only) ── */}
      <div className="hidden md:flex w-[240px] shrink-0 h-full">
        <Sidebar />
      </div>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col min-w-0 h-full">

        {/* Desktop header */}
        <DesktopHeader />

        {/* Mobile header */}
        <header className="shrink-0 md:hidden" style={{ background: '#1c1c1e', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center px-3 gap-2" style={{ height: 54 }}>

            {/* Logo + mode badge */}
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/towerrush.png" alt="Tower Rush" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
              {isRealMode ? (
                <div className="flex items-center gap-1 px-2 py-1 rounded-full shrink-0" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" style={{ boxShadow: '0 0 4px rgba(239,68,68,0.8)' }} />
                  <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#f87171' }}>REAL</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 px-2 py-1 rounded-full shrink-0" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.18)' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" style={{ boxShadow: '0 0 4px rgba(34,197,94,0.7)' }} />
                  <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'rgba(74,222,128,0.85)' }}>ДЕМО</span>
                </div>
              )}
            </div>

            {/* Balance (hidden in real mode) */}
            {!isRealMode && (
              <div className="flex items-baseline gap-1 shrink-0">
                <span className="text-white font-black text-[15px] tabular-nums" style={{ letterSpacing: '-0.01em' }}>
                  {balance.toLocaleString('ru-RU')}
                </span>
                <span className="text-[11px] font-bold" style={{ color: '#c9973a' }}>₽</span>
              </div>
            )}

            <div className="flex-1" />

            {/* Connect REAL button (demo mode only) */}
            {!isRealMode && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowLimitModal(true)}
                className="flex items-center gap-1 px-2.5 rounded-xl shrink-0 font-black text-[10px] uppercase tracking-wider overflow-hidden relative"
                style={{
                  height: 36,
                  background: 'linear-gradient(135deg, #15803d 0%, #16a34a 60%, #4ade80 100%)',
                  color: '#052e16',
                  boxShadow: '0 2px 10px rgba(34,197,94,0.3)',
                }}
              >
                <Zap size={12} fill="currentColor" />
                REAL
              </motion.button>
            )}

            {/* AI toggle (hidden in real mode — AI is always visible) */}
            {!isRealMode && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowMobileAI(true)}
                className="relative flex items-center gap-1.5 px-3 rounded-xl shrink-0"
                style={{
                  height: 36,
                  background: agentCfg.color + '18',
                  border: `1px solid ${agentCfg.color}40`,
                  color: agentCfg.color,
                }}
              >
                <Bot size={14} />
                <span className="text-[11px] font-bold">AI</span>
                <span
                  className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
                  style={{ background: agentCfg.color, boxShadow: `0 0 4px ${agentCfg.color}` }}
                />
              </motion.button>
            )}

            {/* CTA — 1WIN */}
            <a href={REAL_MONEY_URL} target="_blank" rel="noopener noreferrer" className="shrink-0">
              <motion.div
                whileTap={{ scale: 0.95 }}
                className="relative flex items-center px-3.5 rounded-xl font-black text-[11px] tracking-wider overflow-hidden whitespace-nowrap"
                style={{
                  height: 36,
                  background: 'linear-gradient(135deg, #00e87a 0%, #00ba62 100%)',
                  color: '#00200e',
                  boxShadow: '0 2px 12px rgba(0,200,100,0.3)',
                }}
              >
                ИГРАТЬ НА 1WIN
              </motion.div>
            </a>
          </div>
        </header>

        {/* Mobile bet bar (demo only) */}
        <MobileBetBar />

        {/* ── Content area ── */}
        <div className="flex-1 min-h-0">
          {isRealMode ? (
            /* Real mode: signal panel + AI side by side */
            <RealModePanel />
          ) : (
            /* Demo mode: game canvas + AI */
            <div className="flex h-full min-h-0">
              <div className="flex-1 flex items-center justify-center p-2 md:p-4 min-w-0 relative overflow-hidden pb-[60px] md:pb-0">
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-green-500/3 rounded-full blur-3xl" />
                </div>
                <GameCanvas />
              </div>

              {/* AI panel (desktop inline) */}
              <div className="hidden md:flex w-[280px] shrink-0 h-full" style={{ borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
                <AIChat />
              </div>
            </div>
          )}
        </div>

        {/* Mobile bottom nav */}
        <div className="md:hidden shrink-0">
          <MobileNav />
        </div>
      </div>

      {/* Mobile AI overlay (demo mode only) */}
      <AnimatePresence>
        {showMobileAI && !isRealMode && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileAI(false)}
              className="md:hidden fixed inset-0 bg-black/70 z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 32, stiffness: 320 }}
              className="md:hidden fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl overflow-hidden"
              style={{
                height: '85dvh',
                background: '#1c1c1e',
                border: '1px solid rgba(255,255,255,0.08)',
                borderBottom: 'none',
                boxShadow: '0 -20px 60px rgba(0,0,0,0.6)',
              }}
            >
              <div className="flex justify-center pt-3 pb-1 shrink-0">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowMobileAI(false)}
                className="absolute top-3 right-4 w-8 h-8 rounded-full bg-white/8 border border-white/10 flex items-center justify-center"
              >
                <X size={14} className="text-white/50" />
              </motion.button>
              <div className="h-full overflow-hidden">
                <AIChat />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Modal />
      {!isRealMode && <RealMoneyModal />}
      {!isRealMode && <PromoToast />}

      {/* Visually hidden H1 for SEO */}
      <h1 className="sr-only">Tower Rush — демо краш-игра с AI Аналитиком, который предсказывает этаж краша</h1>
    </div>
  );
}
