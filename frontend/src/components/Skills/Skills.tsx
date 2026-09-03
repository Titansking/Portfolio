import { useState } from 'react';
import { Terminal, Database, Cpu, Wrench, Sparkles } from 'lucide-react';

export default function Skills() {
  const [activeTab, setActiveTab] = useState<'languages' | 'databases' | 'tools' | 'core'>('languages');

  const categories = [
    { id: 'languages', label: 'Languages & Frontend', icon: <Terminal size={18} /> },
    { id: 'databases', label: 'Backend & Databases', icon: <Database size={18} /> },
    { id: 'tools', label: 'Auth, Tools & DevOps', icon: <Wrench size={18} /> },
    { id: 'core', label: 'Core CS Competencies', icon: <Cpu size={18} /> },
  ];

  const skillsData = {
    languages: {
      title: 'Languages & Frontend Development',
      subtitle: 'Languages and modern UI frameworks I use to build performant, responsive web applications.',
      skills: [
        { name: 'TypeScript', level: 'Advanced' },
        { name: 'JavaScript (ES6+)', level: 'Advanced' },
        { name: 'Java', level: 'Intermediate' },
        { name: 'React.js', level: 'Advanced' },
        { name: 'Next.js', level: 'Intermediate' },
        { name: 'HTML5', level: 'Advanced' },
        { name: 'CSS3', level: 'Advanced' },
        { name: 'SQL', level: 'Intermediate' },
        { name: 'Tailwind CSS', level: 'Advanced' },
        { name: 'Shadcn UI', level: 'Advanced' }
      ]
    },
    databases: {
      title: 'Backend, APIs & Databases',
      subtitle: 'Server architectures, microservices, RESTful design, and persistent databases.',
      skills: [
        { name: 'Node.js', level: 'Advanced' },
        { name: 'Express.js', level: 'Advanced' },
        { name: 'RESTful APIs', level: 'Advanced' },
        { name: 'Middleware Architecture', level: 'Advanced' },
        { name: 'Microservices', level: 'Intermediate' },
        { name: 'MongoDB', level: 'Advanced' },
        { name: 'MySQL', level: 'Intermediate' },
        { name: 'Convex', level: 'Advanced' },
        { name: 'Mongoose', level: 'Advanced' }
      ]
    },
    tools: {
      title: 'Auth, Tools & DevOps',
      subtitle: 'Authentication workflows, version control, operating systems, and developer tooling.',
      skills: [
        { name: 'JWT', level: 'Advanced' },
        { name: 'Bcrypt', level: 'Advanced' },
        { name: 'Git', level: 'Advanced' },
        { name: 'GitHub', level: 'Advanced' },
        { name: 'GitLab', level: 'Intermediate' },
        { name: 'Linux', level: 'Intermediate' },
        { name: 'VS Code', level: 'Advanced' },
        { name: 'Postman', level: 'Advanced' },
        { name: 'Axios', level: 'Advanced' }
      ]
    },
    core: {
      title: 'Core Computer Science Competencies',
      subtitle: 'Fundamental engineering principles and core CS topics driving structured problem-solving.',
      skills: [
        { name: 'Data Structures & Algorithms (DSA)', level: 'Advanced' },
        { name: 'Object-Oriented Programming (OOP)', level: 'Advanced' },
        { name: 'Database Management Systems (DBMS)', level: 'Advanced' },
        { name: 'Operating Systems', level: 'Intermediate' }
      ]
    }
  };

  const activeCategory = skillsData[activeTab];

  return (
    <section id="skills" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl font-bold mb-3">Technical <span className="gradient-text">Skills</span></h2>
          <p className="text-text-secondary text-[1.1rem] max-w-[600px] mx-auto">Structured technical skillset matching production SaaS and real-time development experience.</p>
        </div>

        {/* Tab Selection Row */}
        <div className="flex flex-wrap gap-4 mb-10 justify-center">
          {categories.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`glass-card flex items-center gap-2 px-6 py-3 cursor-pointer text-text-secondary transition-all duration-300 font-heading font-medium hover:text-color-primary ${
                activeTab === tab.id 
                  ? '!bg-gradient-brand !text-white font-bold shadow-[0_4px_15px_rgba(5,150,105,0.25)] border-transparent' 
                  : 'hover:bg-border-color'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Dynamic Skill Showcase */}
        <div className="glass-card p-10 flex flex-col gap-8">
          <div className="flex justify-between items-center border-b border-border-color pb-6 gap-4">
            <div>
              <h3 className="font-heading text-2xl font-bold text-text-primary">{activeCategory.title}</h3>
              <p className="text-[0.95rem] text-text-secondary mt-1 max-w-[700px]">{activeCategory.subtitle}</p>
            </div>
            <Sparkles className="text-color-primary shrink-0" size={24} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {activeCategory.skills.map((skill, index) => (
              <div key={index} className="glass-card p-5 flex justify-between items-center transition-all duration-300 hover:-translate-y-1 hover:border-border-hover">
                <span className="font-heading font-semibold text-text-primary text-[1.05rem]">{skill.name}</span>
                <span className={`text-[0.75rem] font-bold px-2.5 py-1 rounded-[12px] bg-tag-bg border ${
                  skill.level.toLowerCase() === 'advanced' 
                    ? 'border-color-primary text-color-primary' 
                    : 'border-color-accent text-color-accent'
                }`}>
                  {skill.level}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
