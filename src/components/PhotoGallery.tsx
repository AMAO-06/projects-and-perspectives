import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { entryCode, mediaUrl } from "@/lib/site-content";

/** Photo grid with a full-screen viewer (keyboard, swipe, true fullscreen). */
export function PhotoGallery({ photos, title }: { photos: string[]; title: string }) {
  const [index, setIndex] = useState<number | null>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<number | null>(null);
  const isOpen = index !== null;

  const close = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
    setIndex(null);
  }, []);

  const step = useCallback(
    (delta: number) =>
      setIndex((i) => (i === null || photos.length === 0 ? i : (i + delta + photos.length) % photos.length)),
    [photos.length],
  );

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
    else void viewerRef.current?.requestFullscreen?.().catch(() => {});
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [isOpen, close, step]);

  if (photos.length === 0) {
    return <p className="mt-12 font-mono text-sm text-muted-foreground">// no photos uploaded yet</p>;
  }

  const current = index !== null ? photos[index] : undefined;
  const navButton =
    "absolute rounded-full border bg-card/90 p-2 text-foreground transition-colors hover:border-primary hover:text-primary";

  return (
    <>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((path, i) => (
          <button
            key={path}
            type="button"
            onClick={() => setIndex(i)}
            className="frame group relative overflow-hidden rounded-xl border bg-card text-left transition-all hover:border-primary hover:shadow-glow"
          >
            <img
              src={mediaUrl(path)}
              alt={`${title} photo ${i + 1}`}
              className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <span className="absolute bottom-2 left-2 rounded bg-background/80 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-primary">
              {entryCode("FIG", i)}
            </span>
          </button>
        ))}
      </div>

      {current && (
        <div
          ref={viewerRef}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-background/95 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} photo viewer`}
          onClick={close}
          onTouchStart={(e) => {
            touchStart.current = e.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(e) => {
            const start = touchStart.current;
            const end = e.changedTouches[0]?.clientX;
            touchStart.current = null;
            if (start === null || end === undefined) return;
            if (Math.abs(end - start) > 50) step(end < start ? 1 : -1);
          }}
        >
          <button type="button" aria-label="Close viewer" onClick={close} className={`${navButton} right-4 top-4`}>
            <X className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Toggle full screen"
            onClick={(e) => {
              e.stopPropagation();
              toggleFullscreen();
            }}
            className={`${navButton} right-16 top-4`}
          >
            <Maximize2 className="h-5 w-5" />
          </button>
          {photos.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous photo"
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
                className={`${navButton} left-4`}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                aria-label="Next photo"
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
                className={`${navButton} right-4`}
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
          <img
            src={mediaUrl(current)}
            alt={`${title} photo ${(index ?? 0) + 1}`}
            className="max-h-[85vh] max-w-[90vw] rounded-lg border object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-4 font-mono text-sm text-muted-foreground">
            {entryCode("FIG", index ?? 0)} · {(index ?? 0) + 1} / {photos.length}
          </div>
        </div>
      )}
    </>
  );
}
