import { asset } from '../assets.js';

const slide = (e, dir) => window.slideGallery(e.currentTarget, dir);
const goTo = (e, i) => window.goToSlide(e.currentTarget, i);

export default function Projects() {
  return (
    <section id="proyectos" className="section">
      <div className="container">
        <header className="section-head reveal">
          <span className="kicker"><span className="kicker-num">03</span><span data-es="Trabajos"
              data-en="Work">Trabajos</span></span>
          <h2 className="section-title" data-es="Proyectos seleccionados" data-en="Selected projects">Proyectos seleccionados</h2>
        </header>

        <div className="projects">

          {/* Vestige Play */}
          <article className="project reveal">
            <div className="project-media">
              <div className="gallery" data-index="0">
                <div className="gallery-track">
                  <div className="slide active"><img src={asset('/images/vestige 1.jpg')} alt="Vestige Play — biblioteca" loading="lazy" /></div>
                  <div className="slide"><img src={asset('/images/vestige 2.jpg')} alt="Vestige Play — plan semanal" loading="lazy" /></div>
                  <div className="slide"><img src={asset('/images/vestige 3.jpg')} alt="Vestige Play — calendario" loading="lazy" /></div>
                  <div className="slide"><img src={asset('/images/vestige 4.jpg')} alt="Vestige Play — estadísticas" loading="lazy" /></div>
                </div>
                <button className="gal-btn prev" onClick={(e) => slide(e, -1)} aria-label="Anterior">‹</button>
                <button className="gal-btn next" onClick={(e) => slide(e, 1)} aria-label="Siguiente">›</button>
                <div className="gal-dots">
                  <span className="gdot active" onClick={(e) => goTo(e, 0)}></span>
                  <span className="gdot" onClick={(e) => goTo(e, 1)}></span>
                  <span className="gdot" onClick={(e) => goTo(e, 2)}></span>
                  <span className="gdot" onClick={(e) => goTo(e, 3)}></span>
                </div>
              </div>
            </div>
            <div className="project-body">
              <p className="project-index"><span data-es="Startup"
                  data-en="Startup">Startup</span> 2026</p>
              <h3 className="project-name">Vestige Play</h3>
              <p className="project-desc"
                data-es="Mi startup: una app de escritorio dedicada al gaming, que conecta tu biblioteca de Steam y la convierte en un plan para trackear tus sesiones de juego de forma realista en base a tu tiempo libre. Categoriza tus juegos olvidados automáticamente, arma un calendario semanal a tu medida y sigue tu progreso con rachas y niveles. Como founder, lidero el producto de punta a punta, del diseño a la infraestructura."
                data-en="My startup: a desktop app dedicated to gaming, that connects to your Steam library and turns it into a realistic tracker gaming plan based on your free time. It auto-sorts your forgotten games, builds a weekly schedule tailored to your free time, and tracks your progress with streaks and levels. As founder, I lead the product end to end, from design to infrastructure.">
                Mi startup: una app de escritorio dedicada al gaming, que conecta tu biblioteca de Steam y la convierte en un plan para trackear tus sesiones de juego de forma realista en base a tu tiempo libre. Categoriza tus juegos olvidados automáticamente, arma un calendario semanal a tu medida y sigue tu progreso con rachas y niveles. Como founder, lidero el producto de punta a punta, del diseño a la infraestructura.
              </p>
              <ul className="project-stack" aria-label="Stack">
                <li title="React"><a href="https://react.dev/" target="_blank" rel="noopener" aria-label="React"><i className="devicon-react-original colored"></i></a></li>
                <li title="Electron"><a href="https://www.electronjs.org/" target="_blank" rel="noopener" aria-label="Electron"><i className="devicon-electron-original colored"></i></a></li>
                <li title="Node.js"><a href="https://nodejs.org/" target="_blank" rel="noopener" aria-label="Node.js"><img id="node-ico" src={asset('/images/logo-nodejs.svg')} alt="Node.js" /></a></li>
                <li title="JavaScript"><a href="https://developer.mozilla.org/docs/Web/JavaScript" target="_blank" rel="noopener" aria-label="JavaScript"><i className="devicon-javascript-plain colored"></i></a></li>
                <li title="Python"><a href="https://docs.python.org/3/" target="_blank" rel="noopener" aria-label="Python"><i className="devicon-python-plain colored"></i></a></li>
                <li title="MongoDB"><a href="https://www.mongodb.com/" target="_blank" rel="noopener" aria-label="MongoDB"><i className="devicon-mongodb-plain colored"></i></a></li>
                <li title="Cloudflare"><a href="https://www.cloudflare.com/" target="_blank" rel="noopener" aria-label="Cloudflare"><i className="devicon-cloudflare-plain colored"></i></a></li>
                <li title="HTML"><a href="https://developer.mozilla.org/docs/Web/HTML" target="_blank" rel="noopener" aria-label="HTML"><i className="devicon-html5-plain colored"></i></a></li>
                <li title="CSS"><a href="https://developer.mozilla.org/docs/Web/CSS" target="_blank" rel="noopener" aria-label="CSS"><i className="devicon-css3-plain colored"></i></a></li>
              </ul>
              <div className="project-links">
                <a href="https://vestigeplay.com" target="_blank" rel="noopener">
                  <i className="fa-solid fa-globe"></i> vestigeplay.com <span aria-hidden="true">↗</span></a>
              </div>
            </div>
          </article>

          {/* PolyglotLAB */}
          <article className="project reveal">
            <div className="project-media">
              <div className="gallery" data-index="0">
                <div className="gallery-track">
                  <div className="slide active"><img src={asset('/images/Polyglot 1.png')} alt="PolyglotLAB — pantalla principal" loading="lazy" /></div>
                  <div className="slide"><img src={asset('/images/Polyglot 2.png')} alt="PolyglotLAB — traducción" loading="lazy" /></div>
                  <div className="slide"><img src={asset('/images/Polyglot 3.png')} alt="PolyglotLAB — tema alternativo" loading="lazy" /></div>
                  <div className="slide"><img src={asset('/images/Polyglot 4.png')} alt="PolyglotLAB — idiomas" loading="lazy" /></div>
                </div>
                <button className="gal-btn prev" onClick={(e) => slide(e, -1)} aria-label="Anterior">‹</button>
                <button className="gal-btn next" onClick={(e) => slide(e, 1)} aria-label="Siguiente">›</button>
                <div className="gal-dots">
                  <span className="gdot active" onClick={(e) => goTo(e, 0)}></span>
                  <span className="gdot" onClick={(e) => goTo(e, 1)}></span>
                  <span className="gdot" onClick={(e) => goTo(e, 2)}></span>
                  <span className="gdot" onClick={(e) => goTo(e, 3)}></span>
                </div>
              </div>
            </div>
            <div className="project-body">
              <p className="project-index"><span data-es="Aplicación web"
                  data-en="Web app">Aplicación web</span> 2026</p>
              <h3 className="project-name">PolyglotLAB</h3>
              <p className="project-desc"
                data-es="Aplicación web de traducción de texto. Proyecto final de Harvard CS50P escalado a aplicacón web, que integra deep-translator para traducciones precisas y contextuales en múltiples idiomas."
                data-en="Web-based text translation app. Harvard CS50P final project scaled into a web application, integrating deep-translator for accurate, contextual translations across many languages.">
                Aplicación web de traducción de texto. Proyecto final de Harvard CS50P escalado a aplicacón web, que
                integra deep-translator para traducciones precisas y contextuales en múltiples idiomas.
              </p>
              <ul className="project-stack" aria-label="Stack">
                <li title="Python"><a href="https://docs.python.org/3/" target="_blank" rel="noopener" aria-label="Python"><i className="devicon-python-plain colored"></i></a></li>
                <li title="Flask"><a href="https://flask.palletsprojects.com/" target="_blank" rel="noopener" aria-label="Flask"><i className="devicon-flask-original"></i></a></li>
                <li title="JavaScript"><a href="https://developer.mozilla.org/docs/Web/JavaScript" target="_blank" rel="noopener" aria-label="JavaScript"><i className="devicon-javascript-plain colored"></i></a></li>
                <li title="HTML"><a href="https://developer.mozilla.org/docs/Web/HTML" target="_blank" rel="noopener" aria-label="HTML"><i className="devicon-html5-plain colored"></i></a></li>
                <li title="CSS"><a href="https://developer.mozilla.org/docs/Web/CSS" target="_blank" rel="noopener" aria-label="CSS"><i className="devicon-css3-plain colored"></i></a></li>
              </ul>
              <div className="project-links">
                <a href="https://github.com/Marto-ZZ/PolyglotLAB-python-translator" target="_blank" rel="noopener">
                  <i className="devicon-github-original"></i> GitHub <span aria-hidden="true">↗</span></a>
              </div>
            </div>
          </article>

          {/* IMAGO */}
          <article className="project reveal">
            <div className="project-media">
              <div className="gallery" data-index="0">
                <div className="gallery-track">
                  <div className="slide active"><img src={asset('/images/imago 1.jpg')} alt="IMAGO — pantalla principal" loading="lazy" /></div>
                  <div className="slide"><img src={asset('/images/imago 2.png')} alt="IMAGO — preview" loading="lazy" /></div>
                  <div className="slide"><img src={asset('/images/imago 3.png')} alt="IMAGO — formatos" loading="lazy" /></div>
                  <div className="slide"><img src={asset('/images/imago 4.png')} alt="IMAGO — descarga" loading="lazy" /></div>
                </div>
                <button className="gal-btn prev" onClick={(e) => slide(e, -1)} aria-label="Anterior">‹</button>
                <button className="gal-btn next" onClick={(e) => slide(e, 1)} aria-label="Siguiente">›</button>
                <div className="gal-dots">
                  <span className="gdot active" onClick={(e) => goTo(e, 0)}></span>
                  <span className="gdot" onClick={(e) => goTo(e, 1)}></span>
                  <span className="gdot" onClick={(e) => goTo(e, 2)}></span>
                  <span className="gdot" onClick={(e) => goTo(e, 3)}></span>
                </div>
              </div>
            </div>
            <div className="project-body">
              <p className="project-index"><span data-es="Herramienta web"
                  data-en="Web tool">Herramienta web</span> 2025</p>
              <h3 className="project-name">IMAGO</h3>
              <p className="project-desc"
                data-es="Herramienta minimalista para convertir imágenes entre JPG, PNG, WEBP y GIF. Interfaz drag & drop con feedback dinámico, gestión inteligente de canales alfa y descarga automática."
                data-en="Minimalist tool to convert images between JPG, PNG, WEBP and GIF. Drag & drop interface with dynamic feedback, smart alpha-channel handling and automatic download.">
                Herramienta minimalista para convertir imágenes entre JPG, PNG, WEBP y GIF. Interfaz drag & drop con
                feedback dinámico, gestión inteligente de canales alfa y descarga automática.
              </p>
              <ul className="project-stack" aria-label="Stack">
                <li title="Python"><a href="https://docs.python.org/3/" target="_blank" rel="noopener" aria-label="Python"><i className="devicon-python-plain colored"></i></a></li>
                <li title="Flask"><a href="https://flask.palletsprojects.com/" target="_blank" rel="noopener" aria-label="Flask"><i className="devicon-flask-original"></i></a></li>
                <li title="HTML"><a href="https://developer.mozilla.org/docs/Web/HTML" target="_blank" rel="noopener" aria-label="HTML"><i className="devicon-html5-plain colored"></i></a></li>
                <li title="JavaScript"><a href="https://developer.mozilla.org/docs/Web/JavaScript" target="_blank" rel="noopener" aria-label="JavaScript"><i className="devicon-javascript-plain colored"></i></a></li>
                <li title="CSS"><a href="https://developer.mozilla.org/docs/Web/CSS" target="_blank" rel="noopener" aria-label="CSS"><i className="devicon-css3-plain colored"></i></a></li>
              </ul>
              <div className="project-links">
                <a href="https://github.com/Marto-ZZ/IMAGO-Image-Converter" target="_blank" rel="noopener">
                  <i className="devicon-github-original"></i> GitHub <span aria-hidden="true">↗</span></a>
              </div>
            </div>
          </article>

          {/* Freely */}
          <article className="project reveal">
            <div className="project-media">
              <div className="gallery" data-index="0">
                <div className="gallery-track">
                  <div className="slide active"><img src={asset('/images/freely 1.webp')} alt="Freely — presentación" loading="lazy" /></div>
                  <div className="slide"><img src={asset('/images/freely 2.webp')} alt="Freely — pantallas" loading="lazy" /></div>
                  <div className="slide"><img src={asset('/images/freely 3.webp')} alt="Freely — estadísticas" loading="lazy" /></div>
                  <div className="slide"><img src={asset('/images/freely 4.webp')} alt="Freely — elevator pitch" loading="lazy" /></div>
                </div>
                <button className="gal-btn prev" onClick={(e) => slide(e, -1)} aria-label="Anterior">‹</button>
                <button className="gal-btn next" onClick={(e) => slide(e, 1)} aria-label="Siguiente">›</button>
                <div className="gal-dots">
                  <span className="gdot active" onClick={(e) => goTo(e, 0)}></span>
                  <span className="gdot" onClick={(e) => goTo(e, 1)}></span>
                  <span className="gdot" onClick={(e) => goTo(e, 2)}></span>
                  <span className="gdot" onClick={(e) => goTo(e, 3)}></span>
                </div>
              </div>
            </div>
            <div className="project-body">
              <p className="project-index"><span data-es="Diseño UX/UI"
                  data-en="UX/UI design">Diseño UX/UI</span> 2025</p>
              <h3 className="project-name">Freely</h3>
              <p className="project-desc"
                data-es="Proyecto de diseño UX/UI de una app móvil (Coderhouse). Investigación de usuarios, arquitectura de información, wireframes, prototipado interactivo y un sistema de diseño completo. Publicado en Behance."
                data-en="UX/UI design project for a mobile app (Coderhouse). User research, information architecture, wireframes, interactive prototyping and a full design system. Published on Behance.">
                Proyecto de diseño UX/UI de una app móvil (Coderhouse). Investigación de usuarios, arquitectura
                de información, wireframes, prototipado interactivo y un sistema de diseño completo. Publicado en
                Behance.
              </p>
              <ul className="project-stack" aria-label="Stack">
                <li title="Figma"><a href="https://www.figma.com/" target="_blank" rel="noopener" aria-label="Figma"><i className="devicon-figma-plain colored"></i></a></li>
                <li title="UX Research"><a href="https://en.wikipedia.org/wiki/User_research" target="_blank" rel="noopener" aria-label="UX Research"><i className="fa-solid fa-magnifying-glass"></i></a></li>
                <li title="UI Design"><a href="https://en.wikipedia.org/wiki/User_interface_design" target="_blank" rel="noopener" aria-label="UI Design"><i className="fa-solid fa-pen-nib"></i></a></li>
                <li title="Prototipado"><a href="https://en.wikipedia.org/wiki/Software_prototyping" target="_blank" rel="noopener" aria-label="Prototipado"><i className="fa-solid fa-vector-square"></i></a></li>
                <li title="Mobile"><a href="https://en.wikipedia.org/wiki/Mobile_app" target="_blank" rel="noopener" aria-label="Mobile"><i className="fa-solid fa-mobile-screen-button"></i></a></li>
              </ul>
              <div className="project-links">
                <a href="https://www.behance.net/gallery/228834679/Diseno-UXUI-Freely-App-Coderhouse" target="_blank" rel="noopener">
                  <i className="devicon-behance-plain"></i> Behance <span aria-hidden="true">↗</span></a>
              </div>
            </div>
          </article>

        </div>
      </div>
    </section>
  );
}
