export default function Nav() {
  return (
    <header className="nav" id="nav">
      <a className="nav-logo" href="#inicio" aria-label="Inicio">MS<span className="dot">.</span></a>

      <nav className="nav-links" aria-label="Secciones">
        <a href="#sobre-mi" data-es="Sobre mí" data-en="About">Sobre mí</a>
        <a href="#skills">Skills</a>
        <a href="#proyectos" data-es="Proyectos" data-en="Projects">Proyectos</a>
        <a href="#contacto" data-es="Contacto" data-en="Contact">Contacto</a>
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
              <span className="sp-label">Tema <i lang="en">theme</i></span>
              <div className="seg" id="themeSeg" role="group" aria-label="Tema">
                <button className="seg-btn" data-theme-val="light">Claro</button>
                <button className="seg-btn" data-theme-val="dark">Oscuro</button>
              </div>
            </div>

            <div className="sp-row">
              <span className="sp-label">Animaciones <i lang="en">motion</i></span>
              <button className="switch" id="animSwitch" role="switch" aria-checked="true">
                <span className="switch-knob"></span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}
