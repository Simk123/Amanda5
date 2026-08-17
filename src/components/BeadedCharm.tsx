import React from 'react';
import { Contribution } from '../types';
import { motion } from 'motion/react';
import { getCharmImageUrl, getBeadThemeFilter, AUTHENTIC_BEADED_5_IMAGE } from '../data/charmAssets';
import { Sparkles } from 'lucide-react';

interface BeadedCharmProps {
  contribution: Contribution;
  onClick?: () => void;
  isDragging?: boolean;
}

export const BeadedCharm: React.FC<BeadedCharmProps> = ({
  contribution,
  onClick,
  isDragging = false,
}) => {
  const { charm, authorName } = contribution;
  const width = contribution.width || 240;
  const height = contribution.height || 330;

  const isCustomAiShape = charm?.shape === 'custom-ai' || charm?.shape === 'custom';
  const hasCustomSvg = !!charm?.generatedSvg && isCustomAiShape;
  const colorFilter = getBeadThemeFilter(charm?.beadTheme);

  // Resolve photoreal image URL
  const imageUrl =
    charm?.imageUrl || (charm?.shape && charm.shape !== 'custom-ai' ? getCharmImageUrl(charm.shape) : AUTHENTIC_BEADED_5_IMAGE);

  return (
    <motion.div
      id={`charm-${contribution.id}`}
      whileHover={{ scale: 1.04, rotate: (contribution.rotation || 0) + 1.5 }}
      whileTap={{ scale: 0.98 }}
      className={`relative select-none transition-shadow ${
        isDragging ? 'opacity-90 cursor-grabbing' : 'cursor-grab'
      }`}
      style={{
        width: `${width}px`,
        minHeight: `${height}px`,
        filter: 'drop-shadow(0 25px 40px rgba(0, 0, 0, 0.95))',
      }}
      onClick={onClick}
    >
      <div className="flex flex-col items-center">
        {/* Hanging Ring Top Loop */}
        <div className="w-3.5 h-3.5 rounded-full border-2 border-amber-200/90 bg-black/80 shadow-md mb-0.5" />

        {/* Central Beaded Charm Body */}
        <div className="relative z-10 flex items-center justify-center p-1 min-h-[220px]">
          {hasCustomSvg ? (
            /* Custom AI Generated Vector Beadwork */
            <div
              className="w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center drop-shadow-[0_20px_35px_rgba(0,0,0,0.95)] [&>svg]:w-full [&>svg]:h-full [&>svg]:max-h-full [&>svg]:max-w-full"
              style={{
                filter:
                  colorFilter !== 'none'
                    ? `${colorFilter} drop-shadow(0 20px 35px rgba(0,0,0,0.95))`
                    : 'drop-shadow(0 20px 35px rgba(0,0,0,0.95))',
              }}
              dangerouslySetInnerHTML={{ __html: charm.generatedSvg! }}
            />
          ) : isCustomAiShape ? (
            <div className="w-44 h-44 rounded-2xl border-2 border-dashed border-white/40 bg-white/5 flex flex-col items-center justify-center p-4 text-center">
              <Sparkles className="w-8 h-8 text-amber-300 mb-2 animate-pulse" />
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                AI Custom Charm
              </span>
            </div>
          ) : (
            /* Photoreal Macro Photograph Charm Asset */
            <div className="relative flex items-center justify-center group">
              <img
                src={imageUrl}
                alt={charm?.title || 'Beaded Charm'}
                referrerPolicy="no-referrer"
                className="max-h-[260px] w-auto object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.95)] transition-all duration-300"
                style={{
                  filter:
                    colorFilter !== 'none'
                      ? `${colorFilter} drop-shadow(0 20px 35px rgba(0,0,0,0.95))`
                      : 'brightness(1.02) contrast(1.03)',
                }}
                draggable={false}
              />
            </div>
          )}
        </div>

        {/* Attached Custom Name Tag / Title Banner */}
        <div className="relative z-20 -mt-2 flex flex-col items-center">
          {/* Tiny beaded connector hanging string */}
          <div className="w-0.5 h-2 bg-gradient-to-b from-[#e0e0e0] to-white/70 shadow-sm" />

          {/* Clean hanging tag matching borderless space theme */}
          <div className="px-3.5 py-1.5 rounded-md bg-[#181818]/95 border border-white/30 text-center shadow-2xl backdrop-blur-md flex flex-col items-center transition-all group-hover:border-[#d4af37]/60">
            <span className="text-xs font-black uppercase tracking-wider text-white font-sans">
              {charm?.title || 'CHARM'}
            </span>
            {authorName && (
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/70 font-sans mt-0.5">
                FROM {authorName.toUpperCase()}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
