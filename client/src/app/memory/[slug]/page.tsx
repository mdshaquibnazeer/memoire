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
import SweetDiaryTheme from '@/components/themes/SweetDiaryTheme';
import VelvetRomanceTheme from '@/components/themes/VelvetRomanceTheme';
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
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', 'del'];
    const pressKey = (k: string) => {
      if (k === 'del') {
        setPassword(p => p.slice(0, -1));
        return;
      }
      const next = password + k;
      setPassword(next);
      if (next.length >= 4) {
        fetchProject(next);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1c000e] via-[#2d0019] to-[#12000a] flex items-center justify-center px-4 py-8 relative overflow-hidden">
        <FloatingParticles />
        <div className="relative z-10 w-full max-w-[380px]">
          <div
            className="rounded-[48px] p-3 shadow-2xl border border-white/20"
            style={{
              background: 'linear-gradient(145deg, #ffd1dc 0%, #ff9ebb 50%, #f4729f 100%)',
              boxShadow: '0 25px 70px -10px rgba(255, 105, 180, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.6)',
            }}
          >
            <div className="rounded-[40px] overflow-hidden bg-black/40 backdrop-blur-xl p-6 flex flex-col items-center min-h-[640px] justify-between border border-white/10 text-white">
              {/* Dynamic Island / Time */}
              <div className="w-full flex items-center justify-between text-xs text-white/80 font-bold px-2 pt-1">
                <span>9:41</span>
                <div className="w-20 h-4 bg-black/90 rounded-full" />
                <span>5G 🔋</span>
              </div>

              {/* Header Title */}
              <div className="text-center my-4">
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-white/20 border border-white/40 mx-auto mb-2 shadow-sm"
                >
                  🔒
                </motion.div>
                <h2 className="font-serif text-xl font-bold tracking-wide">Private Memory</h2>
                <p className="text-white/80 text-xs font-sans mt-1">Enter 4-digit PIN or password</p>
              </div>

              {/* Password Indicator Dots / Input */}
              <div className="flex flex-col items-center my-2">
                <div className="flex gap-4 mb-3">
                  {[0, 1, 2, 3].map(i => (
                    <div
                      key={i}
                      className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${
                        password.length > i ? 'bg-pink-500 border-white shadow-md' : 'border-white/60 bg-white/20'
                      }`}
                    />
                  ))}
                </div>
                {passwordError && (
                  <p className="text-rose-300 text-xs font-bold bg-rose-950/80 px-3 py-1 rounded-full border border-rose-500/40 animate-pulse">
                    {passwordError}
                  </p>
                )}
              </div>

              {/* Number Keypad */}
              <div className="grid grid-cols-3 gap-2.5 w-full max-w-[260px] p-3 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 mb-2">
                {keys.map(k => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => pressKey(k)}
                    className="flex items-center justify-center h-12 rounded-2xl text-lg font-bold bg-white/80 hover:bg-white text-pink-950 active:bg-pink-200 transition-all cursor-pointer shadow-sm"
                  >
                    {k === 'del' ? '⌫' : k}
                  </button>
                ))}
              </div>

              {/* Manual Submit Button for text passwords */}
              <div className="w-full max-w-[260px]">
                <button
                  type="button"
                  onClick={() => fetchProject(password)}
                  className="w-full py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:scale-[1.02] transition-transform cursor-pointer"
                >
                  Unlock Memory ✨
                </button>
              </div>
            </div>
          </div>
        </div>
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
      {project.theme === 'SWEET_DIARY' && <SweetDiaryTheme project={project} initialUnlocked={!!password} />}
      {project.theme === 'VELVET_ROMANCE' && <VelvetRomanceTheme project={project} />}
    </>
  );
}
