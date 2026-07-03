import { useState, useEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Skills from './components/Skills/Skills';
import Experience from './components/Experience/Experience';
import Projects from './components/Projects/Projects';
import Achievements from './components/Achievements/Achievements';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import Admin from './components/Admin/Admin';
import Blog from './components/Blog/Blog';
import { recordPageHit } from './services/api';

// Welcome developer! This is the main application shell.
// We arrange our structured components sequentially, or route dynamically using a lightweight
// hash router supporting /#blog and /#admin consoles.
function App() {
  const [currentPath, setCurrentPath] = useState('#home');

  useEffect(() => {
    // Record page view hits asynchronously in the database when the landing page loads
    recordPageHit();

    const handleHashChange = () => {
      const hash = window.location.hash || '#home';
      setCurrentPath(hash);

      if (hash === '#blog' || hash === '#admin') {
        // Reset scroll position to top for subpages
        window.scrollTo(0, 0);
      } else {
        // Handle landing page anchor navigation smoothly
        const id = hash.replace('#', '');
        setTimeout(() => {
          const target = id === 'home' || id === '' || id === 'hero' 
            ? document.getElementById('hero') 
            : document.getElementById(id);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 80);
      }
    };

    // Run once on mount to handle initial load hash
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderContent = () => {
    if (currentPath === '#admin') {
      return <Admin />;
    }
    if (currentPath === '#blog') {
      return <Blog />;
    }

    // Default: Single Page Landing Layout
    return (
      <main>
        {/* Intro Hero Section */}
        <Hero />

        {/* Detailed Biography, Education, and Interests */}
        <About />

        {/* Technical Folder Grid Skills */}
        <Skills />

        {/* Job Timeline Experience */}
        <Experience />

        {/* SaaS Projects Showcase with drilldowns */}
        <Projects />

        {/* Stats, Recommendations, and Certificates */}
        <Achievements />

        {/* Dynamic Contact Form with Express endpoint submissions */}
        <Contact />
      </main>
    );
  };

  return (
    <>
      {/* Global Navigation capsule */}
      <Navbar />

      {renderContent()}

      {/* Credits Footer */}
      <Footer />
    </>
  );
}

export default App;
