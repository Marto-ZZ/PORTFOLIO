import { CRATERS, BANDAS, FRACTURAS, HIELO } from './moons.js';
import './SectionMoon.css';

/* La luna de la sección: el mismo dibujo que orbita en el hero, pero quieto y
   grande, al lado del título. Es el remate del guion — la luna que viste pasar
   es la que te recibe cuando llegás.

   Va en trazo, como el Saturno, y toma el color de la sección vía --sx. */

const TILT = -14;

function Superficie({ tone }) {
  if (tone === 'gaseosa') {
    return (
      <g transform={`rotate(${TILT})`} clipPath="url(#lunaClip)">
        {BANDAS.map((y, i) => (
          <line key={i} x1="-1" y1={y} x2="1" y2={y}
            className="luna-banda" strokeWidth={i % 2 ? 0.07 : 0.11} />
        ))}
      </g>
    );
  }
  if (tone === 'volcanica') {
    return (
      <g clipPath="url(#lunaClip)">
        {FRACTURAS.map((d, i) => <path key={i} d={d} className="luna-fractura" />)}
      </g>
    );
  }
  if (tone === 'helada') {
    return (
      <g clipPath="url(#lunaClip)">
        {HIELO.map((h, i) => <ellipse key={i} {...h} className="luna-hielo" />)}
      </g>
    );
  }
  // rocosa
  return (
    <g clipPath="url(#lunaClip)">
      {CRATERS.map((c, i) => (
        <circle key={i} cx={c.x} cy={c.y} r={c.r} className="luna-crater" />
      ))}
    </g>
  );
}

export default function SectionMoon({ tone = 'rocosa' }) {
  return (
    <svg className="section-moon" viewBox="-1.25 -1.25 2.5 2.5" aria-hidden="true">
      <defs>
        <clipPath id="lunaClip" clipPathUnits="userSpaceOnUse">
          <circle cx="0" cy="0" r="1" />
        </clipPath>
      </defs>
      {/* halo tenue: la luna "ilumina" su sección */}
      <circle cx="0" cy="0" r="1.2" className="luna-halo" />
      <circle cx="0" cy="0" r="1" className="luna-cuerpo" />
      <Superficie tone={tone} />
    </svg>
  );
}
