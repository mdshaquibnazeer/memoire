import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/hooks/useAuth';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Mémoire — Where Memories Become Art',
    template: '%s | Mémoire',
  },
  description: 'Create cinematic, emotionally resonant websites for anniversaries, weddings, birthdays, and love stories.',
  keywords: ['memory website', 'anniversary website', 'love story', 'wedding memories', 'personalized website'],
  authors: [{ name: 'Mémoire' }],
  openGraph: {
    title: 'Mémoire — Where Memories Become Art',
    description: 'Create beautiful cinematic websites for your most precious moments.',
    type: 'website',
  },
  manifest: '/manifest.json',
  themeColor: '#1a0a2e',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              var theme = localStorage.getItem('theme') || 'dark';
              if (theme === 'light') {
                document.documentElement.classList.add('light');
              } else {
                document.documentElement.classList.remove('light');
              }
            } catch (e) {}
          })();
        `}} />
      </head>
      <body className="bg-noir-midnight text-rose-cream antialiased" suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster
          theme="dark"
          toastOptions={{
            style: {
              background: 'rgba(45, 22, 80, 0.95)',
              border: '1px solid rgba(232, 196, 184, 0.2)',
              color: '#f0e6d3',
              fontFamily: 'Cormorant Garamond, Georgia, serif',
            },
          }}
        />
      </body>
    </html>
  );
}
