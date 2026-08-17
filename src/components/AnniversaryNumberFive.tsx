import React, { useRef, useState } from 'react';
import { Upload, Camera, Sparkles, RefreshCw } from 'lucide-react';

interface AnniversaryNumberFiveProps {
  customImage?: string | null;
  onImageChange?: (imageDataUrl: string | null) => void;
  interactive?: boolean;
}

export const AnniversaryNumberFive: React.FC<AnniversaryNumberFiveProps> = ({
  customImage: propCustomImage,
  onImageChange,
  interactive = true,
}) => {
  const [localImage, setLocalImage] = useState<string | null>(() => {
    return propCustomImage || localStorage.getItem('amanda_anniversary_5_image') || '/beaded5.png';
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const displayImage = propCustomImage !== undefined ? propCustomImage : localImage;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        setLocalImage(result);
        localStorage.setItem('amanda_anniversary_5_image', result);
        if (onImageChange) onImageChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalImage(null);
    localStorage.removeItem('amanda_anniversary_5_image');
    if (onImageChange) onImageChange(null);
  };

  return (
    <div className="relative group flex items-center justify-center select-none">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Radial Cyan Stippled Halo (matches Desktop - 1.png aura) */}
      <div className="absolute inset-0 -m-12 rounded-full pointer-events-none opacity-40 bg-[radial-gradient(circle_at_center,_rgba(45,160,240,0.35)_0%,_rgba(45,160,240,0.12)_45%,_transparent_75%)] filter blur-xl" />

      {/* 1. Custom Uploaded Image Mode */}
      {displayImage ? (
        <div className="relative z-10 max-w-[280px] max-h-[380px] sm:max-w-[340px] sm:max-h-[440px] flex items-center justify-center p-2 rounded-2xl overflow-hidden shadow-2xl transition-transform duration-300 group-hover:scale-105">
          <img
            src={displayImage}
            alt="Amanda 5th Anniversary Charm"
            className="w-full h-full object-contain max-h-[400px] drop-shadow-[0_20px_35px_rgba(0,0,0,0.6)]"
          />

          {interactive && (
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2.5 transition-opacity rounded-2xl backdrop-blur-xs">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-black rounded-full text-xs font-semibold hover:bg-white/90 shadow-lg"
              >
                <Upload className="w-3.5 h-3.5" />
                Change Image
              </button>
              <button
                onClick={handleResetImage}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-full text-xs font-mono"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Use Beaded Charm
              </button>
            </div>
          )}
        </div>
      ) : (
        /* 2. Detailed Beaded Charm "5" Vector Illustration Placeholder */
        <div
          onClick={() => interactive && fileInputRef.current?.click()}
          className={`relative z-10 cursor-pointer p-4 transition-transform duration-300 group-hover:scale-105 ${
            interactive ? 'cursor-pointer' : ''
          }`}
          title="Click to upload your custom image of the 5"
        >
          {/* Authentic Beaded 5 SVG Illustration */}
          <svg
            viewBox="0 0 340 460"
            className="w-[240px] h-[320px] sm:w-[290px] sm:h-[390px] drop-shadow-[0_25px_40px_rgba(0,0,0,0.7)]"
          >
            <defs>
              {/* Metallic Silver Keyring Gradient */}
              <linearGradient id="silverRing" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f0f3f5" />
                <stop offset="30%" stopColor="#a3aab0" />
                <stop offset="70%" stopColor="#d2d7db" />
                <stop offset="100%" stopColor="#6e767c" />
              </linearGradient>

              {/* Pearlescent Bead Gradients */}
              <radialGradient id="beadPearl" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="60%" stopColor="#eae6df" />
                <stop offset="100%" stopColor="#c5bfb4" />
              </radialGradient>

              <radialGradient id="beadBlue" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#93c5fd" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1d4ed8" />
              </radialGradient>

              <radialGradient id="beadCobalt" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="50%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#1e3a8a" />
              </radialGradient>

              <radialGradient id="beadPeach" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#fed7aa" />
                <stop offset="60%" stopColor="#fb923c" />
                <stop offset="100%" stopColor="#c2410c" />
              </radialGradient>

              <radialGradient id="beadLilac" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#e9d5ff" />
                <stop offset="60%" stopColor="#c084fc" />
                <stop offset="100%" stopColor="#7e22ce" />
              </radialGradient>

              <radialGradient id="beadGold" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#854d0e" />
              </radialGradient>

              <radialGradient id="beadRuby" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#fca5a5" />
                <stop offset="50%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#991b1b" />
              </radialGradient>

              {/* Shadow filter */}
              <filter id="beadShadow" x="-20%" y="-20%" width="150%" height="150%">
                <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.45" />
              </filter>
            </defs>

            {/* TOP METALLIC KEYRING & CLASP */}
            <g id="keyring-hardware" filter="url(#beadShadow)">
              {/* Outer Split Ring */}
              <circle
                cx="170"
                cy="46"
                r="30"
                fill="none"
                stroke="url(#silverRing)"
                strokeWidth="7"
              />
              <circle
                cx="170"
                cy="46"
                r="25"
                fill="none"
                stroke="#475569"
                strokeWidth="1.5"
                opacity="0.6"
              />
              {/* Connecting Small Jump Rings */}
              <circle
                cx="170"
                cy="84"
                r="11"
                fill="none"
                stroke="url(#silverRing)"
                strokeWidth="4.5"
              />
              <circle
                cx="170"
                cy="104"
                r="8"
                fill="none"
                stroke="url(#silverRing)"
                strokeWidth="3.5"
              />
            </g>

            {/* CHARM STRING CORE PATH */}
            <path
              d="M 125 125 H 225 M 125 125 V 235 H 205 C 248 235 255 375 160 380 C 115 380 100 345 100 345"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="3"
              strokeDasharray="4 4"
              opacity="0.3"
            />

            {/* BEADED NUMBER "5" FORM */}
            <g id="beads-5" filter="url(#beadShadow)">
              {/* 1. TOP HORIZONTAL BAR (Left to Right) */}
              <circle cx="125" cy="125" r="14" fill="url(#beadBlue)" />
              <circle cx="152" cy="125" r="13" fill="url(#beadPeach)" />
              <circle cx="178" cy="125" r="14" fill="url(#beadPearl)" />
              <circle cx="204" cy="125" r="13" fill="url(#beadGold)" />
              <circle cx="228" cy="125" r="15" fill="url(#beadCobalt)" />

              {/* 2. VERTICAL STEM (Top to Middle) */}
              <circle cx="125" cy="153" r="13" fill="url(#beadLilac)" />
              <circle cx="125" cy="180" r="14" fill="url(#beadPearl)" />
              <circle cx="125" cy="207" r="13" fill="url(#beadRuby)" />
              <circle cx="125" cy="235" r="15" fill="url(#beadBlue)" />

              {/* 3. MIDDLE HORIZONTAL JOIN */}
              <circle cx="152" cy="235" r="13" fill="url(#beadPeach)" />
              <circle cx="178" cy="235" r="14" fill="url(#beadPearl)" />
              <circle cx="205" cy="238" r="14" fill="url(#beadGold)" />

              {/* 4. LOWER CURVE OF "5" */}
              <circle cx="230" cy="255" r="14" fill="url(#beadCobalt)" />
              <circle cx="244" cy="282" r="15" fill="url(#beadBlue)" />
              <circle cx="246" cy="312" r="15" fill="url(#beadLilac)" />
              <circle cx="235" cy="340" r="15" fill="url(#beadPeach)" />
              <circle cx="210" cy="365" r="15" fill="url(#beadGold)" />
              <circle cx="180" cy="378" r="15" fill="url(#beadPearl)" />
              <circle cx="150" cy="378" r="14" fill="url(#beadBlue)" />
              <circle cx="124" cy="365" r="14" fill="url(#beadRuby)" />
              <circle cx="104" cy="345" r="13" fill="url(#beadPearl)" />
            </g>

            {/* DAISY FLOWER ACCENT BEADS */}
            <g id="flower-accents" filter="url(#beadShadow)">
              {/* Daisy on Top Right */}
              <g transform="translate(230, 125)">
                <circle cx="-6" cy="-6" r="4.5" fill="#ffffff" />
                <circle cx="6" cy="-6" r="4.5" fill="#ffffff" />
                <circle cx="-6" cy="6" r="4.5" fill="#ffffff" />
                <circle cx="6" cy="6" r="4.5" fill="#ffffff" />
                <circle cx="0" cy="0" r="4" fill="#facc15" />
              </g>

              {/* Daisy on Middle Curve */}
              <g transform="translate(245, 297)">
                <circle cx="-5" cy="-5" r="4" fill="#fed7aa" />
                <circle cx="5" cy="-5" r="4" fill="#fed7aa" />
                <circle cx="-5" cy="5" r="4" fill="#fed7aa" />
                <circle cx="5" cy="5" r="4" fill="#fed7aa" />
                <circle cx="0" cy="0" r="3.5" fill="#ffffff" />
              </g>
            </g>

            {/* HANGING RIBBON / CHARM TASSEL */}
            <g id="ribbon-tail" opacity="0.85">
              <path
                d="M 104 345 C 90 370 82 405 78 430 M 104 345 C 100 375 106 410 114 435"
                fill="none"
                stroke="#60a5fa"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="78" cy="432" r="5" fill="url(#beadPearl)" />
              <circle cx="114" cy="437" r="5" fill="url(#beadGold)" />
            </g>
          </svg>

          {/* Hover Placeholder Banner & Prompt */}
          {interactive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-xs rounded-2xl p-4 text-center">
              <div className="p-3 rounded-full bg-white/20 text-white mb-2 shadow-lg">
                <Camera className="w-6 h-6" />
              </div>
              <p className="text-white text-xs font-semibold uppercase tracking-wider">
                Click to Add / Replace Image of 5
              </p>
              <p className="text-white/70 text-[11px] font-mono mt-0.5">
                PNG, JPG, or GIF supported
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
