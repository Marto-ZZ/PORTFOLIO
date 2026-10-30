import { useEffect, useRef } from 'react';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Skills from './components/Skills.jsx';
import Projects from './components/Projects.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import { initPortfolio } from './portfolioEffects.js';
import { initSmoothScroll } from './smoothScroll.js';
import Trayecto from './animaciones/Trayecto.jsx';
import ScrollVelocity from './animaciones/BandaVelocidad.jsx';
import { iniciarAnimaciones } from './animaciones/index.js';

export default function App() {
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    initPortfolio();
    initSmoothScroll();
    iniciarAnimaciones();
  }, []);

  return (
    <>
      <a className="skip" href="#main">Saltar al contenido</a>

      <Nav />
      <Trayecto />
      <Hero />

      <main id="main">
        <About />
        <Skills />

        <div className="velocity-band" aria-hidden="true">
          <ScrollVelocity
            texts={['Software Developer - UX/UI Designer -', 'Frontend - Backend - Design -']}
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
