'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FolderOpen, Briefcase, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: Home, exact: true },
  { href: '/admin/projects', label: 'Projects', icon: FolderOpen },
  { href: '/admin/experience', label: 'Experience', icon: Briefcase },
];

export function AdminNav() {
  const pathname = usePathname();
  
  return (
    <nav className="w-64 bg-bg-secondary h-screen p-6 flex flex-col justify-between border-r border-text-secondary/10">
      <div>
        <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href) && item.href !== '/admin';
            return (
              <li key={item.href}>
                <Link 
                  href={item.href} 
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                    isActive 
                      ? "bg-accent-warm/20 text-accent-warm" 
                      : "hover:bg-text-primary/5 text-text-secondary hover:text-text-primary"
                  )}
                >
                  <item.icon className="w-5 h-5" /> 
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      
      <button 
        onClick={() => signOut({ callbackUrl: '/' })} 
        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-text-primary/5 text-text-secondary hover:text-text-primary transition-colors w-full"
      >
        <LogOut className="w-5 h-5" /> 
        Sign Out
      </button>
    </nav>
  );
}