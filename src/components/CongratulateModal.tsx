import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Info, Sparkles } from 'lucide-react';
import designer4Url from '../assets/designer4.png';

interface CongratulateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CongratulateModal: React.FC<CongratulateModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        id="congratulations-modal-backdrop"
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/80 backdrop-blur-xs cursor-pointer select-none"
      >
        <motion.div
          id="congratulations-modal-card"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl bg-black text-[#f5f2e9] border border-white/80 shadow-[0_30px_90px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col items-center justify-between p-6 sm:p-10 md:p-14 text-center cursor-default min-h-[520px] md:min-h-[580px]"
        >
          {/* TOP HEADLINE: 'congratulations!' in Bookmania lowercase */}
          <div className="w-full flex justify-center z-10">
            <motion.h2
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white font-normal tracking-tight leading-none"
              style={{
                fontFamily: "'Bookmania', 'Newsreader', 'Georgia', serif",
              }}
            >
              congratulations!
            </motion.h2>
          </div>

          {/* CENTER: BEADED 5 IMAGE WITH FLOATING ANIMATION */}
          <div className="relative my-auto py-2 sm:py-4 flex items-center justify-center z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: [0, -8, 0],
                rotate: [0, 1.5, 0, -1.5, 0],
              }}
              transition={{
                opacity: { duration: 0.5, delay: 0.15 },
                scale: { duration: 0.5, delay: 0.15 },
                y: {
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
                rotate: {
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
              }}
              className="relative flex items-center justify-center"
            >
              <img
                src={designer4Url || '/designer4.png'}
                alt="Beaded 5 Anniversary Charm (Designer 4)"
                className="max-h-[220px] sm:max-h-[280px] md:max-h-[320px] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)] filter brightness-105"
              />
            </motion.div>

            {/* Right arrow button inside popup (matching Start screen.png) */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.15)' }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="absolute right-0 sm:right-4 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-white/80 flex items-center justify-center text-white transition-all group"
              title="Enter collection board"
            >
              <ArrowRight className="w-6 h-6 stroke-[1.5] transition-transform duration-300 group-hover:translate-x-1" />
            </motion.button>
          </div>

          {/* BOTTOM HEADLINE: 'Amanda!' in Bookmania */}
          <div className="w-full flex justify-center z-10">
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-6xl sm:text-8xl md:text-9xl lg:text-[140px] font-normal text-white tracking-tight leading-none"
              style={{
                fontFamily: "'Bookmania', 'Newsreader', 'Georgia', serif",
              }}
            >
              Amanda!
            </motion.h1>
          </div>

          {/* Explanatory Blurb banner at the bottom */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mt-3 pt-3 border-t border-white/15 w-full flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-white/60"
          >
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-white/80" />
              <span>Amanda's 5-Year Work Anniversary Tribute Collection</span>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white underline underline-offset-4 cursor-pointer"
            >
              Click arrow or press Esc to view board →
            </button>
          </motion.div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
