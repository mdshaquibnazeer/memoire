'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import Image from 'next/image';
import FloatingParticles from '@/components/animations/FloatingParticles';

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

export default function RomanticGlowTheme({ project }: { project: Project }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const coverY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const coverOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);

  const names = [project.personOneName, project.personTwoName].filter(Boolean).join(' & ');
  const yearsText = project.startDate
    ? (() => {
        const diff = Date.now() - new Date(project.startDate).getTime();
        const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        return years >= 1 ? `${years} year${years > 1 ? 's' : ''} together` : `${days} days together`;
      })()
    : null;

  return (
    <main className="min-h-screen overflow-hidden" style={{ background: '#0d0614' }}>
      <FloatingParticles />

      {/* ── HERO ── */}
      <section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Cover image with parallax */}
        {project.coverImageUrl ? (
          <motion.div style={{ y: coverY, opacity: coverOpacity }} className="absolute inset-0">
            <Image
              src={project.coverImageUrl}
              alt="Cover"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 cinematic-overlay" />
            <div className="absolute inset-0"
              style={{ background: 'radial-gradient(ellipse at center, rgba(232,196,184,0.08) 0%, transparent 60%)' }} />
          </motion.div>
        ) : (
          <div className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(45,22,80,0.9) 0%, #0d0614 70%)' }} />
        )}

        {/* Hero content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          {project.occasion && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-script text-2xl text-rose-deep mb-4 tracking-wider"
            >
              {project.occasion}
            </motion.p>
          )}

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 1, ease: 'easeOut' }}
            className="font-serif font-bold leading-tight mb-6"
            style={{
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              background: 'linear-gradient(135deg, #f0e6d3, #e8c4b8, #c4a882)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: 'none',
            }}
          >
            {project.title}
          </motion.h1>

          {names && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="font-sans text-xl text-rose-cream/70 mb-4 tracking-[0.2em] uppercase"
            >
              {names}
            </motion.p>
          )}

          {project.subtitle && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
              className="font-script text-xl text-rose-deep/80"
            >
              {project.subtitle}
            </motion.p>
          )}

          {yearsText && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 }}
              className="mt-8 inline-block px-6 py-2 rounded-full text-sm font-sans tracking-widest uppercase"
              style={{
                border: '1px solid rgba(232,196,184,0.25)',
                color: 'rgba(232,196,184,0.6)',
                backdropFilter: 'blur(8px)',
                background: 'rgba(255,255,255,0.03)',
              }}
            >
              {yearsText}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2 }}
            className="mt-16"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="text-rose-cream/20 text-2xl"
            >
              ↓
            </motion.div>
          </motion.div>
        </div>

        {/* Vignette */}
        <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
          style={{ background: 'linear-gradient(0deg, #0d0614 0%, transparent 100%)' }} />
      </section>

      {/* ── OPENING MESSAGE ── */}
      {project.heroConfig?.message && (
        <RevealSection>
          <section className="py-28 px-6">
            <div className="max-w-2xl mx-auto text-center">
              <div className="relative">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-5xl opacity-20 font-serif text-rose-blush">"</div>
                <p className="font-script text-3xl md:text-4xl leading-relaxed"
                  style={{ color: '#e8c4b8', lineHeight: 1.8 }}>
                  {project.heroConfig.message}
                </p>
                <div className="absolute -bottom-8 right-1/4 text-5xl opacity-20 font-serif text-rose-blush">"</div>
              </div>
            </div>
          </section>
        </RevealSection>
      )}

      {/* ── TIMELINE ── */}
      {project.memories.length > 0 && (
        <section className="py-24 px-6">
          <RevealSection>
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <p className="font-script text-2xl text-rose-deep mb-2">our journey</p>
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-gradient">
                  Moments We'll Never Forget
                </h2>
              </div>

              <div className="relative">
                {/* Center line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block"
                  style={{ background: 'linear-gradient(180deg, transparent, rgba(232,196,184,0.3), transparent)' }} />

                <div className="space-y-16">
                  {project.memories.map((memory, i) => (
                    <TimelineItem key={memory.id} memory={memory} index={i} />
                  ))}
                </div>
              </div>
            </div>
          </RevealSection>
        </section>
      )}

      {/* ── GALLERY ── */}
      {project.galleryItems.length > 0 && (
        <section className="py-24 px-6">
          <RevealSection>
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <p className="font-script text-2xl text-rose-deep mb-2">captured in time</p>
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-gradient">
                  Our Gallery
                </h2>
              </div>
              <MasonryGallery items={project.galleryItems} />
            </div>
          </RevealSection>
        </section>
      )}

      {/* ── ENDING ── */}
      <section className="py-36 px-6 relative">
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center bottom, rgba(45,22,80,0.4) 0%, transparent 70%)' }} />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <RevealSection>
            <div className="mb-6 text-5xl">🌹</div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-gradient mb-6">
              {project.endingConfig?.title || 'Forever Yours'}
            </h2>
            {project.endingConfig?.message && (
              <p className="font-script text-2xl text-rose-deep/80 leading-relaxed">
                {project.endingConfig.message}
              </p>
            )}
            <div className="mt-10 flex items-center justify-center gap-3 text-rose-cream/20 text-sm font-sans tracking-widest uppercase">
              <div className="w-12 h-px bg-rose-cream/10" />
              <span>Made with Mémoire</span>
              <div className="w-12 h-px bg-rose-cream/10" />
            </div>
          </RevealSection>
        </div>
      </section>
    </main>
  );
}

