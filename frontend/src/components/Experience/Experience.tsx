import { Calendar, Briefcase, Award, CheckCircle } from 'lucide-react';

export default function Experience() {
  const contributions = [
    'Refactored shared React components to improve rendering speed, making heavy client pages load noticeably faster.',
    'Assisted in engineering two SaaS applications from basic architectural build-out up to production release.',
    'Collaborated daily with backend and UI/UX design teams to meet deadline-driven sprint milestones.',
    'Reviewed code submissions and debugged multiple critical production bugs impacting performance.'
  ];

  const toolsUsed = ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'SaaS Architecture'];

  return (
    <section id="experience" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl font-bold mb-3">Work <span className="gradient-text">Experience</span></h2>
          <p className="text-text-secondary text-[1.1rem] max-w-[600px] mx-auto">My professional internship experience as a full-stack engineer building production SaaS systems.</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-10 flex flex-col gap-6">
            {/* Header info */}
            <div className="flex items-center gap-6 border-b border-border-color pb-6">
              <div className="w-14 h-14 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-color-primary flex items-center justify-center shrink-0">
                <Briefcase size={28} />
              </div>
              <div className="flex-1 flex flex-col gap-1.5">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <h3 className="font-heading text-2xl font-bold text-text-primary">Full-Stack Developer Intern</h3>
                  <span className="text-xs font-bold px-3 py-1 rounded-[20px] bg-tag-bg border border-border-color text-color-primary">Remote</span>
                </div>
                <div className="flex items-center gap-3 text-text-secondary text-[0.95rem] flex-wrap">
                  <span className="font-semibold text-text-primary">Krafzen Inc.</span>
                  <span className="text-text-muted">•</span>
                  <span className="flex items-center gap-1.5 text-text-muted text-[0.9rem]">
                    <Calendar size={14} className="text-color-primary" />
                    Oct 2025 – Apr 2026
                  </span>
                </div>
              </div>
            </div>

            {/* Content points */}
            <div className="flex flex-col gap-6">
              <div>
                <h4 className="font-heading text-[1.1rem] font-bold text-text-primary mb-3">Core Contributions & Achievements</h4>
                <ul className="flex flex-col gap-3.5">
                  {contributions.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-3.5 text-[0.95rem] text-text-secondary leading-relaxed">
                      <CheckCircle size={18} className="text-color-primary shrink-0 mt-1" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technologies utilized list */}
              <div className="mt-2">
                <h4 className="font-heading text-[1.1rem] font-bold text-text-primary mb-3">Technologies Leveraged</h4>
                <div className="flex flex-wrap gap-2.5">
                  {toolsUsed.map((tech) => (
                    <span key={tech} className="px-3 py-1.5 bg-tag-bg border border-border-color rounded-[20px] text-color-primary text-xs font-semibold">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* CEO LOR highlighted text */}
              <div className="flex items-start gap-4 p-5 bg-color-primary/5 border border-color-primary/15 rounded-xl mt-4">
                <Award size={20} className="text-color-primary shrink-0 mt-0.5" />
                <p className="text-[0.9rem] text-text-secondary leading-relaxed">
                  <strong>Letter of Recommendation Awarded:</strong> Received official LOR from CEO Khadija Zain, 
                  recognizing strong full-stack technical capability, reliability, and proactive bug resolution during 
                  the internship tenure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
