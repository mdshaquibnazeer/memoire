'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

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
// CURSOR SPARKLE TRAIL (HTML5 Canvas 60fps)
// ─────────────────────────────────────────────
function CursorSparkleTrail() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let points: { x: number; y: number; age: number; maxAge: number; size: number; vx: number; vy: number; color: string }[] = [];
    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      const colors = ['#f5c842', '#ff4081', '#ffffff', '#e040fb'];
      for (let i = 0; i < 3; i++) {
        points.push({
          x: e.clientX,
          y: e.clientY,
          age: 0,
          maxAge: 30 + Math.random() * 20,
          size: 1 + Math.random() * 3,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5 - 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const colors = ['#f5c842', '#ff4081', '#ffffff', '#e040fb'];
      const touch = e.touches[0];
      for (let i = 0; i < 3; i++) {
        points.push({
          x: touch.clientX,
          y: touch.clientY,
          age: 0,
          maxAge: 30 + Math.random() * 20,
          size: 1 + Math.random() * 3,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5 - 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      points = points.filter(p => {
        p.age++;
        p.x += p.vx;
        p.y += p.vy;
        if (p.age >= p.maxAge) return false;

        const opacity = 1 - p.age / p.maxAge;
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        return true;
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[998]" />;
}

// ─────────────────────────────────────────────
// TAP EXPLOSION (Hearts, Rose Petals, Sparkles)
// ─────────────────────────────────────────────
interface BurstParticle {
  id: number;
  x: number;
  y: number;
  emoji: string;
  size: number;
  angle: number;
  speed: number;
}
const BURST_EMOJIS = ['🌹', '💖', '💍', '✨', '💕', '⭐', '🦋', '💝', '🎀', '❤️'];

function TapExplosion() {
  const [particles, setParticles] = useState<BurstParticle[]>([]);
  const counter = useRef(0);

  const handleClick = useCallback((e: MouseEvent) => {
    const count = 12;
    const newParticles: BurstParticle[] = Array.from({ length: count }, (_, i) => ({
      id: counter.current++,
      x: e.clientX,
      y: e.clientY,
      emoji: BURST_EMOJIS[Math.floor(Math.random() * BURST_EMOJIS.length)],
      size: 16 + Math.random() * 20,
      angle: (i / count) * 360 + Math.random() * 30,
      speed: 60 + Math.random() * 90,
    }));
    setParticles(p => [...p, ...newParticles]);
    setTimeout(() => {
      setParticles(p => p.filter(pp => !newParticles.find(np => np.id === pp.id)));
    }, 1000);
  }, []);

  useEffect(() => {
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [handleClick]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[999] overflow-hidden">
      <AnimatePresence>
        {particles.map(p => {
          const rad = (p.angle * Math.PI) / 180;
          return (
            <motion.span
              key={p.id}
              initial={{ x: p.x - p.size / 2, y: p.y - p.size / 2, scale: 0, opacity: 1 }}
              animate={{
                x: p.x + Math.cos(rad) * p.speed - p.size / 2,
                y: p.y + Math.sin(rad) * p.speed - 30 - p.size / 2,
                scale: [0, 1.3, 0.8],
                opacity: 0,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              style={{
                position: 'fixed',
                fontSize: p.size,
                top: 0,
                left: 0,
                userSelect: 'none',
                filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))',
              }}
            >
              {p.emoji}
            </motion.span>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────
// DRIFTING 3D ROSE PETALS
// ─────────────────────────────────────────────
function FallingRosePetals() {
  const petals = Array.from({ length: 22 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 12,
    duration: 10 + Math.random() * 8,
    size: 16 + Math.random() * 24,
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
            x: [`${p.x}vw`, `${p.x + (Math.random() - 0.5) * 20}vw`],
            rotate: [p.rotation, p.rotation + 360 + Math.random() * 360],
          }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute"
          style={{ width: p.size, height: p.size }}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
            <path
              d="M12 2C8.5 2 4 4.5 4 9C4 14.5 12 22 12 22C12 22 20 14.5 20 9C20 4.5 15.5 2 12 2Z"
              fill="url(#petalGrad)"
            />
            <defs>
              <linearGradient id="petalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff1744" />
                <stop offset="50%" stopColor="#b71c1c" />
                <stop offset="100%" stopColor="#4a0007" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// PROMISE CARD (Flip and pulse)
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
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        {/* Front side */}
        <div
          className="absolute inset-0 backface-hidden rounded-2xl p-4 flex flex-col items-center justify-center text-center border"
          style={{
            background: 'linear-gradient(135deg, rgba(30,0,18,0.85) 0%, rgba(15,0,8,0.9) 100%)',
            backdropFilter: 'blur(12px)',
            borderColor: isGold ? '#f5c842' : '#ff1744',
            boxShadow: isGold ? '0 8px 24px rgba(245,200,66,0.15)' : '0 8px 24px rgba(255,23,68,0.15)',
          }}
        >
          <span className="text-4xl mb-3 drop-shadow">{emoji}</span>
          <p className="text-sm font-semibold leading-snug tracking-wide" style={{ color: '#f5ead8', fontFamily: 'Be Vietnam Pro, sans-serif' }}>
            {text || 'A beautiful vow to hold forever.'}
          </p>
        </div>

        {/* Back side */}
        <div
          className="absolute inset-0 backface-hidden rounded-2xl p-4 flex flex-col items-center justify-center text-center border rotate-y-180"
          style={{
            background: 'linear-gradient(135deg, #3d001d 0%, #1c000e 100%)',
            borderColor: '#f5c842',
            boxShadow: 'inset 0 0 25px rgba(245,200,66,0.25)',
          }}
        >
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#f5c842] mb-2" style={{ fontFamily: 'Plus Jakarta Sans' }}>Seal of My Heart</span>
          <p className="text-xs leading-relaxed italic text-white font-medium" style={{ fontFamily: 'Be Vietnam Pro' }}>
            "{secretNote || 'I promise to cherish this vow with all my soul.'}"
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────
// CRYSTAL PROGRESS HEART
// ─────────────────────────────────────────────
function ProgressHeart({ current, total }: { current: number; total: number }) {
  const percent = total > 0 ? (current / total) * 100 : 0;
  return (
    <div className="flex flex-col items-center space-y-2 mt-4">
      <div className="relative w-20 h-20 flex items-center justify-center">
        {/* Outline Gold Heart */}
        <svg viewBox="0 0 24 24" className="absolute inset-0 w-full h-full fill-none stroke-[#f5c842]/40" strokeWidth="1">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        {/* Filled Crimson Heart with Mask */}
        <motion.svg
          viewBox="0 0 24 24"
          className="absolute inset-0 w-full h-full transition-all duration-700 fill-red-600 stroke-[#f5c842]"
          strokeWidth="1.5"
          style={{
            clipPath: `inset(${100 - percent}% 0% 0% 0%)`,
            filter: 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.7))',
          }}
          animate={current > 0 ? { scale: [1, 1.15, 1] } : {}}
          transition={{ duration: 0.6 }}
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </motion.svg>
        <span className="relative z-10 text-xs font-bold text-[#f5c842] drop-shadow-md" style={{ fontFamily: 'Plus Jakarta Sans' }}>
          {Math.round(percent)}%
        </span>
      </div>
      <p className="text-[11px] uppercase tracking-wider text-white/50 font-bold" style={{ fontFamily: 'Plus Jakarta Sans' }}>
        vows revealed ({current}/{total})
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────
// PROMISE CONFETTI
// ─────────────────────────────────────────────
function PromiseConfetti() {
  const pieces = Array.from({ length: 45 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: -10,
    color: ['#f5c842', '#ff1744', '#ffffff', '#ff4081'][i % 4],
    delay: Math.random() * 2.5,
    size: 4 + Math.random() * 7,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[9999]">
      {pieces.map(p => (
        <motion.div
          key={p.id}
          initial={{ y: '-10vh', x: `${p.x}vw`, rotate: 0 }}
          animate={{ y: '110vh', x: `${p.x + (Math.random() - 0.5) * 20}vw`, rotate: 720 }}
          transition={{ duration: 3.5 + Math.random() * 2, delay: p.delay, ease: 'easeOut' }}
          className="absolute"
          style={{ width: p.size, height: p.size, background: p.color, borderRadius: '50%' }}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// FIREWORKS
// ─────────────────────────────────────────────
function Fireworks() {
  const list = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    x: 10 + Math.random() * 80,
    y: 20 + Math.random() * 40,
    delay: i * 0.65,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[99]">
      {list.map(f => (
        <motion.div
          key={f.id}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.3, 1.5, 0], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.8, delay: f.delay, repeat: Infinity, repeatDelay: 5 }}
          className="absolute w-36 h-36 rounded-full border border-yellow-500/50"
          style={{
            left: `${f.x}%`,
            top: `${f.y}%`,
            background: 'radial-gradient(circle, rgba(245,200,66,0.35) 0%, transparent 75%)',
            boxShadow: '0 0 40px rgba(245,200,66,0.5)',
          }}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// FLOATING GOLD MUSIC WIDGET
// ─────────────────────────────────────────────
function FloatingMusicWidget({ musicUrl }: { musicUrl?: string }) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (musicUrl) {
      audioRef.current = new Audio(musicUrl);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.35;
    }
    return () => {
      audioRef.current?.pause();
    };
  }, [musicUrl]);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setPlaying(!playing);
  };

  if (!musicUrl) return null;

  return (
    <div className="fixed top-6 right-6 z-[999]">
      <motion.button
        onClick={toggle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-12 h-12 rounded-full border border-[#f5c842] flex items-center justify-center relative cursor-pointer"
        style={{
          background: 'linear-gradient(135deg, #1c000e 0%, #3d001d 100%)',
          boxShadow: '0 0 15px rgba(245,200,66,0.3)',
        }}
      >
        <motion.div
          animate={playing ? { rotate: 360 } : {}}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 rounded-full border border-[#f5c842]/40 flex items-center justify-center text-md relative"
          style={{ background: '#222' }}
        >
          🎵
        </motion.div>
        {playing && (
          <motion.div
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute -inset-1 rounded-full border border-red-500/40"
          />
        )}
      </motion.button>
    </div>
  );
}

// ─────────────────────────────────────────────
// DETAILED PHOTOS LIGHTBOX
// ─────────────────────────────────────────────
function Lightbox({ url, caption, onClose }: { url: string; caption?: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" onClick={onClose}>
      <div className="relative max-w-3xl w-full max-h-[85vh] flex flex-col items-center" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute -top-12 right-0 text-white/70 hover:text-white text-3xl font-bold p-2">✕</button>
        <div className="w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          <img src={url} alt={caption || ''} className="w-full h-auto max-h-[70vh] object-contain mx-auto" />
        </div>
        {caption && (
          <p className="text-white/80 font-sans text-sm mt-4 text-center px-4" style={{ fontFamily: 'Be Vietnam Pro' }}>
            {caption}
          </p>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// RELATIVE STAT COUNTER TICKS
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
      start += Math.ceil(end / 80);
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
    <div ref={ref} className="text-center p-4 rounded-xl flex flex-col items-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(245,200,66,0.1)' }}>
      <div className="text-2xl font-bold text-yellow-500" style={{ fontFamily: 'Plus Jakarta Sans' }}>
        {count.toLocaleString()}
      </div>
      <div className="text-[10px] uppercase tracking-wide text-white/50 mt-1 font-bold" style={{ fontFamily: 'Be Vietnam Pro' }}>
        {label}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SECRET ENVELOPE MODAL (Interactive Open Letter)
// ─────────────────────────────────────────────
function EnvelopeLetterModal({
  message,
  signature,
  musicUrl,
  onClose,
  disableLetterAutoScroll = false,
  disableWordByWord = false,
  letterScrollSpeed = 25,
  letterWordDelay = 120,
  letterAnimType = 'word',
  letterCharDelay = 30,
}: {
  message: string;
  signature?: string;
  musicUrl?: string;
  onClose: () => void;
  disableLetterAutoScroll?: boolean;
  disableWordByWord?: boolean;
  letterScrollSpeed?: number;
  letterWordDelay?: number;
  letterAnimType?: 'word' | 'char';
  letterCharDelay?: number;
}) {
  const [phase, setPhase] = useState<'closed' | 'opening' | 'open' | 'reading'>('closed');
  const [sealCrumble, setSealCrumble] = useState(false);
  const [visibleCount, setVisibleCount] = useState(disableWordByWord ? 99999 : 0);
  const letterScrollRef = useRef<HTMLDivElement>(null);
  const localAudioRef = useRef<HTMLAudioElement>(null);

  const fullText = message || '';
  const words = fullText.split(/\s+/).filter(Boolean);
  const totalWords = words.length;
  const totalChars = fullText.length;
  const isCharAnim = letterAnimType === 'char';
  const totalCount = isCharAnim ? totalChars : totalWords;

  // Manage letter ambient loops
  useEffect(() => {
    if (musicUrl && localAudioRef.current) {
      localAudioRef.current.volume = 0.4;
      localAudioRef.current.play().catch(() => {});
    }
    return () => {
      if (localAudioRef.current) {
        localAudioRef.current.pause();
      }
    };
  }, [musicUrl]);

  const handleEnvelopeClick = () => {
    setSealCrumble(true);
    setTimeout(() => {
      setPhase('opening');
      setTimeout(() => {
        setPhase('open');
        setTimeout(() => {
          setPhase('reading');
        }, 1000);
      }, 1000);
    }, 600);
  };

  // Word-by-word / character-by-character typewriter draw
  useEffect(() => {
    if (phase !== 'reading') return;
    if (disableWordByWord) {
      setVisibleCount(totalCount);
      return;
    }
    if (visibleCount >= totalCount) return;

    let delay = 120;
    if (isCharAnim) {
      delay = letterCharDelay !== undefined ? Number(letterCharDelay) : 30;
    } else {
      delay = letterWordDelay !== undefined ? Number(letterWordDelay) : 120;
    }

    const timer = setTimeout(() => {
      setVisibleCount(c => c + 1);
    }, delay);
    return () => clearTimeout(timer);
  }, [phase, visibleCount, totalCount, disableWordByWord, letterWordDelay, letterCharDelay, isCharAnim]);

  // Auto scroll
  useEffect(() => {
    if (disableLetterAutoScroll || phase !== 'reading') return;
    const scrollSpeed = letterScrollSpeed !== undefined ? Number(letterScrollSpeed) : 25;
    if (scrollSpeed <= 0) return;

    let lastTime = performance.now();
    let frameId: number;
    const el = letterScrollRef.current;

    const scroll = (now: number) => {
      if (el) {
        const delta = (now - lastTime) / 1000;
        if (el.scrollTop + el.clientHeight < el.scrollHeight) {
          el.scrollTop += scrollSpeed * delta;
        }
      }
      lastTime = now;
      frameId = requestAnimationFrame(scroll);
    };

    frameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(frameId);
  }, [phase, disableLetterAutoScroll, letterScrollSpeed]);

  const visibleText = isCharAnim
    ? fullText.slice(0, visibleCount)
    : words.slice(0, visibleCount).join(' ');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center p-6 bg-black/95 backdrop-blur-md"
    >
      {musicUrl && <audio ref={localAudioRef} src={musicUrl} loop />}

      <div className="relative flex flex-col items-center max-w-sm w-full" style={{ perspective: 1200 }}>
        
        {/* Envelope display during closed/opening phase */}
        <AnimatePresence>
          {phase !== 'reading' && (
            <motion.div
              key="envelope"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full aspect-[4/3] rounded-3xl relative flex flex-col items-center justify-center cursor-pointer border border-[#f5c842]/30 overflow-visible"
              onClick={handleEnvelopeClick}
              style={{
                background: 'linear-gradient(145deg, #2b0216 0%, #4e0329 100%)',
                boxShadow: '0 25px 60px rgba(0,0,0,0.6), inset 0 0 20px rgba(245,200,66,0.15)',
              }}
            >
              {/* Flap */}
              <motion.div
                animate={phase === 'opening' || phase === 'open' ? { rotateX: -180, y: -2 } : { rotateX: 0 }}
                transition={{ duration: 1.2 }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '50%',
                  transformOrigin: 'top center',
                  transformStyle: 'preserve-3d',
                  zIndex: 10,
                }}
              >
                {/* Flap Front */}
                <div
                  className="absolute inset-0 backface-hidden rounded-t-3xl border-b border-[#f5c842]/20"
                  style={{
                    background: 'linear-gradient(180deg, #3d0020 0%, #2b0216 100%)',
                    clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                  }}
                />
                {/* Flap Back */}
                <div
                  className="absolute inset-0 backface-hidden rounded-t-3xl rotate-y-180"
                  style={{
                    background: 'linear-gradient(180deg, #2b0216 0%, #1c000f 100%)',
                    clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                  }}
                />
              </motion.div>

              {/* Wax Seal */}
              <motion.div
                animate={sealCrumble ? { scale: [1, 1.2, 0], opacity: 0 } : { scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-16 h-16 rounded-full flex items-center justify-center border-2 z-20 absolute"
                style={{
                  borderColor: '#f5c842',
                  background: 'linear-gradient(135deg, #f5c842 0%, #b48500 100%)',
                  boxShadow: '0 0 20px rgba(245,200,66,0.5)',
                }}
              >
                <span className="text-3xl">🌹</span>
              </motion.div>

              <p className="text-[10px] uppercase tracking-widest font-bold mt-20 text-[#f5c842]/70 select-none z-10" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                {sealCrumble ? 'Opening...' : 'Tap seal to read letter'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll/Paper displaying letter text */}
        <AnimatePresence>
          {phase === 'reading' && (
            <motion.div
              key="letter"
              ref={letterScrollRef}
              initial={{ opacity: 0, y: 50, scale: 0.93 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.7 }}
              className="w-full max-h-[60vh] overflow-y-auto rounded-2xl p-6 relative border border-[#f5c842]/30"
              style={{
                background: 'linear-gradient(135deg, #2a0216 0%, #120009 100%)',
                boxShadow: '0 25px 80px rgba(0,0,0,0.8), inset 0 0 25px rgba(245,200,66,0.1)',
              }}
            >
              {/* Paper Lines */}
              <div className="absolute inset-0 pointer-events-none opacity-5">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div key={i} className="w-full h-px bg-white" style={{ marginTop: '28px' }} />
                ))}
              </div>

              <div className="relative z-10" style={{ fontFamily: 'Be Vietnam Pro' }}>
                <p className="text-sm leading-relaxed text-white/90 whitespace-pre-wrap">
                  {visibleText}
                  {visibleCount < totalCount && (
                    <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.6, repeat: Infinity }} className="text-[#f5c842] font-bold ml-1">|</motion.span>
                  )}
                </p>

                {visibleCount >= totalCount && signature && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-right text-[#f5c842] font-serif italic mt-6 text-md"
                    style={{ fontFamily: 'Playfair Display' }}
                  >
                    — With Love, {signature} ✒️
                  </motion.p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Close Button */}
        {phase === 'reading' && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            onClick={onClose}
            className="mt-6 px-6 py-2.5 rounded-full text-xs uppercase tracking-widest font-bold text-[#1c000e] hover:bg-[#f5c842] transition-colors cursor-pointer"
            style={{
              background: '#f5c842',
              boxShadow: '0 4px 15px rgba(245,200,66,0.3)',
              fontFamily: 'Plus Jakarta Sans',
            }}
          >
            Close Letter 💌
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// MAIN THEME COMPONENT
// ─────────────────────────────────────────────
export default function VelvetRomanceTheme({ project }: { project: Project }) {
  const cfg = project.heroConfig || {};
  const ending = project.endingConfig || {};

  const [showLetterModal, setShowLetterModal] = useState(false);
  const [flippedCount, setFlippedCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [activePhoto, setActivePhoto] = useState<{ url: string; caption?: string } | null>(null);

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
    <div className="min-h-screen text-white relative" style={{ background: 'linear-gradient(180deg, #16000c 0%, #2e0018 50%, #0c0006 100%)', overflowX: 'hidden' }}>
      {/* Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700;800&family=Be+Vietnam+Pro:ital,wght@0,400;0,600;1,400&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap');
        .perspective { perspective: 1200px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>

      {/* Floating Sparkles & Rose Petals */}
      <CursorSparkleTrail />
      <FallingRosePetals />
      <TapExplosion />
      {showConfetti && <PromiseConfetti />}
      {ending.finaleStyle === 'all' && <Fireworks />}

      {/* Background Music widget player */}
      <FloatingMusicWidget musicUrl={project.backgroundMusicUrl || undefined} />

      {/* Main Love Scroll View */}
      <motion.div
        key="diary"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto px-5 py-8 space-y-12 pb-28 relative z-30"
      >
        {/* SECTION 1: HEADER CARD */}
        <div className="text-center py-6">
          {project.coverImageUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setActivePhoto({ url: project.coverImageUrl! })}
              className="w-32 h-32 rounded-full mx-auto overflow-hidden border-2 border-yellow-500/40 shadow-glow mb-4 cursor-zoom-in"
            >
              <img src={project.coverImageUrl} alt="cover" className="w-full h-full object-cover" />
            </motion.div>
          )}
          <h1 className="text-3xl font-bold font-serif text-yellow-500 animate-pulse" style={{ fontFamily: 'Playfair Display' }}>
            {project.title}
          </h1>
          {project.subtitle && (
            <p className="text-white/60 text-sm mt-1" style={{ fontFamily: 'Be Vietnam Pro' }}>
              {project.subtitle}
            </p>
          )}
        </div>

        {/* SECTION 2: SECRET LOVE LETTER (Interactive Envelope on Page) */}
        {cfg.letterMessage && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">✉️</span>
              <span className="font-bold text-sm tracking-wider uppercase text-yellow-500" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                Secret Scroll Letter
              </span>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowLetterModal(true)}
              className="w-full aspect-[4/3] rounded-3xl relative flex flex-col items-center justify-center cursor-pointer border border-[#f5c842]/30 overflow-hidden"
              style={{
                background: 'linear-gradient(145deg, #2b0216 0%, #4e0329 100%)',
                boxShadow: '0 12px 35px rgba(0,0,0,0.5), inset 0 0 15px rgba(245,200,66,0.15)',
              }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center border-2 z-10 animate-pulse"
                style={{
                  borderColor: '#f5c842',
                  background: 'linear-gradient(135deg, #f5c842 0%, #b48500 100%)',
                  boxShadow: '0 0 15px rgba(245,200,66,0.4)',
                }}
              >
                <span className="text-3xl text-[#1a0010]">🌹</span>
              </div>
              <p className="text-xs uppercase tracking-widest font-semibold mt-4 text-[#f5c842]/70 select-none z-10" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                Open Secret Letter 💌
              </p>
            </motion.div>
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
                      <div
                        onClick={() => setActivePhoto({ url: m.imageUrl!, caption: m.description || m.title })}
                        className="rounded-xl overflow-hidden max-h-40 border border-white/5 cursor-zoom-in"
                      >
                        <img src={m.imageUrl} alt={m.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 4: PROMISE VOWS WALL */}
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

            {/* Crystal Progress heart */}
            <ProgressHeart current={flippedCount} total={cfg.promises.length} />

            <div className="grid grid-cols-2 gap-3 mt-4">
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
                <div
                  key={g.id}
                  onClick={() => setActivePhoto({ url: g.mediaUrl, caption: g.caption || undefined })}
                  className="w-64 flex-shrink-0 snap-center rounded-2xl overflow-hidden border border-white/10 cursor-zoom-in"
                  style={{ background: 'rgba(255,255,255,0.02)' }}
                >
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

      {/* Secret Love Letter modal overlay popup */}
      <AnimatePresence>
        {showLetterModal && (
          <EnvelopeLetterModal
            message={cfg.letterMessage}
            signature={cfg.quillSignature}
            musicUrl={cfg.letterMusicUrl || undefined}
            onClose={() => setShowLetterModal(false)}
            disableLetterAutoScroll={cfg.disableLetterAutoScroll}
            disableWordByWord={cfg.disableWordByWord}
            letterScrollSpeed={cfg.letterScrollSpeed}
            letterWordDelay={cfg.letterWordDelay}
            letterAnimType={cfg.letterAnimType}
            letterCharDelay={cfg.letterCharDelay}
          />
        )}
      </AnimatePresence>

      {/* Lightbox photo previews zoom */}
      {activePhoto && (
        <Lightbox
          url={activePhoto.url}
          caption={activePhoto.caption}
          onClose={() => setActivePhoto(null)}
        />
      )}
    </div>
  );
}
