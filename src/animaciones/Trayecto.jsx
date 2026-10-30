import { Planetita } from '../components/UI/Doodles.jsx';
import { LINKS } from '../components/Nav.jsx';

export default function Trayecto() {
  return (
    <>
      <span className="trayecto-barra" id="trayectoBarra" aria-hidden="true" />
      <nav className="trayecto" id="trayecto" aria-label="Recorrido por las secciones">
        <span className="trayecto-orbita" aria-hidden="true">
          <span className="trayecto-avance" />
        </span>
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} className="trayecto-luna" style={{ '--luna': `var(${l.color})` }}>
            <Planetita tipo={l.luna} size={18} />
            <span className="trayecto-nombre" data-es={l.es} data-en={l.en}>{l.es}</span>
          </a>
        ))}
      </nav>
    </>
  );
}
