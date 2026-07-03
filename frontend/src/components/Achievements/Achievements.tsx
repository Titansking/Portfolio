import { Award, Code2, GitMerge, CheckCircle2 } from 'lucide-react';

export default function Achievements() {
  const stats = [
    {
      icon: <Code2 size={24} />,
      value: '400+',
      label: 'Coding Ninjas Problems',
      detail: 'Solved mostly in Java, focusing on complex recursion, trees, and dynamic programming.'
    },
    {
      icon: <Code2 size={24} />,
      value: '140+',
      label: 'GeeksforGeeks Problems',
      detail: 'Data structure challenges covering arrays, search, sorting algorithms, and system designs.'
    },
    {
      icon: <GitMerge size={24} />,
      value: '4 PRs',
      label: 'Hacktoberfest 2023',
      detail: 'Accepted open-source contributions. Received digital credentials and a tree planted via Tree-Nation.'
    }
  ];

  const certifications = [
    {
      title: 'Data Structures & Algorithms',
      issuer: 'Coding Ninjas',
      description: 'Comprehensive course covering fundamental algorithms and problem-solving techniques.'
    },
    {
      title: 'Web Dev Bootcamp – 30 Days Coding',
      issuer: 'MERN Stack & Web Dev',
      description: 'Full-stack development covering HTML, CSS, JavaScript, and database connections.'
    },
    {
      title: 'Java Programming',
      issuer: 'Oracle Certified',
      description: 'OOP programming principles, exception handling, data structures, and Java core fundamentals.'
    },
    {
      title: 'Git & GitHub',
      issuer: 'FreeCodeCamp',
      description: 'Version control methodologies, branch workflows, and remote repository collaboration.'
    }
  ];

  return (
    <section id="achievements" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl font-bold mb-3">Achievements & <span className="gradient-text">Certifications</span></h2>
          <p className="text-text-secondary text-[1.1rem] max-w-[600px] mx-auto">Verified certificates, coding statistics, and letters of recommendation from my journey.</p>
        </div>

        {/* Featured Recommendation Quote */}
        <div className="glass-card max-w-4xl mx-auto p-10 text-center flex flex-col gap-6 items-center mb-16 relative overflow-hidden">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-color-primary flex items-center justify-center">
            <Award size={32} />
          </div>
          <blockquote className="font-heading text-lg sm:text-xl italic font-medium text-text-primary leading-relaxed max-w-[700px]">
            "Received a Letter of Recommendation recognizing strong full-stack skills, reliable, and proactive work during the internship."
          </blockquote>
          <div className="flex flex-col gap-1">
            <span className="font-heading font-bold text-text-primary text-[1.1rem]">Khadija Zain</span>
            <span className="text-xs text-text-muted">CEO, Krafzen Inc.</span>
          </div>
        </div>

        {/* Numeric coding stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, idx) => (
            <div key={idx} className="glass-card p-8 flex flex-col gap-4 text-center items-center transition-all duration-300 hover:scale-[1.02] hover:border-border-hover">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-color-primary flex items-center justify-center">
                {stat.icon}
              </div>
              <div className="font-heading text-3xl font-extrabold text-text-primary">{stat.value}</div>
              <div className="font-heading font-semibold text-[1.1rem] text-text-secondary">{stat.label}</div>
              <p className="text-[0.85rem] text-text-muted leading-relaxed">{stat.detail}</p>
            </div>
          ))}
        </div>

        {/* Certifications Grid */}
        <h3 className="font-heading text-2xl font-bold text-center text-text-primary mb-10">Verified Certifications</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {certifications.map((cert, index) => (
            <div key={index} className="glass-card p-8 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 hover:border-border-hover">
              <div className="flex items-center gap-2 text-text-muted text-xs">
                <CheckCircle2 className="text-color-primary shrink-0" size={20} />
                <span className="font-semibold text-color-primary">{cert.issuer}</span>
              </div>
              <h4 className="font-heading text-lg font-bold text-text-primary">{cert.title}</h4>
              <p className="text-[0.9rem] text-text-secondary leading-relaxed">{cert.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
