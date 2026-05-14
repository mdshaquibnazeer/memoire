'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';

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
  coverImageUrl: string | null;
  heroConfig: any;
  endingConfig: any;
  memories: Memory[];
  galleryItems: GalleryItem[];
}

const STICKER_DECORATIONS = ['🌸', '💌', '🎀', '✨', '🌻', '💛', '🦋', '🌷', '⭐', '🍀'];

export default function ScrapbookLoveTheme({ project }: { project: Project }) {
  const names = [project.personOneName, project.personTwoName].filter(Boolean).join(' & ');

  return (
    <main className="min-h-screen overflow-hidden relative" style={{
      background: 'linear-gradient(160deg, #fdf6ec 0%, #f9eedf 40%, #fdf0e8 100%)',
      fontFamily: "'Cormorant Garamond', Georgia, serif",
    }}>
      {/* Paper texture */}
      <div className="fixed inset-0 pointer-events-none opacity-30" style={{
        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(180,140,80,0.07) 27px, rgba(180,140,80,0.07) 28px)`,
      }} />

      {/* Decorative corner stickers */}
      {['top-4 left-4', 'top-4 right-4'].map((pos, i) => (
        <div key={i} className={`absolute ${pos} text-3xl opacity-40 z-10`}>
          {STICKER_DECORATIONS[i * 3]}
        </div>
      ))}

      {/* ── HERO / COVER PAGE ── */}
      <section className="min-h-screen flex flex-col items-center justify-center relative px-6 py-20">
        {/* Hand-torn border effect */}
        <div className="absolute top-0 left-0 right-0 h-8" style={{
          background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 30'%3E%3Cpath d='M0,15 Q50,5 100,15 Q150,25 200,15 Q250,5 300,15 Q350,25 400,15 Q450,5 500,15 Q550,25 600,15 Q650,5 700,15 Q750,25 800,15 Q850,5 900,15 Q950,25 1000,15 Q1050,5 1100,15 Q1150,25 1200,15 L1200,0 L0,0 Z' fill='%23d4a879'/%3E%3C/svg%3E") bottom/cover`,
          filter: 'drop-shadow(0 2px 4px rgba(180,140,80,0.2))',
        }} />

        {project.coverImageUrl ? (
          <ScrapbookReveal>
            <div className="relative max-w-lg w-full mb-10">
              {/* Polaroid frame */}
              <div className="bg-white p-4 pb-14 shadow-2xl -rotate-2 hover:rotate-0 transition-transform duration-500"
                style={{ boxShadow: '0 10px 40px rgba(180,140,80,0.3), 0 2px 8px rgba(0,0,0,0.1)' }}>
                <Image src={project.coverImageUrl} alt="Cover" width={600} height={400}
                  className="object-cover w-full" style={{ aspectRatio: '4/3' }} />
                <p className="text-center mt-4 font-script text-2xl text-amber-800/70">
                  {names || project.title}
                </p>
              </div>
              {/* Tape pieces */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 rotate-3 opacity-60 rounded-sm"
                style={{ background: 'rgba(212,168,121,0.5)', border: '1px solid rgba(180,140,80,0.3)' }} />
            </div>
          </ScrapbookReveal>
        ) : null}

        <ScrapbookReveal delay={0.3}>
          <div className="text-center">
            {project.occasion && (
              <p className="font-script text-2xl mb-3" style={{ color: '#b87b4a' }}>{project.occasion}</p>
            )}
            <h1 className="font-bold leading-tight mb-4"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(3rem, 8vw, 5.5rem)',
                color: '#5c3d2e',
                textShadow: '1px 1px 0 rgba(180,140,80,0.3)',
              }}>
              {project.title}
            </h1>
            {project.subtitle && (
              <p className="font-script text-2xl" style={{ color: '#9a6b4b' }}>{project.subtitle}</p>
            )}
            {names && (
              <p className="mt-4 uppercase tracking-[0.3em] text-sm font-sans" style={{ color: '#b87b4a', fontFamily: 'sans-serif' }}>
                {names}
              </p>
            )}
          </div>
        </ScrapbookReveal>
      </section>

      {/* ── MESSAGE ── */}
      {project.heroConfig?.message && (
        <section className="py-16 px-8 max-w-2xl mx-auto">
          <ScrapbookReveal>
            <div className="bg-white p-10 relative shadow-lg rotate-1 hover:rotate-0 transition-transform duration-300"
              style={{ boxShadow: '3px 3px 20px rgba(180,140,80,0.2)' }}>
              <div className="absolute -top-3 left-8 w-12 h-5 -rotate-6 opacity-50 rounded-sm"
                style={{ background: 'rgba(212,168,121,0.6)' }} />
              <p className="font-script text-2xl leading-loose" style={{ color: '#5c3d2e', lineHeight: 1.9 }}>
                {project.heroConfig.message}
              </p>
              <div className="absolute -bottom-3 right-8 text-2xl">💌</div>
            </div>
          </ScrapbookReveal>
        </section>
      )}

      {/* ── MEMORIES / SCRAPBOOK PAGES ── */}
      {project.memories.length > 0 && (
        <section className="py-16 px-6 max-w-5xl mx-auto">
          <ScrapbookReveal>
            <div className="text-center mb-12">
              <h2 className="font-bold text-4xl md:text-5xl" style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                color: '#5c3d2e',
              }}>
                Our Story 📖
              </h2>
            </div>
          </ScrapbookReveal>

          <div className="space-y-12">
            {project.memories.map((memory, i) => (
              <ScrapbookMemoryCard key={memory.id} memory={memory} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* ── GALLERY ── */}
      {project.galleryItems.length > 0 && (
        <section className="py-16 px-6 max-w-5xl mx-auto">
          <ScrapbookReveal>
            <div className="text-center mb-10">
              <h2 className="font-bold text-4xl md:text-5xl" style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                color: '#5c3d2e',
              }}>
                Photo Album 🎞
              </h2>
            </div>
          </ScrapbookReveal>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {project.galleryItems.map((item, i) => (
              <ScrapbookGalleryItem key={item.id} item={item} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* ── ENDING ── */}
      <section className="py-24 px-6">
        <div className="max-w-xl mx-auto">
          <ScrapbookReveal>
            <div className="bg-white p-12 text-center shadow-xl -rotate-1 hover:rotate-0 transition-transform duration-500 relative"
              style={{ boxShadow: '5px 5px 30px rgba(180,140,80,0.25)' }}>
              <div className="text-5xl mb-5">
                {project.endingConfig?.emoji || '💛'}
              </div>
              <h2 className="font-bold text-3xl md:text-4xl mb-5"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#5c3d2e' }}>
                {project.endingConfig?.title || 'Always & Forever'}
              </h2>
              {project.endingConfig?.message && (
                <p className="font-script text-xl leading-loose" style={{ color: '#9a6b4b' }}>
                  {project.endingConfig.message}
                </p>
              )}
              <div className="mt-8 text-xs uppercase tracking-widest font-sans" style={{ color: 'rgba(155,107,75,0.4)' }}>
                — Made with Mémoire —
              </div>
              {/* Corner decorations */}
              {['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'].map((pos) => (
                <div key={pos} className={`absolute ${pos} text-xl opacity-30`}>✦</div>
              ))}
            </div>
          </ScrapbookReveal>
        </div>
      </section>

      {/* Bottom torn border */}
      <div className="h-8" style={{
        background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 30'%3E%3Cpath d='M0,15 Q50,25 100,15 Q150,5 200,15 Q250,25 300,15 Q350,5 400,15 Q450,25 500,15 Q550,5 600,15 Q650,25 700,15 Q750,5 800,15 Q850,25 900,15 Q950,5 1000,15 Q1050,25 1100,15 Q1150,5 1200,15 L1200,30 L0,30 Z' fill='%23d4a879'/%3E%3C/svg%3E") top/cover`,
      }} />
    </main>
  );
}

function ScrapbookMemoryCard({ memory, index }: { memory: Memory; index: number }) {
  const isRight = index % 2 !== 0;
  const rotation = isRight ? 'rotate-1' : '-rotate-1';
  const sticker = STICKER_DECORATIONS[index % STICKER_DECORATIONS.length];

  return (
    <ScrapbookReveal delay={0.1}>
      <div className={`bg-white p-6 md:p-8 shadow-lg ${rotation} hover:rotate-0 transition-all duration-300 relative`}
        style={{ boxShadow: '3px 3px 20px rgba(180,140,80,0.2)' }}>
        <div className="flex flex-col md:flex-row gap-6">
          {memory.imageUrl && (
            <div className="relative w-full md:w-56 h-48 flex-shrink-0 overflow-hidden"
              style={{ boxShadow: '2px 2px 10px rgba(0,0,0,0.15)' }}>
              <Image src={memory.imageUrl} alt={memory.title} fill className="object-cover" />
              {/* Photo tape */}
              <div className="absolute -top-2 left-4 w-10 h-4 rotate-3 opacity-50 rounded-sm"
                style={{ background: 'rgba(212,168,121,0.6)' }} />
            </div>
          )}
          <div>
            <p className="text-xs uppercase tracking-[0.3em] mb-2 font-sans"
              style={{ color: '#b87b4a', fontFamily: 'sans-serif' }}>
              {new Date(memory.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              {memory.location && ` · 📍 ${memory.location}`}
            </p>
            <h3 className="text-2xl font-bold mb-3"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#5c3d2e' }}>
              {memory.emoji} {memory.title}
            </h3>
            {memory.description && (
              <p className="text-lg font-light leading-relaxed" style={{ color: '#7a5a40', fontStyle: 'italic' }}>
                {memory.description}
              </p>
            )}
          </div>
        </div>

        {/* Sticker decoration */}
        <div className="absolute -bottom-3 -right-3 text-3xl" style={{ filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.2))' }}>
          {sticker}
        </div>
      </div>
    </ScrapbookReveal>
  );
}

function ScrapbookGalleryItem({ item, index }: { item: GalleryItem; index: number }) {
  const rotations = ['-rotate-2', 'rotate-1', '-rotate-1', 'rotate-2', 'rotate-0', '-rotate-3'];
  const rot = rotations[index % rotations.length];

  return (
    <ScrapbookReveal delay={(index % 6) * 0.08}>
      <div className={`bg-white p-3 pb-10 shadow-lg ${rot} hover:rotate-0 hover:scale-105 transition-all duration-300 cursor-pointer`}
        style={{ boxShadow: '3px 3px 15px rgba(180,140,80,0.2)' }}>
        <div className="relative aspect-square overflow-hidden">
          <Image src={item.mediaUrl} alt={item.caption || ''} fill className="object-cover" />
        </div>
        {item.caption && (
          <p className="text-center font-script text-sm mt-3" style={{ color: '#9a6b4b' }}>
            {item.caption}
          </p>
        )}
        {/* Tape */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-4 opacity-40 rounded-sm"
          style={{ background: 'rgba(212,168,121,0.7)' }} />
      </div>
    </ScrapbookReveal>
  );
}

function ScrapbookReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, rotate: -1 }}
      animate={inView ? { opacity: 1, y: 0, rotate: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
