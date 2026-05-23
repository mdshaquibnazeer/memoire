'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue, useInView } from 'framer-motion';
import Image from 'next/image';

// ─────────────────────────────────────────────
// INTERFACES  (same shape as other themes)
// ─────────────────────────────────────────────
interface Memory {
  id: string;
  title: string;
  description: string | null;
  date: string;
  imageUrl: string | null;
  location: string | null;
  emoji: string | null;
}

interface GalleryItem {
  id: string;
  mediaUrl: string;
  mediaType: string;
  caption: string | null;
}

interface Project {
  title: string;
  subtitle: string | null;
  personOneName: string | null;
  personTwoName: string | null;
  occasion: string | null;
  startDate: string | null;
  coverImageUrl: string | null;
  heroConfig: any;
  endingConfig: any;
  memories: Memory[];
  galleryItems: GalleryItem[];
}

// ─────────────────────────────────────────────
// HEART BURST  (click anywhere)
// ─────────────────────────────────────────────
interface HeartParticle {
  id: number;
  x: number;
  y: number;
  emoji: string;
  size: number;
  angle: number;
  speed: number;
}

const BURST_EMOJIS = ['💗', '💖', '✨', '🌸', '💕', '⭐', '🦋', '🌷', '💝', '🎀'];

function HeartBurst() {
  const [particles, setParticles] = useState<HeartParticle[]>([]);
  const counter = useRef(0);

  const handleClick = useCallback((e: MouseEvent) => {
    const count = 10;
    const newParticles: HeartParticle[] = Array.from({ length: count }, (_, i) => ({
      id: counter.current++,
      x: e.clientX,
      y: e.clientY,
      emoji: BURST_EMOJIS[Math.floor(Math.random() * BURST_EMOJIS.length)],
      size: 14 + Math.random() * 18,
      angle: (i / count) * 360 + Math.random() * 30,
      speed: 60 + Math.random() * 80,
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
    <div className="fixed inset-0 pointer-events-none z-[999]">
      <AnimatePresence>
        {particles.map(p => {
          const rad = (p.angle * Math.PI) / 180;
          const tx = Math.cos(rad) * p.speed;
          const ty = Math.sin(rad) * p.speed;
          return (
            <motion.span
              key={p.id}
              initial={{ x: p.x, y: p.y, scale: 0, opacity: 1 }}
              animate={{ x: p.x + tx, y: p.y + ty - 40, scale: 1.2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.85, ease: 'easeOut' }}
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
// CURSOR GLOW
// ─────────────────────────────────────────────
function CursorGlow() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const springX = useSpring(x, { stiffness: 120, damping: 22 });
  const springY = useSpring(y, { stiffness: 120, damping: 22 });

  useEffect(() => {
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [x, y]);

  return (
    <motion.div
      style={{
        position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 998,
        x: springX, y: springY,
        translateX: '-50%', translateY: '-50%',
        width: 340, height: 340,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,182,213,0.10) 0%, rgba(221,160,221,0.06) 40%, transparent 70%)',
        filter: 'blur(2px)',
      }}
    />
  );
}

// ─────────────────────────────────────────────
// FLOATING SPARKLES CANVAS
// ─────────────────────────────────────────────
function SparkleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf: number;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    interface Sparkle { x: number; y: number; vy: number; vx: number; life: number; maxLife: number; size: number; hue: number; }
    const sparkles: Sparkle[] = [];

    for (let i = 0; i < 55; i++) {
      sparkles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.3 - Math.random() * 0.7,
        life: Math.random() * 200,
        maxLife: 120 + Math.random() * 160,
        size: 1 + Math.random() * 2.5,
        hue: 300 + Math.random() * 60,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      sparkles.forEach((s, i) => {
        s.x += s.vx; s.y += s.vy; s.life++;
        if (s.life > s.maxLife || s.y < -10) {
          sparkles[i] = {
            x: Math.random() * canvas.width, y: canvas.height + 10,
            vx: (Math.random() - 0.5) * 0.4, vy: -0.3 - Math.random() * 0.7,
            life: 0, maxLife: 120 + Math.random() * 160,
            size: 1 + Math.random() * 2.5, hue: 300 + Math.random() * 60,
          };
          return;
        }
        const t = s.life / s.maxLife;
        const opacity = t < 0.15 ? t / 0.15 : t > 0.8 ? (1 - t) / 0.2 : 1;
        ctx.save();
        ctx.globalAlpha = opacity * 0.7;
        // Draw 4-pointed star
        ctx.fillStyle = `hsl(${s.hue}, 90%, 85%)`;
        ctx.shadowColor = `hsl(${s.hue}, 90%, 75%)`;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        const r1 = s.size, r2 = s.size * 0.35;
        for (let j = 0; j < 8; j++) {
          const a = (j / 8) * Math.PI * 2 - Math.PI / 2;
          const r = j % 2 === 0 ? r1 : r2;
          if (j === 0) ctx.moveTo(s.x + Math.cos(a) * r, s.y + Math.sin(a) * r);
          else ctx.lineTo(s.x + Math.cos(a) * r, s.y + Math.sin(a) * r);
        }
        ctx.closePath(); ctx.fill();
        ctx.restore();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
}

// ─────────────────────────────────────────────
// CONFETTI EXPLOSION
// ─────────────────────────────────────────────
function ConfettiExplosion({ trigger }: { trigger: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!trigger || hasRun.current) return;
    hasRun.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    interface Piece { x: number; y: number; vx: number; vy: number; color: string; size: number; angle: number; va: number; gravity: number; }
    const COLORS = ['#ff69b4','#ff1493','#da70d6','#ba55d3','#9370db','#ffd700','#ff85c2','#ffb3d9','#e066ff','#ffffff'];
    const pieces: Piece[] = Array.from({ length: 180 }, () => ({
      x: window.innerWidth / 2, y: window.innerHeight * 0.4,
      vx: (Math.random() - 0.5) * 20,
      vy: -Math.random() * 18 - 4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 6 + Math.random() * 8,
      angle: Math.random() * 360,
      va: (Math.random() - 0.5) * 8,
      gravity: 0.4 + Math.random() * 0.2,
    }));

    let raf: number;
    let frame = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.vy += p.gravity; p.vx *= 0.99; p.angle += p.va;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.angle * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, 1 - frame / 160);
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      });
      frame++;
      if (frame < 180) raf = requestAnimationFrame(animate);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
    animate();
    return () => cancelAnimationFrame(raf);
  }, [trigger]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />;
}

// ─────────────────────────────────────────────
// ANIMATED ENVELOPE + LETTER
// ─────────────────────────────────────────────
function EnvelopeLetter({ message, personName, onClose }: {
  message: string;
  personName: string;
  onClose: () => void;
}) {
  const [phase, setPhase] = useState<'closed' | 'opening' | 'open' | 'reading' | 'closing'>('closed');
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const lines = message ? message.split('. ').filter(Boolean) : [
    `Dear ${personName || 'Beautiful Soul'},`,
    'On this magical day, the universe paused just to celebrate you.',
    'Every star that shines tonight is wishing you joy.',
    'May every dream you hold be wrapped in love.',
    'Happy Birthday — you are endlessly cherished.',
    'With all my heart ✨',
  ];

  useEffect(() => {
    setTimeout(() => setPhase('opening'), 400);
    setTimeout(() => setPhase('open'), 1600);
    setTimeout(() => {
      setPhase('reading');
      lines.forEach((line, i) => {
        setTimeout(() => setVisibleLines(v => [...v, line]), i * 700);
      });
    }, 2400);
  }, []);

  const handleClose = () => {
    setPhase('closing');
    setTimeout(onClose, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: 'rgba(10,0,20,0.92)', backdropFilter: 'blur(16px)' }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(255,105,180,0.12) 0%, transparent 65%)' }} />

      {/* Floating petals */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div key={i}
          animate={{ y: [-20, window.innerHeight + 20], x: [0, (Math.random() - 0.5) * 100], rotate: [0, 360], opacity: [0, 0.7, 0] }}
          transition={{ duration: 5 + Math.random() * 4, delay: Math.random() * 3, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute', fontSize: 18 + Math.random() * 12,
            left: `${Math.random() * 100}%`, top: '-20px',
            pointerEvents: 'none',
          }}
        >
          {['🌸', '🌷', '✨', '💗', '🦋'][Math.floor(Math.random() * 5)]}
        </motion.div>
      ))}

      <div className="relative flex flex-col items-center" style={{ perspective: 1200 }}>

        {/* ── ENVELOPE ── */}
        <AnimatePresence>
          {(phase === 'closed' || phase === 'opening' || phase === 'open') && (
            <motion.div
              key="envelope"
              initial={{ scale: 0.6, opacity: 0, y: 60 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -30 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              style={{ width: 320, position: 'relative' }}
            >
              {/* Envelope body */}
              <div style={{
                width: 320, height: 220, borderRadius: 16, position: 'relative', overflow: 'visible',
                background: 'linear-gradient(160deg, #fff0f8 0%, #ffe4f0 60%, #ffd0e8 100%)',
                boxShadow: '0 20px 80px rgba(255,105,180,0.35), 0 4px 20px rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,182,213,0.5)',
              }}>
                {/* Envelope pattern */}
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: 16,
                  backgroundImage: `repeating-linear-gradient(45deg, rgba(255,105,180,0.05) 0px, rgba(255,105,180,0.05) 1px, transparent 1px, transparent 12px)`,
                }} />

                {/* Bottom triangle fold */}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0, height: 110,
                  background: 'linear-gradient(160deg, #ffc0d8, #ffaac8)',
                  clipPath: 'polygon(0 100%, 50% 0%, 100% 100%)',
                  opacity: 0.5,
                }} />
                {/* Left fold */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, width: 160, height: 220,
                  background: 'linear-gradient(135deg, #ffd0e8, #ffc0d8)',
                  clipPath: 'polygon(0 0, 100% 50%, 0 100%)',
                  opacity: 0.4,
                }} />
                {/* Right fold */}
                <div style={{
                  position: 'absolute', top: 0, right: 0, width: 160, height: 220,
                  background: 'linear-gradient(225deg, #ffd0e8, #ffc0d8)',
                  clipPath: 'polygon(100% 0, 0 50%, 100% 100%)',
                  opacity: 0.4,
                }} />

                {/* ── FLAP ── */}
                <motion.div
                  animate={phase === 'opening' || phase === 'open'
                    ? { rotateX: -180, y: -2 }
                    : { rotateX: 0 }}
                  transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
                  style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: 120,
                    transformOrigin: 'top center',
                    transformStyle: 'preserve-3d',
                    zIndex: 10,
                  }}
                >
                  {/* Front face */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(175deg, #ffe4f0, #ffd0e8)',
                    clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                    backfaceVisibility: 'hidden',
                    borderRadius: '16px 16px 0 0',
                  }}>
                    {/* Decorative lines on flap */}
                    <div style={{ position:'absolute', top:14, left:'50%', transform:'translateX(-50%)', color:'rgba(255,105,180,0.4)', fontSize:11, fontFamily:'serif', letterSpacing:3, textTransform:'uppercase' }}>
                      ✦ with love ✦
                    </div>
                  </div>
                  {/* Back face (inside of flap) */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(175deg, #fff0f8, #ffeaf5)',
                    clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                    backfaceVisibility: 'hidden',
                    transform: 'rotateX(180deg)',
                  }} />
                </motion.div>

                {/* ── WAX SEAL ── */}
                <motion.div
                  animate={phase === 'opening' || phase === 'open'
                    ? { scale: 0, opacity: 0 }
                    : { scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    position: 'absolute', top: 72, left: '50%', transform: 'translateX(-50%)',
                    width: 52, height: 52, borderRadius: '50%', zIndex: 20,
                    background: 'radial-gradient(circle at 35% 35%, #e8607a, #b5264a)',
                    boxShadow: '0 4px 12px rgba(181,38,74,0.5), inset 0 -2px 6px rgba(0,0,0,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 22, cursor: 'pointer',
                  }}
                >
                  💖
                </motion.div>

                {/* Envelope body text */}
                <div style={{
                  position: 'absolute', bottom: 20, left: 0, right: 0,
                  textAlign: 'center', fontSize: 13, color: 'rgba(180,60,120,0.5)',
                  fontFamily: '"Dancing Script", cursive', letterSpacing: 1,
                }}>
                  {phase === 'closed' ? 'Click to open ✨' : ''}
                </div>
              </div>

              {/* Floating decoration */}
              <motion.div animate={{ y: [0,-8,0], rotate:[0,5,0] }} transition={{ duration:3, repeat:Infinity, ease:'easeInOut' }}
                style={{ position:'absolute', top:-16, right:-16, fontSize:28 }}>🌷</motion.div>
              <motion.div animate={{ y:[0,8,0], rotate:[0,-5,0] }} transition={{ duration:3.5, repeat:Infinity, ease:'easeInOut' }}
                style={{ position:'absolute', bottom:-12, left:-12, fontSize:22 }}>✨</motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── LETTER ── */}
        <AnimatePresence>
          {phase === 'reading' && (
            <motion.div
              key="letter"
              initial={{ opacity: 0, y: 60, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{
                width: 340, maxHeight: '70vh', overflowY: 'auto',
                background: 'linear-gradient(160deg, #fff9fb 0%, #fff4f8 100%)',
                borderRadius: 16,
                boxShadow: '0 30px 100px rgba(255,105,180,0.3), 0 4px 20px rgba(0,0,0,0.25)',
                border: '1px solid rgba(255,182,213,0.4)',
                padding: '36px 32px 32px',
                position: 'relative',
              }}
            >
              {/* Paper lines */}
              {Array.from({ length: 18 }).map((_, i) => (
                <div key={i} style={{
                  position: 'absolute', left: 32, right: 32,
                  top: 60 + i * 28, height: 1,
                  background: 'rgba(255,182,213,0.2)',
                  pointerEvents: 'none',
                }} />
              ))}
              {/* Left margin line */}
              <div style={{ position:'absolute', left:52, top:0, bottom:0, width:1, background:'rgba(255,105,180,0.15)', pointerEvents:'none' }} />

              {/* Red corner fold */}
              <div style={{
                position:'absolute', top:0, right:0, width:32, height:32,
                background:'linear-gradient(225deg, #ffd0e8 50%, transparent 50%)',
                borderRadius:'0 16px 0 0',
              }} />

              <div style={{ fontFamily:'"Dancing Script", "Segoe UI", cursive', position:'relative', zIndex:1 }}>
                {visibleLines.map((line, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.55, ease: 'easeOut' }}
                    style={{
                      marginBottom: i === 0 ? 16 : 10,
                      fontSize: i === 0 ? 17 : 15,
                      fontWeight: i === 0 ? 700 : 400,
                      color: i === 0 ? '#c0306a' : '#6b3050',
                      lineHeight: 1.7,
                    }}
                  >
                    {line}{i < lines.length - 1 && i > 0 ? '.' : ''}
                  </motion.p>
                ))}

                {/* Ink cursor blinking */}
                {visibleLines.length < lines.length && (
                  <motion.span
                    animate={{ opacity: [1,0,1] }}
                    transition={{ duration: 0.7, repeat: Infinity }}
                    style={{ color:'#ff69b4', fontSize:18 }}
                  >|</motion.span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Close button */}
        {phase === 'reading' && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: lines.length * 0.7 + 0.5 }}
            onClick={handleClose}
            style={{
              marginTop: 20, padding: '10px 32px', borderRadius: 50,
              background: 'linear-gradient(135deg, #ff69b4, #da70d6)',
              color: 'white', border: 'none', cursor: 'pointer',
              fontFamily:'"Dancing Script", cursive', fontSize: 16,
              boxShadow: '0 4px 20px rgba(255,105,180,0.4)',
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
// POLAROID GALLERY WALL
// ─────────────────────────────────────────────
function PolaroidGallery({ items, onClose }: { items: GalleryItem[]; onClose: () => void }) {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const rotations = [-6, 4, -3, 7, -5, 3, -8, 5, -2, 6, -4, 8];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] overflow-y-auto"
      style={{ background: 'rgba(8,0,18,0.95)', backdropFilter: 'blur(20px)' }}
    >
      <div style={{ background: 'radial-gradient(ellipse at 50% 20%, rgba(218,112,214,0.15) 0%, transparent 60%)', minHeight: '100%', padding: '40px 20px 60px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <motion.h2
              initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}
              style={{ fontFamily:'"Dancing Script", cursive', fontSize:42, color:'#ffb3d9', marginBottom:8 }}
            >
              Our Gallery 📸
            </motion.h2>
            <p style={{ color:'rgba(255,179,217,0.5)', fontFamily:'serif', fontSize:14 }}>Click any photo to view</p>
          </div>

          {items.length === 0 ? (
            <div style={{ textAlign:'center', padding:'60px 0', color:'rgba(255,179,217,0.4)', fontFamily:'serif', fontSize:18 }}>
              No photos added yet 🌸
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: 24,
            }}>
              {items.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 40, rotate: rotations[i % rotations.length] * 0.5 }}
                  animate={{ opacity: 1, y: 0, rotate: rotations[i % rotations.length] }}
                  transition={{ delay: i * 0.08, duration: 0.6 }}
                  whileHover={{ rotate: 0, scale: 1.08, zIndex: 10 }}
                  style={{
                    background: '#fffaf9', padding: '12px 12px 36px',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.4), 0 2px 8px rgba(255,105,180,0.2)',
                    cursor: 'pointer', borderRadius: 4,
                    transformOrigin: 'center center',
                  }}
                  onClick={() => setLightbox(item.mediaUrl)}
                >
                  <div style={{ width: '100%', aspectRatio: '1/1', overflow: 'hidden', background: '#f5e6ee' }}>
                    <img
                      src={item.mediaUrl}
                      alt={item.caption || ''}
                      style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
                      onError={e => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23f5dde8' width='200' height='200'/%3E%3Ctext y='110' x='100' text-anchor='middle' font-size='40'%3E📸%3C/text%3E%3C/svg%3E"; }}
                    />
                  </div>
                  {item.caption && (
                    <p style={{ textAlign:'center', marginTop:10, fontFamily:'"Dancing Script", cursive', fontSize:13, color:'#8b4070', lineHeight:1.4 }}>
                      {item.caption}
                    </p>
                  )}
                  {/* Tape effect */}
                  <div style={{
                    position:'absolute', top:-8, left:'50%', transform:'translateX(-50%)',
                    width:50, height:18, borderRadius:2,
                    background:'rgba(255,182,213,0.55)',
                    boxShadow:'0 1px 3px rgba(0,0,0,0.15)',
                  }} />
                </motion.div>
              ))}
            </div>
          )}

          <div style={{ textAlign:'center', marginTop:48 }}>
            <button onClick={onClose} style={{
              padding:'12px 36px', borderRadius:50, border:'1px solid rgba(255,182,213,0.4)',
              background:'transparent', color:'#ffb3d9', cursor:'pointer',
              fontFamily:'"Dancing Script", cursive', fontSize:17,
            }}>
              ← Back to Celebration
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            onClick={() => setLightbox(null)}
            style={{ position:'fixed', inset:0, zIndex:300, background:'rgba(0,0,0,0.92)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}
          >
            <motion.img
              initial={{ scale:0.8 }} animate={{ scale:1 }}
              src={lightbox} alt=""
              style={{ maxWidth:'90vw', maxHeight:'85vh', objectFit:'contain', borderRadius:8, boxShadow:'0 20px 60px rgba(255,105,180,0.3)' }}
              onClick={e => e.stopPropagation()}
            />
            <button onClick={() => setLightbox(null)} style={{ position:'fixed', top:24, right:24, background:'rgba(255,255,255,0.1)', border:'none', color:'white', width:40, height:40, borderRadius:'50%', cursor:'pointer', fontSize:20, display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// TIMELINE MODAL
// ─────────────────────────────────────────────
function TimelineModal({ memories, onClose }: { memories: Memory[]; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] overflow-y-auto"
      style={{ background: 'rgba(8,0,18,0.95)', backdropFilter: 'blur(20px)' }}
    >
      <div style={{ background: 'radial-gradient(ellipse at 50% 10%, rgba(255,105,180,0.12) 0%, transparent 60%)', minHeight:'100%', padding:'40px 20px 60px' }}>
        <div style={{ maxWidth: 680, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <motion.h2 initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}
              style={{ fontFamily:'"Dancing Script", cursive', fontSize:42, color:'#ffb3d9', marginBottom:8 }}>
              Our Story ✨
            </motion.h2>
          </div>

          {memories.length === 0 ? (
            <div style={{ textAlign:'center', padding:'60px 0', color:'rgba(255,179,217,0.4)', fontFamily:'serif', fontSize:18 }}>No memories added yet 🌸</div>
          ) : (
            <div style={{ position:'relative' }}>
              {/* Timeline line */}
              <div style={{ position:'absolute', left:'50%', top:0, bottom:0, width:2, background:'linear-gradient(180deg, transparent, rgba(255,182,213,0.4) 20%, rgba(255,182,213,0.4) 80%, transparent)', transform:'translateX(-50%)' }} />
              {memories.map((m, i) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity:0, x: i%2===0 ? -40 : 40 }}
                  animate={{ opacity:1, x:0 }}
                  transition={{ delay:i*0.12, duration:0.6 }}
                  style={{ display:'flex', justifyContent: i%2===0 ? 'flex-end' : 'flex-start', marginBottom:28, paddingRight: i%2===0 ? '52%' : 0, paddingLeft: i%2===1 ? '52%' : 0, position:'relative' }}
                >
                  {/* Dot */}
                  <div style={{ position:'absolute', left:'50%', top:20, transform:'translateX(-50%)', width:14, height:14, borderRadius:'50%', background:'linear-gradient(135deg, #ff69b4, #da70d6)', boxShadow:'0 0 12px rgba(255,105,180,0.7)', zIndex:2 }} />
                  <div style={{
                    background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,182,213,0.2)',
                    borderRadius:16, padding:'16px 20px', backdropFilter:'blur(12px)',
                    maxWidth:240,
                  }}>
                    {m.imageUrl && (
                      <img src={m.imageUrl} alt="" style={{ width:'100%', borderRadius:10, marginBottom:10, objectFit:'cover', aspectRatio:'4/3' }} />
                    )}
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                      {m.emoji && <span style={{ fontSize:20 }}>{m.emoji}</span>}
                      <span style={{ fontFamily:'"Dancing Script", cursive', fontSize:16, color:'#ffb3d9', fontWeight:700 }}>{m.title}</span>
                    </div>
                    {m.description && <p style={{ color:'rgba(255,200,230,0.65)', fontSize:12, fontFamily:'serif', lineHeight:1.6, margin:0 }}>{m.description}</p>}
                    <p style={{ color:'rgba(255,182,213,0.4)', fontSize:11, fontFamily:'sans-serif', marginTop:8, margin:0 }}>
                      {new Date(m.date).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}
                      {m.location && ` · 📍 ${m.location}`}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div style={{ textAlign:'center', marginTop:48 }}>
            <button onClick={onClose} style={{ padding:'12px 36px', borderRadius:50, border:'1px solid rgba(255,182,213,0.4)', background:'transparent', color:'#ffb3d9', cursor:'pointer', fontFamily:'"Dancing Script", cursive', fontSize:17 }}>
              ← Back to Celebration
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// FLOATING BALLOON
// ─────────────────────────────────────────────
function FloatingBalloon({ emoji, color, delay, x }: { emoji: string; color: string; delay: number; x: number }) {
  return (
    <motion.div
      animate={{ y: [0, -18, 0], x: [0, 6, -6, 0], rotate: [-4, 4, -4] }}
      transition={{ duration: 3 + Math.random(), delay, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        position: 'absolute', bottom: 0, left: `${x}%`,
        fontSize: 38, filter: `drop-shadow(0 4px 12px ${color})`,
        cursor: 'pointer', userSelect: 'none',
      }}
    >
      {emoji}
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// BIRTHDAY CAKE 3D INTERACTIVE
// ─────────────────────────────────────────────
function BirthdayCake3D({ name, onWish }: { name: string; onWish: () => void }) {
  const [candlesLit, setCandlesLit] = useState(true);
  const [blown, setBlown] = useState(false);

  const blowCandles = () => {
    if (!candlesLit) return;
    setCandlesLit(false);
    setTimeout(() => { setBlown(true); onWish(); }, 300);
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.3, type: 'spring', stiffness: 80 }}
      onClick={blowCandles}
      style={{ cursor: candlesLit ? 'pointer' : 'default', textAlign: 'center', userSelect: 'none' }}
      title={candlesLit ? 'Click to blow out the candles! 🎂' : ''}
    >
      {/* 3D cake layers */}
      <div style={{ position: 'relative', display: 'inline-block' }}>
        {/* Candles */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 4 }}>
          {[0,1,2,3,4].map(i => (
            <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
              {candlesLit && (
                <motion.div
                  animate={{ scale: [1,1.3,0.9,1.2,1], opacity: [1,0.8,1] }}
                  transition={{ duration: 0.6 + i*0.1, repeat: Infinity }}
                  style={{ fontSize: 14, marginBottom: -2, filter:'drop-shadow(0 0 6px #ffd700)' }}
                >🔥</motion.div>
              )}
              <div style={{ width: 6, height: 22, background: `hsl(${i*60},80%,60%)`, borderRadius: 3 }} />
            </div>
          ))}
        </div>

        {/* Cake top tier */}
        <div style={{
          width: 120, height: 44, borderRadius: '50% 50% 0 0 / 20px 20px 0 0',
          background: 'linear-gradient(135deg, #ffb3d9, #ff69b4)',
          boxShadow: '0 4px 16px rgba(255,105,180,0.4), inset 0 -4px 8px rgba(0,0,0,0.1)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position:'absolute', inset:0, background:'repeating-linear-gradient(90deg, transparent, transparent 14px, rgba(255,255,255,0.15) 14px, rgba(255,255,255,0.15) 15px)' }} />
          <div style={{ position:'absolute', top:8, left:0, right:0, textAlign:'center', fontSize:10, color:'white', fontFamily:'"Dancing Script",cursive' }}>
            {name ? name : '🎂'}
          </div>
        </div>

        {/* Frosting drips top */}
        <div style={{ display:'flex', justifyContent:'space-around', marginTop:-4, padding:'0 8px' }}>
          {[0,1,2,3,4,5].map(i=>(
            <div key={i} style={{ width:10, height:14, background:'white', borderRadius:'0 0 8px 8px', opacity:0.9, marginTop: i%2===0?0:4 }} />
          ))}
        </div>

        {/* Bottom tier */}
        <div style={{
          width: 160, height: 56, marginLeft: -20,
          background: 'linear-gradient(135deg, #da70d6, #9370db)',
          boxShadow: '0 8px 24px rgba(147,112,219,0.4), inset 0 -4px 8px rgba(0,0,0,0.1)',
          position: 'relative', overflow:'hidden', borderRadius: '0 0 8px 8px',
        }}>
          <div style={{ position:'absolute', inset:0, background:'repeating-linear-gradient(90deg, transparent, transparent 18px, rgba(255,255,255,0.1) 18px, rgba(255,255,255,0.1) 19px)' }} />
          {/* Bottom dips/dots decoration */}
          {[20,45,70,100,130].map((x,i)=>(
            <div key={i} style={{ position:'absolute', top:'50%', left:x, transform:'translateY(-50%)', width:8, height:8, borderRadius:'50%', background:'rgba(255,255,255,0.5)' }} />
          ))}
        </div>

        {/* Plate */}
        <div style={{
          width: 190, height: 14, marginLeft: -35, marginTop: -2,
          background: 'linear-gradient(90deg, #c0c0c0, #e8e8e8, #c0c0c0)',
          borderRadius: '0 0 50% 50% / 0 0 8px 8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        }} />
      </div>

      {blown ? (
        <motion.p initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
          style={{ marginTop:16, fontFamily:'"Dancing Script",cursive', fontSize:18, color:'#ffb3d9' }}>
          Make a wish! 🌟
        </motion.p>
      ) : (
        <p style={{ marginTop:12, fontFamily:'"Dancing Script",cursive', fontSize:14, color:'rgba(255,179,217,0.6)' }}>
          Tap to blow out candles ✨
        </p>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// MAIN: CELESTIAL BIRTHDAY THEME
// ─────────────────────────────────────────────
export default function CelestialBirthdayTheme({ project }: { project: Project }) {
  // ── STATES ──
  const [introPhase, setIntroPhase] = useState<'loading' | 'text' | 'done'>('loading');
  const [activeModal, setActiveModal] = useState<null | 'letter' | 'gallery' | 'timeline'>( null);
  const [confetti, setConfetti] = useState(false);
  const [wishMade, setWishMade] = useState(false);

  const name = project.personOneName || 'Beautiful Soul';
  const occasion = project.occasion || 'Birthday';
  const heroMessage = project.heroConfig?.message || '';

  // ── INTRO SEQUENCE ──
  useEffect(() => {
    const t1 = setTimeout(() => setIntroPhase('text'), 600);
    const t2 = setTimeout(() => setIntroPhase('done'), 3400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const handleWish = () => {
    setWishMade(true);
    setConfetti(true);
    setTimeout(() => setConfetti(false), 3000);
  };

  const openModal = (m: typeof activeModal) => {
    setActiveModal(m);
  };

  // ── LOADING SCREEN ──
  if (introPhase !== 'done') {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'radial-gradient(ellipse at 50% 50%, #1a0030 0%, #08000f 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column',
      }}>
        <SparkleCanvas />
        <AnimatePresence>
          {introPhase === 'loading' && (
            <motion.div key="l1" exit={{ opacity: 0, scale: 0.8 }}
              style={{ textAlign:'center' }}>
              <motion.div animate={{ rotate: 360 }} transition={{ duration:2, repeat:Infinity, ease:'linear' }}
                style={{ fontSize:52, display:'block', marginBottom:16 }}>
                ✨
              </motion.div>
            </motion.div>
          )}
          {introPhase === 'text' && (
            <motion.div key="l2" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              style={{ textAlign:'center', padding:'0 24px' }}>
              <motion.p
                initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
                style={{ fontFamily:'"Dancing Script",cursive', fontSize:18, color:'rgba(255,182,213,0.6)', letterSpacing:4, textTransform:'uppercase', marginBottom:16 }}
              >
                a special surprise awaits…
              </motion.p>
              <motion.h1
                initial={{ opacity:0, y:30, scale:0.9 }} animate={{ opacity:1, y:0, scale:1 }} transition={{ delay:0.5, duration:0.9 }}
                style={{ fontFamily:'"Dancing Script",cursive', fontSize:'clamp(2.8rem,10vw,5rem)', color:'#ffb3d9', lineHeight:1.2, textShadow:'0 0 40px rgba(255,105,180,0.5)', marginBottom:20 }}
              >
                Happy {occasion},<br />{name} 🎂
              </motion.h1>
              <motion.div initial={{ scaleX:0 }} animate={{ scaleX:1 }} transition={{ delay:1, duration:0.8 }}
                style={{ height:1, background:'linear-gradient(90deg, transparent, rgba(255,182,213,0.5), transparent)', maxWidth:300, margin:'0 auto' }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ── MAIN EXPERIENCE ──
  return (
    <div style={{ minHeight:'100vh', background:'radial-gradient(ellipse at 50% 0%, #1e0040 0%, #0a000f 55%, #050008 100%)', overflow:'hidden', position:'relative' }}>
      <SparkleCanvas />
      <CursorGlow />
      <HeartBurst />
      <ConfettiExplosion trigger={confetti} />

      {/* Aurora background layers */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0 }}>
        <motion.div animate={{ opacity:[0.4,0.7,0.4], scale:[1,1.05,1] }} transition={{ duration:8, repeat:Infinity, ease:'easeInOut' }}
          style={{ position:'absolute', top:'-20%', left:'-10%', width:'70%', height:'70%', borderRadius:'50%', background:'radial-gradient(circle, rgba(218,112,214,0.18) 0%, transparent 70%)', filter:'blur(40px)' }} />
        <motion.div animate={{ opacity:[0.3,0.6,0.3], scale:[1,1.08,1] }} transition={{ duration:10, repeat:Infinity, ease:'easeInOut', delay:3 }}
          style={{ position:'absolute', top:'10%', right:'-15%', width:'60%', height:'60%', borderRadius:'50%', background:'radial-gradient(circle, rgba(255,105,180,0.15) 0%, transparent 70%)', filter:'blur(50px)' }} />
        <motion.div animate={{ opacity:[0.2,0.5,0.2] }} transition={{ duration:12, repeat:Infinity, ease:'easeInOut', delay:6 }}
          style={{ position:'absolute', bottom:'-10%', left:'20%', width:'60%', height:'50%', borderRadius:'50%', background:'radial-gradient(circle, rgba(147,112,219,0.14) 0%, transparent 70%)', filter:'blur(45px)' }} />
      </div>

      {/* Floating balloons background */}
      <div style={{ position:'fixed', bottom:0, left:0, right:0, height:120, pointerEvents:'none', zIndex:1 }}>
        {[
          { emoji:'🎈', color:'rgba(255,105,180,0.5)', delay:0, x:5 },
          { emoji:'🎀', color:'rgba(218,112,214,0.5)', delay:0.5, x:15 },
          { emoji:'💜', color:'rgba(147,112,219,0.5)', delay:1, x:80 },
          { emoji:'🎈', color:'rgba(255,182,213,0.5)', delay:1.5, x:90 },
          { emoji:'⭐', color:'rgba(255,215,0,0.5)', delay:2, x:50 },
          { emoji:'🎊', color:'rgba(255,105,180,0.5)', delay:2.5, x:70 },
        ].map((b, i) => <FloatingBalloon key={i} {...b} />)}
      </div>

      {/* ── HERO SECTION ── */}
      <section style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'40px 20px', position:'relative', zIndex:2 }}>

        {/* Cover image frame */}
        {project.coverImageUrl && (
          <motion.div
            initial={{ opacity:0, scale:0.85, rotate:-3 }}
            animate={{ opacity:1, scale:1, rotate:-1 }}
            transition={{ duration:1, ease:'easeOut' }}
            style={{
              position:'relative', marginBottom:32,
              padding:10, paddingBottom:32,
              background:'linear-gradient(160deg, #fff8fc, #ffe4f0)',
              boxShadow:'0 20px 60px rgba(255,105,180,0.3), 0 4px 16px rgba(0,0,0,0.4)',
              borderRadius:4, maxWidth:280, width:'100%',
            }}
          >
            <img src={project.coverImageUrl} alt="Cover"
              style={{ width:'100%', aspectRatio:'4/3', objectFit:'cover', display:'block', borderRadius:2 }} />
            <div style={{ position:'absolute', top:-10, left:'50%', transform:'translateX(-50%)', width:60, height:18, borderRadius:2, background:'rgba(255,182,213,0.6)' }} />
            <p style={{ position:'absolute', bottom:8, left:0, right:0, textAlign:'center', fontFamily:'"Dancing Script",cursive', fontSize:15, color:'#c0306a' }}>
              {[project.personOneName, project.personTwoName].filter(Boolean).join(' & ')}
            </p>
          </motion.div>
        )}

        {/* Title */}
        <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3, duration:0.8 }} style={{ textAlign:'center', marginBottom:12 }}>
          <p style={{ fontFamily:'"Dancing Script",cursive', fontSize:16, color:'rgba(255,182,213,0.6)', letterSpacing:4, textTransform:'uppercase', marginBottom:10 }}>
            {occasion}
          </p>
          <h1 style={{
            fontFamily:'"Dancing Script",cursive',
            fontSize:'clamp(3rem,10vw,5.5rem)',
            background:'linear-gradient(135deg, #ffb3d9, #da70d6, #9370db)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
            lineHeight:1.15, marginBottom:12,
            filter:'drop-shadow(0 0 30px rgba(255,105,180,0.4))',
          }}>
            {project.title}
          </h1>
          {project.subtitle && (
            <p style={{ fontFamily:'"Dancing Script",cursive', fontSize:20, color:'rgba(255,182,213,0.65)', fontStyle:'italic' }}>
              {project.subtitle}
            </p>
          )}
        </motion.div>

        {/* Birthday cake */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.7 }} style={{ marginBottom:40 }}>
          <BirthdayCake3D name={name} onWish={handleWish} />
        </motion.div>

        {wishMade && (
          <motion.p initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }}
            style={{ fontFamily:'"Dancing Script",cursive', fontSize:22, color:'#ffb3d9', textAlign:'center', marginBottom:28 }}>
            🌟 Your wish is on its way to the stars!
          </motion.p>
        )}

        {/* ── INTERACTIVE OBJECTS ── */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1 }}
          style={{ display:'flex', flexWrap:'wrap', gap:20, justifyContent:'center', marginBottom:40 }}>

          {/* Letter / Envelope */}
          <InteractiveObject
            emoji="💌" label="Secret Letter"
            color="linear-gradient(135deg,#ff85c2,#da70d6)"
            glow="rgba(255,105,180,0.5)"
            onClick={() => openModal('letter')}
          />

          {/* Gallery */}
          {project.galleryItems.length > 0 && (
            <InteractiveObject
              emoji="📸" label="Our Gallery"
              color="linear-gradient(135deg,#da70d6,#9370db)"
              glow="rgba(147,112,219,0.5)"
              onClick={() => openModal('gallery')}
            />
          )}

          {/* Timeline */}
          {project.memories.length > 0 && (
            <InteractiveObject
              emoji="🌟" label="Our Story"
              color="linear-gradient(135deg,#9370db,#6a5acd)"
              glow="rgba(106,90,205,0.5)"
              onClick={() => openModal('timeline')}
            />
          )}

          {/* Confetti */}
          <InteractiveObject
            emoji="🎊" label="Celebrate!"
            color="linear-gradient(135deg,#ffd700,#ff69b4)"
            glow="rgba(255,215,0,0.4)"
            onClick={() => { setConfetti(true); setTimeout(()=>setConfetti(false),3000); }}
          />
        </motion.div>

        {/* Scroll hint */}
        <motion.div animate={{ y:[0,8,0] }} transition={{ duration:2, repeat:Infinity }}
          style={{ color:'rgba(255,182,213,0.3)', textAlign:'center', fontSize:13, fontFamily:'serif' }}>
          ↓ scroll for more magic
        </motion.div>
      </section>

      {/* ── MESSAGE SECTION ── */}
      {heroMessage && (
        <section style={{ padding:'60px 20px', position:'relative', zIndex:2 }}>
          <div style={{ maxWidth:600, margin:'0 auto', textAlign:'center' }}>
            <RevealBlock>
              <div style={{
                background:'rgba(255,255,255,0.04)', backdropFilter:'blur(16px)',
                border:'1px solid rgba(255,182,213,0.15)', borderRadius:24,
                padding:'40px 36px', position:'relative',
              }}>
                <div style={{ position:'absolute', top:-16, left:'50%', transform:'translateX(-50%)', fontSize:32 }}>💗</div>
                <p style={{ fontFamily:'"Dancing Script",cursive', fontSize:22, color:'rgba(255,182,213,0.85)', lineHeight:1.8, fontStyle:'italic' }}>
                  "{heroMessage}"
                </p>
              </div>
            </RevealBlock>
          </div>
        </section>
      )}

      {/* ── MEMORY STRIP (inline preview) ── */}
      {project.memories.length > 0 && (
        <section style={{ padding:'40px 0 60px', position:'relative', zIndex:2 }}>
          <RevealBlock>
            <div style={{ textAlign:'center', marginBottom:28 }}>
              <h2 style={{ fontFamily:'"Dancing Script",cursive', fontSize:34, color:'#ffb3d9' }}>Precious Moments ✨</h2>
            </div>
            <div style={{ display:'flex', gap:16, overflowX:'auto', padding:'16px 20px 24px', scrollbarWidth:'none' }}>
              {project.memories.slice(0,6).map((m,i)=>(
                <motion.div
                  key={m.id}
                  initial={{ opacity:0, x:40 }} whileInView={{ opacity:1, x:0 }}
                  transition={{ delay:i*0.1 }} viewport={{ once:true }}
                  style={{
                    minWidth:180, background:'rgba(255,255,255,0.05)',
                    border:'1px solid rgba(255,182,213,0.2)', borderRadius:16,
                    padding:16, flexShrink:0, backdropFilter:'blur(12px)',
                  }}
                >
                  {m.imageUrl && <img src={m.imageUrl} alt="" style={{ width:'100%', borderRadius:10, marginBottom:10, aspectRatio:'1/1', objectFit:'cover' }} />}
                  <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:6 }}>
                    {m.emoji && <span style={{ fontSize:18 }}>{m.emoji}</span>}
                    <span style={{ fontFamily:'"Dancing Script",cursive', fontSize:15, color:'#ffb3d9', fontWeight:700 }}>{m.title}</span>
                  </div>
                  <p style={{ color:'rgba(255,182,213,0.35)', fontSize:11, fontFamily:'sans-serif', margin:0 }}>
                    {new Date(m.date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}
                  </p>
                </motion.div>
              ))}
            </div>
            {project.memories.length > 0 && (
              <div style={{ textAlign:'center', marginTop:12 }}>
                <button onClick={()=>openModal('timeline')} style={{ background:'transparent', border:'1px solid rgba(255,182,213,0.3)', borderRadius:50, padding:'8px 28px', color:'#ffb3d9', fontFamily:'"Dancing Script",cursive', fontSize:16, cursor:'pointer' }}>
                  View All Memories →
                </button>
              </div>
            )}
          </RevealBlock>
        </section>
      )}

      {/* ── GALLERY STRIP ── */}
      {project.galleryItems.length > 0 && (
        <section style={{ padding:'20px 0 60px', position:'relative', zIndex:2 }}>
          <RevealBlock>
            <div style={{ textAlign:'center', marginBottom:28 }}>
              <h2 style={{ fontFamily:'"Dancing Script",cursive', fontSize:34, color:'#ffb3d9' }}>Photo Wall 📸</h2>
            </div>
            <div style={{ columns:'3 160px', gap:10, padding:'0 20px' }}>
              {project.galleryItems.slice(0,9).map((item,i)=>(
                <motion.div key={item.id} initial={{ opacity:0 }} whileInView={{ opacity:1 }} transition={{ delay:i*0.07 }} viewport={{ once:true }}
                  style={{ breakInside:'avoid', marginBottom:10, cursor:'pointer' }}
                  onClick={()=>openModal('gallery')}>
                  <img src={item.mediaUrl} alt={item.caption||''} style={{ width:'100%', borderRadius:12, display:'block', objectFit:'cover' }} />
                </motion.div>
              ))}
            </div>
            {project.galleryItems.length > 3 && (
              <div style={{ textAlign:'center', marginTop:20 }}>
                <button onClick={()=>openModal('gallery')} style={{ background:'linear-gradient(135deg,#ff69b4,#da70d6)', border:'none', borderRadius:50, padding:'10px 32px', color:'white', fontFamily:'"Dancing Script",cursive', fontSize:17, cursor:'pointer', boxShadow:'0 4px 20px rgba(255,105,180,0.35)' }}>
                  Open Full Gallery ✨
                </button>
              </div>
            )}
          </RevealBlock>
        </section>
      )}

      {/* ── ENDING ── */}
      <section style={{ padding:'60px 20px 100px', position:'relative', zIndex:2, textAlign:'center' }}>
        <RevealBlock>
          <div style={{ maxWidth:480, margin:'0 auto' }}>
            <motion.div animate={{ rotate:[0,10,-10,0], scale:[1,1.15,1] }} transition={{ duration:2, repeat:Infinity, ease:'easeInOut' }}
              style={{ fontSize:56, display:'block', marginBottom:16 }}>
              🎂
            </motion.div>
            <h2 style={{ fontFamily:'"Dancing Script",cursive', fontSize:42, background:'linear-gradient(135deg,#ffb3d9,#da70d6)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', marginBottom:16 }}>
              {project.endingConfig?.title || `Happy ${occasion}, ${name}! 🌟`}
            </h2>
            {project.endingConfig?.message && (
              <p style={{ fontFamily:'"Dancing Script",cursive', fontSize:20, color:'rgba(255,182,213,0.7)', lineHeight:1.7, marginBottom:28 }}>
                {project.endingConfig.message}
              </p>
            )}

            {/* Re-celebrate */}
            <motion.button
              whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
              onClick={()=>{ setConfetti(true); setTimeout(()=>setConfetti(false),3000); }}
              style={{
                background:'linear-gradient(135deg,#ff69b4,#da70d6,#9370db)',
                border:'none', borderRadius:50, padding:'14px 40px',
                color:'white', fontFamily:'"Dancing Script",cursive', fontSize:20,
                cursor:'pointer', boxShadow:'0 8px 32px rgba(255,105,180,0.4)',
                letterSpacing:1,
              }}
            >
              Celebrate Again! 🎊
            </motion.button>

            <div style={{ marginTop:40, display:'flex', alignItems:'center', justifyContent:'center', gap:12, color:'rgba(255,182,213,0.2)', fontSize:12, fontFamily:'serif' }}>
              <div style={{ width:60, height:1, background:'rgba(255,182,213,0.15)' }} />
              Made with love on Mémoire
              <div style={{ width:60, height:1, background:'rgba(255,182,213,0.15)' }} />
            </div>
          </div>
        </RevealBlock>
      </section>

      {/* ── MODALS ── */}
      <AnimatePresence>
        {activeModal === 'letter' && (
          <EnvelopeLetter
            key="letter-modal"
            message={heroMessage}
            personName={name}
            onClose={() => setActiveModal(null)}
          />
        )}
        {activeModal === 'gallery' && (
          <PolaroidGallery
            key="gallery-modal"
            items={project.galleryItems}
            onClose={() => setActiveModal(null)}
          />
        )}
        {activeModal === 'timeline' && (
          <TimelineModal
            key="timeline-modal"
            memories={project.memories}
            onClose={() => setActiveModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function InteractiveObject({ emoji, label, color, glow, onClick }: {
  emoji: string; label: string; color: string; glow: string; onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.12, y: -6 }}
      whileTap={{ scale: 0.93 }}
      onClick={onClick}
      style={{
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,182,213,0.2)',
        borderRadius: 24, padding: '18px 24px',
        cursor: 'pointer', display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 8, minWidth: 100,
        boxShadow: `0 8px 32px rgba(0,0,0,0.3), 0 0 0 0 ${glow}`,
        transition: 'box-shadow 0.3s',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = `0 16px 48px rgba(0,0,0,0.3), 0 0 40px ${glow}`; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px rgba(0,0,0,0.3), 0 0 0 0 ${glow}`; }}
    >
      <motion.span
        animate={{ y: [0, -5, 0], rotate: [0, 6, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{ fontSize: 36 }}
      >
        {emoji}
      </motion.span>
      <span style={{ fontFamily: '"Dancing Script",cursive', fontSize: 13, color: '#ffb3d9', letterSpacing: 0.5 }}>
        {label}
      </span>
    </motion.button>
  );
}

function RevealBlock({ children }: { children: React.ReactNode }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
