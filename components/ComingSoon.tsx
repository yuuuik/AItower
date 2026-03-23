'use client';

import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';

interface Props {
  icon: string;
  title: string;
  description: string;
}

export default function ComingSoon({ icon, title, description }: Props) {
  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: '#141415' }}>
      <div className="w-[160px] shrink-0 h-full">
        <Sidebar />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-5 text-center max-w-sm"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="text-6xl"
          >
            {icon}
          </motion.div>
          <div>
            <p className="text-white font-bold text-2xl">{title}</p>
            <p className="text-white/40 text-sm mt-2 leading-relaxed">{description}</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-white/40 text-xs uppercase tracking-widest">В разработке</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
