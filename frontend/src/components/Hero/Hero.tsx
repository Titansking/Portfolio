import { useState, useEffect } from 'react';
import { Mail, ArrowRight, CheckCircle2, Download } from 'lucide-react';
import { trackResumeDownload } from '../../services/api';

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
    <path d="M9 18c-4.51 2-5-2-7-2"></path>
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

export default function Hero() {
  const [typedText, setTypedText] = useState('');

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
  const roles = ['Full-Stack Developer', 'SaaS App Builder', 'Open Source Contributor'];
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentRole = roles[roleIndex];
    let timer: any;

    if (isDeleting) {
      timer = setTimeout(() => {
        setTypedText(currentRole.substring(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);
      }, 50);
    } else {
      timer = setTimeout(() => {
        setTypedText(currentRole.substring(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
      }, 100);
    }

    if (!isDeleting && charIndex === currentRole.length) {
      timer = setTimeout(() => setIsDeleting(true), 1500);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, roleIndex]);

  const socialLinks = [
    { icon: <GithubIcon />, url: 'https://github.com/Titansking', label: 'GitHub' },
    { icon: <LinkedinIcon />, url: 'https://linkedin.com/in/ashwani-kumar-898189281', label: 'LinkedIn' },
    { icon: <Mail size={22} />, url: 'mailto:akumarclash1@gmail.com', label: 'Email' }
  ];

  return (
    <section id="hero" className="min-h-screen flex items-center relative overflow-hidden pt-[140px] pb-[80px]">
      {/* Background ambient glow bubbles */}
      <div className="hero-glow-1 absolute w-[400px] h-[400px] rounded-full blur-[120px] z-0 pointer-events-none opacity-50 top-[10%] right-[10%]"></div>
      <div className="hero-glow-2 absolute w-[400px] h-[400px] rounded-full blur-[120px] z-0 pointer-events-none opacity-50 bottom-[20%] left-[5%]"></div>

      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-16 items-center relative z-10 animate-fade-in">
        <div className="flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 bg-tag-bg border border-border-color px-4 py-2 rounded-[30px] w-fit font-heading text-[0.85rem] font-semibold text-color-primary">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Available for Full-Time Roles</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-[3.5rem] font-extrabold leading-[1.1] tracking-tight">
            Hey, I'm <span className="gradient-text">Ashwani Kumar</span>
          </h1>

          <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-text-secondary">
            I'm a <span className="text-color-primary">{typedText}</span>
            <span className="text-color-primary animate-pulse">|</span>
          </h2>

          <p className="text-[1.1rem] text-text-secondary max-w-[600px]">
            Full-Stack Developer specializing in building and maintaining SaaS products with 
            React, Node.js, Express, and MongoDB. Former Intern at Krafzen Inc. with a proven record of 
            optimizing UI rendering performance and resolving critical production bugs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <a href="#projects" className="btn btn-primary flex items-center justify-center gap-2">
              View Work <ArrowRight size={18} />
            </a>
            <button onClick={handleDownloadResume} className="btn btn-secondary flex items-center justify-center gap-2">
              Download CV <Download size={18} />
            </button>
            <a href="#contact" className="btn btn-secondary flex items-center justify-center">
              Contact Me
            </a>
          </div>

          {/* Social Links Row */}
          <div className="flex gap-4 mt-4">
            {socialLinks.map((link, idx) => (
              <a 
                key={idx} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center justify-center w-11 h-11 rounded-full bg-tag-bg border border-border-color text-text-secondary transition-all duration-300 ease-in-out hover:bg-gradient-brand hover:text-bg-primary hover:border-transparent hover:-translate-y-1 no-underline" 
                aria-label={link.label}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Hero Interactive Stats Panel */}
        <div className="w-full">
          <div className="glass-card p-8 flex flex-col gap-6 animate-slide-up">
            <h3 className="font-heading text-[1.25rem] font-bold text-text-primary mb-2 border-b border-border-color pb-3">Development Statistics</h3>
            
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-color-primary shrink-0">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <p className="font-heading text-[1.2rem] font-bold text-text-primary">540+</p>
                <p className="text-[0.85rem] text-text-secondary mt-0.5">Coding Problems Solved (GFG & Coding Ninjas)</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-color-primary shrink-0">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <p className="font-heading text-[1.2rem] font-bold text-text-primary">Ex-Intern, Krafzen</p>
                <p className="text-[0.85rem] text-text-secondary mt-0.5">Internship LOR awarded by CEO Khadija Zain</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-color-primary shrink-0">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <p className="font-heading text-[1.2rem] font-bold text-text-primary">2 SaaS Apps</p>
                <p className="text-[0.85rem] text-text-secondary mt-0.5">Built & Deployed from scratch to release</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
