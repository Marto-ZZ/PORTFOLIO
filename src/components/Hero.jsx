import Galaxy from './UI/Galaxy.jsx';
import SaturnSystem from './UI/SaturnSystem.jsx';
import { Cohete, Satelite } from './UI/Doodles.jsx';

export default function Hero() {
  return (
    <section id="inicio" className="hero">
      <div className="hero-bg" aria-hidden="true">
        <Galaxy />
      </div>

      <div className="container hero-inner">
        <div className="hero-text">
          <h1 className="hero-name">Martín<span>Sogoloff</span></h1>

          <p className="hero-lead"
            data-es="Desarrollador fullstack & software."
            data-en="Fullstack & software developer.">
            Desarrollador fullstack &amp; software.
          </p>

          <div className="hero-ctas">
            <a className="btn btn-primary" href="#proyectos">
              <span data-es="Ver proyectos" data-en="View projects">Ver proyectos</span>
              <Cohete size={18} />
            </a>
            <a className="btn btn-ghost" href="#contacto">
              <Satelite size={17} />
              <span data-es="Contacto" data-en="Get in touch">Contacto</span>
            </a>
          </div>
        </div>

        <SaturnSystem />
      </div>
    </section>
  );
}
