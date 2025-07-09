import { Metadata } from 'next';
import { getProjects } from '@/lib/data';
import { ProjectsGrid } from '@/components/ui/ProjectsGrid';

export const metadata: Metadata = {
  title: 'Projects | Portfolio',
  description: 'Explore my portfolio of mechatronics and creative projects',
};

export const revalidate = 10;

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main className="min-h-screen bg-bg-primary overflow-y-auto scrollable-content">
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h1 className="mb-4 animate-slide-down">Projects</h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto animate-slide-up animation-delay-100">
            A collection of my work in engineering and creative development
          </p>
        </div>
        <ProjectsGrid projects={projects} />
      </div>
    </main>
  );
}