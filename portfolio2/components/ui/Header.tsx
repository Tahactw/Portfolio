'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const navItems = [
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4">
      <div className="container mx-auto flex justify-between items-center p-2 glass-heavy rounded-2xl">
        <Link href="/" className="font-display text-xl font-bold tracking-wider hover:text-accent-cyan transition-colors">
          TAHA
        </Link>
        <nav className="hidden md:flex items-center gap-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'px-3 py-1 rounded-lg text-sm font-display uppercase tracking-widest transition-colors',
                pathname === item.href
                  ? 'text-accent-cyan'
                  : 'text-text-secondary hover:text-text-primary'
              )}
            >
              {item.label}
            </Link>
          ))}
          {mounted && (
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-text-secondary hover:text-text-primary"
              aria-label="Toggle theme"
            >
              {resolvedTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}
        </nav>
        <div className="md:hidden flex items-center">
            {mounted && (
                <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-text-secondary hover:text-text-primary"
                aria-label="Toggle theme"
                >
                {resolvedTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            )}
        </div>
      </div>
    </header>
  );
}