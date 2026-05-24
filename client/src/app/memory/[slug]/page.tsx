'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { publicAPI } from '@/lib/api';
import FloatingParticles from '@/components/animations/FloatingParticles';
import RomanticGlowTheme from '@/components/themes/RomanticGlowTheme';
import CinematicMemoriesTheme from '@/components/themes/CinematicMemoriesTheme';
import ScrapbookLoveTheme from '@/components/themes/ScrapbookLoveTheme';
import AuroraDreamsTheme from '@/components/themes/AuroraDreamsTheme';
import CelestialBirthdayTheme from '@/components/themes/CelestialBirthdayTheme';
import MusicPlayer from '@/components/shared/MusicPlayer';

interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  theme: string;
  personOneName: string | null;
  personTwoName: string | null;
  occasion: string | null;
  startDate: string | null;
  coverImageUrl: string | null;
  backgroundMusicUrl: string | null;
  heroConfig: any;
  endingConfig: any;
  memories: Memory[];
  galleryItems: GalleryItem[];
  viewCount: number;
}

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
  width: number | null;
  height: number | null;
}

export default function MemoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requiresPassword, setRequiresPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const fetchProject = async (pw?: string) => {
    try {
      const { data } = await publicAPI.getMemory(slug, pw);
      setProject(data.project);
      setError(null);
      setRequiresPassword(false);
    } catch (err: any) {
      if (err.response?.data?.requiresPassword) {
        setRequiresPassword(true);
      } else if (pw) {
        setPasswordError('Incorrect password');
      } else {
        setError(err.response?.data?.error || 'Memory not found');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProject(); }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-noir-midnight flex items-center justify-center px-4">
        <div className="text-center">
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="font-serif text-3xl sm:text-4xl text-gradient mb-3"
          >
            Mémoire
          </motion.div>
          <p className="font-script text-rose-deep">loading your memory...</p>
        </div>
      </div>
    );
  }

  if (requiresPassword) {
    return (
      <div className="min-h-screen bg-noir-midnight flex items-center justify-center px-4 sm:px-6">
        <FloatingParticles />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-6 sm:p-8 lg:p-10 max-w-sm w-full text-center relative z-10"
        >
          <div className="text-4xl mb-4">🔒</div>
          <h2 className="font-serif text-xl sm:text-2xl text-rose-cream mb-2">Private Memory</h2>
          <p className="text-rose-cream/40 font-sans text-sm mb-5 sm:mb-6">
            This memory is password protected.
          </p>
          <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
            placeholder="Enter password"
            className="input-romantic mb-4"
            onKeyDown={e => e.key === 'Enter' && fetchProject(password)}
          />
          {passwordError && <p className="text-red-400 text-sm mb-3">{passwordError}</p>}
          <button
            onClick={() => fetchProject(password)}
            className="btn-romantic w-full"
          >
            <span>Unlock Memory</span>
          </button>
        </motion.div>
      </div>
    );
  }

  if (error || !project) {
    const isExpired = error?.toLowerCase().includes('expired');
    const isOffline = error?.toLowerCase().includes('offline') || error?.toLowerCase().includes('suspended');

    return (
      <div className="min-h-screen bg-noir-midnight flex items-center justify-center px-6 relative overflow-hidden">
        <FloatingParticles />
        <div className="text-center relative z-10 max-w-md mx-auto p-8 rounded-3xl border border-white/5 bg-noir-deep/40 backdrop-blur-xl">
          {isExpired ? (
            <>
              <div className="text-6xl mb-5 animate-pulse">⏳</div>
              <h2 className="font-serif text-3xl text-rose-cream mb-3 font-semibold">Memory Expired</h2>
              <p className="text-rose-cream/60 font-sans text-sm leading-relaxed">
                This beautiful memory has reached its template expiration period. Contact the memory author or administrator to renew.
              </p>
            </>
          ) : isOffline ? (
            <>
              <div className="text-6xl mb-5 animate-pulse">🛡️</div>
              <h2 className="font-serif text-3xl text-rose-cream mb-3 font-semibold">Temporarily Offline</h2>
              <p className="text-rose-cream/60 font-sans text-sm leading-relaxed">
                This page has been temporarily taken offline by the platform administrator.
              </p>
            </>
          ) : (
            <>
              <div className="text-5xl mb-4">🥀</div>
              <h2 className="font-serif text-3xl text-rose-cream mb-3 font-semibold">Memory Not Found</h2>
              <p className="text-rose-cream/40 font-sans">{error || 'This memory does not exist or is not published.'}</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {(project.backgroundMusicUrl || project.theme === 'CELESTIAL_BIRTHDAY') && (
        <MusicPlayer url={project.backgroundMusicUrl || '/music/celebration.mp3'} />
      )}
      
      {project.theme === 'ROMANTIC_GLOW' && <RomanticGlowTheme project={project} />}
      {project.theme === 'CINEMATIC_MEMORIES' && <CinematicMemoriesTheme project={project} />}
      {project.theme === 'SCRAPBOOK_LOVE' && <ScrapbookLoveTheme project={project} />}
      {project.theme === 'AURORA_DREAMS' && <AuroraDreamsTheme project={project} />}
      {project.theme === 'CELESTIAL_BIRTHDAY' && <CelestialBirthdayTheme project={project} />}
    </>
  );
}
