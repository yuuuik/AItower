'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, FLOOR_MULTIPLIERS, type AIMessage } from '@/store/gameStore';
import { AI_AGENTS, getRoundStartMessages, getFloorMessage, getCrashMessage, getCashOutMessage, getPreRoundWarning } from '@/lib/aiLogic';
import { PlayCircle, SkipForward, TrendingUp, CheckCircle2, XCircle, Zap } from 'lucide-react';
import AIChat from './AIChat';

export default function RealModePanel() {
  const {
    phase, crashFloor, nextCrashFloor, currentFloor,
    selectedAgent, addAIMessage, setTyping,
    startGame, skipRound,
  } = useGameStore();

  const agentCfg = AI_AGENTS[selectedAgent];

  const prevPhase = useRef(phase);
  const prevFloor = useRef(currentFloor);
  const didFireStart = useRef(false);

  const fireMessages = (msgs: AIMessage[]) => {
    if (!msgs.length) return;
    setTyping(true);
    msgs.forEach((m, i) => {
      setTimeout(() => {
        addAIMessage(m.text, m.type);
        if (i === msgs.length - 1) setTyping(false);
      }, i * 900);
    });
  };

  useEffect(() => {
    const prev = prevPhase.current;
    prevPhase.current = phase;
    if (phase === 'playing' && prev !== 'playing') {
      didFireStart.current = false;
      const msgs = getRoundStartMessages(crashFloor, selectedAgent);
      setTimeout(() => { fireMessages(msgs); didFireStart.current = true; }, 400);
    }
    if ((phase === 'crashed' || phase === 'cashed_out') && prev === 'playing') {
      if (phase === 'crashed') {
        const crash = getCrashMessage(crashFloor, selectedAgent);
        const pre = getPreRoundWarning(nextCrashFloor, selectedAgent);
        setTimeout(() => fireMessages([...crash, ...pre]), 300);
      } else {
        const s = useGameStore.getState();
        const reward = Math.floor(s.bet * (FLOOR_MULTIPLIERS[s.currentFloor] ?? 1));
        const co = getCashOutMessage(s.currentFloor, reward, selectedAgent);
        const pre = getPreRoundWarning(nextCrashFloor, selectedAgent);
        setTimeout(() => fireMessages([co, ...pre]), 300);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  useEffect(() => {
    if (phase !== 'playing') return;
    if (currentFloor === prevFloor.current) return;
    prevFloor.current = currentFloor;
    if (!didFireStart.current) return;
    const fm = getFloorMessage(currentFloor, crashFloor, selectedAgent);
    if (fm) setTimeout(() => fireMessages([fm]), 200);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFloor]);

  const isPlaying = phase === 'playing';
  const isCrashed = phase === 'crashed';
  const isCashedOut = phase === 'cashed_out';
  const isIdle = phase === 'idle';

  const safeFloor = Math.max(crashFloor - 1, 1);
  const safeMult = FLOOR_MULTIPLIERS[safeFloor] ?? '?';
  const currentMult = FLOOR_MULTIPLIERS[currentFloor] ?? 1;

  const btnLabel = isPlaying ? 'Следующий раунд' : 'Начать раунд';
  const btnIcon = isPlaying ? <SkipForward size={16} /> : <PlayCircle size={16} />;
  const btnAction = isPlaying ? skipRound : startGame;

  return (
    <div className="flex flex-col h-full w-full min-h-0">

      {/* ── TOP: compact signal bar ── */}
      <div
        className="shrink-0 px-4 py-3 flex items-center gap-3 flex-wrap"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.2)' }}
      >
        {/* Phase status */}
        <AnimatePresence mode="wait">
          {isIdle && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <span className="text-white/40 text-xs font-semibold">Ожидание раунда</span>
            </motion.div>
          )}

          {isPlaying && (
            <motion.div key="playing" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
              className="flex items-center gap-4"
            >
              {/* Crash */}
              <div
                className="flex items-center gap-2.5 px-4 py-2 rounded-xl"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}
              >
                <XCircle size={14} className="text-red-400 shrink-0" />
                <div>
                  <p className="text-white/35 text-[9px] uppercase tracking-widest leading-none mb-0.5">Краш</p>
                  <p className="text-red-400 font-black text-xl leading-none tabular-nums">
                    этаж {crashFloor}
                    <span className="text-red-400/50 text-xs font-normal ml-1">≈×{(FLOOR_MULTIPLIERS[crashFloor] ?? 0).toFixed(1)}</span>
                  </p>
                </div>
              </div>

              {/* Arrow */}
              <div className="text-white/15 text-lg">→</div>

              {/* Safe */}
              <div
                className="flex items-center gap-2.5 px-4 py-2 rounded-xl"
                style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)' }}
              >
                <TrendingUp size={14} className="text-green-400 shrink-0" />
                <div>
                  <p className="text-white/35 text-[9px] uppercase tracking-widest leading-none mb-0.5">Безопасный выход</p>
                  <p className="text-green-400 font-black text-xl leading-none">
                    этаж {safeFloor}
                    <span className="text-green-400/60 text-sm font-bold ml-1">
                      ×{typeof safeMult === 'number' ? safeMult.toFixed(1) : safeMult}
                    </span>
                  </p>
                </div>
              </div>

              {/* Multiplier dots */}
              <div className="hidden md:flex items-center gap-1 ml-1">
                {FLOOR_MULTIPLIERS.slice(1).map((m, i) => {
                  const floor = i + 1;
                  const isCrashFloor = floor === crashFloor;
                  const isSafe = floor === safeFloor;
                  return (
                    <div
                      key={floor}
                      className="relative flex flex-col items-center gap-0.5"
                      title={`этаж ${floor} ×${m}`}
                    >
                      <div
                        className="rounded-sm transition-all"
                        style={{
                          width: 20,
                          height: 28,
                          background: isCrashFloor
                            ? 'rgba(239,68,68,0.7)'
                            : isSafe
                              ? 'rgba(34,197,94,0.6)'
                              : floor < safeFloor
                                ? 'rgba(255,255,255,0.08)'
                                : 'rgba(255,255,255,0.04)',
                          border: isCrashFloor
                            ? '1px solid rgba(239,68,68,0.9)'
                            : isSafe
                              ? '1px solid rgba(34,197,94,0.8)'
                              : '1px solid rgba(255,255,255,0.06)',
                        }}
                      />
                      <span className="text-[8px] tabular-nums" style={{ color: isCrashFloor ? '#f87171' : isSafe ? '#4ade80' : 'rgba(255,255,255,0.2)' }}>
                        ×{m % 1 === 0 ? m : m.toFixed(1)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {isCrashed && (
            <motion.div key="crashed" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2.5 px-4 py-2 rounded-xl"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
            >
              <XCircle size={15} className="text-red-400" />
              <span className="text-red-400 font-bold text-sm">Краш на {crashFloor} этаже</span>
              <span className="text-white/25 text-xs">— нажмите «Начать раунд» для следующего сигнала</span>
            </motion.div>
          )}

          {isCashedOut && (
            <motion.div key="cashedout" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2.5 px-4 py-2 rounded-xl"
              style={{ background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.2)' }}
            >
              <CheckCircle2 size={15} className="text-green-400" />
              <span className="text-green-400 font-bold text-sm">Забрали на {currentFloor} этаже · ×{currentMult.toFixed(1)}</span>
              <span className="text-white/25 text-xs">— нажмите «Начать раунд» для следующего</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Action button — always visible in bar */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={btnAction}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-[13px] shrink-0"
          style={isPlaying
            ? { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }
            : { background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)', color: '#fff', boxShadow: '0 4px 16px rgba(37,99,235,0.35)' }
          }
        >
          {btnIcon}
          {btnLabel}
        </motion.button>

        {/* Agent indicator */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg shrink-0"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <Zap size={11} style={{ color: agentCfg.color }} />
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>
            {agentCfg.name}
          </span>
        </div>
      </div>

      {/* ── BOTTOM: AI chat fills all remaining space ── */}
      <div className="flex-1 min-h-0">
        <AIChat />
      </div>
    </div>
  );
}
