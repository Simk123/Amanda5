import React from 'react';
import { Contribution } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, User } from 'lucide-react';
import { TributePiece } from './TributePiece';

interface InspectModalProps {
  contribution: Contribution | null;
  onClose: () => void;
}

export const InspectModal: React.FC<InspectModalProps> = ({ contribution, onClose }) => {
  if (!contribution) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          className="relative w-full max-w-2xl bg-[#141414] border border-white/20 text-[#f4f1e6] rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 my-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="text-center space-y-1">
            <span className="text-[10px] font-mono tracking-widest text-amber-300 uppercase">
              THE AMANDA COLLECTION • 5-YEAR WORK ANNIVERSARY
            </span>
            <h3 className="text-xl font-bold font-sans text-white">
              Tribute from {contribution.authorName}
            </h3>
          </div>

          {/* Centered Large Preview */}
          <div className="flex items-center justify-center py-6 bg-black rounded-xl border border-white/10 p-6 overflow-hidden">
            <TributePiece contribution={contribution} />
          </div>

          {/* Details Meta */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono bg-white/5 p-3 rounded-lg border border-white/10">
            <div className="flex items-center gap-2 text-white/80">
              <User className="w-3.5 h-3.5 text-amber-300" />
              <span>
                By <strong className="text-white">{contribution.authorName}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <Calendar className="w-3.5 h-3.5 text-rose-300" />
              <span>Issue: 5-Year Milestone</span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors cursor-pointer"
            >
              Back to Board
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
