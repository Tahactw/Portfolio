import { Metadata } from 'next';
import { ContactForm } from '@/components/ui/ContactForm';
import { Mail, MapPin } from 'lucide-react';
import { TypewriterHeading } from '@/components/ui/TypewriterHeading';

export const metadata: Metadata = {
  title: 'Contact | Portfolio',
  description: 'Get in touch for collaborations and opportunities',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-arena-dark overflow-y-auto scrollable-content">
      <div className="container mx-auto px-4 pt-40 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <TypewriterHeading texts={['GET IN TOUCH', 'CONTACT ME', 'SAY HELLO']} className="text-5xl md:text-7xl mb-4" />
            <p className="text-xl text-text-secondary animate-fade-in">
              I'm always open to discussing new projects and opportunities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="space-y-8 animate-slide-up">
              <div>
                <h2 className="text-2xl mb-4 font-display">Let's Connect</h2>
                <p className="text-text-secondary">
                  Whether you have a project in mind or just want to chat about 
                  mechatronics and creative technology, I'd love to hear from you.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-lg bg-accent-cyan/20 flex items-center justify-center group-hover:bg-accent-cyan/30 transition-colors">
                    <Mail className="w-5 h-5 text-accent-cyan" />
                  </div>
                  <div>
                    <div className="text-sm text-text-secondary font-display uppercase">Email</div>
                    <a href="mailto:taha222869@hu.edu.eg" className="hover:text-accent-cyan transition-colors">
                      taha222869@hu.edu.eg
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-lg bg-accent-purple/20 flex items-center justify-center group-hover:bg-accent-purple/30 transition-colors">
                    <MapPin className="w-5 h-5 text-accent-purple" />
                  </div>
                  <div>
                    <div className="text-sm text-text-secondary font-display uppercase">Location</div>
                    <div>Rehab City, Egypt</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="glass-heavy rounded-2xl p-6 animate-scale-in">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}