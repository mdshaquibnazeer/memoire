'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';

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
// FLOATING HEARTS BACKGROUND
// ─────────────────────────────────────────────
const FLOAT_EMOJIS = ['💕', '🌸', '✨', '💗', '🎀', '⭐', '💖', '🌷', '🩷'];

function FloatingHearts() {
  const hearts = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    emoji: FLOAT_EMOJIS[i % FLOAT_EMOJIS.length],
    x: Math.random() * 100,
    delay: Math.random() * 6,
    duration: 6 + Math.random() * 6,
    size: 14 + Math.random() * 16,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map(h => (
        <motion.span
          key={h.id}
          initial={{ y: '110vh', opacity: 0, x: `${h.x}vw` }}
          animate={{ y: '-10vh', opacity: [0, 0.7, 0.7, 0] }}
          transition={{ duration: h.duration, delay: h.delay, repeat: Infinity, ease: 'linear' }}
          style={{ position: 'fixed', fontSize: h.size, top: 0, left: 0 }}
        >
          {h.emoji}
        </motion.span>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// CLICK BURST
// ─────────────────────────────────────────────
interface Particle { id: number; x: number; y: number; emoji: string; size: number; angle: number; speed: number; }
const BURST = ['💗', '✨', '🌸', '💕', '⭐', '🎀'];

function ClickBurst() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const counter = useRef(0);

  const handleClick = useCallback((e: MouseEvent) => {
    const count = 8;
    const newP: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: counter.current++,
      x: e.clientX, y: e.clientY,
      emoji: BURST[Math.floor(Math.random() * BURST.length)],
      size: 12 + Math.random() * 14,
      angle: (i / count) * 360 + Math.random() * 20,
      speed: 50 + Math.random() * 60,
    }));
    setParticles(p => [...p, ...newP]);
    setTimeout(() => setParticles(p => p.filter(pp => !newP.find(np => np.id === pp.id))), 900);
  }, []);

  useEffect(() => {
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [handleClick]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <AnimatePresence>
        {particles.map(p => {
          const rad = (p.angle * Math.PI) / 180;
          return (
            <motion.span
              key={p.id}
              initial={{ x: p.x, y: p.y, scale: 0, opacity: 1 }}
              animate={{ x: p.x + Math.cos(rad) * p.speed, y: p.y + Math.sin(rad) * p.speed - 30, scale: 1.1, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{ position: 'fixed', fontSize: p.size, top: 0, left: 0, userSelect: 'none' }}
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
// PASSCODE SCREEN
// ─────────────────────────────────────────────
function PasscodeScreen({ correctCode, onUnlock }: { correctCode: string; onUnlock: () => void }) {
  const [input, setInput] = useState('');
  const [shake, setShake] = useState(false);
  const [hint, setHint] = useState('');

  const press = (val: string) => {
    if (val === 'del') { setInput(p => p.slice(0, -1)); return; }
    if (input.length >= 4) return;
    const next = input + val;
    setInput(next);
    if (next.length === 4) {
      if (next === correctCode) {
        setTimeout(onUnlock, 300);
      } else {
        setShake(true);
        setHint('Wrong code! Try again 💕');
        setTimeout(() => { setShake(false); setInput(''); setHint(''); }, 1000);
      }
    }
  };

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', 'del'];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative px-6"
      style={{ background: 'linear-gradient(160deg, #ffe0ec 0%, #ffb6c1 40%, #ff8da1 100%)' }}>
      <FloatingHearts />
      <ClickBurst />

      <motion.div
        initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-sm flex flex-col items-center"
      >
        {/* Puppy character */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="text-9xl mb-2 drop-shadow-xl select-none"
        >
          🐶
        </motion.div>

        <div className="text-center mb-6">
          <h1 className="font-bold text-white text-2xl mb-1 drop-shadow" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.01em' }}>
            Enter Code to Unlock 🎁
          </h1>
          <p className="text-white/80 text-sm" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>
            A little gift is waiting for you...
          </p>
        </div>

        {/* Passcode dots */}
        <motion.div
          animate={shake ? { x: [-8, 8, -8, 8, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="flex gap-4 mb-2"
        >
          {[0, 1, 2, 3].map(i => (
            <motion.div
              key={i}
              animate={{ scale: input.length > i ? 1.2 : 1 }}
              className="w-5 h-5 rounded-full border-2 border-white/60 transition-all duration-200"
              style={{ background: input.length > i ? '#fff' : 'rgba(255,255,255,0.25)' }}
            />
          ))}
        </motion.div>

        {hint && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-100 text-sm mb-2">
            {hint}
          </motion.p>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3 w-full mt-4"
          style={{ background: 'rgba(255,255,255,0.25)', borderRadius: '24px', padding: '20px', backdropFilter: 'blur(10px)' }}>
          {keys.map(k => (
            <motion.button
              key={k}
              whileTap={{ scale: 0.88 }}
              onClick={() => press(k)}
              className="flex items-center justify-center h-14 rounded-2xl text-xl font-bold cursor-pointer select-none"
              style={{
                background: k === 'del' ? 'rgba(255,255,255,0.4)' : 'white',
                color: '#c0506a',
                boxShadow: '0 4px 14px rgba(255,105,130,0.18)',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
              }}
            >
              {k === 'del' ? '⌫' : k}
            </motion.button>
          ))}
        </div>

        <p className="text-white/50 text-xs mt-5" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>
          Hint: ask the sender 💌
        </p>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────
// AWARD MODAL
// ─────────────────────────────────────────────
function AwardModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const cfg = project.heroConfig || {};
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(255,182,193,0.7)', backdropFilter: 'blur(10px)' }}>
      <motion.div
        initial={{ scale: 0.6, opacity: 0, rotate: -5 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        exit={{ scale: 0.6, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="relative w-full max-w-sm"
        style={{ background: 'linear-gradient(135deg, #fff5f7 0%, #ffe4ec 100%)', borderRadius: '28px', padding: '32px 24px', boxShadow: '0 24px 60px rgba(255,100,130,0.3)', border: '2px solid rgba(255,141,161,0.4)' }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-2xl text-pink-300 hover:text-pink-500 transition-colors">✕</button>

        <div className="text-center">
          <motion.div animate={{ rotate: [0, -10, 10, -5, 5, 0] }} transition={{ duration: 1.5, delay: 0.3 }} className="text-6xl mb-4">🏅</motion.div>
          <div className="text-pink-300 text-xs font-bold tracking-widest uppercase mb-1" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>Certificate of Appreciation</div>
          <h2 className="font-extrabold text-2xl mb-3" style={{ color: '#c0506a', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            {cfg.awardTitle || 'Lifetime Bestie Award'}
          </h2>
          <div className="w-12 h-0.5 mx-auto mb-4" style={{ background: 'linear-gradient(90deg, transparent, #ff8da1, transparent)' }} />
          <p className="text-sm leading-relaxed mb-4" style={{ color: '#a05070', fontFamily: 'Be Vietnam Pro, sans-serif' }}>
            Proudly presented to
          </p>
          <div className="text-3xl font-bold mb-4" style={{ color: '#e05070', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            {project.personTwoName || 'You'} 🌸
          </div>
          <p className="text-sm leading-relaxed" style={{ color: '#a05070', fontFamily: 'Be Vietnam Pro, sans-serif' }}>
            {cfg.awardDescription || 'For being the most amazing, kind, and wonderful person in the entire universe.'}
          </p>
          <div className="flex justify-between items-center mt-6 pt-4" style={{ borderTop: '1px dashed #ffb6c1' }}>
            <div className="text-center">
              <div className="text-lg mb-1">🎀</div>
              <div className="text-xs text-pink-300" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>{project.personOneName || 'Sender'}</div>
            </div>
            <div className="text-2xl">💕</div>
            <div className="text-center">
              <div className="text-lg mb-1">⭐</div>
              <div className="text-xs text-pink-300" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>Forever</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MEMORIES SEARCH MODAL
// ─────────────────────────────────────────────
function MemoriesModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const [tab, setTab] = useState<'all' | 'images' | 'memories'>('all');
  const tabs = [{ id: 'all', label: 'All' }, { id: 'images', label: 'Images' }, { id: 'memories', label: 'Memories' }];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(255,182,193,0.7)', backdropFilter: 'blur(10px)' }}>
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', stiffness: 150, damping: 25 }}
        className="w-full max-w-lg h-[85vh] sm:h-[75vh] overflow-hidden flex flex-col"
        style={{ background: 'white', borderRadius: '28px 28px 0 0', boxShadow: '0 -8px 40px rgba(255,100,130,0.2)' }}
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-3 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔍</span>
              <span className="font-bold text-lg" style={{ color: '#c0506a', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Moments of Us</span>
            </div>
            <button onClick={onClose} className="text-xl text-pink-300 hover:text-pink-500">✕</button>
          </div>
          {/* Search bar mock */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm text-pink-300"
            style={{ background: '#fff0f5', border: '1.5px solid #ffb6c1', fontFamily: 'Be Vietnam Pro, sans-serif' }}>
            🔍 &nbsp;Search our memories...
          </div>
          {/* Tabs */}
          <div className="flex gap-2 mt-3">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id as any)}
                className="px-4 py-1 rounded-full text-sm font-semibold transition-all"
                style={{
                  background: tab === t.id ? '#ff8da1' : '#fff0f5',
                  color: tab === t.id ? 'white' : '#c0506a',
                  fontFamily: 'Be Vietnam Pro, sans-serif',
                }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="overflow-y-auto flex-1 px-5 pb-5">
          {(tab === 'all' || tab === 'images') && project.galleryItems.length > 0 && (
            <div className="mb-4">
              {tab === 'all' && <p className="text-xs font-bold text-pink-300 mb-2 uppercase tracking-wider">📸 Gallery</p>}
              <div className="grid grid-cols-2 gap-2">
                {project.galleryItems.map((g, i) => (
                  <motion.div key={g.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                    className="aspect-square rounded-xl overflow-hidden" style={{ background: '#fff0f5' }}>
                    {g.mediaUrl && <img src={g.mediaUrl} alt={g.caption || ''} className="w-full h-full object-cover" />}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
          {(tab === 'all' || tab === 'memories') && project.memories.map((m, i) => (
            <motion.div key={m.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
              className="flex gap-3 mb-3 p-3 rounded-2xl" style={{ background: '#fff0f5', border: '1px solid #ffb6c1' }}>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl"
                style={{ background: '#ffe4ec' }}>
                {m.emoji || '🌸'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate" style={{ color: '#c0506a', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{m.title}</p>
                {m.description && <p className="text-xs mt-0.5 line-clamp-2" style={{ color: '#a08090', fontFamily: 'Be Vietnam Pro, sans-serif' }}>{m.description}</p>}
                <p className="text-xs mt-1 text-pink-300">{new Date(m.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
            </motion.div>
          ))}
          {((tab === 'memories' && project.memories.length === 0) || (tab === 'images' && project.galleryItems.length === 0)) && (
            <div className="text-center py-12 text-pink-300">
              <div className="text-4xl mb-2">🌸</div>
              <p style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>No {tab} yet 💕</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────
// LOVE LETTER MODAL
// ─────────────────────────────────────────────
function LoveLetterModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const cfg = project.heroConfig || {};
  const msg = cfg.loveLetterText || cfg.message || 'You are the most wonderful person I know. Happy Birthday! 💕';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(255,182,193,0.7)', backdropFilter: 'blur(10px)' }}>
      <motion.div
        initial={{ rotateY: 90, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        exit={{ rotateY: -90, opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm overflow-hidden"
        style={{ borderRadius: '24px', boxShadow: '0 24px 60px rgba(255,100,130,0.3)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4"
          style={{ background: 'linear-gradient(135deg, #ff8da1, #ffb6c1)' }}>
          <div className="flex items-center gap-2">
            <span className="text-2xl">✉️</span>
            <span className="font-bold text-white" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>With Love</span>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white text-xl">✕</button>
        </div>

        {/* Notebook body */}
        <div className="relative p-5 min-h-[320px]"
          style={{ background: 'white', backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, #ffb6c1 27px, #ffb6c1 28px)', backgroundPositionY: '8px' }}>
          {/* Vinyl record decoration */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-20 flex items-center justify-center text-4xl"
            style={{ background: '#333' }}
          >
            <span>💿</span>
          </motion.div>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">📝</span>
            <span className="font-bold text-sm" style={{ color: '#c0506a', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              To: {project.personTwoName || 'You'} 💕
            </span>
          </div>

          <p className="text-sm leading-8 relative z-10" style={{ color: '#805060', fontFamily: 'Be Vietnam Pro, sans-serif', whiteSpace: 'pre-wrap' }}>
            {msg}
          </p>

          <div className="mt-6 text-right">
            <p className="text-sm italic" style={{ color: '#c0506a', fontFamily: 'Be Vietnam Pro, sans-serif' }}>
              With all my love,<br />
              <span className="font-bold">{project.personOneName || 'Sender'} 🌸</span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3"
          style={{ background: '#fff0f5', borderTop: '1px dashed #ffb6c1' }}>
          <span className="text-xs text-pink-300" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>
            {cfg.vinylSong || 'Our song'} — {cfg.vinylArtist || project.personOneName || 'With love'}
          </span>
          <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>💕</motion.span>
        </div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────
// JAR OF REASONS MODAL
// ─────────────────────────────────────────────
const DEFAULT_REASONS = ['Your beautiful smile', 'Your kind heart', 'How you make me laugh', 'Our memories together', 'Your warm hugs', 'How genuine you are', 'Your amazing energy', 'Just being you 🌸'];

function JarModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const cfg = project.heroConfig || {};
  const reasons: string[] = cfg.jarReasons || DEFAULT_REASONS;
  const [revealed, setRevealed] = useState<number[]>([]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(255,182,193,0.7)', backdropFilter: 'blur(10px)' }}>
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 150, damping: 25 }}
        className="w-full max-w-sm overflow-hidden"
        style={{ borderRadius: '28px 28px 0 0', background: 'white', boxShadow: '0 -8px 40px rgba(255,100,130,0.2)', maxHeight: '80vh' }}
      >
        <div className="px-5 py-4 flex items-center justify-between flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #ffb6c1, #ff8da1)' }}>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏺</span>
            <div>
              <p className="font-bold text-white text-sm" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Jar of Reasons</p>
              <p className="text-white/80 text-xs" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>Everything I love about you</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white text-xl">✕</button>
        </div>

        <div className="overflow-y-auto p-5" style={{ maxHeight: 'calc(80vh - 80px)' }}>
          <p className="text-center text-xs text-pink-300 mb-4" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>
            Tap the hearts to reveal 💕
          </p>
          <div className="grid grid-cols-2 gap-3">
            {reasons.map((r, i) => (
              <motion.button
                key={i}
                whileTap={{ scale: 0.92 }}
                onClick={() => setRevealed(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="relative flex flex-col items-center justify-center p-4 rounded-2xl min-h-[90px] transition-all duration-300 cursor-pointer"
                style={{
                  background: revealed.includes(i) ? 'linear-gradient(135deg, #ffe4ec, #ffb6c1)' : '#fff0f5',
                  border: revealed.includes(i) ? '1.5px solid #ff8da1' : '1.5px solid #ffd0dc',
                  boxShadow: revealed.includes(i) ? '0 4px 20px rgba(255,141,161,0.3)' : 'none',
                }}
              >
                <motion.span
                  animate={revealed.includes(i) ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 0.3 }}
                  className="text-2xl mb-2"
                >
                  {revealed.includes(i) ? '💗' : '🤍'}
                </motion.span>
                <AnimatePresence>
                  {revealed.includes(i) && (
                    <motion.p
                      initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="text-xs text-center font-semibold leading-tight"
                      style={{ color: '#c0506a', fontFamily: 'Be Vietnam Pro, sans-serif' }}
                    >
                      {r}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.button>
            ))}
          </div>

          {revealed.length === reasons.length && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              className="text-center mt-6 p-4 rounded-2xl"
              style={{ background: 'linear-gradient(135deg, #ffe4ec, #ffb6c1)' }}>
              <div className="text-3xl mb-1">💖</div>
              <p className="font-bold text-sm" style={{ color: '#c0506a', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                You revealed them all! That's how much I love you 🌸
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MUSIC PLAYER MODAL
// ─────────────────────────────────────────────
function MusicModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(30);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cfg = project.heroConfig || {};

  useEffect(() => {
    if (project.backgroundMusicUrl) {
      audioRef.current = new Audio(project.backgroundMusicUrl);
      audioRef.current.loop = true;
    }
    return () => { audioRef.current?.pause(); };
  }, [project.backgroundMusicUrl]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); } else { audioRef.current.play(); }
    setPlaying(!playing);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(255,182,193,0.7)', backdropFilter: 'blur(10px)' }}>
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.7, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 22 }}
        className="w-full max-w-xs"
        style={{ background: 'linear-gradient(160deg, #2a0a1a 0%, #4a1525 100%)', borderRadius: '28px', padding: '28px 24px', boxShadow: '0 24px 60px rgba(0,0,0,0.5)' }}
      >
        <div className="flex justify-end mb-2">
          <button onClick={onClose} className="text-white/40 hover:text-white/80 text-lg">✕</button>
        </div>

        {/* Vinyl record */}
        <div className="flex justify-center mb-6">
          <motion.div
            animate={playing ? { rotate: 360 } : {}}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            className="w-36 h-36 rounded-full flex items-center justify-center relative"
            style={{ background: 'radial-gradient(circle at center, #444 0%, #222 30%, #111 60%, #333 100%)', boxShadow: '0 0 0 3px #ff8da1, 0 0 0 8px rgba(255,141,161,0.2)' }}
          >
            <div className="w-8 h-8 rounded-full" style={{ background: 'radial-gradient(circle, #ff8da1 0%, #c0506a 100%)' }} />
            <div className="absolute inset-0 rounded-full" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%)' }} />
          </motion.div>
        </div>

        <div className="text-center mb-6">
          <p className="font-bold text-white text-lg" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            {cfg.vinylSong || project.title}
          </p>
          <p className="text-pink-300 text-sm mt-1" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>
            {cfg.vinylArtist || project.personOneName || 'With Love'}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 rounded-full mb-4" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <motion.div className="h-full rounded-full" style={{ background: '#ff8da1', width: `${progress}%` }}
            animate={playing ? { width: ['30%', '100%'] } : {}}
            transition={{ duration: 60, ease: 'linear' }} />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6">
          <button className="text-white/50 hover:text-white text-xl transition-colors">⏮</button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={togglePlay}
            className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
            style={{ background: 'linear-gradient(135deg, #ff8da1, #ff69b4)', boxShadow: '0 4px 20px rgba(255,105,180,0.5)' }}
          >
            {playing ? '⏸' : '▶️'}
          </motion.button>
          <button className="text-white/50 hover:text-white text-xl transition-colors">⏭</button>
        </div>

        {!project.backgroundMusicUrl && (
          <p className="text-center text-pink-400/60 text-xs mt-4" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>
            Add a music URL in your project settings 🎵
          </p>
        )}
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────
// GIFT BOX MENU (main screen after unlock)
// ─────────────────────────────────────────────
type ModalType = 'award' | 'memories' | 'letter' | 'jar' | 'music' | null;

const MENU_ITEMS = [
  { id: 'award', emoji: '🏅', label: 'Award', angle: -90 },
  { id: 'memories', emoji: '🔍', label: 'Memories', angle: -18 },
  { id: 'letter', emoji: '✉️', label: 'Love Letter', angle: 54 },
  { id: 'jar', emoji: '🏺', label: 'Reasons', angle: 126 },
  { id: 'music', emoji: '🎵', label: 'Music', angle: 198 },
] as const;

function GiftBoxMenu({ project, onOpenModal }: { project: Project; onOpenModal: (m: ModalType) => void }) {
  const cfg = project.heroConfig || {};
  const radius = 130;

  return (
    <div className="min-h-screen flex flex-col items-center relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #ffe0ec 0%, #ffb6c1 50%, #ff8da1 100%)' }}>
      <FloatingHearts />
      <ClickBurst />

      <div className="relative z-10 w-full max-w-sm mx-auto px-5 pt-8 pb-6 flex flex-col items-center">
        {/* Polaroid cover */}
        <motion.div
          initial={{ y: -20, opacity: 0, rotate: -3 }} animate={{ y: 0, opacity: 1, rotate: -3 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="self-start ml-2 mb-4"
          style={{ background: 'white', padding: '8px 8px 28px', borderRadius: '4px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', transform: 'rotate(-3deg)', width: '130px' }}
        >
          {project.coverImageUrl ? (
            <img src={project.coverImageUrl} alt="cover" className="w-full aspect-square object-cover" style={{ borderRadius: '2px' }} />
          ) : (
            <div className="w-full aspect-square flex items-center justify-center text-4xl" style={{ background: '#fff0f5', borderRadius: '2px' }}>💕</div>
          )}
          <p className="text-center mt-2 text-xs font-bold" style={{ color: '#c0506a', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            {project.startDate ? new Date(project.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '🌸'}
          </p>
        </motion.div>

        {/* Happy Birthday text */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.4 }}
          className="text-center mb-2"
        >
          <h1 className="font-extrabold leading-none" style={{
            fontSize: 'clamp(32px, 10vw, 48px)',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            color: 'white',
            textShadow: '0 4px 20px rgba(192,80,106,0.4)',
            WebkitTextStroke: '1.5px rgba(192,80,106,0.3)',
          }}>
            {cfg.celebrateText || `Happy Birthday,\n${project.personTwoName || 'You'}!`}
          </h1>
          {project.subtitle && (
            <p className="text-white/70 text-sm mt-1" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>{project.subtitle}</p>
          )}
        </motion.div>

        {/* Gift box + orbital menu */}
        <div className="relative flex items-center justify-center my-6" style={{ width: '300px', height: '300px' }}>
          {/* Orbital buttons */}
          {MENU_ITEMS.map((item, i) => {
            const rad = ((item.angle - 90) * Math.PI) / 180;
            const x = radius * Math.cos(rad);
            const y = radius * Math.sin(rad);
            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.1, type: 'spring', stiffness: 200, damping: 18 }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.88 }}
                onClick={() => onOpenModal(item.id as ModalType)}
                className="absolute flex flex-col items-center gap-1 cursor-pointer"
                style={{ left: `calc(50% + ${x}px - 30px)`, top: `calc(50% + ${y}px - 30px)`, width: '60px' }}
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl"
                  style={{ background: 'white', boxShadow: '0 4px 16px rgba(255,100,130,0.25)' }}>
                  {item.emoji}
                </div>
                <span className="text-white text-xs font-bold text-center leading-tight drop-shadow"
                  style={{ fontFamily: 'Be Vietnam Pro, sans-serif', textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>
                  {item.label}
                </span>
              </motion.button>
            );
          })}

          {/* Center gift box */}
          <motion.div
            animate={{ y: [0, -8, 0], rotate: [0, 1, -1, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="relative z-10 text-7xl cursor-pointer select-none"
          >
            🎁
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -inset-4 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(255,141,161,0.3) 0%, transparent 70%)' }}
            />
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          className="text-white/70 text-sm text-center"
          style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}
        >
          Tap a section to open 💌
        </motion.p>

        {/* Message snippet */}
        {cfg.message && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }}
            className="mt-4 w-full p-4 rounded-2xl text-center"
            style={{ background: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.5)' }}
          >
            <p className="text-white text-sm leading-relaxed line-clamp-3" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>
              "{cfg.message}"
            </p>
            <p className="text-white/60 text-xs mt-2">— {project.personOneName || 'Sender'}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export default function SweetDiaryTheme({ project }: { project: Project }) {
  const cfg = project.heroConfig || {};
  const passcode = cfg.passcode || '1234';
  const [unlocked, setUnlocked] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
      `}</style>

      <AnimatePresence mode="wait">
        {!unlocked ? (
          <motion.div key="lock" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <PasscodeScreen correctCode={passcode} onUnlock={() => setUnlocked(true)} />
          </motion.div>
        ) : (
          <motion.div key="diary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            <GiftBoxMenu project={project} onOpenModal={setActiveModal} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {activeModal === 'award' && <AwardModal project={project} onClose={() => setActiveModal(null)} />}
        {activeModal === 'memories' && <MemoriesModal project={project} onClose={() => setActiveModal(null)} />}
        {activeModal === 'letter' && <LoveLetterModal project={project} onClose={() => setActiveModal(null)} />}
        {activeModal === 'jar' && <JarModal project={project} onClose={() => setActiveModal(null)} />}
        {activeModal === 'music' && <MusicModal project={project} onClose={() => setActiveModal(null)} />}
      </AnimatePresence>
    </>
  );
}
