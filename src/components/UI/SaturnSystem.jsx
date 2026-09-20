import { useEffect, useRef, useState } from 'react';
import './SaturnSystem.css';

/* Sistema planetario del hero: un Saturno con anillos y lunas que orbitan,
   donde cada luna con nombre es un acceso a una sección del portfolio.

   Todo es SVG + CSS (nada de WebGL): las órbitas se animan con offset-path,
   que corre en el compositor y no cuesta main thread. La clave es que el
   MISMO string de path se usa para dibujar la órbita y para mover la luna,
   así la luna viaja exactamente sobre la línea que se ve. */

const CX = 550;        // centro del sistema, en unidades del viewBox
const CY = 350;
const R_PLANET = 165;
const TILT = -14;      // inclinación del plano orbital (y de los anillos)

// Elipse rotada como path. El parámetro x-axis-rotation del comando A permite
// expresar la inclinación directamente, sin envolver todo en un <g transform>
// (que rotaría también los textos de las etiquetas).
const ellipsePath = (rx, ry, tilt = TILT) => {
  const t = (tilt * Math.PI) / 180;
  const dx = rx * Math.cos(t);
  const dy = rx * Math.sin(t);
  const x0 = CX - dx, y0 = CY - dy;
  const x1 = CX + dx, y1 = CY + dy;
  return `M ${x0.toFixed(1)} ${y0.toFixed(1)}`
    + ` A ${rx} ${ry} ${tilt} 1 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`
    + ` A ${rx} ${ry} ${tilt} 1 1 ${x0.toFixed(1)} ${y0.toFixed(1)}`;
};

const ORBITS = [
  { rx: 318, ry: 105 },
  { rx: 366, ry: 121 },
  { rx: 414, ry: 137 },
];

/* start = posición sobre la órbita (0..1). El path arranca en el extremo
   izquierdo y gira por arriba, así que: 0 = izquierda, 0.25 = arriba,
   0.5 = derecha, 0.75 = abajo. Se elige el cuadrante para que la etiqueta
   salga hacia afuera del sistema y no quede pisando el planeta.
   side = hacia dónde sale la etiqueta (1 derecha, -1 izquierda).

   Las órbitas son deliberadamente lentas (2-3 min por vuelta): el sistema se
   lee vivo pero calmo, y una luna que apenas se desplaza es mucho más fácil
   de apuntar que una que cruza la pantalla. */
const MOONS = [
  { href: '#sobre-mi',  es: 'Sobre mí',  en: 'About',    orbit: 1, dur: 168, start: 0.12, r: 30, side: -1, tone: 'rock' },
  { href: '#skills',    es: 'Skills',    en: 'Skills',   orbit: 2, dur: 205, start: 0.38, r: 34, side:  1, tone: 'gas'  },
  { href: '#proyectos', es: 'Proyectos', en: 'Projects', orbit: 2, dur: 205, start: 0.60, r: 32, side:  1, tone: 'rock' },
  { href: '#contacto',  es: 'Contacto',  en: 'Contact',  orbit: 1, dur: 168, start: 0.87, r: 28, side: -1, tone: 'ice'  },
];

// Lunas decorativas: dan densidad al sistema sin competir con las que navegan.
// Van en la órbita interior, donde una etiqueta chocaría contra el planeta.
const DUST = [
  { orbit: 0, dur: 132, start: 0.20, r: 13 },
  { orbit: 0, dur: 132, start: 0.68, r: 10 },
  { orbit: 2, dur: 205, start: 0.93, r: 14 },
];

/* Dos disposiciones distintas, no la misma achicada:

   - ancha: etiqueta al costado con línea guía, como en la referencia.
   - compacta: etiqueta centrada DEBAJO de la luna. En 375px una etiqueta
     lateral se sale de la pantalla sí o sí (el texto mide más que el radio de
     la órbita), así que ponerla abajo es lo único que entra sin recortarse. */
const LAYOUT = {
  wide:    { viewBox: '-80 40 1290 625' },
  compact: { viewBox: '0 130 1100 520' },
};

