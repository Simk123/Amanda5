import React, { useState } from 'react';
import { Contribution, BeadTheme } from '../types';
import { TributePiece } from './TributePiece';
import { X, Check, Sparkles, Loader2, Wand2 } from 'lucide-react';
import { motion } from 'motion/react';
import {
  BEAD_THEME_CONFIGS,
  AUTHENTIC_BEADED_5_IMAGE,
} from '../data/charmAssets';

interface CharmComposerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddContribution: (contribution: Contribution) => void;
}

const THEME_LIST = Object.values(BEAD_THEME_CONFIGS);

const QUICK_CHARM_PROMPTS = [
  'Origami Crane of Gratitude',
  'Golden Bumblebee with Glass Stripes',
  'Ruby Red Cherries with Pearl Stems',
  'Crescent Moon with Star Beads',
  'Cute Kitty Cat Face with Whiskers',
  'Golden Trophy Cup with Mini Pearls',
  'Coffee Mug with Heart Foam',
  'Sparkling Diamond Gemstone',
];

export const CharmComposerModal: React.FC<CharmComposerModalProps> = ({
  isOpen,
  onClose,
  onAddContribution,
}) => {
  const [authorName, setAuthorName] = useState('');

  // Mode: 'authentic-5' (uploaded real photo) or 'custom-ai' (generative vector beadwork)
  const [charmMode, setCharmMode] = useState<'authentic-5' | 'custom-ai'>('authentic-5');
  const [charmTitle, setCharmTitle] = useState('SUPERSTAR 5');
  const [selectedTheme, setSelectedTheme] = useState<BeadTheme>('candy-cane');
  const [aiPrompt, setAiPrompt] = useState('');
  const [generatedSvg, setGeneratedSvg] = useState<string | null>(null);
  const [isGeneratingCharm, setIsGeneratingCharm] = useState(false);

  // Letter configuration state
  const [letterGreeting, setLetterGreeting] = useState('Dear Amanda');
  const [letterBody, setLetterBody] = useState(
    "Thank you for being such an inspiring, warm, and helpful teammate.\nHere's to 5 incredible years and many more milestones to come!"
  );
  const [isSuggestingLetter, setIsSuggestingLetter] = useState(false);

  if (!isOpen) return null;

  // Handle AI Beaded Charm Generation
  const handleGenerateCharm = async () => {
    if (!aiPrompt.trim()) return;
    setIsGeneratingCharm(true);
    try {
      const res = await fetch('/api/generate-charm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPrompt,
          theme: selectedTheme,
          shapeType: 'custom',
        }),
      });
      const data = await res.json();
      if (data.svg) {
        setGeneratedSvg(data.svg);
        setCharmMode('custom-ai');
        if (data.suggestedTitle) {
          setCharmTitle(data.suggestedTitle);
        }
      }
    } catch (err) {
      console.error('Failed to generate beaded charm', err);
    } finally {
      setIsGeneratingCharm(false);
    }
  };

  // Handle AI Letter Suggestion
  const handleSuggestLetter = async () => {
    setIsSuggestingLetter(true);
    try {
      const res = await fetch('/api/suggest-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: authorName.trim() || 'A teammate',
          currentNote: letterBody,
        }),
      });
      const data = await res.json();
      if (data.letter) {
        setLetterBody(data.letter);
      }
    } catch (err) {
      console.error('Failed to suggest note', err);
    } finally {
      setIsSuggestingLetter(false);
    }
  };

  const isCustomAi = charmMode === 'custom-ai';

  // Construct preview contribution
  const previewContribution: Contribution = {
    id: 'preview-tribute',
    authorName: authorName.trim() || 'NAME',
    type: 'tribute',
    posX: 0,
    posY: 0,
    rotation: 0,
    zIndex: 1,
    createdAt: new Date().toISOString(),
    charm: {
      title: charmTitle.trim() || 'SUPERSTAR 5',
      shape: isCustomAi ? 'custom-ai' : 'number-5',
      beadTheme: selectedTheme,
      imageUrl: !isCustomAi ? AUTHENTIC_BEADED_5_IMAGE : undefined,
      generatedSvg: isCustomAi && generatedSvg ? generatedSvg : undefined,
      genPrompt: isCustomAi ? aiPrompt : undefined,
    },
    letter: {
      greeting: letterGreeting.trim() || 'Dear Amanda',
      body: letterBody,
    },
  };

  const handleSaveAndPlace = () => {
    const finalAuthor = authorName.trim() || 'TEAMMATE';
    const newContrib: Contribution = {
      ...previewContribution,
      id: `c-${Date.now()}`,
      authorName: finalAuthor,
      posX: 0,
      posY: 0,
      rotation: (Math.random() - 0.5) * 4,
      zIndex: 30,
    };

    onAddContribution(newContrib);
    onClose();
  };

  return (
    <div
      id="charm-composer-backdrop"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xs cursor-pointer select-none"
    >
      <motion.div
        id="charm-composer-modal"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-5xl bg-black text-[#f5f2e9] border border-white/80 shadow-[0_30px_90px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col my-auto cursor-default max-h-[92vh]"
      >
        {/* Header */}
        <div className="relative z-10 flex items-center justify-between px-6 sm:px-8 py-4 sm:py-5 border-b border-white/20">
          <div>
            <h2
              className="text-2xl sm:text-3xl font-normal text-[#f5f2e9] tracking-tight leading-tight"
              style={{ fontFamily: "'Bookmania', 'Newsreader', 'Georgia', serif" }}
            >
              Add Charm & Note for Amanda
            </h2>
            <p className="text-xs font-sans text-white/60 mt-0.5">
              Choose the authentic beaded 5 charm or craft an AI custom charm, select a color palette, and write your note.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white/80 hover:text-white transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          {/* Left Form: Inputs */}
          <div className="lg:col-span-7 p-5 sm:p-7 space-y-6 border-b lg:border-b-0 lg:border-r border-white/20">
            {/* 1. Author Name */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-widest text-white/60 mb-1.5">
                From (Your Name)
              </label>
              <input
                type="text"
                placeholder="e.g. PRIYA, MARCUS, SIMRAN"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value.toUpperCase())}
                className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/30 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white font-sans uppercase font-bold"
              />
            </div>

            {/* 2. Choose Charm Style: Authentic Beaded 5 OR AI Custom Make Charm */}
            <div className="space-y-4 pt-2 border-t border-white/15">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono uppercase tracking-widest text-white/60">
                  1. Choose Charm
                </label>
              </div>

              {/* Option Cards */}
              <div className="grid grid-cols-2 gap-3">
                {/* 1. Authentic Beaded 5 Charm */}
                <button
                  type="button"
                  onClick={() => {
                    setCharmMode('authentic-5');
                    setCharmTitle('SUPERSTAR 5');
                  }}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer relative overflow-hidden ${
                    charmMode === 'authentic-5'
                      ? 'bg-white text-black font-bold border-white shadow-xl ring-2 ring-white/60'
                      : 'bg-black text-white/80 border-white/25 hover:border-white/50 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center p-1">
                    <img
                      src={AUTHENTIC_BEADED_5_IMAGE}
                      alt="Authentic Beaded 5"
                      referrerPolicy="no-referrer"
                      className="max-h-full max-w-full object-contain filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.85)]"
                    />
                  </div>
                  <div className="text-center w-full">
                    <div className="text-xs font-bold font-sans">Anniversary 5 Charm</div>
                    <div
                      className={`text-[9px] font-mono truncate mt-0.5 ${
                        charmMode === 'authentic-5' ? 'text-black/70' : 'text-white/50'
                      }`}
                    >
                      Authentic Beaded 5
                    </div>
                  </div>
                </button>

                {/* 2. AI Custom Make Charm */}
                <button
                  type="button"
                  onClick={() => {
                    setCharmMode('custom-ai');
                    if (!generatedSvg) {
                      setCharmTitle('CUSTOM CHARM');
                    }
                  }}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer relative overflow-hidden ${
                    charmMode === 'custom-ai'
                      ? 'bg-white text-black font-bold border-white shadow-xl ring-2 ring-white/60'
                      : 'bg-black text-white/80 border-white/25 hover:border-white/50 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center p-1 relative">
                    {generatedSvg ? (
                      <div
                        className="w-full h-full flex items-center justify-center [&>svg]:max-h-full [&>svg]:max-w-full drop-shadow-md"
                        dangerouslySetInnerHTML={{ __html: generatedSvg }}
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex flex-col items-center justify-center text-amber-300">
                        <Wand2 className="w-7 h-7 animate-pulse" />
                      </div>
                    )}
                  </div>
                  <div className="text-center w-full">
                    <div className="text-xs font-bold font-sans flex items-center justify-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>AI Custom Charm</span>
                    </div>
                    <div
                      className={`text-[9px] font-mono truncate mt-0.5 ${
                        charmMode === 'custom-ai' ? 'text-black/70' : 'text-amber-300/80 font-bold'
                      }`}
                    >
                      {generatedSvg ? 'Ready' : 'Make Charm'}
                    </div>
                  </div>
                </button>
              </div>

              {/* AI Custom Prompt Input (Shown when AI Custom is selected) */}
              {charmMode === 'custom-ai' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.2 }}
                  className="p-4 rounded-xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-amber-300/40 space-y-3 shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
                      <Sparkles className="w-4 h-4" />
                      <span>AI Custom Charm Generator</span>
                    </div>
                    {generatedSvg && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/40">
                        ✓ Generated & Previewing
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && aiPrompt.trim() && !isGeneratingCharm) {
                          handleGenerateCharm();
                        }
                      }}
                      placeholder="e.g. Origami Crane, Golden Bumblebee, Ruby Cherries..."
                      className="flex-1 px-3.5 py-2 rounded-lg bg-black border border-white/40 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-none focus:border-amber-300 font-sans"
                    />
                    <button
                      type="button"
                      disabled={isGeneratingCharm || !aiPrompt.trim()}
                      onClick={handleGenerateCharm}
                      className="px-4 py-2 rounded-lg bg-amber-300 hover:bg-amber-200 text-black text-xs font-bold font-mono flex items-center gap-1.5 disabled:opacity-50 transition-all cursor-pointer whitespace-nowrap shadow-md hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {isGeneratingCharm ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Wand2 className="w-4 h-4" />
                      )}
                      <span>{isGeneratingCharm ? 'Crafting Beadwork...' : 'Generate Beadwork'}</span>
                    </button>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-white/50 block mb-1">Quick Ideas:</span>
                    <div className="flex flex-wrap gap-1">
                      {QUICK_CHARM_PROMPTS.map((prompt) => (
                        <button
                          key={prompt}
                          type="button"
                          onClick={() => {
                            setAiPrompt(prompt);
                          }}
                          className="px-2 py-1 rounded text-[10px] bg-white/5 hover:bg-white/15 text-white/70 hover:text-white border border-white/10 transition-colors cursor-pointer"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 3. Choose Bead Color Theme */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-mono uppercase tracking-widest text-white/60">
                    2. Choose Bead Color Theme (Updates Preview)
                  </label>
                  <span className="text-[10px] font-mono text-amber-300 font-semibold">
                    {BEAD_THEME_CONFIGS[selectedTheme]?.label}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {THEME_LIST.map((theme) => {
                    const isSelected = selectedTheme === theme.id;
                    return (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => setSelectedTheme(theme.id)}
                        className={`px-3 py-2 rounded-xl text-xs font-mono flex items-center gap-2 transition-all border cursor-pointer ${
                          isSelected
                            ? 'bg-white text-black font-bold border-white shadow-md ring-1 ring-white/50'
                            : 'bg-black text-white/80 border-white/20 hover:border-white/40 hover:bg-white/[0.03]'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/30 shadow-xs shrink-0"
                          style={{ backgroundColor: theme.previewColor }}
                        />
                        <span className="truncate">{theme.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Charm Attached Tag Title */}
              <div className="pt-1">
                <label className="block text-[10px] font-mono uppercase tracking-widest text-white/50 mb-1">
                  Attached Metal Tag Title
                </label>
                <input
                  type="text"
                  value={charmTitle}
                  onChange={(e) => setCharmTitle(e.target.value.toUpperCase())}
                  placeholder="SUPERSTAR 5"
                  className="w-full px-3 py-2 rounded-lg bg-black border border-white/30 text-xs text-white font-black uppercase focus:outline-none focus:border-white"
                />
              </div>
            </div>

            {/* 4. Personal Note to Amanda */}
            <div className="space-y-3 pt-2 border-t border-white/15">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono uppercase tracking-widest text-white/60">
                  3. Personal Note for Amanda
                </label>
                <button
                  type="button"
                  disabled={isSuggestingLetter}
                  onClick={handleSuggestLetter}
                  className="text-[11px] font-mono text-white/70 hover:text-white flex items-center gap-1 cursor-pointer underline underline-offset-2 disabled:opacity-50"
                >
                  {isSuggestingLetter ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Sparkles className="w-3 h-3 text-amber-300" />
                  )}
                  <span>AI Draft Polish</span>
                </button>
              </div>

              <div>
                <input
                  type="text"
                  value={letterGreeting}
                  onChange={(e) => setLetterGreeting(e.target.value)}
                  placeholder="Dear Amanda"
                  className="w-full px-3.5 py-2 rounded-xl bg-black border border-white/30 text-sm text-white font-bold focus:outline-none focus:border-white mb-2"
                />
                <textarea
                  rows={3}
                  value={letterBody}
                  onChange={(e) => setLetterBody(e.target.value)}
                  placeholder="Write your personal message to Amanda..."
                  className="w-full p-3.5 rounded-xl bg-black border border-white/30 text-xs sm:text-sm text-white leading-relaxed focus:outline-none focus:border-white font-sans"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Live Paired Tribute Preview */}
          <div className="lg:col-span-5 p-5 sm:p-7 bg-black flex flex-col justify-between items-center relative overflow-hidden">
            <div className="flex items-center justify-between w-full">
              <span className="text-[10px] font-mono tracking-[0.25em] text-white/40 uppercase">
                LIVE PAIRED TRIBUTE PREVIEW
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/70">
                {charmMode === 'custom-ai' ? 'AI Custom Charm' : 'Anniversary 5'}
              </span>
            </div>

            <div className="my-auto py-6 flex items-center justify-center min-h-[340px] w-full">
              <motion.div
                key={`${charmMode}-${selectedTheme}-${charmTitle}-${authorName}-${generatedSvg}-${letterGreeting}-${letterBody}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center scale-90 sm:scale-95 origin-center"
              >
                <TributePiece contribution={previewContribution} />
              </motion.div>
            </div>

            <div className="w-full space-y-2 pt-2">
              <button
                type="button"
                onClick={handleSaveAndPlace}
                className="w-full py-3.5 rounded-full bg-white text-black font-semibold text-sm tracking-wide flex items-center justify-center gap-2 hover:bg-white/90 shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Place Charm & Note on Garland</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
