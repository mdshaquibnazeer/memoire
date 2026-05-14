'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
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
  startDate: string | null;
  coverImageUrl: string | null;
  heroConfig: any;
  endingConfig: any;
  memories: Memory[];
  galleryItems: GalleryItem[];
}

export default function CinematicMemoriesTheme({ project }: { project: Project }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);

  return (
    <main className="min-h-screen overflow-hidden" style={{ background: '#080808', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>

      {/* ── CINEMATIC HERO ── */}
      <section ref={heroRef} className="relative h-screen overflow-hidden flex items-end">
        {project.coverImageUrl && (
          <motion.div style={{ y }} className="absolute inset-0">
            <Image src={project.coverImageUrl} alt="Cover" fill className="object-cover" priority />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(0deg, rgba(8,8,8,1) 0%, rgba(8,8,8,0.3) 40%, rgba(8,8,8,0.2) 70%, rgba(8,8,8,0.6) 100%)' }} />
            {/* Film grain overlay */}
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
              mixBlendMode: 'overlay',
            }} />
          </motion.div>
        )}

        {/* Film strip borders */}
        <div className="absolute top-0 left-0 right-0 h-12 flex items-center px-2 gap-1" style={{ background: 'rgba(0,0,0,0.8)' }}>
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="w-4 h-7 bg-white/10 rounded-sm flex-shrink-0" />
          ))}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 flex items-center px-2 gap-1" style={{ background: 'rgba(0,0,0,0.8)' }}>
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="w-4 h-7 bg-white/10 rounded-sm flex-shrink-0" />
          ))}
        </div>

        <div className="relative z-10 pb-24 px-10 max-w-4xl">
          {project.occasion && (
            <motion.p
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="text-sm uppercase tracking-[0.5em] mb-4"
              style={{ color: '#d4a654' }}
            >
              {project.occasion}
            </motion.p>
          )}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="font-bold leading-none mb-4"
            style={{
              fontFamily: "'Libre Baskerville', Georgia, serif",
              fontSize: 'clamp(3.5rem, 9vw, 7rem)',
              color: '#f5f0e8',
              textShadow: '2px 2px 30px rgba(0,0,0,0.8)',
            }}
          >
            {project.title}
          </motion.h1>
          {project.subtitle && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
              className="text-xl font-light"
              style={{ color: 'rgba(245,240,232,0.6)', fontStyle: 'italic' }}
            >
              {project.subtitle}
            </motion.p>
          )}
        </div>
      </section>

      {/* ── CHAPTER DIVIDER ── */}
      <div className="py-10 flex items-center gap-6 px-10">
        <div className="flex-1 h-px" style={{ background: 'rgba(212,166,84,0.2)' }} />
        <p className="text-xs uppercase tracking-[0.6em]" style={{ color: '#d4a654', fontFamily: 'sans-serif' }}>Chapter I</p>
        <div className="flex-1 h-px" style={{ background: 'rgba(212,166,84,0.2)' }} />
      </div>

      {/* ── OPENING MESSAGE ── */}
      {project.heroConfig?.message && (
        <CinematicReveal>
          <section className="py-20 px-10 max-w-3xl mx-auto">
            <p className="text-2xl md:text-3xl leading-loose font-light"
              style={{ color: 'rgba(245,240,232,0.7)', fontStyle: 'italic', lineHeight: 1.9 }}>
              {project.heroConfig.message}
            </p>
          </section>
        </CinematicReveal>
      )}

      {/* ── TIMELINE ── */}
      {project.memories.length > 0 && (
        <section className="py-20">
          <div className="px-10 mb-12">
            <div className="flex items-center gap-6">
              <div className="flex-1 h-px" style={{ background: 'rgba(212,166,84,0.2)' }} />
              <p className="text-xs uppercase tracking-[0.6em]" style={{ color: '#d4a654', fontFamily: 'sans-serif' }}>Chapter II — The Story</p>
              <div className="flex-1 h-px" style={{ background: 'rgba(212,166,84,0.2)' }} />
            </div>
          </div>

          <div className="space-y-1">
            {project.memories.map((memory, i) => (
              <CinematicMemoryItem key={memory.id} memory={memory} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* ── GALLERY ── */}
      {project.galleryItems.length > 0 && (
        <section className="py-20">
          <div className="px-10 mb-12">
            <div className="flex items-center gap-6">
              <div className="flex-1 h-px" style={{ background: 'rgba(212,166,84,0.2)' }} />
              <p className="text-xs uppercase tracking-[0.6em]" style={{ color: '#d4a654', fontFamily: 'sans-serif' }}>Chapter III — Gallery</p>
              <div className="flex-1 h-px" style={{ background: 'rgba(212,166,84,0.2)' }} />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 px-2">
            {project.galleryItems.map((item, i) => (
              <CinematicGalleryItem key={item.id} item={item} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* ── ENDING ── */}
      <section className="py-36 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(212,166,84,0.05) 0%, transparent 70%)' }} />
        <div className="text-center px-10 relative z-10">
          <CinematicReveal>
            <p className="text-xs uppercase tracking-[0.8em] mb-6" style={{ color: '#d4a654', fontFamily: 'sans-serif' }}>
              The End
            </p>
            <h2 className="font-bold mb-8" style={{
              fontFamily: "'Libre Baskerville', Georgia, serif",
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              color: '#f5f0e8',
            }}>
              {project.endingConfig?.title || 'Always & Forever'}
            </h2>
            {project.endingConfig?.message && (
              <p className="text-xl font-light max-w-xl mx-auto" style={{ color: 'rgba(245,240,232,0.5)', fontStyle: 'italic' }}>
                {project.endingConfig.message}
              </p>
            )}
            <div className="mt-12 text-xs uppercase tracking-[0.5em]" style={{ color: 'rgba(212,166,84,0.3)', fontFamily: 'sans-serif' }}>
              — Made with Mémoire —
            </div>
          </CinematicReveal>
        </div>
      </section>
    </main>
  );
}

function CinematicMemoryItem({ memory, index }: { memory: Memory; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 1, delay: 0.1 }}
      className="group flex flex-col md:flex-row overflow-hidden"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
    >
      {memory.imageUrl && (
        <motion.div
          initial={{ scale: 1.1 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ duration: 1.2 }}
          className="relative w-full md:w-64 h-52 flex-shrink-0 overflow-hidden"
        >
          <Image src={memory.imageUrl} alt={memory.title} fill className="object-cover group-hover:scale-110 transition-transform duration-1000 saturate-50 group-hover:saturate-100" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, transparent 60%, #080808 100%)' }} />
        </motion.div>
      )}

      <div className="p-8 flex flex-col justify-center">
        <p className="text-xs uppercase tracking-[0.4em] mb-3" style={{ color: '#d4a654', fontFamily: 'sans-serif' }}>
          {new Date(memory.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          {memory.location && ` · ${memory.location}`}
        </p>
        <h3 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: '#f5f0e8', fontFamily: "'Libre Baskerville', Georgia, serif" }}>
          {memory.emoji && <span className="mr-2">{memory.emoji}</span>}
          {memory.title}
        </h3>
        {memory.description && (
          <p className="text-base font-light leading-relaxed" style={{ color: 'rgba(245,240,232,0.5)', fontStyle: 'italic' }}>
            {memory.description}
          </p>
        )}
      </div>
    </motion.div>
  );
}

function CinematicGalleryItem({ item, index }: { item: GalleryItem; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-30px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8, delay: (index % 8) * 0.05 }}
      className="relative aspect-square overflow-hidden group cursor-pointer"
    >
      <Image src={item.mediaUrl} alt={item.caption || ''} fill
        className="object-cover saturate-0 group-hover:saturate-100 scale-105 group-hover:scale-100 transition-all duration-700" />
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/0 transition-colors duration-500" />
    </motion.div>
  );
}

function CinematicReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.1, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
