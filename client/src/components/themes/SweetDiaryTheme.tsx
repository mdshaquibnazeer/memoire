'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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
    if (input.length >= correctCode.length) return;
    const next = input + val;
    setInput(next);
    if (next.length === correctCode.length) {
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

        {/* Passcode dots dynamically spaced based on code length */}
        <motion.div
          animate={shake ? { x: [-8, 8, -8, 8, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="flex gap-4 mb-2"
        >
          {Array.from({ length: correctCode.length }).map((_, i) => (
            <motion.div
              key={i}
              animate={{ scale: input.length > i ? 1.2 : 1 }}
              className="w-5 h-5 rounded-full border-2 border-white/60 transition-all duration-200"
              style={{ background: input.length > i ? '#fff' : 'rgba(255,255,255,0.25)' }}
            />
          ))}
        </motion.div>

        {hint && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-100 text-sm mb-2 font-bold">
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
      </motion.div>
    </div>
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
      className="fixed inset-0 z-[10000] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.85, rotate: -2 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0.85, opacity: 0 }}
        className="w-full max-w-sm rounded-3xl p-8 text-center border-2 border-pink-200"
        style={{
          background: 'linear-gradient(135deg, #fff5f7 0%, #fff0f3 100%)',
          boxShadow: '0 25px 50px rgba(255,105,180,0.25)',
        }}
      >
        <span className="text-6xl block mb-6 animate-bounce">{emoji}</span>
        <h3 className="text-lg font-bold text-pink-700 font-serif mb-3">Our Vow</h3>
        <p className="text-md font-semibold text-pink-900 leading-snug mb-6" style={{ fontFamily: 'Be Vietnam Pro' }}>
          "{text}"
        </p>
        <div className="p-4 rounded-2xl bg-white border border-pink-100 shadow-inner mb-6">
          <span className="text-[10px] font-bold uppercase tracking-widest text-pink-400 block mb-2">Secret Message</span>
          <p className="text-sm italic text-pink-800 leading-relaxed">
            {secretNote || 'A special promise to hold close to my heart.'}
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
// PROMISE WALL MODAL
// ─────────────────────────────────────────────
function PromiseWallModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const cfg = project.heroConfig || {};
  const promises = cfg.promises || [];
  const [activePromise, setActivePromise] = useState<any | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-100/80 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💍</span>
            <span className="font-bold text-pink-700 font-serif">{cfg.promiseWallTitle || 'Our Vows'}</span>
          </div>
          <button onClick={onClose} className="text-pink-400 hover:text-pink-600 text-xl font-bold p-1">✕</button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {promises.map((p: any, idx: number) => (
            <div
              key={idx}
              onClick={() => setActivePromise(p)}
              className="p-4 rounded-2xl text-center border border-pink-100 hover:border-pink-300 bg-pink-50/30 hover:bg-pink-50/80 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[120px]"
            >
              <span className="text-3xl mb-2">{p.emoji || '💖'}</span>
              <p className="text-xs font-semibold text-pink-800 line-clamp-2">{p.text}</p>
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
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
    >
      <div className="relative max-w-3xl w-full max-h-[80vh] flex flex-col items-center">
        <button onClick={onClose} className="absolute -top-12 right-0 text-white/70 hover:text-white text-3xl font-bold p-2">✕</button>
        <div className="w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
          <video src={url} controls autoPlay className="w-full h-auto max-h-[65vh]" />
        </div>
        <p className="text-white/60 text-xs mt-3 italic" style={{ fontFamily: 'Be Vietnam Pro' }}>
          Your custom personalized video file 🎬
        </p>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// WAX SEAL ENVELOPE MODAL (Sweet Diary style)
// ─────────────────────────────────────────────
function EnvelopeLetterModal({
  message,
  signature,
  musicUrl,
  onClose,
  welcomePopupText,
  envelopeStyle = 'gold',
  envelopeOpenEffect = 'shimmer',
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
    return () => {
      localAudioRef.current?.pause();
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

  useEffect(() => {
    if (phase !== 'reading') return;
    if (visibleCount >= totalCount) return;
    const timer = setTimeout(() => {
      setVisibleCount(c => c + 1);
    }, 60);
    return () => clearTimeout(timer);
  }, [phase, visibleCount, totalCount]);

  const visibleText = tokens.slice(0, visibleCount).join('');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center p-6 bg-pink-100/95 backdrop-blur-md"
    >
      {musicUrl && <audio ref={localAudioRef} src={musicUrl} loop />}

      <div className="relative flex flex-col items-center max-w-sm w-full" style={{ perspective: 1200 }}>
        
        {/* Envelope view */}
        <AnimatePresence>
          {phase !== 'reading' && (
            <motion.div
              key="envelope"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full aspect-[4/3] rounded-3xl relative flex flex-col items-center justify-center cursor-pointer border border-pink-300/30 overflow-visible"
              onClick={handleEnvelopeClick}
              style={{
                background: 'linear-gradient(145deg, #ffb6c1 0%, #ff8da1 100%)',
                boxShadow: '0 25px 60px rgba(255,105,180,0.3), inset 0 0 20px rgba(255,255,255,0.2)',
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
                <div
                  className="absolute inset-0 backface-hidden rounded-t-3xl border-b border-white/20"
                  style={{
                    background: 'linear-gradient(180deg, #ff8da1 0%, #ffb6c1 100%)',
                    clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                  }}
                />
                <div
                  className="absolute inset-0 backface-hidden rounded-t-3xl rotate-y-180"
                  style={{
                    background: 'linear-gradient(180deg, #ffb6c1 0%, #ffe0ec 100%)',
                    clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                  }}
                />
              </motion.div>

              {/* Seal */}
              <motion.div
                animate={sealCrumble ? { scale: [1, 1.2, 0], opacity: 0 } : { scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-16 h-16 rounded-full flex items-center justify-center border-2 z-20 absolute"
                style={{
                  borderColor: '#fff',
                  background: 'radial-gradient(circle, #e8607a, #b5264a)',
                  boxShadow: '0 0 20px rgba(232,96,122,0.5)',
                }}
              >
                <span className="text-3xl">💖</span>
              </motion.div>

              <p className="text-[10px] uppercase tracking-widest font-bold mt-20 text-white select-none z-10" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                {sealCrumble ? 'Opening...' : 'Tap seal to read letter'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Parchment scroll */}
        <AnimatePresence>
          {phase === 'reading' && (
            <motion.div
              key="letter"
              initial={{ opacity: 0, y: 50, scale: 0.93 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.7 }}
              className="w-full max-h-[60vh] overflow-y-auto rounded-2xl p-6 relative border border-pink-200"
              style={{
                background: 'white',
                backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, #ffb6c1 27px, #ffb6c1 28px)',
                backgroundPositionY: '8px',
                boxShadow: '0 25px 80px rgba(255,105,180,0.3)',
              }}
            >
              <div className="relative z-10" style={{ fontFamily: 'Be Vietnam Pro' }}>
                <p className="text-sm leading-8 text-pink-900 whitespace-pre-wrap">
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
                    className="text-right text-pink-600 font-serif italic mt-6 text-md font-bold"
                  >
                    — With Love, {signature} 🌸
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
            className="mt-6 px-6 py-2.5 rounded-full text-xs uppercase tracking-widest font-bold text-white bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 transition-all cursor-pointer shadow-md"
            style={{ fontFamily: 'Plus Jakarta Sans' }}
          >
            Close Letter 💌
          </motion.button>
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
    <div className="mt-12 p-6 rounded-3xl border border-pink-200 text-center relative z-10 mx-auto max-w-sm"
      style={{ background: 'white', boxShadow: '0 12px 30px rgba(255,105,180,0.15)' }}>
      <div className="relative inline-block mb-3">
        {/* Animated Panda Emoji */}
        <motion.div
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="text-6xl select-none"
        >
          🐼
        </motion.div>
      </div>

      {state === 'invite' && (
        <>
          <p className="text-sm font-semibold text-pink-700 mb-2">Send a Selfie to Thank Them? 💕</p>
          <p className="text-xs text-gray-500 mb-4">Snap or drop a selfie to say thank you for creating this memory page! It's not mandatory, but will bring a huge smile! 😊</p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Take/Upload Selfie 📸
            </button>
            <button
              onClick={() => setShowPanda(false)}
              className="px-4 py-2 text-xs text-gray-400 hover:text-gray-600"
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
          <p className="text-xs text-gray-500">Your selfie has been shared to their dashboard. Thank you for making their day! ❤️</p>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-100/70 backdrop-blur-md">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-sm bg-white rounded-3xl p-6 text-center shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-pink-400 hover:text-pink-600 text-xl font-bold p-1">✕</button>
        <span className="text-7xl block mb-4 animate-bounce">🏆</span>
        <h2 className="text-xl font-bold text-pink-700 font-serif mb-2">Certificate of Love</h2>
        <p className="text-sm text-gray-500 mb-4" style={{ fontFamily: 'Be Vietnam Pro' }}>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-100/70 backdrop-blur-md">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-sm bg-white rounded-3xl p-6 text-center shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-pink-400 hover:text-pink-600 text-xl font-bold p-1">✕</button>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-100/70 backdrop-blur-md">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-sm bg-white rounded-3xl p-6 text-center shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-pink-400 hover:text-pink-600 text-xl font-bold p-1">✕</button>
        <span className="text-7xl block mb-4 animate-spin" style={{ animationDuration: '8s' }}>💿</span>
        <h2 className="text-xl font-bold text-pink-700 font-serif mb-2">Our Song</h2>
        <p className="text-xs text-gray-400 mb-6">Enjoy the ambient track configured for this memory page</p>

        <div className="p-4 rounded-xl bg-pink-50/50 mb-6 text-sm">
          <p className="font-bold text-pink-800">Background Harmony</p>
          <p className="text-xs text-gray-500 mt-1">Playing in the background of your story.</p>
        </div>

        <button onClick={onClose}
          className="px-6 py-2.5 rounded-full text-xs uppercase tracking-widest font-bold text-white bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 transition-all cursor-pointer">
          Enjoy Music 🎵
        </button>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PHOTO TIMELINE / MEMORIES MODAL
// ─────────────────────────────────────────────
function MemoriesModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const memories = project.memories || [];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-100/70 backdrop-blur-md">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl relative max-h-[85vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-pink-400 hover:text-pink-600 text-xl font-bold p-1">✕</button>
        <h2 className="text-xl font-bold text-pink-700 font-serif mb-6 flex items-center gap-2">
          <span>🔍</span> Our Memories Timeline
        </h2>

        {memories.length === 0 ? (
          <p className="text-sm text-gray-400 italic text-center py-8">No timeline memories added yet.</p>
        ) : (
          <div className="relative border-l-2 border-pink-100 pl-4 ml-2 space-y-6">
            {memories.map((m, idx) => (
              <div key={m.id} className="relative">
                <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-pink-400 border-2 border-white" />
                <span className="text-xs text-gray-400 block mb-1">
                  {new Date(m.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <p className="text-sm font-bold text-pink-900 mb-1">{m.emoji} {m.title}</p>
                {m.description && <p className="text-xs text-gray-500 leading-relaxed mb-2">{m.description}</p>}
                {m.imageUrl && (
                  <div className="rounded-xl overflow-hidden max-h-32 border border-pink-100">
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
// MAIN THEME COMPONENT
// ─────────────────────────────────────────────
type ModalType = 'award' | 'memories' | 'letter' | 'jar' | 'music' | 'vows' | 'video' | null;

export default function SweetDiaryTheme({ project }: { project: Project }) {
  const cfg = project.heroConfig || {};
  const passcode = project.isPasswordProtected && project.accessPassword ? project.accessPassword : (cfg.passcode || '1234');
  const [unlocked, setUnlocked] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const baseItems = [
    { id: 'award', emoji: '🏅', label: 'Award' },
    { id: 'memories', emoji: '🔍', label: 'Memories' },
    { id: 'letter', emoji: '✉️', label: 'Love Letter' },
    { id: 'jar', emoji: '🏺', label: 'Reasons' },
    { id: 'music', emoji: '🎵', label: 'Music' },
    ...(cfg.promises && cfg.promises.length > 0 ? [{ id: 'vows', emoji: '💍', label: 'Our Vows' }] : []),
    ...(cfg.secretVideoUrl ? [{ id: 'video', emoji: '🎬', label: 'Secret Video' }] : []),
  ];

  const total = baseItems.length;
  const menuItems = baseItems.map((item, index) => {
    const angle = -90 + (index * 360) / total;
    return { ...item, angle };
  });

  const radius = 130;

  return (
    <div
      className="min-h-screen select-none"
      style={{
        background: cfg.wallpaperUrl ? `url(${cfg.wallpaperUrl}) center/cover no-repeat` : 'linear-gradient(160deg, #ffe0ec 0%, #ffb6c1 50%, #ff8da1 100%)',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        .perspective { perspective: 1200px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>

      <AnimatePresence mode="wait">
        {!unlocked ? (
          <motion.div key="lock" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <PasscodeScreen correctCode={passcode} onUnlock={() => setUnlocked(true)} />
          </motion.div>
        ) : (
          <motion.div key="diary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
            className="min-h-screen flex flex-col items-center justify-between pb-8 relative overflow-hidden"
          >
            <FloatingHearts />
            <ClickBurst />

            <div className="relative z-10 w-full max-w-sm mx-auto px-5 pt-8 pb-6 flex flex-col items-center flex-1 justify-center">
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

              {/* Happy Birthday title */}
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

              {/* Gift box + Dynamic menu */}
              <div className="relative flex items-center justify-center my-6" style={{ width: '300px', height: '300px' }}>
                {menuItems.map((item, i) => {
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
                      onClick={() => setActiveModal(item.id as ModalType)}
                      className="absolute flex flex-col items-center gap-1 cursor-pointer z-10"
                      style={{ left: `calc(50% + ${x}px - 30px)`, top: `calc(50% + ${y}px - 30px)`, width: '60px' }}
                    >
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl"
                        style={{ background: 'white', boxShadow: '0 4px 16px rgba(255,100,130,0.25)' }}>
                        {item.emoji}
                      </div>
                      <span className="text-white text-[10px] font-bold text-center leading-tight drop-shadow"
                        style={{ fontFamily: 'Be Vietnam Pro, sans-serif', textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
                        {item.label}
                      </span>
                    </motion.button>
                  );
                })}

                {/* Center gift box */}
                <motion.div
                  animate={{ y: [0, -8, 0], rotate: [0, 1, -1, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative z-0 text-7xl cursor-pointer select-none"
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
                className="text-white/70 text-sm text-center font-bold"
                style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}
              >
                Tap a section to open 💌
              </motion.p>
            </div>

            {/* Selfie thank you loop */}
            {cfg.enableSelfieThankYou && (
              <PandaSelfieWidget projectSlug={project.slug} />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals overlay rendering */}
      <AnimatePresence>
        {activeModal === 'award' && <AwardModal project={project} onClose={() => setActiveModal(null)} />}
        {activeModal === 'memories' && <MemoriesModal project={project} onClose={() => setActiveModal(null)} />}
        {activeModal === 'jar' && <JarModal project={project} onClose={() => setActiveModal(null)} />}
        {activeModal === 'music' && <MusicModal project={project} onClose={() => setActiveModal(null)} />}
        {activeModal === 'vows' && <PromiseWallModal project={project} onClose={() => setActiveModal(null)} />}
        {activeModal === 'video' && cfg.secretVideoUrl && (
          <SecretVideoModal url={cfg.secretVideoUrl} onClose={() => setActiveModal(null)} />
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
      </AnimatePresence>
    </div>
  );
}
