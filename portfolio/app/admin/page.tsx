import { getProjects, getExperiences } from '@/lib/data';
import { FolderOpen, Briefcase } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboard() {
  const projects = await getProjects();
  const experiences = await getExperiences();

  return (
    <div>
      <h1 className="mb-8">Admin Dashboard</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <Link href="/admin/projects" className="glass rounded-xl p-6 hover:bg-text-primary/5 transition-all hover:scale-[1.02]">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-accent-warm/20 flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-accent-warm" />
            </div>
            <div>
              <h2 className="text-xl">Projects</h2>
              <p className="text-text-secondary">{projects.length} projects</p>
            </div>
          </div>
          <p className="text-sm text-text-secondary">Manage your portfolio projects</p>
        </Link>
        
        <Link href="/admin/experience" className="glass rounded-xl p-6 hover:bg-text-primary/5 transition-all hover:scale-[1.02]">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-accent-earth/20 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-accent-earth" />
            </div>
            <div>
              <h2 className="text-xl">Experience</h2>
              <p className="text-text-secondary">{experiences.length} entries</p>
            </div>
          </div>
          <p className="text-sm text-text-secondary">Manage your work experience</p>
        </Link>
      </div>
    </div>
  );
}