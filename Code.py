### `create_portfolio.py`
#!/usr/bin/env python3
import os
import re

# This script creates the complete folder and file structure for the portfolio website.
# It parses a single multi-line string containing all file contents.
#
# How to use:
# 1. Save this script as `create_portfolio.py`.
# 2. Run it from your terminal: `python3 create_portfolio.py`
# 3. A `portfolio` directory will be created in the same location.
# 4. `cd portfolio`, edit `.env.local`, then run `npm install` and `npm run dev`.

# --- All File Data ---
# The entire project structure is embedded in this multi-line string.
# It is parsed by the script to generate the files.
file_data_string = r"""
============================================================
BEGINNING OF FILE: portfolio/.env.local
============================================================
# --- .env.local ---
# This file contains your secret keys and environment variables.
# **DO NOT COMMIT THIS FILE TO GIT**
# Create this file in the root of your project.

# Authentication (generate a secret with: openssl rand -base64 32)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_super_secret_key_generated_with_openssl

# GitHub OAuth Provider
# Create an OAuth App on GitHub: https://github.com/settings/developers
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
# The GitHub username of the admin account
ADMIN_GITHUB_USERNAME=Tahactw

# Cloudinary (for image uploads)
# Get credentials from your Cloudinary dashboard: https://cloudinary.com/console
# You also need to create an "unsigned" upload preset and name it.
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset_name

# Contact Form Endpoint (using Formspree as an example)
# Create a form on https://formspree.io/ and get the endpoint URL
NEXT_PUBLIC_FORMSPREE_ENDPOINT=https://formspree.io/f/your_form_id
============================================================
END OF FILE: portfolio/.env.local
============================================================

============================================================
BEGINNING OF FILE: portfolio/.gitignore
============================================================
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# Dependencies
/node_modules
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build

# Misc
.DS_Store
*.pem

# Local Environment Variables
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Editor directories and files
.vscode
.idea
*.suo
*.ntvs*
*.njsproj
*.sln
*.swp
============================================================
END OF FILE: portfolio/.gitignore
============================================================

============================================================
BEGINNING OF FILE: portfolio/next.config.js
============================================================
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
============================================================
END OF FILE: portfolio/next.config.js
============================================================

============================================================
BEGINNING OF FILE: portfolio/tailwind.config.ts
============================================================
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        accent: {
          cyan: '#00ffff',
          purple: '#b300ff',
          pink: '#ff0080',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 255, 255, 0.5)',
        'glow-purple': '0 0 20px rgba(179, 0, 255, 0.5)',
        'glow-pink': '0 0 20px rgba(255, 0, 128, 0.5)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 10px currentColor' },
          '50%': { opacity: '0.8', boxShadow: '0 0 20px currentColor' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
============================================================
END OF FILE: portfolio/tailwind.config.ts
============================================================

============================================================
BEGINNING OF FILE: portfolio/tsconfig.json
============================================================
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
============================================================
END OF FILE: portfolio/tsconfig.json
============================================================

============================================================
BEGINNING OF FILE: portfolio/middleware.ts
============================================================
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // This function will only be executed if the user is authenticated.
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/admin/login',
      error: '/admin/login',
    },
  }
)

// This config ensures the middleware runs on all paths under /admin,
// except for the login page itself to avoid a redirect loop.
export const config = {
  matcher: ['/admin/((?!login).*)'],
}
============================================================
END OF FILE: portfolio/middleware.ts
============================================================

============================================================
BEGINNING OF FILE: portfolio/package.json
============================================================
{
  "name": "portfolio",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.6.0",
    "@next/font": "14.2.0",
    "@radix-ui/react-dialog": "^1.1.1",
    "@radix-ui/react-scroll-area": "^1.1.0",
    "@radix-ui/react-slot": "^1.1.0",
    "@react-three/drei": "^9.105.0",
    "@react-three/fiber": "^8.16.0",
    "class-variance-authority": "^0.7.0",
    "cloudinary": "^2.2.0",
    "clsx": "^2.1.0",
    "date-fns": "^3.6.0",
    "framer-motion": "^11.2.0",
    "gsap": "^3.12.5",
    "howler": "^2.2.4",
    "lucide-react": "^0.400.0",
    "next": "14.2.0",
    "next-auth": "^4.24.7",
    "next-cloudinary": "^6.6.0",
    "next-themes": "^0.3.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-hook-form": "^7.52.0",
    "sonner": "^1.5.0",
    "tailwind-merge": "^2.3.0",
    "tailwindcss-animate": "^1.0.7",
    "three": "^0.165.0",
    "zod": "^3.23.8",
    "zustand": "^4.5.0"
  },
  "devDependencies": {
    "@types/howler": "^2.2.11",
    "@types/node": "^20.14.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@types/three": "^0.165.0",
    "autoprefixer": "^10.4.19",
    "eslint": "^8.57.0",
    "eslint-config-next": "14.2.0",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.4.5"
  }
}
============================================================
END OF FILE: portfolio/package.json
============================================================

============================================================
BEGINNING OF FILE: portfolio/app/layout.tsx
============================================================
import './globals.css'
import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { SoundProvider } from '@/components/providers/SoundProvider'
import { DockNavigation } from '@/components/ui/DockNavigation'
import { Toaster } from '@/components/ui/Toast'
import { fonts } from './fonts'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Taha - Mechatronics Engineer & Creative Developer',
  description: 'Portfolio of Taha, a Mechatronics Engineering student with expertise in video editing, motion graphics, and creative development.',
  keywords: ['mechatronics', 'engineering', 'motion graphics', 'video editing', 'creative developer', 'portfolio', 'Taha', 'Next.js', 'React', 'Three.js'],
  authors: [{ name: 'Taha' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://your-domain.com', // Replace with your actual domain
    title: 'Taha - Portfolio',
    description: 'Explore my creative journey in engineering and design.',
    siteName: 'Taha Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Taha - Portfolio',
    description: 'Explore my creative journey in engineering and design.',
    // Add your Twitter handle: creator: '@yourhandle',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("font-sans antialiased", fonts.inter.variable)}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <SoundProvider>
              <main className="relative min-h-screen bg-background text-foreground">
                {children}
                <DockNavigation />
              </main>
              <Toaster />
            </SoundProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
============================================================
END OF FILE: portfolio/app/layout.tsx
============================================================

============================================================
BEGINNING OF FILE: portfolio/app/page.tsx
============================================================
'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { LoadingScreen } from '@/components/3d/LoadingScreen'

// Dynamically import the 3D World component to ensure it's client-side only
const World = dynamic(() => import('@/components/3d/World'), {
  ssr: false,
})

export default function HomePage() {
  return (
    <div className="w-full h-screen relative overflow-hidden bg-black">
      <Suspense fallback={<LoadingScreen />}>
        <World />
      </Suspense>
    </div>
  )
}
============================================================
END OF FILE: portfolio/app/page.tsx
============================================================

============================================================
BEGINNING OF FILE: portfolio/app/globals.css
============================================================
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 3.9%;
    --primary: 240 5.9% 10%;
    --primary-foreground: 0 0% 98%;
    --secondary: 240 4.8% 95.9%;
    --secondary-foreground: 240 5.9% 10%;
    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;
    --accent: 240 4.8% 95.9%;
    --accent-foreground: 240 5.9% 10%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 5.9% 90%;
    --input: 240 5.9% 90%;
    --ring: 240 10% 3.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    --card: 240 10% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 240 10% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 240 5.9% 10%;
    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;
    --accent: 240 3.7% 15.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
    --ring: 240 4.9% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

@layer utilities {
  .glow-text {
    text-shadow: 0 0 10px currentColor;
  }
  
  .glass {
    @apply backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10;
  }
  
  .neon-border {
    @apply border-2 border-accent-cyan shadow-glow-cyan;
  }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  @apply bg-transparent;
}

::-webkit-scrollbar-thumb {
  @apply bg-muted-foreground/30 rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-muted-foreground/50;
}

/* Loading animation */
.loading-dots {
  display: inline-flex;
  gap: 4px;
}

.loading-dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: currentColor;
  animation: loading-bounce 1.4s infinite ease-in-out both;
}

.loading-dots span:nth-child(1) {
  animation-delay: -0.32s;
}

.loading-dots span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes loading-bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}
============================================================
END OF FILE: portfolio/app/globals.css
============================================================

============================================================
BEGINNING OF FILE: portfolio/app/projects/page.tsx
============================================================
'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ProjectsGallery } from '@/components/sections/ProjectsGallery'
import type { Project } from '@/types'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch('/api/projects');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        // Sort projects by creation date, newest first
        const sortedProjects = (data.projects || []).sort((a: Project, b: Project) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setProjects(sortedProjects);
      } catch (error) {
        console.error("Failed to load projects:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-background pt-24 pb-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-accent-cyan to-accent-purple bg-clip-text text-transparent">
            Projects
          </h1>
          <p className="text-muted-foreground text-lg mb-12 max-w-2xl">
            A curated showcase of my work, from intricate mechatronic systems to dynamic motion graphics and creative web development.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loading-dots text-accent-cyan">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        ) : projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-muted-foreground text-lg">
              No projects have been added yet. Please check back soon!
            </p>
          </motion.div>
        ) : (
          <ProjectsGallery projects={projects} />
        )}
      </div>
    </div>
  )
}
============================================================
END OF FILE: portfolio/app/projects/page.tsx
============================================================

============================================================
BEGINNING OF FILE: portfolio/app/projects/[id]/page.tsx
============================================================
'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, Github, Youtube, ArrowLeft } from 'lucide-react'
import type { Project } from '@/types'

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProject() {
      if (!params.id) return
      try {
        const res = await fetch(`/api/projects/${params.id}`)
        if (!res.ok) throw new Error('Project not found')
        const data = await res.json()
        setProject(data)
      } catch (error) {
        console.error("Failed to load project details:", error)
        setProject(null)
      } finally {
        setLoading(false)
      }
    }
    fetchProject()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="loading-dots text-accent-cyan">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-4xl font-bold text-accent-pink mb-4">Project Not Found</h1>
        <p className="text-muted-foreground mb-8">The project you're looking for doesn't exist or has been moved.</p>
        <Link href="/projects" className="flex items-center gap-2 text-accent-cyan hover:underline">
          <ArrowLeft size={16} />
          Back to Projects
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-32">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/projects" className="flex items-center gap-2 text-muted-foreground hover:text-accent-cyan transition-colors">
            <ArrowLeft size={16} />
            Back to Projects
          </Link>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-accent-cyan to-accent-purple bg-clip-text text-transparent">
          {project.title}
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {project.tags.map(tag => (
            <span key={tag} className="px-3 py-1 text-xs font-medium rounded-full bg-muted text-muted-foreground">
              {tag}
            </span>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="relative aspect-video w-full rounded-lg overflow-hidden mb-8 shadow-lg shadow-black/20"
        >
          <Image src={project.thumbnail} alt={project.title} fill className="object-cover" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="prose dark:prose-invert max-w-none text-muted-foreground leading-relaxed"
        >
          <p>{project.description}</p>
        </motion.div>

        {project.links && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            {project.links.github && (
              <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg hover:bg-muted transition-colors">
                <Github size={16} /> GitHub
              </a>
            )}
            {project.links.live && (
              <a href={project.links.live} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg hover:bg-muted transition-colors">
                <ExternalLink size={16} /> Live Demo
              </a>
            )}
            {project.links.youtube && (
              <a href={project.links.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg hover:bg-muted transition-colors">
                <Youtube size={16} /> YouTube
              </a>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
============================================================
END OF FILE: portfolio/app/projects/[id]/page.tsx
============================================================

============================================================
BEGINNING OF FILE: portfolio/app/experience/page.tsx
============================================================
'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ExperienceTimeline } from '@/components/sections/ExperienceTimeline'
import type { Experience } from '@/types'

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchExperiences() {
      try {
        const res = await fetch('/api/experience')
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setExperiences(data.experiences || [])
      } catch (error) {
        console.error("Failed to load experiences:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchExperiences()
  }, [])

  return (
    <div className="min-h-screen bg-background pt-24 pb-32">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-accent-cyan to-accent-purple bg-clip-text text-transparent">
            Experience
          </h1>
          <p className="text-muted-foreground text-lg mb-12">
            My professional journey and key achievements in the world of engineering and creative media.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-semibold mb-6">About Me</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
            <p>
              I am a driven Mechatronics Engineering student with a deep-seated passion for the synergy between technology and creative expression. With over five years of hands-on experience in video editing, motion graphics, and graphic design, I have honed my skills across the Adobe Creative Suite—including Premiere Pro, After Effects, Photoshop, and Illustrator—as well as 3D modeling in Autodesk Maya.
            </p>
            <p>
              My unique approach combines the rigorous problem-solving mindset of an engineer with the compelling narrative power of a visual storyteller. I thrive on translating complex ideas into engaging content, from commercial advertisements and character animations to data-rich motion infographics. As a quick learner with meticulous attention to detail, I excel in collaborative, creative environments, always eager to push the boundaries of what's possible.
            </p>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
             <div className="loading-dots text-accent-cyan">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        ) : (
          <ExperienceTimeline experiences={experiences} />
        )}
      </div>
    </div>
  )
}
============================================================
END OF FILE: portfolio/app/experience/page.tsx
============================================================

============================================================
BEGINNING OF FILE: portfolio/app/contact/page.tsx
============================================================
'use client'

import { motion } from 'framer-motion'
import { ContactForm } from '@/components/sections/ContactForm'
import { Mail, MapPin } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-32 flex items-center">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-accent-cyan to-accent-purple bg-clip-text text-transparent">
              Get in Touch
            </h1>
            <p className="text-muted-foreground text-lg mb-12">
              Have a project in mind, a question, or just want to say hello? I'd love to hear from you. Let's create something amazing together.
            </p>
            
            <div className="space-y-6">
              <a href="mailto:taha222869@hu.edu.eg" className="flex items-center gap-4 text-muted-foreground group">
                <div className="p-3 rounded-lg glass group-hover:text-accent-cyan transition-colors">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Email</h3>
                  <p className="group-hover:text-accent-cyan transition-colors">taha222869@hu.edu.eg</p>
                </div>
              </a>
              
              <div className="flex items-center gap-4 text-muted-foreground group">
                 <div className="p-3 rounded-lg glass group-hover:text-accent-purple transition-colors">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Location</h3>
                  <p className="group-hover:text-accent-purple transition-colors">Cairo, Egypt</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="glass rounded-2xl p-8 shadow-2xl shadow-black/20"
          >
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
============================================================
END OF FILE: portfolio/app/contact/page.tsx
============================================================

============================================================
BEGINNING OF FILE: portfolio/app/admin/layout.tsx
============================================================
import { AdminNav } from "@/components/admin/AdminNav";
import { AuthProvider } from "@/components/providers/AuthProvider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <AdminNav />
        <main className="pt-24">
          {children}
        </main>
      </div>
    </AuthProvider>
  );
}
============================================================
END OF FILE: portfolio/app/admin/layout.tsx
============================================================

============================================================
BEGINNING OF FILE: portfolio/app/admin/page.tsx
============================================================
'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FolderOpen, Briefcase } from 'lucide-react'
import { LoadingScreen } from '@/components/3d/LoadingScreen'
import { redirect } from 'next/navigation'

export default function AdminDashboard() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/admin/login')
    },
  })

  if (status === 'loading') {
    return <div className="fixed inset-0 bg-background z-50"><LoadingScreen /></div>
  }

  const cards = [
    {
      title: 'Manage Projects',
      description: 'Add, edit, or remove projects from your portfolio.',
      icon: FolderOpen,
      href: '/admin/projects',
      color: 'from-accent-purple to-accent-pink',
    },
    {
      title: 'Manage Experience',
      description: 'Update your professional timeline and achievements.',
      icon: Briefcase,
      href: '/admin/experience',
      color: 'from-accent-cyan to-accent-purple',
    },
  ]

  return (
    <div className="pb-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Welcome back, {session?.user?.name || 'Admin'}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {cards.map((card, index) => {
            const Icon = card.icon
            
            return (
              <motion.div
                key={card.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
              >
                <Link href={card.href}>
                  <div className="h-full glass rounded-2xl p-8 cursor-pointer group border-2 border-transparent hover:border-accent-cyan transition-all duration-300">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${card.color} flex items-center justify-center mb-6 shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold mb-2 group-hover:text-accent-cyan transition-colors">
                      {card.title}
                    </h2>
                    <p className="text-muted-foreground">
                      {card.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
============================================================
END OF FILE: portfolio/app/admin/page.tsx
============================================================

============================================================
BEGINNING OF FILE: portfolio/app/admin/login/page.tsx
============================================================
'use client'

import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Github, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function LoginPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/admin')
    }
  }, [status, router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-black bg-grid-cyan-500/[0.2]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm p-8 space-y-8 glass rounded-2xl shadow-lg shadow-black/50"
      >
        <div className="text-center space-y-2">
          <LogIn className="mx-auto h-12 w-12 text-accent-cyan"/>
          <h1 className="text-3xl font-bold text-white">Admin Access</h1>
          <p className="text-muted-foreground">
            Please sign in to manage the portfolio.
          </p>
        </div>
        <Button
          onClick={() => signIn('github')}
          disabled={status === 'loading'}
          className="w-full"
          variant="secondary"
          size="lg"
        >
          {status === 'loading' ? (
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          ) : (
            <>
              <Github className="mr-2 h-5 w-5" />
              Sign in with GitHub
            </>
          )}
        </Button>
      </motion.div>
    </div>
  )
}
============================================================
END OF FILE: portfolio/app/admin/login/page.tsx
============================================================

============================================================
BEGINNING OF FILE: portfolio/app/admin/projects/page.tsx
============================================================
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

import { ProjectForm } from '@/components/admin/ProjectForm'
import { Button } from '@/components/ui/Button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog'
import { LoadingScreen } from '@/components/3d/LoadingScreen'
import type { Project } from '@/types'

export default function AdminProjectsPage() {
  const { status } = useSession({
    required: true,
    onUnauthenticated: () => redirect('/admin/login'),
  })
  
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/projects')
      const data = await response.json()
      const sorted = (data.projects || []).sort((a: Project, b: Project) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setProjects(sorted)
    } catch (error) {
      toast.error('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) return

    const originalProjects = [...projects]
    setProjects(projects.filter(p => p.id !== id))
    const toastId = toast.loading('Deleting project...')

    try {
      const response = await fetch(`/api/projects/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete')
      toast.success('Project deleted successfully', { id: toastId })
    } catch (error) {
      toast.error('Failed to delete project. Reverting changes.', { id: toastId })
      setProjects(originalProjects)
    }
  }

  const openForm = (project: Project | null = null) => {
    setEditingProject(project)
    setIsDialogOpen(true)
  }

  const handleFormSuccess = () => {
    setIsDialogOpen(false)
    setEditingProject(null)
    fetchProjects()
  }
  
  if (status === 'loading') return <div className="fixed inset-0 bg-background z-50"><LoadingScreen /></div>

  return (
    <div className="pb-32">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold mb-2">Manage Projects</h1>
            <p className="text-muted-foreground">Add, edit, or remove your portfolio projects.</p>
          </motion.div>
          <Button onClick={() => openForm()}>
            <Plus className="w-5 h-5 mr-2" />
            Add Project
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-10"><div className="loading-dots text-accent-cyan inline-flex" /></div>
        ) : projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 glass rounded-2xl"
          >
            <p className="text-muted-foreground text-lg mb-4">No projects yet. Add your first one!</p>
            <Button variant="link" onClick={() => openForm()} className="text-accent-cyan">Add Project</Button>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass rounded-xl overflow-hidden group flex flex-col"
              >
                <div className="aspect-video relative overflow-hidden">
                  <Image
                    src={project.thumbnail || '/placeholder.svg'}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold mb-2 truncate">{project.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-grow">{project.description}</p>
                  <div className="flex gap-2 mt-auto">
                    <Button variant="secondary" size="sm" className="flex-1" onClick={() => openForm(project)}>
                      <Edit className="w-4 h-4 mr-1" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" className="flex-1" onClick={() => handleDelete(project.id)}>
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[625px] glass">
            <DialogHeader>
              <DialogTitle>{editingProject ? 'Edit Project' : 'Add New Project'}</DialogTitle>
            </DialogHeader>
            <ProjectForm
              project={editingProject}
              onSuccess={handleFormSuccess}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
============================================================
END OF FILE: portfolio/app/admin/projects/page.tsx
============================================================

============================================================
BEGINNING OF FILE: portfolio/app/admin/projects/[id]/page.tsx
============================================================
// This page is for directly navigating to an edit page.
// The primary UX is modal-based, but this supports direct links.
// It re-uses the main admin projects page logic for consistency.
'use client'

import AdminProjectsPage from '../page'

export default function EditProjectPage() {
    return <AdminProjectsPage />
}
============================================================
END OF FILE: portfolio/app/admin/projects/[id]/page.tsx
============================================================

============================================================
BEGINNING OF FILE: portfolio/app/admin/experience/page.tsx
============================================================
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

import { ExperienceForm } from '@/components/admin/ExperienceForm'
import { Button } from '@/components/ui/Button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { LoadingScreen } from '@/components/3d/LoadingScreen'
import type { Experience } from '@/types'

export default function AdminExperiencePage() {
  const { status } = useSession({
    required: true,
    onUnauthenticated: () => redirect('/admin/login'),
  })

  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null)

  useEffect(() => {
    fetchExperiences()
  }, [])

  const fetchExperiences = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/experience')
      const data = await response.json()
      setExperiences(data.experiences || [])
    } catch (error) {
      toast.error('Failed to load experiences')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience?')) return

    const originalExperiences = [...experiences]
    setExperiences(experiences.filter(e => e.id !== id))
    const toastId = toast.loading('Deleting experience...')

    try {
      const response = await fetch(`/api/experience/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete')
      toast.success('Experience deleted successfully', { id: toastId })
    } catch (error) {
      toast.error('Failed to delete experience. Reverting changes.', { id: toastId })
      setExperiences(originalExperiences)
    }
  }

  const openForm = (experience: Experience | null = null) => {
    setEditingExperience(experience)
    setIsDialogOpen(true)
  }

  const handleFormSuccess = () => {
    setIsDialogOpen(false)
    setEditingExperience(null)
    fetchExperiences()
  }

  if (status === 'loading') return <div className="fixed inset-0 bg-background z-50"><LoadingScreen /></div>

  return (
    <div className="pb-32">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold mb-2">Manage Experience</h1>
            <p className="text-muted-foreground">Update your professional timeline.</p>
          </motion.div>
          <Button onClick={() => openForm()}>
            <Plus className="w-5 h-5 mr-2" />
            Add Experience
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-10"><div className="loading-dots text-accent-cyan inline-flex" /></div>
        ) : experiences.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 glass rounded-2xl"
          >
            <p className="text-muted-foreground text-lg mb-4">No experience entries yet. Add your first one!</p>
            <Button variant="link" onClick={() => openForm()} className="text-accent-cyan">Add Experience</Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass rounded-xl p-4 flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-semibold">{exp.role}</h3>
                  <p className="text-muted-foreground">{exp.company} &bull; {exp.duration}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="icon" onClick={() => openForm(exp)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(exp.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[625px] glass">
            <DialogHeader>
              <DialogTitle>{editingExperience ? 'Edit Experience' : 'Add New Experience'}</DialogTitle>
            </DialogHeader>
            <ExperienceForm
              experience={editingExperience}
              onSuccess={handleFormSuccess}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
============================================================
END OF FILE: portfolio/app/admin/experience/page.tsx
============================================================

============================================================
BEGINNING OF FILE: portfolio/app/api/auth/[...nextauth]/route.ts
============================================================
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
============================================================
END OF FILE: portfolio/app/api/auth/[...nextauth]/route.ts
============================================================

============================================================
BEGINNING OF FILE: portfolio/app/api/projects/route.ts
============================================================
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { readData, writeData } from '@/lib/data'
import type { Project } from '@/types'

export async function GET() {
  try {
    const data = await readData('projects.json')
    return NextResponse.json({ projects: data.projects || [] })
  } catch (error) {
    // If file doesn't exist, return empty array
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return NextResponse.json({ projects: [] })
    }
    console.error('API_PROJECTS_GET_ERROR:', error);
    return NextResponse.json({ message: 'Error reading projects data' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const newProjectData: Omit<Project, 'id' | 'createdAt'> = await request.json()
    const data = await readData('projects.json')
    
    const newProject: Project = {
      id: Date.now().toString(),
      ...newProjectData,
      createdAt: new Date().toISOString(),
    }
    
    const updatedProjects = [newProject, ...(data.projects || [])];
    
    await writeData('projects.json', { projects: updatedProjects })
    
    return NextResponse.json(newProject, { status: 201 })
  } catch (error) {
    console.error('API_PROJECTS_POST_ERROR:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}
============================================================
END OF FILE: portfolio/app/api/projects/route.ts
============================================================

============================================================
BEGINNING OF FILE: portfolio/app/api/projects/[id]/route.ts
============================================================
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { readData, writeData } from '@/lib/data'
import type { Project } from '@/types'

// GET a single project by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const data = await readData('projects.json')
    const project = (data.projects || []).find((p: Project) => p.id === id)

    if (project) {
      return NextResponse.json(project)
    } else {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
  } catch (error) {
    console.error('API_PROJECT_GET_ID_ERROR:', error)
    return NextResponse.json({ error: 'Failed to retrieve project' }, { status: 500 })
  }
}


// UPDATE a project by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = params
    const updatedProjectData: Partial<Project> = await request.json()
    const data = await readData('projects.json')
    
    let projectFound = false
    const updatedProjects = (data.projects || []).map((p: Project) => {
      if (p.id === id) {
        projectFound = true
        return { ...p, ...updatedProjectData, id } // Ensure ID is not changed
      }
      return p
    })

    if (!projectFound) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    
    await writeData('projects.json', { projects: updatedProjects })
    
    return NextResponse.json({ message: 'Project updated successfully' })
  } catch (error) {
    console.error('API_PROJECTS_PUT_ERROR:', error)
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
}

// DELETE a project by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = params
    const data = await readData('projects.json')
    
    const initialCount = (data.projects || []).length;
    const updatedProjects = (data.projects || []).filter((p: Project) => p.id !== id)
    
    if (updatedProjects.length === initialCount) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    await writeData('projects.json', { projects: updatedProjects })
    
    return NextResponse.json({ message: 'Project deleted successfully' })
  } catch (error) {
    console.error('API_PROJECTS_DELETE_ERROR:', error)
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
  }
}
============================================================
END OF FILE: portfolio/app/api/projects/[id]/route.ts
============================================================

============================================================
BEGINNING OF FILE: portfolio/app/api/experience/route.ts
============================================================
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { readData, writeData } from '@/lib/data'
import type { Experience } from '@/types'

export async function GET() {
  try {
    const data = await readData('experience.json')
    return NextResponse.json({ experiences: data.experiences || [] })
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return NextResponse.json({ experiences: [] })
    }
    console.error('API_EXPERIENCE_GET_ERROR:', error);
    return NextResponse.json({ message: 'Error reading experience data' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const newExperienceData: Omit<Experience, 'id'> = await request.json()
    const data = await readData('experience.json')
    
    const newExperience: Experience = {
      id: Date.now().toString(),
      ...newExperienceData,
    }
    
    const updatedExperiences = [newExperience, ...(data.experiences || [])]
    
    await writeData('experience.json', { experiences: updatedExperiences })
    
    return NextResponse.json(newExperience, { status: 201 })
  } catch (error) {
    console.error('API_EXPERIENCE_POST_ERROR:', error);
    return NextResponse.json({ error: 'Failed to create experience' }, { status: 500 })
  }
}
============================================================
END OF FILE: portfolio/app/api/experience/route.ts
============================================================

============================================================
BEGINNING OF FILE: portfolio/app/api/experience/[id]/route.ts
============================================================
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { readData, writeData } from '@/lib/data'
import type { Experience } from '@/types'

// UPDATE an experience by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = params
    const updatedExperienceData: Partial<Experience> = await request.json()
    const data = await readData('experience.json')
    
    let experienceFound = false
    const updatedExperiences = (data.experiences || []).map((exp: Experience) => {
      if (exp.id === id) {
        experienceFound = true
        return { ...exp, ...updatedExperienceData, id }
      }
      return exp
    })

    if (!experienceFound) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 })
    }
    
    await writeData('experience.json', { experiences: updatedExperiences })
    
    return NextResponse.json({ message: 'Experience updated successfully' })
  } catch (error) {
    console.error('API_EXPERIENCE_PUT_ERROR:', error)
    return NextResponse.json({ error: 'Failed to update experience' }, { status: 500 })
  }
}

// DELETE an experience by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = params
    const data = await readData('experience.json')
    
    const initialCount = (data.experiences || []).length
    const updatedExperiences = (data.experiences || []).filter((exp: Experience) => exp.id !== id)
    
    if (updatedExperiences.length === initialCount) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 })
    }

    await writeData('experience.json', { experiences: updatedExperiences })
    
    return NextResponse.json({ message: 'Experience deleted successfully' })
  } catch (error) {
    console.error('API_EXPERIENCE_DELETE_ERROR:', error)
    return NextResponse.json({ error: 'Failed to delete experience' }, { status: 500 })
  }
}
============================================================
END OF FILE: portfolio/app/api/experience/[id]/route.ts
============================================================

============================================================
BEGINNING OF FILE: portfolio/app/api/contact/route.ts
============================================================
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(5),
  message: z.string().min(10),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsedData = contactSchema.safeParse(body)

    if (!parsedData.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT
    if (!endpoint) {
      console.error('Formspree endpoint is not configured.')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(parsedData.data),
    })

    if (response.ok) {
      return NextResponse.json({ message: 'Message sent successfully!' })
    } else {
      const errorData = await response.json()
      console.error('Formspree submission error:', errorData)
      return NextResponse.json({ error: 'Failed to send message via Formspree' }, { status: response.status })
    }

  } catch (error) {
    console.error('API_CONTACT_ERROR:', error)
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}
============================================================
END OF FILE: portfolio/app/api/contact/route.ts
============================================================

============================================================
BEGINNING OF FILE: portfolio/app/fonts.ts
============================================================
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const fonts = {
  inter,
}
============================================================
END OF FILE: portfolio/app/fonts.ts
============================================================

============================================================
BEGINNING OF FILE: portfolio/components/3d/World.tsx
============================================================
'use client'

import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera, Environment, Preload } from '@react-three/drei'
import { Suspense, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSound } from '@/hooks/useSound'
import { use3DStore } from '@/hooks/use3DStore'
import * as THREE from 'three'

import { Robot } from './Robot'
import { Buildings } from './Buildings'
import { Environment as CityEnvironment } from './Environment'
import { CameraController } from './CameraController'

export default function World() {
  const router = useRouter()
  const { playSound } = useSound()
  const { setTargetPosition, setSelectedBuilding } = use3DStore()

  // Reset state on mount in case of browser back navigation
  useEffect(() => {
    setSelectedBuilding(null)
    setTargetPosition({ x: 0, y: 0, z: 0 })
  }, [setSelectedBuilding, setTargetPosition])

  const handleBuildingClick = (building: 'projects' | 'experience' | 'contact', position: [number, number, number]) => {
    setSelectedBuilding(building)
    
    // Set target for robot to walk towards the building
    const targetVector = new THREE.Vector3(...position)
    const direction = targetVector.normalize()
    const offset = direction.multiplyScalar(5) // Stand 5 units away from the building center
    setTargetPosition({ x: targetVector.x - offset.x, y: 0, z: targetVector.z - offset.z });
    
    playSound('building-enter')
    
    // Animate camera and then navigate
    setTimeout(() => {
      router.push(`/${building}`)
    }, 1200) // Allow time for camera zoom
  }

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      className="cursor-grab active:cursor-grabbing"
    >
      <PerspectiveCamera 
        makeDefault 
        position={[0, 4, 15]} 
        fov={60}
      />
      
      <CameraController />
      
      <fog attach="fog" args={['#0a0a0a', 15, 60]} />
      <color attach="background" args={['#0a0a0a']} />
      
      <ambientLight intensity={0.2} />
      <hemisphereLight intensity={0.2} groundColor="black" />
      <directionalLight
        position={[10, 15, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />
      
      <Suspense fallback={null}>
        <group position={[0, -1, 0]}>
          <Robot />
          <Buildings onBuildingClick={handleBuildingClick} />
          <CityEnvironment />
        </group>
        <Environment preset="city" />
        <Preload all />
      </Suspense>
    </Canvas>
  )
}
============================================================
END OF FILE: portfolio/components/3d/World.tsx
============================================================

============================================================
BEGINNING OF FILE: portfolio/components/3d/Robot.tsx
============================================================
'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Box, useGLTF } from '@react-three/drei'
import { Group, Vector3, AnimationMixer, LoopOnce, Quaternion, Euler } from 'three'
import { use3DStore } from '@/hooks/use3DStore'
import { useSound } from '@/hooks/useSound'

// Note: Using primitive shapes as a fallback.
// To use a real model, add `robot.glb` to your `/public/models/` directory.
export function Robot() {
  const robotRef = useRef<Group>(null!)
  const { targetPosition } = use3DStore()
  const { playSound, stopSound, isPlaying } = useSound()

  useFrame((state, delta) => {
    if (!robotRef.current) return

    const currentPos = robotRef.current.position;
    const target = new Vector3(targetPosition.x, currentPos.y, targetPosition.z)
    
    const distance = currentPos.distanceTo(target)
    
    if (distance > 0.1) {
      const direction = target.clone().sub(currentPos).normalize()
      const speed = 3;
      
      currentPos.add(direction.multiplyScalar(delta * speed))
      
      // Smoothly rotate to face the direction of movement
      const targetQuaternion = new Quaternion().setFromEuler(new Euler(0, Math.atan2(direction.x, direction.z), 0));
      robotRef.current.quaternion.slerp(targetQuaternion, 0.1);

      // Walking animation (bobbing)
      robotRef.current.position.y = Math.abs(Math.sin(state.clock.elapsedTime * 10)) * 0.1
      if (!isPlaying('robot-footstep')) {
        playSound('robot-footstep');
      }

    } else {
      // Reached destination, idle animation (breathing)
      stopSound('robot-footstep');
      robotRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.02
    }
  })

  return <PrimitiveRobot robotRef={robotRef} />
}

const PrimitiveRobot = ({ robotRef }: { robotRef: React.Ref<Group> }) => (
    <group ref={robotRef} position={[0, 0, 0]} castShadow receiveShadow>
      {/* Body */}
      <Box args={[0.8, 1, 0.6]} position={[0, 0.5, 0]} castShadow>
        <meshStandardMaterial color="#555" metalness={0.8} roughness={0.2} />
      </Box>
      
      {/* Head */}
      <Box args={[0.6, 0.6, 0.6]} position={[0, 1.3, 0]} castShadow>
        <meshStandardMaterial color="#666" metalness={0.8} roughness={0.2} />
      </Box>
      
      {/* Eye */}
      <Box args={[0.4, 0.15, 0.1]} position={[0, 1.3, 0.3]}>
        <meshStandardMaterial 
          color="#00ffff" 
          emissive="#00ffff" 
          emissiveIntensity={4} 
          toneMapped={false}
        />
      </Box>
      <pointLight position={[0, 1.3, 0.3]} color="#00ffff" intensity={2} distance={3} />
      
      {/* Limbs */}
      <Box args={[0.2, 0.6, 0.2]} position={[-0.5, 0.5, 0]} castShadow><meshStandardMaterial color="#444" metalness={0.8} roughness={0.3} /></Box>
      <Box args={[0.2, 0.6, 0.2]} position={[0.5, 0.5, 0]} castShadow><meshStandardMaterial color="#444" metalness={0.8} roughness={0.3} /></Box>
      <Box args={[0.3, 0.5, 0.3]} position={[-0.2, -0.25, 0]} castShadow><meshStandardMaterial color="#444" metalness={0.8} roughness={0.3} /></Box>
      <Box args={[0.3, 0.5, 0.3]} position={[0.2, -0.25, 0]} castShadow><meshStandardMaterial color="#444" metalness={0.8} roughness={0.3} /></Box>
    </group>
)
============================================================
END OF FILE: portfolio/components/3d/Robot.tsx
============================================================

============================================================
BEGINNING OF FILE: portfolio/components/3d/Buildings.tsx
============================================================
'use client'

import { Box, Text } from '@react-three/drei'
import { useRef, useState } from 'react'
import { Mesh } from 'three'
import { useFrame } from '@react-three/fiber'
import { use3DStore } from '@/hooks/use3DStore'
import * as THREE from 'three'

interface BuildingsProps {
  onBuildingClick: (building: 'projects' | 'experience' | 'contact', position: [number, number, number]) => void
}

const Building = ({ name, position, size, color, emissive, onClick, label }: any) => {
  const ref = useRef<Mesh>(null!)
  const [hovered, setHovered] = useState(false)
  const { selectedBuilding } = use3DStore()

  useFrame((state) => {
    const time = state.clock.elapsedTime
    // Floating animation
    ref.current.position.y = size[1] / 2 + Math.sin(time + position[0]) * 0.1
    // Glow animation on hover/selection
    if (ref.current.material) {
      const mat = ref.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, (hovered || selectedBuilding === name) ? 1.2 : 0.3, 0.1)
    }
  })

  return (
    <group 
      position={position} 
      onClick={(e) => {
        e.stopPropagation(); // Prevent canvas click from firing
        onClick(name, position)}
      }
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
      onPointerOut={() => setHovered(false)}
    >
      <Box ref={ref} args={size} castShadow>
        <meshStandardMaterial 
          color={color}
          metalness={0.9} 
          roughness={0.1}
          emissive={emissive}
          toneMapped={false}
        />
      </Box>
      <Text
        position={[0, size[1] + 0.8, 0]}
        fontSize={0.5}
        color={emissive}
        anchorX="center"
        anchorY="middle"
        outlineColor="#000"
        outlineWidth={0.02}
      >
        {label}
      </Text>
      <pointLight position={[0, size[1]/2, 0]} color={emissive} intensity={2} distance={15} />
    </group>
  )
}

export function Buildings({ onBuildingClick }: BuildingsProps) {
  return (
    <>
      <Building
        name="projects"
        label="PROJECTS"
        position={[-8, 0, -5]}
        size={[4, 4, 4]}
        color="#1a1a2e"
        emissive="#b300ff"
        onClick={onBuildingClick}
      />
      <Building
        name="experience"
        label="EXPERIENCE"
        position={[8, 0, -5]}
        size={[3, 8, 3]}
        color="#16213e"
        emissive="#00ffff"
        onClick={onBuildingClick}
      />
      <Building
        name="contact"
        label="CONTACT"
        position={[0, 0, 8]}
        size={[2.5, 2.5, 2.5]}
        color="#0f3460"
        emissive="#ff0080"
        onClick={onBuildingClick}
      />
    </>
  )
}
============================================================
END OF FILE: portfolio/components/3d/Buildings.tsx
============================================================

============================================================
BEGINNING OF FILE: portfolio/components/3d/Environment.tsx
============================================================
'use client'

import { Grid, Stars } from '@react-three/drei'

export function Environment() {
  return (
    <>
      {/* Ground Grid */}
      <Grid
        position={[0, -0.01, 0]} // a tiny bit below the models to avoid z-fighting
        args={[100, 100]}
        cellSize={1}
        cellThickness={1}
        cellColor="#00ffff"
        sectionSize={5}
        sectionThickness={1.5}
        sectionColor="#b300ff"
        fadeDistance={60}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid={true}
      />
      
      {/* Starfield */}
      <Stars
        radius={150}
        depth={50}
        count={5000}
        factor={5}
        saturation={0}
        fade
        speed={0.5}
      />
    </>
  )
}
============================================================
END OF FILE: portfolio/components/3d/Environment.tsx
============================================================

============================================================
BEGINNING OF FILE: portfolio/components/3d/CameraController.tsx
============================================================
'use client'

import { useThree, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { use3DStore } from '@/hooks/use3DStore'
import * as THREE from 'three'

export function CameraController() {
  const { camera } = useThree()
  const { selectedBuilding } = use3DStore()

  useFrame(() => {
    // If a building is selected, smoothly move the camera to a cinematic position
    if (selectedBuilding) {
      let targetPosition = new THREE.Vector3()
      let lookAtPosition = new THREE.Vector3()

      switch (selectedBuilding) {
        case 'projects':
          targetPosition.set(-8, 3, 2)
          lookAtPosition.set(-8, 2, -5)
          break
        case 'experience':
          targetPosition.set(8, 5, 2)
          lookAtPosition.set(8, 4, -5)
          break
        case 'contact':
          targetPosition.set(0, 2, 12)
          lookAtPosition.set(0, 1.25, 8)
          break
        default:
          // Default view if something goes wrong
          targetPosition.set(0, 4, 15)
          lookAtPosition.set(0, 0, 0)
          break
      }
      
      camera.position.lerp(targetPosition, 0.05)
      // The lookAt is handled by OrbitControls target, but we can force it
      // For a smoother transition, we'd lerp the controls.target as well.
      // camera.lookAt(lookAtPosition) // This can be jarring, lerping is better
    }
  })

  // When a building is selected, controls are disabled to lock the cinematic view.
  // When no building is selected, the user can freely control the camera.
  return (
    <OrbitControls
      enabled={!selectedBuilding}
      enableZoom={true}
      enablePan={true}
      enableRotate={true}
      minPolarAngle={Math.PI / 4} // Don't let user look from below
      maxPolarAngle={Math.PI / 2.1} // Don't let user look from directly above
      minDistance={5}
      maxDistance={30}
    />
  )
}
============================================================
END OF FILE: portfolio/components/3d/CameraController.tsx
============================================================

============================================================
BEGINNING OF FILE: portfolio/components/3d/LoadingScreen.tsx
============================================================
'use client'

import { motion } from 'framer-motion'
import { useProgress } from '@react-three/drei'

export function LoadingScreen() {
  const { active, progress } = useProgress()

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black pointer-events-none"
    >
      <div className="text-center">
        <div className="mb-8 relative w-20 h-20 mx-auto">
          {/* Animated Robot */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-full h-full"
          >
            <div className="absolute inset-x-4 top-4 bottom-2 bg-gray-700 rounded" />
            <div className="absolute inset-x-6 top-0 w-8 h-8 bg-gray-600 rounded" />
            <div className="absolute top-2 left-7 w-5 h-2 bg-cyan-400 rounded-full animate-pulse shadow-glow-cyan" />
          </motion.div>
        </div>

        <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-white mb-4 tracking-widest uppercase">
          Initializing World
        </motion.h2>

        <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden mx-auto">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-400 to-purple-500"
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          />
        </div>

        <p className="text-gray-400 mt-2 text-sm font-mono">{Math.round(progress)}%</p>
      </div>
    </motion.div>
  )
}
============================================================
END OF FILE: portfolio/components/3d/LoadingScreen.tsx
============================================================

============================================================
BEGINNING OF FILE: portfolio/components/ui/DockNavigation.tsx
============================================================
'use client'

import React, { useState, useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Home, Briefcase, FolderGit2, Mail, Github, Youtube, Sun, Moon, Volume2, VolumeX } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useSound } from '@/hooks/useSound'
import { cn } from '@/lib/utils'

const navItems = [
  { id: 'home', icon: Home, label: 'Home', href: '/' },
  { id: 'projects', icon: FolderGit2, label: 'Projects', href: '/projects' },
  { id: 'experience', icon: Briefcase, label: 'Experience', href: '/experience' },
  { id: 'contact', icon: Mail, label: 'Contact', href: '/contact' },
]

const socialItems = [
  { id: 'github', icon: Github, label: 'GitHub', href: 'https://github.com/Tahactw' },
  { id: 'youtube', icon: Youtube, label: 'YouTube', href: 'https://www.youtube.com/@TahaAnimation2024' },
]

export function DockNavigation() {
  const router = useRouter()
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()
  const { muted, toggleMute, playSound } = useSound()
  
  const mouseX = useMotionValue(Infinity)
  
  const handleClick = (href: string) => {
    playSound('dock-click');
    if (href.startsWith('http')) {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else {
      router.push(href);
    }
  }

  const allItems = [
      ...navItems, 
      { id: 'divider1' }, 
      ...socialItems, 
      { id: 'divider2' }, 
      { id: 'theme', icon: resolvedTheme === 'dark' ? Sun : Moon, label: 'Theme' }, 
      { id: 'mute', icon: muted ? VolumeX : Volume2, label: 'Mute' }
  ];

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 20, stiffness: 200, delay: 1 }}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
    >
      <div 
        onMouseMove={(e) => mouseX.set(e.nativeEvent.x)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="glass rounded-2xl px-3 py-2 flex items-end h-[52px] gap-1"
      >
        {allItems.map((item) => {
          if (item.id.startsWith('divider')) {
            return <div key={item.id} className="w-px h-8 bg-white/20 mx-2 self-center" />;
          }
          const Icon = item.icon as React.ElementType;
          const isActive = 'href' in item && item.href === pathname;
          
          const handleItemClick = () => {
            if (item.id === 'theme') {
              setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
              playSound('ui-toggle');
            } else if (item.id === 'mute') {
              toggleMute();
            } else if ('href' in item) {
              handleClick(item.href);
            }
          };
          
          return (
            <DockItem key={item.id} mouseX={mouseX} isActive={isActive} onClick={handleItemClick}>
              <Icon className={cn("w-6 h-6 transition-colors", isActive ? "text-accent-cyan" : "text-foreground")} />
            </DockItem>
          );
        })}
      </div>
    </motion.div>
  )
}

function DockItem({ children, mouseX, isActive, onClick }: { children: React.ReactNode, mouseX: any, isActive?: boolean, onClick: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const { playSound } = useSound()

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [44, 80, 44]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });
  
  return (
    <motion.button
      ref={ref}
      style={{ width }}
      onClick={onClick}
      onHoverStart={() => playSound('dock-hover')}
      className={cn(
        "relative h-11 rounded-xl transition-colors flex items-center justify-center",
        isActive ? "bg-white/20 dark:bg-white/10" : "hover:bg-white/10 dark:hover:bg-white/5"
      )}
    >
      {children}
    </motion.button>
  );
}
============================================================
END OF FILE: portfolio/components/ui/DockNavigation.tsx
============================================================

============================================================
BEGINNING OF FILE: portfolio/components/ui/Button.tsx
============================================================
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        neon: "bg-gradient-to-r from-accent-cyan to-accent-purple text-white font-medium rounded-lg hover:shadow-glow-cyan transition-all disabled:opacity-50 disabled:cursor-not-allowed",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
============================================================
END OF FILE: portfolio/components/ui/Button.tsx
============================================================

============================================================
BEGINNING OF FILE: portfolio/components/ui/Card.tsx
============================================================
import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
============================================================
END OF FILE: portfolio/components/ui/Card.tsx
============================================================

============================================================
BEGINNING OF FILE: portfolio/components/ui/Form.tsx
============================================================
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form"

import { cn } from "@/lib/utils"

const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  )
})
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField()

  return (
    <label
      ref={ref}
      className={cn("block text-sm font-medium mb-1 text-muted-foreground", error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  )
})
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
})
FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-[0.8rem] text-muted-foreground", className)}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message) : children

  if (!body) {
    return null
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}
============================================================
END OF FILE: portfolio/components/ui/Form.tsx
============================================================

============================================================
BEGINNING OF FILE: portfolio/components/ui/Input.tsx
============================================================
import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          "focus:border-accent-cyan transition-colors",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
============================================================
END OF FILE: portfolio/components/ui/Input.tsx
============================================================

============================================================
BEGINNING OF FILE: portfolio/components/ui/Textarea.tsx
============================================================
import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          "focus:border-accent-cyan transition-colors resize-y",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
============================================================
END OF FILE: portfolio/components/ui/Textarea.tsx
============================================================

============================================================
BEGINNING OF FILE: portfolio/components/ui/Dialog.tsx
============================================================
"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
============================================================
END OF FILE: portfolio/components/ui/Dialog.tsx
============================================================

============================================================
BEGINNING OF FILE: portfolio/components/ui/Toast.tsx
============================================================
"use client"

import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {

  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:glass",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
============================================================
END OF FILE: portfolio/components/ui/Toast.tsx
============================================================

============================================================
BEGINNING OF FILE: portfolio/components/ui/ScrollArea.tsx
============================================================
"use client"

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "@/lib/utils"

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Scrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Scrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.Scrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" &&
        "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.Thumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.Scrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.Scrollbar.displayName

export { ScrollArea, ScrollBar }
============================================================
END OF FILE: portfolio/components/ui/ScrollArea.tsx
============================================================

============================================================
BEGINNING OF FILE: portfolio/components/sections/ProjectsGallery.tsx
============================================================
'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import type { Project } from '@/types'

export function ProjectsGallery({ projects }: { projects: Project[] }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {projects.map((project) => (
        <motion.div key={project.id} variants={itemVariants}>
          <Link href={`/projects/${project.id}`} className="block h-full">
            <div className="glass rounded-xl overflow-hidden h-full group flex flex-col transition-all duration-300 hover:shadow-glow-purple hover:-translate-y-1">
              <div className="relative aspect-video w-full overflow-hidden">
                <Image
                  src={project.thumbnail}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-2 group-hover:text-accent-purple transition-colors">{project.title}</h3>
                <p className="text-muted-foreground text-sm mb-4 flex-grow line-clamp-3">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-white/10">
                  {project.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs font-medium rounded-full bg-muted text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}
============================================================
END OF FILE: portfolio/components/sections/ProjectsGallery.tsx
============================================================

============================================================
BEGINNING OF FILE: portfolio/components/sections/ExperienceTimeline.tsx
============================================================
'use client'

import { motion } from 'framer-motion'
import type { Experience } from '@/types'

export function ExperienceTimeline({ experiences }: { experiences: Experience[] }) {
  if (experiences.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground text-lg">No experience entries to display.</p>
      </div>
    );
  }

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative border-l-2 border-accent-cyan/30 ml-3 pl-8"
    >
      {experiences.map((exp) => (
        <motion.div key={exp.id} variants={itemVariants} className="mb-10">
          <div className="absolute -left-4 top-1 flex items-center justify-center w-8 h-8 bg-background rounded-full">
            <div className="w-4 h-4 bg-accent-cyan rounded-full animate-pulse-glow shadow-glow-cyan"></div>
            <div className="absolute w-2 h-2 bg-background rounded-full"></div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">{exp.duration}</p>
          <h3 className="text-xl font-bold">{exp.role}</h3>
          <h4 className="text-md font-semibold text-accent-purple mb-2">{exp.company}</h4>
          <p className="text-muted-foreground leading-relaxed">
            {exp.description}
          </p>
        </motion.div>
      ))}
    </motion.div>
  )
}
============================================================
END OF FILE: portfolio/components/sections/ExperienceTimeline.tsx
============================================================

============================================================
BEGINNING OF FILE: portfolio/components/sections/ContactForm.tsx
============================================================
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { Send } from 'lucide-react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/Form'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  subject: z.string().min(5, 'Subject must be at least 5 characters.'),
  message: z.string().min(10, 'Message must be at least 10 characters.'),
})

type FormData = z.infer<typeof formSchema>

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    }
  })

  async function onSubmit(data: FormData) {
    setIsSubmitting(true)
    const toastId = toast.loading('Sending message...');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success('Message sent successfully!', { id: toastId });
        form.reset()
      } else {
        throw new Error('Failed to send message')
      }
    } catch (error) {
      toast.error('Failed to send message. Please try again later.', { id: toastId });
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl><Input placeholder="john.doe@example.com" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl><Input placeholder="Project Inquiry" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl><Textarea rows={5} placeholder="Tell me about your project..." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} variant="neon" size="lg" className="w-full">
          {isSubmitting ? (
            <div className="loading-dots text-white">
              <span></span><span></span><span></span>
            </div>
          ) : (
            <>
              Send Message <Send className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}
============================================================
END OF FILE: portfolio/components/sections/ContactForm.tsx
============================================================

============================================================
BEGINNING OF FILE: portfolio/components/admin/ImageUpload.tsx
============================================================
'use client'

import { CldUploadWidget } from 'next-cloudinary'
import { Button } from '@/components/ui/Button'
import { ImagePlus, Trash } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const onUpload = (result: any) => {
    onChange(result.info.secure_url)
    toast.success('Image uploaded successfully!')
  }

  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!uploadPreset) {
      console.error("Cloudinary upload preset is not configured. Please set NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in your .env.local file.");
      return <p className="text-sm text-destructive">Image upload is not configured.</p>;
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value && (
          <div className="relative w-[200px] h-[200px] rounded-md overflow-hidden border">
            <div className="z-10 absolute top-2 right-2">
              <Button type="button" onClick={() => onChange('')} variant="destructive" size="icon">
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image fill className="object-cover" alt="Image" src={value} />
          </div>
        )}
      </div>
      <CldUploadWidget onUpload={onUpload} uploadPreset={uploadPreset}>
        {({ open }) => {
          const onClick = (e: React.MouseEvent) => {
            e.preventDefault();
            open();
          };
          return (
            <Button type="button" disabled={!!value} variant="secondary" onClick={onClick}>
              <ImagePlus className="h-4 w-4 mr-2" />
              Upload an Image
            </Button>
          )
        }}
      </CldUploadWidget>
    </div>
  )
}
============================================================
END OF FILE: portfolio/components/admin/ImageUpload.tsx
============================================================

============================================================
BEGINNING OF FILE: portfolio/components/admin/ProjectForm.tsx
============================================================
'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { Trash, PlusCircle } from 'lucide-react'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/Form'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { ImageUpload } from './ImageUpload'
import { ScrollArea } from '@/components/ui/ScrollArea'
import type { Project } from '@/types'

const formSchema = z.object({
  title: z.string().min(3, 'Title is required.'),
  description: z.string().min(10, 'Description is required.'),
  thumbnail: z.string().url('A valid image URL is required.'),
  tags: z.array(z.object({ value: z.string().min(1, 'Tag cannot be empty.') })),
  links: z.object({
    github: z.string().url().optional().or(z.literal('')),
    live: z.string().url().optional().or(z.literal('')),
    youtube: z.string().url().optional().or(z.literal('')),
  }).optional(),
})

type ProjectFormData = z.infer<typeof formSchema>

interface ProjectFormProps {
  project: Project | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ProjectForm({ project, onSuccess, onCancel }: ProjectFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: project ? {
      ...project,
      tags: project.tags.map(tag => ({ value: tag })),
      links: project.links || { github: '', live: '', youtube: '' }
    } : {
      title: '',
      description: '',
      thumbnail: '',
      tags: [],
      links: { github: '', live: '', youtube: '' }
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tags",
  });

  const onSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true)
    const toastId = toast.loading(project ? 'Updating project...' : 'Creating project...');
    
    // Transform tags back to simple string array
    const payload = {
        ...data,
        tags: data.tags.map(tag => tag.value)
    };

    try {
      const response = await fetch(
        project ? `/api/projects/${project.id}` : '/api/projects',
        {
          method: project ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      )

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong');
      }

      toast.success(project ? 'Project updated successfully!' : 'Project created successfully!', { id: toastId });
      onSuccess();
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <ScrollArea className="h-[70vh] pr-4">
          <div className="space-y-6">
            <FormField control={form.control} name="thumbnail" render={({ field }) => ( <FormItem> <FormLabel>Thumbnail</FormLabel> <FormControl> <ImageUpload value={field.value} onChange={field.onChange} /> </FormControl> <FormMessage /> </FormItem> )} />
            <FormField control={form.control} name="title" render={({ field }) => ( <FormItem> <FormLabel>Title</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
            <FormField control={form.control} name="description" render={({ field }) => ( <FormItem> <FormLabel>Description</FormLabel> <FormControl><Textarea rows={5} {...field} /></FormControl> <FormMessage /> </FormItem> )} />
            <div>
              <FormLabel>Tags</FormLabel>
              <div className="space-y-2 mt-2">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <Input {...form.register(`tags.${index}.value`)} />
                    <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}> <Trash className="w-4 h-4" /> </Button>
                  </div>
                ))}
              </div>
              <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => append({ value: "" })}> <PlusCircle className="w-4 h-4 mr-2" /> Add Tag </Button>
            </div>
            <div>
              <FormLabel>Links</FormLabel>
              <div className="space-y-2 mt-2">
                <FormField control={form.control} name="links.github" render={({ field }) => (<FormItem><FormControl><Input placeholder="GitHub URL" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="links.live" render={({ field }) => (<FormItem><FormControl><Input placeholder="Live Demo URL" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="links.youtube" render={({ field }) => (<FormItem><FormControl><Input placeholder="YouTube URL" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>
            </div>
          </div>
        </ScrollArea>
        <div className="flex justify-end gap-2 pt-6 border-t mt-6">
          <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save'}</Button>
        </div>
      </form>
    </Form>
  )
}
============================================================
END OF FILE: portfolio/components/admin/ProjectForm.tsx
============================================================

============================================================
BEGINNING OF FILE: portfolio/components/admin/ExperienceForm.tsx
============================================================
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/Form'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import type { Experience } from '@/types'

const formSchema = z.object({
  role: z.string().min(2, 'Role is required.'),
  company: z.string().min(2, 'Company is required.'),
  duration: z.string().min(5, 'Duration is required (e.g., "Jan 2022 - Present").'),
  description: z.string().min(10, 'Description is required.'),
})

type ExperienceFormData = z.infer<typeof formSchema>

interface ExperienceFormProps {
  experience: Experience | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ExperienceForm({ experience, onSuccess, onCancel }: ExperienceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ExperienceFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: experience || {
      role: '',
      company: '',
      duration: '',
      description: '',
    },
  })

  const onSubmit = async (data: ExperienceFormData) => {
    setIsSubmitting(true)
    const toastId = toast.loading(experience ? 'Updating experience...' : 'Creating experience...');

    try {
      const response = await fetch(
        experience ? `/api/experience/${experience.id}` : '/api/experience',
        {
          method: experience ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      )

      if (!response.ok) throw new Error('Something went wrong')

      toast.success(experience ? 'Experience updated!' : 'Experience created!', { id: toastId });
      onSuccess();
    } catch (error) {
      toast.error('Failed to save experience.', { id: toastId });
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="role" render={({ field }) => ( <FormItem> <FormLabel>Role / Title</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
        <FormField control={form.control} name="company" render={({ field }) => ( <FormItem> <FormLabel>Company</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
        <FormField control={form.control} name="duration" render={({ field }) => ( <FormItem> <FormLabel>Duration</FormLabel> <FormControl><Input placeholder="e.g., Jan 2022 - Present" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
        <FormField control={form.control} name="description" render={({ field }) => ( <FormItem> <FormLabel>Description</FormLabel> <FormControl><Textarea rows={4} {...field} /></FormControl> <FormMessage /> </FormItem> )} />
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save'}</Button>
        </div>
      </form>
    </Form>
  )
}
============================================================
END OF FILE: portfolio/components/admin/ExperienceForm.tsx
============================================================

============================================================
BEGINNING OF FILE: portfolio/components/admin/AdminNav.tsx
============================================================
'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { LayoutDashboard, LogOut, ExternalLink, Home, FolderGit2, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navLinks = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/projects', label: 'Projects', icon: FolderGit2 },
    { href: '/admin/experience', label: 'Experience', icon: Briefcase },
]

export function AdminNav() {
  const { data: session } = useSession()
  const pathname = usePathname()

  return (
    <header className="fixed top-0 left-0 right-0 z-40 glass">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 text-lg font-bold text-accent-cyan hover:opacity-80 transition-opacity">
              <Home className="w-6 h-6" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <div className="flex items-center gap-4">
              {navLinks.map(link => {
                const isActive = pathname === link.href;
                return (
                  <Link key={link.href} href={link.href}>
                    <Button variant="ghost" size="sm" className={cn(isActive && "bg-secondary")}>
                      <link.icon className="w-4 h-4 mr-2" />
                      {link.label}
                    </Button>
                  </Link>
                )
              })}
            </div>
        </div>
        <div className="flex items-center gap-4">
          {session?.user && (
            <div className="flex items-center gap-3">
               {session.user.image && (
                 <Image src={session.user.image} alt={session.user.name || "Admin"} width={32} height={32} className="rounded-full" />
               )}
              <span className="text-sm text-muted-foreground hidden sm:inline">{session.user.name}</span>
              <Button onClick={() => signOut({ callbackUrl: '/' })} variant="secondary" size="sm">
                <LogOut className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}
============================================================
END OF FILE: portfolio/components/admin/AdminNav.tsx
============================================================

============================================================
BEGINNING OF FILE: portfolio/components/providers/ThemeProvider.tsx
============================================================
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
============================================================
END OF FILE: portfolio/components/providers/ThemeProvider.tsx
============================================================

============================================================
BEGINNING OF FILE: portfolio/components/providers/AuthProvider.tsx
============================================================
"use client"

import { SessionProvider } from "next-auth/react"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}
============================================================
END OF FILE: portfolio/components/providers/AuthProvider.tsx
============================================================

============================================================
BEGINNING OF FILE: portfolio/components/providers/SoundProvider.tsx
============================================================
'use client'

import React, { createContext, useState, useEffect, useRef, useCallback, useContext } from 'react'
import { Howl } from 'howler'

interface SoundContextType {
  muted: boolean
  toggleMute: () => void
  playSound: (soundName: keyof typeof soundConfig) => void
  stopSound: (soundName: keyof typeof soundConfig) => void
  isPlaying: (soundName: keyof typeof soundConfig) => boolean
}

const SoundContext = createContext<SoundContextType | undefined>(undefined)

const soundConfig = {
  'dock-hover': { src: '/sounds/dock-hover.mp3', volume: 0.3, loop: false },
  'dock-click': { src: '/sounds/dock-click.mp3', volume: 0.5, loop: false },
  'robot-footstep': { src: '/sounds/robot-footstep.mp3', volume: 0.4, loop: true },
  'ambient-city': { src: '/sounds/ambient-city.mp3', volume: 0.1, loop: true },
  'building-enter': { src: '/sounds/building-enter.mp3', volume: 0.6, loop: false },
  'ui-toggle': { src: '/sounds/ui-toggle.mp3', volume: 0.4, loop: false },
}

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [muted, setMuted] = useState(true) // Start muted
  const sounds = useRef<Partial<Record<keyof typeof soundConfig, Howl>>>({})
  const isInitialized = useRef(false)

  useEffect(() => {
    Object.entries(soundConfig).forEach(([name, config]) => {
      sounds.current[name as keyof typeof soundConfig] = new Howl({
        src: [config.src],
        ...config,
        preload: true,
      })
    })

    const handleFirstInteraction = () => {
      if (!isInitialized.current) {
        isInitialized.current = true;
        setMuted(false);
        Howler.mute(false);
        if (!sounds.current['ambient-city']?.playing()) {
          sounds.current['ambient-city']?.play();
        }
      }
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);

    return () => {
      Object.values(sounds.current).forEach(sound => sound?.unload());
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    }
  }, [])

  const toggleMute = useCallback(() => {
    const newMutedState = !muted;
    setMuted(newMutedState);
    Howler.mute(newMutedState);
  }, [muted]);

  const playSound = useCallback((soundName: keyof typeof soundConfig) => {
    if (sounds.current[soundName] && !muted) {
      sounds.current[soundName]!.play();
    }
  }, [muted]);
  
  const stopSound = useCallback((soundName: keyof typeof soundConfig) => {
    sounds.current[soundName]?.stop();
  }, []);

  const isPlaying = useCallback((soundName: keyof typeof soundConfig) => {
    return sounds.current[soundName]?.playing() ?? false;
  }, []);

  return (
    <SoundContext.Provider value={{ muted, toggleMute, playSound, stopSound, isPlaying }}>
      {children}
    </SoundContext.Provider>
  )
}

export const useSound = () => {
    const context = useContext(SoundContext);
    if (context === undefined) {
        throw new Error('useSound must be used within a SoundProvider');
    }
    return context;
};
============================================================
END OF FILE: portfolio/components/providers/SoundProvider.tsx
============================================================

============================================================
BEGINNING OF FILE: portfolio/lib/auth.ts
============================================================
import type { NextAuthOptions, DefaultSession } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
    } & DefaultSession['user'];
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (user.name === process.env.ADMIN_GITHUB_USERNAME) {
        return true
      }
      // Add a console log for debugging failed sign-ins
      console.log(`Sign-in attempt failed for user: ${user.name}`);
      return false // Deny sign-in for any other user
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login', // Redirect users to login page on error
  },
  secret: process.env.NEXTAUTH_SECRET,
}
============================================================
END OF FILE: portfolio/lib/auth.ts
============================================================

============================================================
BEGINNING OF FILE: portfolio/lib/cloudinary.ts
============================================================
// This file is for Cloudinary configuration if needed for server-side actions.
// The next-cloudinary CldUploadWidget component handles most of the client-side logic
// by reading environment variables directly.

import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export default cloudinary
============================================================
END OF FILE: portfolio/lib/cloudinary.ts
============================================================

============================================================
BEGINNING OF FILE: portfolio/lib/utils.ts
============================================================
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
============================================================
END OF FILE: portfolio/lib/utils.ts
============================================================

============================================================
BEGINNING OF FILE: portfolio/lib/sounds.ts
============================================================
// This file is now primarily for documentation purposes.
// The sound logic has been consolidated into SoundProvider.tsx for better state management.

/**
 * Available Sound Effects:
 * 
 * - 'dock-hover': Played on hovering over a dock item.
 * - 'dock-click': Played when a dock item is clicked.
 * - 'robot-footstep': A looping sound for when the robot is moving.
 * - 'ambient-city': A looping background ambient sound for the 3D world.
 * - 'building-enter': Played when a building is clicked, just before navigation.
 * - 'ui-toggle': A generic sound for UI toggles like theme or mute.
 * 
 * To use sounds, import the `useSound` hook from `@/components/providers/SoundProvider`.
 * 
 * Example:
 * const { playSound, stopSound } = useSound();
 * playSound('dock-click');
 * stopSound('robot-footstep');
 */

export const soundList = [
  'dock-hover',
  'dock-click',
  'robot-footstep',
  'ambient-city',
  'building-enter',
  'ui-toggle',
];
============================================================
END OF FILE: portfolio/lib/sounds.ts
============================================================

============================================================
BEGINNING OF FILE: portfolio/lib/constants.ts
============================================================
// This file can be used to store constant data used throughout the application.

export const SITE_NAME = "Taha's Portfolio";

export const SOCIAL_LINKS = {
  GITHUB: 'https://github.com/Tahactw',
  YOUTUBE: 'https://www.youtube.com/@TahaAnimation2024',
  EMAIL: 'mailto:taha222869@hu.edu.eg',
};
============================================================
END OF FILE: portfolio/lib/constants.ts
============================================================

============================================================
BEGINNING OF FILE: portfolio/lib/data.ts
============================================================
import fs from 'fs/promises'
import path from 'path'

// The path to the data directory, relative to the project root
const dataDirectory = path.join(process.cwd(), 'data')

export async function readData(fileName: string): Promise<any> {
  const filePath = path.join(dataDirectory, fileName)
  try {
    const fileContents = await fs.readFile(filePath, 'utf8')
    return JSON.parse(fileContents)
  } catch (error) {
    // If the file doesn't exist, return a default structure
    if (fileName.includes('projects')) return { projects: [] };
    if (fileName.includes('experience')) return { experiences: [] };
    return {}
  }
}

export async function writeData(fileName: string, content: any): Promise<void> {
  const filePath = path.join(dataDirectory, fileName)
  await fs.writeFile(filePath, JSON.stringify(content, null, 2))
}
============================================================
END OF FILE: portfolio/lib/data.ts
============================================================

============================================================
BEGINNING OF FILE: portfolio/hooks/useSound.ts
============================================================
// This file is intentionally left almost empty.
// The actual `useSound` hook is co-located with its provider for better organization.
// You can import it directly from the provider file.
//
// Usage:
// import { useSound } from '@/components/providers/SoundProvider'

export {}
============================================================
END OF FILE: portfolio/hooks/useSound.ts
============================================================

============================================================
BEGINNING OF FILE: portfolio/hooks/useTheme.ts
============================================================
// This file is intentionally left almost empty.
// The `useTheme` hook from `next-themes` is used directly in components.
// This file is kept to maintain the requested project structure.
//
// Usage in components:
// import { useTheme } from 'next-themes'
// const { theme, setTheme } = useTheme()

export {}
============================================================
END OF FILE: portfolio/hooks/useTheme.ts
============================================================

============================================================
BEGINNING OF FILE: portfolio/hooks/useMediaQuery.ts
============================================================
import { useState, useEffect } from 'react'

/**
 * A hook for tracking the state of a media query.
 * @param query The media query string to watch.
 * @returns `true` if the media query matches, otherwise `false`.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false)

  useEffect(() => {
    // Ensure this runs only on the client
    if (typeof window === 'undefined') return

    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }

    const listener = () => setMatches(media.matches)
    // Add event listener
    media.addEventListener('change', listener)

    // Remove event listener on cleanup
    return () => media.removeEventListener('change', listener)
  }, [matches, query])

  return matches
}
============================================================
END OF FILE: portfolio/hooks/useMediaQuery.ts
============================================================

============================================================
BEGINNING OF FILE: portfolio/hooks/use3DStore.ts
============================================================
import { create } from 'zustand'

interface Position {
  x: number;
  y: number;
  z: number;
}

type BuildingName = 'projects' | 'experience' | 'contact';

interface StoreState {
  targetPosition: Position;
  selectedBuilding: BuildingName | null;
  actions: {
    setTargetPosition: (position: Position) => void;
    setSelectedBuilding: (building: BuildingName | null) => void;
  }
}

export const use3DStore = create<StoreState>((set) => ({
  targetPosition: { x: 0, y: 0, z: 0 },
  selectedBuilding: null,
  actions: {
    setTargetPosition: (position) => set({ targetPosition: position }),
    setSelectedBuilding: (building) => set({ selectedBuilding: building }),
  }
}));

// Custom hooks for easier access
export const useTargetPosition = () => use3DStore((state) => state.targetPosition);
export const useSelectedBuilding = () => use3DStore((state) => state.selectedBuilding);
export const use3DActions = () => use3DStore((state) => state.actions);
============================================================
END OF FILE: portfolio/hooks/use3DStore.ts
============================================================

============================================================
BEGINNING OF FILE: portfolio/types/index.ts
============================================================
export interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  tags: string[];
  links?: {
    github?: string;
    live?: string;
    youtube?: string;
  };
  createdAt: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  duration: string;
  description:string;
}

// NextAuth session types are now extended in lib/auth.ts
============================================================
END OF FILE: portfolio/types/index.ts
============================================================

============================================================
BEGINNING OF FILE: portfolio/public/sounds/dock-hover.mp3
============================================================
This is a placeholder for a binary file: dock-hover.mp3
Please add a short, subtle sound effect here. A soft 'swoosh' or 'tick' works well.
============================================================
END OF FILE: portfolio/public/sounds/dock-hover.mp3
============================================================

============================================================
BEGINNING OF FILE: portfolio/public/sounds/dock-click.mp3
============================================================
This is a placeholder for a binary file: dock-click.mp3
Please add a satisfying click sound effect here.
============================================================
END OF FILE: portfolio/public/sounds/dock-click.mp3
============================================================

============================================================
BEGINNING OF FILE: portfolio/public/sounds/robot-footstep.mp3
============================================================
This is a placeholder for a binary file: robot-footstep.mp3
Please add a looping sound of robotic footsteps. A metallic clanking or whirring sound.
============================================================
END OF FILE: portfolio/public/sounds/robot-footstep.mp3
============================================================

============================================================
BEGINNING OF FILE: portfolio/public/sounds/ambient-city.mp3
============================================================
This is a placeholder for a binary file: ambient-city.mp3
Please add a long, looping ambient sound of a futuristic, cyber-punk city.
============================================================
END OF FILE: portfolio/public/sounds/ambient-city.mp3
============================================================

============================================================
BEGINNING OF FILE: portfolio/public/sounds/building-enter.mp3
============================================================
This is a placeholder for a binary file: building-enter.mp3
Please add a futuristic 'swoosh' or 'portal' sound for when a building is selected.
============================================================
END OF FILE: portfolio/public/sounds/building-enter.mp3
============================================================

============================================================
BEGINNING OF FILE: portfolio/public/sounds/ui-toggle.mp3
============================================================
This is a placeholder for a binary file: ui-toggle.mp3
Please add a short, digital-sounding toggle or switch sound.
============================================================
END OF FILE: portfolio/public/sounds/ui-toggle.mp3
============================================================

============================================================
BEGINNING OF FILE: portfolio/public/models/robot.glb
============================================================
This is a placeholder for a binary file: robot.glb
The code will fall back to a primitive shape-based robot if this file is not present.
For the best experience, find a free animated robot model (e.g., from Sketchfab) and place it here.
============================================================
END OF FILE: portfolio/public/models/robot.glb
============================================================

============================================================
BEGINNING OF FILE: portfolio/data/projects.json
============================================================
{
  "projects": []
}
============================================================
END OF FILE: portfolio/data/projects.json
============================================================

============================================================
BEGINNING OF FILE: portfolio/data/experience.json
============================================================
{
  "experiences": []
}
============================================================
END OF FILE: portfolio/data/experience.json
============================================================
"""

