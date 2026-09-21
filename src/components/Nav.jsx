/* El menú móvil se renderiza siempre y se muestra/oculta por CSS + una clase
   que togglea portfolioEffects.js, en vez de con estado de React. Es a
   propósito: el cambio de idioma reescribe el innerHTML de todo lo que tenga
   data-es/data-en, y si React re-renderizara el nav al abrir el menú, pisaría
   esa traducción y los links volverían al español. */
export default function Nav() {
  const links = [
    { href: '#sobre-mi', es: 'Sobre mí', en: 'About' },
    { href: '#skills', es: 'Skills', en: 'Skills' },
    { href: '#proyectos', es: 'Proyectos', en: 'Projects' },
    { href: '#contacto', es: 'Contacto', en: 'Contact' },
  ];

  return (
    <header className="nav" id="nav">
      <a className="nav-logo" href="#inicio" aria-label="Inicio">MS<span className="dot">.</span></a>

      <nav className="nav-links" aria-label="Secciones">
        {links.map(l => (
          <a key={l.href} href={l.href} data-es={l.es} data-en={l.en}>{l.es}</a>
        ))}
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

        {/* Sólo visible en pantallas chicas: hasta ahora no había ninguna
            forma de navegar entre secciones por debajo de 720px. */}
        <button className="nav-burger" id="navBurger" aria-expanded="false" aria-controls="navMobile"
          aria-label="Abrir menú">
          <span className="burger-bar" aria-hidden="true"></span>
          <span className="burger-bar" aria-hidden="true"></span>
        </button>
      </div>

      <nav className="nav-mobile" id="navMobile" aria-label="Secciones" hidden>
        {links.map(l => (
          <a key={l.href} href={l.href} data-es={l.es} data-en={l.en}>{l.es}</a>
        ))}
      </nav>
    </header>
  );
}
