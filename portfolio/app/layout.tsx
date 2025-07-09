import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import { DockNavigation } from '@/components/ui/DockNavigation';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Portfolio | Mechatronics Engineer & Creative Developer',
  description: 'Mechatronics Engineering student with 5+ years in motion design and creative development',
  keywords: ['mechatronics', 'engineering', 'motion design', '3D', 'portfolio', 'Tahactw'],
  openGraph: {
    title: 'Portfolio | Mechatronics Engineer',
    description: 'Explore my work in engineering and creative design',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="relative bg-bg-primary text-text-primary antialiased">
        <Providers>
          {children}
          <DockNavigation />
          <Toaster 
            position="bottom-right" 
            toastOptions={{
              className: 'glass',
              style: {
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid rgba(186, 170, 138, 0.2)',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}