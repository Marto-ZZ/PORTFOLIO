import Starfield from './UI/Starfield.jsx';
import SaturnSystem from './UI/SaturnSystem.jsx';

export default function Hero() {
  return (
    <section id="inicio" className="hero">
      <div className="hero-bg" aria-hidden="true">
        <Starfield />
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
