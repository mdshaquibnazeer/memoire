'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ChevronRight, ChevronLeft, Sparkles, Wand2 } from 'lucide-react';
import { projectsAPI } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

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
  {
    id: 'SWEET_DIARY',
    name: 'Sweet Diary Box',
    desc: 'Pink kawaii diary with passcode lock, gift box menu, love letter & jar of reasons',
    preview: '🎁',
    gradient: 'from-pink-300 via-pink-400 to-rose-400',
    accent: '#ff8da1',
  },
  {
    id: 'VELVET_ROMANCE',
    name: 'Velvet Romance',
    desc: 'Deep crimson & liquid gold theme with rose petal rain, golden vows and animated promise wall',
    preview: '🌹',
    gradient: 'from-rose-950 via-red-900 to-noir-dark',
    accent: '#f5c842',
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

function CreateProjectContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState('SCRAPBOOK_LOVE');
  const [loading, setLoading] = useState(false);
  const [existingProjects, setExistingProjects] = useState<any[]>([]);
  const [sourceProjectId, setSourceProjectId] = useState<string>('');
  const [loadingSource, setLoadingSource] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CreateForm>();
  const watchedNames = watch(['personOneName', 'personTwoName', 'occasion']);

  const isAuthorized = (themeId: string) => {
    if (!user) return false;
    if (user.role === 'ADMIN') return true;
    return user.allowedTemplates?.includes(themeId);
  };

  const handleThemeSelect = (themeId: string) => {
    if (isAuthorized(themeId)) {
      setSelectedTheme(themeId);
    } else {
      toast.error('Contact admin to authorise you for this template.');
    }
  };

  // Load existing projects for cloning
  useEffect(() => {
    async function loadProjects() {
      try {
        const { data } = await projectsAPI.list({ limit: 50 });
        if (data?.projects) {
          const userProjs = data.projects.filter((p: any) => !p.id.startsWith('demo-'));
          setExistingProjects(userProjs);
        }
      } catch (err) {
        console.error('Failed to load projects for cloning', err);
      }
    }
    loadProjects();
  }, []);

  // Handle URL query parameters (e.g. ?cloneFrom=... or ?theme=...)
  useEffect(() => {
    const themeParam = searchParams.get('theme');
    if (themeParam && THEMES.some(t => t.id === themeParam)) {
      setSelectedTheme(themeParam);
    }

    const cloneParam = searchParams.get('cloneFrom');
    if (cloneParam) {
      handleSelectSourceProject(cloneParam);
    }
  }, [searchParams]);

  const handleSelectSourceProject = async (projId: string) => {
    setSourceProjectId(projId);
    if (!projId) return;

    setLoadingSource(true);
    try {
      const { data } = await projectsAPI.get(projId);
      const proj = data?.project;
      if (proj) {
        if (proj.title) setValue('title', proj.title);
        if (proj.subtitle) setValue('subtitle', proj.subtitle);
        if (proj.personOneName) setValue('personOneName', proj.personOneName);
        if (proj.personTwoName) setValue('personTwoName', proj.personTwoName);
        if (proj.occasion) setValue('occasion', proj.occasion);
        if (proj.startDate) {
          try {
            const d = new Date(proj.startDate).toISOString().split('T')[0];
            setValue('startDate', d);
          } catch (e) {}
        }
        toast.success(`Loaded details from "${proj.title}"! All memories, photos, letter & vows will be copied.`);
      }
    } catch (err) {
      toast.error('Failed to load project details for cloning.');
    } finally {
      setLoadingSource(false);
    }
  };

  const steps = ['Choose Theme', 'Name Your Story', 'Review & Create'];

  const onSubmit = async (data: CreateForm) => {
    setLoading(true);
    try {
      const { data: project } = await projectsAPI.create({
        ...data,
        theme: selectedTheme,
        sourceProjectId: sourceProjectId || undefined,
      });
      toast.success(sourceProjectId ? 'Memory cloned into new theme ✨' : 'Memory created! Start building your story ✨');
      router.push(`/dashboard/edit/${project.project.id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to create project');
      setLoading(false);
    }
  };

  const selectedSourceProject = existingProjects.find(p => p.id === sourceProjectId);

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 sm:mb-10">
        <p className="font-script text-lg sm:text-xl text-rose-deep mb-1">new creation</p>
        <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-rose-cream">
          {sourceProjectId ? 'Switch Theme / Clone Story' : 'Tell Your Story'}
        </h1>
      </motion.div>

      {/* Step indicators */}
      <div className="flex items-center gap-2 sm:gap-3 mb-8 sm:mb-10 overflow-x-auto pb-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-sans transition-all duration-300 flex-shrink-0 ${
              i === step ? 'text-noir-midnight font-bold' : i < step ? 'bg-white/10 text-rose-cream/60' : 'bg-white/5 text-rose-cream/30'
            }`}
              style={i === step ? { background: 'linear-gradient(135deg, #e8c4b8, #c4a882)' } : {}}>
              {i < step ? '✓' : i + 1}
            </div>
            <span className={`font-sans text-xs sm:text-sm hidden sm:inline ${i === step ? 'text-rose-cream' : 'text-rose-cream/30'}`}>{s}</span>
            {i < steps.length - 1 && <div className="w-4 sm:w-8 h-px bg-white/10" />}
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
                {THEMES.map((theme) => {
                  const authorized = isAuthorized(theme.id);
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => handleThemeSelect(theme.id)}
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
                        opacity: authorized ? 1 : 0.65,
                      }}
                    >
                      <div className="flex items-center gap-5 w-full">
                        <span className="text-4xl">{theme.preview}</span>
                        <div className="flex-1">
                          <h3 className="font-serif text-xl font-semibold mb-1" style={{
                            color: selectedTheme === theme.id ? theme.accent : '#f0e6d3',
                          }}>
                            {theme.name}
                          </h3>
                          <p className="text-rose-cream/40 font-sans text-sm">{theme.desc}</p>
                        </div>
                        {selectedTheme === theme.id && (
                          <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ background: theme.accent }}>
                            <span className="text-noir-midnight text-xs font-bold">✓</span>
                          </div>
                        )}
                        {!authorized && selectedTheme !== theme.id && (
                          <span className="text-xs font-sans px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center gap-1 flex-shrink-0">
                            🔒 Locked
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 1: Name Your Story */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              className="space-y-6">
              <h2 className="font-serif text-2xl text-rose-cream mb-6">Tell us about your story</h2>

              {/* CLONE / IMPORT OPTION */}
              {existingProjects.length > 0 && (
                <div className="p-5 rounded-2xl border border-rose-500/30 bg-rose-950/30 backdrop-blur-md relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-center gap-2 mb-1.5">
                    <Wand2 size={18} className="text-rose-400" />
                    <label className="text-sm font-serif font-semibold text-rose-cream">
                      Reuse content from a previous memory?
                    </label>
                  </div>
                  <p className="text-xs text-rose-cream/60 mb-3 font-sans">
                    Automatically copy your love letter, promise wall vows, secret video, photos, and music to this new theme.
                  </p>
                  <select
                    value={sourceProjectId}
                    onChange={(e) => handleSelectSourceProject(e.target.value)}
                    disabled={loadingSource}
                    className="input-romantic bg-noir-midnight/90 border-white/20 text-rose-cream text-sm w-full cursor-pointer py-2.5 px-3 rounded-xl focus:border-rose-400"
                  >
                    <option value="">✨ Start fresh (create blank memory)</option>
                    {existingProjects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({p.theme.replace(/_/g, ' ')})
                      </option>
                    ))}
                  </select>
                  {loadingSource && (
                    <p className="text-xs text-rose-300 animate-pulse mt-2 font-sans flex items-center gap-1.5">
                      <Sparkles size={12} /> Loading memories and content from selected project...
                    </p>
                  )}
                </div>
              )}

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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      {selectedSourceProject && (
                        <div className="pt-2 border-t border-white/10">
                          <ReviewRow label="Cloning Content From" value={`${selectedSourceProject.title} (${selectedSourceProject.theme.replace(/_/g, ' ')})`} />
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>

              {selectedSourceProject && (
                <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs font-sans flex items-start gap-2.5">
                  <Sparkles size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-0.5">Content Cloning Active</span>
                    All personal letter messages, promise cards, custom passwords, secret videos, photos, and music from <strong>{selectedSourceProject.title}</strong> will be seamlessly transferred to your new <strong>{THEMES.find(t => t.id === selectedTheme)?.name}</strong> memory!
                  </div>
                </div>
              )}

              <div className="mt-6 glass-card p-5 flex items-start gap-3">
                <Sparkles size={18} className="text-rose-deep mt-0.5 flex-shrink-0" />
                <p className="text-rose-cream/50 font-sans text-sm">
                  After creating your project, you'll be taken to the editor where you can customize
                  photos, memories, music, messages, and publish your memory website.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 sm:mt-10">
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
              <span>{loading ? 'Creating...' : (sourceProjectId ? 'Clone & Create Memory ✨' : 'Create My Memory ✨')}</span>
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

export default function CreateProjectPage() {
  return (
    <Suspense fallback={<div className="max-w-3xl mx-auto text-rose-cream/40 p-10 font-sans text-center">Loading creator...</div>}>
      <CreateProjectContent />
    </Suspense>
  );
}