function Moon({ m, path, labelled, compact }) {
  const style = {
    offsetPath: `path("${path}")`,
    offsetDistance: `${m.start * 100}%`,
    animationDuration: `${m.dur}s`,
    animationDelay: `${-m.dur * m.start}s`,
  };

  if (!labelled) {
    return (
      <g className="sat-moon sat-moon--dust" style={style}>
        <circle r={m.r} className="sat-moon-body" />
      </g>
    );
  }

  const lead = 70 * m.side;      // dónde empieza la etiqueta respecto de la luna
  const lift = -66;              // cuánto sube

  return (
    <g className="sat-moon" style={style}>
      {/* El subrayado lo pone el CSS (text-decoration), así se ajusta solo al
          ancho real del texto en cualquier idioma y en cualquier breakpoint. */}
      {!compact && (
        <line className="sat-lead" x1={m.r * 0.7 * m.side} y1={-m.r * 0.5}
          x2={lead - 6 * m.side} y2={lift + 6} />
      )}
      <circle r={m.r} className={`sat-moon-body sat-moon-body--${m.tone}`} />
      <circle r={m.r} className="sat-moon-shade" />
      <text
        className="sat-label"
        x={compact ? 0 : lead}
        y={compact ? m.r + 46 : lift}
        textAnchor={compact ? 'middle' : (m.side === 1 ? 'start' : 'end')}
        data-es={m.es}
        data-en={m.en}
      >
        {m.es}
      </text>
      {/* área de click generosa: el círculo visible es chico para apuntarle */}
      <circle r={Math.max(m.r + 14, 34)} className="sat-hit" />
    </g>
  );
}

// El layout depende del ancho real, no sólo del CSS: el viewBox y la posición
// de la etiqueta son atributos del SVG y hay que decidirlos en JS.
function useCompact() {
  const [compact, setCompact] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 560px)').matches
  );
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 560px)');
    const on = (e) => setCompact(e.matches);
    setCompact(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return compact;
}

