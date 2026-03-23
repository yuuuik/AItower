import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type GamePhase = 'idle' | 'playing' | 'crashed' | 'cashed_out';
export type AIAgent = 'chatgpt' | 'deepseek' | 'gemini' | 'claude';

export interface AIMessage {
  id: number;
  text: string;
  type: 'info' | 'warning' | 'danger' | 'success';
  timestamp: number;
}

// Multiplier per floor (index = floor number)
export const FLOOR_MULTIPLIERS = [0, 1.2, 1.5, 2.0, 2.5, 3.0, 4.0, 5.0, 7.0, 10.0, 15.0];
export const MAX_FLOORS = 10;
export const GAME_WIDTH = 430;
export const FLOOR_H = 80;
export const BUILDING_W = 80;
export const MOVE_SPEED = 4;

/** Weighted random crash floor — biased toward mid-range (3-6) */
function pickCrashFloor(): number {
  const table: [number, number][] = [
    [1, 4], [2, 6], [3, 14], [4, 18], [5, 20], [6, 18],
    [7, 12], [8, 7], [9, 4], [10, 1],
  ];
  const total = table.reduce((s, [, w]) => s + w, 0);
  let r = Math.random() * total;
  for (const [floor, w] of table) {
    r -= w;
    if (r <= 0) return floor;
  }
  return 5;
}

let msgId = 0;

interface GameState {
  balance: number;
  bet: number;
  attempts: number;
  maxAttempts: number;

  phase: GamePhase;
  crashFloor: number;
  nextCrashFloor: number;
  currentFloor: number;
  isSnapping: boolean;

  aiMessages: AIMessage[];
  isTyping: boolean;
  showLimitModal: boolean;
  limitModalError: string;
  promoResult: { success: boolean; message: string } | null;
  roundsCompleted: number;
  showRealMoneyModal: boolean;
  selectedAgent: AIAgent;

  // Real mode
  isRealMode: boolean;
  realUserId: string;

  setBet: (v: number) => void;
  setSelectedAgent: (agent: AIAgent) => void;
  applyPromoCode: (code: string) => void;
  clearPromoResult: () => void;
  setShowRealMoneyModal: (v: boolean) => void;
  skipRound: () => void;
  startGame: () => void;
  placeFloor: () => void;
  cashOut: () => void;
  resetDemo: () => void;
  addAIMessage: (text: string, type: AIMessage['type']) => void;
  setTyping: (v: boolean) => void;
  setShowLimitModal: (v: boolean) => void;
  setLimitModalError: (v: string) => void;
  tryUnlockWithId: (id: string) => void;
  activateRealMode: (userId: string) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      balance: 10000,
      bet: 100,
      attempts: 10,
      maxAttempts: 10,
      phase: 'idle',
      crashFloor: 5,
      nextCrashFloor: pickCrashFloor(),
      currentFloor: 0,
      isSnapping: false,
      aiMessages: [],
      isTyping: false,
      showLimitModal: false,
      limitModalError: '',
      promoResult: null,
      roundsCompleted: 0,
      showRealMoneyModal: false,
      selectedAgent: 'chatgpt' as AIAgent,
      isRealMode: false,
      realUserId: '',

      setBet: v => set({ bet: Math.max(1, Math.min(100000, v)) }),
      setSelectedAgent: agent => set({ selectedAgent: agent, aiMessages: [], isTyping: false }),

      applyPromoCode: (code) => {
        const upper = code.trim().toUpperCase();
        const promos: Record<string, { balance?: number; attempts?: number; label: string }> = {
          'MARCHTOWER': { balance: 5000, label: '+5000 ₽ бонус' },
        };
        const promo = promos[upper];
        if (!promo) {
          set({ promoResult: { success: false, message: 'Промокод не найден или уже использован.' } });
          return;
        }
        set(s => ({
          balance: promo.balance ? s.balance + promo.balance : s.balance,
          attempts: promo.attempts ?? s.attempts,
          promoResult: { success: true, message: `Промокод применён! ${promo.label} начислено на счёт.` },
        }));
      },

