'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  personOneName: string | null;
  personTwoName: string | null;
  occasion: string | null;
  startDate: string | null;
  coverImageUrl: string | null;
  backgroundMusicUrl?: string | null;
  isPasswordProtected?: boolean;
  accessPassword?: string | null;
  heroConfig: any;
  endingConfig: any;
  memories: Memory[];
  galleryItems: GalleryItem[];
}

// ─────────────────────────────────────────────
// THEMES CONFIGURATION
// ─────────────────────────────────────────────
const BOX_THEMES: Record<string, { card: string; title: string; subtitle: string; border: string; accent: string }> = {
  'frosted-rose': {
    card: 'bg-white/75 backdrop-blur-xl border border-pink-200/90 shadow-[0_15px_40px_rgba(244,114,182,0.18)] text-pink-950',
    title: 'text-pink-950',
    subtitle: 'text-pink-700/80',
    border: 'border-pink-200',
    accent: 'from-pink-500 to-rose-400',
  },
  'peach-cream': {
    card: 'bg-[#fff8f2]/85 backdrop-blur-xl border border-amber-200/80 shadow-[0_15px_40px_rgba(251,191,36,0.16)] text-amber-950',
    title: 'text-amber-950',
    subtitle: 'text-amber-800/80',
    border: 'border-amber-200',
    accent: 'from-amber-500 to-rose-400',
  },
  'sakura-blush': {
    card: 'bg-[#fff0f6]/85 backdrop-blur-xl border border-rose-200/90 shadow-[0_15px_40px_rgba(244,63,94,0.18)] text-rose-950',
    title: 'text-rose-950',
    subtitle: 'text-rose-700/80',
    border: 'border-rose-200',
    accent: 'from-rose-500 to-pink-500',
  },
  'velvet-glow': {
    card: 'bg-[#2a0e20]/90 backdrop-blur-xl border border-pink-400/40 shadow-[0_15px_40px_rgba(0,0,0,0.45)] text-pink-100',
    title: 'text-pink-100',
    subtitle: 'text-pink-300/80',
    border: 'border-pink-400/30',
    accent: 'from-pink-600 to-rose-500',
  },
};

const PHONE_THEMES: Record<string, { frame: string; bezel: string }> = {
  'rose-gold': {
    frame: 'linear-gradient(145deg, #ffd1dc 0%, #ff9ebb 50%, #f4729f 100%)',
    bezel: 'rgba(255, 105, 180, 0.45)',
  },
  'sakura-pink': {
    frame: 'linear-gradient(145deg, #ffe4ef 0%, #ffb6d0 50%, #ff8db1 100%)',
    bezel: 'rgba(255, 141, 177, 0.45)',
  },
  'midnight-pink': {
    frame: 'linear-gradient(145deg, #2d1326 0%, #461b3b 50%, #f43f5e 100%)',
    bezel: 'rgba(244, 63, 94, 0.5)',
  },
};

