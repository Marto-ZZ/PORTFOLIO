import { Planetita } from './UI/Doodles.jsx';

export const LINKS = [
  { href: '#sobre-mi', es: 'Sobre mí', en: 'About', luna: 'rocosa', color: '--ambar' },
  { href: '#skills', es: 'Skills', en: 'Skills', luna: 'gaseosa', color: '--cian' },
  { href: '#proyectos', es: 'Proyectos', en: 'Projects', luna: 'volcanica', color: '--magenta' },
  { href: '#contacto', es: 'Contacto', en: 'Contact', luna: 'helada', color: '--violeta' },
];

function NavLink({ l, size }) {
  return (
    <a href={l.href} style={{ '--luna': `var(${l.color})` }}>
      <Planetita tipo={l.luna} size={size} className="nav-luna" />
      <span data-es={l.es} data-en={l.en}>{l.es}</span>
    </a>
  );
}

export default function Nav() {
  const links = LINKS;

  return (
    <header className="nav" id="nav">
      <a className="nav-logo" href="#inicio" aria-label="Inicio">MS<span className="dot">.</span></a>

      <nav className="nav-links" aria-label="Secciones">
        {links.map(l => <NavLink key={l.href} l={l} size={15} />)}
      </nav>

      <div className="nav-controls">
        <div className="lang-seg" id="langSeg" role="group" aria-label="Idioma">
          <button className="lang-opt" data-lang="es">ES</button>
          <button className="lang-opt" data-lang="en">EN</button>
        </div>

        <div className="settings">
          <button className="settings-btn" id="settingsBtn" aria-expanded="false" aria-controls="settingsPanel"
            aria-label="Ajustes">
            <i className="fa-solid fa-sliders" aria-hidden="true"></i>
          </button>

          <div className="settings-panel" id="settingsPanel" hidden>
            <p className="sp-title">Ajustes <span lang="en">settings</span></p>

            <div className="sp-row">
              <span className="sp-label">Animaciones <i lang="en">motion</i></span>
              <button className="switch" id="animSwitch" role="switch" aria-checked="true">
                <span className="switch-knob"></span>
              </button>
            </div>
          </div>
        </div>

        <button className="nav-burger" id="navBurger" aria-expanded="false" aria-controls="navMobile"
          aria-label="Abrir menú">
          <span className="burger-bar" aria-hidden="true"></span>
          <span className="burger-bar" aria-hidden="true"></span>
        </button>
      </div>

      <nav className="nav-mobile" id="navMobile" aria-label="Secciones" hidden>
        {links.map(l => <NavLink key={l.href} l={l} size={22} />)}
      </nav>
    </header>
  );
}
