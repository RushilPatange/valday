import { useState, useCallback, useRef, useEffect } from "react";
import confetti from "canvas-confetti";

/* ──────────────────────────────────────────────
 * CONFIG — customise messages, images & captions
 * ────────────────────────────────────────────── */

const IMAGES = Array.from({ length: 12 }, (_, i) =>
  // We added import.meta.env.BASE_URL so it knows to look inside the /valday/ folder!
  `${import.meta.env.BASE_URL}images/image${String(i + 1).padStart(2, "0")}.jpg`
);

const NO_MESSAGES = [
  "NO?? Rude✋",
  "So you hate me",
  "Do I need to remind you of good times?",
  "I can bring you lindor chocolate! 🍫",
  "GINDUUUUU why are you like this",
  "Fine here are my favorite photos of you",
  "I can't believe you won't be my valentine",
  "I'm running out of moves here…",
  "Last chance before the button gets… suspicious 👀",
  "Alright. You asked for it. 🏃‍♂️",
  "You can't catch me now! 💨",
  "Still trying? How cute 😏",
];

const CAPTIONS = [
  "April 25th 2025 - Loved you taking me to the barge formal",
  "January 25th 2025 - Walk of Shame outfit 🤌",
  "May 5th 2025 - Offically dating! ❤️",
  "April 17th 2025 - Eyebrow Salon",
  "Jan 24th 2026 - Snowed in with the gyattos",
  "January 25th 2026 - The gyattos themselves",
  "July 19th 2025 - Cosplaying a raccoon",
  "August 30th 2025 - The Weekend fit",
  "December 19th 2025 - No flex zone",
  "Feburary 7th 2026 - High chair activites",
  "Spetember 28th 2025 - My absolute favorite girl in the world ❤️",
  "I love you :) - bungoo #2",
];

const RUNAWAY_THRESHOLD = 10;
const YES_GROWTH_FACTOR = 0.05; // 5% per click

/* ──────────────────────────────────────────────
 * COMPONENT
 * ────────────────────────────────────────────── */

