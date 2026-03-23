'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

export default function PromoForm() {
  const [code, setCode] = useState('');
  const { applyPromoCode, clearPromoResult, promoResult } = useGameStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    applyPromoCode(code);
    setCode('');
  };

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={e => { setCode(e.target.value.toUpperCase()); clearPromoResult(); }}
          placeholder="Введите промокод"
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm font-mono tracking-widest outline-none focus:border-blue-500/60 transition-colors"
          maxLength={20}
          autoComplete="off"
          spellCheck={false}
        />
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={!code.trim()}
          className="px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-green-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-900/30"
        >
          Применить
        </motion.button>
      </form>

      <AnimatePresence>
        {promoResult && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm ${
              promoResult.success
                ? 'bg-green-500/10 border-green-500/30 text-green-400'
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}
          >
            <span>{promoResult.success ? '✅' : '❌'}</span>
            <span>{promoResult.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
