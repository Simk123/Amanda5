import React from 'react';
import { Contribution } from '../types';
import { motion } from 'motion/react';
import { getCharmImageUrl, getBeadThemeFilter, AUTHENTIC_BEADED_5_IMAGE } from '../data/charmAssets';
import { Sparkles } from 'lucide-react';

interface TributePieceProps {
  contribution: Contribution;
  onClick?: () => void;
  isDragging?: boolean;
}

export const TributePiece: React.FC<TributePieceProps> = ({
  contribution,
  onClick,
  isDragging = false,
}) => {
  const { charm, letter, authorName } = contribution;

  const isCustomAiShape = charm?.shape === 'custom-ai' || charm?.shape === 'custom';
  const hasCustomSvg = !!charm?.generatedSvg && isCustomAiShape;
  const colorFilter = getBeadThemeFilter(charm?.beadTheme);

  // Resolve photoreal image URL for presets
  const imageUrl =
    charm?.imageUrl || (charm?.shape && charm.shape !== 'custom-ai' ? getCharmImageUrl(charm.shape) : AUTHENTIC_BEADED_5_IMAGE);

  const hasCharm = !!charm;
  const hasLetter = !!letter;

  return (
    <motion.div
      id={`tribute-${contribution.id}`}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`relative select-none transition-shadow ${
        isDragging ? 'opacity-90 cursor-grabbing' : 'cursor-grab'
      }`}
      style={{
        zIndex: contribution.zIndex || 10,
        filter: 'drop-shadow(0 20px 35px rgba(0, 0, 0, 0.95))',
      }}
      onClick={onClick}
    >
      <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
        {/* ================= BEADED CHARM ================= */}
        {hasCharm && (
          <div className="flex flex-col items-center shrink-0">
            {/* Hanging Ring Top Loop */}
            <div className="w-3.5 h-3.5 rounded-full border-2 border-amber-200/90 bg-black/80 shadow-md mb-0.5 -mt-1" />

            {/* Charm Graphic */}
            <div className="relative flex items-center justify-center min-w-[160px] min-h-[170px]">
              {hasCustomSvg ? (
                /* Custom AI Generated Vector Beadwork */
                <div
                  className="w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center drop-shadow-[0_18px_30px_rgba(0,0,0,0.95)] transition-all duration-300 [&>svg]:w-full [&>svg]:h-full [&>svg]:max-h-full [&>svg]:max-w-full"
                  style={{
                    filter:
                      colorFilter !== 'none'
                        ? `${colorFilter} drop-shadow(0 18px 30px rgba(0,0,0,0.95))`
                        : 'drop-shadow(0 18px 30px rgba(0,0,0,0.95))',
                  }}
                  dangerouslySetInnerHTML={{ __html: charm.generatedSvg! }}
                />
              ) : isCustomAiShape ? (
                /* Placeholder when custom AI is selected but not yet generated */
                <div className="w-44 h-44 sm:w-48 sm:h-48 rounded-2xl border-2 border-dashed border-white/40 bg-white/5 flex flex-col items-center justify-center p-4 text-center">
                  <Sparkles className="w-8 h-8 text-amber-300 mb-2 animate-pulse" />
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    AI Custom Charm
                  </span>
                  <span className="text-[10px] font-sans text-white/50 mt-1">
                    Enter a prompt & click Generate
                  </span>
                </div>
              ) : (
                /* Photoreal 3D Macro Photograph Charm Asset */
                <img
                  src={imageUrl}
                  alt={charm?.title || 'Beaded Charm'}
                  referrerPolicy="no-referrer"
                  className="h-44 sm:h-52 w-auto object-contain drop-shadow-[0_18px_30px_rgba(0,0,0,0.95)] transition-all duration-300"
                  style={{
                    filter:
                      colorFilter !== 'none'
                        ? `${colorFilter} drop-shadow(0 18px 30px rgba(0,0,0,0.95))`
                        : 'brightness(1.02) contrast(1.03)',
                  }}
                  draggable={false}
                />
              )}
            </div>

            {/* Attached Metal Tag Banner */}
            <div className="relative -mt-2 flex flex-col items-center z-10">
              <div className="w-0.5 h-2 bg-gradient-to-b from-[#e0e0e0] to-white/70 shadow-sm" />
              <div className="px-3 py-1 rounded-md bg-[#161616]/95 border border-white/30 text-center shadow-xl backdrop-blur-md flex flex-col items-center">
                <span className="text-[11px] font-black uppercase tracking-wider text-white font-sans">
                  {charm?.title || 'CHARM'}
                </span>
                {authorName && (
                  <span className="text-[9px] font-bold uppercase tracking-widest text-white/70 font-sans mt-0.5">
                    FROM {authorName.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= TORN DECKLE PAPER NOTE ================= */}
        {hasLetter && (
          <div className="relative w-[280px] sm:w-[320px] bg-[#d7d5d0] text-[#111111] p-5 flex flex-col justify-between overflow-hidden shadow-2xl rounded-xs mt-2 md:mt-4">
            {/* Subtle noise grain texture */}
            <div
              className="absolute inset-0 opacity-40 pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(#908c84 1px, transparent 1px), radial-gradient(#908c84 1px, #d7d5d0 1px)',
                backgroundSize: '4px 4px',
                backgroundPosition: '0 0, 2px 2px',
              }}
            />

            {/* Torn rough deckled top & bottom edge borders */}
            <div
              className="absolute top-0 left-0 right-0 h-[3px] opacity-75"
              style={{
                background:
                  'repeating-linear-gradient(90deg, #b0ada4, #b0ada4 3px, #d7d5d0 3px, #d7d5d0 6px)',
              }}
            />
            <div
              className="absolute bottom-0 left-0 right-0 h-[3px] opacity-75"
              style={{
                background:
                  'repeating-linear-gradient(90deg, #b0ada4, #b0ada4 3px, #d7d5d0 3px, #d7d5d0 6px)',
              }}
            />

            {/* Letter Content */}
            <div className="relative z-10 space-y-2">
              <p className="font-sans font-bold text-sm text-[#111111] leading-tight">
                {letter?.greeting || 'Dear Amanda'}
              </p>
              <p className="font-sans text-xs text-[#222222] leading-relaxed whitespace-pre-line font-medium">
                {letter?.body ||
                  "Thank you for being such a warm, helpful teammate.\nHere's to 5 years and many more!"}
              </p>
            </div>

            {/* Teammate Signature on Note */}
            {authorName && (
              <div className="relative z-10 pt-3 border-t border-[#b0ada4]/50 flex justify-end">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#444444] font-bold">
                  — {authorName}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
