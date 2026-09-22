import './SectionSky.css';

/* El "cielo" de cada sección: lo que hace que llegar a Formación se sienta
   distinto de llegar a Skills, y no la misma página pintada de otro color.

   Cada patrón responde al tipo de luna de esa sección (ver moons.js):
   - crateres: estás parado sobre una luna rocosa, con su horizonte curvo.
   - bandas:   estás dentro de la atmósfera de una gigante gaseosa.
   - orbitas:  trayectorias cruzándose, cosas en movimiento.
   - senal:    ondas saliendo hacia afuera, una transmisión.

   Todo es SVG estático (o con animaciones de transform/opacity, que corren en
   el compositor), sin canvas ni rAF: el hero ya tiene el presupuesto de GPU y
   estos fondos no deberían costar nada. */

// Posiciones elegidas a mano, no al azar: así la composición queda equilibrada
// y siempre igual en vez de reordenarse en cada carga.
const CRATERES = [
  { cx: 140, cy: 180, r: 86 }, { cx: 1010, cy: 120, r: 54 },
  { cx: 300, cy: 620, r: 42 }, { cx: 880, cy: 520, r: 110 },
  { cx: 620, cy: 250, r: 30 }, { cx: 1140, cy: 680, r: 68 },
  { cx: 60, cy: 470, r: 36 },
];

function Patron({ patron }) {
  if (patron === 'bandas') {
    return (
      <g className="sky-bandas">
        {[130, 250, 370, 470, 600, 700].map((y, i) => (
          <path key={i} className="sky-banda"
            d={`M -200 ${y} Q 300 ${y - 34 - i * 5} 700 ${y} T 1600 ${y}`}
            strokeWidth={i % 2 ? 1 : 2.2} />
        ))}
      </g>
    );
  }

  if (patron === 'orbitas') {
    return (
      <g className="sky-orbitas">
        {[
          { rx: 520, ry: 180, rot: -16 },
          { rx: 380, ry: 130, rot: 22 },
          { rx: 640, ry: 230, rot: 6 },
        ].map((o, i) => (
          <ellipse key={i} cx="600" cy="400" rx={o.rx} ry={o.ry}
            transform={`rotate(${o.rot} 600 400)`} className="sky-orbita" />
        ))}
      </g>
    );
  }

  if (patron === 'senal') {
    return (
      <g className="sky-senal">
        {[120, 240, 360, 480, 620].map((r, i) => (
          <circle key={i} cx="980" cy="640" r={r} className="sky-onda"
            style={{ animationDelay: `${i * 0.9}s` }} />
        ))}
      </g>
    );
  }

  // crateres: superficie rocosa vista desde arriba + el horizonte curvo de la
  // luna abajo, que es lo que da la sensación de "estar parado en" algo.
  return (
    <g className="sky-crateres">
      {CRATERES.map((c, i) => (
        <g key={i}>
          <circle cx={c.cx} cy={c.cy} r={c.r} className="sky-crater" />
          <circle cx={c.cx} cy={c.cy - c.r * 0.16} r={c.r * 0.72} className="sky-crater sky-crater--interno" />
        </g>
      ))}
      <path d="M -150 880 Q 600 560 1350 880" className="sky-horizonte" />
    </g>
  );
}

export default function SectionSky({ patron = 'crateres' }) {
  return (
    <div className="section-sky" aria-hidden="true">
      <div className="sky-glow" />
      <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" className="sky-svg">
        <Patron patron={patron} />
      </svg>
    </div>
  );
}