// ─────────────────────────────────────────────
// WHITE HEARTS CURSOR TRAIL
// ─────────────────────────────────────────────
function WhiteHeartsTrail() {
  const [hearts, setHearts] = useState<Array<{ id: number; x: number; y: number; size: number; rotate: number }>>([]);
  const lastPos = useRef({ x: 0, y: 0 });
  const idRef = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const dist = Math.hypot(e.clientX - lastPos.current.x, e.clientY - lastPos.current.y);
      if (dist > 24) {
        lastPos.current = { x: e.clientX, y: e.clientY };
        const id = idRef.current++;
        const newHeart = {
          id,
          x: e.clientX,
          y: e.clientY,
          size: 14 + Math.random() * 10,
          rotate: (Math.random() - 0.5) * 40,
        };
        setHearts(prev => [...prev.slice(-22), newHeart]);
        setTimeout(() => {
          setHearts(prev => prev.filter(h => h.id !== id));
        }, 1100);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9998] overflow-hidden">
      <AnimatePresence>
        {hearts.map(h => (
          <motion.div
            key={h.id}
            initial={{ opacity: 0.95, scale: 0.6, x: h.x - h.size / 2, y: h.y - h.size / 2, rotate: h.rotate }}
            animate={{ opacity: 0, scale: 1.35, y: h.y - 45, rotate: h.rotate + 15 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              left: 0,
              top: 0,
              filter: 'drop-shadow(0 2px 6px rgba(255, 182, 193, 0.7))',
              userSelect: 'none',
            }}
          >
            <span style={{ fontSize: `${h.size}px` }}>🤍</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────
// LIVE DYNAMIC FLOATING BACKGROUND (GLOBAL PAGE)
// ─────────────────────────────────────────────
const FLOAT_EMOJIS = ['💕', '🌸', '✨', '💗', '🎀', '⭐', '💖', '🌷', '🩷', '🧸', '🍰', '🍓'];

function FloatingHearts() {
  const [items, setItems] = useState<Array<{ id: number; emoji: string; x: number; delay: number; duration: number; size: number }>>([]);

  useEffect(() => {
    setItems(
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        emoji: FLOAT_EMOJIS[i % FLOAT_EMOJIS.length],
        x: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 8 + Math.random() * 8,
        size: 16 + Math.random() * 18,
      }))
    );
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {items.map(h => (
        <motion.span
          key={h.id}
          initial={{ y: '110vh', opacity: 0, x: `${h.x}vw` }}
          animate={{ y: '-10vh', opacity: [0, 0.75, 0.75, 0] }}
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
// CLICK BURST PARTICLE EFFECT
// ─────────────────────────────────────────────
interface Particle { id: number; x: number; y: number; emoji: string; size: number; angle: number; speed: number; }
const BURST = ['💗', '✨', '🌸', '💕', '⭐', '🎀', '🐼', '🍰'];

function ClickBurst() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const counter = useRef(0);

  const handleClick = useCallback((e: MouseEvent) => {
    const count = 8;
    const newP: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: counter.current++,
      x: e.clientX,
      y: e.clientY,
      emoji: BURST[Math.floor(Math.random() * BURST.length)],
      size: 14 + Math.random() * 14,
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
// SMARTPHONE FRAMED BODY WRAPPER
// ─────────────────────────────────────────────
function PhoneFrame({
  children,
  wallpaperUrl,
  phoneTheme = 'rose-gold',
}: {
  children: React.ReactNode;
  wallpaperUrl?: string | null;
  phoneTheme?: string;
}) {
  const [time, setTime] = useState('9:41');
  const theme = PHONE_THEMES[phoneTheme] || PHONE_THEMES['rose-gold'];

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative mx-auto my-6 sm:my-10 flex flex-col items-center">
      <div className="absolute -inset-4 bg-gradient-to-tr from-pink-400/30 via-rose-300/30 to-pink-500/20 rounded-[58px] blur-2xl pointer-events-none" />

      <div
        className="relative w-full max-w-[390px] sm:max-w-[420px] rounded-[52px] p-[10px] sm:p-[12px] shadow-2xl transition-all"
        style={{
          background: theme.frame,
          boxShadow: `0 25px 70px -10px ${theme.bezel}, 0 0 0 1px rgba(255, 255, 255, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.8)`,
        }}
      >
        <div className="absolute -left-[3px] top-[110px] w-[3px] h-[32px] bg-rose-400/80 rounded-l-sm" />
        <div className="absolute -left-[3px] top-[155px] w-[3px] h-[48px] bg-rose-400/80 rounded-l-sm" />
        <div className="absolute -left-[3px] top-[215px] w-[3px] h-[48px] bg-rose-400/80 rounded-l-sm" />
        <div className="absolute -right-[3px] top-[140px] w-[3px] h-[65px] bg-rose-400/80 rounded-r-sm" />

        <div
          className="relative w-full rounded-[44px] overflow-hidden flex flex-col min-h-[720px] sm:min-h-[760px] border border-black/10"
          style={{
            background: wallpaperUrl
              ? `url(${wallpaperUrl}) center/cover no-repeat`
              : 'linear-gradient(165deg, #ffeef4 0%, #ffd4e5 45%, #ffb6d0 100%)',
          }}
        >
          <div className="relative z-30 pt-3 px-6 flex items-center justify-between text-[13px] font-bold text-pink-900 select-none">
            <span className="font-mono tracking-tight">{time}</span>
            <div className="w-24 h-5 bg-black/85 rounded-full flex items-center justify-end px-2 gap-1.5 shadow-inner">
              <div className="w-2 h-2 rounded-full bg-pink-500/80 animate-pulse" />
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400/60" />
            </div>
            <div className="flex items-center gap-1.5 text-xs text-pink-900">
              <span>5G</span>
              <span>📶</span>
              <span>🔋</span>
            </div>
          </div>

          <div className="relative z-20 flex-1 flex flex-col p-4 sm:p-5">
            {children}
          </div>

          <div className="relative z-30 pb-3 pt-1 flex justify-center">
            <div className="w-32 h-1 bg-pink-900/40 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PASSCODE SCREEN (WITH CUTE PANDA AVATAR)
// ─────────────────────────────────────────────
function PasscodeScreen({
  correctCode,
  onUnlock,
}: {
  correctCode: string;
  onUnlock: () => void;
}) {
  const [input, setInput] = useState('');
  const [shake, setShake] = useState(false);
  const [hint, setHint] = useState('');

  const press = (val: string) => {
    if (val === 'del') {
      setInput(p => p.slice(0, -1));
      return;
    }
    if (input.length >= correctCode.length) return;
    const next = input + val;
    setInput(next);
    if (next.length === correctCode.length) {
      if (next === correctCode) {
        setTimeout(onUnlock, 300);
      } else {
        setShake(true);
        setHint('Wrong passcode! Try again 💕');
        setTimeout(() => {
          setShake(false);
          setInput('');
          setHint('');
        }, 1000);
      }
    }
  };

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', 'del'];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex-1 flex flex-col items-center justify-between py-4"
    >
      <div className="flex flex-col items-center mt-2">
        <div className="relative mb-3">
          <motion.div
            animate={{
              y: [0, -8, 0],
              rotate: [0, -3, 3, 0],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="w-24 h-24 rounded-full flex items-center justify-center text-5xl shadow-lg border-2 border-white/80 select-none"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #ffe4ec 100%)',
              boxShadow: '0 10px 25px rgba(255, 105, 180, 0.35)',
            }}
          >
            🐼
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="absolute -bottom-1 -right-1 text-2xl"
          >
            💕
          </motion.div>
        </div>

        <h2 className="text-xl font-bold text-pink-900 font-serif tracking-wide drop-shadow-sm">
          Welcome, My Love 🌸
        </h2>
        <p className="text-xs text-pink-800/80 mt-1 font-medium font-sans">
          Enter your 4-digit secret PIN
        </p>
      </div>

      <div className="flex flex-col items-center my-3">
        <motion.div
          animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="flex gap-4 mb-2"
        >
          {Array.from({ length: correctCode.length }).map((_, i) => (
            <motion.div
              key={i}
              animate={input.length > i ? { scale: [1, 1.3, 1] } : {}}
              className={`w-3.5 h-3.5 rounded-full transition-all duration-200 border-2 ${
                input.length > i
                  ? 'bg-pink-600 border-pink-600 shadow-md shadow-pink-400/50'
                  : 'border-pink-400/60 bg-white/40'
              }`}
            />
          ))}
        </motion.div>
        {hint && (
          <p className="text-rose-600 text-xs font-bold font-sans animate-pulse">{hint}</p>
        )}
      </div>

      <div
        className="grid grid-cols-3 gap-2.5 w-full max-w-[280px] p-3 rounded-3xl backdrop-blur-md"
        style={{ background: 'rgba(255, 255, 255, 0.55)', boxShadow: '0 8px 24px rgba(255, 105, 180, 0.15)' }}
      >
        {keys.map(k => (
          <motion.button
            key={k}
            whileTap={{ scale: 0.88 }}
            onClick={() => press(k)}
            className="flex items-center justify-center h-12 sm:h-13 rounded-2xl text-lg font-bold cursor-pointer select-none transition-all"
            style={{
              background: k === 'del' ? 'rgba(255, 255, 255, 0.65)' : 'white',
              color: '#9d174d',
              boxShadow: '0 3px 10px rgba(244, 114, 182, 0.2)',
            }}
          >
            {k === 'del' ? '⌫' : k}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// DUAL FILMSTRIP / CAMERA ROLL (LEFT & RIGHT)
// ─────────────────────────────────────────────
function FilmstripColumn({
  galleryItems,
  onSelectPhoto,
  position = 'right',
}: {
  galleryItems: GalleryItem[];
  onSelectPhoto: (item: GalleryItem) => void;
  position?: 'left' | 'right';
}) {
  if (!galleryItems || galleryItems.length === 0) return null;

  return (
    <div
      className={`hidden xl:flex fixed ${position === 'left' ? 'left-6' : 'right-6'} top-24 bottom-24 w-36 z-30 flex-col items-center pointer-events-auto`}
    >
      <div className="mb-2 px-3 py-1 rounded-full bg-white/80 backdrop-blur-md border border-pink-200 text-[11px] font-bold text-pink-700 shadow-sm flex items-center gap-1">
        <span>📸</span> {position === 'left' ? 'Memories' : 'Film Strip'}
      </div>
      <div className="flex-1 w-full overflow-hidden relative rounded-2xl bg-white/40 p-2 border border-pink-300/40 backdrop-blur-sm shadow-xl">
        <motion.div
          animate={{ y: position === 'left' ? ['-50%', '0%'] : ['0%', '-50%'] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="flex flex-col gap-3"
        >
          {[...galleryItems, ...galleryItems].map((item, idx) => (
            <div
              key={idx}
              onClick={() => onSelectPhoto(item)}
              className="w-full aspect-[4/5] rounded-xl overflow-hidden cursor-pointer relative group border-2 border-white bg-white shadow-md hover:scale-105 transition-transform"
            >
              <img src={item.mediaUrl} alt={item.caption || 'Memory'} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                🔍
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// IMPORTANT DATES FLOWCHART / STORY TRACK
// ─────────────────────────────────────────────
function DatesFlowchart({
  project,
}: {
  project: Project;
}) {
  const dates = [
    ...(project.startDate ? [{ label: 'Where It Began 💫', date: project.startDate, emoji: '🌱' }] : []),
    ...(project.memories ? project.memories.slice(0, 4).map(m => ({ label: m.title, date: m.date, emoji: m.emoji || '✨' })) : []),
    { label: 'Forever & Always', date: null, emoji: '♾️' },
  ];

  return (
    <div className="hidden lg:flex fixed left-6 top-24 bottom-24 w-36 z-30 flex-col items-center pointer-events-auto">
      <div className="mb-2 px-3 py-1 rounded-full bg-white/80 backdrop-blur-md border border-pink-200 text-[11px] font-bold text-pink-700 shadow-sm flex items-center gap-1">
        <span>🗓️</span> Story Track
      </div>
      <div className="flex-1 w-full overflow-y-auto relative rounded-2xl bg-white/45 p-3 border border-pink-300/40 backdrop-blur-sm shadow-xl flex flex-col justify-around">
        {dates.map((d, idx) => (
          <div key={idx} className="relative flex flex-col items-center text-center">
            {idx > 0 && <div className="w-0.5 h-6 bg-pink-300/60 my-1" />}
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-sm shadow-sm border border-pink-200">
              {d.emoji}
            </div>
            <span className="text-[10px] font-bold text-pink-900 mt-1 line-clamp-1">{d.label}</span>
            {d.date && (
              <span className="text-[9px] text-pink-600 font-mono">
                {new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAKE A WISH / SURPRISE POPUP MODAL (FROM GIFT BOX)
// ─────────────────────────────────────────────
function MakeAWishModal({
  onClose,
  recipientName,
  customPrompt,
}: {
  onClose: () => void;
  recipientName: string;
  customPrompt?: string;
}) {
  const [wish, setWish] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wish.trim()) return;
    setSaved(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-pink-950/70 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.85, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0 }}
        className="w-full max-w-sm rounded-3xl p-6 text-center border-2 border-pink-200 relative shadow-2xl"
        style={{
          background: 'linear-gradient(145deg, #fff5f8 0%, #ffe4ec 100%)',
        }}
      >
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-pink-100/80 hover:bg-pink-200 text-pink-700 flex items-center justify-center font-bold text-base cursor-pointer z-50"
        >
          ✕
        </button>
        <span className="text-6xl block mb-3 animate-bounce">🎁</span>
        <h3 className="text-xl font-bold text-pink-800 font-serif mb-1">Make a Secret Wish! ✨</h3>
        <p className="text-xs text-pink-700/80 mb-4 font-sans">
          {customPrompt || `What is your deepest wish today, ${recipientName || 'my love'}?`}
        </p>

        {!saved ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={wish}
              onChange={e => setWish(e.target.value)}
              placeholder="Type your heartfelt wish here... 🌟"
              rows={3}
              required
              className="w-full p-3 rounded-2xl border border-pink-200 bg-white/90 text-pink-900 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none font-sans"
            />
            <button
              type="submit"
              className="w-full py-2.5 rounded-full text-xs uppercase tracking-wider font-bold text-white bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 transition-all cursor-pointer shadow-md"
            >
              Send Wish to the Stars 🌠
            </button>
          </form>
        ) : (
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="p-4 bg-white/80 rounded-2xl border border-pink-100">
            <span className="text-4xl block mb-2">🎉</span>
            <p className="text-sm font-bold text-pink-800 mb-1">Your wish has been whispered to the universe!</p>
            <p className="text-xs text-pink-600 italic">"May every tiny sparkle of this wish come true." ✨</p>
            <button
              onClick={onClose}
              className="mt-4 px-5 py-2 bg-pink-500 text-white rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Close 💕
            </button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// 3D BIRTHDAY CAKE & CANDLE BLOW STATION
// ─────────────────────────────────────────────
function BirthdayCakeStation({
  name,
  onWishSuccess,
}: {
  name: string;
  onWishSuccess?: () => void;
}) {
  const [blown, setBlown] = useState(false);
  const [candles, setCandles] = useState([true, true, true]);
  const [showWishModal, setShowWishModal] = useState(false);

  const blowCandles = () => {
    if (blown) return;
    setCandles([false, false, false]);
    setBlown(true);
    setTimeout(() => {
      setShowWishModal(true);
      if (onWishSuccess) onWishSuccess();
    }, 1000);
  };

  return (
    <div className="relative max-w-md mx-auto my-10 p-6 rounded-3xl text-center bg-white/70 backdrop-blur-xl border border-pink-200 shadow-xl">
      <span className="text-xs uppercase tracking-widest text-pink-600 font-bold block mb-1">
        ✨ Interactive Birthday Cake
      </span>
      <h3 className="font-serif text-2xl font-bold text-pink-900 mb-4">
        Blow the Candles, {name}! 🎂
      </h3>

      <div
        onClick={blowCandles}
        className="relative my-6 py-6 cursor-pointer flex flex-col items-center justify-center select-none group"
      >
        <div className="flex gap-6 mb-2">
          {candles.map((lit, i) => (
            <div key={i} className="flex flex-col items-center relative">
              <AnimatePresence>
                {lit ? (
                  <motion.div
                    animate={{
                      scale: [1, 1.25, 0.9, 1.15, 1],
                      opacity: [0.9, 1, 0.85, 1],
                      y: [0, -2, 0],
                    }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                    className="w-4 h-6 rounded-full bg-gradient-to-t from-amber-500 via-yellow-300 to-white shadow-[0_0_15px_#f59e0b]"
                  />
                ) : (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1.5, opacity: [1, 0], y: -20 }}
                    transition={{ duration: 1 }}
                    className="text-xs text-gray-400 font-bold"
                  >
                    💨
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="w-1.5 h-7 bg-gradient-to-b from-pink-300 to-rose-400 rounded-sm shadow-xs mt-1" />
            </div>
          ))}
        </div>

        <div className="w-40 h-10 rounded-2xl bg-gradient-to-r from-pink-200 via-rose-100 to-pink-200 border-2 border-pink-300 shadow-md relative overflow-hidden flex items-center justify-center">
          <span className="text-xs font-bold text-pink-600 font-serif">Happy Birthday</span>
        </div>
        <div className="w-48 h-12 rounded-2xl bg-gradient-to-r from-pink-300 via-rose-200 to-pink-300 border-2 border-pink-400 shadow-lg -mt-2 flex items-center justify-center">
          <span className="text-sm">🍓 🌸 🍓 🌸 🍓</span>
        </div>
        <div className="w-56 h-14 rounded-2xl bg-gradient-to-r from-rose-400 via-pink-300 to-rose-400 border-2 border-rose-500 shadow-xl -mt-2 flex items-center justify-center">
          <span className="text-md">✨ 💖 🎂 💖 ✨</span>
        </div>
      </div>

      <p className="text-xs text-pink-800/80 font-medium font-sans">
        {!blown ? '👆 Tap the cake to blow the candles and make a wish!' : '🎉 Candles blown! May all your wishes come true!'}
      </p>

      <AnimatePresence>
        {showWishModal && (
          <MakeAWishModal
            recipientName={name}
            onClose={() => setShowWishModal(false)}
            customPrompt="What is your birthday wish for this upcoming year? 🎂"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────
// HERO MESSAGE POPUP MODAL (TAGLINE CLICK)
// ─────────────────────────────────────────────
function HeroMessageModal({
  tagline,
  message,
  onClose,
}: {
  tagline?: string;
  message?: string;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-pink-950/70 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md rounded-3xl p-6 sm:p-8 text-center relative border border-pink-200 shadow-2xl"
        style={{ background: 'linear-gradient(145deg, #ffffff 0%, #fff0f5 100%)' }}
      >
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-pink-100/80 hover:bg-pink-200 text-pink-700 flex items-center justify-center font-bold text-base cursor-pointer z-50"
        >
          ✕
        </button>
        <span className="text-5xl block mb-3 animate-bounce">💌</span>
        <h3 className="font-serif font-bold text-xl text-pink-900 mb-2">
          {tagline || 'Hero Opening Note'}
        </h3>
        <div className="p-4 rounded-2xl bg-pink-50/70 border border-pink-100 text-pink-900 text-sm leading-relaxed font-sans text-left my-4">
          <p className="whitespace-pre-wrap italic font-medium">
            {message || 'No opening message specified yet.'}
          </p>
        </div>
        <button
          onClick={onClose}
          className="px-6 py-2.5 rounded-full text-xs uppercase tracking-widest font-bold text-white bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 shadow-md cursor-pointer"
        >
          Close Note 🌸
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// ENDING LETTER POPUP MODAL
// ─────────────────────────────────────────────
function EndingLetterModal({
  title,
  message,
  signature,
  onClose,
}: {
  title?: string;
  message?: string;
  signature?: string;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-pink-950/70 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md rounded-3xl p-6 sm:p-8 text-center relative border border-pink-200 shadow-2xl"
        style={{ background: 'linear-gradient(145deg, #ffffff 0%, #fff0f5 100%)' }}
      >
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-pink-100/80 hover:bg-pink-200 text-pink-700 flex items-center justify-center font-bold text-base cursor-pointer z-50"
        >
          ✕
        </button>
        <span className="text-5xl block mb-3">🌸</span>
        <h3 className="font-serif font-bold text-2xl text-pink-950 mb-2">
          {title || 'Forever & Always'}
        </h3>
        <div className="p-5 rounded-2xl bg-pink-50/70 border border-pink-100 text-pink-900 text-sm leading-relaxed font-sans text-left my-4">
          <p className="whitespace-pre-wrap italic font-medium">
            {message || 'Thank you for making every single day sweeter and brighter.'}
          </p>
        </div>
        {signature && (
          <p className="font-serif italic font-bold text-pink-700 text-base mb-4">
            — With All My Love, {signature} 💕
          </p>
        )}
        <button
          onClick={onClose}
          className="px-6 py-2.5 rounded-full text-xs uppercase tracking-widest font-bold text-white bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 shadow-md cursor-pointer"
        >
          Cherish Always 💖
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// MEMORIES TIMELINE MODAL (FROM ORBITAL MENU)
// ─────────────────────────────────────────────
function MemoriesModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const memories = project.memories || [];
  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-pink-950/70 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-lg rounded-3xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto relative"
        style={{
          background: 'linear-gradient(145deg, #fff7fa 0%, #ffe9f2 100%)',
          border: '1px solid rgba(244, 114, 182, 0.4)',
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔍</span>
            <h3 className="font-serif font-bold text-pink-900 text-lg sm:text-xl">Our Memories & Milestones</h3>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="w-9 h-9 rounded-full bg-pink-100/80 hover:bg-pink-200 text-pink-700 flex items-center justify-center font-bold text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        {memories.length === 0 ? (
          <div className="text-center py-12 text-pink-800/70 text-sm">
            <span className="text-4xl block mb-2">🌸</span>
            No timeline memories added yet.
          </div>
        ) : (
          <div className="relative border-l-2 border-pink-300 ml-4 pl-5 space-y-6">
            {memories.map((m) => (
              <div key={m.id} className="relative p-4 rounded-2xl bg-white/90 border border-pink-200 shadow-sm">
                <div className="absolute -left-[27px] top-4 w-3.5 h-3.5 rounded-full bg-pink-500 border-2 border-white shadow-xs" />
                <span className="text-[11px] font-bold text-pink-600 block mb-1">
                  {new Date(m.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
                <h4 className="font-serif font-bold text-pink-950 text-base mb-1">
                  {m.emoji} {m.title}
                </h4>
                {m.description && (
                  <p className="text-xs text-gray-700 leading-relaxed font-sans mb-2">{m.description}</p>
                )}
                {m.imageUrl && (
                  <div className="rounded-xl overflow-hidden border border-pink-100 max-h-48 mt-2">
                    <img src={m.imageUrl} alt={m.title} className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ENVELOPE LOVE LETTER MODAL
// ─────────────────────────────────────────────
function EnvelopeLetterModal({
  message,
  signature,
  musicUrl,
  onClose,
  welcomePopupText,
  envelopeStyle = 'gold',
}: {
  message: string;
  signature?: string;
  musicUrl?: string;
  onClose: () => void;
  welcomePopupText?: string;
  envelopeStyle?: string;
  envelopeOpenEffect?: string;
}) {
  const [phase, setPhase] = useState<'closed' | 'opening' | 'open' | 'reading'>('closed');
  const [sealCrumble, setSealCrumble] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);
  const localAudioRef = useRef<HTMLAudioElement | null>(null);

  const fullText = message || '';
  const tokens = fullText.match(/\S+|\s+/g) || [];
  const totalCount = tokens.length;

  useEffect(() => {
    if (musicUrl && localAudioRef.current) {
      localAudioRef.current.volume = 0.4;
      localAudioRef.current.play().catch(() => {});
    }
    return () => localAudioRef.current?.pause();
  }, [musicUrl]);

  const handleEnvelopeClick = () => {
    setSealCrumble(true);
    setTimeout(() => {
      setPhase('opening');
      setTimeout(() => {
        setPhase('open');
        setTimeout(() => setPhase('reading'), 1000);
      }, 1000);
    }, 600);
  };

  useEffect(() => {
    if (phase !== 'reading') return;
    if (visibleCount >= totalCount) return;
    const timer = setTimeout(() => setVisibleCount(c => c + 1), 60);
    return () => clearTimeout(timer);
  }, [phase, visibleCount, totalCount]);

  const visibleText = tokens.slice(0, visibleCount).join('');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center p-6 bg-pink-100/95 backdrop-blur-md"
    >
      {musicUrl && <audio ref={localAudioRef} src={musicUrl} loop />}

      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-pink-700 flex items-center justify-center font-bold text-lg shadow-md cursor-pointer z-50"
      >
        ✕
      </button>

      <div className="relative flex flex-col items-center max-w-sm w-full" style={{ perspective: 1200 }}>
        <AnimatePresence>
          {phase !== 'reading' && (
            <motion.div
              key="envelope"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full aspect-[4/3] rounded-3xl relative flex flex-col items-center justify-center cursor-pointer border border-pink-300/30 overflow-visible shadow-2xl"
              onClick={handleEnvelopeClick}
              style={{
                background: 'linear-gradient(145deg, #ffb6c1 0%, #ff8da1 100%)',
                boxShadow: '0 25px 60px rgba(255,105,180,0.3), inset 0 0 20px rgba(255,255,255,0.2)',
              }}
            >
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
                  background: 'linear-gradient(180deg, #ffa4b6 0%, #ff8da1 100%)',
                  borderRadius: '24px 24px 0 0',
                  clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                  zIndex: 2,
                }}
              />

              <div className="absolute z-10 flex flex-col items-center">
                <motion.div
                  animate={sealCrumble ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-2 border-amber-200"
                  style={{
                    background: envelopeStyle === 'gold' ? 'linear-gradient(135deg, #ffd700, #d4af37)' : 'linear-gradient(135deg, #ff4081, #d81b60)',
                  }}
                >
                  <span className="text-xl">💌</span>
                </motion.div>
                <span className="text-white text-xs font-bold mt-2 drop-shadow">
                  {welcomePopupText || 'Tap seal to break & open letter'}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {phase === 'reading' && (
            <motion.div
              key="letter"
              initial={{ opacity: 0, y: 50, scale: 0.93 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.7 }}
              className="w-full max-h-[65vh] overflow-y-auto rounded-3xl p-6 sm:p-8 relative border border-pink-200 shadow-2xl"
              style={{
                background: 'white',
                backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, #ffe4ec 27px, #ffe4ec 28px)',
                backgroundPositionY: '8px',
              }}
            >
              <div className="relative z-10" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>
                <p className="text-sm leading-8 text-pink-950 whitespace-pre-wrap font-medium">
                  {visibleText}
                  {visibleCount < totalCount && (
                    <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.6, repeat: Infinity }} className="text-pink-500 font-bold ml-1">|</motion.span>
                  )}
                </p>
                {visibleCount >= totalCount && signature && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-right text-pink-700 font-serif italic mt-6 text-md font-bold"
                  >
                    — With Love, {signature} 🌸
                  </motion.p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {phase === 'reading' && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            onClick={onClose}
            className="mt-6 px-6 py-2.5 rounded-full text-xs uppercase tracking-widest font-bold text-white bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 transition-all cursor-pointer shadow-md"
          >
            Close Letter 💌
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// FULLSCREEN VOW PROMISE CARD MODAL
// ─────────────────────────────────────────────
function FullscreenPromiseModal({ emoji, text, secretNote, onClose }: { emoji: string; text: string; secretNote: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-[10000] flex items-center justify-center p-6 bg-black/85 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.85, rotate: -2 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0.85, opacity: 0 }}
        className="w-full max-w-sm rounded-3xl p-8 text-center border-2 border-pink-200 shadow-2xl relative"
        style={{ background: 'linear-gradient(135deg, #fff5f7 0%, #fff0f3 100%)' }}
      >
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-700 flex items-center justify-center font-bold text-base cursor-pointer z-50"
        >
          ✕
        </button>
        <span className="text-6xl block mb-4 animate-bounce">{emoji}</span>
        <h3 className="text-lg font-bold text-pink-700 font-serif mb-2">Our Special Vow</h3>
        <p className="text-md font-semibold text-pink-900 leading-snug mb-5" style={{ fontFamily: 'Be Vietnam Pro' }}>
          "{text}"
        </p>
        <div className="p-4 rounded-2xl bg-white border border-pink-100 shadow-inner mb-6">
          <span className="text-[10px] font-bold uppercase tracking-widest text-pink-400 block mb-1">Secret Note</span>
          <p className="text-xs italic text-pink-800 leading-relaxed">
            {secretNote || 'A promise to cherish forever.'}
          </p>
        </div>
        <button
          onClick={onClose}
          className="px-6 py-2.5 rounded-full text-xs uppercase tracking-widest font-bold text-white bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 transition-all cursor-pointer shadow-md"
        >
          Close Vow 💖
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// PROMISE WALL MODAL (ORBITAL MENU LIST)
// ─────────────────────────────────────────────
function PromiseWallModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const cfg = project.heroConfig || {};
  const promises = cfg.promises || [];
  const [activePromise, setActivePromise] = useState<any | null>(null);

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-900/60 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto relative"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💍</span>
            <span className="font-bold text-pink-700 font-serif text-lg">{cfg.promiseWallTitle || 'Our Vows'}</span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="w-8 h-8 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-700 flex items-center justify-center font-bold text-base cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {promises.map((p: any, idx: number) => (
            <div
              key={idx}
              onClick={() => setActivePromise(p)}
              className="p-4 rounded-2xl text-center border border-pink-100 hover:border-pink-300 bg-pink-50/40 hover:bg-pink-100/60 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[120px]"
            >
              <span className="text-3xl mb-2">{p.emoji || '💖'}</span>
              <p className="text-xs font-semibold text-pink-900 line-clamp-2">{p.text}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {activePromise && (
          <FullscreenPromiseModal
            emoji={activePromise.emoji}
            text={activePromise.text}
            secretNote={activePromise.secretNote}
            onClose={() => setActivePromise(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────
// SECRET VIDEO PLAYER MODAL
// ─────────────────────────────────────────────
function SecretVideoModal({ url, onClose }: { url: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
    >
      <div className="relative max-w-3xl w-full max-h-[85vh] flex flex-col items-center">
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="absolute -top-10 right-0 w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center font-bold text-lg cursor-pointer"
        >
          ✕
        </button>
        <div className="w-full rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-black">
          <video src={url} controls autoPlay className="w-full h-auto max-h-[70vh]" />
        </div>
        <p className="text-white/70 text-xs mt-3 italic" style={{ fontFamily: 'Be Vietnam Pro' }}>
          Personalized Secret Video 🎬
        </p>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// PHOTO LIGHTBOX MODAL (ADAPTIVE 16:9 / MOBILE)
// ─────────────────────────────────────────────
function LightboxModal({ item, onClose }: { item: GalleryItem; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
    >
      <div className="relative max-w-4xl w-full max-h-[88vh] flex flex-col items-center">
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="absolute -top-11 right-0 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center font-bold text-xl cursor-pointer"
        >
          ✕
        </button>
        <div className="w-full rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-black flex items-center justify-center">
          <img src={item.mediaUrl} alt={item.caption || 'Memory'} className="max-h-[75vh] w-auto max-w-full object-contain" />
        </div>
        {item.caption && (
          <p className="text-white text-sm mt-3 font-serif italic text-center px-4">
            "{item.caption}"
          </p>
        )}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// CUTE PANDA SELFIE THANK YOU
// ─────────────────────────────────────────────
function PandaSelfieWidget({ projectSlug }: { projectSlug: string }) {
  const [showPanda, setShowPanda] = useState(true);
  const [state, setState] = useState<'invite' | 'uploading' | 'completed'>('invite');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setState('uploading');
    try {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`/api/public/memory/${projectSlug}/selfie`, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        setState('completed');
      } else {
        setState('invite');
      }
    } catch {
      setState('invite');
    }
  };

  if (!showPanda) return null;

  return (
    <div className="my-12 p-6 rounded-3xl border border-pink-200 text-center relative z-10 mx-auto max-w-sm bg-white/80 backdrop-blur-xl shadow-xl">
      <div className="relative inline-block mb-3">
        <motion.div
          animate={{ rotate: [0, -6, 6, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="text-6xl select-none"
        >
          🐼
        </motion.div>
      </div>

      {state === 'invite' && (
        <>
          <p className="text-sm font-semibold text-pink-700 mb-2">Send a Selfie to Thank Them? 💕</p>
          <p className="text-xs text-gray-500 mb-4">Snap or drop a cute selfie to say thank you for creating this memory page!</p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md"
            >
              Take / Upload Selfie 📸
            </button>
            <button
              onClick={() => setShowPanda(false)}
              className="px-4 py-2 text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              No, Thanks
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="user"
            onChange={handleUpload}
            className="hidden"
          />
        </>
      )}

      {state === 'uploading' && (
        <div>
          <div className="w-8 h-8 rounded-full border-4 border-pink-200 border-t-pink-500 animate-spin mx-auto mb-3" />
          <p className="text-xs text-pink-600 font-bold">Uploading selfie to thank them... 🐼</p>
        </div>
      )}

      {state === 'completed' && (
        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
          <p className="text-sm font-semibold text-green-600 mb-2">Selfie sent successfully! 🎉</p>
          <p className="text-xs text-gray-500">Your selfie has been shared to their dashboard. Thank you! ❤️</p>
        </motion.div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// AWARD MODAL
// ─────────────────────────────────────────────
function AwardModal({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-900/60 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-sm bg-white rounded-3xl p-6 text-center shadow-2xl relative"
      >
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-700 flex items-center justify-center font-bold text-base cursor-pointer"
        >
          ✕
        </button>
        <span className="text-7xl block mb-4 animate-bounce">🏆</span>
        <h2 className="text-xl font-bold text-pink-700 font-serif mb-2">Certificate of Love</h2>
        <p className="text-xs text-gray-500 mb-3" style={{ fontFamily: 'Be Vietnam Pro' }}>
          This award is officially presented to:
        </p>
        <p className="text-xl font-extrabold text-pink-900 border-b-2 border-pink-200 pb-2 inline-block px-4 mb-4" style={{ fontFamily: 'Plus Jakarta Sans' }}>
          {project.personTwoName || 'Recipient'}
        </p>
        <p className="text-sm text-pink-600 italic font-semibold leading-relaxed mb-6">
          "For being the most incredible, caring, and wonderful person in my universe."
        </p>
        <div className="flex justify-between items-center text-xs text-gray-400 border-t border-pink-100 pt-4">
          <span>Signed: {project.personOneName || 'Sender'}</span>
          <span>Date: {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Forever'}</span>
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
  const [openedReason, setOpenedReason] = useState<string | null>(null);
  const cfg = project.heroConfig || {};
  const customReasons = cfg.reasonsList || [];
  const reasons = customReasons.length > 0 ? customReasons : DEFAULT_REASONS;

  const pullReason = () => {
    const random = reasons[Math.floor(Math.random() * reasons.length)];
    setOpenedReason(random);
  };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-900/60 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-sm bg-white rounded-3xl p-6 text-center shadow-2xl relative"
      >
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-700 flex items-center justify-center font-bold text-base cursor-pointer"
        >
          ✕
        </button>
        <span className="text-7xl block mb-4">🏺</span>
        <h2 className="text-xl font-bold text-pink-700 font-serif mb-2">Jar of Love Reasons</h2>
        <p className="text-xs text-gray-400 mb-6">Tap the button to pull out a reason why you are so special!</p>

        <AnimatePresence mode="wait">
          {openedReason ? (
            <motion.div key="reason" initial={{ rotateY: 90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} exit={{ rotateY: -90, opacity: 0 }}
              className="p-5 rounded-2xl bg-pink-50 border border-pink-100 shadow-inner mb-6 min-h-[80px] flex items-center justify-center">
              <p className="text-sm font-semibold text-pink-800 italic">"{openedReason}"</p>
            </motion.div>
          ) : (
            <div className="mb-6 h-[80px]" />
          )}
        </AnimatePresence>

        <button onClick={pullReason}
          className="px-6 py-2.5 rounded-full text-xs uppercase tracking-widest font-bold text-white bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 transition-all cursor-pointer shadow-md">
          Pull a Reason 💌
        </button>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MUSIC PLAYER MODAL
// ─────────────────────────────────────────────
function MusicModal({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-900/60 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-sm bg-white rounded-3xl p-6 text-center shadow-2xl relative"
      >
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-700 flex items-center justify-center font-bold text-base cursor-pointer"
        >
          ✕
        </button>
        <span className="text-7xl block mb-4 animate-spin" style={{ animationDuration: '8s' }}>💿</span>
        <h2 className="text-xl font-bold text-pink-700 font-serif mb-2">Our Song</h2>
        <p className="text-xs text-gray-400 mb-6">Enjoy the ambient track configured for this memory page</p>

        <div className="p-4 rounded-xl bg-pink-50/50 mb-6 text-sm">
          <p className="font-bold text-pink-800">Background Harmony</p>
          <p className="text-xs text-gray-500 mt-1">Playing in the background of your story.</p>
        </div>

        <button onClick={onClose}
          className="px-6 py-2.5 rounded-full text-xs uppercase tracking-widest font-bold text-white bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 transition-all cursor-pointer shadow-md">
          Enjoy Music 🎵
        </button>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN THEME COMPONENT
// ─────────────────────────────────────────────
type ModalType = 'award' | 'memories' | 'letter' | 'jar' | 'music' | 'vows' | 'video' | 'wish' | 'cake' | 'heroNote' | 'endingNote' | null;

export default function SweetDiaryTheme({ project }: { project: Project }) {
  const cfg = project.heroConfig || {};
  const passcode = project.isPasswordProtected && project.accessPassword ? project.accessPassword : (cfg.passcode || '1234');
  const [unlocked, setUnlocked] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedGalleryPhoto, setSelectedGalleryPhoto] = useState<GalleryItem | null>(null);
  const [selectedPromise, setSelectedPromise] = useState<any | null>(null);

  // Box & Phone Themes
  const boxThemeKey = cfg.boxTheme || 'frosted-rose';
  const phoneThemeKey = cfg.phoneTheme || 'rose-gold';
  const boxTheme = BOX_THEMES[boxThemeKey] || BOX_THEMES['frosted-rose'];

  const baseItems = [
    { id: 'letter', emoji: '✉️', label: 'Love Letter' },
    { id: 'cake', emoji: '🎂', label: 'Cake & Wish' },
    { id: 'vows', emoji: '💍', label: 'Our Vows' },
    { id: 'memories', emoji: '🔍', label: 'Memories' },
    { id: 'award', emoji: '🏅', label: 'Love Award' },
    { id: 'jar', emoji: '🏺', label: 'Reasons Jar' },
    { id: 'music', emoji: '🎵', label: 'Our Song' },
    ...(cfg.secretVideoUrl ? [{ id: 'video', emoji: '🎬', label: 'Secret Video' }] : []),
  ];

  const total = baseItems.length;
  const menuItems = baseItems.map((item, index) => {
    const angle = -90 + (index * 360) / total;
    return { ...item, angle };
  });

  const radius = 125;

  // Orbital Wheel / Gift Box view
  const renderOrbitalStage = () => (
    <div className="flex flex-col items-center justify-between flex-1 py-2 w-full">
      <motion.div
        initial={{ y: -20, opacity: 0, rotate: -3 }}
        animate={{ y: 0, opacity: 1, rotate: -3 }}
        transition={{ duration: 0.7 }}
        className="self-start ml-2 mb-2"
        style={{
          background: 'white',
          padding: '8px 8px 24px',
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
          width: '125px',
        }}
      >
        {project.coverImageUrl ? (
          <img src={project.coverImageUrl} alt="cover" className="w-full aspect-square object-cover rounded-md" />
        ) : (
          <div className="w-full aspect-square flex items-center justify-center text-4xl bg-pink-50 rounded-md">💕</div>
        )}
        <p className="text-center mt-2 text-[11px] font-bold text-pink-700 font-sans">
          {project.startDate ? new Date(project.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Forever 🌸'}
        </p>
      </motion.div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center my-1"
      >
        <h1
          className="font-extrabold leading-tight text-pink-900 drop-shadow-md text-2xl sm:text-3xl font-serif"
        >
          {cfg.celebrateText || `Happy Birthday, ${project.personTwoName || 'You'}! 🎂`}
        </h1>
        {project.subtitle && (
          <p className="text-pink-800/80 text-xs mt-1 font-sans font-medium px-2">{project.subtitle}</p>
        )}
      </motion.div>

      <div className="relative flex items-center justify-center my-6" style={{ width: '280px', height: '280px' }}>
        {menuItems.map((item, i) => {
          const rad = ((item.angle - 90) * Math.PI) / 180;
          const x = radius * Math.cos(rad);
          const y = radius * Math.sin(rad);
          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.08, type: 'spring', stiffness: 220, damping: 18 }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setActiveModal(item.id as ModalType)}
              className="absolute flex flex-col items-center gap-1 cursor-pointer z-20"
              style={{ left: `calc(50% + ${x}px - 27px)`, top: `calc(50% + ${y}px - 27px)`, width: '54px' }}
            >
              <div
                className="w-13 h-13 rounded-2xl flex items-center justify-center text-2xl border-2 border-white/80"
                style={{
                  background: 'white',
                  boxShadow: '0 6px 18px rgba(244, 114, 182, 0.35)',
                }}
              >
                {item.emoji}
              </div>
              <span
                className="text-pink-950 text-[10px] font-bold text-center leading-tight bg-white/85 backdrop-blur-xs px-1.5 py-0.5 rounded-full shadow-xs whitespace-nowrap"
              >
                {item.label}
              </span>
            </motion.button>
          );
        })}

        {/* Center 3D Gift Box */}
        <motion.div
          animate={{ y: [0, -6, 0], rotate: [0, 1.5, -1.5, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setActiveModal('wish')}
          className="relative z-10 text-6xl cursor-pointer select-none"
          title="Tap the gift to make a secret wish! 🎁"
        >
          🎁
          <motion.div
            animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2.2, repeat: Infinity }}
            className="absolute -inset-3 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(255, 105, 180, 0.4) 0%, transparent 70%)' }}
          />
        </motion.div>
      </div>

      <p className="text-pink-800/80 text-xs text-center font-bold font-sans">
        ✨ Tap any icon or the Gift Box 🎁
      </p>
    </div>
  );

  return (
    <div
      className="min-h-screen select-none relative overflow-x-hidden"
      style={{
        background: 'linear-gradient(160deg, #ffeef4 0%, #ffd4e5 40%, #ffb6d0 100%)',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
      `}</style>

      <FloatingHearts />
      <ClickBurst />
      <WhiteHeartsTrail />

      {/* Side Panels */}
      {unlocked && (
        <>
          {cfg.showLeftFilmstrip && (
            <FilmstripColumn
              position="left"
              galleryItems={project.galleryItems || []}
              onSelectPhoto={item => setSelectedGalleryPhoto(item)}
            />
          )}

          {cfg.showDatesFlowchart && (
            <DatesFlowchart project={project} />
          )}

          {cfg.showRightFilmstrip !== false && (
            <FilmstripColumn
              position="right"
              galleryItems={project.galleryItems || []}
              onSelectPhoto={item => setSelectedGalleryPhoto(item)}
            />
          )}
        </>
      )}

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-6 sm:py-10">
        <AnimatePresence mode="wait">
          {!unlocked ? (
            <motion.div key="lock-view" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
              <PhoneFrame wallpaperUrl={cfg.wallpaperUrl} phoneTheme={phoneThemeKey}>
                <PasscodeScreen correctCode={passcode} onUnlock={() => setUnlocked(true)} />
              </PhoneFrame>
            </motion.div>
          ) : (
            <motion.div key="diary-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
              {/* Home Stage: Phone Framed OR Full Responsive Layout based on setting */}
              {cfg.enablePhoneFrameAfterPin ? (
                <PhoneFrame wallpaperUrl={cfg.wallpaperUrl} phoneTheme={phoneThemeKey}>
                  {renderOrbitalStage()}
                </PhoneFrame>
              ) : (
                <div className={`my-6 p-6 sm:p-10 rounded-[38px] ${boxTheme.card} transition-all max-w-2xl mx-auto`}>
                  {renderOrbitalStage()}
                </div>
              )}

              {/* ───────────────────────────────────────────── */}
              {/* SCROLLABLE STORY SECTIONS BELOW */}
              {/* ───────────────────────────────────────────── */}
              <div className="mt-12 space-y-16">
                {/* 1. Hero Greeting Note / Clickable Tagline */}
                <section className="text-center max-w-xl mx-auto px-4">
                  <span className="text-3xl mb-2 block animate-pulse">💌</span>
                  <div
                    onClick={() => setActiveModal('heroNote')}
                    className={`p-6 sm:p-8 rounded-[32px] ${boxTheme.card} cursor-pointer hover:scale-[1.02] transition-transform`}
                  >
                    <h2 className={`font-serif text-2xl sm:text-3xl font-bold ${boxTheme.title} mb-3`}>
                      {cfg.heroTagline || `For You, ${project.personTwoName || 'My Love'}`}
                    </h2>
                    <p className={`italic font-medium text-sm leading-relaxed font-sans ${boxTheme.subtitle}`}>
                      {cfg.heroGreetingText || cfg.heroMessage || cfg.welcomePopupText ||
                        `"Every single moment shared with you is a treasure. I built this special memory diary to celebrate your smile, your warmth, and the joy you bring into my life." 💕`}
                    </p>
                    <span className="inline-block mt-3 text-[11px] font-bold text-pink-600 uppercase tracking-wider">
                      Tap to view opening message ✨
                    </span>
                  </div>
                </section>

                {/* 2. Birthday Cake & Candle Station */}
                <section>
                  <BirthdayCakeStation name={project.personTwoName || 'You'} />
                </section>

                {/* 3. Our Memories Timeline Section */}
                {project.memories && project.memories.length > 0 && (
                  <section className="max-w-2xl mx-auto px-4">
                    <div className="text-center mb-8">
                      <span className="text-3xl">🔍</span>
                      <h2 className={`font-serif text-2xl sm:text-3xl font-bold ${boxTheme.title} mt-1`}>
                        Our Story & Memories
                      </h2>
                      <p className={`text-xs ${boxTheme.subtitle} mt-1`}>Milestones of our journey together</p>
                    </div>

                    <div className="relative border-l-2 border-pink-300 ml-4 sm:ml-8 pl-6 space-y-8">
                      {project.memories.map((m) => (
                        <motion.div
                          key={m.id}
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          className={`relative p-5 rounded-3xl ${boxTheme.card}`}
                        >
                          <div className="absolute -left-[31px] top-6 w-4 h-4 rounded-full bg-pink-500 border-4 border-white shadow-sm" />
                          <span className="text-xs font-bold text-pink-500 block mb-1">
                            {new Date(m.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </span>
                          <h4 className={`font-serif font-bold ${boxTheme.title} text-base mb-1`}>
                            {m.emoji} {m.title}
                          </h4>
                          {m.description && (
                            <p className="text-xs text-gray-700 leading-relaxed font-sans mb-3">{m.description}</p>
                          )}
                          {m.imageUrl && (
                            <div className="rounded-2xl overflow-hidden border border-pink-100 max-h-56">
                              <img src={m.imageUrl} alt={m.title} className="w-full h-full object-cover" />
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </section>
                )}

                {/* 4. Promise Wall Cards Section (Clicking opens ONLY that clicked card) */}
                {cfg.promises && cfg.promises.length > 0 && (
                  <section className="max-w-3xl mx-auto px-4">
                    <div className="text-center mb-8">
                      <span className="text-3xl">💍</span>
                      <h2 className={`font-serif text-2xl sm:text-3xl font-bold ${boxTheme.title} mt-1`}>
                        {cfg.promiseWallTitle || 'Our Promises & Vows'}
                      </h2>
                      <p className={`text-xs ${boxTheme.subtitle} mt-1`}>Tap any promise card to reveal its secret note</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {cfg.promises.map((p: any, idx: number) => (
                        <motion.div
                          key={idx}
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => setSelectedPromise(p)}
                          className={`p-5 rounded-3xl ${boxTheme.card} text-center cursor-pointer flex flex-col items-center justify-center min-h-[140px]`}
                        >
                          <span className="text-4xl mb-2">{p.emoji || '💖'}</span>
                          <p className={`text-xs font-bold ${boxTheme.title} line-clamp-2`}>{p.text}</p>
                          <span className="text-[10px] text-pink-500 mt-2 font-semibold">Tap to reveal vow 💌</span>
                        </motion.div>
                      ))}
                    </div>
                  </section>
                )}

                {/* 5. Photo & Video Gallery Section (Mobile-friendly 16:9 / Natural Aspect Ratios) */}
                {project.galleryItems && project.galleryItems.length > 0 && (
                  <section className="max-w-3xl mx-auto px-4">
                    <div className="text-center mb-8">
                      <span className="text-3xl">📸</span>
                      <h2 className={`font-serif text-2xl sm:text-3xl font-bold ${boxTheme.title} mt-1`}>
                        {cfg.galleryTitle || 'Captured Moments'}
                      </h2>
                      <p className={`text-xs ${boxTheme.subtitle} mt-1`}>{cfg.galleryQuote || 'Every picture tells our story'}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {project.galleryItems.map((item) => (
                        <motion.div
                          key={item.id}
                          whileHover={{ scale: 1.03 }}
                          onClick={() => setSelectedGalleryPhoto(item)}
                          className="aspect-[16/9] sm:aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer relative group border-2 border-white/80 bg-white/60 shadow-md"
                        >
                          <img src={item.mediaUrl} alt={item.caption || 'Photo'} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-pink-600/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                            <span className="text-white text-xs font-bold drop-shadow truncate">{item.caption || 'Tap to expand 🔍'}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </section>
                )}

                {/* 6. Closing Section (Themed Box + Popup Trigger) */}
                <section className="text-center max-w-xl mx-auto px-4 pt-6">
                  <div
                    onClick={() => setActiveModal('endingNote')}
                    className={`p-8 rounded-[32px] ${boxTheme.card} cursor-pointer hover:scale-[1.02] transition-transform`}
                  >
                    <span className="text-4xl mb-2 block">🌸</span>
                    <h3 className={`font-serif text-2xl font-bold ${boxTheme.title} mb-2`}>
                      {project.endingConfig?.title || 'Forever & Always'}
                    </h3>
                    <p className={`text-sm leading-relaxed font-sans mb-4 ${boxTheme.subtitle}`}>
                      {project.endingConfig?.message || 'Thank you for making every single day sweeter and brighter.'}
                    </p>
                    <p className="font-serif italic font-bold text-pink-700 text-base mb-3">
                      — With Love, {project.personOneName || 'Me'} 💕
                    </p>
                    <button
                      type="button"
                      className="px-5 py-2 bg-gradient-to-r from-pink-500 to-rose-400 text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-md"
                    >
                      Read Full Ending Note 💌
                    </button>
                  </div>
                </section>

                {/* 7. Panda Selfie Widget */}
                {cfg.enableSelfieThankYou && (
                  <PandaSelfieWidget projectSlug={project.slug} />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ───────────────────────────────────────────── */}
      {/* MODALS & OVERLAYS */}
      {/* ───────────────────────────────────────────── */}
      <AnimatePresence>
        {activeModal === 'award' && <AwardModal project={project} onClose={() => setActiveModal(null)} />}
        {activeModal === 'jar' && <JarModal project={project} onClose={() => setActiveModal(null)} />}
        {activeModal === 'music' && <MusicModal project={project} onClose={() => setActiveModal(null)} />}
        {activeModal === 'vows' && <PromiseWallModal project={project} onClose={() => setActiveModal(null)} />}
        {activeModal === 'memories' && <MemoriesModal project={project} onClose={() => setActiveModal(null)} />}
        {activeModal === 'heroNote' && (
          <HeroMessageModal
            tagline={cfg.heroTagline}
            message={cfg.heroGreetingText || cfg.heroMessage || cfg.welcomePopupText}
            onClose={() => setActiveModal(null)}
          />
        )}
        {activeModal === 'endingNote' && (
          <EndingLetterModal
            title={project.endingConfig?.title}
            message={project.endingConfig?.message}
            signature={project.personOneName || undefined}
            onClose={() => setActiveModal(null)}
          />
        )}
        {activeModal === 'video' && cfg.secretVideoUrl && (
          <SecretVideoModal url={cfg.secretVideoUrl} onClose={() => setActiveModal(null)} />
        )}
        {activeModal === 'wish' && (
          <MakeAWishModal
            recipientName={project.personTwoName || ''}
            onClose={() => setActiveModal(null)}
            customPrompt={cfg.giftBoxWishPrompt}
          />
        )}
        {activeModal === 'cake' && (
          <div
            onClick={(e) => { if (e.target === e.currentTarget) setActiveModal(null); }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-900/60 backdrop-blur-md"
          >
            <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl">
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-700 flex items-center justify-center font-bold text-base cursor-pointer z-50"
              >
                ✕
              </button>
              <BirthdayCakeStation name={project.personTwoName || 'You'} onWishSuccess={() => {}} />
            </div>
          </div>
        )}
        {activeModal === 'letter' && (
          <EnvelopeLetterModal
            message={cfg.letterMessage || cfg.loveLetterText}
            signature={cfg.quillSignature}
            musicUrl={cfg.letterMusicUrl || undefined}
            welcomePopupText={cfg.welcomePopupText}
            envelopeStyle={cfg.envelopeStyle}
            envelopeOpenEffect={cfg.envelopeOpenEffect}
            onClose={() => setActiveModal(null)}
          />
        )}
        {selectedGalleryPhoto && (
          <LightboxModal item={selectedGalleryPhoto} onClose={() => setSelectedGalleryPhoto(null)} />
        )}
        {selectedPromise && (
          <FullscreenPromiseModal
            emoji={selectedPromise.emoji}
            text={selectedPromise.text}
            secretNote={selectedPromise.secretNote}
            onClose={() => setSelectedPromise(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
