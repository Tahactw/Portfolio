'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Briefcase, FolderOpen, Mail, Github, Youtube, Sun, Moon, Volume2, VolumeX } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useSound } from '@/hooks/useSound';
import { cn } from '@/lib/utils';

const navItems = [
  { id: 'home', label: 'Home', icon: Home, href: '/' },
  { id: 'experience', label: 'Experience', icon: Briefcase, href: '/experience' },
  { id: 'projects', label: 'Projects', icon: FolderOpen, href: '/projects' },
  { id: 'contact', label: 'Contact', icon: Mail, href: '/contact' },
];

const socialItems = [
  { id: 'github', label: 'GitHub', icon: Github, href: 'https://github.com/Tahactw' },
  { id: 'youtube', label: 'YouTube', icon: Youtube, href: 'https://www.youtube.com/@TahaAnimation2024' },
];

const DockItem = ({ item, isActive, onHover, onClick }: any) => {
  const Icon = item.icon;
  return (
    <motion.div
      whileHover={{ scale: 1.2, y: -8 }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={() => onHover(item.id)}
      className="relative p-2"
      onClick={onClick}
    >
      <div className={cn(
        "p-2 rounded-lg transition-all duration-300",
        isActive 
          ? "bg-accent-warm/20 text-accent-warm" 
          : "text-text-primary hover:bg-text-primary/10"
      )}>
        <Icon className="w-5 h-5" />
      </div>
    </motion.div>
  );
};

export function DockNavigation() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const { isMuted, toggleMute, playSound } = useSound();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleHover = (id: string) => {
    setHoveredId(id);
    playSound('dock-hover', { volume: 0.3 });
  };

  if (!mounted) return null;

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }} 
      transition={{ type: 'spring', stiffness: 300, damping: 30 }} 
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="glass-heavy rounded-2xl px-3 py-2 flex items-center gap-1" onMouseLeave={() => setHoveredId(null)}>
        {navItems.map(item => (
          <Link key={item.id} href={item.href}>
            <DockItem 
              item={item} 
              isActive={pathname === item.href} 
              onHover={handleHover} 
              onClick={() => playSound('dock-click')} 
            />
          </Link>
        ))}
        
        <div className="w-px h-8 bg-text-secondary/20 mx-1" />
        
        {socialItems.map(item => (
          <a key={item.id} href={item.href} target="_blank" rel="noopener noreferrer">
            <DockItem 
              item={item} 
              onHover={handleHover} 
              onClick={() => playSound('dock-click')} 
            />
          </a>
        ))}
        
        <div className="w-px h-8 bg-text-secondary/20 mx-1" />
        
        <DockItem 
          item={{ id: 'theme', icon: resolvedTheme === 'dark' ? Sun : Moon }} 
          onHover={handleHover} 
          onClick={() => { 
            setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'); 
            playSound('ui-toggle'); 
          }} 
        />
        
        <DockItem 
          item={{ id: 'mute', icon: isMuted ? VolumeX : Volume2 }} 
          onHover={handleHover} 
          onClick={() => { 
            toggleMute(); 
            playSound('ui-toggle'); 
          }} 
        />
        
        <AnimatePresence>
          {hoveredId && (
            <motion.div 
              layoutId="tooltip" 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: 5 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }} 
              className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-bg-secondary rounded text-xs whitespace-nowrap pointer-events-none"
            >
              {[
                ...navItems, 
                ...socialItems, 
                {id: 'theme', label: resolvedTheme === 'dark' ? 'Switch to Day' : 'Switch to Night'}, 
                {id: 'mute', label: isMuted ? 'Unmute' : 'Mute'}
              ].find(i => i.id === hoveredId)?.label}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}