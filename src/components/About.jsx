import StickerPeel from './MyComponents/StickerPeel.jsx';
import { asset } from '../assets.js';

// Lista de certificados/formación. Para sumar uno nuevo, agregá un objeto acá:
// el logo se vuelve un sticker despegable y arrastrable sobre su propia carta.
const certificates = [
  {
    logo: asset('/images/logo-uba.svg'), alt: 'Universidad de Buenos Aires',
    titleEs: 'Lic. en Ciencias de la Computación', titleEn: 'B.S. & M.S in Computer Science',
    inst: 'Universidad de Buenos Aires',
    stateEs: 'En curso', stateEn: 'Ongoing', live: true,
  },
  {
    logo: asset('/images/logo-harvard.png'), alt: 'Harvard University',
    title: 'CS50P - Introduction to Python',
    inst: 'Harvard University',
    stateEs: 'Completado', stateEn: 'Completed', live: false,
  },
  {
    logo: asset('/images/logo-coderhouse.png'), alt: 'Coderhouse',
    titleEs: 'Diseño UX/UI', titleEn: 'UX/UI Design',
    inst: 'Coderhouse',
    stateEs: 'Completado', stateEn: 'Completed', live: false,
  },
];

function EduItem({ c }) {
  return (
    <li className="edu-item">
      <span className="edu-logo-slot" aria-hidden="true" />
      <span className="edu-body">
        {c.titleEs
          ? <strong data-es={c.titleEs} data-en={c.titleEn}>{c.titleEs}</strong>
          : <strong>{c.title}</strong>}
        <span className="edu-inst">{c.inst}</span>
      </span>
      <span className={`edu-state${c.live ? ' live' : ''}`} data-es={c.stateEs} data-en={c.stateEn}>{c.stateEs}</span>
      <StickerPeel
        className="edu-sticker"
        imageSrc={c.logo}
        width={80}
        rotate={0}
        peelBackHoverPct={24}
        shadowIntensity={0.45}
        initialPosition="center"
      />
    </li>
  );
}

export default function About() {
  return (
    <section id="sobre-mi" className="section">
      <div className="container">
        <header className="section-head reveal">
          <span className="kicker"><span className="kicker-num">01</span><span data-es="Sobre mí"
              data-en="About me">Sobre mí</span></span>
          <h2 className="section-title" data-es="¿Quién soy?" data-en="Who I am">¿Quién soy?</h2>
        </header>

        <div className="about-grid">
          <article className="card bio-card reveal">
            <p className="bio-p"
              data-es="Soy <b>Martín</b>, desarrollador de software y estudiante de <b>Ciencias de la Computación en la UBA</b>. Construyo productos de punta a punta, <b>del frontend al backend</b>, traduciendo lógica compleja en experiencias claras, sólidas y bien resueltas."
              data-en="I'm <b>Martín</b>, a software developer and <b>Computer Science student at UBA</b>. I build products end to end, <b>from frontend to backend</b>, turning complex logic into clear, solid and well-resolved experiences.">
              Soy <b>Martín</b>, desarrollador de software y estudiante de <b>Ciencias de la Computación en la UBA</b>. Construyo productos de punta a punta, <b>del frontend al backend</b>, traduciendo lógica compleja en experiencias claras, sólidas y bien resueltas.
            </p>
            <p className="bio-p"
              data-es="Trabajo bajo una premisa simple: <b>menos es más</b>, siempre que sea <b>escalable y esté bien construido</b>. Cuido cada detalle porque la calidad técnica solo se nota cuando la <b>experiencia es impecable</b>."
              data-en="I work under a simple premise: <b>less is more</b>, as long as it's <b>scalable and well-built</b>. I obsess over the details, because technical quality only shows when the <b>experience is flawless</b>.">
              Trabajo bajo una premisa simple: <b>menos es más</b>, siempre que sea <b>escalable y esté bien construido</b>. Cuido cada detalle porque la calidad técnica solo se nota cuando la <b>experiencia es impecable</b>.
            </p>
            <p className="bio-p"
              data-es="Me motivan los <b>equipos</b> que entienden el software como un <b>oficio</b>: entornos donde aportar, aprender y elevar el producto sean parte del día a día."
              data-en="I'm driven by <b>teams</b> that treat software as a <b>craft</b>: places where contributing, learning and raising the bar are part of everyday work.">
              Me motivan los <b>equipos</b> que entienden el software como un <b>oficio</b>: entornos donde aportar, aprender y elevar el producto sean parte del día a día.
            </p>
          </article>

          <aside className="card edu-card reveal">
            <p className="card-label" data-es="Formación" data-en="Education">Formación</p>
            <ul className="edu-list">
              {certificates.map((c, i) => <EduItem key={i} c={c} />)}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
