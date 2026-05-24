'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Eye, Edit, Trash2, Globe, Lock, Calendar, Search, Filter, Sparkles } from 'lucide-react';
import { projectsAPI } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  theme: string;
  status: string;
  coverImageUrl: string | null;
  personOneName: string | null;
  personTwoName: string | null;
  occasion: string | null;
  viewCount: number;
  publishedAt: string | null;
  updatedAt: string;
  _count: { memories: number; galleryItems: number };
}

const themeColors: Record<string, string> = {
  ROMANTIC_GLOW: '#e8c4b8',
  CINEMATIC_MEMORIES: '#d4a654',
  SCRAPBOOK_LOVE: '#d4af7a',
  AURORA_DREAMS: '#8b5cf6',
  CELESTIAL_BIRTHDAY: '#ff69b4',
};

const themeNames: Record<string, string> = {
  ROMANTIC_GLOW: 'Romantic Glow',
  CINEMATIC_MEMORIES: 'Cinematic Memories',
  SCRAPBOOK_LOVE: 'Scrapbook Love',
  AURORA_DREAMS: 'Aurora Dreams',
  CELESTIAL_BIRTHDAY: 'Celestial Birthday',
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    projectsAPI.list().then(({ data }) => {
      setProjects(data.projects);
    }).catch(() => {
      toast.error('Failed to load projects');
    }).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await projectsAPI.delete(id);
      setProjects(prev => prev.filter(p => p.id !== id));
      toast.success('Project deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.personOneName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.personTwoName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-rose-cream">My Memories</h1>
          <p className="text-rose-cream/40 font-sans mt-1 sm:mt-2 text-sm sm:text-base">
            A collection of your beautiful stories.
          </p>
        </div>
        <Link href="/dashboard/create" className="btn-romantic self-start sm:self-auto">
          <Plus size={18} className="mr-2" />
          <span>New Memory</span>
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-cream/20" size={18} />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-romantic pl-12"
          />
        </div>
        <button className="btn-ghost flex items-center gap-2">
          <Filter size={18} />
          Filter
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="glass-card h-64 shimmer" />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="glass-card p-20 text-center">
          <p className="text-rose-cream/30 font-sans">No projects found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project, index, onDelete }: {
  project: Project;
  index: number;
  onDelete: (id: string, title: string) => void;
}) {
  const { user } = useAuth();
  const color = themeColors[project.theme] || '#e8c4b8';
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const isDemo = project.id.startsWith('demo-');
  const isAuthorized = user?.role === 'ADMIN' || user?.allowedTemplates?.includes(project.theme);

  const handleEditClick = (e: React.MouseEvent) => {
    if (isDemo) {
      e.preventDefault();
      if (isAuthorized) {
        toast.info("This is a read-only showcase demo. Click 'Use Theme' or 'New Memory' to create your own memory using this template!");
      } else {
        toast.error("Contact admin to authorise you for this premium template.");
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`glass-card overflow-hidden group relative ${isDemo ? 'border border-rose-blush/30' : ''}`}
    >
      {/* Cover */}
      <div className="h-40 relative overflow-hidden"
        style={{
          background: project.coverImageUrl
            ? `url(${project.coverImageUrl}) center/cover`
            : `linear-gradient(135deg, ${color}20, ${color}08)`,
        }}
      >
        <div className="absolute inset-0 cinematic-overlay opacity-60" />
        
        {/* Theme badge */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          <span className="text-xs font-sans px-3 py-1 rounded-full flex items-center gap-1 font-semibold"
            style={{
              background: 'rgba(0,0,0,0.65)',
              color,
              border: `1px solid ${color}40`,
              backdropFilter: 'blur(4px)',
            }}>
            {isDemo && <Sparkles size={10} className="animate-pulse" />}
            {themeNames[project.theme]}
          </span>
          {isDemo && (
            <span className="text-[10px] font-sans tracking-wider px-2 py-0.5 rounded bg-rose-950/80 border border-rose-500/30 text-rose-300 font-bold uppercase">
              SHOWCASE DEMO
            </span>
          )}
        </div>

        {/* Status / Auth Badge */}
        <div className="absolute top-3 right-3">
          {isDemo ? (
            <span className={`flex items-center gap-1 text-[10px] font-sans px-2.5 py-1 rounded-full font-semibold border ${
              isAuthorized 
                ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
            }`}>
              {isAuthorized ? '✓ Ready to Use' : '🔒 Locked (Request Access)'}
            </span>
          ) : (
            <span className={`flex items-center gap-1 text-xs font-sans px-2 py-1 rounded-full ${
              project.status === 'PUBLISHED' ? 'bg-green-500/20 text-green-300' :
              'bg-white/10 text-white/50'
            }`}>
              {project.status === 'PUBLISHED' ? <Globe size={10} /> : <Lock size={10} />}
              {project.status.charAt(0) + project.status.slice(1).toLowerCase()}
            </span>
          )}
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-serif text-lg text-rose-cream font-semibold truncate">{project.title}</h3>
        <p className="text-rose-cream/40 font-sans text-sm mt-1">
          {project.personOneName}{project.personTwoName ? ` & ${project.personTwoName}` : ''}
        </p>

        <div className="flex items-center gap-4 mt-3 text-rose-cream/30 text-xs font-sans">
          <span>{project._count.memories} memories</span>
          <span>{project.viewCount} views</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-5">
          {isDemo ? (
            <>
              <a
                href={`/memory/${project.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-sans px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-rose-cream/60 hover:text-rose-cream transition-all border border-white/5"
              >
                <Eye size={12} /> View Demo
              </a>
              {isAuthorized ? (
                <Link
                  href={`/dashboard/create?theme=${project.theme}`}
                  className="flex items-center gap-1.5 text-xs font-sans px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 transition-all border border-rose-500/30 font-semibold"
                >
                  <Sparkles size={12} /> Use Theme
                </Link>
              ) : (
                <button
                  onClick={() => toast.error("Contact admin to authorise you for this premium template.")}
                  className="flex items-center gap-1.5 text-xs font-sans px-3 py-1.5 rounded-lg bg-white/5 opacity-50 cursor-not-allowed text-rose-cream/40 border border-white/5"
                >
                  🔒 Locked
                </button>
              )}
            </>
          ) : (
            <>
              {project.status === 'PUBLISHED' && (
                <a
                  href={`${APP_URL}/memory/${project.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-sans px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-rose-cream/60 hover:text-rose-cream transition-all"
                >
                  <Eye size={12} /> View
                </a>
              )}
              <Link
                href={`/dashboard/edit/${project.id}`}
                onClick={handleEditClick}
                className="flex items-center gap-1.5 text-xs font-sans px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-rose-cream/60 hover:text-rose-cream transition-all"
              >
                <Edit size={12} /> Edit
              </Link>
              <button
                onClick={() => onDelete(project.id, project.title)}
                className="flex items-center gap-1.5 text-xs font-sans px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400/60 hover:text-red-400 transition-all ml-auto"
              >
                <Trash2 size={12} />
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
