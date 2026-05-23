'use client';

import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import Link from 'next/link';
import FloatingParticles from '@/components/animations/FloatingParticles';
import CinematicText from '@/components/animations/CinematicText';

const themes = [
  {
    id: 'ROMANTIC_GLOW',
    name: 'Romantic Glow',
    description: 'Soft rose light, whispered vows, and golden memories',
    gradient: 'from-rose-wine/30 via-noir-purple/50 to-noir-deep',
    accent: '#e8c4b8',
    preview: '🌹',
  },
  {
    id: 'CINEMATIC_MEMORIES',
    name: 'Cinematic Memories',
    description: 'Film-grain nostalgia, dramatic reveals, and timeless moments',
    gradient: 'from-cinema-warm/40 via-noir-midnight to-cinema-dark',
    accent: '#d4a654',
    preview: '🎞',
  },
  {
    id: 'SCRAPBOOK_LOVE',
    name: 'Scrapbook Love',
    description: 'Handcrafted warmth, cherished keepsakes, and intimate stories',
    gradient: 'from-gold-soft/20 via-noir-deep to-noir-midnight',
    accent: '#d4af7a',
    preview: '📖',
  },
  {
    id: 'AURORA_DREAMS',
    name: 'Aurora Dreams',
    description: 'Mystical, bioluminescent purple aurora effects and glowing parallax timelines',
    gradient: 'from-purple-900/30 via-noir-deep to-noir-midnight',
    accent: '#8b5cf6',
    preview: '✨',
  },
  {
    id: 'CELESTIAL_BIRTHDAY',
    name: 'Celestial Birthday',
    description: 'Interactive 3D cake blowing, wax seal letter surprise, and magical sparkles',
    gradient: 'from-pink-900/30 via-noir-deep to-noir-midnight',
    accent: '#ff69b4',
    preview: '🎂',
  },
];

