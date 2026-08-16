'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView } from 'framer-motion';

// ─────────────────────────────────────────────
// INTERFACES
// ─────────────────────────────────────────────
interface Memory {
  id: string;
  title: string;
  description: string | null;
  date: string;
  imageUrl: string | null;
  location: string | null;
  emoji: string | null;
  sortOrder: number;
}

interface GalleryItem {
  id: string;
  mediaUrl: string;
  mediaType: string;
  caption: string | null;
}

interface Project {
  title: string;
  slug: string;
  subtitle: string | null;
  personOneName: string | null;
  personTwoName: string | null;
  occasion: string | null;
  startDate: string | null;
  coverImageUrl: string | null;
  backgroundMusicUrl?: string | null;
  heroConfig: any;
  endingConfig: any;
  memories: Memory[];
  galleryItems: GalleryItem[];
}

// ─────────────────────────────────────────────
// GOLD DUST & AMBIENT SPARKLES (Canvas 60fps)
// ─────────────────────────────────────────────
function GoldDustCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: { x: number; y: number; size: number; speedY: number; speedX: number; opacity: number; opacitySpeed: number }[] = [];

    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 1 + Math.random() * 3,
        speedY: -(0.2 + Math.random() * 0.5),
        speedX: (Math.random() - 0.5) * 0.3,
        opacity: Math.random(),
        opacitySpeed: 0.005 + Math.random() * 0.01,
      });
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speedY;
        p.x += p.speedX;
        p.opacity += p.opacitySpeed;

        if (p.opacity > 1 || p.opacity < 0) {
          p.opacitySpeed = -p.opacitySpeed;
        }

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10 || p.x > width + 10) {
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 200, 66, ${Math.max(0, Math.min(1, p.opacity))})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#f5c842';
        ctx.fill();
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10" />;
}

