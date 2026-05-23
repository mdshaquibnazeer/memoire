'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue, useInView } from 'framer-motion';
import Image from 'next/image';
import { publicAPI } from '@/lib/api';
import { toast } from 'sonner';

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
    slug: string;
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
        const COLORS = ['#ff69b4', '#ff1493', '#da70d6', '#ba55d3', '#9370db', '#ffd700', '#ff85c2', '#ffb3d9', '#e066ff', '#ffffff'];
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
function EnvelopeLetter({
    message,
    personName,
    onClose,
    letterMusicUrl,
    disableLetterAutoScroll = false,
    disableWordByWord = false,
    letterScrollSpeed,
    letterWordDelay,
    letterAnimType = 'word',
    letterCharDelay
}: {
    message: string;
    personName: string;
    onClose: () => void;
    letterMusicUrl?: string;
    disableLetterAutoScroll?: boolean;
    disableWordByWord?: boolean;
    letterScrollSpeed?: number;
    letterWordDelay?: number;
    letterAnimType?: 'word' | 'char';
    letterCharDelay?: number;
}) {
    const [phase, setPhase] = useState<'closed' | 'opening' | 'open' | 'reading' | 'closing'>('closed');
    const [visibleCount, setVisibleCount] = useState(disableWordByWord ? 99999 : 0);
    const letterScrollRef = useRef<HTMLDivElement>(null);
    const localAudioRef = useRef<HTMLAudioElement>(null);
    const autoCloseRef = useRef<NodeJS.Timeout | null>(null);

    const fullText = message || `Dear ${personName || 'Beautiful Soul'}, On this magical day, the universe paused just to celebrate you. Every star that shines tonight is wishing you joy. May every dream you hold be wrapped in love. Happy Birthday — you are endlessly cherished. With all my heart ✨`;
    const words = fullText.split(/\s+/).filter(Boolean);
    const totalWords = words.length;
    const totalChars = fullText.length;
    const isCharAnim = letterAnimType === 'char';
    const totalCount = isCharAnim ? totalChars : totalWords;

    useEffect(() => {
        if (letterMusicUrl && localAudioRef.current) {
            localAudioRef.current.volume = 0.4;
            localAudioRef.current.play().catch(() => { });
        }
        return () => { if (localAudioRef.current) { localAudioRef.current.pause(); } };
    }, [letterMusicUrl]);

    useEffect(() => {
        setTimeout(() => setPhase('opening'), 400);
        setTimeout(() => setPhase('open'), 1600);
        setTimeout(() => setPhase('reading'), 2400);
    }, []);

    useEffect(() => {
        if (phase !== 'reading') return;
        if (disableWordByWord) {
            setVisibleCount(totalCount);
            return;
        }
        if (visibleCount >= totalCount) {
            autoCloseRef.current = setTimeout(() => {
                setPhase('closing');
                if (localAudioRef.current) localAudioRef.current.pause();
                setTimeout(onClose, 1200);
            }, 3000);
            return () => { if (autoCloseRef.current) clearTimeout(autoCloseRef.current); };
        }
        
        let delay = 120;
        if (isCharAnim) {
            delay = letterCharDelay !== undefined ? Number(letterCharDelay) : 30;
        } else {
            delay = letterWordDelay !== undefined ? Number(letterWordDelay) : 120;
        }
        
        const t = setTimeout(() => setVisibleCount(c => c + 1), delay);
        return () => clearTimeout(t);
    }, [phase, visibleCount, totalCount, disableWordByWord, letterWordDelay, letterCharDelay, isCharAnim]);

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
                // Only auto-scroll if user is not manually scrolling or reached bottom
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

    const handleClose = () => {
        if (autoCloseRef.current) clearTimeout(autoCloseRef.current);
        setPhase('closing');
        if (localAudioRef.current) localAudioRef.current.pause();
        setTimeout(onClose, 1200);
    };

    const visibleText = isCharAnim
        ? fullText.slice(0, visibleCount)
        : words.slice(0, visibleCount).join(' ');

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center"
            style={{ background: 'rgba(10,0,20,0.92)', backdropFilter: 'blur(16px)' }}>
            {letterMusicUrl && <audio ref={localAudioRef} src={letterMusicUrl} loop />}
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(255,105,180,0.12) 0%, transparent 65%)' }} />
            {Array.from({ length: 12 }).map((_, i) => (
                <motion.div key={i} animate={{ y: [-20, window.innerHeight + 20], x: [0, (Math.random() - 0.5) * 100], rotate: [0, 360], opacity: [0, 0.7, 0] }}
                    transition={{ duration: 5 + Math.random() * 4, delay: Math.random() * 3, repeat: Infinity, ease: 'linear' }}
                    style={{ position: 'absolute', fontSize: 18 + Math.random() * 12, left: `${Math.random() * 100}%`, top: '-20px', pointerEvents: 'none' }}>
                    {['🌸', '🌷', '✨', '💗', '🦋'][Math.floor(Math.random() * 5)]}
                </motion.div>
            ))}
            <div className="relative flex flex-col items-center" style={{ perspective: 1200 }}>
                <AnimatePresence>
                    {(phase === 'closed' || phase === 'opening' || phase === 'open') && (
                        <motion.div key="envelope" initial={{ scale: 0.6, opacity: 0, y: 60 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: -30 }} transition={{ duration: 0.7, ease: 'easeOut' }} style={{ width: 320, position: 'relative' }}>
                            <div style={{ width: 320, height: 220, borderRadius: 16, position: 'relative', overflow: 'visible', background: 'linear-gradient(160deg, #fff0f8 0%, #ffe4f0 60%, #ffd0e8 100%)', boxShadow: '0 20px 80px rgba(255,105,180,0.35), 0 4px 20px rgba(0,0,0,0.3)', border: '1px solid rgba(255,182,213,0.5)' }}>
                                <div style={{ position: 'absolute', inset: 0, borderRadius: 16, backgroundImage: `repeating-linear-gradient(45deg, rgba(255,105,180,0.05) 0px, rgba(255,105,180,0.05) 1px, transparent 1px, transparent 12px)` }} />
                                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 110, background: 'linear-gradient(160deg, #ffc0d8, #ffaac8)', clipPath: 'polygon(0 100%, 50% 0%, 100% 100%)', opacity: 0.5 }} />
                                <div style={{ position: 'absolute', top: 0, left: 0, width: 160, height: 220, background: 'linear-gradient(135deg, #ffd0e8, #ffc0d8)', clipPath: 'polygon(0 0, 100% 50%, 0 100%)', opacity: 0.4 }} />
                                <div style={{ position: 'absolute', top: 0, right: 0, width: 160, height: 220, background: 'linear-gradient(225deg, #ffd0e8, #ffc0d8)', clipPath: 'polygon(100% 0, 0 50%, 100% 100%)', opacity: 0.4 }} />
                                <motion.div animate={phase === 'opening' || phase === 'open' ? { rotateX: -180, y: -2 } : { rotateX: 0 }} transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }} style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 120, transformOrigin: 'top center', transformStyle: 'preserve-3d', zIndex: 10 }}>
                                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(175deg, #ffe4f0, #ffd0e8)', clipPath: 'polygon(0 0, 100% 0, 50% 100%)', backfaceVisibility: 'hidden', borderRadius: '16px 16px 0 0' }}>
                                        <div style={{ position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,105,180,0.4)', fontSize: 11, fontFamily: 'serif', letterSpacing: 3, textTransform: 'uppercase' }}>✦ with love ✦</div>
                                    </div>
                                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(175deg, #fff0f8, #ffeaf5)', clipPath: 'polygon(0 0, 100% 0, 50% 100%)', backfaceVisibility: 'hidden', transform: 'rotateX(180deg)' }} />
                                </motion.div>
                                <motion.div animate={phase === 'opening' || phase === 'open' ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }} transition={{ duration: 0.4 }} style={{ position: 'absolute', top: 72, left: '50%', transform: 'translateX(-50%)', width: 52, height: 52, borderRadius: '50%', zIndex: 20, background: 'radial-gradient(circle at 35% 35%, #e8607a, #b5264a)', boxShadow: '0 4px 12px rgba(181,38,74,0.5), inset 0 -2px 6px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>💖</motion.div>
                                <div style={{ position: 'absolute', bottom: 20, left: 0, right: 0, textAlign: 'center', fontSize: 13, color: 'rgba(180,60,120,0.5)', fontFamily: '"Dancing Script", cursive', letterSpacing: 1 }}>{phase === 'closed' ? 'Click to open ✨' : ''}</div>
                            </div>
                            <motion.div animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} style={{ position: 'absolute', top: -16, right: -16, fontSize: 28 }}>🌷</motion.div>
                            <motion.div animate={{ y: [0, 8, 0], rotate: [0, -5, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }} style={{ position: 'absolute', bottom: -12, left: -12, fontSize: 22 }}>✨</motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <AnimatePresence>
                    {phase === 'reading' && (
                        <motion.div key="letter" ref={letterScrollRef} initial={{ opacity: 0, y: 60, scale: 0.92 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 40 }} transition={{ duration: 0.8, ease: 'easeOut' }}
                            style={{ width: 340, maxHeight: '70vh', overflowY: 'auto', background: 'linear-gradient(160deg, #fff9fb 0%, #fff4f8 100%)', borderRadius: 16, boxShadow: '0 30px 100px rgba(255,105,180,0.3), 0 4px 20px rgba(0,0,0,0.25)', border: '1px solid rgba(255,182,213,0.4)', padding: '36px 32px 32px', position: 'relative' }}>
                            {Array.from({ length: 18 }).map((_, i) => (<div key={i} style={{ position: 'absolute', left: 32, right: 32, top: 60 + i * 28, height: 1, background: 'rgba(255,182,213,0.2)', pointerEvents: 'none' }} />))}
                            <div style={{ position: 'absolute', left: 52, top: 0, bottom: 0, width: 1, background: 'rgba(255,105,180,0.15)', pointerEvents: 'none' }} />
                            <div style={{ position: 'absolute', top: 0, right: 0, width: 32, height: 32, background: 'linear-gradient(225deg, #ffd0e8 50%, transparent 50%)', borderRadius: '0 16px 0 0' }} />
                            <div style={{ fontFamily: '"Dancing Script","Segoe UI",cursive', position: 'relative', zIndex: 1 }}>
                                <p style={{ fontSize: 16, color: '#6b3050', lineHeight: 1.8 }}>
                                    {visibleText}
                                    {visibleWordCount < totalWords && (
                                        <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.7, repeat: Infinity }} style={{ color: '#ff69b4', fontSize: 18, marginLeft: 2 }}>|</motion.span>
                                    )}
                                </p>
                                {visibleWordCount >= totalWords && (
                                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ textAlign: 'center', color: 'rgba(255,105,180,0.5)', fontSize: 12, marginTop: 16, fontFamily: 'serif' }}>
                                        ✨ Letter complete — closing soon...
                                    </motion.p>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                {phase === 'reading' && (
                    <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} onClick={handleClose}
                        style={{ marginTop: 20, padding: '10px 32px', borderRadius: 50, background: 'linear-gradient(135deg, #ff69b4, #da70d6)', color: 'white', border: 'none', cursor: 'pointer', fontFamily: '"Dancing Script", cursive', fontSize: 16, boxShadow: '0 4px 20px rgba(255,105,180,0.4)' }}>
                        Close Letter 💌
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
}


// ─────────────────────────────────────────────
// GALLERY SLIDESHOW + FULL GALLERY
// ─────────────────────────────────────────────
function PolaroidGallery({ items, onClose, initialPhase = 'slideshow' }: {
    items: GalleryItem[];
    onClose: () => void;
    initialPhase?: 'slideshow' | 'grid';
}) {
    const [phase, setPhase] = useState<'slideshow' | 'grid'>(items.length > 0 ? initialPhase : 'grid');
    const [slideIndex, setSlideIndex] = useState(0);
    const [lightbox, setLightbox] = useState<string | null>(null);
    const rotations = [-6, 4, -3, 7, -5, 3, -8, 5, -2, 6, -4, 8];

    // Auto-advance slideshow
    useEffect(() => {
        if (phase !== 'slideshow' || items.length === 0) return;
        if (slideIndex >= items.length) { setPhase('grid'); return; }
        const t = setTimeout(() => setSlideIndex(i => i + 1), 2200);
        return () => clearTimeout(t);
    }, [phase, slideIndex, items.length]);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] overflow-y-auto"
            style={{ background: 'rgba(8,0,18,0.95)', backdropFilter: 'blur(20px)' }}>

            {/* ── SLIDESHOW PHASE ── */}
            <AnimatePresence>
                {phase === 'slideshow' && slideIndex < items.length && (
                    <motion.div key={`slide-${slideIndex}`} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.6 }}
                        style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10, background: 'radial-gradient(ellipse at 50% 50%, rgba(218,112,214,0.2) 0%, rgba(8,0,18,0.98) 70%)' }}>
                        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                            style={{ position: 'relative', padding: '14px 14px 44px', background: '#fffaf9', borderRadius: 4, boxShadow: '0 20px 80px rgba(0,0,0,0.6), 0 0 60px rgba(255,105,180,0.2)', maxWidth: '80vw', maxHeight: '70vh' }}>
                            <img src={items[slideIndex].mediaUrl} alt={items[slideIndex].caption || ''} style={{ maxWidth: '70vw', maxHeight: '55vh', objectFit: 'contain', display: 'block', borderRadius: 2 }} />
                            <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', width: 60, height: 18, background: 'rgba(255,182,213,0.6)', borderRadius: 2 }} />
                            {items[slideIndex].caption && (
                                <p style={{ textAlign: 'center', marginTop: 8, fontFamily: '"Dancing Script",cursive', fontSize: 16, color: '#8b4070' }}>{items[slideIndex].caption}</p>
                            )}
                        </motion.div>
                        {/* Progress dots */}
                        <div style={{ display: 'flex', gap: 8, marginTop: 28 }}>
                            {items.map((_, i) => (
                                <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: i === slideIndex ? '#ff69b4' : 'rgba(255,182,213,0.3)', transition: 'background 0.3s' }} />
                            ))}
                        </div>
                        <button onClick={() => setPhase('grid')} style={{ marginTop: 20, background: 'transparent', border: '1px solid rgba(255,182,213,0.4)', borderRadius: 50, padding: '8px 24px', color: '#ffb3d9', fontFamily: '"Dancing Script",cursive', fontSize: 15, cursor: 'pointer' }}>
                            Skip to Gallery →
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── GRID PHASE ── */}

            <div style={{ background: 'radial-gradient(ellipse at 50% 20%, rgba(218,112,214,0.15) 0%, transparent 60%)', minHeight: '100%', padding: '40px 20px 60px' }}>
                <div style={{ maxWidth: 960, margin: '0 auto' }}>
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: 40 }}>
                        <motion.h2
                            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                            style={{ fontFamily: '"Dancing Script", cursive', fontSize: 42, color: '#ffb3d9', marginBottom: 8 }}
                        >
                            Our Gallery 📸
                        </motion.h2>
                        <p style={{ color: 'rgba(255,179,217,0.5)', fontFamily: 'serif', fontSize: 14 }}>Click any photo to view</p>
                    </div>

                    {items.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,179,217,0.4)', fontFamily: 'serif', fontSize: 18 }}>
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
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                            onError={e => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23f5dde8' width='200' height='200'/%3E%3Ctext y='110' x='100' text-anchor='middle' font-size='40'%3E📸%3C/text%3E%3C/svg%3E"; }}
                                        />
                                    </div>
                                    {item.caption && (
                                        <p style={{ textAlign: 'center', marginTop: 10, fontFamily: '"Dancing Script", cursive', fontSize: 13, color: '#8b4070', lineHeight: 1.4 }}>
                                            {item.caption}
                                        </p>
                                    )}
                                    {/* Tape effect */}
                                    <div style={{
                                        position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)',
                                        width: 50, height: 18, borderRadius: 2,
                                        background: 'rgba(255,182,213,0.55)',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                                    }} />
                                </motion.div>
                            ))}
                        </div>
                    )}

                    <div style={{ textAlign: 'center', marginTop: 48 }}>
                        <button onClick={onClose} style={{
                            padding: '12px 36px', borderRadius: 50, border: '1px solid rgba(255,182,213,0.4)',
                            background: 'transparent', color: '#ffb3d9', cursor: 'pointer',
                            fontFamily: '"Dancing Script", cursive', fontSize: 17,
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
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setLightbox(null)}
                        style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
                    >
                        <motion.img
                            initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                            src={lightbox} alt=""
                            style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: 8, boxShadow: '0 20px 60px rgba(255,105,180,0.3)' }}
                            onClick={e => e.stopPropagation()}
                        />
                        <button onClick={() => setLightbox(null)} style={{ position: 'fixed', top: 24, right: 24, background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', width: 40, height: 40, borderRadius: '50%', cursor: 'pointer', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
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
            <div style={{ background: 'radial-gradient(ellipse at 50% 10%, rgba(255,105,180,0.12) 0%, transparent 60%)', minHeight: '100%', padding: '40px 20px 60px' }}>
                <div style={{ maxWidth: 680, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 40 }}>
                        <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                            style={{ fontFamily: '"Dancing Script", cursive', fontSize: 42, color: '#ffb3d9', marginBottom: 8 }}>
                            Our Story ✨
                        </motion.h2>
                    </div>

                    {memories.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,179,217,0.4)', fontFamily: 'serif', fontSize: 18 }}>No memories added yet 🌸</div>
                    ) : (
                        <div style={{ position: 'relative' }}>
                            {/* Timeline line */}
                            <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, background: 'linear-gradient(180deg, transparent, rgba(255,182,213,0.4) 20%, rgba(255,182,213,0.4) 80%, transparent)', transform: 'translateX(-50%)' }} />
                            {memories.map((m, i) => (
                                <motion.div
                                    key={m.id}
                                    initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.12, duration: 0.6 }}
                                    style={{ display: 'flex', justifyContent: i % 2 === 0 ? 'flex-end' : 'flex-start', marginBottom: 28, paddingRight: i % 2 === 0 ? '52%' : 0, paddingLeft: i % 2 === 1 ? '52%' : 0, position: 'relative' }}
                                >
                                    {/* Dot */}
                                    <div style={{ position: 'absolute', left: '50%', top: 20, transform: 'translateX(-50%)', width: 14, height: 14, borderRadius: '50%', background: 'linear-gradient(135deg, #ff69b4, #da70d6)', boxShadow: '0 0 12px rgba(255,105,180,0.7)', zIndex: 2 }} />
                                    <div style={{
                                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,182,213,0.2)',
                                        borderRadius: 16, padding: '16px 20px', backdropFilter: 'blur(12px)',
                                        maxWidth: 240,
                                    }}>
                                        {m.imageUrl && (
                                            <img src={m.imageUrl} alt="" style={{ width: '100%', borderRadius: 10, marginBottom: 10, objectFit: 'cover', aspectRatio: '4/3' }} />
                                        )}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                            {m.emoji && <span style={{ fontSize: 20 }}>{m.emoji}</span>}
                                            <span style={{ fontFamily: '"Dancing Script", cursive', fontSize: 16, color: '#ffb3d9', fontWeight: 700 }}>{m.title}</span>
                                        </div>
                                        {m.description && <p style={{ color: 'rgba(255,200,230,0.65)', fontSize: 12, fontFamily: 'serif', lineHeight: 1.6, margin: 0 }}>{m.description}</p>}
                                        <p style={{ color: 'rgba(255,182,213,0.4)', fontSize: 11, fontFamily: 'sans-serif', marginTop: 8, margin: 0 }}>
                                            {new Date(m.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                            {m.location && ` · 📍 ${m.location}`}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    <div style={{ textAlign: 'center', marginTop: 48 }}>
                        <button onClick={onClose} style={{ padding: '12px 36px', borderRadius: 50, border: '1px solid rgba(255,182,213,0.4)', background: 'transparent', color: '#ffb3d9', cursor: 'pointer', fontFamily: '"Dancing Script", cursive', fontSize: 17 }}>
                            ← Back to Celebration
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// ─────────────────────────────────────────────
// MEMORY DETAIL MODAL
// ─────────────────────────────────────────────
function MemoryDetailModal({ memory, onClose }: { memory: Memory; onClose: () => void }) {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, zIndex: 9000, background: 'rgba(5,0,15,0.92)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div
                initial={{ scale: 0.7, opacity: 0, rotateY: -20 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 40 }}
                transition={{ type: 'spring', stiffness: 100, damping: 18 }}
                onClick={e => e.stopPropagation()}
                style={{ background: 'linear-gradient(160deg, rgba(30,0,60,0.95), rgba(15,0,30,0.98))', border: '1px solid rgba(255,182,213,0.25)', borderRadius: 24, padding: 36, maxWidth: 480, width: '100%', boxShadow: '0 40px 120px rgba(255,105,180,0.25), 0 0 0 1px rgba(255,182,213,0.1)', position: 'relative' }}>

                {/* Glow blob */}
                <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, background: 'radial-gradient(circle, rgba(218,112,214,0.3) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

                {/* Emoji + title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    {memory.emoji && <span style={{ fontSize: 36 }}>{memory.emoji}</span>}
                    <motion.h2 initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}
                        style={{ fontFamily: '"Dancing Script",cursive', fontSize: 30, background: 'linear-gradient(135deg, #ffb3d9, #da70d6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', margin: 0 }}>
                        {memory.title}
                    </motion.h2>
                </div>

                {/* Image */}
                {memory.imageUrl && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                        style={{ marginBottom: 20, borderRadius: 16, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
                        <img src={memory.imageUrl} alt={memory.title} style={{ width: '100%', objectFit: 'cover', maxHeight: 240, display: 'block' }} />
                    </motion.div>
                )}

                {/* Description */}
                {memory.description && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                        style={{ fontFamily: '"Dancing Script",cursive', fontSize: 18, color: 'rgba(255,200,230,0.85)', lineHeight: 1.7, marginBottom: 16 }}>
                        {memory.description}
                    </motion.p>
                )}

                {/* Meta */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                    style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
                    <span style={{ background: 'rgba(255,105,180,0.12)', border: '1px solid rgba(255,105,180,0.2)', borderRadius: 50, padding: '4px 14px', color: 'rgba(255,182,213,0.7)', fontSize: 12, fontFamily: 'sans-serif' }}>
                        📅 {new Date(memory.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                    {memory.location && (
                        <span style={{ background: 'rgba(218,112,214,0.12)', border: '1px solid rgba(218,112,214,0.2)', borderRadius: 50, padding: '4px 14px', color: 'rgba(255,182,213,0.7)', fontSize: 12, fontFamily: 'sans-serif' }}>
                            📍 {memory.location}
                        </span>
                    )}
                </motion.div>

                <button onClick={onClose}
                    style={{ width: '100%', padding: '12px', borderRadius: 50, background: 'linear-gradient(135deg, rgba(255,105,180,0.15), rgba(147,112,219,0.15))', border: '1px solid rgba(255,182,213,0.3)', color: '#ffb3d9', fontFamily: '"Dancing Script",cursive', fontSize: 18, cursor: 'pointer' }}>
                    Close ✨
                </button>
            </motion.div>
        </motion.div>
    );
}


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
function BirthdayCake3D({ name, onWish, onClick, interactive = true }: { name: string; onWish?: () => void; onClick?: () => void; interactive?: boolean }) {
    const [candlesLit, setCandlesLit] = useState(true);
    const [blown, setBlown] = useState(false);

    const blowCandles = () => {
        if (!interactive) {
            if (onClick) onClick();
            return;
        }
        if (!candlesLit) return;
        setCandlesLit(false);
        setTimeout(() => { setBlown(true); if (onWish) onWish(); }, 300);
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
                    {[0, 1, 2, 3, 4].map(i => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            {candlesLit && (
                                <motion.div
                                    animate={{ scale: [1, 1.3, 0.9, 1.2, 1], opacity: [1, 0.8, 1] }}
                                    transition={{ duration: 0.6 + i * 0.1, repeat: Infinity }}
                                    style={{ fontSize: 14, marginBottom: -2, filter: 'drop-shadow(0 0 6px #ffd700)' }}
                                >🔥</motion.div>
                            )}
                            <div style={{ width: 6, height: 22, background: `hsl(${i * 60},80%,60%)`, borderRadius: 3 }} />
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
                    <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(90deg, transparent, transparent 14px, rgba(255,255,255,0.15) 14px, rgba(255,255,255,0.15) 15px)' }} />
                    <div style={{ position: 'absolute', top: 8, left: 0, right: 0, textAlign: 'center', fontSize: 10, color: 'white', fontFamily: '"Dancing Script",cursive' }}>
                        {name ? name : '🎂'}
                    </div>
                </div>

                {/* Frosting drips top */}
                <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: -4, padding: '0 8px' }}>
                    {[0, 1, 2, 3, 4, 5].map(i => (
                        <div key={i} style={{ width: 10, height: 14, background: 'white', borderRadius: '0 0 8px 8px', opacity: 0.9, marginTop: i % 2 === 0 ? 0 : 4 }} />
                    ))}
                </div>

                {/* Bottom tier */}
                <div style={{
                    width: 160, height: 56, marginLeft: -20,
                    background: 'linear-gradient(135deg, #da70d6, #9370db)',
                    boxShadow: '0 8px 24px rgba(147,112,219,0.4), inset 0 -4px 8px rgba(0,0,0,0.1)',
                    position: 'relative', overflow: 'hidden', borderRadius: '0 0 8px 8px',
                }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(90deg, transparent, transparent 18px, rgba(255,255,255,0.1) 18px, rgba(255,255,255,0.1) 19px)' }} />
                    {/* Bottom dips/dots decoration */}
                    {[20, 45, 70, 100, 130].map((x, i) => (
                        <div key={i} style={{ position: 'absolute', top: '50%', left: x, transform: 'translateY(-50%)', width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.5)' }} />
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
                <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    style={{ marginTop: 16, fontFamily: '"Dancing Script",cursive', fontSize: 18, color: '#ffb3d9' }}>
                    Make a wish! 🌟
                </motion.p>
            ) : (
                <p style={{ marginTop: 12, fontFamily: '"Dancing Script",cursive', fontSize: 14, color: 'rgba(255,179,217,0.6)' }}>
                    Tap to blow out candles ✨
                </p>
            )}
        </motion.div>
    );
}

// ─────────────────────────────────────────────
// CAKE POP-UP MODAL (WISH & CELEBRATION FLOW)
// ─────────────────────────────────────────────
function CakePopUpModal({ name, slug, onClose, onCelebrate }: { name: string; slug: string; onClose: () => void; onCelebrate: () => void }) {
    const [step, setStep] = useState<'blow' | 'write' | 'success'>('blow');
    const [wishText, setWishText] = useState('');
    const [senderName, setSenderName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [confettiActive, setConfettiActive] = useState(false);

    const handleBlow = () => {
        setConfettiActive(true);
        onCelebrate(); // Trigger screen confetti & music
        setTimeout(() => {
            setStep('write');
        }, 1500);
    };

    const wordCount = wishText.trim().split(/\s+/).filter(Boolean).length;
    const isOverLimit = wordCount > 50;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!wishText.trim()) {
            toast.error('Please write a wish first! ✨');
            return;
        }
        if (isOverLimit) {
            toast.error('Your wish must be under 50 words.');
            return;
        }

        setIsSubmitting(true);
        try {
            await publicAPI.submitWish(slug, {
                wish: wishText,
                name: senderName || 'Anonymous'
            });
            toast.success('Your wish has been written in the stars! 🌟');
            setStep('success');
        } catch (error) {
            console.error('Failed to submit wish:', error);
            toast.error('The universe could not save your wish right now. Please try again!');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            style={{ background: 'rgba(8,0,18,0.94)', backdropFilter: 'blur(20px)' }}
        >
            <ConfettiExplosion trigger={confettiActive} />

            <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 30 }}
                transition={{ type: 'spring', damping: 20 }}
                style={{
                    background: 'linear-gradient(160deg, rgba(30,0,60,0.96), rgba(15,0,30,0.98))',
                    border: '1px solid rgba(255,182,213,0.3)',
                    borderRadius: 28,
                    padding: '36px 28px',
                    maxWidth: 450,
                    width: '100%',
                    boxShadow: '0 30px 100px rgba(255,105,180,0.35), 0 0 0 1px rgba(255,182,213,0.1)',
                    position: 'relative',
                    textAlign: 'center',
                    color: '#fff',
                }}
            >
                {/* Glow Background blobs */}
                <div style={{ position: 'absolute', top: -30, left: -30, width: 140, height: 140, background: 'radial-gradient(circle, rgba(255,105,180,0.2) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: -30, right: -30, width: 140, height: 140, background: 'radial-gradient(circle, rgba(147,112,219,0.2) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

                {/* Close Button on Top Right */}
                {step !== 'success' && (
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute', top: 20, right: 20,
                            background: 'rgba(255,255,255,0.06)', border: 'none',
                            color: 'rgba(255,182,213,0.7)', width: 32, height: 32,
                            borderRadius: '50%', cursor: 'pointer', fontSize: 16,
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                    >
                        ✕
                    </button>
                )}

                <AnimatePresence mode="wait">
                    {step === 'blow' && (
                        <motion.div
                            key="blow-step"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            className="flex flex-col items-center"
                        >
                            <h2 style={{ fontFamily: '"Dancing Script", cursive', fontSize: 32, color: '#ffb3d9', marginBottom: 12 }}>
                                Make a Wish 🎂
                            </h2>
                            <p style={{ color: 'rgba(255,182,213,0.6)', fontSize: 14, fontFamily: 'serif', marginBottom: 32 }}>
                                A magical cake has appeared for you...
                            </p>

                            <div style={{ transform: 'scale(1.2)', margin: '20px 0 35px' }}>
                                <BirthdayCake3D name={name} onWish={handleBlow} interactive={true} />
                            </div>

                            <motion.p
                                animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.02, 1] }}
                                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                                style={{
                                    fontFamily: '"Dancing Script", cursive',
                                    fontSize: 18,
                                    color: '#ff69b4',
                                    fontWeight: 'bold',
                                    marginTop: 10
                                }}
                            >
                                ✨ Tap the cake to blow out candles! ✨
                            </motion.p>
                        </motion.div>
                    )}

                    {step === 'write' && (
                        <motion.div
                            key="write-step"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            className="flex flex-col items-center w-full"
                        >
                            <h2 style={{ fontFamily: '"Dancing Script", cursive', fontSize: 30, color: '#ffb3d9', marginBottom: 8 }}>
                                Write Your Wish 🌟
                            </h2>
                            <p style={{ color: 'rgba(255,182,213,0.6)', fontSize: 13, fontFamily: 'serif', marginBottom: 20 }}>
                                Your message will be sent directly to the dashboard!
                            </p>

                            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 text-left">
                                <div className="flex flex-col gap-1">
                                    <label style={{ color: '#ffb3d9', fontFamily: '"Dancing Script", cursive', fontSize: 16 }}>
                                        Your Name (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={senderName}
                                        onChange={(e) => setSenderName(e.target.value)}
                                        placeholder="e.g. Bestie, Mom, Secret Admirer..."
                                        style={{
                                            width: '100%',
                                            padding: '10px 16px',
                                            borderRadius: 14,
                                            border: '1px solid rgba(255,182,213,0.2)',
                                            background: 'rgba(255,255,255,0.04)',
                                            color: '#fff',
                                            fontFamily: 'serif',
                                            outline: 'none',
                                            fontSize: 14,
                                            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
                                        }}
                                    />
                                </div>

                                <div className="flex flex-col gap-1 relative" style={{ display: 'flex', flexDirection: 'column' }}>
                                    <label style={{ color: '#ffb3d9', fontFamily: '"Dancing Script", cursive', fontSize: 16 }}>
                                        Your Wish/Message *
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={wishText}
                                        onChange={(e) => setWishText(e.target.value)}
                                        placeholder="Dear Emma, I wish you a year filled with magic, laughter, and endless love..."
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            borderRadius: 16,
                                            border: isOverLimit ? '1px solid #ff4d4d' : '1px solid rgba(255,182,213,0.2)',
                                            background: 'rgba(255,255,255,0.04)',
                                            color: '#fff',
                                            fontFamily: 'serif',
                                            outline: 'none',
                                            fontSize: 14,
                                            resize: 'none',
                                            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
                                        }}
                                    />
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 12 }}>
                                        <span style={{ color: isOverLimit ? '#ff4d4d' : 'rgba(255,182,213,0.5)' }}>
                                            {wordCount} / 50 words
                                        </span>
                                        {isOverLimit && (
                                            <span style={{ color: '#ff4d4d' }}>Exceeded limit!</span>
                                        )}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting || !wishText.trim() || isOverLimit}
                                    style={{
                                        marginTop: 8,
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: 50,
                                        background: 'linear-gradient(135deg, #ff69b4, #da70d6)',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontFamily: '"Dancing Script", cursive',
                                        fontSize: 18,
                                        boxShadow: '0 6px 20px rgba(255,105,180,0.3)',
                                        opacity: (isSubmitting || !wishText.trim() || isOverLimit) ? 0.6 : 1,
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    {isSubmitting ? 'Sending to stars... 💫' : 'Send Wish to Stars 🌟'}
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {step === 'success' && (
                        <motion.div
                            key="success-step"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center"
                        >
                            <div style={{ fontSize: 64, marginBottom: 16 }}>✨🌟✨</div>
                            <h2 style={{ fontFamily: '"Dancing Script", cursive', fontSize: 32, color: '#ffb3d9', marginBottom: 12 }}>
                                Wish Sent!
                            </h2>
                            <p style={{ color: 'rgba(255,182,213,0.8)', fontSize: 16, fontFamily: 'serif', lineHeight: 1.6, marginBottom: 30, padding: '0 10px' }}>
                                Your beautiful wish has been successfully sent to the dashboard. It is now written in the stars! 🌌
                            </p>

                            <button
                                onClick={onClose}
                                style={{
                                    padding: '10px 36px',
                                    borderRadius: 50,
                                    background: 'linear-gradient(135deg, #ff69b4, #da70d6)',
                                    color: 'white',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontFamily: '"Dancing Script", cursive',
                                    fontSize: 18,
                                    boxShadow: '0 4px 20px rgba(255,105,180,0.4)',
                                    transition: 'transform 0.2s'
                                }}
                            >
                                Close Modal 💌
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
}

// ─────────────────────────────────────────────
// MAIN: CELESTIAL BIRTHDAY THEME
// ─────────────────────────────────────────────
export default function CelestialBirthdayTheme({ project }: { project: Project }) {
    // ── STATES ──
    const [introPhase, setIntroPhase] = useState<'loading' | 'text' | 'done'>('loading');
    const [activeModal, setActiveModal] = useState<null | 'letter' | 'gallery' | 'timeline'>(null);
    const [showCakeModal, setShowCakeModal] = useState(false);
    const [confetti, setConfetti] = useState(false);
    const [wishMade, setWishMade] = useState(false);
    const [showBigCelebration, setShowBigCelebration] = useState(false);
    const [celebrationSource, setCelebrationSource] = useState<'first' | 'again'>('first');
    const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
    const [galleryPhase, setGalleryPhase] = useState<'slideshow' | 'grid'>('slideshow');
    const audioRef = useRef<HTMLAudioElement>(null);
    const letterAudioRef = useRef<HTMLAudioElement>(null);

    const name = project.personOneName || 'Beautiful Soul';
    const occasion = project.occasion || 'Birthday';
    const heroMessage = project.heroConfig?.message || '';
    const letterMessage = (project.heroConfig?.useDifferentLetterText && project.heroConfig?.letterMessage)
        ? project.heroConfig.letterMessage
        : heroMessage;
    const celebrateText = project.heroConfig?.celebrateText || `Wishing you a Magical ${occasion}! 🌟`;
    const celebrateAgainText = (project.heroConfig?.useDifferentCelebrateAgain && project.heroConfig?.celebrateAgainText)
        ? project.heroConfig.celebrateAgainText
        : celebrateText;
    const letterMusicUrl = project.heroConfig?.letterMusicUrl || '';
    const welcomePopupText = project.heroConfig?.welcomePopupText || 'a special surprise awaits…';
    const disableLetterAutoScroll = project.heroConfig?.disableLetterAutoScroll || false;
    const disableWordByWord = project.heroConfig?.disableWordByWord || false;

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

    const handleCelebrate = (source: 'first' | 'again' = 'first') => {
        setCelebrationSource(source);
        setConfetti(true);
        setTimeout(() => setConfetti(false), 3000);
        setShowBigCelebration(true);
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(e => console.error("Audio playback failed", e));
        }
    };

    const openModal = (m: typeof activeModal) => {
        if (m === 'gallery') setGalleryPhase('slideshow');
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
                            style={{ textAlign: 'center' }}>
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                style={{ fontSize: 52, display: 'block', marginBottom: 16 }}>
                                ✨
                            </motion.div>
                        </motion.div>
                    )}
                    {introPhase === 'text' && (
                        <motion.div key="l2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            style={{ textAlign: 'center', padding: '0 24px' }}>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                                style={{ fontFamily: '"Dancing Script",cursive', fontSize: 18, color: 'rgba(255,182,213,0.6)', letterSpacing: 4, textTransform: 'uppercase', marginBottom: 16 }}
                            >
                                {welcomePopupText}
                            </motion.p>
                            <motion.h1
                                initial={{ opacity: 0, y: 30, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.5, duration: 0.9 }}
                                style={{ fontFamily: '"Dancing Script",cursive', fontSize: 'clamp(2.8rem,10vw,5rem)', color: '#ffb3d9', lineHeight: 1.2, textShadow: '0 0 40px rgba(255,105,180,0.5)', marginBottom: 20 }}
                            >
                                Happy {occasion},<br />{name} 🎂
                            </motion.h1>
                            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1, duration: 0.8 }}
                                style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,182,213,0.5), transparent)', maxWidth: 300, margin: '0 auto' }} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    // ── MAIN EXPERIENCE ──
    return (
        <div style={{ minHeight: '100vh', background: 'radial-gradient(ellipse at 50% 0%, #1e0040 0%, #0a000f 55%, #050008 100%)', overflow: 'hidden', position: 'relative' }}>
            <SparkleCanvas />
            <CursorGlow />
            <HeartBurst />
            <ConfettiExplosion trigger={confetti} />

            {/* Aurora background layers */}
            <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
                <motion.div animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.05, 1] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ position: 'absolute', top: '-20%', left: '-10%', width: '70%', height: '70%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(218,112,214,0.18) 0%, transparent 70%)', filter: 'blur(40px)' }} />
                <motion.div animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.08, 1] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
                    style={{ position: 'absolute', top: '10%', right: '-15%', width: '60%', height: '60%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,105,180,0.15) 0%, transparent 70%)', filter: 'blur(50px)' }} />
                <motion.div animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
                    style={{ position: 'absolute', bottom: '-10%', left: '20%', width: '60%', height: '50%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(147,112,219,0.14) 0%, transparent 70%)', filter: 'blur(45px)' }} />
            </div>

            {/* Floating balloons background */}
            <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: 120, pointerEvents: 'none', zIndex: 1 }}>
                {[
                    { emoji: '🎈', color: 'rgba(255,105,180,0.5)', delay: 0, x: 5 },
                    { emoji: '🎀', color: 'rgba(218,112,214,0.5)', delay: 0.5, x: 15 },
                    { emoji: '💜', color: 'rgba(147,112,219,0.5)', delay: 1, x: 80 },
                    { emoji: '🎈', color: 'rgba(255,182,213,0.5)', delay: 1.5, x: 90 },
                    { emoji: '⭐', color: 'rgba(255,215,0,0.5)', delay: 2, x: 50 },
                    { emoji: '🎊', color: 'rgba(255,105,180,0.5)', delay: 2.5, x: 70 },
                ].map((b, i) => <FloatingBalloon key={i} {...b} />)}
            </div>

            {/* ── HERO SECTION ── */}
            <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', position: 'relative', zIndex: 2 }}>

                {/* Cover image frame */}
                {project.coverImageUrl && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
                        animate={{ opacity: 1, scale: 1, rotate: -1 }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        style={{
                            position: 'relative', marginBottom: 32,
                            padding: 10, paddingBottom: 32,
                            background: 'linear-gradient(160deg, #fff8fc, #ffe4f0)',
                            boxShadow: '0 20px 60px rgba(255,105,180,0.3), 0 4px 16px rgba(0,0,0,0.4)',
                            borderRadius: 4, maxWidth: 280, width: '100%',
                        }}
                    >
                        <img src={project.coverImageUrl} alt="Cover"
                            style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block', borderRadius: 2 }} />
                        <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', width: 60, height: 18, borderRadius: 2, background: 'rgba(255,182,213,0.6)' }} />
                        <p style={{ position: 'absolute', bottom: 8, left: 0, right: 0, textAlign: 'center', fontFamily: '"Dancing Script",cursive', fontSize: 15, color: '#c0306a' }}>
                            {[project.personOneName, project.personTwoName].filter(Boolean).join(' & ')}
                        </p>
                    </motion.div>
                )}

                {/* Title */}
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} style={{ textAlign: 'center', marginBottom: 12 }}>
                    <p style={{ fontFamily: '"Dancing Script",cursive', fontSize: 16, color: 'rgba(255,182,213,0.6)', letterSpacing: 4, textTransform: 'uppercase', marginBottom: 10 }}>
                        {occasion}
                    </p>
                    <h1 style={{
                        fontFamily: '"Dancing Script",cursive',
                        fontSize: 'clamp(3rem,10vw,5.5rem)',
                        background: 'linear-gradient(135deg, #ffb3d9, #da70d6, #9370db)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                        lineHeight: 1.15, marginBottom: 12,
                        filter: 'drop-shadow(0 0 30px rgba(255,105,180,0.4))',
                    }}>
                        {project.title}
                    </h1>
                    {project.subtitle && (
                        <p style={{ fontFamily: '"Dancing Script",cursive', fontSize: 20, color: 'rgba(255,182,213,0.65)', fontStyle: 'italic' }}>
                            {project.subtitle}
                        </p>
                    )}
                </motion.div>

                {/* Birthday cake with click me tag */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    style={{ marginBottom: 40, display: 'flex', justifyContent: 'center' }}
                >
                    <div
                        style={{ position: 'relative', cursor: 'pointer' }}
                        onClick={() => setShowCakeModal(true)}
                    >
                        <BirthdayCake3D name={name} interactive={false} />
                        
                        {/* Cute pink font tag */}
                        <motion.div
                            animate={{ y: [-4, 4, -4], scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                            style={{
                                position: 'absolute',
                                top: -18,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                fontFamily: '"Dancing Script", cursive',
                                fontSize: 15,
                                color: '#e0115f',
                                fontWeight: 'bold',
                                background: 'rgba(255, 230, 240, 0.9)',
                                border: '2px solid #ff69b4',
                                borderRadius: '16px',
                                padding: '4px 14px',
                                boxShadow: '0 4px 15px rgba(255, 105, 180, 0.3)',
                                whiteSpace: 'nowrap',
                                zIndex: 10,
                                pointerEvents: 'none'
                            }}
                        >
                            ✨ Click me! 🎂
                        </motion.div>
                    </div>
                </motion.div>

                {wishMade && (
                    <motion.p initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                        style={{ fontFamily: '"Dancing Script",cursive', fontSize: 22, color: '#ffb3d9', textAlign: 'center', marginBottom: 28 }}>
                        🌟 Your wish is on its way to the stars!
                    </motion.p>
                )}

                {/* ── INTERACTIVE OBJECTS ── */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                    style={{ display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'center', marginBottom: 40 }}>

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
                        onClick={() => handleCelebrate('first')}
                    />
                </motion.div>

                {/* Scroll hint */}
                <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
                    style={{ color: 'rgba(255,182,213,0.3)', textAlign: 'center', fontSize: 13, fontFamily: 'serif' }}>
                    ↓ scroll for more magic
                </motion.div>
            </section>

            {/* ── MESSAGE SECTION ── */}
            {heroMessage && (
                <section style={{ padding: '60px 20px', position: 'relative', zIndex: 2 }}>
                    <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
                        <RevealBlock>
                            <div style={{
                                background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)',
                                border: '1px solid rgba(255,182,213,0.15)', borderRadius: 24,
                                padding: '40px 36px', position: 'relative',
                            }}>
                                <div style={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)', fontSize: 32 }}>💗</div>
                                <p style={{ fontFamily: '"Dancing Script",cursive', fontSize: 22, color: 'rgba(255,182,213,0.85)', lineHeight: 1.8, fontStyle: 'italic' }}>
                                    "{heroMessage}"
                                </p>
                            </div>
                        </RevealBlock>
                    </div>
                </section>
            )}

            {/* ── MEMORY STRIP (inline preview) ── */}
            {project.memories.length > 0 && (
                <section style={{ padding: '40px 0 60px', position: 'relative', zIndex: 2 }}>
                    <RevealBlock>
                        <div style={{ textAlign: 'center', marginBottom: 28 }}>
                            <h2 style={{ fontFamily: '"Dancing Script",cursive', fontSize: 34, color: '#ffb3d9' }}>Precious Moments ✨</h2>
                        </div>
                        <div style={{ display: 'flex', gap: 16, overflowX: 'auto', padding: '16px 20px 24px', scrollbarWidth: 'none' }}>
                            {project.memories.slice(0, 6).map((m, i) => (
                                <motion.div
                                    key={m.id}
                                    initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                                    whileHover={{ scale: 1.04, y: -4 }}
                                    onClick={() => setSelectedMemory(m)}
                                    style={{
                                        minWidth: 180, background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,182,213,0.2)', borderRadius: 16,
                                        padding: 16, flexShrink: 0, backdropFilter: 'blur(12px)',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {m.imageUrl && <img src={m.imageUrl} alt="" style={{ width: '100%', borderRadius: 10, marginBottom: 10, aspectRatio: '1/1', objectFit: 'cover' }} />}
                                    <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6 }}>
                                        {m.emoji && <span style={{ fontSize: 18 }}>{m.emoji}</span>}
                                        <span style={{ fontFamily: '"Dancing Script",cursive', fontSize: 15, color: '#ffb3d9', fontWeight: 700, textDecoration: 'underline', textDecorationColor: 'rgba(255,182,213,0.3)' }}>{m.title}</span>
                                    </div>
                                    <p style={{ color: 'rgba(255,182,213,0.35)', fontSize: 11, fontFamily: 'sans-serif', margin: 0 }}>
                                        {new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </p>
                                    <p style={{ color: 'rgba(255,182,213,0.4)', fontSize: 11, fontFamily: 'serif', marginTop: 4 }}>Tap to open ✨</p>
                                </motion.div>
                            ))}
                        </div>
                        {project.memories.length > 0 && (
                            <div style={{ textAlign: 'center', marginTop: 12 }}>
                                <button onClick={() => openModal('timeline')} style={{ background: 'transparent', border: '1px solid rgba(255,182,213,0.3)', borderRadius: 50, padding: '8px 28px', color: '#ffb3d9', fontFamily: '"Dancing Script",cursive', fontSize: 16, cursor: 'pointer' }}>
                                    View All Memories →
                                </button>
                            </div>
                        )}
                    </RevealBlock>
                </section>
            )}

            {/* ── GALLERY STRIP ── */}
            {project.galleryItems.length > 0 && (
                <section style={{ padding: '20px 0 60px', position: 'relative', zIndex: 2 }}>
                    <RevealBlock>
                        <div style={{ textAlign: 'center', marginBottom: 28 }}>
                            <h2 style={{ fontFamily: '"Dancing Script",cursive', fontSize: 34, color: '#ffb3d9' }}>Photo Wall 📸</h2>
                        </div>
                        <div style={{ columns: '3 160px', gap: 10, padding: '0 20px' }}>
                            {project.galleryItems.slice(0, 9).map((item, i) => (
                                <motion.div key={item.id} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: i * 0.07 }} viewport={{ once: true }}
                                    style={{ breakInside: 'avoid', marginBottom: 10, cursor: 'pointer' }}
                                    onClick={() => openModal('gallery')}>
                                    <img src={item.mediaUrl} alt={item.caption || ''} style={{ width: '100%', borderRadius: 12, display: 'block', objectFit: 'cover' }} />
                                </motion.div>
                            ))}
                        </div>
                        {project.galleryItems.length > 3 && (
                            <div style={{ textAlign: 'center', marginTop: 20 }}>
                                <button onClick={() => openModal('gallery')} style={{ background: 'linear-gradient(135deg,#ff69b4,#da70d6)', border: 'none', borderRadius: 50, padding: '10px 32px', color: 'white', fontFamily: '"Dancing Script",cursive', fontSize: 17, cursor: 'pointer', boxShadow: '0 4px 20px rgba(255,105,180,0.35)' }}>
                                    Open Full Gallery ✨
                                </button>
                            </div>
                        )}
                    </RevealBlock>
                </section>
            )}

            {/* ── ENDING ── */}
            <section style={{ padding: '60px 20px 100px', position: 'relative', zIndex: 2, textAlign: 'center' }}>
                <RevealBlock>
                    <div style={{ maxWidth: 480, margin: '0 auto' }}>
                        <motion.div animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                            style={{ fontSize: 56, display: 'block', marginBottom: 16 }}>
                            🎂
                        </motion.div>
                        <h2 style={{ fontFamily: '"Dancing Script",cursive', fontSize: 42, background: 'linear-gradient(135deg,#ffb3d9,#da70d6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: 16 }}>
                            {project.endingConfig?.title || `Happy ${occasion}, ${name}! 🌟`}
                        </h2>
                        {project.endingConfig?.message && (
                            <p style={{ fontFamily: '"Dancing Script",cursive', fontSize: 20, color: 'rgba(255,182,213,0.7)', lineHeight: 1.7, marginBottom: 28 }}>
                                {project.endingConfig.message}
                            </p>
                        )}

                        {/* Re-celebrate */}
                        <motion.button
                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            onClick={() => handleCelebrate('again')}
                            style={{
                                background: 'linear-gradient(135deg,#ff69b4,#da70d6,#9370db)',
                                border: 'none', borderRadius: 50, padding: '14px 40px',
                                color: 'white', fontFamily: '"Dancing Script",cursive', fontSize: 20,
                                cursor: 'pointer', boxShadow: '0 8px 32px rgba(255,105,180,0.4)',
                                letterSpacing: 1,
                            }}
                        >
                            Celebrate Again! 🎊
                        </motion.button>

                        <div style={{ marginTop: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, color: 'rgba(255,182,213,0.2)', fontSize: 12, fontFamily: 'serif' }}>
                            <div style={{ width: 60, height: 1, background: 'rgba(255,182,213,0.15)' }} />
                            Made with love on Mémoire
                            <div style={{ width: 60, height: 1, background: 'rgba(255,182,213,0.15)' }} />
                        </div>
                    </div>
                </RevealBlock>
            </section>

            {/* ── MODALS ── */}
            <AnimatePresence>
                {activeModal === 'letter' && (
                    <EnvelopeLetter
                        key="letter-modal"
                        message={letterMessage}
                        personName={name}
                        letterMusicUrl={letterMusicUrl}
                        disableLetterAutoScroll={project.heroConfig?.disableLetterAutoScroll}
                        disableWordByWord={project.heroConfig?.disableWordByWord}
                        letterScrollSpeed={project.heroConfig?.letterScrollSpeed}
                        letterWordDelay={project.heroConfig?.letterWordDelay}
                        letterAnimType={project.heroConfig?.letterAnimType}
                        letterCharDelay={project.heroConfig?.letterCharDelay}
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

            {/* ── BIG CELEBRATION OVERLAY ── */}
            <AnimatePresence>
                {showBigCelebration && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            zIndex: 9999,
                            background: 'rgba(0, 0, 0, 0.85)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            backdropFilter: 'blur(10px)',
                            padding: 20,
                            textAlign: 'center'
                        }}
                        onClick={() => setShowBigCelebration(false)}
                    >
                        <ConfettiExplosion trigger={showBigCelebration} />
                        <motion.h1
                            initial={{ scale: 0.5, y: 50, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            transition={{ type: 'spring', bounce: 0.5, duration: 1 }}
                            style={{
                                fontFamily: '"Dancing Script",cursive',
                                fontSize: 'clamp(3rem, 10vw, 6rem)',
                                background: 'linear-gradient(135deg, #ffb3d9, #da70d6, #9370db)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                filter: 'drop-shadow(0 0 20px rgba(255,105,180,0.6))',
                                marginBottom: 20
                            }}
                        >
                            {celebrationSource === 'again' ? celebrateAgainText : celebrateText}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 1 }}
                            style={{
                                color: 'rgba(255, 255, 255, 0.8)',
                                fontSize: 24,
                                fontFamily: 'serif',
                                fontStyle: 'italic',
                                maxWidth: 600,
                                lineHeight: 1.6
                            }}
                        >
                            May this day be as extraordinary and beautiful as you are, {name}.
                        </motion.p>
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 2.5 }}
                            onClick={(e) => { e.stopPropagation(); setShowBigCelebration(false); }}
                            style={{
                                marginTop: 40,
                                background: 'linear-gradient(135deg,#ff69b4,#da70d6)',
                                border: 'none',
                                borderRadius: 50,
                                padding: '12px 32px',
                                color: 'white',
                                fontFamily: '"Dancing Script",cursive',
                                fontSize: 20,
                                cursor: 'pointer'
                            }}
                        >
                            Close Magic ✨
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── MEMORY DETAIL MODAL ── */}
            <AnimatePresence>
                {selectedMemory && (
                    <MemoryDetailModal
                        key="memory-detail"
                        memory={selectedMemory}
                        onClose={() => setSelectedMemory(null)}
                    />
                )}
            </AnimatePresence>

            {/* ── CAKE POP-UP MODAL ── */}
            <AnimatePresence>
                {showCakeModal && (
                    <CakePopUpModal
                        key="cake-modal"
                        name={name}
                        slug={project.slug}
                        onCelebrate={() => handleCelebrate('first')}
                        onClose={() => setShowCakeModal(false)}
                    />
                )}
            </AnimatePresence>

            <audio ref={audioRef} src="/music/celebration.mp3" loop />
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
