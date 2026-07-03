import { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, Code } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const initialTheme = savedTheme || 'dark';
    setTheme(initialTheme);
    
    if (initialTheme === 'light') {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'light') {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
  };

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Achievements', href: '#achievements' },
    { name: 'Contact', href: '#contact' },
    { name: 'Blog', href: '#blog' },
  ];

  return (
    <nav 
      className={`glass-card fixed left-1/2 -translate-x-1/2 w-[95%] max-w-[1200px] z-[1000] !rounded-[40px] px-6 py-3 transition-all duration-300 ease-in-out ${
        scrolled ? 'top-2 shadow-[0_10px_30px_rgba(0,0,0,0.2)]' : 'top-4'
      }`}
    >
      <div className="flex justify-between items-center p-0">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-2 font-heading text-[1.3rem] font-bold text-text-primary no-underline tracking-tight">
          <Code className="text-color-primary" size={24} />
          <span>Ashwani<span className="text-color-secondary">.dev</span></span>
        </a>

        {/* Desktop Menu links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="no-underline font-heading font-medium text-[0.95rem] text-text-secondary transition-colors duration-300 ease-in-out hover:text-text-primary relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-gradient-brand after:transition-all after:duration-300 after:ease-in-out hover:after:w-full"
            >
              {link.name}
            </a>
          ))}
          
          <button 
            onClick={toggleTheme} 
            className="bg-tag-bg border border-border-color text-text-primary w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ease-in-out hover:bg-border-color hover:border-color-primary hover:rotate-[15deg]"
            aria-label="Toggle visual theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Mobile menu trigger + theme button */}
        <div className="flex md:hidden items-center gap-3">
          <button 
            onClick={toggleTheme} 
            className="bg-tag-bg border border-border-color text-text-primary w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ease-in-out hover:bg-border-color hover:border-color-primary hover:rotate-[15deg]"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="bg-transparent border-none text-text-primary cursor-pointer"
            aria-label="Toggle navigation drawer"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="glass-card absolute top-[76px] left-0 w-full flex flex-col p-6 gap-4 animate-slide-up">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="no-underline font-heading font-medium text-[1.1rem] text-text-secondary py-2 border-b border-border-color transition-colors duration-300 ease-in-out hover:text-text-primary"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
