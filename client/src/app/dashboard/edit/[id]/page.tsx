'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  Save, Globe, Eye, Lock, Unlock, Music, Image, Clock,
  Plus, Trash2, Sparkles, Calendar, ExternalLink, Copy,
} from 'lucide-react';
import { projectsAPI, aiAPI } from '@/lib/api';
import MediaUploader from '@/components/shared/MediaUploader';

type Tab = 'content' | 'gallery' | 'memories' | 'music' | 'settings' | 'wishes';

export default function EditProjectPage() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('content');
  const [aiLoading, setAiLoading] = useState(false);

  // Form state
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    projectsAPI.get(id as string).then(({ data }) => {
      setProject(data.project);
      setForm({
        title: data.project.title || '',
        subtitle: data.project.subtitle || '',
        personOneName: data.project.personOneName || '',
        personTwoName: data.project.personTwoName || '',
        occasion: data.project.occasion || '',
        coverImageUrl: data.project.coverImageUrl || '',
        backgroundMusicUrl: data.project.backgroundMusicUrl || '',
        heroMessage: data.project.heroConfig?.message || '',
        celebrateText: data.project.heroConfig?.celebrateText || '',
        celebrateAgainText: data.project.heroConfig?.celebrateAgainText || '',
        useDifferentCelebrateAgain: data.project.heroConfig?.useDifferentCelebrateAgain || false,
        letterMusicUrl: data.project.heroConfig?.letterMusicUrl || '',
        welcomePopupText: data.project.heroConfig?.welcomePopupText || '',
        disableLetterAutoScroll: data.project.heroConfig?.disableLetterAutoScroll || false,
        disableWordByWord: data.project.heroConfig?.disableWordByWord || false,
        endingTitle: data.project.endingConfig?.title || '',
        endingMessage: data.project.endingConfig?.message || '',
        isPasswordProtected: data.project.isPasswordProtected || false,
        accessPassword: '',
      });
    }).catch(() => {
      toast.error('Project not found');
      router.push('/dashboard');
    }).finally(() => setLoading(false));
  }, [id]);

  const save = async () => {
    setSaving(true);
    try {
      await projectsAPI.update(id as string, {
        title: form.title,
        subtitle: form.subtitle,
        personOneName: form.personOneName,
        personTwoName: form.personTwoName,
        occasion: form.occasion,
        coverImageUrl: form.coverImageUrl,
        backgroundMusicUrl: form.backgroundMusicUrl,
        heroConfig: {
          message: form.heroMessage,
          celebrateText: form.celebrateText,
          celebrateAgainText: form.celebrateAgainText,
          useDifferentCelebrateAgain: form.useDifferentCelebrateAgain,
          letterMusicUrl: form.letterMusicUrl,
          welcomePopupText: form.welcomePopupText,
          disableLetterAutoScroll: form.disableLetterAutoScroll,
          disableWordByWord: form.disableWordByWord,
        },
        endingConfig: { title: form.endingTitle, message: form.endingMessage },
        isPasswordProtected: form.isPasswordProtected,
        ...(form.accessPassword && { accessPassword: form.accessPassword }),
      });
      toast.success('Saved ✓');
    } catch {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const publish = async () => {
    await save();
    try {
      await projectsAPI.publish(id as string);
      setProject((p: any) => ({ ...p, status: 'PUBLISHED' }));
      toast.success('Published! Your memory is now live ✨');
    } catch {
      toast.error('Failed to publish');
    }
  };

  const generateAIMessage = async () => {
    setAiLoading(true);
    try {
      const { data } = await aiAPI.generateMessage({
        personOneName: form.personOneName,
        personTwoName: form.personTwoName,
        occasion: form.occasion,
        tone: 'romantic and heartfelt',
      });
      setForm((f: any) => ({ ...f, heroMessage: data.message }));
      toast.success('Message generated with AI ✨');
    } catch {
      toast.error('AI generation failed');
    } finally {
      setAiLoading(false);
    }
  };

  const update = (key: string, value: any) => setForm((f: any) => ({ ...f, [key]: value }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="font-serif text-2xl text-gradient animate-pulse">Loading...</div>
      </div>
    );
  }

  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const previewUrl = `${APP_URL}/memory/${project?.slug}`;
  const isPublished = project?.status === 'PUBLISHED';

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'content', label: 'Content', icon: null },
    { id: 'memories', label: 'Timeline', icon: Clock },
    { id: 'gallery', label: 'Gallery', icon: Image },
    { id: 'music', label: 'Music', icon: Music },
    { id: 'wishes', label: 'Wishes ✨', icon: Sparkles },
    { id: 'settings', label: 'Settings', icon: null },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <p className="font-script text-xl text-rose-deep mb-1">editing</p>
          <h1 className="font-serif text-3xl font-bold text-rose-cream">{project?.title}</h1>
          <p className="text-rose-cream/30 font-sans text-sm mt-1">
            {isPublished ? '🟢 Published' : '⚪ Draft'} · /memory/{project?.slug}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {isPublished && (
            <a href={previewUrl} target="_blank" rel="noopener noreferrer"
              className="btn-ghost text-sm flex items-center gap-2">
              <Eye size={16} /> Preview
            </a>
          )}
          <button onClick={save} disabled={saving}
            className="btn-ghost text-sm flex items-center gap-2 disabled:opacity-50">
            <Save size={16} /> {saving ? 'Saving...' : 'Save'}
          </button>
          {!isPublished && (
            <button onClick={publish} className="btn-romantic text-sm flex items-center gap-2">
              <Globe size={16} /> <span>Publish</span>
            </button>
          )}
          {isPublished && (
            <button
              onClick={() => { navigator.clipboard.writeText(previewUrl); toast.success('Link copied!'); }}
              className="btn-romantic text-sm flex items-center gap-2"
            >
              <Copy size={16} /> <span>Copy Link</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 p-1 glass-card rounded-2xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-xl text-sm font-sans transition-all duration-200 ${
              activeTab === tab.id ? 'text-noir-midnight font-semibold' : 'text-rose-cream/50 hover:text-rose-cream'
            }`}
            style={activeTab === tab.id ? { background: 'linear-gradient(135deg, #e8c4b8, #c4a882)' } : {}}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {/* CONTENT TAB */}
        {activeTab === 'content' && (
          <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="space-y-6">

            <Section title="Basic Information">
              <div className="space-y-4">
                <Field label="Title *">
                  <input value={form.title} onChange={e => update('title', e.target.value)} className="input-romantic" />
                </Field>
                <Field label="Subtitle">
                  <input value={form.subtitle} onChange={e => update('subtitle', e.target.value)}
                    placeholder="A beautiful tagline" className="input-romantic" />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Name 1">
                    <input value={form.personOneName} onChange={e => update('personOneName', e.target.value)}
                      placeholder="Emma" className="input-romantic" />
                  </Field>
                  <Field label="Name 2">
                    <input value={form.personTwoName} onChange={e => update('personTwoName', e.target.value)}
                      placeholder="James" className="input-romantic" />
                  </Field>
                </div>
              </div>
            </Section>

            <Section title="Hero Section">
              <Field label="Opening Message">
                <div className="relative">
                  <textarea
                    value={form.heroMessage}
                    onChange={e => update('heroMessage', e.target.value)}
                    placeholder="The message that appears after the hero..."
                    rows={4}
                    className="input-romantic resize-none"
                  />
                  <button
                    type="button"
                    onClick={generateAIMessage}
                    disabled={aiLoading}
                    className="absolute bottom-3 right-3 flex items-center gap-1.5 text-xs font-sans px-3 py-1.5 rounded-lg disabled:opacity-50 transition-colors"
                    style={{ background: 'rgba(232,196,184,0.15)', color: '#e8c4b8' }}
                  >
                    <Sparkles size={12} />
                    {aiLoading ? 'Generating...' : 'AI Generate'}
                  </button>
                </div>
              </Field>
            </Section>

            <Section title="Cover Photo">
              <Field label="Current URL">
                <input value={form.coverImageUrl} onChange={e => update('coverImageUrl', e.target.value)}
                  placeholder="https://..." className="input-romantic mb-3" />
              </Field>
              <p className="text-rose-cream/30 text-sm font-sans mb-3">Or upload a new cover photo:</p>
              <MediaUploader
                projectId={id as string}
                accept="image"
                maxFiles={1}
                label="Upload cover photo"
                onUpload={({ url }) => update('coverImageUrl', url)}
              />
            </Section>

            <Section title="Ending Section">
              <Field label="Closing Title">
                <input value={form.endingTitle} onChange={e => update('endingTitle', e.target.value)}
                  placeholder="Forever Yours" className="input-romantic" />
              </Field>
              <Field label="Closing Message">
                <textarea value={form.endingMessage} onChange={e => update('endingMessage', e.target.value)}
                  placeholder="Your final heartfelt note..." rows={3} className="input-romantic resize-none" />
              </Field>
            </Section>

            <Section title="🎊 Celebration Settings (Celestial Birthday)">
              <Field label="Celebrate Text (max 30 words)">
                <input value={form.celebrateText} onChange={e => {
                  const words = e.target.value.split(/\s+/).filter(Boolean);
                  if (words.length <= 30) update('celebrateText', e.target.value);
                }}
                  placeholder="Wishing you a Magical Birthday! 🌟"
                  className="input-romantic" />
                <p className="text-rose-cream/20 text-xs font-sans mt-1">{(form.celebrateText || '').split(/\s+/).filter(Boolean).length}/30 words</p>
              </Field>

              <div className="flex items-center justify-between p-3 glass-card mb-4">
                <div>
                  <p className="text-rose-cream font-serif text-sm">Use different text for "Celebrate Again"</p>
                  <p className="text-rose-cream/30 text-xs font-sans">Otherwise uses the same celebrate text</p>
                </div>
                <button
                  type="button"
                  onClick={() => update('useDifferentCelebrateAgain', !form.useDifferentCelebrateAgain)}
                  className={`w-12 h-6 rounded-full transition-all duration-300 relative ${form.useDifferentCelebrateAgain ? 'bg-rose-blush' : 'bg-white/10'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${form.useDifferentCelebrateAgain ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              {form.useDifferentCelebrateAgain && (
                <Field label="Celebrate Again Text (max 30 words)">
                  <input value={form.celebrateAgainText} onChange={e => {
                    const words = e.target.value.split(/\s+/).filter(Boolean);
                    if (words.length <= 30) update('celebrateAgainText', e.target.value);
                  }}
                    placeholder="Another round of magic for you! ✨"
                    className="input-romantic" />
                  <p className="text-rose-cream/20 text-xs font-sans mt-1">{(form.celebrateAgainText || '').split(/\s+/).filter(Boolean).length}/30 words</p>
                </Field>
              )}

              <Field label="Welcome Popup Text">
                <input value={form.welcomePopupText}
                  onChange={e => update('welcomePopupText', e.target.value)}
                  placeholder="A special surprise awaits…"
                  className="input-romantic" />
                <p className="text-rose-cream/20 text-xs font-sans mt-1">Text shown on the intro screen popup</p>
              </Field>

              <Field label="Letter Background Music URL">
                <input value={form.letterMusicUrl}
                  onChange={e => update('letterMusicUrl', e.target.value)}
                  placeholder="https://... (plays when Secret Letter opens)"
                  className="input-romantic mb-3" />
              </Field>
              <p className="text-rose-cream/30 text-sm font-sans mb-3">Or upload letter music:</p>
              <MediaUploader
                projectId={id as string}
                accept="audio"
                maxFiles={1}
                label="Upload letter music"
                onUpload={({ url }) => update('letterMusicUrl', url)}
              />

              <div className="flex items-center justify-between p-3 glass-card mb-4 mt-6">
                <div>
                  <p className="text-rose-cream font-serif text-sm">Disable Letter Auto-Scroll</p>
                  <p className="text-rose-cream/30 text-xs font-sans">Stop the letter container from scrolling to the bottom automatically</p>
                </div>
                <button
                  type="button"
                  onClick={() => update('disableLetterAutoScroll', !form.disableLetterAutoScroll)}
                  className={`w-12 h-6 rounded-full transition-all duration-300 relative ${form.disableLetterAutoScroll ? 'bg-rose-blush' : 'bg-white/10'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${form.disableLetterAutoScroll ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 glass-card mb-4">
                <div>
                  <p className="text-rose-cream font-serif text-sm">Disable Word-by-Word Animation</p>
                  <p className="text-rose-cream/30 text-xs font-sans">Show the entire letter text immediately instead of drawing it word-by-word</p>
                </div>
                <button
                  type="button"
                  onClick={() => update('disableWordByWord', !form.disableWordByWord)}
                  className={`w-12 h-6 rounded-full transition-all duration-300 relative ${form.disableWordByWord ? 'bg-rose-blush' : 'bg-white/10'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${form.disableWordByWord ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            </Section>
          </motion.div>
        )}

        {/* MEMORIES TAB */}
        {activeTab === 'memories' && (
          <motion.div key="memories" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <MemoriesEditor projectId={id as string} initialMemories={project?.memories || []} />
          </motion.div>
        )}

        {/* GALLERY TAB */}
        {activeTab === 'gallery' && (
          <motion.div key="gallery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <GalleryEditor projectId={id as string} initialItems={project?.galleryItems || []} />
          </motion.div>
        )}

        {/* MUSIC TAB */}
        {activeTab === 'music' && (
          <motion.div key="music" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Section title="Background Music">
              <Field label="Music URL">
                <input value={form.backgroundMusicUrl} onChange={e => update('backgroundMusicUrl', e.target.value)}
                  placeholder="https://..." className="input-romantic mb-3" />
              </Field>
              <p className="text-rose-cream/30 text-sm font-sans mb-3">Or upload an audio file:</p>
              <MediaUploader
                projectId={id as string}
                accept="audio"
                maxFiles={1}
                label="Upload background music"
                onUpload={({ url }) => update('backgroundMusicUrl', url)}
              />
              <p className="text-rose-cream/20 text-xs font-sans mt-4">
                💡 Use royalty-free music from Pixabay, Free Music Archive, or similar. Visitors can toggle music on/off.
              </p>
            </Section>
          </motion.div>
        )}

        {/* WISHES TAB */}
        {activeTab === 'wishes' && (
          <motion.div key="wishes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <Section title="Wishes & Messages Received 🌟">
              <p className="text-rose-cream/40 text-sm font-sans mb-6">
                Here are the wishes and messages submitted by visitors who clicked on your interactive Birthday Cake!
              </p>
              
              {!project?.heroConfig?.wishes || project.heroConfig.wishes.length === 0 ? (
                <div className="text-center py-12 glass-card rounded-2xl">
                  <p className="text-rose-cream/30 font-serif text-lg">No wishes received yet 🌸</p>
                  <p className="text-rose-cream/20 font-sans text-xs mt-1">They will appear here once visitors submit them on your live page!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.heroConfig.wishes.map((w: any) => (
                    <div key={w.id} className="p-5 glass-card rounded-2xl border border-rose-cream/10 relative group flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-serif text-rose-blush text-md font-semibold">✨ {w.name || 'Anonymous'}</span>
                          <span className="text-xs text-rose-cream/30 font-sans">
                            {new Date(w.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-rose-cream/80 font-serif text-sm italic leading-relaxed">
                          "{w.wish}"
                        </p>
                      </div>

                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={async () => {
                            if (confirm('Are you sure you want to delete this wish?')) {
                              try {
                                const updatedWishes = project.heroConfig.wishes.filter((item: any) => item.id !== w.id);
                                const updatedHeroConfig = { ...project.heroConfig, wishes: updatedWishes };
                                await projectsAPI.update(project.id, { heroConfig: updatedHeroConfig });
                                setProject((p: any) => ({ ...p, heroConfig: updatedHeroConfig }));
                                toast.success('Wish deleted');
                              } catch {
                                toast.error('Failed to delete wish');
                              }
                            }
                          }}
                          className="text-white bg-red-500/80 p-1.5 rounded-lg hover:bg-red-500 transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Section>
          </motion.div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="space-y-6">
            <Section title="Privacy">
              <div className="flex items-center justify-between p-4 glass-card">
                <div className="flex items-center gap-3">
                  {form.isPasswordProtected ? <Lock size={18} className="text-rose-blush" /> : <Unlock size={18} className="text-rose-cream/40" />}
                  <div>
                    <p className="text-rose-cream font-serif">Password Protection</p>
                    <p className="text-rose-cream/30 text-sm font-sans">Require a password to view this memory</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => update('isPasswordProtected', !form.isPasswordProtected)}
                  className={`w-12 h-6 rounded-full transition-all duration-300 relative ${form.isPasswordProtected ? 'bg-rose-blush' : 'bg-white/10'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${form.isPasswordProtected ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
              {form.isPasswordProtected && (
                <Field label="Access Password">
                  <input type="password" value={form.accessPassword} onChange={e => update('accessPassword', e.target.value)}
                    placeholder="Set a password..." className="input-romantic" />
                </Field>
              )}
            </Section>

            {isPublished && (
              <Section title="Share">
                <div className="glass-card p-4">
                  <p className="text-rose-cream/50 font-sans text-sm mb-3">Public URL:</p>
                  <div className="flex items-center gap-3">
                    <code className="flex-1 text-rose-cream/70 font-mono text-sm bg-white/5 px-3 py-2 rounded-lg truncate">
                      {previewUrl}
                    </code>
                    <button
                      onClick={() => { navigator.clipboard.writeText(previewUrl); toast.success('Copied!'); }}
                      className="btn-ghost text-sm px-4 py-2"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </Section>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky save */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <motion.button
          onClick={save}
          disabled={saving}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="btn-romantic shadow-glow disabled:opacity-50 flex items-center gap-2 px-8"
        >
          <Save size={16} />
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
        </motion.button>
      </div>
    </div>
  );
}

// ─── SUB-COMPONENTS ───

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-card p-6">
      <h3 className="font-serif text-xl text-rose-cream mb-5">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="block text-rose-cream/50 text-sm font-sans mb-2">{label}</label>
      {children}
    </div>
  );
}

// ─── MEMORIES EDITOR ───

function MemoriesEditor({ projectId, initialMemories }: { projectId: string; initialMemories: any[] }) {
  const [memories, setMemories] = useState(initialMemories);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', date: '', location: '', emoji: '' });

  const addMemory = async () => {
    if (!form.title || !form.date) { toast.error('Title and date are required'); return; }
    try {
      const { data } = await projectsAPI.addMemory(projectId, form);
      setMemories(prev => [...prev, data.memory]);
      setForm({ title: '', description: '', date: '', location: '', emoji: '' });
      setAdding(false);
      toast.success('Memory added ✨');
    } catch { toast.error('Failed to add memory'); }
  };

  const deleteMemory = async (id: string) => {
    try {
      await projectsAPI.deleteMemory(projectId, id);
      setMemories(prev => prev.filter(m => m.id !== id));
      toast.success('Memory removed');
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-serif text-xl text-rose-cream">Memory Timeline</h3>
        <button onClick={() => setAdding(true)} className="btn-romantic text-sm flex items-center gap-2">
          <Plus size={16} /> <span>Add Memory</span>
        </button>
      </div>

      {adding && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 space-y-3">
          <h4 className="font-serif text-lg text-rose-cream">New Memory</h4>
          <input placeholder="Memory title *" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="input-romantic" />
          <textarea placeholder="Description..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} className="input-romantic resize-none" />
          <div className="grid grid-cols-3 gap-3">
            <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="input-romantic" style={{ colorScheme: 'dark' }} />
            <input placeholder="📍 Location" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className="input-romantic" />
            <input placeholder="Emoji" value={form.emoji} onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))} className="input-romantic" maxLength={2} />
          </div>
          <div className="flex gap-3">
            <button onClick={addMemory} className="btn-romantic text-sm"><span>Add Memory</span></button>
            <button onClick={() => setAdding(false)} className="btn-ghost text-sm">Cancel</button>
          </div>
        </motion.div>
      )}

      {memories.length === 0 && !adding && (
        <div className="glass-card p-12 text-center">
          <div className="text-4xl mb-3">⏳</div>
          <p className="text-rose-cream/40 font-sans">No memories yet. Add your first moment.</p>
        </div>
      )}

      {memories.map((memory) => (
        <div key={memory.id} className="glass-card p-5 flex items-start gap-4 group">
          <div className="text-2xl mt-0.5">{memory.emoji || '💭'}</div>
          <div className="flex-1">
            <p className="font-serif text-rose-cream">{memory.title}</p>
            {memory.description && <p className="text-rose-cream/40 text-sm font-sans mt-1">{memory.description}</p>}
            <p className="text-rose-cream/20 text-xs font-sans mt-2">
              {new Date(memory.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              {memory.location && ` · 📍 ${memory.location}`}
            </p>
          </div>
          <button onClick={() => deleteMemory(memory.id)}
            className="text-red-400/30 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── GALLERY EDITOR ───

function GalleryEditor({ projectId, initialItems }: { projectId: string; initialItems: any[] }) {
  const [items, setItems] = useState(initialItems);
  const [editingCaption, setEditingCaption] = useState<string | null>(null);
  const [captionText, setCaptionText] = useState('');

  const onUpload = async ({ url, mediaType }: { url: string; mediaType: string }) => {
    try {
      const { data } = await projectsAPI.addGalleryItem(projectId, {
        mediaUrl: url,
        mediaType,
        sortOrder: items.length,
      });
      setItems(prev => [...prev, data.item]);
      toast.success('Photo added to gallery');
    } catch { toast.error('Failed to add to gallery'); }
  };

  const deleteItem = async (id: string) => {
    try {
      await projectsAPI.deleteGalleryItem(projectId, id);
      setItems(prev => prev.filter(i => i.id !== id));
    } catch { toast.error('Failed to delete'); }
  };

  const saveCaption = async (itemId: string) => {
    try {
      await projectsAPI.updateGalleryItem(projectId, itemId, { caption: captionText });
      setItems(prev => prev.map(i => i.id === itemId ? { ...i, caption: captionText } : i));
      setEditingCaption(null);
      toast.success('Caption saved');
    } catch { toast.error('Failed to save caption'); }
  };

  return (
    <div>
      <h3 className="font-serif text-xl text-rose-cream mb-5">Gallery</h3>
      <MediaUploader projectId={projectId} accept="image" maxFiles={20} label="Upload gallery photos" onUpload={onUpload} />

      {items.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {items.map((item) => (
            <div key={item.id} className="relative group rounded-xl overflow-hidden glass-card p-2">
              <div className="aspect-square rounded-lg overflow-hidden">
                <img src={item.mediaUrl} alt={item.caption || ''} className="w-full h-full object-cover" />
              </div>
              {/* Caption editing */}
              <div className="mt-2">
                {editingCaption === item.id ? (
                  <div className="flex gap-2">
                    <input
                      value={captionText}
                      onChange={e => setCaptionText(e.target.value)}
                      placeholder="Add caption..."
                      className="input-romantic text-xs flex-1"
                      autoFocus
                    />
                    <button onClick={() => saveCaption(item.id)}
                      className="text-xs px-2 py-1 rounded-lg" style={{ background: 'rgba(232,196,184,0.2)', color: '#e8c4b8' }}>✓</button>
                    <button onClick={() => setEditingCaption(null)}
                      className="text-xs px-2 py-1 text-rose-cream/40">✕</button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setEditingCaption(item.id); setCaptionText(item.caption || ''); }}
                    className="text-xs text-rose-cream/40 hover:text-rose-cream/70 transition-colors w-full text-left truncate"
                  >
                    {item.caption || '+ Add caption'}
                  </button>
                )}
              </div>
              {/* Delete button */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => deleteItem(item.id)} className="text-white bg-red-500/80 p-1.5 rounded-lg hover:bg-red-500">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