def create_project_files():
    """Parses the file_data_string and creates the project structure."""
    print("Starting project creation...")

    # Regex to find the file path from the header
    path_pattern = re.compile(r"BEGINNING OF FILE: (.*)")
    
    # Split the main string into individual file blocks
    file_blocks = file_data_string.split("============================================================")
    
    # List of extensions for files that are binary and will only have placeholder text
    binary_extensions = ['.mp3', '.glb']

    created_count = 0
    for block in file_blocks:
        block = block.strip()
        if not block:
            continue

        lines = block.split('\n')
        header = lines[0]
        match = path_pattern.match(header)
        
        if not match:
            continue
            
        file_path = match.group(1).strip()
        
        # Extract content between header and footer
        content_lines = lines[1:-1]
        content = '\n'.join(content_lines).strip()
        
        try:
            # Get the directory part of the path
            dir_name = os.path.dirname(file_path)
            
            # Create directories if they don't exist
            if dir_name:
                os.makedirs(dir_name, exist_ok=True)

            # Check if it's a placeholder for a binary file
            is_binary_placeholder = any(file_path.endswith(ext) for ext in binary_extensions)

            # Write the file
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            if is_binary_placeholder:
                print(f"-> Created placeholder: {file_path}. You must replace this with a real binary file.")
            else:
                print(f"-> Created file: {file_path}")
            
            created_count += 1
            
        except Exception as e:
            print(f"!! ERROR creating file {file_path}: {e}")
            
    print(f"\nProject creation complete. {created_count} files and folders created.")
    print("\n--- NEXT STEPS ---")
    print("1. Navigate into the new directory: cd portfolio")
    print("2. IMPORTANT: Edit the .env.local file with your credentials.")
    print("3. Install dependencies: npm install")
    print("4. Add your sound files (.mp3) and 3D model (.glb) to the /public folder.")
    print("5. Run the development server: npm run dev")
    print("------------------")

if __name__ == "__main__":
    create_project_files()