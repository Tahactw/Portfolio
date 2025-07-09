import { Metadata } from 'next';
import fs from 'fs/promises';
import path from 'path';
import Image from 'next/image';
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';
import { TypewriterHeading } from '@/components/ui/TypewriterHeading';

export const metadata: Metadata = {
  title: 'About | Taha Mohammed',
  description: 'Digital CV of Taha Mohammed, a Mechatronics Engineer and Creative Developer.',
};

async function getAboutData() {
  const filePath = path.join(process.cwd(), 'data', 'about.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  return JSON.parse(fileContents);
}

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <section>
    <h3 className="font-display text-2xl mb-6 text-accent-purple uppercase tracking-wider">{title}</h3>
    {children}
  </section>
);

export default async function AboutPage() {
  const data = await getAboutData();

  return (
    <main className="min-h-screen bg-arena-dark text-text-primary font-body overflow-y-auto scrollable-content">
      <div className="container mx-auto p-8 md:p-16 lg:p-24 pt-40">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <aside className="lg:col-span-1 space-y-8">
            <div className="flex flex-col items-center p-8 glass-heavy rounded-2xl">
              <Image 
                src={data.profile.imageUrl} 
                alt={data.profile.name} 
                width={150} 
                height={150} 
                className="rounded-full border-4 border-accent-cyan mb-4"
                priority
              />
              <h1 className="text-3xl font-display text-center">{data.profile.name}</h1>
              <h2 className="text-lg text-accent-cyan font-display uppercase tracking-widest text-center">{data.profile.title}</h2>
            </div>

            <div className="p-8 glass-heavy rounded-2xl space-y-4">
              <h3 className="font-display text-xl border-b-2 border-accent-purple pb-2 mb-4">Contact</h3>
              <div className="flex items-center gap-3"><Mail className="w-5 h-5 text-accent-cyan" /> <a href={`mailto:${data.contact.email}`} className="hover:text-accent-cyan">{data.contact.email}</a></div>
              <div className="flex items-center gap-3"><Phone className="w-5 h-5 text-accent-cyan" /> <span>{data.contact.phone}</span></div>
              <div className="flex items-center gap-3"><MapPin className="w-5 h-5 text-accent-cyan" /> <span>{data.contact.location}</span></div>
            </div>

            <div className="p-8 glass-heavy rounded-2xl space-y-4">
              <h3 className="font-display text-xl border-b-2 border-accent-purple pb-2 mb-4">Links</h3>
              <div className="flex items-center gap-3"><Globe className="w-5 h-5 text-accent-cyan" /> <a href={data.contact.website} target="_blank" rel="noopener noreferrer" className="hover:text-accent-cyan">TahaAnimation.Studio</a></div>
              <div className="flex items-center gap-3"><Linkedin className="w-5 h-5 text-accent-cyan" /> <a href={data.contact.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-accent-cyan">LinkedIn</a></div>
              <div className="flex items-center gap-3"><Github className="w-5 h-5 text-accent-cyan" /> <a href={data.contact.github} target="_blank" rel="noopener noreferrer" className="hover:text-accent-cyan">GitHub</a></div>
            </div>
            
            <div className="p-8 glass-heavy rounded-2xl">
              <h3 className="font-display text-xl border-b-2 border-accent-purple pb-2 mb-4">Languages</h3>
              {data.languages.map((lang: any) => (
                <div key={lang.language} className="flex justify-between items-baseline">
                  <span>{lang.language}</span>
                  <span className="text-sm text-text-secondary">{lang.proficiency}</span>
                </div>
              ))}
            </div>
            
          </aside>

          <div className="lg:col-span-2 space-y-12">
            <Section title="Profile">
              <p className="text-text-secondary leading-relaxed">{data.summary}</p>
            </Section>
            
            <Section title="Work Experience">
              <div className="relative border-l-2 border-arena-border pl-8 space-y-10">
                {data.experience.map((job: any, index: number) => (
                  <div key={index} className="relative">
                    <div className="absolute -left-[37px] top-1 w-6 h-6 bg-accent-purple rounded-full ring-4 ring-arena-dark" />
                    <p className="text-sm font-display text-text-secondary">{job.date}</p>
                    <h4 className="text-xl font-bold font-display">{job.title}</h4>
                    <p className="text-md text-accent-cyan mb-2">{job.company}</p>
                    <p className="text-text-secondary whitespace-pre-line">{job.description}</p>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Education">
               <div className="relative border-l-2 border-arena-border pl-8 space-y-10">
                {data.education.map((edu: any, index: number) => (
                  <div key={index} className="relative">
                    <div className="absolute -left-[37px] top-1 w-6 h-6 bg-accent-cyan rounded-full ring-4 ring-arena-dark" />
                    <p className="text-sm font-display text-text-secondary">{edu.date}</p>
                    <h4 className="text-xl font-bold font-display">{edu.degree}</h4>
                    <p className="text-md text-accent-cyan mb-2">{edu.institution}</p>
                    {edu.details && <p className="text-text-secondary">{edu.details}</p>}
                  </div>
                ))}
              </div>
            </Section>
            
            <Section title="Skills">
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill: string) => (
                  <span key={skill} className="bg-arena-floor text-sm px-3 py-1 rounded-full border border-arena-border">{skill}</span>
                ))}
              </div>
            </Section>
          </div>
        </div>
      </div>
    </main>
  );
}