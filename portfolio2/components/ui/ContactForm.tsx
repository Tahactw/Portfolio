'use client';

import { useForm, ValidationError } from '@formspree/react';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

export function ContactForm() {
  const [state, handleSubmit] = useForm(process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID!);

  useEffect(() => {
    if (state.succeeded) {
      toast.success('Message sent successfully!');
    }
  }, [state.succeeded]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2 font-display uppercase">Name</label>
        <input 
          type="text" 
          id="name" 
          name="name"
          className="w-full px-4 py-2 bg-arena-floor border border-arena-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-cyan focus:border-transparent transition-all" 
          required 
        />
        <ValidationError prefix="Name" field="name" errors={state.errors} />
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2 font-display uppercase">Email</label>
        <input 
          type="email" 
          id="email" 
          name="email"
          className="w-full px-4 py-2 bg-arena-floor border border-arena-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-cyan focus:border-transparent transition-all" 
          required 
        />
        <ValidationError prefix="Email" field="email" errors={state.errors} />
      </div>
      
      <div>
        <label htmlFor="subject" className="block text-sm font-medium mb-2 font-display uppercase">Subject</label>
        <input 
          type="text" 
          id="subject" 
          name="subject"
          className="w-full px-4 py-2 bg-arena-floor border border-arena-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-cyan focus:border-transparent transition-all" 
          required 
        />
        <ValidationError prefix="Subject" field="subject" errors={state.errors} />
      </div>
      
      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-2 font-display uppercase">Message</label>
        <textarea 
          id="message" 
          name="message"
          rows={4} 
          className="w-full px-4 py-2 bg-arena-floor border border-arena-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-cyan focus:border-transparent resize-none transition-all" 
          required 
        />
        <ValidationError prefix="Message" field="message" errors={state.errors} />
      </div>
      
      <motion.button 
        type="submit" 
        disabled={state.submitting || state.succeeded}
        whileHover={{ scale: 1.02 }} 
        whileTap={{ scale: 0.98 }} 
        className="w-full py-3 bg-accent-cyan/20 hover:bg-accent-cyan/30 text-accent-cyan border border-accent-cyan/50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-display uppercase tracking-wider"
      >
        {state.submitting ? 'Sending...' : state.succeeded ? 'Sent!' : (
          <>Send Message <Send className="w-4 h-4" /></>
        )}
      </motion.button>
    </form>
  );
}