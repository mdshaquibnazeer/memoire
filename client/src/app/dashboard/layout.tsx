'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, FolderOpen, Plus, Settings, LogOut, Heart, Shield, Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { AuthProvider } from '@/hooks/useAuth';

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

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

  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/dashboard/projects', icon: FolderOpen, label: 'My Projects' },
    { href: '/dashboard/create', icon: Plus, label: 'New Memory' },
    ...(user.role === 'ADMIN' ? [{ href: '/dashboard/admin', icon: Shield, label: 'Admin Corner' }] : []),
    { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
  ];

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-5 sm:p-6 pb-6 sm:pb-8">
        <Link href="/">
          <span className="font-serif text-2xl text-gradient">Mémoire</span>
        </Link>
        <div className="mt-5 sm:mt-6 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-serif flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #e8c4b8, #c4a882)', color: '#1a0a2e' }}>
            {(user.displayName || user.username).charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-rose-cream text-sm font-serif truncate">{user.displayName || user.username}</p>
            <p className="text-rose-cream/30 text-xs font-sans truncate">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 sm:px-4 space-y-1">
        {navItems.map((item) => {
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
      <div className="p-3 sm:p-4 border-t border-white/5">
        <button
          onClick={async () => { await logout(); router.push('/'); }}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-rose-cream/40 hover:text-rose-cream hover:bg-white/5 transition-all duration-200 font-sans text-sm"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-noir-midnight">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4"
        style={{
          background: 'rgba(13, 6, 20, 0.92)',
          borderBottom: '1px solid rgba(232, 196, 184, 0.08)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <Link href="/">
          <span className="font-serif text-xl text-gradient">Mémoire</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-xl text-rose-cream/60 hover:text-rose-cream hover:bg-white/5 transition-all"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-noir-midnight"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="lg:hidden fixed top-0 left-0 bottom-0 z-50 w-[280px] max-w-[85vw] flex flex-col"
              style={{
                background: 'rgba(26, 10, 46, 0.98)',
                borderRight: '1px solid rgba(232, 196, 184, 0.08)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="hidden lg:flex w-64 fixed top-0 left-0 bottom-0 z-40 flex-col"
        style={{
          background: 'rgba(26, 10, 46, 0.95)',
          borderRight: '1px solid rgba(232, 196, 184, 0.08)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <SidebarContent />
      </motion.aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        <div className="pt-16 lg:pt-0 p-4 sm:p-6 lg:p-8">
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
