'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Maximize2,
} from 'lucide-react';

interface ImageItem {
  src: string;
  alt: string;
}

const MIN_SCALE = 1;
const MAX_SCALE = 5;
const ZOOM_STEP = 0.5;

export default function BlogImageLightbox() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const dragStartRef = useRef({ x: 0, y: 0 });
  const posStartRef = useRef({ x: 0, y: 0 });
  const didMoveRef = useRef(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const resetTransform = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const closeLightbox = useCallback(() => {
    setIsOpen(false);
    resetTransform();
  }, [resetTransform]);

  // Close lightbox on route change
  useEffect(() => {
    closeLightbox();
  }, [pathname, closeLightbox]);

  // Delegated click listener for all blog post content images
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const imgElement = target.closest('article .prose img') as HTMLImageElement | null;
      if (!imgElement || imgElement.dataset.noLightbox === 'true') return;

      // If image is inside an anchor link that navigates somewhere else, prevent default only if not external link
      e.preventDefault();
      e.stopPropagation();

      const allNodeImgs = Array.from(
        document.querySelectorAll<HTMLImageElement>('article .prose img')
      ).filter((img) => img.dataset.noLightbox !== 'true' && img.getAttribute('src'));

      const collected: ImageItem[] = allNodeImgs.map((img) => ({
        src: img.currentSrc || img.src,
        alt: img.alt || 'Blog Post Image',
      }));

      const clickedIdx = allNodeImgs.indexOf(imgElement);
      setImages(collected);
      setCurrentIndex(clickedIdx >= 0 ? clickedIdx : 0);
      resetTransform();
      setIsOpen(true);
    };

    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, [resetTransform]);

  // Lock body scroll when open
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  const handleZoomIn = useCallback(() => {
    setScale((prev) => Math.min(MAX_SCALE, +(prev + ZOOM_STEP).toFixed(2)));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale((prev) => {
      const next = Math.max(MIN_SCALE, +(prev - ZOOM_STEP).toFixed(2));
      if (next <= 1) {
        setPosition({ x: 0, y: 0 });
      }
      return next;
    });
  }, []);

  const handlePrev = useCallback(() => {
    if (images.length <= 1) return;
    resetTransform();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length, resetTransform]);

  const handleNext = useCallback(() => {
    if (images.length <= 1) return;
    resetTransform();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length, resetTransform]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        handleZoomIn();
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        handleZoomOut();
      } else if (e.key === '0') {
        e.preventDefault();
        resetTransform();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeLightbox, handleZoomIn, handleZoomOut, resetTransform, handlePrev, handleNext]);

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.35 : -0.35;
    setScale((prev) => {
      const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, +(prev + delta).toFixed(2)));
      if (next <= 1) {
        setPosition({ x: 0, y: 0 });
      }
      return next;
    });
  };

  // Pointer drag for panning when zoomed in
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    didMoveRef.current = false;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    posStartRef.current = { ...position };

    if (scale > 1) {
      setIsDragging(true);
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || scale <= 1) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      didMoveRef.current = true;
    }
    setPosition({
      x: posStartRef.current.x + dx,
      y: posStartRef.current.y + dy,
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Ignore if pointer capture was already released
      }
    }
  };

  // Click on image toggles zoom (1x -> 2.25x centered on clicked point -> 1x)
  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    e.stopPropagation();
    if (didMoveRef.current) {
      didMoveRef.current = false;
      return;
    }

    if (scale > 1) {
      resetTransform();
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      const targetScale = 2.25;
      const offsetX = (rect.left + rect.width / 2 - e.clientX) * (targetScale - 1);
      const offsetY = (rect.top + rect.height / 2 - e.clientY) * (targetScale - 1);
      setScale(targetScale);
      setPosition({ x: offsetX, y: offsetY });
    }
  };

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-[#02081b]/95 backdrop-blur-xl select-none animate-fade-in"
      onWheel={handleWheel}
      onClick={closeLightbox}
      role="dialog"
      aria-modal="true"
      aria-label={currentImage.alt}
    >
      {/* Top Control Bar */}
      <div
        className="relative z-20 flex items-center justify-between px-4 sm:px-6 py-3.5 bg-slate-950/70 border-b border-white/10 backdrop-blur-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-accent/10 border border-brand-accent/30 text-brand-accent text-xs font-bold tracking-wider uppercase shrink-0">
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Enhanced View</span>
          </div>
          {images.length > 1 && (
            <span className="text-xs font-semibold text-slate-400 shrink-0">
              {currentIndex + 1} / {images.length}
            </span>
          )}
          <span className="text-sm font-medium text-slate-200 truncate hidden md:inline-block">
            {currentImage.alt}
          </span>
        </div>

        {/* Zoom & Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={scale <= MIN_SCALE}
            title="Zoom Out (-)"
            aria-label="Zoom Out"
            className="p-2 rounded-lg bg-white/5 hover:bg-white/15 disabled:opacity-35 disabled:pointer-events-none text-slate-200 border border-white/10 transition-colors cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={resetTransform}
            title="Reset Zoom (0)"
            className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-xs font-bold text-brand-accent border border-white/10 min-w-[3.75rem] text-center transition-colors cursor-pointer"
          >
            {Math.round(scale * 100)}%
          </button>

          <button
            type="button"
            onClick={handleZoomIn}
            disabled={scale >= MAX_SCALE}
            title="Zoom In (+)"
            aria-label="Zoom In"
            className="p-2 rounded-lg bg-white/5 hover:bg-white/15 disabled:opacity-35 disabled:pointer-events-none text-slate-200 border border-white/10 transition-colors cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={resetTransform}
            disabled={scale === 1 && position.x === 0 && position.y === 0}
            title="Reset View"
            aria-label="Reset View"
            className="p-2 rounded-lg bg-white/5 hover:bg-white/15 disabled:opacity-35 disabled:pointer-events-none text-slate-200 border border-white/10 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <a
            href={currentImage.src}
            target="_blank"
            rel="noopener noreferrer"
            title="Open original image in new tab"
            aria-label="Open original image in new tab"
            className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-slate-200 border border-white/10 transition-colors hidden sm:inline-flex items-center justify-center"
          >
            <ExternalLink className="w-4 h-4" />
          </a>

          <div className="w-px h-5 bg-white/10 mx-1" />

          <button
            type="button"
            onClick={closeLightbox}
            title="Close (Esc)"
            aria-label="Close Lightbox"
            className="p-2 rounded-lg bg-rose-500/15 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Interactive Image Stage */}
      <div
        className={`relative flex-1 flex items-center justify-center overflow-hidden p-4 sm:p-8 ${
          scale > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-zoom-out'
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Previous Image Button */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            title="Previous Image (Left Arrow)"
            aria-label="Previous Image"
            className="absolute left-3 sm:left-6 z-20 p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-white/15 shadow-2xl transition-all hover:scale-105 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        <img
          ref={imgRef}
          src={currentImage.src}
          alt={currentImage.alt}
          draggable={false}
          onClick={handleImageClick}
          style={{
            transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${scale})`,
            transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className={`max-w-[92vw] max-h-[80vh] w-auto h-auto object-contain rounded-lg shadow-[0_0_60px_rgba(0,0,0,0.8)] border border-white/10 ${
            scale > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-zoom-in'
          }`}
        />

        {/* Next Image Button */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            title="Next Image (Right Arrow)"
            aria-label="Next Image"
            className="absolute right-3 sm:right-6 z-20 p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-white/15 shadow-2xl transition-all hover:scale-105 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Bottom Caption & Instructions Bar */}
      <div
        className="relative z-20 flex flex-col sm:flex-row items-center justify-between gap-2 px-4 sm:px-6 py-3 bg-slate-950/70 border-t border-white/10 backdrop-blur-md text-xs text-slate-400"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-slate-300 font-medium text-center sm:text-left truncate max-w-full">
          {currentImage.alt}
        </p>
        <p className="text-[11px] text-slate-400 shrink-0">
          Click image or scroll to zoom &bull; Drag to pan when zoomed &bull; Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-200 font-mono text-[10px]">ESC</kbd> to close
        </p>
      </div>
    </div>
  );
}
