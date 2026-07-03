import { useState } from 'react';
import { ExternalLink, ChevronDown, ChevronUp, Layers, Users, ShieldCheck } from 'lucide-react';

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
    <path d="M9 18c-4.51 2-5-2-7-2"></path>
  </svg>
);

export default function Projects() {
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  const projects = [
    {
      id: 'gdocs',
      title: 'Google Docs Clone',
      subtitle: 'Real-time Collaborative Document Editor',
      description: 'A collaborative real-time text document editor offering multi-user concurrent editing, real-time presence tracking, and flexible export facilities.',
      tech: ['React.js', 'TypeScript', 'Convex', 'Clerk Auth', 'Liveblocks'],
      github: 'https://github.com/Titansking',
      demo: '#',
      highlights: [
        'Real-Time Collaboration: Integrated Liveblocks for concurrent typing sync and dynamic workspace editing.',
        'Presence Indicators: Render active cursors and hover avatars of active users on the document.',
        'Authentication & Workspaces: Protected workspace routing via Clerk with permission controls.',
        'Rich Document Utilities: Added customizable margins, dynamic tables, image insertions, and export formatting to PDF, HTML, TXT, and JSON.'
      ],
      icon: <Users size={24} />
    },
    {
      id: 'taskflow',
      title: 'Task Flow',
      subtitle: 'Kanban Project Management Platform',
      description: 'A full-stack project tracking board mimicking modern agile tools, using Express APIs and MongoDB document storage.',
      tech: ['React.js', 'Node.js', 'Express.js', 'TypeScript', 'MongoDB', 'Tailwind CSS', 'Shadcn UI'],
      github: 'https://github.com/Titansking',
      demo: 'https://task-flow-ivory-five.vercel.app/',
      highlights: [
        'Interactive Boards: Drag-and-drop column boards styled with Shadcn UI responsive modules.',
        'Secure Sessions: Implemented JWT authorization cookies, bcrypt payload hashes, and Express middleware route guards.',
        'Flexible Database Schemas: Structured MongoDB documents optimized for quick task updates and column movements.',
        'Full TypeScript Integration: Shared type contracts between frontend state and Express model payloads.'
      ],
      icon: <Layers size={24} />
    }
  ];

  const toggleExpand = (id: string) => {
    setExpandedProject(prev => prev === id ? null : id);
  };

  return (
    <section id="projects" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl font-bold mb-3">Featured <span className="gradient-text">Projects</span></h2>
          <p className="text-text-secondary text-[1.1rem] max-w-[600px] mx-auto">A closer look at flagship SaaS architectures and collaborative tools built from design to code.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {projects.map((project) => {
            const isExpanded = expandedProject === project.id;
            return (
              <div 
                key={project.id} 
                className={`glass-card p-8 flex flex-col gap-6 transition-all duration-300 hover:scale-[1.01] hover:border-border-hover ${
                  isExpanded ? 'border-color-primary/30 shadow-[0_12px_40px_rgba(0,0,0,0.45)]' : ''
                }`}
              >
                {/* Visual Header */}
                <div className="flex justify-between items-center mb-2">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-color-primary flex items-center justify-center">
                    {project.icon}
                  </div>
                  <div className="flex gap-3">
                    <a 
                      href={project.github} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-10 h-10 rounded-full bg-tag-bg border border-border-color text-text-secondary flex items-center justify-center hover:bg-gradient-brand hover:text-bg-primary hover:border-transparent transition-all duration-300"
                      aria-label="View Source Code"
                    >
                      <GithubIcon />
                    </a>
                    {project.demo && project.demo !== '#' ? (
                      <a 
                        href={project.demo} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-tag-bg border border-border-color text-text-secondary flex items-center justify-center hover:bg-gradient-brand hover:text-bg-primary hover:border-transparent transition-all duration-300"
                        aria-label="View Live Project"
                      >
                        <ExternalLink size={18} />
                      </a>
                    ) : (
                      <span 
                        className="w-10 h-10 rounded-full bg-tag-bg/30 border border-border-color/30 text-text-muted flex items-center justify-center cursor-not-allowed"
                        title="Live Demo coming soon"
                      >
                        <ExternalLink size={18} className="opacity-40" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Info Text */}
                <div className="flex flex-col gap-4">
                  <span className="text-xs font-bold text-color-primary uppercase tracking-wider">{project.subtitle}</span>
                  <h3 className="font-heading text-2xl font-bold text-text-primary">{project.title}</h3>
                  <p className="text-[0.95rem] text-text-secondary leading-relaxed">{project.description}</p>

                  {/* Tech badges */}
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((t) => (
                      <span key={t} className="px-3 py-1.5 bg-tag-bg border border-border-color rounded-[20px] text-color-primary text-xs font-semibold">
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Expander Button */}
                  <button 
                    onClick={() => toggleExpand(project.id)} 
                    className="btn btn-secondary w-full mt-2 py-3 flex justify-center items-center gap-2 text-sm"
                  >
                    <span>{isExpanded ? 'Hide Technical Highlights' : 'Show Technical Highlights'}</span>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>

                  {/* Expanding Section */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-border-color flex flex-col gap-3 animate-slide-up">
                      <h4 className="font-heading text-[1rem] font-bold text-text-primary">Technical Highlights</h4>
                      <ul className="flex flex-col gap-3">
                        {project.highlights.map((h, i) => {
                          const [title, desc] = h.split(': ');
                          return (
                            <li key={i} className="flex items-start gap-3 text-[0.9rem] text-text-secondary leading-relaxed">
                              <ShieldCheck size={16} className="text-color-primary shrink-0 mt-0.5" />
                              <div>
                                <strong>{title}:</strong> {desc}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
