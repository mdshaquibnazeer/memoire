'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  Save, Globe, Eye, Lock, Unlock, Music, Image, Clock,
  Plus, Trash2, Sparkles, Calendar, ExternalLink, Copy, Film
} from 'lucide-react';
import { projectsAPI, aiAPI } from '@/lib/api';
import MediaUploader from '@/components/shared/MediaUploader';
import { useAuth } from '@/hooks/useAuth';

type Tab = 'content' | 'gallery' | 'memories' | 'music' | 'settings' | 'wishes' | 'selfies';

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

  const { user } = useAuth();

  useEffect(() => {
    if (id && (id as string).startsWith('demo-') && user?.role !== 'ADMIN') {
      toast.error('System showcase demos are read-only.');
      router.push('/dashboard');
      return;
    }

    if (id && (id as string).startsWith('demo-') && user?.role === 'ADMIN') {
      toast.info('Admin Mode: Editing system showcase demo.');
    }

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
        letterScrollSpeed: data.project.heroConfig?.letterScrollSpeed !== undefined ? data.project.heroConfig.letterScrollSpeed : 25,
        letterWordDelay: data.project.heroConfig?.letterWordDelay !== undefined ? data.project.heroConfig.letterWordDelay : 120,
        useDifferentLetterText: data.project.heroConfig?.useDifferentLetterText || false,
        letterMessage: data.project.heroConfig?.letterMessage || '',
        letterAnimType: data.project.heroConfig?.letterAnimType || 'word',
        letterCharDelay: data.project.heroConfig?.letterCharDelay !== undefined ? data.project.heroConfig.letterCharDelay : 30,
        endingTitle: data.project.endingConfig?.title || '',
        endingMessage: data.project.endingConfig?.message || '',
        endingSignature: data.project.endingConfig?.endingSignature || '',
        finaleStyle: data.project.endingConfig?.finaleStyle || 'all',
        isPasswordProtected: data.project.isPasswordProtected || false,
        accessPassword: '',
        // Velvet Romance Theme Fields
        heroTagline: data.project.heroConfig?.heroTagline || '',
        envelopeStyle: data.project.heroConfig?.envelopeStyle || 'gold',
        envelopeOpenEffect: data.project.heroConfig?.envelopeOpenEffect || 'shimmer',
        quillSignature: data.project.heroConfig?.quillSignature || '',
        promiseWallTitle: data.project.heroConfig?.promiseWallTitle || '',
        promiseCardStyle: data.project.heroConfig?.promiseCardStyle || 'gold',
        confettiOnComplete: data.project.heroConfig?.confettiOnComplete !== undefined ? data.project.heroConfig.confettiOnComplete : true,
        promises: data.project.heroConfig?.promises || [],
        galleryTitle: data.project.heroConfig?.galleryTitle || '',
        galleryQuote: data.project.heroConfig?.galleryQuote || '',
        sepiaFilter: data.project.heroConfig?.sepiaFilter || false,
        featuredPhotoUrl: data.project.heroConfig?.featuredPhotoUrl || '',
        featuredPhotoCaption: data.project.heroConfig?.featuredPhotoCaption || '',
        showStats: data.project.heroConfig?.showStats || false,
        customStatLabel1: data.project.heroConfig?.customStatLabel1 || '',
        customStatValue1: data.project.heroConfig?.customStatValue1 || 0,
        customStatLabel2: data.project.heroConfig?.customStatLabel2 || '',
        customStatValue2: data.project.heroConfig?.customStatValue2 || 0,
        customStatLabel3: data.project.heroConfig?.customStatLabel3 || '',
        customStatValue3: data.project.heroConfig?.customStatValue3 || 0,
        loveCategories: data.project.heroConfig?.loveCategories || [],
        wallpaperUrl: data.project.heroConfig?.wallpaperUrl || '',
        secretVideoUrl: data.project.heroConfig?.secretVideoUrl || '',
        secretVideoCaption: data.project.heroConfig?.secretVideoCaption || '',
        passcodeTitle: data.project.heroConfig?.passcodeTitle || '',
        passcodeSubtitle: data.project.heroConfig?.passcodeSubtitle || '',
        passcodeGreetingPosition: data.project.heroConfig?.passcodeGreetingPosition || 'top',
        passcodeCardOpacity: data.project.heroConfig?.passcodeCardOpacity !== undefined ? data.project.heroConfig.passcodeCardOpacity : 30,
        showPasscodeGreeting: data.project.heroConfig?.showPasscodeGreeting !== undefined ? data.project.heroConfig.showPasscodeGreeting : true,
        enableSelfieThankYou: data.project.heroConfig?.enableSelfieThankYou !== undefined ? data.project.heroConfig.enableSelfieThankYou : false,
        showCameraRollStrip: data.project.heroConfig?.showCameraRollStrip !== undefined ? data.project.heroConfig.showCameraRollStrip : true,
        showLeftFilmstrip: data.project.heroConfig?.showLeftFilmstrip !== undefined ? data.project.heroConfig.showLeftFilmstrip : false,
        showRightFilmstrip: data.project.heroConfig?.showRightFilmstrip !== undefined ? data.project.heroConfig.showRightFilmstrip : true,
        showDatesFlowchart: data.project.heroConfig?.showDatesFlowchart !== undefined ? data.project.heroConfig.showDatesFlowchart : true,
        enablePhoneFrameAfterPin: data.project.heroConfig?.enablePhoneFrameAfterPin !== undefined ? data.project.heroConfig.enablePhoneFrameAfterPin : false,
        boxTheme: data.project.heroConfig?.boxTheme || 'frosted-rose',
        phoneTheme: data.project.heroConfig?.phoneTheme || 'rose-gold',
        heroGreetingText: data.project.heroConfig?.heroGreetingText || '',
        heroTeaserText: data.project.heroConfig?.heroTeaserText || '',
        giftBoxWishPrompt: data.project.heroConfig?.giftBoxWishPrompt || '',
        selfies: data.project.heroConfig?.selfies || [],
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
          letterScrollSpeed: form.letterScrollSpeed,
          letterWordDelay: form.letterWordDelay,
          useDifferentLetterText: form.useDifferentLetterText,
          letterMessage: form.letterMessage,
          letterAnimType: form.letterAnimType,
          letterCharDelay: form.letterCharDelay,
          // Velvet Romance & Sweet Diary config values
          heroTagline: form.heroTagline,
          envelopeStyle: form.envelopeStyle,
          envelopeOpenEffect: form.envelopeOpenEffect,
          quillSignature: form.quillSignature,
          promiseWallTitle: form.promiseWallTitle,
          promiseCardStyle: form.promiseCardStyle,
          confettiOnComplete: form.confettiOnComplete,
          promises: form.promises,
          galleryTitle: form.galleryTitle,
          galleryQuote: form.galleryQuote,
          sepiaFilter: form.sepiaFilter,
          featuredPhotoUrl: form.featuredPhotoUrl,
          featuredPhotoCaption: form.featuredPhotoCaption,
          showStats: form.showStats,
          customStatLabel1: form.customStatLabel1,
          customStatValue1: Number(form.customStatValue1) || 0,
          customStatLabel2: form.customStatLabel2,
          customStatValue2: Number(form.customStatValue2) || 0,
          customStatLabel3: form.customStatLabel3,
          customStatValue3: Number(form.customStatValue3) || 0,
          loveCategories: form.loveCategories,
          wallpaperUrl: form.wallpaperUrl,
          secretVideoUrl: form.secretVideoUrl,
          secretVideoCaption: form.secretVideoCaption,
          passcodeTitle: form.passcodeTitle,
          passcodeSubtitle: form.passcodeSubtitle,
          passcodeGreetingPosition: form.passcodeGreetingPosition || 'top',
          passcodeCardOpacity: Number(form.passcodeCardOpacity !== undefined ? form.passcodeCardOpacity : 30),
          showPasscodeGreeting: form.showPasscodeGreeting !== undefined ? form.showPasscodeGreeting : true,
          enableSelfieThankYou: form.enableSelfieThankYou,
          showCameraRollStrip: form.showCameraRollStrip !== undefined ? form.showCameraRollStrip : true,
          showLeftFilmstrip: form.showLeftFilmstrip !== undefined ? form.showLeftFilmstrip : false,
          showRightFilmstrip: form.showRightFilmstrip !== undefined ? form.showRightFilmstrip : true,
          showDatesFlowchart: form.showDatesFlowchart !== undefined ? form.showDatesFlowchart : true,
          enablePhoneFrameAfterPin: form.enablePhoneFrameAfterPin !== undefined ? form.enablePhoneFrameAfterPin : false,
          boxTheme: form.boxTheme || 'frosted-rose',
          phoneTheme: form.phoneTheme || 'rose-gold',
          heroGreetingText: form.heroGreetingText,
          heroTeaserText: form.heroTeaserText,
          giftBoxWishPrompt: form.giftBoxWishPrompt,
          selfies: form.selfies || [],
        },
        endingConfig: { 
          title: form.endingTitle, 
          message: form.endingMessage,
          endingSignature: form.endingSignature,
          finaleStyle: form.finaleStyle,
        },
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
    { id: 'selfies', label: 'Thank-You Selfies 📸', icon: Image },
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
          <button
            onClick={() => router.push(`/dashboard/create?cloneFrom=${id}`)}
            className="btn-ghost text-sm flex items-center gap-2 text-rose-300 hover:text-rose-200"
            title="Use this memory's content with another theme"
          >
            <Sparkles size={16} /> Switch Theme
          </button>
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
              <Field label="Custom Ending Sign-off / Signature">
                <input
                  value={form.endingSignature}
                  onChange={e => update('endingSignature', e.target.value)}
                  placeholder="— With Love, John 💕"
                  className="input-romantic"
                />
                <p className="text-[11px] text-rose-cream/40 mt-1 font-sans">
                  Customizes the sign-off displayed at the end of the memory page.
                </p>
              </Field>
            </Section>

            <Section title="🎨 Box & Frame Themes (Sweet Diary)">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <Field label="Card / Box Theme Style">
                  <select
                    value={form.boxTheme || 'frosted-rose'}
                    onChange={e => update('boxTheme', e.target.value)}
                    className="input-romantic bg-noir-midnight"
                  >
                    <option value="frosted-rose">Frosted Rose Glass 🌸</option>
                    <option value="peach-cream">Peach Cream & Gold 🍑</option>
                    <option value="sakura-blush">Sakura Blush ✨</option>
                    <option value="velvet-glow">Velvet Glow Dark Rose 🍷</option>
                  </select>
                  <p className="text-[11px] text-rose-cream/40 mt-1 font-sans">
                    Colors and glass style for notes, story cards, cake & gallery.
                  </p>
                </Field>

                <Field label="Phone Bezel Skin">
                  <select
                    value={form.phoneTheme || 'rose-gold'}
                    onChange={e => update('phoneTheme', e.target.value)}
                    className="input-romantic bg-noir-midnight"
                  >
                    <option value="rose-gold">Rose Gold Titanium 💖</option>
                    <option value="sakura-pink">Sakura Candy Pink 🎀</option>
                    <option value="midnight-pink">Midnight Noir Pink 🖤</option>
                  </select>
                  <p className="text-[11px] text-rose-cream/40 mt-1 font-sans">
                    Physical phone body finish and border reflections.
                  </p>
                </Field>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 glass-card">
                  <div>
                    <p className="text-rose-cream font-serif text-sm">Keep Phone Framed Body After Entering PIN</p>
                    <p className="text-rose-cream/30 text-xs font-sans">
                      If OFF: Entering PIN expands the website to a full responsive webpage layout without being boxed inside a phone.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => update('enablePhoneFrameAfterPin', !form.enablePhoneFrameAfterPin)}
                    className={`w-12 h-6 rounded-full transition-all duration-300 relative ${form.enablePhoneFrameAfterPin ? 'bg-rose-blush' : 'bg-white/10'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${form.enablePhoneFrameAfterPin ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 glass-card">
                  <div>
                    <p className="text-rose-cream font-serif text-sm">Show Left-Side Photo Filmstrip</p>
                    <p className="text-rose-cream/30 text-xs font-sans">Displays an animated vertical camera roll on the left side</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => update('showLeftFilmstrip', !form.showLeftFilmstrip)}
                    className={`w-12 h-6 rounded-full transition-all duration-300 relative ${form.showLeftFilmstrip ? 'bg-rose-blush' : 'bg-white/10'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${form.showLeftFilmstrip ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 glass-card">
                  <div>
                    <p className="text-rose-cream font-serif text-sm">Show Right-Side Photo Filmstrip</p>
                    <p className="text-rose-cream/30 text-xs font-sans">Displays an animated vertical camera roll on the right side</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => update('showRightFilmstrip', !form.showRightFilmstrip)}
                    className={`w-12 h-6 rounded-full transition-all duration-300 relative ${form.showRightFilmstrip !== false ? 'bg-rose-blush' : 'bg-white/10'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${form.showRightFilmstrip !== false ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 glass-card">
                  <div>
                    <p className="text-rose-cream font-serif text-sm">Show Important Dates Story Track</p>
                    <p className="text-rose-cream/30 text-xs font-sans">Displays a vertical milestone flowchart beside the filmstrip</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => update('showDatesFlowchart', !form.showDatesFlowchart)}
                    className={`w-12 h-6 rounded-full transition-all duration-300 relative ${form.showDatesFlowchart !== false ? 'bg-rose-blush' : 'bg-white/10'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${form.showDatesFlowchart !== false ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
              </div>
            </Section>

            <Section title="📱 Mobile Phone Wallpaper">
              <Field label="Phone Screen Wallpaper URL (Strictly for mobile frame display)">
                <input
                  value={form.wallpaperUrl}
                  onChange={e => update('wallpaperUrl', e.target.value)}
                  placeholder="https://..."
                  className="input-romantic mb-3"
                />
                <MediaUploader
                  projectId={id as string}
                  accept="image"
                  maxFiles={1}
                  label="Upload mobile wallpaper"
                  onUpload={({ url }) => update('wallpaperUrl', url)}
                />
                <p className="text-[11px] text-rose-cream/40 mt-2 font-sans">
                  💡 Note: This wallpaper appears strictly inside the mobile phone body screen. The website background remains a dynamic cute pastel live canvas with floating hearts & sparkles.
                </p>
              </Field>
            </Section>

            <Section title="💌 Hero Greeting & Story Messages">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-serif text-rose-cream/80">Hero Story Intro / Greeting Note</label>
                {form.heroMessage && (
                  <button
                    type="button"
                    onClick={() => update('heroGreetingText', form.heroMessage)}
                    className="text-[11px] text-rose-blush hover:underline cursor-pointer font-sans"
                  >
                    ✨ Use same message as Hero Opening Message
                  </button>
                )}
              </div>
              <Field label="">
                <textarea
                  value={form.heroGreetingText}
                  onChange={e => update('heroGreetingText', e.target.value)}
                  placeholder={form.heroMessage || "Every single moment shared with you is a treasure..."}
                  rows={4}
                  className="input-romantic resize-none font-sans text-sm"
                />
                <p className="text-[11px] text-rose-cream/40 mt-1 font-sans">
                  Full text revealed inside the popup when the recipient clicks the hero card. (If left blank, defaults to your Hero Opening Message).
                </p>
              </Field>
              <Field label="Hero Card Teaser Line (Shown on Homepage Card)">
                <input
                  value={form.heroTeaserText}
                  onChange={e => update('heroTeaserText', e.target.value)}
                  placeholder="CLICKK KROO MOTIII 🫣🥹"
                  className="input-romantic"
                />
                <p className="text-[11px] text-rose-cream/40 mt-1 font-sans">
                  Short teaser line on the homepage card (the full message is revealed inside the popup).
                </p>
              </Field>
              <Field label="Gift Box Surprise Wish Prompt">
                <input
                  value={form.giftBoxWishPrompt}
                  onChange={e => update('giftBoxWishPrompt', e.target.value)}
                  placeholder="What is your biggest wish today, my love? 🌟"
                  className="input-romantic"
                />
                <p className="text-[11px] text-rose-cream/40 mt-1 font-sans">
                  Popup text shown when the recipient clicks the center 🎁 gift box.
                </p>
              </Field>
            </Section>

            <Section title="🎬 Secret Personalized Video">
              <Field label="Special Recipient Video URL">
                <input
                  value={form.secretVideoUrl}
                  onChange={e => update('secretVideoUrl', e.target.value)}
                  placeholder="https://..."
                  className="input-romantic mb-3"
                />
                <MediaUploader
                  projectId={id as string}
                  accept="video"
                  maxFiles={1}
                  label="Upload edited video file"
                  onUpload={({ url }) => update('secretVideoUrl', url)}
                />
              </Field>
              <Field label="Secret Video Caption / Subtitle Note">
                <input
                  value={form.secretVideoCaption}
                  onChange={e => update('secretVideoCaption', e.target.value)}
                  placeholder="Personalized Secret Video 🎬"
                  className="input-romantic"
                />
                <p className="text-[11px] text-rose-cream/40 mt-1 font-sans">
                  Caption displayed below the video player popup.
                </p>
              </Field>
            </Section>

            <Section title="🔒 Passcode Screen Customization">
              <div className="flex items-center justify-between p-3 glass-card mb-3">
                <div>
                  <p className="text-rose-cream font-serif text-sm">Show Passcode Greeting Card</p>
                  <p className="text-rose-cream/30 text-xs font-sans">Displays frosted glass text backdrop above the PIN pad</p>
                </div>
                <button
                  type="button"
                  onClick={() => update('showPasscodeGreeting', !form.showPasscodeGreeting)}
                  className={`w-12 h-6 rounded-full transition-all duration-300 relative ${form.showPasscodeGreeting !== false ? 'bg-rose-blush' : 'bg-white/10'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${form.showPasscodeGreeting !== false ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                <Field label="Greeting Card Position">
                  <select
                    value={form.passcodeGreetingPosition || 'top'}
                    onChange={e => update('passcodeGreetingPosition', e.target.value)}
                    className="input-romantic bg-noir-midnight"
                  >
                    <option value="top">Top of Phone Screen (Normal)</option>
                    <option value="above-pin">Just Above PIN Pad</option>
                  </select>
                </Field>

                <Field label={`Card Background Opacity (${form.passcodeCardOpacity ?? 30}%)`}>
                  <input
                    type="range"
                    min="0"
                    max="90"
                    step="5"
                    value={form.passcodeCardOpacity ?? 30}
                    onChange={e => update('passcodeCardOpacity', Number(e.target.value))}
                    className="w-full accent-pink-500 cursor-pointer mt-2"
                  />
                </Field>
              </div>

              <Field label="Passcode Screen Title">
                <input
                  value={form.passcodeTitle}
                  onChange={e => update('passcodeTitle', e.target.value)}
                  placeholder="Welcome, My Love 🌸"
                  className="input-romantic"
                />
              </Field>

              <Field label="Passcode Screen Subtitle">
                <input
                  value={form.passcodeSubtitle}
                  onChange={e => update('passcodeSubtitle', e.target.value)}
                  placeholder="Enter your 4-digit secret PIN"
                  className="input-romantic"
                />
              </Field>
            </Section>

            <Section title="🐼 Thank-You Selfie settings">
              <div className="flex items-center justify-between p-3 glass-card">
                <div>
                  <p className="text-rose-cream font-serif text-sm">Ask Recipient for Thank-You Selfie</p>
                  <p className="text-rose-cream/30 text-xs font-sans">A cute panda at the end asks them to snap/upload a selfie</p>
                </div>
                <button
                  type="button"
                  onClick={() => update('enableSelfieThankYou', !form.enableSelfieThankYou)}
                  className={`w-12 h-6 rounded-full transition-all duration-300 relative ${form.enableSelfieThankYou ? 'bg-rose-blush' : 'bg-white/10'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${form.enableSelfieThankYou ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            </Section>

            {project?.theme !== 'VELVET_ROMANCE' && project?.theme !== 'SWEET_DIARY' && (
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

              {/* Custom Secret Letter Text Toggle */}
              <div className="flex items-center justify-between p-3 glass-card mb-4 mt-6">
                <div>
                  <p className="text-rose-cream font-serif text-sm">Use different text for Secret Letter</p>
                  <p className="text-rose-cream/30 text-xs font-sans">Write a separate, personalized message for the letter modal instead of reusing the main hero message</p>
                </div>
                <button
                  type="button"
                  onClick={() => update('useDifferentLetterText', !form.useDifferentLetterText)}
                  className={`w-12 h-6 rounded-full transition-all duration-300 relative ${form.useDifferentLetterText ? 'bg-rose-blush' : 'bg-white/10'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${form.useDifferentLetterText ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              {form.useDifferentLetterText && (
                <div className="mb-4">
                  <Field label="Secret Letter Message (No word limits ✨)">
                    <textarea
                      value={form.letterMessage}
                      onChange={e => update('letterMessage', e.target.value)}
                      placeholder="Write your secret heart-touching birthday letter here... There are no word limits, write as much as you wish!"
                      rows={6}
                      className="input-romantic font-sans text-sm w-full p-3"
                    />
                  </Field>
                </div>
              )}

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

              {/* Scroll Speed Selector */}
              {!form.disableLetterAutoScroll && (
                <div className="p-4 glass-card mb-4 space-y-3">
                  <div>
                    <p className="text-rose-cream font-serif text-sm">Letter Auto-Scroll Speed</p>
                    <p className="text-rose-cream/30 text-xs font-sans">Choose how fast the cosmic letter automatically scrolls down</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: 'Slow (15 px/s)', value: 15 },
                      { label: 'Normal (25 px/s)', value: 25 },
                      { label: 'Fast (45 px/s)', value: 45 },
                      { label: 'Custom ⚙️', value: 'custom' },
                    ].map((opt) => {
                      const isSelected = opt.value === 'custom' 
                        ? ![15, 25, 45].includes(form.letterScrollSpeed)
                        : form.letterScrollSpeed === opt.value;
                      return (
                        <button
                          key={opt.label}
                          type="button"
                          onClick={() => {
                            if (opt.value === 'custom') {
                              update('letterScrollSpeed', 30);
                            } else {
                              update('letterScrollSpeed', opt.value);
                            }
                          }}
                          className={`text-xs px-3 py-1.5 rounded-lg border font-sans transition-all ${
                            isSelected
                              ? 'border-rose-blush bg-rose-blush/20 text-rose-cream'
                              : 'border-white/10 bg-white/5 text-rose-cream/50 hover:bg-white/10'
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Manual input for Custom scroll speed */}
                  {![15, 25, 45].includes(form.letterScrollSpeed) && (
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-rose-cream/40 font-sans">Enter Speed (px/s):</span>
                      <input
                        type="number"
                        min={5}
                        max={150}
                        value={form.letterScrollSpeed || 25}
                        onChange={(e) => {
                          const val = Math.min(150, Math.max(5, Number(e.target.value)));
                          update('letterScrollSpeed', val);
                        }}
                        className="input-romantic text-xs"
                        style={{ width: 80, padding: '4px 8px' }}
                      />
                      <span className="text-xs text-rose-cream/30 font-sans">(Range: 5 to 150 px/s)</span>
                    </div>
                  )}
                </div>
              )}

              {/* Animation Mode Selector */}
              {!form.disableWordByWord && (
                <div className="p-4 glass-card mb-4 space-y-3">
                  <div>
                    <p className="text-rose-cream font-serif text-sm">Animation Mode</p>
                    <p className="text-rose-cream/30 text-xs font-sans">Choose whether the letter draws in word-by-word or character-by-character (letter-by-letter)</p>
                  </div>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-rose-cream/75">
                      <input
                        type="radio"
                        name="letterAnimType"
                        checked={form.letterAnimType === 'word'}
                        onChange={() => update('letterAnimType', 'word')}
                        className="accent-rose-blush"
                      />
                      <span>Word-by-Word 📝</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-rose-cream/75">
                      <input
                        type="radio"
                        name="letterAnimType"
                        checked={form.letterAnimType === 'char'}
                        onChange={() => update('letterAnimType', 'char')}
                        className="accent-rose-blush"
                      />
                      <span>Letter-by-Letter 🔠</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Word Animation Delay Selector */}
              {!form.disableWordByWord && form.letterAnimType === 'word' && (
                <div className="p-4 glass-card mb-4 space-y-3">
                  <div>
                    <p className="text-rose-cream font-serif text-sm">Word-by-Word Draw Delay</p>
                    <p className="text-rose-cream/30 text-xs font-sans">Choose the delay between words appearing in the letter</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: 'Slow (300ms)', value: 300 },
                      { label: 'Normal (120ms)', value: 120 },
                      { label: 'Fast (70ms)', value: 70 },
                      { label: 'Custom ⚙️', value: 'custom' },
                    ].map((opt) => {
                      const isSelected = opt.value === 'custom'
                        ? ![300, 120, 70].includes(form.letterWordDelay)
                        : form.letterWordDelay === opt.value;
                      return (
                        <button
                          key={opt.label}
                          type="button"
                          onClick={() => {
                            if (opt.value === 'custom') {
                              update('letterWordDelay', 150);
                            } else {
                              update('letterWordDelay', opt.value);
                            }
                          }}
                          className={`text-xs px-3 py-1.5 rounded-lg border font-sans transition-all ${
                            isSelected
                              ? 'border-rose-blush bg-rose-blush/20 text-rose-cream'
                              : 'border-white/10 bg-white/5 text-rose-cream/50 hover:bg-white/10'
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Manual input for Custom word delay */}
                  {![300, 120, 70].includes(form.letterWordDelay) && (
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-rose-cream/40 font-sans">Enter Delay (ms):</span>
                      <input
                        type="number"
                        min={30}
                        max={1500}
                        value={form.letterWordDelay || 120}
                        onChange={(e) => {
                          const val = Math.min(1500, Math.max(30, Number(e.target.value)));
                          update('letterWordDelay', val);
                        }}
                        className="input-romantic text-xs"
                        style={{ width: 80, padding: '4px 8px' }}
                      />
                      <span className="text-xs text-rose-cream/30 font-sans">(Range: 30 to 1500 ms)</span>
                    </div>
                  )}
                </div>
              )}

              {/* Letter-by-Letter Delay Selector */}
              {!form.disableWordByWord && form.letterAnimType === 'char' && (
                <div className="p-4 glass-card mb-4 space-y-3">
                  <div>
                    <p className="text-rose-cream font-serif text-sm">Letter-by-Letter Draw Delay</p>
                    <p className="text-rose-cream/30 text-xs font-sans">Choose the delay between characters appearing in the letter</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: 'Slow (60ms)', value: 60 },
                      { label: 'Normal (30ms)', value: 30 },
                      { label: 'Fast (12ms)', value: 12 },
                      { label: 'Custom ⚙️', value: 'custom' },
                    ].map((opt) => {
                      const isSelected = opt.value === 'custom'
                        ? ![60, 30, 12].includes(form.letterCharDelay)
                        : form.letterCharDelay === opt.value;
                      return (
                        <button
                          key={opt.label}
                          type="button"
                          onClick={() => {
                            if (opt.value === 'custom') {
                              update('letterCharDelay', 25);
                            } else {
                              update('letterCharDelay', opt.value);
                            }
                          }}
                          className={`text-xs px-3 py-1.5 rounded-lg border font-sans transition-all ${
                            isSelected
                              ? 'border-rose-blush bg-rose-blush/20 text-rose-cream'
                              : 'border-white/10 bg-white/5 text-rose-cream/50 hover:bg-white/10'
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Manual input for Custom character delay */}
                  {![60, 30, 12].includes(form.letterCharDelay) && (
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-rose-cream/40 font-sans">Enter Delay (ms):</span>
                      <input
                        type="number"
                        min={3}
                        max={300}
                        value={form.letterCharDelay || 30}
                        onChange={(e) => {
                          const val = Math.min(300, Math.max(3, Number(e.target.value)));
                          update('letterCharDelay', val);
                        }}
                        className="input-romantic text-xs"
                        style={{ width: 80, padding: '4px 8px' }}
                      />
                      <span className="text-xs text-rose-cream/30 font-sans">(Range: 3 to 300 ms)</span>
                    </div>
                  )}
                </div>
              )}
            </Section>
            )}

            {(project?.theme === 'VELVET_ROMANCE' || project?.theme === 'SWEET_DIARY') && (
              <>
                <Section title="💌 Envelope & Seal Settings">
                  <Field label="Hero Tagline (Embossed gold text)">
                    <input
                      value={form.heroTagline}
                      onChange={e => update('heroTagline', e.target.value)}
                      placeholder="FOR YOU, MY LOVE"
                      className="input-romantic"
                    />
                  </Field>
                  <Field label="Hero Opening Message">
                    <textarea
                      value={form.heroMessage}
                      onChange={e => update('heroMessage', e.target.value)}
                      placeholder="My beloved..."
                      rows={4}
                      className="input-romantic resize-none"
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Envelope Seal Color">
                      <select
                        value={form.envelopeStyle}
                        onChange={e => update('envelopeStyle', e.target.value)}
                        className="input-romantic bg-noir-midnight"
                      >
                        <option value="gold">Gold Seal 💛</option>
                        <option value="crimson">Crimson Seal ❤️</option>
                        <option value="rose">Rose Gold Seal 🩷</option>
                      </select>
                    </Field>
                    <Field label="Envelope Opening Animation">
                      <select
                        value={form.envelopeOpenEffect}
                        onChange={e => update('envelopeOpenEffect', e.target.value)}
                        className="input-romantic bg-noir-midnight"
                      >
                        <option value="shimmer">Golden Shimmer ✨</option>
                        <option value="burst">Romantic Burst 💥</option>
                        <option value="fade">Ethereal Fade 💫</option>
                      </select>
                    </Field>
                  </div>
                  <Field label="Welcome Popup Text">
                    <input
                      value={form.welcomePopupText}
                      onChange={e => update('welcomePopupText', e.target.value)}
                      placeholder="Break the seal to view our love letter..."
                      className="input-romantic"
                    />
                  </Field>
                </Section>

                <Section title="✍️ Personal Letter Settings">
                  <Field label="Scroll Letter Message">
                    <textarea
                      value={form.letterMessage}
                      onChange={e => update('letterMessage', e.target.value)}
                      placeholder="Write your scroll letter here..."
                      rows={6}
                      className="input-romantic font-sans text-sm w-full p-3 resize-none"
                    />
                  </Field>
                  <Field label="Letter Quill Signature">
                    <input
                      value={form.quillSignature}
                      onChange={e => update('quillSignature', e.target.value)}
                      placeholder="Your signature (e.g. Julian)"
                      className="input-romantic"
                    />
                  </Field>
                  <Field label="Letter Background Music URL">
                    <input
                      value={form.letterMusicUrl}
                      onChange={e => update('letterMusicUrl', e.target.value)}
                      placeholder="https://..."
                      className="input-romantic mb-3"
                    />
                    <MediaUploader
                      projectId={id as string}
                      accept="audio"
                      maxFiles={1}
                      label="Upload letter music"
                      onUpload={({ url }) => update('letterMusicUrl', url)}
                    />
                  </Field>
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

                <Section title="💍 Promise Wall Settings">
                  <Field label="Promise Wall Header Title">
                    <input
                      value={form.promiseWallTitle}
                      onChange={e => update('promiseWallTitle', e.target.value)}
                      placeholder="My Romantic Vows To You"
                      className="input-romantic"
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Card Border Glow Style">
                      <select
                        value={form.promiseCardStyle}
                        onChange={e => update('promiseCardStyle', e.target.value)}
                        className="input-romantic bg-noir-midnight"
                      >
                        <option value="gold">Gold Glow 🌟</option>
                        <option value="velvet">Crimson Glow 💖</option>
                      </select>
                    </Field>
                    <div className="flex items-center justify-between p-3 glass-card mt-5">
                      <div>
                        <p className="text-rose-cream font-serif text-sm">Confetti on Complete</p>
                        <p className="text-rose-cream/30 text-xs font-sans">Burst confetti when all vows are clicked</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => update('confettiOnComplete', !form.confettiOnComplete)}
                        className={`w-12 h-6 rounded-full transition-all duration-300 relative ${form.confettiOnComplete ? 'bg-rose-blush' : 'bg-white/10'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${form.confettiOnComplete ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-white/10 pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <p className="font-serif text-sm text-rose-cream">Promise Cards (Max 6)</p>
                      <button
                        type="button"
                        disabled={(form.promises || []).length >= 6}
                        onClick={() => {
                          const current = form.promises || [];
                          update('promises', [...current, { emoji: '💍', text: '', secretNote: '' }]);
                        }}
                        className="text-xs font-sans px-3 py-1.5 rounded-lg border border-rose-cream/10 bg-white/5 hover:bg-white/10 text-rose-cream flex items-center gap-1 disabled:opacity-50"
                      >
                        <Plus size={12} /> Add Promise
                      </button>
                    </div>

                    <div className="space-y-4">
                      {(form.promises || []).map((p: any, idx: number) => (
                        <div key={idx} className="p-4 glass-card rounded-xl border border-white/5 space-y-3 relative">
                          <button
                            type="button"
                            onClick={() => {
                              const current = form.promises || [];
                              update('promises', current.filter((_: any, i: number) => i !== idx));
                            }}
                            className="absolute top-2 right-2 text-rose-cream/40 hover:text-red-400"
                          >
                            <Trash2 size={14} />
                          </button>
                          <div className="flex gap-3">
                            <div style={{ width: '80px' }}>
                              <label className="text-xs text-rose-cream/50">Emoji</label>
                              <select
                                value={p.emoji || '💍'}
                                onChange={e => {
                                  const current = [...(form.promises || [])];
                                  current[idx] = { ...current[idx], emoji: e.target.value };
                                  update('promises', current);
                                }}
                                className="input-romantic bg-noir-midnight text-sm mt-1"
                              >
                                {['💍', '🌹', '💑', '🕯️', '✉️', '✨', '💖', '🦋', '💝', '🎀'].map(em => (
                                  <option key={em} value={em}>{em}</option>
                                ))}
                              </select>
                            </div>
                            <div className="flex-1">
                              <label className="text-xs text-rose-cream/50">Vow Promise Text (Max 60 char)</label>
                              <input
                                value={p.text || ''}
                                maxLength={60}
                                onChange={e => {
                                  const current = [...(form.promises || [])];
                                  current[idx] = { ...current[idx], text: e.target.value };
                                  update('promises', current);
                                }}
                                placeholder="I promise to..."
                                className="input-romantic text-sm mt-1"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-xs text-rose-cream/50">Secret Note (Shown when card flips)</label>
                            <input
                              value={p.secretNote || ''}
                              onChange={e => {
                                const current = [...(form.promises || [])];
                                  current[idx] = { ...current[idx], secretNote: e.target.value };
                                  update('promises', current);
                              }}
                              placeholder="My hidden note..."
                              className="input-romantic text-xs mt-1"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Section>

                <Section title="📸 Gallery Settings">
                  <Field label="Gallery Section Title">
                    <input
                      value={form.galleryTitle}
                      onChange={e => update('galleryTitle', e.target.value)}
                      placeholder="Frames of our Lifetime"
                      className="input-romantic"
                    />
                  </Field>
                  <Field label="Romantic Quote Overlay">
                    <input
                      value={form.galleryQuote}
                      onChange={e => update('galleryQuote', e.target.value)}
                      placeholder="In your eyes, I have found my home."
                      className="input-romantic"
                    />
                  </Field>
                  <div className="flex items-center justify-between p-3 glass-card mb-4 mt-6">
                    <div>
                      <p className="text-rose-cream font-serif text-sm">Apply Romantic Sepia Filter</p>
                      <p className="text-rose-cream/30 text-xs font-sans">Give photos a warm film vintage aesthetic</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => update('sepiaFilter', !form.sepiaFilter)}
                      className={`w-12 h-6 rounded-full transition-all duration-300 relative ${form.sepiaFilter ? 'bg-rose-blush' : 'bg-white/10'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${form.sepiaFilter ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                  <Field label="Hero Featured Photo URL">
                    <input
                      value={form.featuredPhotoUrl}
                      onChange={e => update('featuredPhotoUrl', e.target.value)}
                      placeholder="https://..."
                      className="input-romantic mb-3"
                    />
                    <MediaUploader
                      projectId={id as string}
                      accept="image"
                      maxFiles={1}
                      label="Upload featured photo"
                      onUpload={({ url }) => update('featuredPhotoUrl', url)}
                    />
                  </Field>
                  <Field label="Featured Photo Caption">
                    <input
                      value={form.featuredPhotoCaption}
                      onChange={e => update('featuredPhotoCaption', e.target.value)}
                      placeholder="Us in Paris, Oct 2023 💕"
                      className="input-romantic"
                    />
                  </Field>
                </Section>

                <Section title="📊 Relationship Infographics">
                  <div className="flex items-center justify-between p-3 glass-card mb-6">
                    <div>
                      <p className="text-rose-cream font-serif text-sm">Show Love Stats Counters</p>
                      <p className="text-rose-cream/30 text-xs font-sans">Display counters and a distribution pie chart of your relationship</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => update('showStats', !form.showStats)}
                      className={`w-12 h-6 rounded-full transition-all duration-300 relative ${form.showStats ? 'bg-rose-blush' : 'bg-white/10'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${form.showStats ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>

                  {form.showStats && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 glass-card rounded-xl border border-white/5">
                          <label className="text-xs text-rose-cream/50">Stat 1 Label</label>
                          <input
                            value={form.customStatLabel1}
                            onChange={e => update('customStatLabel1', e.target.value)}
                            placeholder="Coffee dates"
                            className="input-romantic text-xs mt-1"
                          />
                          <label className="text-xs text-rose-cream/50 mt-2 block">Stat 1 Value</label>
                          <input
                            type="number"
                            value={form.customStatValue1}
                            onChange={e => update('customStatValue1', e.target.value)}
                            className="input-romantic text-xs mt-1"
                          />
                        </div>
                        <div className="p-3 glass-card rounded-xl border border-white/5">
                          <label className="text-xs text-rose-cream/50">Stat 2 Label</label>
                          <input
                            value={form.customStatLabel2}
                            onChange={e => update('customStatLabel2', e.target.value)}
                            placeholder="Late nights"
                            className="input-romantic text-xs mt-1"
                          />
                          <label className="text-xs text-rose-cream/50 mt-2 block">Stat 2 Value</label>
                          <input
                            type="number"
                            value={form.customStatValue2}
                            onChange={e => update('customStatValue2', e.target.value)}
                            className="input-romantic text-xs mt-1"
                          />
                        </div>
                        <div className="p-3 glass-card rounded-xl border border-white/5">
                          <label className="text-xs text-rose-cream/50">Stat 3 Label</label>
                          <input
                            value={form.customStatLabel3}
                            onChange={e => update('customStatLabel3', e.target.value)}
                            placeholder="Heartbeats skipped"
                            className="input-romantic text-xs mt-1"
                          />
                          <label className="text-xs text-rose-cream/50 mt-2 block">Stat 3 Value</label>
                          <input
                            type="number"
                            value={form.customStatValue3}
                            onChange={e => update('customStatValue3', e.target.value)}
                            className="input-romantic text-xs mt-1"
                          />
                        </div>
                      </div>

                      <div className="border-t border-white/10 pt-4">
                        <div className="flex items-center justify-between mb-4">
                          <p className="font-serif text-sm text-rose-cream">Pie Chart Distribution (Max 5)</p>
                          <button
                            type="button"
                            disabled={(form.loveCategories || []).length >= 5}
                            onClick={() => {
                              const current = form.loveCategories || [];
                              update('loveCategories', [...current, { label: '', percent: 20 }]);
                            }}
                            className="text-xs font-sans px-3 py-1.5 rounded-lg border border-rose-cream/10 bg-white/5 hover:bg-white/10 text-rose-cream flex items-center gap-1 disabled:opacity-50"
                          >
                            <Plus size={12} /> Add Item
                          </button>
                        </div>

                        <div className="space-y-3">
                          {(form.loveCategories || []).map((cat: any, idx: number) => (
                            <div key={idx} className="flex gap-3 items-center">
                              <input
                                value={cat.label || ''}
                                onChange={e => {
                                  const current = [...(form.loveCategories || [])];
                                  current[idx] = { ...current[idx], label: e.target.value };
                                  update('loveCategories', current);
                                }}
                                placeholder="Activity label (e.g. Sunset walks)"
                                className="input-romantic text-xs flex-1"
                              />
                              <div style={{ width: '80px' }}>
                                <input
                                  type="number"
                                  min={0}
                                  max={100}
                                  value={cat.percent}
                                  onChange={e => {
                                    const current = [...(form.loveCategories || [])];
                                    current[idx] = { ...current[idx], percent: Number(e.target.value) || 0 };
                                    update('loveCategories', current);
                                  }}
                                  placeholder="%"
                                  className="input-romantic text-xs text-center"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const current = form.loveCategories || [];
                                  update('loveCategories', current.filter((_: any, i: number) => i !== idx));
                                }}
                                className="text-rose-cream/40 hover:text-red-400 p-1"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </Section>

                <Section title="🎉 Grand Finale Settings">
                  <Field label="Closing Title">
                    <input
                      value={form.endingTitle}
                      onChange={e => update('endingTitle', e.target.value)}
                      placeholder="Forever Yours"
                      className="input-romantic"
                    />
                  </Field>
                  <Field label="Closing Heartfelt Message">
                    <textarea
                      value={form.endingMessage}
                      onChange={e => update('endingMessage', e.target.value)}
                      placeholder="Your final note..."
                      rows={3}
                      className="input-romantic resize-none"
                    />
                  </Field>
                  <Field label="Grand Finale Style">
                    <select
                      value={form.finaleStyle}
                      onChange={e => update('finaleStyle', e.target.value)}
                      className="input-romantic bg-noir-midnight"
                    >
                      <option value="all">Grand Finale (All Three) 🎆</option>
                      <option value="fireworks">Fireworks Only 🎇</option>
                      <option value="roseRain">Rose Rain Only 🌹</option>
                      <option value="confetti">Gold Confetti Only ✨</option>
                    </select>
                  </Field>
                </Section>
              </>
            )}
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

        {/* SELFIES TAB */}
        {activeTab === 'selfies' && (
          <motion.div key="selfies" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <Section title="Thank-You Selfies Received 📸">
              <p className="text-rose-cream/40 text-sm font-sans mb-6">
                Here are the thank-you selfies submitted by the recipient of your memory page!
              </p>

              {!project?.heroConfig?.selfies || project.heroConfig.selfies.length === 0 ? (
                <div className="text-center py-12 glass-card rounded-2xl">
                  <p className="text-rose-cream/30 font-serif text-lg">No selfies received yet 🐼</p>
                  <p className="text-rose-cream/20 font-sans text-xs mt-1">They will appear here once the recipient snaps or uploads a selfie at the end of the page!</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {project.heroConfig.selfies.map((s: any, idx: number) => (
                    <div key={idx} className="p-3 glass-card rounded-2xl border border-rose-cream/10 relative group flex flex-col justify-between">
                      <div className="aspect-square rounded-xl overflow-hidden border border-white/5 bg-black">
                        <img src={s.url} alt="selfie" className="w-full h-full object-cover" />
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[10px] text-rose-cream/40 font-sans">
                          {new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <button
                          onClick={async () => {
                            if (confirm('Are you sure you want to delete this selfie?')) {
                              try {
                                const updatedSelfies = project.heroConfig.selfies.filter((_: any, i: number) => i !== idx);
                                const updatedHeroConfig = { ...project.heroConfig, selfies: updatedSelfies };
                                await projectsAPI.update(project.id, { heroConfig: updatedHeroConfig });
                                setForm((f: any) => ({ ...f, selfies: updatedSelfies }));
                                setProject((p: any) => ({ ...p, heroConfig: updatedHeroConfig }));
                                toast.success('Selfie deleted');
                              } catch {
                                toast.error('Failed to delete selfie');
                              }
                            }
                          }}
                          className="text-red-400 hover:text-red-600 transition-colors p-1"
                        >
                          <Trash2 size={14} />
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
  const [form, setForm] = useState({ title: '', description: '', date: '', location: '', emoji: '', imageUrl: '' });

  const addMemory = async () => {
    if (!form.title || !form.date) { toast.error('Title and date are required'); return; }
    try {
      const { data } = await projectsAPI.addMemory(projectId, form);
      setMemories(prev => [...prev, data.memory]);
      setForm({ title: '', description: '', date: '', location: '', emoji: '', imageUrl: '' });
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
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 space-y-4">
          <h4 className="font-serif text-lg text-rose-cream">New Memory</h4>
          <input placeholder="Memory title *" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="input-romantic" />
          <textarea placeholder="Description..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} className="input-romantic resize-none" />
          <div className="grid grid-cols-3 gap-3">
            <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="input-romantic" style={{ colorScheme: 'dark' }} />
            <input placeholder="📍 Location" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className="input-romantic" />
            <input placeholder="Emoji" value={form.emoji} onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))} className="input-romantic" maxLength={2} />
          </div>
          
          <div className="space-y-1.5 p-3 rounded-xl bg-white/5 border border-white/5">
            <p className="text-rose-cream/50 text-xs font-sans font-semibold">Memory Image (Optional)</p>
            {form.imageUrl ? (
              <div className="flex items-center gap-3">
                <img src={form.imageUrl} className="w-12 h-12 object-cover rounded-lg border border-white/10" alt="Upload thumbnail" />
                <span className="text-xs text-green-400 font-sans font-semibold flex items-center gap-1">
                  ✓ Uploaded
                </span>
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, imageUrl: '' }))}
                  className="text-xs text-red-400 hover:text-red-300 font-sans ml-auto"
                >
                  Remove
                </button>
              </div>
            ) : (
              <MediaUploader
                projectId={projectId}
                accept="image"
                maxFiles={1}
                label="Choose a memory photo"
                onUpload={({ url }) => setForm(f => ({ ...f, imageUrl: url }))}
              />
            )}
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
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-serif text-rose-cream">{memory.title}</p>
                {memory.description && <p className="text-rose-cream/40 text-sm font-sans mt-1">{memory.description}</p>}
              </div>
              {memory.imageUrl && (
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <img src={memory.imageUrl} className="w-16 h-16 object-cover rounded-lg border border-white/10" alt="Memory thumbnail" />
                  <span className="text-[10px] text-green-400 font-sans uppercase tracking-wider font-bold">Uploaded</span>
                </div>
              )}
            </div>
            <p className="text-rose-cream/20 text-xs font-sans mt-2">
              {new Date(memory.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              {memory.location && ` · 📍 ${memory.location}`}
            </p>
          </div>
          <button onClick={() => deleteMemory(memory.id)}
            className="text-red-400/30 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 ml-auto">
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
  const [pastedUrl, setPastedUrl] = useState('');
  const [addingUrl, setAddingUrl] = useState(false);

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

  const handleAddUrl = async () => {
    if (!pastedUrl.trim()) return;
    const url = pastedUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('/')) {
      toast.error('Please enter a valid URL');
      return;
    }
    
    setAddingUrl(true);
    try {
      const isVideo = url.match(/\.(mp4|webm|ogg|mov|avi)($|\?)/i) || url.includes('/video/upload/') || url.includes('/video/');
      const mediaType = isVideo ? 'VIDEO' : 'IMAGE';

      const { data } = await projectsAPI.addGalleryItem(projectId, {
        mediaUrl: url,
        mediaType,
        sortOrder: items.length,
      });
      setItems(prev => [...prev, data.item]);
      setPastedUrl('');
      toast.success('URL added to gallery 🌟');
    } catch {
      toast.error('Failed to add URL');
    } finally {
      setAddingUrl(false);
    }
  };

  return (
    <div>
      <h3 className="font-serif text-xl text-rose-cream mb-5">Gallery</h3>
      <MediaUploader projectId={projectId} accept="all" maxFiles={20} label="Upload gallery photos & videos" onUpload={onUpload} />

      <div className="mt-4 p-4 glass-card border border-white/5 space-y-3">
        <p className="text-rose-cream font-serif text-sm">Paste Existing Image or Video URL</p>
        <p className="text-rose-cream/30 text-xs font-sans">Stop duplication! Paste your existing Cloudinary or web URLs directly here.</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={pastedUrl}
            onChange={e => setPastedUrl(e.target.value)}
            placeholder="Paste your image or video URL here (https://...)"
            className="input-romantic text-xs flex-1"
          />
          <button
            onClick={handleAddUrl}
            disabled={addingUrl || !pastedUrl.trim()}
            className="btn-romantic text-xs px-4 py-2 flex-shrink-0 disabled:opacity-50"
          >
            {addingUrl ? 'Adding...' : 'Add URL'}
          </button>
        </div>
      </div>

      {items.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {items.map((item) => (
            <div key={item.id} className="relative group rounded-xl overflow-hidden glass-card p-2">
              <div className="aspect-square rounded-lg overflow-hidden bg-black/5 relative">
                {item.mediaType === 'VIDEO' ? (
                  <>
                    <video src={item.mediaUrl} className="w-full h-full object-cover" muted playsInline />
                    <div className="absolute top-2 left-2 bg-black/50 rounded-md p-1">
                      <Film size={14} className="text-white" />
                    </div>
                  </>
                ) : (
                  <img src={item.mediaUrl} alt={item.caption || ''} className="w-full h-full object-cover" />
                )}
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