const ValentinePage = () => {
  const [noCount, setNoCount] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const [noPos, setNoPos] = useState<{ x: number; y: number } | null>(null);
  const noRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reduced motion check
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── Cycle to next image (no immediate repeats) ── */
  const nextImage = useCallback(() => {
    setImageIndex((prev) => (prev + 1) % IMAGES.length);
  }, []);

  /* ── Move the No button to a random safe spot ── */
  const moveNoButton = useCallback(() => {
    if (!containerRef.current || !noRef.current) return;
    const container = containerRef.current.getBoundingClientRect();
    const btn = noRef.current.getBoundingClientRect();
    const padding = 16;

    // Max position within the container
    const maxX = container.width - btn.width - padding * 2;
    const maxY = container.height - btn.height - padding * 2;

    let x: number, y: number;
    let attempts = 0;

    // Avoid overlapping the center (where Yes button lives)
    do {
      x = Math.random() * Math.max(maxX, 100);
      y = Math.random() * Math.max(maxY, 100);
      attempts++;
    } while (
      attempts < 20 &&
      Math.abs(x - container.width / 2) < 80 &&
      Math.abs(y - container.height / 2) < 40
    );

    setNoPos({ x: Math.max(0, x), y: Math.max(0, y) });
  }, []);

  /* ── Handle No click ── */
  const handleNo = useCallback(() => {
    const newCount = noCount + 1;
    setNoCount(newCount);
    nextImage();

    if (newCount >= RUNAWAY_THRESHOLD) {
      moveNoButton();
    }
  }, [noCount, nextImage, moveNoButton]);

  /* ── Handle Yes click ── */
  const handleYes = useCallback(() => {
    setAccepted(true);
    if (!prefersReducedMotion) {
      // Fire confetti 🎉
      const duration = 3000;
      const end = Date.now() + duration;
      const colors = ["#e11d73", "#ff6b6b", "#ffd93d", "#ff8fab", "#c9184a"];

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors,
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors,
        });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    }
  }, [prefersReducedMotion]);

  /* ── Runaway on hover (desktop) ── */
  const handleNoHover = useCallback(() => {
    if (noCount >= RUNAWAY_THRESHOLD) {
      moveNoButton();
    }
  }, [noCount, moveNoButton]);

  /* ── Yes button scale ── */
  const yesScale = 1 + Math.min(noCount, 10) * YES_GROWTH_FACTOR;

  /* ── Current message & caption ── */
  const currentMessage =
    noCount > 0
      ? NO_MESSAGES[Math.min(noCount - 1, NO_MESSAGES.length - 1)]
      : null;
  const currentCaption = CAPTIONS[imageIndex % CAPTIONS.length];

  /* ────── SUCCESS SCREEN ────── */
  if (accepted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4 relative overflow-hidden">
        <div className="valentine-card-shadow rounded-2xl bg-card p-6 sm:p-10 text-center max-w-md w-full animate-bounce-in">
          <h1 className="font-display text-3xl sm:text-5xl text-primary mb-4">
            YAY!! 💖
          </h1>
          <div className="rounded-xl overflow-hidden mb-6 mx-auto max-w-xs">
            <img
              src={IMAGES[IMAGES.length - 1]}
              alt="Valentine celebration"
              className="w-full h-auto object-cover"
            />
          </div>
          <p className="text-lg sm:text-xl font-body font-semibold text-foreground">
            Can't wait to be your Valentine! I love you :) - bungoo #2 🥰
          </p>
          <p className="text-muted-foreground mt-2 text-sm">
            Wu Chow on Feb 14th at 9:30pm. I'll pick you up
          </p>
        </div>
      </div>
    );
  }

  /* ────── MAIN SCREEN ────── */
  return (
    <div
      ref={containerRef}
      className="relative flex min-h-screen items-center justify-center bg-background p-4 overflow-hidden"
    >
      {/* Floating hearts bg decoration */}
      <div className="float-hearts absolute inset-0 pointer-events-none" />

      <div className="valentine-card-shadow rounded-2xl bg-card p-5 sm:p-8 text-center max-w-md w-full z-10">
        {/* Headline */}
        <h1 className="font-display text-2xl sm:text-4xl text-primary mb-1 animate-heartbeat">
          Will you be my Valentine? 💘
        </h1>

        {/* Message area */}
        <div className="h-8 flex items-center justify-center">
          {currentMessage && (
            <p
              key={noCount}
              className="text-muted-foreground text-sm sm:text-base font-semibold animate-wiggle"
            >
              {currentMessage}
            </p>
          )}
        </div>

        {/* Photo */}
        <div className="rounded-xl overflow-hidden my-4 mx-auto max-w-xs">
          <img
            src={IMAGES[imageIndex]}
            alt="Valentine image"
            className="w-full h-auto object-cover transition-opacity duration-300"
          />
        </div>

        {/* Caption */}
        <p className="text-sm text-muted-foreground mb-5 font-medium">
          {currentCaption}
        </p>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-4 relative">
          {/* Yes */}
          <button
            onClick={handleYes}
            style={{ transform: `scale(${yesScale})` }}
            className="rounded-full valentine-gradient px-6 py-3 text-primary-foreground font-bold text-base sm:text-lg shadow-lg
                       transition-transform duration-200 hover:brightness-110 active:scale-95 z-20"
          >
            Yes 💖
          </button>

          {/* No — either in-flow or absolute when runaway */}
          {noCount < RUNAWAY_THRESHOLD ? (
            <button
              ref={noRef}
              onClick={handleNo}
              className="rounded-full bg-secondary px-6 py-3 text-secondary-foreground font-bold text-base sm:text-lg
                         transition-all duration-200 hover:bg-muted active:scale-95"
            >
              No 😢
            </button>
          ) : (
            <button
              ref={noRef}
              onClick={handleNo}
              onMouseEnter={handleNoHover}
              onTouchStart={(e) => {
                e.preventDefault();
                moveNoButton();
              }}
              style={
                noPos
                  ? {
                      position: "fixed",
                      left: noPos.x,
                      top: noPos.y,
                      transition: prefersReducedMotion
                        ? "none"
                        : "all 0.3s ease-out",
                    }
                  : undefined
              }
              className="rounded-full bg-secondary px-6 py-3 text-secondary-foreground font-bold text-base sm:text-lg
                         shadow-md z-50"
            >
              No 😢
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ValentinePage;
