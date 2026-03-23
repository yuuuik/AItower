'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, AIMessage, AIAgent, FLOOR_MULTIPLIERS } from '@/store/gameStore';
import { AI_AGENTS } from '@/lib/aiLogic';
import { AlertTriangle, Info, CheckCircle, Zap } from 'lucide-react';

/* ── Agent avatar images ── */
const AGENT_IMG: Record<AIAgent, string> = {
  chatgpt:  '/chatgpt.png',
  deepseek: '/deepseek.png',
  gemini:   '/gemini.png',
  claude:   '/claude.png',
};

const AGENT_BG: Record<AIAgent, string> = {
  chatgpt:  '#10a37f',
  deepseek: '#1448c8',
  gemini:   '#4285f4',
  claude:   '#d97757',
};

function AgentAvatar({ agent, size = 32 }: { agent: AIAgent; size?: number }) {
  const r = Math.round(size * 0.28);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: r,
        background: AGENT_BG[agent],
        overflow: 'hidden',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={AGENT_IMG[agent]}
        alt={agent}
        width={size}
        height={size}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    </div>
  );
}

function MsgIcon({ type }: { type: AIMessage['type'] }) {
  const s = { size: 12, className: 'shrink-0 mt-0.5' };
  if (type === 'danger') return <AlertTriangle {...s} className="shrink-0 mt-0.5 text-red-400" />;
  if (type === 'warning') return <Zap {...s} className="shrink-0 mt-0.5 text-yellow-400" />;
  if (type === 'success') return <CheckCircle {...s} className="shrink-0 mt-0.5 text-green-400" />;
  return <Info {...s} className="shrink-0 mt-0.5 text-blue-400" />;
}

const bg = (t: AIMessage['type']) =>
  t === 'danger' ? 'bg-red-500/10 border-red-500/25' :
  t === 'warning' ? 'bg-yellow-500/10 border-yellow-500/25' :
  t === 'success' ? 'bg-green-500/10 border-green-500/25' :
  'bg-white/5 border-white/10';

const tc = (t: AIMessage['type']) =>
  t === 'danger' ? 'text-red-300' : t === 'warning' ? 'text-yellow-300' :
  t === 'success' ? 'text-green-300' : 'text-white/70';

const AGENTS: AIAgent[] = ['chatgpt', 'deepseek', 'gemini', 'claude'];