      clearPromoResult: () => set({ promoResult: null }),
      setShowRealMoneyModal: v => set({ showRealMoneyModal: v }),

      skipRound: () => {
        const { phase, bet, balance, isRealMode } = get();
        if (phase !== 'playing') return;
        const refund = isRealMode ? 0 : Math.max(bet - 1, 0);
        const newCount = get().roundsCompleted + 1;
        set({
          phase: 'crashed',
          balance: isRealMode ? balance : balance + refund,
          roundsCompleted: newCount,
          showRealMoneyModal: !isRealMode && newCount % 5 === 0,
        });
      },

      startGame: () => {
        const { balance, bet, attempts, nextCrashFloor, isRealMode } = get();
        if (!isRealMode && attempts <= 0) { set({ showLimitModal: true }); return; }
        if (!isRealMode && balance < bet) return;
        msgId = 0;
        set({
          phase: 'playing',
          crashFloor: nextCrashFloor,
          nextCrashFloor: pickCrashFloor(),
          currentFloor: 0,
          isSnapping: false,
          balance: isRealMode ? balance : balance - bet,
          attempts: isRealMode ? attempts : attempts - 1,
          aiMessages: [],
          isTyping: false,
        });
      },

      placeFloor: () => {
        const { phase, currentFloor, crashFloor, bet, balance, isRealMode } = get();
        if (phase !== 'playing' || get().isSnapping) return;

        set({ isSnapping: true });

        setTimeout(() => {
          const nextFloor = currentFloor + 1;
          if (nextFloor >= crashFloor) {
            const newCount = get().roundsCompleted + 1;
            set({
              currentFloor: nextFloor,
              phase: 'crashed',
              isSnapping: false,
              roundsCompleted: newCount,
              showRealMoneyModal: !isRealMode && newCount % 5 === 0,
            });
          } else {
            set({ currentFloor: nextFloor, isSnapping: false });
          }
        }, 350);
      },

      cashOut: () => {
        const { phase, currentFloor, bet, balance, isRealMode } = get();
        if (phase !== 'playing' || currentFloor === 0) return;
        const multiplier = FLOOR_MULTIPLIERS[currentFloor] ?? 1;
        const reward = Math.floor(bet * multiplier);
        const newCount = get().roundsCompleted + 1;
        set({
          phase: 'cashed_out',
          balance: isRealMode ? balance : balance + reward,
          roundsCompleted: newCount,
          showRealMoneyModal: !isRealMode && newCount % 5 === 0,
        });
      },

      resetDemo: () => set({
        balance: 10000, attempts: 10, phase: 'idle',
        currentFloor: 0, crashFloor: 5,
        aiMessages: [], showLimitModal: false, limitModalError: '',
        showRealMoneyModal: false,
        isRealMode: false, realUserId: '',
      }),

      addAIMessage: (text, type) => {
        const msg: AIMessage = { id: msgId++, text, type, timestamp: Date.now() };
        set(s => ({ aiMessages: [...s.aiMessages.slice(-40), msg] }));
      },

      setTyping: v => set({ isTyping: v }),
      setShowLimitModal: v => set({ showLimitModal: v }),
      setLimitModalError: v => set({ limitModalError: v }),

      tryUnlockWithId: id => {
        if (id.trim() === 'demo123') {
          set({ attempts: 10, showLimitModal: false, limitModalError: '' });
        } else {
          set({ limitModalError: 'Неверный ID' });
        }
      },

      activateRealMode: (userId: string) => {
        msgId = 0;
        set({
          isRealMode: true,
          realUserId: userId,
          showLimitModal: false,
          limitModalError: '',
          phase: 'idle',
          currentFloor: 0,
          aiMessages: [],
          isTyping: false,
          attempts: 999,
          maxAttempts: 999,
        });
      },
    }),
    {
      name: 'tower-rush-v2',
      partialize: s => ({
        balance: s.balance,
        attempts: s.attempts,
        isRealMode: s.isRealMode,
        realUserId: s.realUserId,
      }),
    }
  )
);
