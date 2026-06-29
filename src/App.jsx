import { useEffect, useRef } from 'react';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Skills from './components/Skills.jsx';
import Projects from './components/Projects.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import ScrollVelocity from './components/MyComponents/ScrollVelocity.jsx';
import { initPortfolio } from './portfolioEffects.js';
import { initSmoothScroll } from './smoothScroll.js';

export default function App() {
  const started = useRef(false);

  useEffect(() => {
    // Una sola inicialización (evita doble ejecución en StrictMode dev).
    if (started.current) return;
    started.current = true;
    initPortfolio();
    initSmoothScroll();
  }, []);

  return (
    <>
      <a className="skip" href="#main">Saltar al contenido</a>

      <Nav />
      <Hero />

      <main id="main">
        <About />
        <Skills />

        <div className="velocity-band" aria-hidden="true">
          <ScrollVelocity
            texts={['Software Developer · UX/UI Designer ·', 'Frontend · Backend · Design ·']}
            velocity={60}
            className="vel-text"
          />
        </div>

        <Projects />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