export default function AIChat() {
  const { aiMessages, isTyping, phase, currentFloor, crashFloor, selectedAgent, setSelectedAgent } = useGameStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const cfg = AI_AGENTS[selectedAgent];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [aiMessages, isTyping]);

  const floorsToGo = phase === 'playing' ? crashFloor - currentFloor : null;

  return (
    <div className="flex flex-col h-full" style={{ background: '#141415' }}>

      {/* ── Agent selector ── */}
      <div className="shrink-0 px-3 pt-3 pb-2 border-b border-white/5">
        <p className="text-white/25 text-[9px] uppercase tracking-widest mb-2 px-1">Выбрать AI аналитика</p>
        <div className="grid grid-cols-4 gap-1.5">
          {AGENTS.map(agent => {
            const a = AI_AGENTS[agent];
            const isActive = selectedAgent === agent;
            return (
              <motion.button
                key={agent}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedAgent(agent)}
                className="flex flex-col items-center gap-1.5 py-2 px-1 rounded-xl border transition-all duration-200"
                style={isActive
                  ? { background: '#1c1c1e', border: '1px solid rgba(255,255,255,0.08)', boxShadow: `0 0 16px ${a.color}30` }
                  : { background: '#1c1c1e', border: '1px solid rgba(255,255,255,0.08)' }
                }
              >
                <div className={`relative rounded-xl overflow-hidden transition-all ${isActive ? 'ring-2 ' + a.ringColor : ''}`}>
                  <AgentAvatar agent={agent} size={32} />
                  {isActive && (
                    <span
                      className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
                      style={{ background: a.color, borderColor: '#141415' }}
                    />
                  )}
                </div>
                <span className={`text-[9px] font-bold leading-none transition-colors ${isActive ? a.textColor : 'text-white/35'}`}>
                  {a.name}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ── Active agent header ── */}
      <div className="flex items-center gap-2.5 px-3 py-2.5 border-b border-white/5 shrink-0">
        <div className="relative">
          <AgentAvatar agent={selectedAgent} size={30} />
          <span
            className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 shadow-sm"
            style={{ borderColor: '#141415', background: cfg.color, boxShadow: `0 0 6px ${cfg.color}80` }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-[13px] leading-none">{cfg.name} <span className="text-white/30 font-normal text-[10px]">{cfg.fullName}</span></p>
          <p className="text-white/30 text-[9px] mt-0.5">AI Аналитик · Демо-режим</p>
        </div>
        <div
          className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border"
          style={{ color: cfg.color, borderColor: cfg.color + '40', background: cfg.color + '15' }}
        >
          онлайн
        </div>
      </div>

      {/* ── Live round info during play ── */}
      <AnimatePresence>
        {phase === 'playing' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mx-3 mt-3 shrink-0 overflow-hidden"
          >
            <div className="rounded-xl border p-3 space-y-2 bg-gradient-to-br from-red-500/8 to-transparent border-red-500/20">
              <p className="text-white/30 text-[9px] uppercase tracking-widest">Текущий раунд</p>
              <div className="flex gap-2">
                <div className="flex-1 text-center">
                  <p className="text-[9px] text-white/30">Краш</p>
                  <p className="text-red-400 font-bold text-sm">Этаж {crashFloor}</p>
                </div>
                <div className="flex-1 text-center">
                  <p className="text-[9px] text-white/30">Этаж</p>
                  <p className="text-white font-bold text-sm">{currentFloor}</p>
                </div>
                <div className="flex-1 text-center">
                  <p className="text-[9px] text-white/30">До краша</p>
                  <p className={`font-bold text-sm ${
                    floorsToGo === 1 ? 'text-red-400 animate-pulse' :
                    floorsToGo === 2 ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {floorsToGo} эт.
                  </p>
                </div>
              </div>

              {/* Multiplier ladder */}
              <div className="flex gap-1 flex-wrap mt-1">
                {FLOOR_MULTIPLIERS.slice(1, crashFloor + 1).map((m, i) => {
                  const floor = i + 1;
                  const isCrash = floor === crashFloor;
                  const isPast = floor <= currentFloor;
                  const isCurrent = floor === currentFloor;
                  return (
                    <div
                      key={floor}
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold transition-all ${
                        isCrash
                          ? 'bg-red-500/30 text-red-300 border border-red-500/40'
                          : isCurrent
                          ? 'bg-blue-500/30 text-blue-200 border border-blue-500/40'
                          : isPast
                          ? 'bg-white/10 text-white/40'
                          : 'bg-white/5 text-white/20'
                      }`}
                    >
                      {isCrash ? '💥' : `×${m.toFixed(1)}`}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Messages ── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}
      >
        {aiMessages.length === 0 && !isTyping && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-full gap-3 text-center"
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden"
              style={{ background: cfg.color + '20', border: `1px solid ${cfg.color}30` }}
            >
              <AgentAvatar agent={selectedAgent} size={40} />
            </div>
            <div>
              <p className="text-white/30 text-sm">Жду начала раунда</p>
              <p className="text-white/20 text-xs mt-1">Перед каждым раундом<br />сообщу этаж краша</p>
            </div>
          </motion.div>
        )}

        <AnimatePresence initial={false}>
          {aiMessages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 280, damping: 24 }}
              className={`flex gap-2 items-start rounded-xl px-3 py-2.5 border text-xs leading-snug ${bg(msg.type)}`}
            >
              <MsgIcon type={msg.type} />
              <span className={tc(msg.type)}>{msg.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border w-fit"
              style={{ background: cfg.color + '10', borderColor: cfg.color + '30' }}
            >
              {[0, 1, 2].map(i => (
                <motion.span
                  key={i}
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }}
                  className="w-1.5 h-1.5 rounded-full block"
                  style={{ background: cfg.color }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
