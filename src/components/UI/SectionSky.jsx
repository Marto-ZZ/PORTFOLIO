import { useId } from 'react';
import { ROCOSA, ORBITAS, ONDAS } from './sectionSky.precalc.js';
import './SectionSky.css';

const ANCHO = 1200;
const ALTO = 1100;
const BORDE = ALTO * 0.14;

function Lienzo({ children }) {
  const id = `sky-${useId().replace(/:/g, '')}`;
  return (
    <svg viewBox={`0 0 ${ANCHO} ${ALTO}`} preserveAspectRatio="xMidYMid slice" className="sky-svg">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" className="sky-fondo" />
          <stop offset="1" className="sky-fondo" stopOpacity="0" />
        </linearGradient>
      </defs>
      {children}
      <rect x={-ANCHO} y="0" width={ANCHO * 3} height={BORDE} fill={`url(#${id})`} />
      <rect x={-ANCHO} y={ALTO - BORDE} width={ANCHO * 3} height={BORDE} fill={`url(#${id})`}
        transform={`rotate(180 ${ANCHO / 2} ${ALTO - BORDE / 2})`} />
    </svg>
  );
}

function Rocosa() {
  return (
    <Lienzo>
      <g className="sky-crateres">
        {ROCOSA.horizonte.map((s, i) => (
          <path key={`h${i}`} className="sky-horizonte" d={s.d} strokeWidth={s.w} opacity={s.o} />
        ))}
        {ROCOSA.horizonteFino.map((s, i) => (
          <path key={`h2${i}`} className="sky-horizonte sky-horizonte--fino" d={s.d}
            strokeWidth={s.w} opacity={s.o} />
        ))}
        {ROCOSA.crateres.map((c, i) => (
          <g key={i} opacity={c.opacidad} transform={c.transform}>
            {c.partes.map((s, j) => (
              <path key={j} d={s.d} className="sky-crater" strokeWidth={s.w} opacity={s.o} />
            ))}
          </g>
        ))}
        {ROCOSA.suelo.map((s, i) => (
          <path key={`s${i}`} className="sky-suelo" strokeWidth={s.w} opacity={s.o} d={s.d} />
        ))}
      </g>
    </Lienzo>
  );
}

const BANDAS_CIELO = [
  { y: 96,   w: 0.9, c: [-38, 22, -8] },
  { y: 244,  w: 2.6, c: [34, -44, 16] },
  { y: 318,  w: 0.7, c: [24, -30, 11] },
  { y: 486,  w: 3.2, c: [-50, 32, -18] },
  { y: 612,  w: 1.2, c: [28, -23, 13] },
  { y: 752,  w: 2.4, c: [-34, 41, -11] },
  { y: 866,  w: 0.8, c: [20, -16, 9] },
  { y: 1002, w: 1.7, c: [-27, 25, -14] },
];

function Banda({ b }) {
  const [a, c, d] = b.c;
  const via = `M -220 ${b.y} C 240 ${b.y + a} 960 ${b.y + c} 1420 ${b.y + d}`;
  return (
    <g>
      <path className="sky-banda" d={via} strokeWidth={b.w}
        opacity={(0.5 + b.w * 0.14).toFixed(2)} />
      {b.w > 2 && (
        <path className="sky-banda sky-banda--fina"
          d={`M 60 ${b.y + 17} C 380 ${b.y + a * 0.5 + 15} 900 ${b.y + c * 0.6 + 19} 1180 ${b.y + d + 14}`}
          strokeWidth="0.6" opacity="0.4" />
      )}
    </g>
  );
}

function Gaseosa() {
  return (
    <Lienzo>
      <g className="sky-bandas">
        {BANDAS_CIELO.map((b) => <Banda key={b.y} b={b} />)}
        <g className="sky-tormenta" transform="rotate(-8 830 548)">
          <ellipse cx="830" cy="548" rx="196" ry="96" strokeWidth="2.2" opacity="0.6" />
          <ellipse cx="822" cy="552" rx="108" ry="50" strokeWidth="1.3" opacity="0.4" />
          <ellipse cx="818" cy="554" rx="46" ry="21" strokeWidth="0.8" opacity="0.26" />
        </g>
      </g>
    </Lienzo>
  );
}

function Volcanica() {
  return (
    <Lienzo>
      <g className="sky-orbitas">
        {ORBITAS.map((o, i) => (
          <g key={i} transform={o.transform}>
            <path className="sky-orbita" d={o.d} strokeWidth={o.w} opacity="0.85" />
            <path className="sky-orbita" opacity="0.5" strokeWidth={o.wTick} d={o.ticks} />
          </g>
        ))}
      </g>
    </Lienzo>
  );
}

function Helada() {
  return (
    <Lienzo>
      <g className="sky-senal">
        <g className="sky-antena">
          <path d="M 905 862 L 905 806" strokeWidth="2.4" opacity="0.7" />
          <path d="M 884 820 L 905 801 L 927 822" strokeWidth="1.6" opacity="0.5" />
          <path d="M 879 868 L 932 866" strokeWidth="1.2" opacity="0.35" />
        </g>
      </g>
      {ONDAS.map((o, i) => (
        <path key={i} transform={o.transform} d={o.d} strokeWidth={o.w} opacity={(0.16 - i * 0.02).toFixed(2)} />
      ))}
    </Lienzo>
  );
}

const PATRONES = { bandas: Gaseosa, orbitas: Volcanica, senal: Helada, crateres: Rocosa };

export default function SectionSky({ patron = 'crateres' }) {
  const Patron = PATRONES[patron] || Rocosa;
  return (
    <div className="section-sky" aria-hidden="true">
      <Patron />
      <div className="sky-glow" />
    </div>
  );
}
