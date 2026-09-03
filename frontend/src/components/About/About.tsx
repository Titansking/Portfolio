import { GraduationCap, BrainCircuit, Lightbulb, MapPin, Download } from 'lucide-react';
import profileImg from '../../assets/profile.png';
import { trackResumeDownload } from '../../services/api';

export default function About() {
  const handleDownloadResume = async (e: React.MouseEvent) => {
    e.preventDefault();
    trackResumeDownload();
    const link = document.createElement('a');
    link.href = '/resume.pdf';
    link.setAttribute('download', 'Ashwani_Kumar_Resume.pdf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const interests = [
    {
      icon: <BrainCircuit size={24} />,
      title: 'Technology Focus',
      description: 'Interested in Internet of Things (IoT), open-source development, and applying machine learning models.'
    },
    {
      icon: <Lightbulb size={24} />,
      title: 'Problem Solving & Innovation',
      description: 'Fascinated by high-level system design, microservices architecture, and agile development processes.'
    },
    {
      icon: <GraduationCap size={24} />,
      title: 'Continuous Learning',
      description: 'Actively tracking emerging full-stack tools, web standards, and cloud-native software architectures.'
    }
  ];

  return (
    <section id="about" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl font-bold mb-3">About <span className="gradient-text">Me</span></h2>
          <p className="text-text-secondary text-[1.1rem] max-w-[600px] mx-auto">Get to know my academic background, technical focus, and areas of interest.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Column 1: Biography with small profile image embedded */}
          <div className="glass-card p-10 flex flex-col gap-5">
            <div className="flex items-center gap-6 border-b border-border-color pb-5">
              <div className="w-16 h-16 rounded-full overflow-hidden border border-border-color shrink-0">
                <img src={profileImg} alt="Ashwani Kumar" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold text-text-primary">Ashwani Kumar</h3>
                <p className="text-[0.9rem] text-text-secondary mt-1">Ex-Full-Stack Developer Intern @ Krafzen Inc.</p>
                <div className="flex items-center gap-1.5 text-xs text-text-muted mt-1">
                  <MapPin size={16} className="text-color-primary" />
                  <span>Kolkata, India</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-4 text-text-secondary text-[0.95rem] leading-relaxed">
              <p>
                I am pursuing my Bachelor of Technology in Computer Science and Engineering from Rungta College 
                of Engineering and Technology (2022–2026). My journey into software engineering started with building web applications 
                and has evolved into architecting scalable SaaS platforms and real-time systems.
              </p>
              <p>
                I thrive in collaborative, fast-paced teams (demonstrated during my remote full-stack developer internship at Krafzen Inc.), 
                where I engineered full-stack SaaS features, participated in sprint workflows, and resolved architectural bottlenecks.
              </p>
              <div className="mt-2">
                <button onClick={handleDownloadResume} className="btn btn-secondary flex items-center gap-2">
                  Download Full Resume <Download size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Column 2: Education Timeline */}
          <div className="glass-card p-10 flex flex-col gap-5">
            <h3 className="font-heading text-xl font-bold text-text-primary border-b border-border-color pb-3">Academic Journey</h3>
            
            <div className="flex flex-col gap-0">
              <div className="flex gap-6 relative pb-6 border-l-2 border-border-color pl-6 ml-3 last:border-transparent last:pb-0">
                <div className="absolute left-[-9px] top-1 w-[18px] h-[18px] rounded-full bg-bg-primary border-2 border-color-primary flex items-center justify-center text-color-primary z-10">
                  <GraduationCap size={10} />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[0.8rem] font-bold text-color-primary">2022 – 2026</span>
                  <h4 className="font-heading text-[1.1rem] font-semibold text-text-primary">Bachelor of Technology in Computer Science and Engineering</h4>
                  <p className="text-text-secondary text-[0.95rem]">Rungta College of Engineering and Technology</p>
                  <p className="text-[0.85rem] text-text-muted">Bhilai, India</p>
                </div>
              </div>

              <div className="flex gap-6 relative pb-6 border-l-2 border-border-color pl-6 ml-3 last:border-transparent last:pb-0">
                <div className="absolute left-[-9px] top-1 w-[18px] h-[18px] rounded-full bg-bg-primary border-2 border-color-primary flex items-center justify-center text-color-primary z-10">
                  <GraduationCap size={10} />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[0.8rem] font-bold text-color-primary">2020 – 2022</span>
                  <h4 className="font-heading text-[1.1rem] font-semibold text-text-primary">Higher Secondary Education (Class XII)</h4>
                  <p className="text-text-secondary text-[0.95rem]">Sardar Patel Public School</p>
                  <p className="text-[0.85rem] text-text-muted">Bokaro, India</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Areas of Interest Rows */}
        <h3 className="font-heading text-2xl font-bold text-center text-text-primary mb-10">Areas of Interest</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {interests.map((item, index) => (
            <div key={index} className="glass-card p-8 flex flex-col gap-4 text-center items-center transition-all duration-300 hover:scale-[1.02] hover:border-border-hover">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-color-primary">
                {item.icon}
              </div>
              <h4 className="font-heading text-lg font-bold text-text-primary">{item.title}</h4>
              <p className="text-[0.9rem] text-text-secondary leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
