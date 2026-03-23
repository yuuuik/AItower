'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { useState } from 'react';
import { AlertCircle, Loader2, ExternalLink, ShieldCheck } from 'lucide-react';
import { REAL_MONEY_URL } from '@/lib/constants';

export default function Modal() {
  const { showLimitModal, setShowLimitModal, setLimitModalError, activateRealMode } = useGameStore();
  const [inputId, setInputId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleVerify = async () => {
    const clean = inputId.trim().replace(/\D/g, '');
    if (!clean) { setError('Введите ID аккаунта.'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/verify-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: clean }),
      });
      const data = await res.json();
      if (data.ok) {
        setSuccess(true);
        setTimeout(() => {
          activateRealMode(clean);
          setInputId('');
          setSuccess(false);
        }, 1200);
      } else {
        setError(data.error ?? 'ID не найден.');
      }
    } catch {
      setError('Ошибка соединения. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {showLimitModal && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setShowLimitModal(false); setLimitModalError(''); setError(''); }}
            className="fixed inset-0 z-50 bg-black/80"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 16 }}
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
              className="pointer-events-auto w-full max-w-sm"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/80">
                {/* Backgrounds */}
                <div className="absolute inset-0" style={{ background: '#1c1c1e' }} />
                <div className="absolute inset-0 rounded-3xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }} />

                <div className="relative px-7 py-8 flex flex-col items-center gap-5 text-center">

                  {success ? (
                    /* ── Success state ── */
                    <motion.div
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex flex-col items-center gap-4 py-4"
                    >
                      <div className="w-20 h-20 rounded-full bg-green-500/15 border border-green-500/40 flex items-center justify-center">
                        <ShieldCheck size={36} className="text-green-400" />
                      </div>
                      <div>
                        <p className="text-green-400 font-black text-xl">Аккаунт подключён!</p>
                        <p className="text-white/40 text-sm mt-1">Переключаемся в реальный режим...</p>
                      </div>
                    </motion.div>
                  ) : (
                    <>
                      {/* Icon */}
                      <div className="w-20 h-20 rounded-2xl overflow-hidden" style={{ boxShadow: '0 0 28px rgba(0,200,100,0.2)' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/towerrush.png" alt="Tower Rush" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      </div>

                      {/* Headline */}
                      <div>
                        <p className="text-white/40 text-xs uppercase tracking-widest font-medium mb-2">Демо-лимит исчерпан</p>
                        <h2 className="text-[22px] font-extrabold text-white leading-snug">
                          Подключите реальный<br />
                          <span className="bg-gradient-to-r from-green-300 via-emerald-400 to-green-400 bg-clip-text text-transparent">
                            аккаунт 1win
                          </span>
                        </h2>
                        <p className="text-white/35 text-sm mt-2 leading-relaxed">
                          Введите ID аккаунта после первого депозита — и получите доступ к AI-сигналам в реальном режиме.
                        </p>
                      </div>

                      {/* Step hint */}
                      <div className="w-full rounded-2xl bg-white/[0.03] border border-white/8 px-4 py-3 text-left flex flex-col gap-2">
                        <p className="text-white/30 text-[10px] uppercase tracking-widest font-bold">Как найти ID</p>
                        <div className="flex items-start gap-2">
                          <span className="text-white/20 text-xs font-mono shrink-0 mt-0.5">1.</span>
                          <p className="text-white/45 text-xs leading-relaxed">Зарегистрируйтесь на 1win и сделайте депозит</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-white/20 text-xs font-mono shrink-0 mt-0.5">2.</span>
                          <p className="text-white/45 text-xs leading-relaxed">Перейдите в профиль — ID аккаунта указан под именем</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-white/20 text-xs font-mono shrink-0 mt-0.5">3.</span>
                          <p className="text-white/45 text-xs leading-relaxed">Введите числовой ID ниже и нажмите «Подключить»</p>
                        </div>
                      </div>

                      {/* Input */}
                      <div className="w-full">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={inputId}
                          onChange={e => { setInputId(e.target.value.replace(/\D/g, '')); setError(''); }}
                          onKeyDown={e => e.key === 'Enter' && handleVerify()}
                          placeholder="Введите числовой ID аккаунта..."
                          className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all placeholder:text-white/20"
                          style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: error ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(255,255,255,0.1)',
                            color: '#fff',
                            letterSpacing: '0.05em',
                          }}
                        />
                        <AnimatePresence>
                          {error && (
                            <motion.div
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center gap-1.5 mt-2 text-red-400 text-xs text-left"
                            >
                              <AlertCircle size={12} className="shrink-0" />
                              {error}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Connect button */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleVerify}
                        disabled={loading}
                        className="w-full py-4 rounded-2xl font-bold text-[15px] flex items-center justify-center gap-2 transition-opacity disabled:opacity-70"
                        style={{
                          background: 'linear-gradient(135deg, #15803d 0%, #16a34a 60%, #4ade80 100%)',
                          color: '#052e16',
                        }}
                      >
                        {loading ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <>
                            <ShieldCheck size={18} />
                            Подключить аккаунт
                          </>
                        )}
                      </motion.button>

                      {/* Register link */}
                      <a
                        href={REAL_MONEY_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-white/30 hover:text-white/55 text-xs transition-colors"
                      >
                        <ExternalLink size={11} />
                        Ещё нет аккаунта? Зарегистрироваться на 1win
                      </a>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
