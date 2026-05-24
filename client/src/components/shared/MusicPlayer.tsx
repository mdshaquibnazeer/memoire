'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Music } from 'lucide-react';

interface MusicPlayerProps {
  url: string;
}

export default function MusicPlayer({ url }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [expanded, setExpanded] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.loop = true;
  }, []);

  useEffect(() => {
    let wasPlayingBeforeTempPause = false;

    const handlePlayEvent = async () => {
      const audio = audioRef.current;
      if (!audio) return;
      setHasInteracted(true);
      try {
        await audio.play();
        setPlaying(true);
      } catch (e) {
        console.log('Autoplay blocked', e);
      }
    };

    const handleTempPause = () => {
      const audio = audioRef.current;
      if (!audio) return;
      wasPlayingBeforeTempPause = !audio.paused;
      if (!audio.paused) {
        audio.pause();
        setPlaying(false);
      }
    };

    const handleTempResume = async () => {
      if (wasPlayingBeforeTempPause) {
        const audio = audioRef.current;
        if (!audio) return;
        try {
          await audio.play();
          setPlaying(true);
        } catch (e) {}
      }
    };

    window.addEventListener('play-ambient-music', handlePlayEvent);
    window.addEventListener('temp-pause-music', handleTempPause);
    window.addEventListener('temp-resume-music', handleTempResume);
    return () => {
      window.removeEventListener('play-ambient-music', handlePlayEvent);
      window.removeEventListener('temp-pause-music', handleTempPause);
      window.removeEventListener('temp-resume-music', handleTempResume);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    setHasInteracted(true);
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      try {
        await audio.play();
        setPlaying(true);
      } catch (e) {
        console.log('Autoplay blocked');
      }
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !muted;
    setMuted(!muted);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  return (
    <>
      <audio ref={audioRef} src={url} preload="metadata" />

      {/* Floating player */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        {/* Hint tooltip */}
        <AnimatePresence>
          {showHint && !hasInteracted && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: 10 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-16 right-0 whitespace-nowrap glass-card px-4 py-2 text-sm font-sans text-rose-cream/70"
            >
              🎵 Play ambient music
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-2">
          {/* Volume control (expanded) */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="glass-card px-4 py-3 flex items-center gap-3 overflow-hidden"
              >
                <button onClick={toggleMute} className="text-rose-cream/60 hover:text-rose-cream transition-colors">
                  {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={handleVolume}
                  className="w-20 accent-rose-blush cursor-pointer"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main player button */}
          <motion.button
            onClick={togglePlay}
            onContextMenu={(e) => { e.preventDefault(); setExpanded(!expanded); }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-12 h-12 rounded-full flex items-center justify-center shadow-romantic"
            style={{
              background: playing
                ? 'linear-gradient(135deg, #e8c4b8, #c4a882)'
                : 'rgba(26,10,46,0.9)',
              border: '1px solid rgba(232,196,184,0.3)',
              backdropFilter: 'blur(12px)',
            }}
            title="Click to play/pause, right-click for volume"
          >
            {/* Pulse when playing */}
            {playing && (
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full"
                style={{ background: 'rgba(232,196,184,0.3)' }}
              />
            )}
            {playing ? (
              <Pause size={18} color={playing ? '#1a0a2e' : '#e8c4b8'} />
            ) : (
              <Music size={18} color="#e8c4b8" />
            )}
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}
