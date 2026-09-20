import { useState, useEffect } from 'react';
import Waves from './UI/Waves.jsx';
import SaturnSystem from './UI/SaturnSystem.jsx';

const readAccent = () =>
  getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#8b7cf6';

export default function Hero() {
  // El canvas necesita un color real, no una variable CSS: tomamos el acento activo
  // y lo re-leemos cuando cambia el tema (atributo data-theme del <html>).
  const [accent, setAccent] = useState(readAccent);
  useEffect(() => {
    const obs = new MutationObserver(() => setAccent(readAccent()));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);

  return (
    <section id="inicio" className="hero">
      <div className="hero-bg" aria-hidden="true">
        <Waves lineColor={accent} waveAmpX={32} waveAmpY={16} />
      </div>

      <div className="container hero-inner">
        <div className="hero-text">
          <h1 className="hero-name">Martín<span>Sogoloff</span></h1>

          <p className="hero-lead"
            data-es="Desarrollador de software y diseñador UX/UI."
            data-en="Software developer and UX/UI designer.">
            Desarrollador de software y diseñador UX/UI.
          </p>

          <div className="hero-ctas">
            <a className="btn btn-primary" href="#proyectos" data-es="Ver proyectos" data-en="View projects">Ver proyectos
              <span className="btn-arrow" aria-hidden="true">→</span></a>
            <a className="btn btn-ghost" href="#contacto" data-es="Contacto" data-en="Get in touch">Contacto</a>
          </div>
        </div>

        {/* Sistema planetario: cada luna con nombre lleva a una sección */}
        <SaturnSystem />
      </div>
    </section>
  );
}
