import { Suspense, lazy, useEffect, useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import StackMarquee from './components/StackMarquee/StackMarquee';
import About from './components/About/About';
import Skills from './components/Skills/Skills';
import Experience from './components/Experience/Experience';
import Projects from './components/Projects/Projects';
import Achievements from './components/Achievements/Achievements';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import { recordPageHit } from './services/api';

/* Neither subpage is reachable from the landing page's critical path, and
   Admin in particular is a separate authenticated surface. Splitting them
   keeps them out of the initial bundle. */
const Admin = lazy(() => import('./components/Admin/Admin'));
const Blog = lazy(() => import('./components/Blog/Blog'));

function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <p className="font-mono text-sm text-ink-mute">Loading…</p>
    </div>
  );
}

// Single-page shell with a lightweight hash router. #blog and #admin render
// full subpages; every other hash is an anchor on the landing page.
function App() {
  const [currentPath, setCurrentPath] = useState('#home');

  useEffect(() => {
    // Analytics should not sit on the critical path.
    const hit = window.setTimeout(() => void recordPageHit(), 1200);
    const cleanupHit = () => window.clearTimeout(hit);

    const handleHashChange = () => {
      const hash = window.location.hash || '#home';
      setCurrentPath(hash);

      if (hash === '#blog' || hash === '#admin') {
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

  const isSubpage = currentPath === '#admin' || currentPath === '#blog';

  if (isSubpage) {
    return (
      <>
        <Navbar />
        <main className="pt-28">
          <Suspense fallback={<RouteFallback />}>
            {currentPath === '#admin' ? <Admin /> : <Blog />}
          </Suspense>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <StackMarquee />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Achievements />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;
