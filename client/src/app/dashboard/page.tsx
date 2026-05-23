'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Eye, Edit, Trash2, Globe, Lock, Calendar } from 'lucide-react';
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
};

const themeNames: Record<string, string> = {
  ROMANTIC_GLOW: 'Romantic Glow',
  CINEMATIC_MEMORIES: 'Cinematic Memories',
  SCRAPBOOK_LOVE: 'Scrapbook Love',
  AURORA_DREAMS: 'Aurora Dreams',
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectsAPI.list({ limit: 6 }).then(({ data }) => {
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

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <p className="font-script text-xl text-rose-deep mb-1">welcome back</p>
        <h1 className="font-serif text-4xl font-bold text-rose-cream">
          {user?.displayName || user?.username}
        </h1>
        <p className="text-rose-cream/40 font-sans mt-2">
          {projects.length === 0
            ? 'Your stories are waiting to be told.'
            : `${projects.length} memor${projects.length === 1 ? 'y' : 'ies'} crafted`}
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { label: 'Total Memories', value: projects.length },
          { label: 'Published', value: projects.filter(p => p.status === 'PUBLISHED').length },
          { label: 'Total Views', value: projects.reduce((a, p) => a + p.viewCount, 0) },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-5 text-center"
          >
            <p className="font-serif text-3xl font-bold text-gradient">{stat.value}</p>
            <p className="text-rose-cream/40 font-sans text-sm mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl text-rose-cream">Recent Memories</h2>
        <Link href="/dashboard/projects" className="btn-ghost text-sm">View All</Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass-card h-64 shimmer" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-16 text-center"
        >
          <div className="text-5xl mb-4">🌹</div>
          <h3 className="font-serif text-2xl text-rose-cream mb-3">Your first memory awaits</h3>
          <p className="text-rose-cream/40 font-sans mb-8">
            Create a beautiful personalized website for someone you love.
          </p>
          <Link href="/dashboard/create" className="btn-romantic">
            <span>Create Your First Memory</span>
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              onDelete={handleDelete}
            />
          ))}

          {/* Create New */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: projects.length * 0.1 }}
          >
            <Link href="/dashboard/create" className="block">
              <div className="glass-card h-full min-h-[200px] flex flex-col items-center justify-center gap-3 border-dashed border-rose-blush/20 hover:border-rose-blush/40 transition-all duration-300 group cursor-pointer p-8">
                <div className="w-12 h-12 rounded-full border-2 border-dashed border-rose-blush/30 group-hover:border-rose-blush/60 flex items-center justify-center transition-colors">
                  <Plus size={24} className="text-rose-blush/50 group-hover:text-rose-blush transition-colors" />
                </div>
                <p className="font-serif text-rose-cream/40 group-hover:text-rose-cream/70 transition-colors">
                  New Memory
                </p>
              </div>
            </Link>
          </motion.div>
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
  const color = themeColors[project.theme] || '#e8c4b8';
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass-card overflow-hidden group"
    >
      {/* Cover */}
      <div className="h-36 relative overflow-hidden"
        style={{
          background: project.coverImageUrl
            ? `url(${project.coverImageUrl}) center/cover`
            : `linear-gradient(135deg, ${color}20, ${color}08)`,
        }}
      >
        <div className="absolute inset-0 cinematic-overlay opacity-60" />
        
        {/* Theme badge */}
        <div className="absolute top-3 left-3">
          <span className="text-xs font-sans px-3 py-1 rounded-full"
            style={{
              background: 'rgba(0,0,0,0.5)',
              color,
              border: `1px solid ${color}40`,
              backdropFilter: 'blur(4px)',
            }}>
            {themeNames[project.theme]}
          </span>
        </div>

        {/* Status */}
        <div className="absolute top-3 right-3">
          <span className={`flex items-center gap-1 text-xs font-sans px-2 py-1 rounded-full ${
            project.status === 'PUBLISHED' ? 'bg-green-500/20 text-green-300' :
            project.status === 'SCHEDULED' ? 'bg-blue-500/20 text-blue-300' :
            'bg-white/10 text-white/50'
          }`}>
            {project.status === 'PUBLISHED' ? <Globe size={10} /> :
             project.status === 'SCHEDULED' ? <Calendar size={10} /> :
             <Lock size={10} />}
            {project.status.charAt(0) + project.status.slice(1).toLowerCase()}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-serif text-lg text-rose-cream font-semibold truncate">{project.title}</h3>
        {project.personOneName && (
          <p className="text-rose-cream/40 font-sans text-sm mt-1">
            {project.personOneName}{project.personTwoName ? ` & ${project.personTwoName}` : ''}
          </p>
        )}

        <div className="flex items-center gap-4 mt-3 text-rose-cream/30 text-xs font-sans">
          <span>{project._count.memories} memories</span>
          <span>{project._count.galleryItems} photos</span>
          <span>{project.viewCount} views</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
        </div>
      </div>
    </motion.div>
  );
}
