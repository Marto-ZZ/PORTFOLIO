import { useEffect, useState } from 'react';
import Starfield from './UI/Starfield.jsx';
import Galaxy from './UI/Galaxy.jsx';
import SaturnSystem from './UI/SaturnSystem.jsx';

// Se está probando el fondo Galaxy (reactbits.dev) en reemplazo de Starfield.
// ?fondo=starfield vuelve al anterior sin tocar código, para comparar.
function useHeroBg() {
  const [bg, setBg] = useState('galaxy');
  useEffect(() => {
    const q = new URLSearchParams(location.search).get('fondo');
    if (q === 'starfield' || q === 'galaxy') setBg(q);
  }, []);
  return bg;
}

export default function Hero() {
  const bg = useHeroBg();

  return (
    <section id="inicio" className="hero">
      <div className="hero-bg" aria-hidden="true">
        {bg === 'starfield' ? <Starfield /> : <Galaxy />}
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
