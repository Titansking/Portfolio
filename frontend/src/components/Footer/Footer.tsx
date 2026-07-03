import { Code } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border-color bg-bg-secondary py-12">
      <div className="container mx-auto px-6 flex flex-col items-center gap-8">
        {/* Brand details */}
        <div className="text-center flex flex-col items-center gap-2">
          <a href="#" className="flex items-center gap-2 font-heading text-lg font-bold text-text-primary no-underline">
            <Code className="text-color-primary" size={20} />
            <span>Ashwani<span className="text-color-secondary">.dev</span></span>
          </a>
          <p className="text-sm text-text-muted">
            Full-Stack Developer | SaaS App Architect
          </p>
        </div>

        {/* Quick Links shortcut list */}
        <div className="flex flex-wrap justify-center gap-6">
          {['About', 'Skills', 'Experience', 'Projects', 'Achievements', 'Contact', 'Blog', 'Admin Console'].map((name) => {
            const hash = name === 'Admin Console' ? '#admin' : name === 'Blog' ? '#blog' : `#${name.toLowerCase()}`;
            return (
              <a 
                key={name}
                href={hash} 
                className="text-sm text-text-secondary hover:text-text-primary no-underline transition-colors duration-300 font-heading font-medium"
              >
                {name}
              </a>
            );
          })}
        </div>

        {/* Copyright label */}
        <div className="w-full border-t border-border-color/60 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-text-muted gap-2">
          <p>© {currentYear} Ashwani Kumar. All rights reserved.</p>
          <p className="text-text-muted">
            Built with React, TS, and Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
}
