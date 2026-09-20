import './Starfield.css';

/* Fondo del hero: un campo de estrellas fijo, en reemplazo de las ondas
   animadas. Todo SVG + CSS, sin canvas ni rAF — el titileo es una animación
   de opacity por círculo, que corre en el compositor y no toca el main
   thread (mismo criterio que las órbitas de SaturnSystem.jsx).

   Las posiciones salen de un PRNG con semilla fija (mulberry32), no de
   Math.random(): así el cielo queda igual en cada carga y se puede afinar a
   ojo, en vez de reordenarse solo cada vez que se monta el componente. */
function mulberry32(seed) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function genStars(count, seed, { rMin, rMax, oMin, oMax, durMin = 0, durMax = 0 }) {
  const rand = mulberry32(seed);
  const stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: +(rand() * 100).toFixed(2),
      y: +(rand() * 100).toFixed(2),
      r: +(rMin + rand() * (rMax - rMin)).toFixed(2),
      o: +(oMin + rand() * (oMax - oMin)).toFixed(2),
      dur: +(durMin + rand() * (durMax - durMin)).toFixed(1),
      // delay negativo: cada estrella arranca ya a mitad de un ciclo
      // distinto, así no titilan todas en fase.
      delay: durMax ? +(-rand() * durMax).toFixed(1) : 0,
    });
  }
  return stars;
}

/* El viewBox es 100x100 pero preserveAspectRatio="slice" escala por el lado
   MÁS largo del contenedor para cubrirlo entero (como background-size:cover).
   En una sección ancha y no muy alta como el hero, ese factor puede ser
   ×10 o más: un radio "chico" en unidades de viewBox se convierte fácil en
   un círculo de 20-30px reales. Por eso los radios de acá son bien chicos. */

// Capa de fondo: motas chicas y quietas, dan densidad sin competir con nada.
const DUST = genStars(130, 7, { rMin: 0.09, rMax: 0.22, oMin: 0.15, oMax: 0.45 });
// Capa de frente: menos estrellas, más grandes, titilan.
const TWINKLE = genStars(46, 19, { rMin: 0.16, rMax: 0.36, oMin: 0.45, oMax: 0.95, durMin: 2.8, durMax: 6.5 });

export default function Starfield() {
  return (
    <svg className="starfield" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice"
      aria-hidden="true">
      <g className="starfield-dust">
        {DUST.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.r} opacity={s.o} />)}
      </g>
      <g className="starfield-twinkle">
        {TWINKLE.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r}
            style={{ '--star-o': s.o, animationDuration: `${s.dur}s`, animationDelay: `${s.delay}s` }} />
        ))}
      </g>
    </svg>
  );
}
