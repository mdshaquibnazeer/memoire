'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { 
  Users, FolderHeart, Globe, Image, UserCheck, 
  Trash2, ShieldCheck, KeyRound, Search, BookOpen, 
  X, Check, AlertCircle, Lock, Unlock, Settings, Clock, Ban, AlertTriangle, Eye 
} from 'lucide-react';
import { adminAPI } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

interface AdminStats {
  userCount: number;
  projectCount: number;
  publishedCount: number;
  mediaCount: number;
  pendingApprovalCount: number;
}

interface User {
  id: string;
  email: string;
  username: string;
  displayName: string | null;
  role: string;
  isEmailVerified: boolean;
  isApproved: boolean;
  isSuspended: boolean;
  allowedTemplates: string[];
  allowedDemoPreviews?: string[];
  themeExpirations: any;
  userLimits: any;
  createdAt: string;
  lastLoginAt: string | null;
  _count: { projects: number };
}

interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  theme: string;
  status: string;
  viewCount: number;
  createdAt: string;
  user: { email: string; username: string };
  _count: { memories: number; galleryItems: number };
}

const ALL_TEMPLATES = [
  { id: 'ROMANTIC_GLOW', name: 'Romantic Glow', emoji: '🌹' },
  { id: 'CINEMATIC_MEMORIES', name: 'Cinematic Memories', emoji: '🎞' },
  { id: 'SCRAPBOOK_LOVE', name: 'Scrapbook Love', emoji: '📖' },
  { id: 'AURORA_DREAMS', name: 'Aurora Dreams', emoji: '✨' },
  { id: 'CELESTIAL_BIRTHDAY', name: 'Celestial Birthday', emoji: '🎂' },
  { id: 'SWEET_DIARY', name: 'Sweet Diary Box', emoji: '🎁' },
];

