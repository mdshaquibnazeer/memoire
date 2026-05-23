'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { projectsAPI, aiAPI } from '@/lib/api';

const THEMES = [
  {
    id: 'ROMANTIC_GLOW',
    name: 'Romantic Glow',
    desc: 'Soft rose light and golden memories',
    preview: '🌹',
    gradient: 'from-rose-wine/30 to-noir-deep',
    accent: '#e8c4b8',
  },
  {
    id: 'CINEMATIC_MEMORIES',
    name: 'Cinematic Memories',
    desc: 'Film-grain nostalgia and dramatic reveals',
    preview: '🎞',
    gradient: 'from-amber-900/30 to-noir-midnight',
    accent: '#d4a654',
  },
  {
    id: 'SCRAPBOOK_LOVE',
    name: 'Scrapbook Love',
    desc: 'Handcrafted warmth and intimate stories',
    preview: '📖',
    gradient: 'from-amber-700/20 to-noir-deep',
    accent: '#d4af7a',
  },
  {
    id: 'AURORA_DREAMS',
    name: 'Aurora Dreams',
    desc: 'Mystical memories with ethereal purple aurora effects',
    preview: '✨',
    gradient: 'from-purple-600 to-purple-900',
    accent: '#8b5cf6',
  },
  {
    id: 'CELESTIAL_BIRTHDAY',
    name: 'Celestial Birthday',
    desc: 'Interactive 3D cake, wax seal letter, and magical sparkles',
    preview: '🎂',
    gradient: 'from-pink-600 via-purple-700 to-purple-900',
    accent: '#ff69b4',
  },
];

const OCCASIONS = [
  'Anniversary', 'Wedding', 'Birthday', 'Proposal',
  'Valentine\'s Day', 'Just Because', 'Graduation', 'Memorial',
];

interface CreateForm {
  title: string;
  subtitle: string;
  personOneName: string;
  personTwoName: string;
  occasion: string;
  startDate: string;
}

