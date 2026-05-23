'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
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

export default function AuroraDreamsTheme({ project }: { project: Project }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const coverY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const coverOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.3]);

  const names = [project.personOneName, project.personTwoName].filter(Boolean).join(' & ');

  return (
    <main className="min-h-screen overflow-hidden" style={{ background: '#0a0e27' }}>
      {/* Animated aurora background */}
      <AuroraBackground />

      {/* ── HERO SECTION ── */}
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
            <div className="absolute inset-0" style={{
              background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.2) 0%, transparent 60%)'
            }} />
          </motion.div>
        ) : (
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(ellipse at 50% 50%, rgba(139,92,246,0.15) 0%, transparent 70%)'
          }} />
        )}

        {/* Hero content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          {project.occasion && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="font-sans text-xl tracking-[0.3em] uppercase text-purple-300/70 mb-6"
            >
              {project.occasion}
            </motion.p>
          )}

          <motion.h1
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1, ease: 'easeOut' }}
            className="font-serif font-bold leading-tight mb-6"
            style={{
              fontSize: 'clamp(3rem, 8vw, 7rem)',
              background: 'linear-gradient(135deg, #c4b5fd, #8b5cf6, #6d28d9, #c4b5fd)',
              backgroundSize: '400% 400%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'gradientShift 8s ease infinite'
            }}
          >
            {project.title}
          </motion.h1>

          {names && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="font-sans text-lg text-purple-200/60 mb-6 tracking-[0.15em] uppercase"
            >
              {names}
            </motion.p>
          )}

          {project.subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.8 }}
              className="font-serif text-2xl text-purple-300/70 italic leading-relaxed"
            >
              {project.subtitle}
            </motion.p>
          )}

          {/* Glowing scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2, duration: 1 }}
            className="mt-20"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="text-purple-400/40 text-2xl"
            >
              ↓
            </motion.div>
          </motion.div>
        </div>

        {/* Vignette */}
        <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
          style={{ background: 'linear-gradient(0deg, #0a0e27 0%, transparent 100%)' }} />
      </section>

      {/* ── OPENING MESSAGE ── */}
      {project.heroConfig?.message && (
        <RevealSection>
          <section className="py-32 px-6 relative z-10">
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                {/* Glowing border effect */}
                <div className="absolute -inset-1 rounded-2xl opacity-25" style={{
                  background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                  filter: 'blur(20px)'
                }} />
                
                <div className="relative bg-purple-950/30 backdrop-blur-md border border-purple-400/20 rounded-2xl p-12">
                  <p className="font-serif text-3xl md:text-4xl leading-relaxed text-center"
                    style={{ color: '#c4b5fd', lineHeight: 2 }}>
                    {project.heroConfig.message}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </RevealSection>
      )}

      {/* ── TIMELINE ── */}
      {project.memories.length > 0 && (
        <section className="py-32 px-6 relative z-10">
          <RevealSection>
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-20">
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="font-sans text-sm tracking-[0.3em] uppercase text-purple-400/60 mb-4"
                >
                  Our Moments
                </motion.p>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="font-serif text-5xl md:text-6xl font-bold"
                  style={{
                    background: 'linear-gradient(135deg, #c4b5fd, #8b5cf6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  Memories in Time
                </motion.h2>
              </div>

              <div className="relative">
                {/* Glowing timeline line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 hidden md:block"
                  style={{
                    background: 'linear-gradient(180deg, transparent, rgba(139,92,246,0.4), transparent)',
                    filter: 'drop-shadow(0 0 10px rgba(139,92,246,0.5))'
                  }} />

                <div className="space-y-24">
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
        <section className="py-32 px-6 relative z-10">
          <RevealSection>
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-20">
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="font-sans text-sm tracking-[0.3em] uppercase text-purple-400/60 mb-4"
                >
                  Visual Stories
                </motion.p>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="font-serif text-5xl md:text-6xl font-bold"
                  style={{
                    background: 'linear-gradient(135deg, #c4b5fd, #8b5cf6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  Gallery
                </motion.h2>
              </div>
              <MasonryGallery items={project.galleryItems} />
            </div>
          </RevealSection>
        </section>
      )}

      {/* ── ENDING ── */}
      <section className="py-40 px-6 relative z-10">
        <div className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center bottom, rgba(139,92,246,0.15) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <RevealSection>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 100 }}
              className="mb-8 text-6xl"
            >
              ✨
            </motion.div>
            <h2 className="font-serif text-5xl md:text-6xl font-bold mb-8"
              style={{
                background: 'linear-gradient(135deg, #c4b5fd, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
              {project.endingConfig?.title || 'Forever in Our Hearts'}
            </h2>
            {project.endingConfig?.message && (
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="font-serif text-xl md:text-2xl text-purple-300/80 leading-relaxed"
              >
                {project.endingConfig.message}
              </motion.p>
            )}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="mt-12 flex items-center justify-center gap-4 text-purple-400/30 text-xs font-sans tracking-widest uppercase"
            >
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent" />
              <span>Made with Mémoire</span>
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent" />
            </motion.div>
          </RevealSection>
        </div>
      </section>

      {/* Global styles for animations */}
      <style>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes aurora {
          0%, 100% { transform: translateX(-50%); }
          50% { transform: translateX(50%); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </main>
  );
}

// ── AURORA BACKGROUND ──
function AuroraBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 80% 80% at 50% 20%, rgba(139,92,246,0.15) 0%, transparent 50%)',
      }} />
      <motion.div
        animate={{
          x: [-100, 100, -100],
          y: [-50, 50, -50],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-96 h-96 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(167,139,250,0.1) 0%, transparent 70%)',
          filter: 'blur(40px)',
          top: '10%',
          left: '10%'
        }}
      />
      <motion.div
        animate={{
          x: [100, -100, 100],
          y: [100, -100, 100],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-96 h-96 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(124,58,202,0.08) 0%, transparent 70%)',
          filter: 'blur(40px)',
          bottom: '10%',
          right: '10%'
        }}
      />
    </div>
  );
}

