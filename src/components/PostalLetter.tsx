import React from 'react';
import { Contribution } from '../types';
import { motion } from 'motion/react';

interface PostalLetterProps {
  contribution: Contribution;
  onClick?: () => void;
  isDragging?: boolean;
}

export const PostalLetter: React.FC<PostalLetterProps> = ({
  contribution,
  onClick,
  isDragging = false,
}) => {
  const { letter } = contribution;
  const width = contribution.width || 340;
  const height = contribution.height || 180;

  return (
    <motion.div
      id={`letter-${contribution.id}`}
      whileHover={{ scale: 1.02, y: -3 }}
      whileTap={{ scale: 0.98 }}
      className={`relative cursor-pointer select-none transition-shadow ${
        isDragging ? 'opacity-90 cursor-grabbing' : ''
      }`}
      style={{
        width: `${width}px`,
        minHeight: `${height}px`,
        filter: 'drop-shadow(0 14px 28px rgba(0, 0, 0, 0.6))',
      }}
      onClick={onClick}
    >
      {/* Light textured torn/deckle edge letter matching attached Borderless space.png */}
      <div className="relative w-full h-full bg-[#d7d5d0] text-[#111111] p-6 flex flex-col justify-between overflow-hidden shadow-lg">
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

        {/* Torn rough deckled top & bottom edge border lines */}
        <div
          className="absolute top-0 left-0 right-0 h-[3px] opacity-75"
          style={{
            background: 'repeating-linear-gradient(90deg, #b0ada4, #b0ada4 3px, #d7d5d0 3px, #d7d5d0 6px)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-[3px] opacity-75"
          style={{
            background: 'repeating-linear-gradient(90deg, #b0ada4, #b0ada4 3px, #d7d5d0 3px, #d7d5d0 6px)',
          }}
        />

        {/* Content */}
        <div className="relative z-10 space-y-2">
          <p className="font-sans font-bold text-sm text-[#111111] leading-tight">
            {letter?.greeting || 'Dear Amanda'}
          </p>
          <p className="font-sans text-xs text-[#222222] leading-relaxed whitespace-pre-line font-medium">
            {letter?.body ||
              "Thank you for being such a warm, helpful teammate.\nHere's to 5 years and many more!"}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
