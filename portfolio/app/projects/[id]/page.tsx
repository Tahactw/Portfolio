import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getProject, getProjects } from '@/lib/data';
import { ArrowLeft, ExternalLink, Github, Youtube } from 'lucide-react';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const project = await getProject(params.id);
  if (!project) return { title: 'Project Not Found' };
  
  return {
    title: `${project.title} | Portfolio`,
    description: project.description.substring(0, 150),
    openGraph: {
      title: project.title,
      description: project.description.substring(0, 150),
      images: [project.thumbnail],
    },
  };
}

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({
    id: project.id,
  }));
}

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const project = await getProject(params.id);
  
  if (!project) {
    notFound();
  }

  const projects = await getProjects();
  const currentIndex = projects.findIndex(p => p.id === project.id);
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;

  return (
    <main className="min-h-screen bg-bg-primary overflow-y-auto scrollable-content">
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-accent-warm transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to All Projects
          </Link>

          <div className="relative aspect-video rounded-xl overflow-hidden mb-8 animate-fade-in">
            <Image 
              src={project.thumbnail} 
              alt={project.title} 
              fill 
              className="object-cover" 
              priority 
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
          </div>

          <div className="animate-slide-up animation-delay-100">
            <h1 className="mb-4">{project.title}</h1>
            <div className="prose prose-lg max-w-none mb-8" dangerouslySetInnerHTML={{ __html: project.description }} />

            <div className="flex flex-wrap gap-2 mb-8">
              {project.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 text-sm rounded-full bg-accent-earth/20 border border-accent-earth/30 hover:bg-accent-earth/30 transition-colors">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 mb-12">
              {project.links.github && (
                <a 
                  href={project.links.github} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="button-secondary flex items-center gap-2 group"
                >
                  <Github className="w-5 h-5 transition-transform group-hover:rotate-12" /> 
                  View Code
                </a>
              )}
              {project.links.live && (
                <a 
                  href={project.links.live} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="button-primary flex items-center gap-2 group"
                >
                  <ExternalLink className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /> 
                  Live Demo
                </a>
              )}
              {project.links.youtube && (
                <a 
                  href={project.links.youtube} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="button-secondary flex items-center gap-2 group hover:text-red-400 hover:border-red-400/50"
                >
                  <Youtube className="w-5 h-5 transition-transform group-hover:scale-110" /> 
                  Watch Video
                </a>
              )}
            </div>
          </div>

          {project.images.length > 0 && (
            <div className="space-y-8 animate-fade-in animation-delay-200">
              <h2>Gallery</h2>
              <div className="grid gap-4">
                {project.images.map((image, index) => (
                  <div key={index} className="relative aspect-video rounded-lg overflow-hidden glass">
                    <Image 
                      src={image} 
                      alt={`${project.title} - Image ${index + 1}`} 
                      fill 
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mt-16 pt-8 border-t border-text-secondary/10">
            {prevProject ? (
              <Link 
                href={`/projects/${prevProject.id}`} 
                className="group flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <div>
                  <div className="text-sm">Previous</div>
                  <div className="font-medium">{prevProject.title}</div>
                </div>
              </Link>
            ) : <div />}
            
            {nextProject ? (
              <Link 
                href={`/projects/${nextProject.id}`} 
                className="group flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors text-right"
              >
                <div>
                  <div className="text-sm">Next</div>
                  <div className="font-medium">{nextProject.title}</div>
                </div>
                <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : <div />}
          </div>
        </div>
      </div>
    </main>
  );
}