// ── TIMELINE ITEM ──
function TimelineItem({ memory, index }: { memory: Memory; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const isLeft = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={`flex items-start gap-8 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col`}
    >
      {/* Content */}
      <div className="flex-1">
        <div className="glass-card p-6 relative group hover:border-rose-blush/20 transition-all duration-300">
          {memory.imageUrl && (
            <div className="relative w-full h-48 rounded-xl overflow-hidden mb-5">
              <Image src={memory.imageUrl} alt={memory.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          )}
          <div className="flex items-start gap-3">
            {memory.emoji && <span className="text-2xl mt-0.5">{memory.emoji}</span>}
            <div>
              <h3 className="font-serif text-xl font-semibold text-rose-cream mb-1">{memory.title}</h3>
              {memory.description && (
                <p className="text-rose-cream/50 font-sans text-sm leading-relaxed">{memory.description}</p>
              )}
              <div className="flex items-center gap-3 mt-3 text-xs font-sans text-rose-cream/30">
                <span>{new Date(memory.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                {memory.location && <><span>·</span><span>📍 {memory.location}</span></>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Center dot */}
      <div className="hidden md:flex flex-col items-center pt-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ delay: 0.3, type: 'spring' }}
          className="w-4 h-4 rounded-full border-2 border-rose-blush"
          style={{ background: '#e8c4b8', boxShadow: '0 0 12px rgba(232,196,184,0.5)' }}
        />
      </div>

      {/* Spacer for alternating layout */}
      <div className="flex-1 hidden md:block" />
    </motion.div>
  );
}

// ── MASONRY GALLERY ──
function MasonryGallery({ items }: { items: GalleryItem[] }) {
  const [lightboxMedia, setLightboxMedia] = useState<GalleryItem | null>(null);

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {items.map((item, i) => (
          <GalleryItemCard key={item.id} item={item} index={i} onClick={() => setLightboxMedia(item)} />
        ))}
      </div>

      {/* Lightbox */}
      {lightboxMedia && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setLightboxMedia(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 cursor-pointer p-6"
        >
          <motion.div
            initial={{ scale: 0.85 }}
            animate={{ scale: 1 }}
            className="relative max-w-5xl max-h-[90vh] w-full flex items-center justify-center"
            onClick={e => e.stopPropagation()}
          >
            {lightboxMedia.mediaType === 'VIDEO' ? (
              <video src={lightboxMedia.mediaUrl} controls autoPlay className="object-contain w-full h-full max-h-[85vh] rounded-xl outline-none" />
            ) : (
              <Image src={lightboxMedia.mediaUrl} alt="" width={1200} height={800}
                className="object-contain w-full h-full max-h-[85vh] rounded-xl" />
            )}
            <button
              onClick={() => setLightboxMedia(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors flex items-center justify-center"
            >
              ×
            </button>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}

function GalleryItemCard({ item, index, onClick }: { item: GalleryItem; index: number; onClick: () => void }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: (index % 6) * 0.08 }}
      className="break-inside-avoid mb-4 group relative cursor-pointer overflow-hidden rounded-xl"
      onClick={onClick}
    >
      <div className="relative overflow-hidden rounded-xl bg-black/20">
        {item.mediaType === 'VIDEO' ? (
          <video
            src={item.mediaUrl}
            className="w-full object-cover group-hover:scale-110 transition-transform duration-700 pointer-events-none"
            style={{ aspectRatio: index % 3 === 0 ? '4/5' : index % 3 === 1 ? '1/1' : '4/3' }}
            muted loop playsInline
          />
        ) : (
          <Image
            src={item.mediaUrl}
            alt={item.caption || ''}
            width={600}
            height={400}
            className="w-full object-cover group-hover:scale-110 transition-transform duration-700"
            style={{ aspectRatio: index % 3 === 0 ? '4/5' : index % 3 === 1 ? '1/1' : '4/3' }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {item.caption && (
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <p className="text-white font-sans text-sm">{item.caption}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── REVEAL SECTION ──
function RevealSection({ children }: { children: React.ReactNode }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

// fix missing useState import
import { useState } from 'react';
