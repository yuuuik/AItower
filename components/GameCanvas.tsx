'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useGameStore, GAME_WIDTH, FLOOR_H, BUILDING_W, MOVE_SPEED,
  FLOOR_MULTIPLIERS, MAX_FLOORS, type AIMessage,
} from '@/store/gameStore';
import { Sounds } from '@/lib/sounds';
import { Layers, BadgeDollarSign, Zap, Loader2 } from 'lucide-react';
import {
  getRoundStartMessages, getFloorMessage,
  getCashOutMessage, getCrashMessage, getPreRoundWarning,
} from '@/lib/aiLogic';


const CANVAS_H = 470;
const CANVAS_BASE_Y = CANVAS_H - 24; // ground level

// Floor colors (warm → cool → special)
const FLOOR_COLORS = [
  '#f97316', '#eab308', '#22c55e', '#06b6d4',
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444',
  '#f59e0b', '#10b981',
];

function drawFloor(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  w: number, h: number,
  floorNum: number,
  isTopFloor: boolean,
  isGround: boolean,
) {
  const col = FLOOR_COLORS[(floorNum - 1) % FLOOR_COLORS.length];

  // Main body — no shadows (performance)
  ctx.fillStyle = col + 'cc';
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 4);
  ctx.fill();

  // Bright top edge (replaces shadow with cheap highlight)
  ctx.fillStyle = col + 'ff';
  ctx.fillRect(x + 4, y + 1, w - 8, 2);

  // Body outline
  ctx.strokeStyle = col;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Windows — simple, no shadow
  const winW = Math.max(w * 0.13, 8), winH = Math.max(h * 0.28, 10);
  const winY = y + h * 0.15;
  ctx.fillStyle = 'rgba(255,255,200,0.75)';
  for (const px of [0.25, 0.5, 0.75]) {
    ctx.fillRect(x + w * px - winW / 2, winY, winW, winH);
  }

  // Floor number label
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.font = `bold ${Math.round(h * 0.24)}px sans-serif`;
  ctx.textAlign = 'right';
  ctx.fillText(`${floorNum}`, x + w - 5, y + h - 5);
  ctx.textAlign = 'left';

  // Door on ground floor
  if (isGround) {
    const dw = w * 0.2, dh = h * 0.44;
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.beginPath();
    ctx.roundRect(x + w / 2 - dw / 2, y + h - dh, dw, dh, [3, 3, 0, 0]);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,215,0,0.8)';
    ctx.beginPath();
    ctx.arc(x + w / 2 + dw * 0.2, y + h - dh / 2, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Roof on top floor — no shadow
  if (isTopFloor) {
    ctx.fillStyle = col + 'dd';
    ctx.beginPath();
    ctx.moveTo(x - 2, y);
    ctx.lineTo(x + w / 2, y - 14);
    ctx.lineTo(x + w + 2, y);
    ctx.closePath();
    ctx.fill();
    // Chimney
    ctx.fillStyle = col + 'aa';
    ctx.fillRect(x + w * 0.68, y - 20, 7, 12);
    ctx.fillRect(x + w * 0.68 - 2, y - 22, 11, 4);
  }
}

function drawMovingBlock(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  w: number, h: number,
  isSnapping: boolean,
  currentFloor: number,
) {
  const nextFloor = currentFloor + 1;
  const col = FLOOR_COLORS[(nextFloor - 1) % FLOOR_COLORS.length];
  const alpha = isSnapping ? 0.45 : 0.92;

  // Body — no shadow
  ctx.fillStyle = col + Math.round(alpha * 255).toString(16).padStart(2, '0');
  ctx.strokeStyle = col;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 4);
  ctx.fill();
  ctx.stroke();

  // Bright top edge highlight
  ctx.fillStyle = col + 'ee';
  ctx.fillRect(x + 4, y + 1, w - 8, 2);

  // Windows
  const winW = Math.max(w * 0.13, 8), winH = Math.max(h * 0.28, 10);
  ctx.fillStyle = `rgba(255,255,200,${alpha * 0.75})`;
  for (const px of [0.25, 0.5, 0.75]) {
    ctx.fillRect(x + w * px - winW / 2, y + h * 0.15, winW, winH);
  }

  // Next floor label
  ctx.fillStyle = `rgba(255,255,255,${alpha * 0.6})`;
  ctx.font = `bold ${Math.round(h * 0.24)}px sans-serif`;
  ctx.textAlign = 'right';
  ctx.fillText(`${nextFloor}`, x + w - 5, y + h - 5);
  ctx.textAlign = 'left';
}

