import type { Metadata } from 'next';
import { Orbitron, Rajdhani } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import { Header } from '@/components/ui/Header'; // Import the new Header
import { Toaster } from 'react-hot-toast';

const orbitron = Orbitron({ 
  subsets: ['latin'],
  variable: '--font-orbitron',
  display: 'swap',
});

const rajdhani = Rajdhani({ 
  subsets: ['latin'],
  variable: '--font-rajdhani',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Portfolio | Taha Mohammed',
  description: 'The professional portfolio of Taha Mohammed, a Mechatronics Engineer and Creative Developer.',
  keywords: ['mechatronics', 'engineering', 'motion design', '3D', 'portfolio', 'Tahactw'],
  openGraph: {
    title: 'Portfolio | Taha Mohammed',
    description: 'Explore the work of Taha Mohammed in engineering and creative development.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${orbitron.variable} ${rajdhani.variable}`}>
      <body className="relative bg-arena-dark text-text-primary antialiased font-body">
        <Providers>
          <Header />
          <main>{children}</main>
          <Toaster 
            position="bottom-right" 
            toastOptions={{
              className: 'glass',
              style: {
                background: 'var(--color-arena-dark)',
                color: 'var(--color-text-primary)',
                border: '1px solid var(--color-arena-border)',
                fontFamily: 'var(--font-rajdhani)',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}