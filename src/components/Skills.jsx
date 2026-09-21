import LogoLoop from './MyComponents/LogoLoop.jsx';
import { asset } from '../assets.js';

// Marquesina infinita: reutiliza exactamente los mismos iconos/marcas del grid.
const techLogos = [
  { node: <i className="devicon-python-plain colored" />, title: 'Python', href: 'https://www.python.org/' },
  { node: <i className="devicon-javascript-plain colored" />, title: 'JavaScript', href: 'https://developer.mozilla.org/docs/Web/JavaScript' },
  { node: <img src={asset('/images/logo-nodejs.svg')} alt="Node.js" />, title: 'Node.js', href: 'https://nodejs.org/' },
  { node: <i className="devicon-react-original colored" />, title: 'React', href: 'https://react.dev/' },
  { node: <i className="devicon-html5-plain colored" />, title: 'HTML', href: 'https://developer.mozilla.org/docs/Web/HTML' },
  { node: <i className="devicon-css3-plain colored" />, title: 'CSS', href: 'https://developer.mozilla.org/docs/Web/CSS' },
  { node: <i className="devicon-mongodb-plain colored" />, title: 'MongoDB', href: 'https://www.mongodb.com/' },
  { node: <i className="devicon-cloudflare-plain colored" />, title: 'Cloudflare', href: 'https://www.cloudflare.com/' },
  { node: <i className="devicon-vitejs-plain colored" />, title: 'Vite', href: 'https://vite.dev/' },
  { node: <i className="devicon-git-plain colored" />, title: 'Git', href: 'https://git-scm.com/' },
  { node: <i className="devicon-github-original" />, title: 'Git / GitHub', href: 'https://github.com/Marto-ZZ' },
  { node: <i className="devicon-figma-plain colored" />, title: 'Figma', href: 'https://www.figma.com/' },
];

/* Agrupado por rol en vez de una pared plana de logos: un muro de 12 marcas
   sin jerarquía es lo que tiene cualquier portfolio y no dice nada; agrupado
   cuenta CÓMO trabaja (dónde se para en el stack) sin agregar texto de más.
   Además 5+4+3 cae en filas prolijas en todos los breakpoints. */
const GRUPOS = [
  {
    es: 'Frontend', en: 'Frontend',
    items: [
      { name: 'React', href: 'https://react.dev/', icon: 'devicon-react-original colored' },
      { name: 'JavaScript', href: 'https://developer.mozilla.org/docs/Web/JavaScript', icon: 'devicon-javascript-plain colored' },
      { name: 'HTML', href: 'https://developer.mozilla.org/docs/Web/HTML', icon: 'devicon-html5-plain colored' },
      { name: 'CSS', href: 'https://developer.mozilla.org/docs/Web/CSS', icon: 'devicon-css3-plain colored' },
      { name: 'Vite', href: 'https://vite.dev/', icon: 'devicon-vitejs-plain colored' },
    ],
  },
  {
    es: 'Backend & datos', en: 'Backend & data',
    items: [
      { name: 'Node.js', href: 'https://nodejs.org/', img: '/images/logo-nodejs.svg' },
      { name: 'Python', href: 'https://www.python.org/', icon: 'devicon-python-plain colored' },
      { name: 'MongoDB', href: 'https://www.mongodb.com/', icon: 'devicon-mongodb-plain colored' },
      { name: 'Cloudflare', href: 'https://www.cloudflare.com/', icon: 'devicon-cloudflare-plain colored' },
    ],
  },
  {
    es: 'Diseño & flujo', en: 'Design & workflow',
    items: [
      { name: 'Figma', href: 'https://www.figma.com/', icon: 'devicon-figma-plain colored' },
      // Antes era un PNG gris que sobre fondo oscuro quedaba casi invisible.
      // Como es texto, va como texto: se lee siempre y escala sin pixelarse.
      { name: 'UX / UI', href: 'https://en.wikipedia.org/wiki/User_experience_design', glyph: 'UX' },
      { name: 'Git / GitHub', href: 'https://github.com/Marto-ZZ', icon: 'devicon-github-original' },
    ],
  },
];

function Skill({ s }) {
  return (
    <a className="skill reveal" href={s.href} target="_blank" rel="noopener">
      <span className="skill-ico">
        {s.icon && <i className={s.icon} aria-hidden="true"></i>}
        {s.img && <img src={asset(s.img)} alt="" />}
        {s.glyph && <span className="skill-glyph" aria-hidden="true">{s.glyph}</span>}
      </span>
      <span className="skill-name">{s.name}</span>
    </a>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="section">
      <div className="container">
        <header className="section-head reveal">
          <span className="kicker"><span className="kicker-num">02</span><span data-es="Que uso en mi día a día?"
              data-en="What do I use in my daily life?">Que uso en mi día a día?</span></span>
          <h2 className="section-title" data-es="Stack & herramientas" data-en="Stack & tools">Stack & herramientas</h2>
        </header>

        <div className="skill-groups">
          {GRUPOS.map(g => (
            <div className="skill-group reveal" key={g.es}>
              <p className="skill-group-label" data-es={g.es} data-en={g.en}>{g.es}</p>
              <div className="skills-grid">
                {g.items.map(s => <Skill key={s.name} s={s} />)}
              </div>
            </div>
          ))}
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