const features = [
  { icon: '🎬', title: 'Cinematic Themes', desc: 'Three premium visual worlds crafted by designers' },
  { icon: '⏳', title: 'Memory Timeline', desc: 'Animated storytelling that guides hearts through time' },
  { icon: '🖼', title: 'Masonry Gallery', desc: 'Your photos arranged with editorial elegance' },
  { icon: '🎵', title: 'Ambient Music', desc: 'Set the emotional tone with background audio' },
  { icon: '🔒', title: 'Private Memories', desc: 'Password-protect what is meant only for them' },
  { icon: '📅', title: 'Scheduled Launch', desc: 'Reveal your gift at exactly the right moment' },
  { icon: '🤖', title: 'AI Love Messages', desc: 'Claude crafts words when yours fall short' },
  { icon: '📱', title: 'Mobile Beautiful', desc: 'Perfect on every screen, every device' },
];

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <main className="min-h-screen bg-noir-midnight overflow-hidden">
      <FloatingParticles />

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="font-serif text-2xl text-gradient">Mémoire</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-4"
          >
            <Link href="/login" className="btn-ghost text-sm">
              Sign In
            </Link>
            <Link href="/register" className="btn-romantic text-sm">
              <span>Begin Your Story</span>
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* HERO */}
      <section ref={heroRef} className="relative pt-32 pb-16 flex flex-col items-center justify-center">
        {/* Background glow */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #e8c4b8 0%, transparent 70%)' }} />
          <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-5"
            style={{ background: 'radial-gradient(circle, #d4af7a 0%, transparent 70%)' }} />
        </div>

        <motion.div style={{ y, opacity }} className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="font-script text-2xl text-rose-deep mb-6 tracking-widest"
          >
            for the moments that matter most
          </motion.p>

          <CinematicText
            text="Where Memories Become Art"
            className="font-serif text-6xl md:text-8xl font-bold leading-tight mb-8"
            delay={0.7}
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="text-xl md:text-2xl text-rose-cream/60 font-sans font-light mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Craft cinematic, emotionally resonant websites for anniversaries, weddings,
            birthdays, and love stories that deserve more than a photo album.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/register" className="btn-romantic text-lg px-10 py-4">
              <span>Create Your Memory</span>
            </Link>
            <Link href="/demo" className="btn-ghost text-lg px-10 py-4">
              See a Demo
            </Link>
          </motion.div>

        </motion.div>
      </section>

      {/* THEMES SECTION */}
      <section className="py-12 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            eyebrow="Three Worlds"
            title="Choose Your Aesthetic"
            subtitle="Each theme is a complete visual universe with unique animations, typography, and emotional resonance."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {themes.map((theme, i) => (
              <ThemeCard key={theme.id} theme={theme} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            eyebrow="Everything You Need"
            title="Built for Emotion"
            subtitle="Every feature crafted to help you tell the story only you can tell."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {features.map((f, i) => (
              <FeatureCard key={f.title} feature={f} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <RevealSection>
            <div className="glass-card p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-5"
                style={{ background: 'radial-gradient(circle at center, #e8c4b8 0%, transparent 70%)' }} />
              <p className="font-script text-3xl text-rose-blush mb-6 relative z-10">
                "She cried before she even finished reading the first line."
              </p>
              <p className="text-rose-cream/50 font-sans text-sm tracking-widest uppercase relative z-10">
                — Marco, on their 10th anniversary
              </p>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <RevealSection>
            <p className="font-script text-3xl text-rose-deep mb-4">ready to begin?</p>
            <h2 className="font-serif text-5xl md:text-6xl font-bold mb-8">
              <span className="text-gradient">Your Story Awaits</span>
            </h2>
            <p className="text-rose-cream/50 text-xl mb-12 font-sans">
              Free to start. No credit card. Just your memories and a few minutes.
            </p>
            <Link href="/register" className="btn-romantic text-xl px-14 py-5">
              <span>Begin Creating →</span>
            </Link>
          </RevealSection>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-serif text-xl text-gradient">Mémoire</span>
          <p className="text-rose-cream/30 text-sm font-sans">
            © 2025 Mémoire. Made with love, for love.
          </p>
          <div className="flex gap-6 text-rose-cream/40 text-sm font-sans">
            <Link href="/privacy" className="hover:text-rose-blush transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-rose-blush transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

// ============================================
// SECTION COMPONENTS
// ============================================

function SectionHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="text-center"
    >
      <p className="font-script text-xl text-rose-deep mb-4 tracking-wide">{eyebrow}</p>
      <h2 className="font-serif text-5xl md:text-6xl font-bold text-rose-cream mb-6">{title}</h2>
      <p className="text-rose-cream/50 text-xl max-w-2xl mx-auto font-sans">{subtitle}</p>
    </motion.div>
  );
}

function ThemeCard({ theme, index }: { theme: typeof themes[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15, ease: 'easeOut' }}
      className="group glass-card-hover p-8 cursor-pointer"
    >
      <div className="text-5xl mb-6">{theme.preview}</div>
      <h3 className="font-serif text-2xl font-semibold mb-3" style={{ color: theme.accent }}>
        {theme.name}
      </h3>
      <p className="text-rose-cream/50 font-sans leading-relaxed">{theme.description}</p>
      <div className="mt-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="text-sm font-sans" style={{ color: theme.accent }}>Preview theme</span>
        <span style={{ color: theme.accent }}>→</span>
      </div>
    </motion.div>
  );
}

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: 'easeOut' }}
      className="glass-card p-6 hover:border-rose-blush/20 transition-all duration-300"
    >
      <div className="text-3xl mb-4">{feature.icon}</div>
      <h3 className="font-serif text-lg font-semibold text-rose-cream mb-2">{feature.title}</h3>
      <p className="text-rose-cream/40 font-sans text-sm leading-relaxed">{feature.desc}</p>
    </motion.div>
  );
}

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
