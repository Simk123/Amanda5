import React, { useRef } from 'react';
import { Contribution } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { X, Printer, Award } from 'lucide-react';
import { TributePiece } from './TributePiece';

interface KeepsakeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  contributions: Contribution[];
}

export const KeepsakeExportModal: React.FC<KeepsakeExportModalProps> = ({
  isOpen,
  onClose,
  contributions,
}) => {
  const printRef = useRef<HTMLDivElement | null>(null);

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-6xl bg-[#141414] border border-white/15 text-[#f4f1e6] rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-300" />
              <div>
                <h3 className="text-lg font-bold font-sans text-white">
                  Commemorative Keepsake Collection
                </h3>
                <p className="text-xs font-mono text-white/60">
                  The Amanda Collection • 5-Year Milestone Tribute (2021–2026)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-black font-semibold text-xs hover:bg-white/90 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" /> Print Keepsake
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Printable Sheet Area */}
          <div className="p-6 overflow-y-auto no-scrollbar flex-1 bg-black">
            <div
              ref={printRef}
              className="max-w-5xl mx-auto bg-[#161616] border-2 border-white/20 rounded-2xl p-8 space-y-8 shadow-2xl relative"
            >
              {/* Header */}
              <div className="text-center space-y-2 border-b border-white/10 pb-6">
                <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-amber-300 text-[10px] font-mono tracking-widest uppercase">
                  LIMITED COMMEMORATIVE EDITION • TEAM ANNIVERSARY BOARD
                </div>
                <h1 className="text-3xl sm:text-4xl font-display font-bold text-white">
                  The Amanda Collection
                </h1>
                <p className="text-xs sm:text-sm font-mono text-white/70">
                  Handcrafted Beaded Charms & Personal Notes for Amanda’s 5th Work Anniversary
                </p>
              </div>

              {/* Grid of Paired Tributes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-items-center">
                {contributions.map((item) => (
                  <div key={item.id} className="scale-95 transform transition-transform">
                    <TributePiece contribution={item} />
                  </div>
                ))}
              </div>

              {/* Footer Certificate */}
              <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between text-xs font-mono text-white/60">
                <span>VERIFIED TEAM COMMEMORATIVE ISSUE</span>
                <span className="text-amber-300 font-bold">WITH DEEPEST GRATITUDE FROM THE TEAM</span>
                <span>ISSUE DATE: AUGUST 2026</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
