'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutDashboard, FolderOpen, Plus, Settings, LogOut, Heart, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { AuthProvider } from '@/hooks/useAuth';

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-noir-midnight flex items-center justify-center">
        <div className="text-center">
          <div className="font-serif text-3xl text-gradient animate-pulse mb-2">Mémoire</div>
          <p className="text-rose-cream/30 font-sans text-sm">Loading your memories...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-noir-midnight flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-64 fixed top-0 left-0 bottom-0 z-40 flex flex-col"
        style={{
          background: 'rgba(26, 10, 46, 0.95)',
          borderRight: '1px solid rgba(232, 196, 184, 0.08)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Logo */}
        <div className="p-6 pb-8">
          <Link href="/">
            <span className="font-serif text-2xl text-gradient">Mémoire</span>
          </Link>
          <div className="mt-6 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-serif"
              style={{ background: 'linear-gradient(135deg, #e8c4b8, #c4a882)', color: '#1a0a2e' }}>
              {(user.displayName || user.username).charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-rose-cream text-sm font-serif">{user.displayName || user.username}</p>
              <p className="text-rose-cream/30 text-xs font-sans">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1">
          {[
            { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { href: '/dashboard/projects', icon: FolderOpen, label: 'My Projects' },
            { href: '/dashboard/create', icon: Plus, label: 'New Memory' },
            ...(user.role === 'ADMIN' ? [{ href: '/dashboard/admin', icon: Shield, label: 'Admin Corner' }] : []),
            { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
          ].map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-sans text-sm ${
                  active
                    ? 'text-noir-midnight font-medium'
                    : 'text-rose-cream/50 hover:text-rose-cream hover:bg-white/5'
                }`}
                style={active ? {
                  background: 'linear-gradient(135deg, #e8c4b8, #c4a882)',
                } : {}}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={async () => { await logout(); router.push('/'); }}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-rose-cream/40 hover:text-rose-cream hover:bg-white/5 transition-all duration-200 font-sans text-sm"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 min-h-screen">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DashboardContent>{children}</DashboardContent>
    </AuthProvider>
  );
}