// ─────────────────────────────────────────────
// 3D FALLING ROSE PETALS
// ─────────────────────────────────────────────
function FallingRosePetals() {
  const petals = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 10,
    duration: 8 + Math.random() * 8,
    size: 15 + Math.random() * 20,
    rotation: Math.random() * 360,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-20">
      {petals.map(p => (
        <motion.div
          key={p.id}
          initial={{ y: '-10vh', opacity: 0, x: `${p.x}vw`, rotate: p.rotation }}
          animate={{
            y: '110vh',
            opacity: [0, 1, 1, 0],
            x: [`${p.x}vw`, `${p.x + (Math.random() - 0.5) * 15}vw`],
            rotate: [p.rotation, p.rotation + 360 + Math.random() * 360],
          }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute"
          style={{ width: p.size, height: p.size }}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]">
            <path
              d="M12 2C8.5 2 4 4.5 4 9C4 14.5 12 22 12 22C12 22 20 14.5 20 9C20 4.5 15.5 2 12 2Z"
              fill="url(#roseGrad)"
            />
            <defs>
              <linearGradient id="roseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d81b60" />
                <stop offset="50%" stopColor="#880e4f" />
                <stop offset="100%" stopColor="#310018" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// PROMISE CARD (Tap to Flip)
// ─────────────────────────────────────────────
function PromiseCard({ emoji, text, secretNote, cardStyle, onFlip }: { emoji: string; text: string; secretNote: string; cardStyle: string; onFlip: () => void }) {
  const [flipped, setFlipped] = useState(false);

  const toggle = () => {
    if (!flipped) onFlip();
    setFlipped(!flipped);
  };

  const isGold = cardStyle === 'gold';

  return (
    <div className="w-full h-44 perspective cursor-pointer" onClick={toggle}>
      <motion.div
        className="w-full h-full relative preserve-3d transition-transform duration-700"
        style={{ transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 backface-hidden rounded-2xl p-4 flex flex-col items-center justify-center text-center border"
          style={{
            background: 'rgba(26, 0, 16, 0.65)',
            backdropFilter: 'blur(8px)',
            borderColor: isGold ? '#f5c842' : '#8b0030',
            boxShadow: isGold ? '0 0 15px rgba(245, 200, 66, 0.15)' : '0 0 15px rgba(139, 0, 48, 0.15)',
          }}
        >
          <span className="text-4xl mb-3">{emoji}</span>
          <p className="text-sm font-semibold leading-snug" style={{ color: '#f5ead8', fontFamily: 'Be Vietnam Pro, sans-serif' }}>
            {text || 'A beautiful vow to hold forever.'}
          </p>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 backface-hidden rounded-2xl p-4 flex flex-col items-center justify-center text-center border rotate-y-180"
          style={{
            background: 'linear-gradient(135deg, #2a0815 0%, #4c0f24 100%)',
            borderColor: '#f5c842',
            boxShadow: 'inset 0 0 20px rgba(245, 200, 66, 0.2)',
          }}
        >
          <span className="text-xs font-bold uppercase tracking-wider text-yellow-500 mb-1" style={{ fontFamily: 'Plus Jakarta Sans' }}>Inside My Heart</span>
          <p className="text-xs leading-relaxed italic" style={{ color: '#fff', fontFamily: 'Be Vietnam Pro' }}>
            "{secretNote || 'I promise to cherish this vow with all my soul.'}"
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────
// STAT COUNTER WITH RUNNING ANIMATION
// ─────────────────────────────────────────────
function StatCounter({ label, value }: { label: string; value: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const end = value;
    if (start === end) return;

    const duration = 2000;
    const stepTime = Math.max(Math.floor(duration / end), 20);
    const timer = setInterval(() => {
      start += Math.ceil(end / 100);
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <div ref={ref} className="text-center p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(245,200,66,0.1)' }}>
      <div className="text-2xl font-bold text-yellow-500" style={{ fontFamily: 'Plus Jakarta Sans' }}>
        {count.toLocaleString()}
      </div>
      <div className="text-xs uppercase tracking-wide text-white/50 mt-1" style={{ fontFamily: 'Be Vietnam Pro' }}>
        {label}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PROMISE CONFETTI
// ─────────────────────────────────────────────
function PromiseConfetti() {
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: -10,
    color: ['#f5c842', '#ff4081', '#ffffff', '#e040fb'][i % 4],
    delay: Math.random() * 2,
    size: 4 + Math.random() * 6,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[9999]">
      {pieces.map(p => (
        <motion.div
          key={p.id}
          initial={{ y: '-10vh', x: `${p.x}vw`, rotate: 0 }}
          animate={{ y: '110vh', x: `${p.x + (Math.random() - 0.5) * 20}vw`, rotate: 720 }}
          transition={{ duration: 3 + Math.random() * 2, delay: p.delay, ease: 'easeOut' }}
          className="absolute"
          style={{ width: p.size, height: p.size, background: p.color, borderRadius: '50%' }}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// GRAND FINALE FIREWORKS
// ─────────────────────────────────────────────
function Fireworks() {
  const list = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: 10 + Math.random() * 80,
    y: 20 + Math.random() * 40,
    delay: i * 0.7,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[99]">
      {list.map(f => (
        <motion.div
          key={f.id}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.2, 1.4, 0], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.6, delay: f.delay, repeat: Infinity, repeatDelay: 4 }}
          className="absolute w-32 h-32 rounded-full border border-yellow-500/40"
          style={{
            left: `${f.x}%`,
            top: `${f.y}%`,
            background: 'radial-gradient(circle, rgba(245,200,66,0.3) 0%, transparent 70%)',
            boxShadow: '0 0 30px rgba(245,200,66,0.4)',
          }}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN THEME COMPONENT
// ─────────────────────────────────────────────
export default function VelvetRomanceTheme({ project }: { project: Project }) {
  const cfg = project.heroConfig || {};
  const ending = project.endingConfig || {};

  const [sealOpen, setSealOpen] = useState(false);
  const [flippedCount, setFlippedCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleCardFlip = () => {
    setFlippedCount(prev => {
      const next = prev + 1;
      const totalPromises = (cfg.promises || []).length;
      if (next >= totalPromises && totalPromises > 0) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen text-white relative select-none" style={{ background: 'linear-gradient(180deg, #16000c 0%, #2e0018 50%, #0c0006 100%)', overflowX: 'hidden' }}>
      {/* Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700;800&family=Be+Vietnam+Pro:ital,wght@0,400;0,600;1,400&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap');
        .perspective { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>

      {/* Ambient background particles */}
      <GoldDustCanvas />
      <FallingRosePetals />
      {showConfetti && <PromiseConfetti />}
      {ending.finaleStyle === 'all' && sealOpen && <Fireworks />}

      {/* Render intro cover wax seal envelope */}
      <AnimatePresence>
        {!sealOpen ? (
          <motion.div
            key="envelope"
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#1c000f] to-[#3a001d]"
          >
            {/* Drifting petals only inside envelope screen */}
            <FallingRosePetals />
            <GoldDustCanvas />

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="w-full max-w-sm flex flex-col items-center"
            >
              {/* Gold/Crimson embossed title */}
              <h1
                className="text-center font-bold tracking-widest text-xl mb-8 select-none"
                style={{
                  color: '#f5c842',
                  fontFamily: 'Playfair Display, serif',
                  textShadow: '0 0 15px rgba(245,200,66,0.3)',
                }}
              >
                {cfg.heroTagline || 'FOR YOU, MY LOVE'}
              </h1>

              {/* The Wax Seal Envelope Box */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSealOpen(true)}
                className="w-full aspect-[4/3] rounded-3xl relative flex flex-col items-center justify-center cursor-pointer border border-[#f5c842]/30"
                style={{
                  background: 'linear-gradient(145deg, #2b0216 0%, #4e0329 100%)',
                  boxShadow: '0 25px 60px rgba(0,0,0,0.5), inset 0 0 20px rgba(245,200,66,0.15)',
                }}
              >
                {/* Gold Seal Design */}
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center border-2"
                  style={{
                    borderColor: '#f5c842',
                    background: 'linear-gradient(135deg, #f5c842 0%, #b48500 100%)',
                    boxShadow: '0 0 20px rgba(245,200,66,0.4)',
                  }}
                >
                  <span className="text-3xl text-[#1a0010]">🌹</span>
                </div>
                <p className="text-xs uppercase tracking-widest font-semibold mt-4 text-[#f5c842]/70" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                  Tap to break the seal
                </p>
              </motion.div>

              <p className="text-white/40 text-xs mt-8 italic text-center" style={{ fontFamily: 'Be Vietnam Pro' }}>
                {cfg.welcomePopupText || 'A romantic tribute created especially for you.'}
              </p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="diary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-md mx-auto px-5 py-8 space-y-12 pb-24 relative z-30"
          >
            {/* SECTION 1: HEADER CARD */}
            <div className="text-center py-6">
              {project.coverImageUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-32 h-32 rounded-full mx-auto overflow-hidden border-2 border-yellow-500/40 shadow-glow mb-4"
                >
                  <img src={project.coverImageUrl} alt="cover" className="w-full h-full object-cover" />
                </motion.div>
              )}
              <h1 className="text-3xl font-bold font-serif text-yellow-500" style={{ fontFamily: 'Playfair Display' }}>
                {project.title}
              </h1>
              {project.subtitle && (
                <p className="text-white/60 text-sm mt-1" style={{ fontFamily: 'Be Vietnam Pro' }}>
                  {project.subtitle}
                </p>
              )}
            </div>

            {/* SECTION 2: SECRET LOVE LETTER */}
            {cfg.letterMessage && (
              <div
                className="p-6 rounded-2xl border border-yellow-500/20"
                style={{
                  background: 'linear-gradient(135deg, rgba(26,0,16,0.85) 0%, rgba(50,0,25,0.85) 100%)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">✉️</span>
                  <span className="font-bold text-sm tracking-wider uppercase text-yellow-500" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                    Secret Scroll Letter
                  </span>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap font-sans text-white/80" style={{ fontFamily: 'Be Vietnam Pro' }}>
                  {cfg.letterMessage}
                </p>
                {cfg.quillSignature && (
                  <p className="text-right text-yellow-500 font-serif italic mt-4 text-md" style={{ fontFamily: 'Playfair Display' }}>
                    — With Love, {cfg.quillSignature} ✒️
                  </p>
                )}
              </div>
            )}

            {/* SECTION 3: STORY TIMELINE */}
            {project.memories.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">💍</span>
                  <span className="font-bold text-sm tracking-wider uppercase text-yellow-500" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                    Our Chapters Together
                  </span>
                </div>

                <div className="relative border-l border-yellow-500/20 ml-3 pl-6 space-y-8">
                  {project.memories.map((m, i) => (
                    <div key={m.id} className="relative">
                      {/* Circle node */}
                      <div
                        className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 border-yellow-500"
                        style={{ background: '#1c000f', boxShadow: '0 0 10px #f5c842' }}
                      />
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold font-serif text-yellow-500" style={{ fontFamily: 'Playfair Display' }}>
                            {m.emoji} {m.title}
                          </h3>
                          <span className="text-xs text-white/40">{new Date(m.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}</span>
                        </div>
                        {m.description && (
                          <p className="text-xs text-white/60 leading-relaxed" style={{ fontFamily: 'Be Vietnam Pro' }}>
                            {m.description}
                          </p>
                        )}
                        {m.imageUrl && (
                          <div className="rounded-xl overflow-hidden max-h-40 border border-white/5">
                            <img src={m.imageUrl} alt={m.title} className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 4: PROMISE WALL */}
            {cfg.promises && cfg.promises.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🌹</span>
                    <span className="font-bold text-sm tracking-wider uppercase text-yellow-500" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                      {cfg.promiseWallTitle || 'Our Vows'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {cfg.promises.map((p: any, idx: number) => (
                    <PromiseCard
                      key={idx}
                      emoji={p.emoji}
                      text={p.text}
                      secretNote={p.secretNote}
                      cardStyle={cfg.promiseCardStyle}
                      onFlip={handleCardFlip}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 5: STATS */}
            {cfg.showStats && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📊</span>
                  <span className="font-bold text-sm tracking-wider uppercase text-yellow-500" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                    Love Ledger Stats
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <StatCounter label={cfg.customStatLabel1 || 'Dates'} value={cfg.customStatValue1 || 0} />
                  <StatCounter label={cfg.customStatLabel2 || 'Trips'} value={cfg.customStatValue2 || 0} />
                  <StatCounter label={cfg.customStatLabel3 || 'Hours'} value={cfg.customStatValue3 || 0} />
                </div>

                {cfg.loveCategories && cfg.loveCategories.length > 0 && (
                  <div className="p-5 rounded-2xl border border-yellow-500/10" style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <p className="text-xs uppercase tracking-wide text-white/50 mb-3" style={{ fontFamily: 'Be Vietnam Pro' }}>
                      Love Time Distribution
                    </p>
                    <div className="space-y-3">
                      {cfg.loveCategories.map((c: any, idx: number) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span>{c.label}</span>
                            <span>{c.percent}%</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-white/5">
                            <div className="h-full rounded-full bg-yellow-500" style={{ width: `${c.percent}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SECTION 6: PHOTO CAROUSEL */}
            {project.galleryItems.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📸</span>
                  <span className="font-bold text-sm tracking-wider uppercase text-yellow-500" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                    {cfg.galleryTitle || 'Moments Frame'}
                  </span>
                </div>
                {cfg.galleryQuote && (
                  <p className="text-xs italic text-white/50 text-center" style={{ fontFamily: 'Be Vietnam Pro' }}>
                    "{cfg.galleryQuote}"
                  </p>
                )}

                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x">
                  {project.galleryItems.map((g, idx) => (
                    <div key={g.id} className="w-64 flex-shrink-0 snap-center rounded-2xl overflow-hidden border border-white/10" style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <div className="aspect-[4/3] w-full overflow-hidden">
                        <img
                          src={g.mediaUrl}
                          alt={g.caption || ''}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          style={{ filter: cfg.sepiaFilter ? 'sepia(0.35) contrast(1.05)' : 'none' }}
                        />
                      </div>
                      {g.caption && (
                        <p className="p-3 text-xs text-white/70 text-center font-sans truncate" style={{ fontFamily: 'Be Vietnam Pro' }}>
                          {g.caption}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 7: ENDING FINALE */}
            <div className="text-center py-12 border-t border-yellow-500/10 space-y-4">
              <h2 className="text-2xl font-serif text-yellow-500" style={{ fontFamily: 'Playfair Display' }}>
                {ending.title || 'Forever Yours'}
              </h2>
              <p className="text-sm text-white/70 leading-relaxed font-sans" style={{ fontFamily: 'Be Vietnam Pro' }}>
                {ending.message || 'Thank you for being my constant, my love, and my absolute favorite person.'}
              </p>
              <div className="text-4xl">🌹</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
