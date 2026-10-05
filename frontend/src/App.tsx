import { Suspense, lazy, useEffect, useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import StackMarquee from './components/StackMarquee/StackMarquee';
import About from './components/About/About';
import Experience from './components/Experience/Experience';
import Skills from './components/Skills/Skills';
import Projects from './components/Projects/Projects';
import Achievements from './components/Achievements/Achievements';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import { recordPageHit } from './services/api';

/* The admin console is an authenticated surface, not reachable from the
   landing page, so it stays out of the initial bundle. */
const Admin = lazy(() => import('./components/Admin/Admin'));

function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <p className="font-mono text-sm text-ink-mute">Loading…</p>
    </div>
  );
}

// Single-page shell with a lightweight hash router. #admin renders a full
// subpage; every other hash is an anchor on the landing page.
function App() {
  const [currentPath, setCurrentPath] = useState('#home');

  useEffect(() => {
    // Analytics should not sit on the critical path.
    const hit = window.setTimeout(() => void recordPageHit(), 1200);
    const cleanupHit = () => window.clearTimeout(hit);

    const handleHashChange = () => {
      const hash = window.location.hash || '#home';
      setCurrentPath(hash);

      if (hash === '#admin') {
        window.scrollTo(0, 0);
        return;
      }

      const id = hash.replace('#', '');
      // Deferred one frame so the target exists before we scroll to it.
      requestAnimationFrame(() => {
        const target =
          id === 'home' || id === '' || id === 'hero'
            ? document.getElementById('hero')
            : document.getElementById(id);
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      cleanupHit();
    };
  }, []);

  if (currentPath === '#admin') {
    return (
      <>
        <Navbar />
        <main className="pt-28">
          <Suspense fallback={<RouteFallback />}>
            <Admin />
          </Suspense>
        </main>
        <Footer />
      </>
    );
  }

  /* Section order mirrors the resume top to bottom: education and about, then
     the internship, then skills, then the work, then certifications, then
     contact. A recruiter reading the PDF and the site in parallel never has
     to jump around. */
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <StackMarquee />
        <About />
        <Experience />
        <Skills />
        <Projects />
        <Achievements />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;