// ── TIMELINE ITEM ──
function TimelineItem({ memory, index }: { memory: Memory; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
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
        <div className="relative group">
          {/* Glow effect */}
          <div className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
              filter: 'blur(15px)'
            }} />
          
          <div className="relative bg-purple-950/40 backdrop-blur-md border border-purple-400/20 rounded-2xl p-8 hover:border-purple-400/40 transition-all duration-300">
            {memory.imageUrl && (
              <div className="relative w-full h-56 rounded-xl overflow-hidden mb-6">
                <Image
                  src={memory.imageUrl}
                  alt={memory.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            )}
            <div className="flex items-start gap-3">
              {memory.emoji && <span className="text-3xl mt-0.5">{memory.emoji}</span>}
              <div>
                <h3 className="font-serif text-2xl font-semibold text-purple-100 mb-2">{memory.title}</h3>
                {memory.description && (
                  <p className="text-purple-200/60 font-sans text-sm leading-relaxed mb-3">{memory.description}</p>
                )}
                <div className="flex items-center gap-3 text-xs font-sans text-purple-300/40">
                  <span>{new Date(memory.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  {memory.location && <><span>·</span><span>📍 {memory.location}</span></>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Center dot with glow */}
      <div className="hidden md:flex flex-col items-center pt-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
          className="w-5 h-5 rounded-full border-2 border-purple-400"
          style={{
            background: '#8b5cf6',
            boxShadow: '0 0 20px rgba(139,92,246,0.8), inset 0 0 10px rgba(196,181,253,0.4)'
          }}
        />
      </div>

      <div className="flex-1 hidden md:block" />
    </motion.div>
  );
}

// ── MASONRY GALLERY ──
function MasonryGallery({ items }: { items: GalleryItem[] }) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {items.map((item, i) => (
          <GalleryItemCard
            key={item.id}
            item={item}
            index={i}
            onClick={() => setLightboxSrc(item.mediaUrl)}
          />
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxSrc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxSrc(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 cursor-pointer p-6 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="relative max-w-5xl max-h-[90vh] w-full"
              onClick={e => e.stopPropagation()}
            >
              <Image
                src={lightboxSrc}
                alt=""
                width={1200}
                height={800}
                className="object-contain w-full h-full max-h-[85vh] rounded-2xl"
              />
              <button
                onClick={() => setLightboxSrc(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-purple-500/20 text-purple-300 hover:bg-purple-500/40 transition-colors flex items-center justify-center text-xl border border-purple-400/20"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
      className="break-inside-avoid mb-6 group relative cursor-pointer overflow-hidden rounded-2xl"
      onClick={onClick}
    >
      <div className="relative overflow-hidden rounded-2xl">
        {/* Glow border */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
            padding: '1px'
          }}
        />
        
        <Image
          src={item.mediaUrl}
          alt={item.caption || ''}
          width={600}
          height={400}
          className="w-full object-cover group-hover:scale-110 transition-transform duration-700"
          style={{ aspectRatio: index % 3 === 0 ? '4/5' : index % 3 === 1 ? '1/1' : '4/3' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {item.caption && (
          <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <p className="text-purple-100 font-sans text-sm">{item.caption}</p>
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
