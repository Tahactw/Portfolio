import { Metadata } from 'next';
import { getExperiences } from '@/lib/data';
import { Timeline } from '@/components/ui/Timeline';

export const metadata: Metadata = {
  title: 'Experience | Portfolio',
  description: 'My professional journey and experience in mechatronics engineering and creative development',
};

export const revalidate = 10;

export default async function ExperiencePage() {
  const experiences = await getExperiences();

  return (
    <main className="min-h-screen bg-bg-primary overflow-y-auto scrollable-content">
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="mb-4 animate-slide-down">Experience</h1>
            <p className="text-xl text-text-secondary animate-slide-up animation-delay-100">
              My journey in mechatronics engineering and creative development
            </p>
          </div>
          
          <div className="animate-fade-in animation-delay-200">
            <Timeline experiences={experiences} />
          </div>
          
          <div className="mt-24 animate-slide-up animation-delay-300">
            <h2 className="text-center mb-8">Skills & Expertise</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                'Adobe Premiere Pro', 'After Effects', 'Photoshop', 'Illustrator',
                'Autodesk Maya', 'React/Next.js', 'Three.js', 'Motion Graphics',
                'Character Animation', 'Video Editing', '3D Modeling', 'UI/UX Design',
              ].map((skill, index) => (
                <div 
                  key={skill} 
                  className="glass rounded-lg px-6 py-3 text-center hover:bg-accent-earth/10 transition-all hover:scale-105"
                  style={{ animationDelay: `${300 + index * 50}ms` }}
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}