export default function SaturnSystem() {
  const ref = useRef(null);
  const compact = useCompact();

  // Mismo patrón que el resto del sitio: si el sistema no está en pantalla
  // (o la pestaña está en segundo plano) se pausan las animaciones en vez de
  // seguir componiendo frames que nadie ve.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const idle = (v) => el.classList.toggle('is-idle', v);
    const io = new IntersectionObserver(es => idle(!es[0].isIntersecting));
    io.observe(el);
    const onVis = () => idle(document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', onVis); };
  }, []);

  const paths = ORBITS.map(o => ellipsePath(o.rx, o.ry));

  return (
    <div className="saturn" ref={ref}>
      <svg viewBox={compact ? LAYOUT.compact.viewBox : LAYOUT.wide.viewBox} className="saturn-svg" role="img"
        aria-label="Sistema planetario con accesos a las secciones del portfolio">
        <defs>
          {/* Los colores viven en el CSS (clases s1..s5) y no en atributos:
              los stop-color son propiedades CSS, así que el tema claro puede
              re-tintar todo el sistema sin filtros ni un segundo SVG. */}
          <radialGradient id="satBody" cx="32%" cy="24%" r="74%">
            <stop className="s1" offset="0%" />
            <stop className="s2" offset="22%" />
            <stop className="s3" offset="55%" />
            <stop className="s4" offset="82%" />
            <stop className="s5" offset="100%" />
          </radialGradient>

          {/* bandas atmosféricas, muy sutiles */}
          <linearGradient id="satBands" x1="0" y1="0" x2="0" y2="1">
            <stop className="sv" offset="0%" />
            <stop className="sb" offset="16%" />
            <stop className="sv" offset="24%" />
            <stop className="sb" offset="40%" />
            <stop className="sv" offset="50%" />
            <stop className="sb" offset="63%" />
            <stop className="sv" offset="72%" />
            <stop className="sb" offset="86%" />
            <stop className="sv" offset="100%" />
          </linearGradient>

          <radialGradient id="satGlow" cx="50%" cy="50%" r="50%">
            <stop className="g1" offset="0%" />
            <stop className="g2" offset="55%" />
            <stop className="g3" offset="100%" />
          </radialGradient>

          <radialGradient id="satMoonRock" cx="34%" cy="28%" r="80%">
            <stop className="s1" offset="0%" />
            <stop className="s3" offset="55%" />
            <stop className="s5" offset="100%" />
          </radialGradient>
          <radialGradient id="satMoonGas" cx="34%" cy="28%" r="80%">
            <stop className="s1" offset="0%" />
            <stop className="s3" offset="55%" />
            <stop className="s5" offset="100%" />
          </radialGradient>
          <radialGradient id="satMoonIce" cx="34%" cy="28%" r="80%">
            <stop className="s1" offset="0%" />
            <stop className="s3" offset="55%" />
            <stop className="s5" offset="100%" />
          </radialGradient>
          {/* sombra propia: el mismo degradado para todas las lunas */}
          <radialGradient id="satMoonShade" cx="32%" cy="26%" r="78%">
            <stop offset="55%" stopColor="#000000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.55" />
          </radialGradient>

          <filter id="satBlur" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="9" />
          </filter>

          {/* Los anillos pasan por detrás del planeta arriba y por delante
              abajo. Se dibuja el anillo completo, después el planeta, y
              después la mitad delantera recortada en el plano del anillo. */}
          <clipPath id="satRingFront">
            <rect x={CX - 520} y={CY} width="1040" height="420"
              transform={`rotate(${TILT} ${CX} ${CY})`} />
          </clipPath>
          <clipPath id="satPlanetClip">
            <circle cx={CX} cy={CY} r={R_PLANET} />
          </clipPath>
        </defs>

        {/* resplandor detrás de todo */}
        <ellipse cx={CX} cy={CY} rx="470" ry="320" fill="url(#satGlow)" className="sat-glow" />

        {/* órbitas */}
        <g className="sat-orbits">
          {paths.map((d, i) => <path key={i} d={d} className="sat-orbit" />)}
        </g>

        {/* anillos por detrás del planeta */}
        <g className="sat-rings">
          <g transform={`rotate(${TILT} ${CX} ${CY})`}>
            <ellipse cx={CX} cy={CY} rx="285" ry="94" className="sat-ring sat-ring--halo" />
            <ellipse cx={CX} cy={CY} rx="266" ry="88" className="sat-ring sat-ring--a" />
            <ellipse cx={CX} cy={CY} rx="244" ry="81" className="sat-ring sat-ring--b" />
            <ellipse cx={CX} cy={CY} rx="221" ry="73" className="sat-ring sat-ring--c" />
            <ellipse cx={CX} cy={CY} rx="200" ry="66" className="sat-ring sat-ring--d" />
          </g>
        </g>

        {/* planeta */}
        <g className="sat-planet">
          <circle cx={CX} cy={CY} r={R_PLANET} fill="url(#satBody)" />
          <g clipPath="url(#satPlanetClip)">
            {/* Las bandas van inclinadas igual que los anillos: en un gigante
                gaseoso son paralelas al plano ecuatorial, y alinearlas con el
                anillo es lo que hace que la esfera se lea como un planeta y no
                como una pelota. Un cuadrado de lado 2R rotado sobre su centro
                sigue cubriendo el círculo inscripto, así que no quedan huecos. */}
            <rect x={CX - R_PLANET} y={CY - R_PLANET} width={R_PLANET * 2} height={R_PLANET * 2}
              transform={`rotate(${TILT} ${CX} ${CY})`} fill="url(#satBands)" />
            {/* sombra que proyectan los anillos sobre el planeta */}
            <ellipse cx={CX} cy={CY + 4} rx="286" ry="17"
              transform={`rotate(${TILT} ${CX} ${CY})`}
              fill="#0b0622" opacity="0.32" filter="url(#satBlur)" />
          </g>
          {/* luz de borde */}
          <circle cx={CX} cy={CY} r={R_PLANET - 0.5} className="sat-rim" />
        </g>

        {/* anillos por delante del planeta */}
        <g className="sat-rings" clipPath="url(#satRingFront)">
          <g transform={`rotate(${TILT} ${CX} ${CY})`}>
            <ellipse cx={CX} cy={CY} rx="285" ry="94" className="sat-ring sat-ring--halo" />
            <ellipse cx={CX} cy={CY} rx="266" ry="88" className="sat-ring sat-ring--a" />
            <ellipse cx={CX} cy={CY} rx="244" ry="81" className="sat-ring sat-ring--b" />
            <ellipse cx={CX} cy={CY} rx="221" ry="73" className="sat-ring sat-ring--c" />
            <ellipse cx={CX} cy={CY} rx="200" ry="66" className="sat-ring sat-ring--d" />
          </g>
        </g>

        {/* lunas decorativas */}
        <g className="sat-dust">
          {DUST.map((m, i) => (
            <Moon key={`d${i}`} m={m} path={paths[m.orbit]} labelled={false} compact={compact} />
          ))}
        </g>

        {/* lunas navegables */}
        <g className="sat-moons">
          {MOONS.map(m => (
            <a key={m.href} href={m.href} className="sat-link">
              <Moon m={m} path={paths[m.orbit]} labelled compact={compact} />
            </a>
          ))}
        </g>
      </svg>
    </div>
  );
}