function drawGround(ctx: CanvasRenderingContext2D) {
  const grad = ctx.createLinearGradient(0, CANVAS_BASE_Y, 0, CANVAS_H);
  grad.addColorStop(0, 'rgba(37,99,235,0.4)');
  grad.addColorStop(1, 'rgba(37,99,235,0.05)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, CANVAS_BASE_Y, GAME_WIDTH, CANVAS_H - CANVAS_BASE_Y);

  ctx.strokeStyle = 'rgba(37,99,235,0.6)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, CANVAS_BASE_Y);
  ctx.lineTo(GAME_WIDTH, CANVAS_BASE_Y);
  ctx.stroke();
}

// Mutable render state ref — keeps canvas RAF in sync without React re-renders
type RS = { phase: string; currentFloor: number; crashFloor: number; isSnapping: boolean; movingX: number; moveDir: 1 | -1; showModal: boolean };

export default function GameCanvas() {
  const {
    phase, crashFloor, nextCrashFloor, currentFloor, isSnapping,
    startGame, placeFloor, cashOut, skipRound,
    balance, bet, attempts, selectedAgent, showRealMoneyModal,
    addAIMessage, setTyping, setShowLimitModal,
  } = useGameStore();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prevPhase = useRef<string>('idle');
  const prevFloor = useRef(0);

  // Local mutable ref — position never goes through Zustand, no React re-renders per frame
  const rsRef = useRef<RS>({ phase, currentFloor, crashFloor, isSnapping, movingX: 0, moveDir: 1, showModal: false });
  rsRef.current.phase = phase;
  rsRef.current.currentFloor = currentFloor;
  rsRef.current.crashFloor = crashFloor;
  rsRef.current.isSnapping = isSnapping;
  rsRef.current.showModal = showRealMoneyModal;

  // Dispatch AI with typing delay
  const dispatchAI = useCallback((text: string, type: AIMessage['type']) => {
    setTyping(true);
    setTimeout(() => { addAIMessage(text, type); setTyping(false); }, 500 + Math.random() * 300);
  }, [addAIMessage, setTyping]);

  // Phase change effects
  useEffect(() => {
    if (prevPhase.current === phase) return;

    if (phase === 'playing') {
      Sounds.click();
      const msgs = getRoundStartMessages(crashFloor, selectedAgent);
      msgs.forEach((m, i) => {
        setTimeout(() => dispatchAI(m.text, m.type), i * 700);
      });
    }

    if (phase === 'crashed') {
      Sounds.lose();
      const msgs = getCrashMessage(crashFloor, selectedAgent);
      msgs.forEach((m, i) => setTimeout(() => dispatchAI(m.text, m.type), i * 600));
      // After crash messages — warn about NEXT round if it's floor 1
      const warns = getPreRoundWarning(nextCrashFloor, selectedAgent);
      warns.forEach((m, i) => setTimeout(() => dispatchAI(m.text, m.type), 1800 + i * 700));
    }

    if (phase === 'cashed_out') {
      // After cashout — warn about NEXT round if it's floor 1
      const warns = getPreRoundWarning(nextCrashFloor, selectedAgent);
      warns.forEach((m, i) => setTimeout(() => dispatchAI(m.text, m.type), 800 + i * 700));
    }

    prevPhase.current = phase;
  }, [phase, crashFloor, nextCrashFloor, dispatchAI]);

  // Floor placed effect
  useEffect(() => {
    if (currentFloor === 0 || currentFloor <= prevFloor.current) {
      prevFloor.current = currentFloor;
      return;
    }
    prevFloor.current = currentFloor;
    if (phase !== 'playing') return;
    Sounds.drop();
    const m = getFloorMessage(currentFloor, crashFloor, selectedAgent);
    if (m) setTimeout(() => dispatchAI(m.text, m.type), 200);
  }, [currentFloor, phase, crashFloor, dispatchAI]);

  // Reset block position + camera on new round
  const cameraYRef = useRef(0);
  useEffect(() => {
    if (phase === 'playing') {
      rsRef.current.movingX = 0;
      rsRef.current.moveDir = 1;
      cameraYRef.current = 0; // reset camera instantly on new round
    }
  }, [phase]);

  // Single RAF loop — updates position AND redraws canvas every frame (no Zustand per frame)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = GAME_WIDTH * dpr;
    canvas.height = CANVAS_H * dpr;
    canvas.style.width = GAME_WIDTH + 'px';
    canvas.style.height = CANVAS_H + 'px';

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let skipFrame = 0;

    const loop = () => {
      const rs = rsRef.current;

      // Modal open — completely pause canvas rendering (modal covers everything)
      if (rs.showModal) { animId = requestAnimationFrame(loop); return; }

      // When not playing — canvas is covered by overlay, only redraw every 30 frames
      if (rs.phase !== 'playing') {
        skipFrame++;
        if (skipFrame < 30) { animId = requestAnimationFrame(loop); return; }
        skipFrame = 0;
      }

      // Update moving block position (no React state = no re-render)
      if (rs.phase === 'playing' && !rs.isSnapping) {
        const maxX = GAME_WIDTH - BUILDING_W;
        let nx = rs.movingX + MOVE_SPEED * rs.moveDir;
        let nd = rs.moveDir;
        if (nx >= maxX) { nx = maxX; nd = -1; }
        if (nx <= 0)    { nx = 0;    nd = 1;  }
        rs.movingX = nx;
        rs.moveDir = nd;
      }

      // Camera — smoothly pan up as tower grows
      const topY = CANVAS_BASE_Y - rs.currentFloor * FLOOR_H;
      const movBlockY = rs.phase === 'playing'
        ? CANVAS_BASE_Y - (rs.currentFloor + 1) * FLOOR_H - 16
        : topY;
      const highestY = Math.min(topY, movBlockY);
      const TOP_MARGIN = 70; // px from top we want to keep the highest element
      const targetCam = Math.max(0, TOP_MARGIN - highestY);
      cameraYRef.current += (targetCam - cameraYRef.current) * 0.1;
      const cam = Math.round(cameraYRef.current);

      // Draw
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, GAME_WIDTH, CANVAS_H);

      // Background grid (fixed, no camera)
      ctx.strokeStyle = 'rgba(37,99,235,0.05)';
      ctx.lineWidth = 1;
      for (let y = 0; y < CANVAS_H; y += FLOOR_H) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(GAME_WIDTH, y); ctx.stroke();
      }

      // Apply camera offset for all game objects
      ctx.save();
      ctx.translate(0, cam);

      const buildX = (GAME_WIDTH - BUILDING_W) / 2;

      for (let f = 1; f <= rs.currentFloor; f++) {
        const floorY = CANVAS_BASE_Y - f * FLOOR_H;
        drawFloor(ctx, buildX, floorY, BUILDING_W, FLOOR_H, f,
          f === rs.currentFloor && rs.phase !== 'crashed', f === 1);
      }

      drawGround(ctx);

      if (rs.phase === 'playing' || rs.phase === 'crashed') {
        const crashY = CANVAS_BASE_Y - rs.crashFloor * FLOOR_H;
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = 'rgba(239,68,68,0.35)';
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(0, crashY); ctx.lineTo(GAME_WIDTH, crashY); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = 'rgba(239,68,68,0.55)';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(`💥 КРАШ ${rs.crashFloor}`, 8, crashY - 5);
      }

      if (rs.phase === 'playing' && rs.currentFloor < MAX_FLOORS) {
        const movingY = CANVAS_BASE_Y - (rs.currentFloor + 1) * FLOOR_H - 16;
        drawMovingBlock(ctx, rs.movingX, movingY, BUILDING_W, FLOOR_H, rs.isSnapping, rs.currentFloor);
        if (!rs.isSnapping) {
          ctx.setLineDash([3, 5]);
          ctx.strokeStyle = 'rgba(255,255,255,0.08)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(rs.movingX + BUILDING_W / 2, movingY + FLOOR_H);
          ctx.lineTo(buildX + BUILDING_W / 2, CANVAS_BASE_Y - rs.currentFloor * FLOOR_H);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      if (rs.phase === 'crashed') {
        ctx.fillStyle = 'rgba(239,68,68,0.08)';
        ctx.fillRect(0, -cam, GAME_WIDTH, CANVAS_H); // fill full canvas ignoring camera
      }

      ctx.restore(); // end camera transform

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []); // mount only — state read through rsRef, no stale closures

  const canPlay = balance >= bet && attempts > 0;
  const currentMult = FLOOR_MULTIPLIERS[currentFloor] ?? 0;
  const reward = Math.floor(bet * currentMult);

  const handleStart = () => {
    if (attempts <= 0) { setShowLimitModal(true); return; }
    if (balance < bet) return;
    startGame();
  };

  // Dynamic scaling to fill available space
  const outerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => {
      const el = outerRef.current;
      if (!el) return;
      const { width: pw, height: ph } = el.getBoundingClientRect();
      // Total unscaled content = stats (64) + canvas (470) + buttons (56)
      const totalH = 64 + CANVAS_H + 56;
      const availH = ph - 16; // 16px total margin
      const availW = pw - 32;
      const s = Math.min(availH / totalH, availW / GAME_WIDTH, 2.5);
      setScale(Math.max(0.45, s));
    };
    update();
    const ro = new ResizeObserver(update);
    if (outerRef.current) ro.observe(outerRef.current);
    return () => ro.disconnect();
  }, []);

  const scaledW = Math.round(GAME_WIDTH * scale);
  const scaledH = Math.round(CANVAS_H * scale);

  return (
    <div ref={outerRef} className="flex flex-col items-center justify-center gap-4 w-full h-full">

      {/* Scaled game wrapper — stats + canvas + buttons all scale together */}
      <div style={{ width: scaledW, height: Math.round((64 + CANVAS_H + 56) * scale), position: 'relative', flexShrink: 0 }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: GAME_WIDTH, position: 'absolute', top: 0, left: 0 }}>

      {/* Live stats row */}
      <div className="flex items-center gap-3" style={{ width: GAME_WIDTH }}>
        <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-center">
          <p className="text-white/40 text-[10px] uppercase tracking-widest">Этаж</p>
          <p className="text-white font-bold text-lg leading-tight">{currentFloor}</p>
        </div>
        <div className="flex-1 rounded-xl px-3 py-2 text-center" style={{ background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)' }}>
          <p className="text-white/40 text-[10px] uppercase tracking-widest">Множитель</p>
          <AnimatePresence mode="wait">
            <motion.p
              key={currentFloor}
              initial={{ scale: 1.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-blue-300 font-bold text-lg leading-tight"
            >
              {currentFloor > 0 ? `×${currentMult.toFixed(1)}` : '—'}
            </motion.p>
          </AnimatePresence>
        </div>
        <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-center">
          <p className="text-white/40 text-[10px] uppercase tracking-widest">Забрать</p>
          <p className="text-green-400 font-bold text-lg leading-tight">
            {currentFloor > 0 ? `+${reward}` : '—'}
          </p>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative" style={{ width: GAME_WIDTH, height: CANVAS_H }}>
        <canvas
          ref={canvasRef}
          className="rounded-2xl border border-white/10"
          style={{ background: 'linear-gradient(180deg, #141415 0%, #1a1a1f 100%)' }}
        />

        {/* Idle overlay */}
        <AnimatePresence>
          {phase === 'idle' && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-5 rounded-2xl"
              style={{ background: 'rgba(20,20,21,0.9)' }}
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                className="w-20 h-20 rounded-2xl overflow-hidden"
              >
                <img src="/towerrush.png" alt="Tower Rush" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </motion.div>
              <div className="text-center">
                <p className="text-white font-bold text-2xl">Tower Rush</p>
                <p className="text-white/40 text-sm mt-1">AI предскажет краш — вы решаете когда забрать</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={handleStart}
                disabled={!canPlay}
                className={`px-8 py-3 rounded-xl font-bold text-sm shadow-lg transition-all ${
                  canPlay
                    ? 'bg-gradient-to-r from-blue-600 to-green-500 text-white shadow-blue-500/30'
                    : 'bg-white/10 text-white/30 cursor-not-allowed'
                }`}
              >
                {balance < bet ? 'Недостаточно средств' : attempts <= 0 ? 'Лимит исчерпан' : 'Начать раунд'}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Crashed overlay */}
        <AnimatePresence>
          {phase === 'crashed' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl"
              style={{ background: 'rgba(20,20,21,0.92)' }}
            >
              <motion.div
                initial={{ rotate: 0 }} animate={{ rotate: [0, -15, 15, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}
              >
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 19h20L12 2z" fill="rgba(239,68,68,0.9)" stroke="rgba(239,68,68,1)" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M12 9v5M12 16.5v.5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </motion.div>
              <div className="text-center">
                <p className="text-red-400 font-bold text-2xl">Краш на {crashFloor} этаже!</p>
                <p className="text-white/40 text-sm mt-1">Башня обрушилась, как и было предсказано</p>
              </div>
              <div className="bg-white/5 rounded-xl px-6 py-3 border border-red-500/20 text-center">
                <p className="text-white/40 text-xs">Итог раунда</p>
                <p className="text-red-400 font-bold text-xl mt-0.5">−{bet} ₽</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={handleStart}
                disabled={!canPlay}
                className={`px-7 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  canPlay
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-900/40'
                    : 'bg-white/10 text-white/30 cursor-not-allowed'
                }`}
              >
                {balance < bet ? 'Сбросьте демо' : attempts <= 0 ? 'Лимит исчерпан' : 'Следующий раунд'}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cashed out overlay */}
        <AnimatePresence>
          {phase === 'cashed_out' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl"
              style={{ background: 'rgba(20,20,21,0.92)' }}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.6 }}
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)' }}
              >
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="rgba(34,197,94,0.9)" strokeWidth="1.5"/>
                  <path d="M12 7v10M9.5 9.5C9.5 8.4 10.6 7.5 12 7.5s2.5.9 2.5 2-.9 1.8-2.5 2c-1.6.2-2.5 1-2.5 2.1 0 1.2 1.1 2.1 2.5 2.1s2.5-.9 2.5-2.1" stroke="rgba(34,197,94,1)" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </motion.div>
              <div className="text-center">
                <p className="text-green-400 font-bold text-2xl">Забрали на {currentFloor} этаже!</p>
                <p className="text-white/40 text-sm mt-1">×{currentMult.toFixed(1)} — правильное решение</p>
              </div>
              <div className="bg-white/5 rounded-xl px-6 py-3 border border-green-500/20 text-center">
                <p className="text-white/40 text-xs">Выигрыш</p>
                <p className="text-green-400 font-bold text-xl mt-0.5">+{reward} ₽</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={handleStart}
                disabled={!canPlay}
                className={`px-7 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  canPlay
                    ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-900/40'
                    : 'bg-white/10 text-white/30 cursor-not-allowed'
                }`}
              >
                {balance < bet ? 'Сбросьте демо' : attempts <= 0 ? 'Лимит исчерпан' : 'Следующий раунд'}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action buttons — only during playing */}
      <AnimatePresence>
        {phase === 'playing' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            className="flex gap-3"
            style={{ width: GAME_WIDTH }}
          >
            {crashFloor === 1 ? (
              /* Floor 1 crash — special skip button */
              <>
                <motion.button
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    Sounds.lose();
                    skipRound();
                  }}
                  className="flex-1 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-yellow-600 to-yellow-500 text-white shadow-lg shadow-yellow-900/30 hover:from-yellow-500 hover:to-yellow-400 transition-all flex items-center justify-center gap-2"
                >
                  <Zap size={15} strokeWidth={2.5} /> Пропустить (−1 ₽)
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
                  onClick={placeFloor}
                  disabled={isSnapping}
                  className="flex-1 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-red-700 to-red-600 text-white shadow-lg shadow-red-900/30 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  <Layers size={15} strokeWidth={2.5} /> Крашнуть (−{bet} ₽)
                </motion.button>
              </>
            ) : (
              /* Normal play buttons */
              <>
                <motion.button
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
                  onClick={placeFloor}
                  disabled={isSnapping}
                  className="flex-1 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-900/40 hover:from-blue-500 hover:to-blue-400 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {isSnapping
                    ? <><Loader2 size={15} className="animate-spin" /> Строю...</>
                    : <><Layers size={15} strokeWidth={2.5} /> Добавить этаж</>
                  }
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    if (currentFloor === 0) return;
                    Sounds.win();
                    const mult = FLOOR_MULTIPLIERS[currentFloor] ?? 1;
                    const r = Math.floor(bet * mult);
                    const msgs = [getCashOutMessage(currentFloor, r, selectedAgent)];
                    msgs.forEach(m => setTimeout(() => addAIMessage(m.text, m.type), 200));
                    cashOut();
                  }}
                  disabled={currentFloor === 0}
                  className="flex-1 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-900/40 hover:from-green-500 hover:to-green-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  <BadgeDollarSign size={15} strokeWidth={2.5} />
                  Забрать {currentFloor > 0 ? `+${reward} ₽` : ''}
                </motion.button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      </div>{/* end scale-inner */}
      </div>{/* end scale-outer spacer */}
    </div>
  );
}

