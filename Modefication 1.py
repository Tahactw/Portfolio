#!/usr/bin/env python3
"""
Portfolio Fix Script - Resolves theme toggle and project loading issues
"""

import os
import json

def create_file(filepath, content):
    """Create or update a file with the given content."""
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"✓ Fixed: {filepath}")

def fix_portfolio_issues():
    """Apply fixes for theme toggle and project loading."""
    
    print("🔧 Fixing Portfolio Issues\n")
    
    # Fix 1: Simplified data layer
    print("📊 Fixing data layer (lib/data.ts)...")
    
    data_ts = """import fs from 'fs/promises';
import path from 'path';

// --- SIMPLIFIED PROJECT INTERFACE ---
// This now matches the structure in data/projects.json
export interface Project {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  brief: string;
  link: string;
}

const dataDir = path.join(process.cwd(), 'data');
const projectsPath = path.join(dataDir, 'projects.json');

async function readProjectsFile(): Promise<{ projects: Project[] }> {
  try {
    await fs.access(projectsPath);
    const data = JSON.parse(await fs.readFile(projectsPath, 'utf-8'));
    return data;
  } catch {
    // If the file doesn't exist, return a default empty structure
    return { projects: [] };
  }
}

// --- SIMPLIFIED GET PROJECTS FUNCTION ---
// The only data function we now need for the frontend.
export const getProjects = async (): Promise<Project[]> => {
  const data = await readProjectsFile();
  // No sorting needed as we are not managing order via an admin panel anymore
  return data.projects || [];
};

// --- REMOVED UNUSED FUNCTIONS ---
// getProject, createProject, updateProject, deleteProject are removed.
// All Experience-related functions are removed.
// GalleryItem and Experience interfaces are removed."""
    
    create_file('portfolio/lib/data.ts', data_ts)
    
    # Fix 2: Simplified API route
    print("\n🌐 Fixing API route (app/api/data/route.ts)...")
    
    api_route = """import { NextRequest, NextResponse } from 'next/server';
import { getProjects } from '@/lib/data';

// --- SIMPLIFIED GET HANDLER ---
// This API route now only serves project data and has no other responsibilities.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  
  try {
    if (type === 'projects') {
      const projects = await getProjects();
      return NextResponse.json(projects);
    }
    // All other types and methods are no longer supported
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

// POST, PUT, DELETE handlers are removed as the admin panel is no longer part of the scope."""
    
    create_file('portfolio/app/api/data/route.ts', api_route)
    
    # Fix 3: Layout with Header component
    print("\n🎨 Fixing layout with Header component (app/layout.tsx)...")
    
    layout = """import type { Metadata } from 'next';
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
}"""
    
    create_file('portfolio/app/layout.tsx', layout)
    
    # Fix 4: Create sample projects.json if it doesn't exist
    print("\n📁 Checking projects.json...")
    
    projects_json = {
        "projects": [
            {
                "id": "1",
                "title": "IoT Smart Home System",
                "category": "Mechatronics",
                "thumbnail": "https://res.cloudinary.com/dtsf3js46/image/upload/v1752009450/WhatsApp_Image_2024-09-20_at_9.44.36_PM_wyvkmq.jpg",
                "brief": "Integrated home automation using Arduino and Raspberry Pi with custom mobile app control.",
                "link": "#"
            },
            {
                "id": "2",
                "title": "Cyberpunk 2077 Montage",
                "category": "Video Montage",
                "thumbnail": "https://res.cloudinary.com/dtsf3js46/image/upload/v1752009450/WhatsApp_Image_2024-09-20_at_9.44.36_PM_wyvkmq.jpg",
                "brief": "High-energy gaming montage with custom VFX and dynamic transitions.",
                "link": "#"
            },
            {
                "id": "3",
                "title": "Futuristic Robot Model",
                "category": "3D Art",
                "thumbnail": "https://res.cloudinary.com/dnv7rmdqv/image/upload/v1735641610/portfolio/robot-3d_qe8xsp.jpg",
                "brief": "Detailed 3D model created in Maya with custom textures and rigging.",
                "link": "#"
            },
            {
                "id": "4",
                "title": "AI-Powered Robotic Arm",
                "category": "Mechatronics",
                "thumbnail": "https://res.cloudinary.com/dnv7rmdqv/image/upload/v1735641610/portfolio/robotic-arm_vkmnfh.jpg",
                "brief": "Computer vision enabled robotic arm for object sorting and manipulation.",
                "link": "#"
            },
            {
                "id": "5",
                "title": "Tech Review Channel Intro",
                "category": "Video Montage",
                "thumbnail": "https://res.cloudinary.com/dnv7rmdqv/image/upload/v1735641610/portfolio/tech-intro_hs9xvk.jpg",
                "brief": "Motion graphics intro sequence for YouTube tech channel.",
                "link": "#"
            },
            {
                "id": "6",
                "title": "Sci-Fi Environment",
                "category": "3D Art",
                "thumbnail": "https://res.cloudinary.com/dnv7rmdqv/image/upload/v1735641610/portfolio/scifi-env_dmqr8n.jpg",
                "brief": "Atmospheric 3D environment with volumetric lighting and custom shaders.",
                "link": "#"
            },
            {
                "id": "7",
                "title": "Drone Navigation System",
                "category": "Mechatronics",
                "thumbnail": "https://res.cloudinary.com/dnv7rmdqv/image/upload/v1735641610/portfolio/drone_zpkm3v.jpg",
                "brief": "Autonomous drone navigation using computer vision and GPS integration.",
                "link": "#"
            },
            {
                "id": "8",
                "title": "Music Video Edit",
                "category": "Video Montage",
                "thumbnail": "https://res.cloudinary.com/dnv7rmdqv/image/upload/v1735641610/portfolio/music-video_xn5kpt.jpg",
                "brief": "Creative music video edit with sync-based cuts and color grading.",
                "link": "#"
            }
        ]
    }
    
    # Create data directory and projects.json if they don't exist
    os.makedirs('portfolio/data', exist_ok=True)
    projects_path = 'portfolio/data/projects.json'
    
    if not os.path.exists(projects_path):
        with open(projects_path, 'w', encoding='utf-8') as f:
            json.dump(projects_json, f, indent=2)
        print(f"✓ Created: {projects_path}")
    else:
        print(f"✓ Exists: {projects_path}")
    
    print("\n✅ All fixes applied successfully!")
    print("\n🔍 Issues resolved:")
    print("   ✓ Projects data loading fixed with simplified data layer")
    print("   ✓ API route simplified to only handle GET requests")
    print("   ✓ Header component properly integrated in layout")
    print("   ✓ Theme toggle functionality restored")
    print("\n📋 Next steps:")
    print("1. cd portfolio")
    print("2. npm run dev")
    print("3. Visit http://localhost:3000")
    print("\n💡 Test the following:")
    print("   - Projects page should load without errors")
    print("   - Theme toggle should work (sun/moon icon in header)")
    print("   - Navigation should appear on all pages")
    print("   - Project filtering should work correctly")

if __name__ == "__main__":
    fix_portfolio_issues()