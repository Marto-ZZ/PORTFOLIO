import LogoLoop from './MyComponents/LogoLoop.jsx';
import { asset } from '../assets.js';

// Marquesina infinita: reutiliza exactamente los mismos iconos/marcas del grid.
const techLogos = [
  { node: <i className="devicon-python-plain colored" />, title: 'Python', href: 'https://www.python.org/' },
  { node: <i className="devicon-javascript-plain colored" />, title: 'JavaScript', href: 'https://developer.mozilla.org/docs/Web/JavaScript' },
  { node: <img src={asset('/images/logo-nodejs.svg')} alt="Node.js" />, title: 'Node.js', href: 'https://nodejs.org/' },
  { node: <i className="devicon-react-original colored" />, title: 'React', href: 'https://react.dev/' },
  { node: <img src={asset('/images/logo-fastapi.svg')} alt="FastAPI" />, title: 'FastAPI', href: 'https://fastapi.tiangolo.com/' },
  { node: <i className="devicon-html5-plain colored" />, title: 'HTML', href: 'https://developer.mozilla.org/docs/Web/HTML' },
  { node: <i className="devicon-css3-plain colored" />, title: 'CSS', href: 'https://developer.mozilla.org/docs/Web/CSS' },
  { node: <i className="devicon-git-plain colored" />, title: 'Git', href: 'https://git-scm.com/' },
  { node: <i className="devicon-github-original" />, title: 'Git / GitHub', href: 'https://github.com/Marto-ZZ' },
  { node: <i className="devicon-figma-plain colored" />, title: 'Figma', href: 'https://www.figma.com/' },
];

export default function Skills() {
  return (
    <section id="skills" className="section">
      <div className="container">
        <header className="section-head reveal">
          <span className="kicker"><span className="kicker-num">02</span><span data-es="Que uso en mi día a día?"
              data-en="What do I use in my daily life?">Que uso en mi día a día?</span></span>
          <h2 className="section-title" data-es="Stack & herramientas" data-en="Stack & tools">Stack & herramientas</h2>
        </header>

        <div className="skills-grid">
          <a className="skill reveal" href="https://www.python.org/" target="_blank" rel="noopener">
            <span className="skill-ico"><i className="devicon-python-plain colored"></i></span>
            <span className="skill-name">Python</span>
          </a>
          <a className="skill reveal" href="https://developer.mozilla.org/docs/Web/JavaScript" target="_blank" rel="noopener">
            <span className="skill-ico"><i className="devicon-javascript-plain colored"></i></span>
            <span className="skill-name">JavaScript</span>
          </a>
          <a className="skill reveal" href="https://nodejs.org/" target="_blank" rel="noopener">
            <span className="skill-ico"><img id="node-ico" src={asset('/images/logo-nodejs.svg')} /></span>
            <span className="skill-name">Node.js</span>
          </a>
          <a className="skill reveal" href="https://react.dev/" target="_blank" rel="noopener">
            <span className="skill-ico"><i className="devicon-react-original colored"></i></span>
            <span className="skill-name">React</span>
          </a>
          <a className="skill reveal" href="https://fastapi.tiangolo.com/" target="_blank" rel="noopener">
            <span className="skill-ico"><img id="fastapi-ico" src={asset('/images/logo-fastapi.svg')} /></span>
            <span className="skill-name">FastAPI</span>
          </a>
          <a className="skill reveal" href="https://developer.mozilla.org/docs/Web/HTML" target="_blank" rel="noopener">
            <span className="skill-ico"><i className="devicon-html5-plain colored"></i></span>
            <span className="skill-name">HTML</span>
          </a>
          <a className="skill reveal" href="https://developer.mozilla.org/docs/Web/CSS" target="_blank" rel="noopener">
            <span className="skill-ico"><i className="devicon-css3-plain colored"></i></span>
            <span className="skill-name">CSS</span>
          </a>
          <a className="skill reveal" href="https://github.com/Marto-ZZ" target="_blank" rel="noopener">
            <span className="skill-ico"><i className="devicon-github-original"></i></span>
            <span className="skill-name">Git / GitHub</span>
          </a>
          <a className="skill reveal" href="https://www.figma.com/" target="_blank" rel="noopener">
            <span className="skill-ico"><i className="devicon-figma-plain colored"></i></span>
            <span className="skill-name">Figma</span>
          </a>
          <a className="skill reveal" href="https://en.wikipedia.org/wiki/User_experience_design" target="_blank" rel="noopener">
            <span className="skill-ico"><img src={asset('/images/ux_ui.png')} id="ux-ico" /></span>
            <span className="skill-name">UX / UI</span>
          </a>
        </div>

        <div className="skills-marquee reveal">
          <LogoLoop
            logos={techLogos}
            speed={28}
            direction="left"
            logoHeight={36}
            gap={96}
            pauseOnHover
            scaleOnHover
            fadeOut
            fadeOutColor="var(--bg)"
            ariaLabel="Tecnologías"
          />
        </div>
      </div>
    </section>
  );
}