export default function AdminCornerPage() {
  const { user: currentUser, loading: authLoading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'projects'>('dashboard');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);

  // Search/Filters
  const [userQuery, setUserQuery] = useState('');
  const [projectQuery, setProjectQuery] = useState('');

  // Modal State
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [allowedTemplatesState, setAllowedTemplatesState] = useState<string[]>([]);
  const [allowedDemoPreviewsState, setAllowedDemoPreviewsState] = useState<string[]>([]);
  const [themeExpirationsState, setThemeExpirationsState] = useState<any>({});
  const [userLimitsState, setUserLimitsState] = useState<any>({ maxProjects: 3, maxMemoriesPerProject: 10, maxGalleryItemsPerProject: 20 });
  const [savingTemplates, setSavingTemplates] = useState(false);

  // Check admin role
  useEffect(() => {
    if (!authLoading && (!currentUser || currentUser.role !== 'ADMIN')) {
      toast.error('Access denied. Administrator privileges required.');
      router.push('/dashboard');
    }
  }, [currentUser, authLoading, router]);

  const loadStats = async () => {
    try {
      const { data } = await adminAPI.getStats();
      setStats(data);
    } catch {
      toast.error('Failed to load system statistics');
    } finally {
      setLoadingStats(false);
    }
  };

  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      const { data } = await adminAPI.listUsers({ limit: 100 });
      setUsers(data.users);
    } catch {
      toast.error('Failed to load users list');
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadProjects = async () => {
    try {
      setLoadingProjects(true);
      const { data } = await adminAPI.getProjects({ limit: 100 });
      setProjects(data.projects);
    } catch {
      toast.error('Failed to load projects list');
    } finally {
      setLoadingProjects(false);
    }
  };

  useEffect(() => {
    if (currentUser?.role === 'ADMIN') {
      loadStats();
      loadUsers();
      loadProjects();
    }
  }, [currentUser]);

  // Actions
  const handleApproveUser = async (userId: string, name: string) => {
    try {
      await adminAPI.approveUser(userId);
      toast.success(`Account approved for ${name}!`);
      // Update local state
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, isApproved: true } : u));
      // Refresh stats
      loadStats();
    } catch {
      toast.error('Failed to approve user');
    }
  };

  const handleDeleteUser = async (userId: string, name: string) => {
    if (!confirm(`Are you absolutely sure you want to delete user "${name}" and all of their memory pages? This action is permanent.`)) {
      return;
    }
    try {
      await adminAPI.deleteUser(userId);
      toast.success(`User "${name}" has been deleted.`);
      setUsers(prev => prev.filter(u => u.id !== userId));
      setProjects(prev => prev.filter(p => p.user.username !== name));
      loadStats();
    } catch {
      toast.error('Failed to delete user');
    }
  };

  const handleDeleteProject = async (projectId: string, title: string) => {
    if (!confirm(`Are you absolutely sure you want to delete project "${title}"? This cannot be undone.`)) {
      return;
    }
    try {
      await adminAPI.deleteProject(projectId);
      toast.success(`Project "${title}" deleted successfully.`);
      setProjects(prev => prev.filter(p => p.id !== projectId));
      loadStats();
    } catch {
      toast.error('Failed to delete project');
    }
  };

  const handleToggleSuspendUser = async (userId: string, isSuspended: boolean, name: string) => {
    try {
      await adminAPI.suspendUser(userId, !isSuspended);
      toast.success(isSuspended ? `User ${name} unsuspended!` : `User ${name} suspended!`);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, isSuspended: !isSuspended } : u));
    } catch {
      toast.error('Failed to change suspension status');
    }
  };

  const handleToggleProjectStatus = async (projectId: string, currentStatus: string, title: string) => {
    const nextStatus = currentStatus === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      await adminAPI.toggleProjectStatus(projectId, nextStatus);
      toast.success(`Project "${title}" status set to ${nextStatus}`);
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status: nextStatus } : p));
    } catch {
      toast.error('Failed to update project status');
    }
  };

  const openTemplateModal = (user: User) => {
    setSelectedUser(user);
    setAllowedTemplatesState(user.allowedTemplates || []);
    setAllowedDemoPreviewsState(user.allowedDemoPreviews || ['ROMANTIC_GLOW', 'CINEMATIC_MEMORIES', 'AURORA_DREAMS', 'CELESTIAL_BIRTHDAY']);
    setThemeExpirationsState(user.themeExpirations || {});
    setUserLimitsState(user.userLimits || { maxProjects: 3, maxMemoriesPerProject: 10, maxGalleryItemsPerProject: 20 });
  };

  const closeTemplateModal = () => {
    setSelectedUser(null);
    setAllowedTemplatesState([]);
    setAllowedDemoPreviewsState([]);
    setThemeExpirationsState({});
    setUserLimitsState({ maxProjects: 3, maxMemoriesPerProject: 10, maxGalleryItemsPerProject: 20 });
  };

  const toggleTemplatePermission = (templateId: string) => {
    setAllowedTemplatesState(prev => 
      prev.includes(templateId)
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    );
  };

  const toggleDemoPreviewPermission = (templateId: string) => {
    setAllowedDemoPreviewsState(prev => 
      prev.includes(templateId)
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    );
  };

  const saveTemplatePermissions = async () => {
    if (!selectedUser) return;
    setSavingTemplates(true);
    try {
      await adminAPI.updateUserAccess(selectedUser.id, {
        allowedTemplates: allowedTemplatesState,
        allowedDemoPreviews: allowedDemoPreviewsState,
        themeExpirations: themeExpirationsState,
        userLimits: userLimitsState,
      });
      toast.success(`Access configurations updated for ${selectedUser.displayName || selectedUser.username}`);
      setUsers(prev => prev.map(u => u.id === selectedUser.id ? { 
        ...u, 
        allowedTemplates: allowedTemplatesState,
        allowedDemoPreviews: allowedDemoPreviewsState,
        themeExpirations: themeExpirationsState,
        userLimits: userLimitsState
      } : u));
      closeTemplateModal();
    } catch {
      toast.error('Failed to update access configurations');
    } finally {
      setSavingTemplates(false);
    }
  };

  // Filter lists
  const pendingUsers = users.filter(u => !u.isApproved);
  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(userQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(userQuery.toLowerCase()) ||
    (u.displayName && u.displayName.toLowerCase().includes(userQuery.toLowerCase()))
  );

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(projectQuery.toLowerCase()) ||
    p.slug.toLowerCase().includes(projectQuery.toLowerCase()) ||
    p.user.username.toLowerCase().includes(projectQuery.toLowerCase())
  );

  if (authLoading || !currentUser || currentUser.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-noir-midnight flex items-center justify-center">
        <div className="text-center">
          <div className="font-serif text-3xl text-gradient animate-pulse mb-2">Admin Security Check</div>
          <p className="text-rose-cream/30 font-sans text-sm">Validating administration tokens...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Title */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="font-script text-lg sm:text-xl text-rose-deep mb-1">administrative console</p>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-rose-cream flex items-center gap-2 sm:gap-3">
            <ShieldCheck className="text-rose-blush" size={24} /> Admin Corner
          </h1>
        </div>
        <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/5 self-start sm:self-auto">
          {(['dashboard', 'users', 'projects'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-sans capitalize transition-all duration-200 ${
                activeTab === tab 
                  ? 'text-noir-midnight font-bold' 
                  : 'text-rose-cream/60 hover:text-rose-cream'
              }`}
              style={activeTab === tab ? { background: 'linear-gradient(135deg, #e8c4b8, #c4a882)' } : {}}
            >
              {tab}
            </button>
          ))}
        </div>
      </motion.div>

      {/* TABS CONTENT */}
      <AnimatePresence mode="wait">
        {activeTab === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-8"
          >
            {/* Overview Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              {[
                { label: 'Total Accounts', value: stats?.userCount ?? 0, icon: Users, delay: 0 },
                { label: 'Total Projects', value: stats?.projectCount ?? 0, icon: FolderHeart, delay: 0.05 },
                { label: 'Published Pages', value: stats?.publishedCount ?? 0, icon: Globe, delay: 0.1 },
                { label: 'Media Uploads', value: stats?.mediaCount ?? 0, icon: Image, delay: 0.15 },
                { 
                  label: 'Pending Approvals', 
                  value: stats?.pendingApprovalCount ?? 0, 
                  icon: UserCheck, 
                  delay: 0.2, 
                  alert: (stats?.pendingApprovalCount ?? 0) > 0 
                },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: item.delay }}
                  className={`glass-card p-4 sm:p-5 relative overflow-hidden flex flex-col justify-between min-h-[100px] sm:min-h-[120px] ${
                    item.alert ? 'border-rose-wine/40 bg-rose-wine/5' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-rose-cream/40 font-sans text-xs uppercase tracking-wider">{item.label}</span>
                    <item.icon size={18} className={item.alert ? 'text-rose-deep animate-pulse' : 'text-rose-cream/30'} />
                  </div>
                  <div>
                    {loadingStats ? (
                      <div className="h-8 w-12 bg-white/10 rounded animate-pulse mt-2" />
                    ) : (
                      <p className={`font-serif text-3xl font-bold mt-2 ${
                        item.alert ? 'text-rose-deep' : 'text-gradient'
                      }`}>{item.value}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pending Approvals Section */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
                <AlertCircle size={20} className="text-amber-400" />
                <h2 className="font-serif text-xl text-rose-cream font-semibold">
                  Pending Account Registrations
                </h2>
                <span className="ml-2 px-2.5 py-0.5 text-xs font-bold rounded-full bg-amber-400/10 text-amber-300">
                  {pendingUsers.length} waiting
                </span>
              </div>

              {loadingUsers ? (
                <div className="space-y-3">
                  {[1, 2].map(i => (
                    <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : pendingUsers.length === 0 ? (
                <div className="py-8 text-center text-rose-cream/30 font-sans">
                  <Check size={28} className="mx-auto mb-2 text-green-400" />
                  <p>All accounts cleared! No pending approvals.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingUsers.map(user => (
                    <div 
                      key={user.id} 
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/[0.08] transition-all duration-300 gap-4"
                    >
                      <div>
                        <p className="font-serif text-base text-rose-cream font-semibold flex items-center gap-2">
                          {user.displayName || user.username}
                          <span className="text-xs font-sans text-rose-cream/40">(@{user.username})</span>
                        </p>
                        <p className="text-rose-cream/40 font-sans text-xs mt-1">Email: {user.email}</p>
                        <p className="text-rose-cream/30 font-sans text-[10px] mt-0.5">
                          Registered: {new Date(user.createdAt).toLocaleDateString()} at {new Date(user.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => handleApproveUser(user.id, user.displayName || user.username)}
                          className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-300 text-xs font-sans font-medium transition-all"
                        >
                          <Check size={14} /> Approve User
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id, user.displayName || user.username)}
                          className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/25 text-red-400 text-xs font-sans transition-all"
                        >
                          <Trash2 size={14} /> Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'users' && (
          <motion.div
            key="users"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-6"
          >
            {/* Controls */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-4 top-3.5 text-rose-cream/30" />
                <input
                  type="text"
                  placeholder="Search by name, username or email..."
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  className="input-romantic pl-12"
                />
              </div>
            </div>

            {/* Users table/list */}
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-white/5 text-rose-cream/40 font-sans text-xs uppercase tracking-wider">
                      <th className="p-4 pl-6">User details</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Projects</th>
                      <th className="p-4">Template access</th>
                      <th className="p-4 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingUsers ? (
                      [1, 2, 3].map(i => (
                        <tr key={i} className="border-b border-white/5 shimmer h-16" />
                      ))
                    ) : filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-rose-cream/30 font-sans">
                          No users found matching query.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map(user => (
                        <tr key={user.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors font-sans text-sm">
                          <td className="p-4 pl-6">
                            <p className="font-serif text-base text-rose-cream font-semibold">
                              {user.displayName || user.username}
                            </p>
                            <p className="text-xs text-rose-cream/40 mt-0.5">@{user.username} · {user.email}</p>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-col gap-1.5 items-start">
                              {user.isApproved ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-300 border border-green-500/15">
                                  Approved
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/15 animate-pulse">
                                  Pending Approval
                                </span>
                              )}
                              {user.isSuspended && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/15 text-red-300 border border-red-500/20">
                                  Suspended
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                              user.role === 'ADMIN' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-white/5 text-rose-cream/50'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="p-4 font-serif text-rose-cream">{user._count?.projects ?? 0}</td>
                          <td className="p-4">
                            <div className="flex flex-wrap gap-1 max-w-[180px]">
                              {user.role === 'ADMIN' ? (
                                <span className="text-xs text-rose-cream/40">Full Authorization</span>
                              ) : (user.allowedTemplates || []).length === 0 ? (
                                <span className="text-[10px] text-red-300 bg-red-500/10 px-1.5 py-0.5 rounded">None</span>
                              ) : (
                                (user.allowedTemplates || []).map(t => {
                                  const config = ALL_TEMPLATES.find(c => c.id === t);
                                  return (
                                    <span 
                                      key={t} 
                                      title={config?.name || t} 
                                      className="text-xs px-2 py-0.5 rounded bg-white/5 border border-white/5 text-rose-cream/70 cursor-help"
                                    >
                                      {config?.emoji || '❔'}
                                    </span>
                                  );
                                })
                              )}
                            </div>
                          </td>
                          <td className="p-4 pr-6 text-right">
                            <div className="flex gap-2 justify-end">
                              {user.role !== 'ADMIN' && (
                                <>
                                  <button
                                    onClick={() => openTemplateModal(user)}
                                    title="Unlock Templates"
                                    className="flex items-center gap-1.5 text-xs font-sans px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-rose-cream/60 hover:text-rose-cream transition-all border border-white/5"
                                  >
                                    <Settings size={12} /> Access Config
                                  </button>
                                  <button
                                    onClick={() => handleToggleSuspendUser(user.id, user.isSuspended, user.displayName || user.username)}
                                    title={user.isSuspended ? "Unsuspend Account" : "Suspend Account"}
                                    className={`flex items-center gap-1.5 text-xs font-sans px-3 py-1.5 rounded-lg border transition-all ${
                                      user.isSuspended 
                                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/20 hover:bg-amber-500/25' 
                                        : 'bg-red-500/10 text-red-400 border-red-500/15 hover:bg-red-500/20'
                                    }`}
                                  >
                                    <Ban size={12} /> {user.isSuspended ? "Unban" : "Ban"}
                                  </button>
                                  {!user.isApproved && (
                                    <button
                                      onClick={() => handleApproveUser(user.id, user.displayName || user.username)}
                                      className="flex items-center gap-1 text-xs font-sans px-3 py-1.5 rounded-lg bg-green-500/15 hover:bg-green-500/25 text-green-300 transition-all border border-green-500/20"
                                    >
                                      Approve
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleDeleteUser(user.id, user.displayName || user.username)}
                                    className="flex items-center justify-center p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'projects' && (
          <motion.div
            key="projects"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-6"
          >
            {/* Controls */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-4 top-3.5 text-rose-cream/30" />
                <input
                  type="text"
                  placeholder="Search by title, owner username or slug..."
                  value={projectQuery}
                  onChange={(e) => setProjectQuery(e.target.value)}
                  className="input-romantic pl-12"
                />
              </div>
            </div>

            {/* Projects list */}
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-white/5 text-rose-cream/40 font-sans text-xs uppercase tracking-wider">
                      <th className="p-4 pl-6">Project details</th>
                      <th className="p-4">Aesthetic theme</th>
                      <th className="p-4">Owner</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Views</th>
                      <th className="p-4 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingProjects ? (
                      [1, 2, 3].map(i => (
                        <tr key={i} className="border-b border-white/5 shimmer h-16" />
                      ))
                    ) : filteredProjects.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-rose-cream/30 font-sans">
                          No projects found matching query.
                        </td>
                      </tr>
                    ) : (
                      filteredProjects.map(project => (
                        <tr key={project.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors font-sans text-sm">
                          <td className="p-4 pl-6">
                            <p className="font-serif text-base text-rose-cream font-semibold">
                              {project.title}
                            </p>
                            <p className="text-xs text-rose-cream/40 mt-0.5">slug: {project.slug}</p>
                          </td>
                          <td className="p-4">
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs bg-white/5 border border-white/5 text-rose-cream/80">
                              {ALL_TEMPLATES.find(t => t.id === project.theme)?.emoji || '🌹'} {ALL_TEMPLATES.find(t => t.id === project.theme)?.name || project.theme}
                            </span>
                          </td>
                          <td className="p-4">
                            <p className="font-sans text-rose-cream">@{project.user.username}</p>
                            <p className="text-xs text-rose-cream/30 mt-0.5">{project.user.email}</p>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                              project.status === 'PUBLISHED' ? 'bg-green-500/10 text-green-300 border-green-500/15' :
                              project.status === 'SCHEDULED' ? 'bg-blue-500/10 text-blue-300 border-blue-500/15' :
                              'bg-white/5 text-rose-cream/50 border-white/5'
                            }`}>
                              {project.status}
                            </span>
                          </td>
                          <td className="p-4 font-serif text-rose-cream">{project.viewCount}</td>
                          <td className="p-4 pr-6 text-right">
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => handleToggleProjectStatus(project.id, project.status, project.title)}
                                className={`flex items-center gap-1.5 text-xs font-sans px-3 py-1.5 rounded-lg border transition-all ${
                                  project.status === 'PUBLISHED' 
                                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/15 hover:bg-amber-500/20'
                                    : 'bg-green-500/10 text-green-300 border-green-500/15 hover:bg-green-500/20'
                                }`}
                              >
                                {project.status === 'PUBLISHED' ? <Lock size={12} /> : <Unlock size={12} />}
                                {project.status === 'PUBLISHED' ? "Draft" : "Publish"}
                              </button>
                              {project.status === 'PUBLISHED' && (
                                <a
                                  href={`/memory/${project.slug}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1.5 text-xs font-sans px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-rose-cream/60 hover:text-rose-cream transition-all border border-white/5"
                                >
                                  View
                                </a>
                              )}
                              <button
                                onClick={() => handleDeleteProject(project.id, project.title)}
                                className="flex items-center justify-center p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all border border-red-500/15"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TEMPLATE AUTHORIZATION MODAL (MODERN SLIDE-IN) */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={closeTemplateModal}
              className="absolute inset-0 bg-noir-midnight"
            />
            {/* Modal */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg mx-4 p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/10 bg-noir-deep shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
              style={{
                background: 'linear-gradient(135deg, rgba(36,15,66,0.98), rgba(15,5,30,0.98))',
                backdropFilter: 'blur(30px)'
              }}
            >
              <button 
                onClick={closeTemplateModal}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-rose-cream/40 hover:text-rose-cream transition-all"
              >
                <X size={16} />
              </button>

              <div className="mb-6">
                <p className="font-script text-lg text-rose-deep mb-1">access & configuration</p>
                <h3 className="font-serif text-2xl text-rose-cream font-bold">Access Settings</h3>
                <p className="text-rose-cream/40 font-sans text-sm mt-1">
                  Manage theme authorizations, calendars and project resource quotas for <span className="text-rose-cream">@{selectedUser.username}</span>.
                </p>
              </div>

              {/* Scrollable Container */}
              <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-6 scrollbar-thin mb-8">
                {/* Theme Checkboxes List */}
                <div className="space-y-3">
                  <h4 className="font-serif text-base text-rose-cream font-semibold mb-2">Theme Access & Expirations</h4>
                  {ALL_TEMPLATES.map(template => {
                    const allowed = allowedTemplatesState.includes(template.id);
                    const isScrapbook = template.id === 'SCRAPBOOK_LOVE';
                    const expiry = themeExpirationsState[template.id] || '';
                    return (
                      <div 
                        key={template.id}
                        onClick={() => !isScrapbook && toggleTemplatePermission(template.id)}
                        className={`p-4 rounded-2xl border transition-all duration-300 ${
                          allowed 
                            ? 'border-rose-blush/30 bg-rose-blush/5' 
                            : 'border-white/5 bg-white/5 hover:bg-white/[0.08]'
                        } ${isScrapbook ? 'opacity-80 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{template.emoji}</span>
                            <div>
                              <span className="font-serif text-base text-rose-cream font-medium">{template.name}</span>
                              {isScrapbook && (
                                <span className="block text-[10px] text-rose-cream/30 font-sans mt-0.5">Baseline (Default Allowed)</span>
                              )}
                            </div>
                          </div>
                          
                          {/* Check Box Visual */}
                          <div 
                            className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                              allowed 
                                ? 'bg-rose-blush border-rose-blush' 
                                : 'border-white/20'
                            }`}
                          >
                            {allowed && <Check size={12} className="text-noir-midnight stroke-[3px]" />}
                          </div>
                        </div>

                        {allowed && !isScrapbook && (
                          <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between gap-4" onClick={(e) => e.stopPropagation()}>
                            <span className="text-xs text-rose-cream/40 flex items-center gap-1"><Clock size={12}/> Expires:</span>
                            <input 
                              type="datetime-local" 
                              value={expiry ? new Date(new Date(expiry).getTime() - new Date().getTimezoneOffset()*60000).toISOString().slice(0, 16) : ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setThemeExpirationsState((prev: any) => ({
                                  ...prev,
                                  [template.id]: val ? new Date(val).toISOString() : null
                                }));
                              }}
                              className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-rose-cream font-sans focus:outline-none focus:border-rose-blush/40"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Showcase Demo Previews Checkboxes List */}
                <div className="space-y-3 border-t border-white/10 pt-6">
                  <h4 className="font-serif text-base text-rose-cream font-semibold mb-2 flex items-center gap-2">
                    <Eye size={16} className="text-rose-blush" /> Showcase Demo Previews
                  </h4>
                  <p className="text-rose-cream/40 font-sans text-xs mb-3">
                    Select which premium theme showcase demo cards are visible on this user's dashboard.
                  </p>
                  {ALL_TEMPLATES.filter(t => t.id !== 'SCRAPBOOK_LOVE').map(template => {
                    const allowedPreview = allowedDemoPreviewsState.includes(template.id);
                    return (
                      <div 
                        key={`demo-${template.id}`}
                        onClick={() => toggleDemoPreviewPermission(template.id)}
                        className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                          allowedPreview 
                            ? 'border-rose-blush/30 bg-rose-blush/5' 
                            : 'border-white/5 bg-white/5 hover:bg-white/[0.08]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{template.emoji}</span>
                            <div>
                              <span className="font-serif text-base text-rose-cream font-medium">Showcase: {template.name}</span>
                              <span className="block text-[10px] text-rose-cream/30 font-sans mt-0.5">Demo Card on Dashboard</span>
                            </div>
                          </div>
                          
                          {/* Check Box Visual */}
                          <div 
                            className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                              allowedPreview 
                                ? 'bg-rose-blush border-rose-blush' 
                                : 'border-white/20'
                            }`}
                          >
                            {allowedPreview && <Check size={12} className="text-noir-midnight stroke-[3px]" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Quotas Section */}
                <div className="border-t border-white/10 pt-6">
                  <h4 className="font-serif text-base text-rose-cream font-semibold mb-4 flex items-center gap-2">
                    <Settings size={16} className="text-rose-blush" /> System & Resource Quotas
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-rose-cream/40 mb-1.5 uppercase font-sans tracking-wide">Max Projects</label>
                      <input 
                        type="number"
                        value={userLimitsState.maxProjects ?? 3}
                        onChange={(e) => setUserLimitsState((prev: any) => ({ ...prev, maxProjects: parseInt(e.target.value) || 0 }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-rose-cream font-serif focus:outline-none focus:border-rose-blush/40"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-rose-cream/40 mb-1.5 uppercase font-sans tracking-wide">Max Memories</label>
                      <input 
                        type="number"
                        value={userLimitsState.maxMemoriesPerProject ?? 10}
                        onChange={(e) => setUserLimitsState((prev: any) => ({ ...prev, maxMemoriesPerProject: parseInt(e.target.value) || 0 }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-rose-cream font-serif focus:outline-none focus:border-rose-blush/40"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-rose-cream/40 mb-1.5 uppercase font-sans tracking-wide">Max Gallery</label>
                      <input 
                        type="number"
                        value={userLimitsState.maxGalleryItemsPerProject ?? 20}
                        onChange={(e) => setUserLimitsState((prev: any) => ({ ...prev, maxGalleryItemsPerProject: parseInt(e.target.value) || 0 }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-rose-cream font-serif focus:outline-none focus:border-rose-blush/40"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={closeTemplateModal}
                  disabled={savingTemplates}
                  className="flex-1 btn-ghost"
                >
                  Cancel
                </button>
                <button
                  onClick={saveTemplatePermissions}
                  disabled={savingTemplates}
                  className="flex-1 btn-romantic py-3"
                >
                  <span>{savingTemplates ? 'Updating...' : 'Save Permissions'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