export default function CreateProjectPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState('ROMANTIC_GLOW');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<CreateForm>();
  const watchedNames = watch(['personOneName', 'personTwoName', 'occasion']);

  const steps = ['Choose Theme', 'Name Your Story', 'Review & Create'];

  const onSubmit = async (data: CreateForm) => {
    setLoading(true);
    try {
      const { data: project } = await projectsAPI.create({
        ...data,
        theme: selectedTheme,
      });
      toast.success('Memory created! Start building your story ✨');
      router.push(`/dashboard/edit/${project.project.id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to create project');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <p className="font-script text-xl text-rose-deep mb-1">new creation</p>
        <h1 className="font-serif text-4xl font-bold text-rose-cream">Tell Your Story</h1>
      </motion.div>

      {/* Step indicators */}
      <div className="flex items-center gap-3 mb-10">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-sans transition-all duration-300 ${
              i === step ? 'text-noir-midnight font-bold' : i < step ? 'bg-white/10 text-rose-cream/60' : 'bg-white/5 text-rose-cream/30'
            }`}
              style={i === step ? { background: 'linear-gradient(135deg, #e8c4b8, #c4a882)' } : {}}>
              {i < step ? '✓' : i + 1}
            </div>
            <span className={`font-sans text-sm ${i === step ? 'text-rose-cream' : 'text-rose-cream/30'}`}>{s}</span>
            {i < steps.length - 1 && <div className="w-8 h-px bg-white/10" />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <AnimatePresence mode="wait">
          {/* STEP 0: Choose Theme */}
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h2 className="font-serif text-2xl text-rose-cream mb-6">Choose your aesthetic world</h2>
              <div className="grid gap-4">
                {THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setSelectedTheme(theme.id)}
                    className={`text-left p-6 rounded-2xl border transition-all duration-300 ${
                      selectedTheme === theme.id
                        ? 'border-opacity-100'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                    style={{
                      background: selectedTheme === theme.id
                        ? `linear-gradient(135deg, ${theme.accent}15, rgba(26,10,46,0.8))`
                        : 'rgba(255,255,255,0.03)',
                      borderColor: selectedTheme === theme.id ? theme.accent : undefined,
                      boxShadow: selectedTheme === theme.id ? `0 0 30px ${theme.accent}20` : undefined,
                    }}
                  >
                    <div className="flex items-center gap-5">
                      <span className="text-4xl">{theme.preview}</span>
                      <div>
                        <h3 className="font-serif text-xl font-semibold mb-1" style={{
                          color: selectedTheme === theme.id ? theme.accent : '#f0e6d3',
                        }}>
                          {theme.name}
                        </h3>
                        <p className="text-rose-cream/40 font-sans text-sm">{theme.desc}</p>
                      </div>
                      {selectedTheme === theme.id && (
                        <div className="ml-auto w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ background: theme.accent }}>
                          <span className="text-noir-midnight text-xs font-bold">✓</span>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 1: Name Your Story */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              className="space-y-6">
              <h2 className="font-serif text-2xl text-rose-cream mb-6">Tell us about your story</h2>

              <div>
                <label className="block text-rose-cream/60 text-sm font-sans mb-2">Title *</label>
                <input
                  {...register('title', { required: 'Title is required' })}
                  placeholder="Our Love Story · Emma & James · 5 Years"
                  className="input-romantic"
                />
                {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-rose-cream/60 text-sm font-sans mb-2">Subtitle <span className="text-rose-cream/30">(optional)</span></label>
                <input
                  {...register('subtitle')}
                  placeholder="A journey of love, laughter, and lifetime moments"
                  className="input-romantic"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-rose-cream/60 text-sm font-sans mb-2">Name 1</label>
                  <input {...register('personOneName')} placeholder="Emma" className="input-romantic" />
                </div>
                <div>
                  <label className="block text-rose-cream/60 text-sm font-sans mb-2">Name 2 <span className="text-rose-cream/30">(optional)</span></label>
                  <input {...register('personTwoName')} placeholder="James" className="input-romantic" />
                </div>
              </div>

              <div>
                <label className="block text-rose-cream/60 text-sm font-sans mb-2">Occasion</label>
                <div className="flex flex-wrap gap-2">
                  {OCCASIONS.map((occ) => (
                    <label key={occ} className="cursor-pointer">
                      <input type="radio" {...register('occasion')} value={occ} className="sr-only" />
                      <span className="occasion-tag">
                        {occ}
                      </span>
                    </label>
                  ))}
                </div>
                {/* Fallback text input */}
                <input {...register('occasion')} placeholder="Or type your own occasion" className="input-romantic mt-3" />
              </div>

              <div>
                <label className="block text-rose-cream/60 text-sm font-sans mb-2">
                  Start date <span className="text-rose-cream/30">(when did your story begin?)</span>
                </label>
                <input
                  {...register('startDate')}
                  type="date"
                  className="input-romantic"
                  style={{ colorScheme: 'dark' }}
                />
              </div>
            </motion.div>
          )}

          {/* STEP 2: Review */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h2 className="font-serif text-2xl text-rose-cream mb-6">Your story, ready to build</h2>
              <div className="glass-card p-8 space-y-4">
                {(() => {
                  const theme = THEMES.find(t => t.id === selectedTheme)!;
                  const [name1, name2, occasion] = watchedNames;
                  return (
                    <>
                      <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                        <span className="text-3xl">{theme.preview}</span>
                        <div>
                          <p className="font-serif text-lg" style={{ color: theme.accent }}>{theme.name}</p>
                          <p className="text-rose-cream/30 text-sm font-sans">Selected theme</p>
                        </div>
                      </div>
                      <ReviewRow label="Names" value={[name1, name2].filter(Boolean).join(' & ') || '—'} />
                      <ReviewRow label="Occasion" value={occasion || '—'} />
                    </>
                  );
                })()}
              </div>

              <div className="mt-6 glass-card p-5 flex items-start gap-3">
                <Sparkles size={18} className="text-rose-deep mt-0.5 flex-shrink-0" />
                <p className="text-rose-cream/50 font-sans text-sm">
                  After creating your project, you'll be taken to the editor where you can add
                  photos, memories, music, messages, and publish your memory website.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10">
          {step > 0 ? (
            <button type="button" onClick={() => setStep(s => s - 1)} className="btn-ghost flex items-center gap-2">
              <ChevronLeft size={18} /> Back
            </button>
          ) : <div />}

          {step < steps.length - 1 ? (
            <button type="button" onClick={() => setStep(s => s + 1)} className="btn-romantic flex items-center gap-2">
              <span>Continue</span> <ChevronRight size={18} />
            </button>
          ) : (
            <button type="submit" disabled={loading} className="btn-romantic disabled:opacity-50">
              <span>{loading ? 'Creating...' : 'Create My Memory ✨'}</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2">
      <span className="text-rose-cream/40 font-sans text-sm">{label}</span>
      <span className="text-rose-cream font-serif">{value}</span>
    </div>
  );
}
