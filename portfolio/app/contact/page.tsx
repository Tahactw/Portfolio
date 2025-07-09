import { Metadata } from 'next';
import { ContactForm } from '@/components/ui/ContactForm';
import { Mail, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact | Portfolio',
  description: 'Get in touch for collaborations and opportunities',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-bg-primary overflow-y-auto scrollable-content">
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="mb-4 animate-slide-down">Get In Touch</h1>
            <p className="text-xl text-text-secondary animate-slide-up animation-delay-100">
              I'm always open to discussing new projects and opportunities
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="space-y-8 animate-slide-up animation-delay-200">
              <div>
                <h2 className="text-2xl mb-4">Let's Connect</h2>
                <p className="text-text-secondary">
                  Whether you have a project in mind or just want to chat about 
                  mechatronics and creative technology, I'd love to hear from you.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-lg bg-accent-warm/20 flex items-center justify-center group-hover:bg-accent-warm/30 transition-colors">
                    <Mail className="w-5 h-5 text-accent-warm" />
                  </div>
                  <div>
                    <div className="text-sm text-text-secondary">Email</div>
                    <a href="mailto:taha222869@hu.edu.eg" className="hover:text-accent-warm transition-colors">
                      taha222869@hu.edu.eg
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-lg bg-accent-earth/20 flex items-center justify-center group-hover:bg-accent-earth/30 transition-colors">
                    <MapPin className="w-5 h-5 text-accent-earth" />
                  </div>
                  <div>
                    <div className="text-sm text-text-secondary">Location</div>
                    <div>Egypt</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="glass-heavy rounded-2xl p-6 animate-scale-in animation-delay-300">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}