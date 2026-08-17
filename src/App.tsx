import React, { useState, useEffect, useRef } from 'react';
import { Contribution } from './types';
import { INITIAL_CONTRIBUTIONS } from './data/seedData';
import { TributePiece } from './components/TributePiece';
import { BeadedCharm } from './components/BeadedCharm';
import { PostalLetter } from './components/PostalLetter';
import { ConnectedRope } from './components/ConnectedRope';
import { CharmComposerModal } from './components/CharmComposerModal';
import { CongratulateModal } from './components/CongratulateModal';
import { Plus, Info, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

const STORAGE_KEY = 'amanda_beaded_charms_board_v8';

export default function App() {
  const [contributions, setContributions] = useState<Contribution[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        return INITIAL_CONTRIBUTIONS;
      }
    }
    return INITIAL_CONTRIBUTIONS;
  });

  // Modal states
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [isCongratulateOpen, setIsCongratulateOpen] = useState(true);

  // Infinite Canvas Pan & Zoom State
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);

  // Panning canvas state
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef<{ clientX: number; clientY: number; startPanX: number; startPanY: number }>({
    clientX: 0,
    clientY: 0,
    startPanX: 0,
    startPanY: 0,
  });

  // Dragging individual piece state
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const pieceDragOffsetRef = useRef<{ offsetX: number; offsetY: number }>({ offsetX: 0, offsetY: 0 });

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Persist contributions
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contributions));
  }, [contributions]);

  // Center initial view nicely on first load
  useEffect(() => {
    if (window.innerWidth > 1440) {
      const offsetX = (window.innerWidth - 1440) / 2;
      setPan({ x: Math.max(0, offsetX), y: 0 });
    }
  }, []);

  // Add piece in current viewport center
  const handleAddContribution = (newPiece: Contribution) => {
    const viewportCenterX = (-pan.x + window.innerWidth / 2) / zoom - 220;
    const viewportCenterY = (-pan.y + window.innerHeight / 2) / zoom - 150;

    const placedPiece: Contribution = {
      ...newPiece,
      posX: viewportCenterX + (Math.random() - 0.5) * 60,
      posY: viewportCenterY + (Math.random() - 0.5) * 60,
      zIndex: 40,
    };

    setContributions((prev) => [placedPiece, ...prev]);
  };

  // Wheel listener for infinite scrolling and trackpad panning/pinch-zoom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      if (e.ctrlKey || e.metaKey) {
        // Pinch-zoom / Ctrl+Wheel zoom towards cursor
        const zoomDelta = e.deltaY < 0 ? 1.06 : 0.94;
        setZoom((prevZoom) => {
          const nextZoom = Math.min(Math.max(prevZoom * zoomDelta, 0.35), 2.5);
          const mouseX = e.clientX;
          const mouseY = e.clientY;
          setPan((prevPan) => ({
            x: mouseX - (mouseX - prevPan.x) * (nextZoom / prevZoom),
            y: mouseY - (mouseY - prevPan.y) * (nextZoom / prevZoom),
          }));
          return nextZoom;
        });
      } else {
        // Natural 2D infinite panning via trackpad or mouse wheel
        setPan((prevPan) => ({
          x: prevPan.x - e.deltaX,
          y: prevPan.y - e.deltaY,
        }));
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // Mouse Down handler: distinguish dragging a piece vs panning the canvas
  const handleMouseDown = (e: React.MouseEvent) => {
    // If clicking on fixed overlay UI buttons, ignore
    const target = e.target as HTMLElement;
    if (
      target.closest('#fixed-ui') ||
      target.closest('button') ||
      target.closest('input') ||
      target.closest('textarea')
    ) {
      return;
    }

    // Check if clicked directly on a piece
    const pieceElement = target.closest('[data-piece-id]') as HTMLElement;
    if (pieceElement) {
      const pieceId = pieceElement.getAttribute('data-piece-id');
      if (pieceId) {
        const item = contributions.find((c) => c.id === pieceId);
        if (item) {
          setDraggingId(pieceId);
          // Calculate click offset in world coordinates
          const mouseWorldX = (e.clientX - pan.x) / zoom;
          const mouseWorldY = (e.clientY - pan.y) / zoom;
          pieceDragOffsetRef.current = {
            offsetX: mouseWorldX - item.posX,
            offsetY: mouseWorldY - item.posY,
          };
          return;
        }
      }
    }

    // Otherwise, start infinite canvas background pan
    setIsPanning(true);
    panStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      startPanX: pan.x,
      startPanY: pan.y,
    };
  };

  // Global Mouse Move
  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingId) {
      // Dragging a piece in infinite world coordinates
      const mouseWorldX = (e.clientX - pan.x) / zoom;
      const mouseWorldY = (e.clientY - pan.y) / zoom;
      const newPosX = mouseWorldX - pieceDragOffsetRef.current.offsetX;
      const newPosY = mouseWorldY - pieceDragOffsetRef.current.offsetY;

      setContributions((prev) =>
        prev.map((c) =>
          c.id === draggingId
            ? {
                ...c,
                posX: newPosX,
                posY: newPosY,
                zIndex: 35,
              }
            : c
        )
      );
    } else if (isPanning) {
      // Panning the canvas
      const deltaX = e.clientX - panStartRef.current.clientX;
      const deltaY = e.clientY - panStartRef.current.clientY;
      setPan({
        x: panStartRef.current.startPanX + deltaX,
        y: panStartRef.current.startPanY + deltaY,
      });
    }
  };

  // Mouse Up
  const handleMouseUp = () => {
    if (draggingId) setDraggingId(null);
    if (isPanning) setIsPanning(false);
  };

  // Touch handlers for mobile / tablet infinite scrolling
  const touchStartRef = useRef<{ x: number; y: number; panX: number; panY: number; dist?: number }>({
    x: 0,
    y: 0,
    panX: 0,
    panY: 0,
  });

  const handleTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('#fixed-ui') || target.closest('button')) return;

    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const pieceElement = target.closest('[data-piece-id]') as HTMLElement;
      if (pieceElement) {
        const pieceId = pieceElement.getAttribute('data-piece-id');
        if (pieceId) {
          const item = contributions.find((c) => c.id === pieceId);
          if (item) {
            setDraggingId(pieceId);
            const mouseWorldX = (touch.clientX - pan.x) / zoom;
            const mouseWorldY = (touch.clientY - pan.y) / zoom;
            pieceDragOffsetRef.current = {
              offsetX: mouseWorldX - item.posX,
              offsetY: mouseWorldY - item.posY,
            };
            return;
          }
        }
      }

      setIsPanning(true);
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        panX: pan.x,
        panY: pan.y,
      };
    } else if (e.touches.length === 2) {
      // Pinch to zoom start
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchStartRef.current.dist = Math.sqrt(dx * dx + dy * dy);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (draggingId && e.touches.length === 1) {
      const touch = e.touches[0];
      const mouseWorldX = (touch.clientX - pan.x) / zoom;
      const mouseWorldY = (touch.clientY - pan.y) / zoom;
      const newPosX = mouseWorldX - pieceDragOffsetRef.current.offsetX;
      const newPosY = mouseWorldY - pieceDragOffsetRef.current.offsetY;
      setContributions((prev) =>
        prev.map((c) =>
          c.id === draggingId ? { ...c, posX: newPosX, posY: newPosY, zIndex: 35 } : c
        )
      );
    } else if (isPanning && e.touches.length === 1) {
      const touch = e.touches[0];
      const dx = touch.clientX - touchStartRef.current.x;
      const dy = touch.clientY - touchStartRef.current.y;
      setPan({
        x: touchStartRef.current.panX + dx,
        y: touchStartRef.current.panY + dy,
      });
    }
  };

  const handleTouchEnd = () => {
    setDraggingId(null);
    setIsPanning(false);
  };

  // Zoom control helpers
  const handleZoomIn = () => {
    setZoom((prev) => {
      const next = Math.min(prev * 1.2, 2.5);
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      setPan((p) => ({
        x: cx - (cx - p.x) * (next / prev),
        y: cy - (cy - p.y) * (next / prev),
      }));
      return next;
    });
  };

  const handleZoomOut = () => {
    setZoom((prev) => {
      const next = Math.max(prev / 1.2, 0.35);
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      setPan((p) => ({
        x: cx - (cx - p.x) * (next / prev),
        y: cy - (cy - p.y) * (next / prev),
      }));
      return next;
    });
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: window.innerWidth > 1440 ? (window.innerWidth - 1440) / 2 : 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`relative w-screen h-screen bg-black text-[#f4f1e6] overflow-hidden select-none font-sans ${
        isPanning ? 'cursor-grabbing' : draggingId ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      {/* ================= FIXED HUD OVERLAY ================= */}
      <div id="fixed-ui" className="pointer-events-none">
        {/* Top-Left: 'i' (Info) Button */}
        <div className="absolute top-6 left-6 z-40 pointer-events-auto">
          <button
            id="info-button"
            onClick={() => setIsCongratulateOpen(true)}
            className="w-12 h-12 rounded-full border border-white/80 hover:border-white bg-black/70 hover:bg-white hover:text-black text-white flex items-center justify-center transition-all duration-200 shadow-xl hover:scale-105 active:scale-95 group backdrop-blur-xs cursor-pointer"
            title="About Amanda's 5-Year Anniversary Celebration"
          >
            <Info className="w-5 h-5 stroke-[1.75]" />
          </button>
        </div>

        {/* Top-Right: (+) Add Beaded Charm & Note Button */}
        <div className="absolute top-6 right-6 z-40 pointer-events-auto">
          <button
            id="add-charm-button"
            onClick={() => setIsComposerOpen(true)}
            className="w-13 h-13 sm:w-14 sm:h-14 rounded-full border-2 border-white/90 hover:border-white bg-black/70 hover:bg-white hover:text-black text-white flex items-center justify-center transition-all duration-200 shadow-2xl hover:scale-105 active:scale-95 group backdrop-blur-xs cursor-pointer"
            title="Add a charm & note for Amanda"
          >
            <Plus className="w-8 h-8 stroke-[1.5] transition-transform duration-300 group-hover:rotate-90" />
          </button>
        </div>

        {/* Bottom-Right: Subtle Canvas Navigation & Zoom Bar */}
        <div className="absolute bottom-6 right-6 z-40 pointer-events-auto flex items-center gap-1.5 p-1.5 rounded-full bg-black/70 border border-white/20 backdrop-blur-sm shadow-xl">
          <button
            onClick={handleZoomOut}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-[11px] font-mono px-2 text-white/60 min-w-[42px] text-center select-none">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <div className="w-[1px] h-4 bg-white/20 mx-0.5" />
          <button
            onClick={handleResetView}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
            title="Reset View to Center"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ================= INFINITE BORDERLESS CANVAS WORLD ================= */}
      <div
        className="absolute inset-0 origin-top-left pointer-events-none will-change-transform"
        style={{
          transform: `translate3d(${pan.x}px, ${pan.y}px, 0px) scale(${zoom})`,
        }}
      >
        {/* CENTER-RIGHT DISPLAY TITLE */}
        <div
          className="absolute z-0 pointer-events-none select-none max-w-2xl px-4"
          style={{
            left: '520px',
            top: '460px',
          }}
        >
          <h1
            className="text-7xl lg:text-8xl font-normal text-[#f4f1e6] tracking-tight leading-[1.08] opacity-95 whitespace-pre-line"
            style={{ fontFamily: "'Bookmania', 'Newsreader', 'Georgia', serif" }}
          >
            A team-made{'\n'}collection for Amanda
          </h1>
        </div>

        {/* CONTINUOUS CONNECTED JEWELRY ROPE CONNECTING ALL CHARMS */}
        <ConnectedRope contributions={contributions} />

        {/* DYNAMIC BEADED CHARMS AND NOTES IN INFINITE WORLD SPACE */}
        {contributions.map((item) => (
          <div
            key={item.id}
            data-piece-id={item.id}
            style={{
              position: 'absolute',
              left: `${item.posX}px`,
              top: `${item.posY}px`,
              transform: `rotate(${item.rotation || 0}deg)`,
              zIndex: item.zIndex || 10,
            }}
            className="pointer-events-auto transition-transform duration-75 cursor-grab active:cursor-grabbing"
          >
            {item.type === 'tribute' ? (
              <TributePiece
                contribution={item}
                isDragging={draggingId === item.id}
              />
            ) : item.type === 'charm' ? (
              <BeadedCharm
                contribution={item}
                isDragging={draggingId === item.id}
              />
            ) : (
              <PostalLetter
                contribution={item}
                isDragging={draggingId === item.id}
              />
            )}
          </div>
        ))}
      </div>

      {/* POPUP: Congratulate Amanda Start Screen */}
      <CongratulateModal
        isOpen={isCongratulateOpen}
        onClose={() => setIsCongratulateOpen(false)}
      />

      {/* COMPOSER: Add Beaded Charm & Note */}
      <CharmComposerModal
        isOpen={isComposerOpen}
        onClose={() => setIsComposerOpen(false)}
        onAddContribution={handleAddContribution}
      />
    </div>
  );
}
