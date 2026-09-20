import { useEffect, useRef, useState } from 'react';
import './SaturnSystem.css';

/* Sistema planetario del hero: un Saturno con anillos y lunas que orbitan,
   donde cada luna con nombre es un acceso a una sección del portfolio.

   Todo es SVG + CSS (nada de WebGL): las órbitas se animan con offset-path,
   que corre en el compositor y no cuesta main thread. La clave es que el
   MISMO string de path se usa para dibujar la órbita y para mover la luna,
   así la luna viaja exactamente sobre la línea que se ve.

   Dos estilos: 'realista' (esferas con relieve) y 'linea' (trazo tipo dibujo).
   Se elige con la prop variant. */

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
  { href: '#sobre-mi',  es: 'Sobre mí',  en: 'About',    orbit: 1, dur: 168, start: 0.12, r: 36, side: -1, tone: 'rock' },
  { href: '#skills',    es: 'Skills',    en: 'Skills',   orbit: 2, dur: 205, start: 0.38, r: 40, side:  1, tone: 'gas'  },
  { href: '#proyectos', es: 'Proyectos', en: 'Projects', orbit: 2, dur: 205, start: 0.60, r: 38, side:  1, tone: 'rock' },
  { href: '#contacto',  es: 'Contacto',  en: 'Contact',  orbit: 1, dur: 168, start: 0.87, r: 34, side: -1, tone: 'ice'  },
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

/* Relieve de las lunas, en coordenadas unitarias (-1..1 = borde de la luna).
   Se mantienen dentro de |pos| + r < 0.95 para no necesitar recorte. */
const CRATERS = [
  { x: -0.30, y: -0.34, r: 0.21 },
  { x:  0.26, y: -0.08, r: 0.15 },
  { x: -0.08, y:  0.34, r: 0.25 },
  { x:  0.44, y:  0.32, r: 0.13 },
  { x: -0.54, y:  0.14, r: 0.12 },
  { x:  0.10, y: -0.52, r: 0.11 },
];

// Estrellitas del estilo de línea: posiciones fijas, fuera del planeta.
const SPARKS = [
  { x: 250, y: 150, s: 13 }, { x: 905, y: 205, s: 10 },
  { x: 175, y: 470, s: 9 },  { x: 980, y: 520, s: 12 },
  { x: 640, y: 105, s: 8 },  { x: 430, y: 585, s: 10 },
];
const sparkPath = (s) =>
  `M 0 ${-s} Q ${s * 0.16} ${-s * 0.16} ${s} 0 Q ${s * 0.16} ${s * 0.16} 0 ${s}`
  + ` Q ${-s * 0.16} ${s * 0.16} ${-s} 0 Q ${-s * 0.16} ${-s * 0.16} 0 ${-s} Z`;

function MoonSurface({ m, variant }) {
  if (variant === 'linea') {
    // dibujo: sólo contornos de cráteres, como en la referencia a mano alzada
    return (
      <g className="sat-moon-detail">
        {CRATERS.slice(0, 4).map((c, i) => (
          <circle key={i} cx={c.x * m.r} cy={c.y * m.r} r={c.r * m.r} className="sat-crater-line" />
        ))}
      </g>
    );
  }

  if (m.tone === 'gas') {
    // gigante gaseosa: bandas inclinadas, recortadas al disco de la luna.
    // El recorte se evalúa en el espacio ya escalado del grupo exterior, por
    // eso van dos grupos anidados (uno escala, el otro recorta).
    return (
      <g transform={`scale(${m.r})`}>
        <g clipPath="url(#satMoonUnit)" transform={`rotate(${TILT})`}>
          {[-0.62, -0.34, -0.06, 0.22, 0.52].map((y, i) => (
            <rect key={i} x="-1" y={y} width="2" height={i % 2 ? 0.13 : 0.2}
              className={`sat-band-moon sat-band-moon--${i % 2 ? 'dark' : 'light'}`} />
          ))}
        </g>
      </g>
    );
  }

  if (m.tone === 'ice') {
    return (
      <g transform={`scale(${m.r})`}>
        <g clipPath="url(#satMoonUnit)">
          <ellipse cx="-0.2" cy="-0.3" rx="0.55" ry="0.34" className="sat-ice-patch" />
          <ellipse cx="0.3" cy="0.4" rx="0.42" ry="0.26" className="sat-ice-patch" />
        </g>
      </g>
    );
  }

  // rocosa: cráteres con reborde iluminado arriba y fondo en sombra
  return (
    <g className="sat-moon-detail">
      {CRATERS.map((c, i) => (
        <g key={i}>
          <circle cx={c.x * m.r} cy={c.y * m.r} r={c.r * m.r} className="sat-crater" />
          <circle cx={c.x * m.r} cy={(c.y - c.r * 0.22) * m.r} r={c.r * m.r * 0.86}
            className="sat-crater-lip" />
        </g>
      ))}
    </g>
  );
}

function MoonBody({ m, variant }) {
  return (
    <>
      <circle r={m.r} className={`sat-moon-body sat-moon-body--${m.tone}`} />
      <MoonSurface m={m} variant={variant} />
      <circle r={m.r} className="sat-moon-shade" />
      <circle r={m.r} className="sat-moon-rim" />
    </>
  );
}

/* Cada luna se dibuja DOS veces: una antes del planeta y otra después. La
   animación de visibilidad va sincronizada con la órbita (misma duración y
   delay), así el cuerpo aparece en la capa de atrás mientras recorre la mitad
   lejana y en la de adelante en la cercana. El planeta queda en el medio y la
   oclusión sale sola por orden de pintado.
   La etiqueta va siempre en la capa de adelante: es navegación, no tiene que
   desaparecer detrás del planeta. */
function MoonOrbiter({ m, path, compact, variant, layer }) {
  const style = {
    offsetPath: `path("${path}")`,
    offsetDistance: `${m.start * 100}%`,
    animationDuration: `${m.dur}s`,
    animationDelay: `${-m.dur * m.start}s`,
  };
  // con las animaciones apagadas la visibilidad tiene que quedar bien igual
  const detras = m.start < 0.5;
  const visStyle = {
    animationDuration: `${m.dur}s`,
    animationDelay: `${-m.dur * m.start}s`,
    visibility: (layer === 'back') === detras ? 'visible' : 'hidden',
  };

  const lead = 70 * m.side;
  const lift = -66;
  const front = layer === 'front';

  return (
    <g className="sat-moon" style={style}>
      {front && !compact && (
        <line className="sat-lead" x1={m.r * 0.7 * m.side} y1={-m.r * 0.5}
          x2={lead - 6 * m.side} y2={lift + 6} />
      )}
      <g className={`sat-moon-vis sat-moon-vis--${layer}`} style={visStyle}>
        <MoonBody m={m} variant={variant} />
      </g>
      {front && (
        <>
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
          {/* área de click generosa: la luna es chica para apuntarle */}
          <circle r={Math.max(m.r + 16, 38)} className="sat-hit" />
        </>
      )}
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

const Rings = () => (
  <g transform={`rotate(${TILT} ${CX} ${CY})`}>
    <ellipse cx={CX} cy={CY} rx="285" ry="94" className="sat-ring sat-ring--halo" />
    <ellipse cx={CX} cy={CY} rx="266" ry="88" className="sat-ring sat-ring--a" />
    <ellipse cx={CX} cy={CY} rx="244" ry="81" className="sat-ring sat-ring--b" />
    <ellipse cx={CX} cy={CY} rx="221" ry="73" className="sat-ring sat-ring--c" />
    <ellipse cx={CX} cy={CY} rx="200" ry="66" className="sat-ring sat-ring--d" />
  </g>
);

// Mismo patrón que Hero.jsx con data-theme: se observa el atributo data-anim
// del <html>, que escribe el switch "Reducir animaciones" del panel de ajustes.
function useReducedAnim() {
  const [reduced, setReduced] = useState(
    () => typeof document !== 'undefined' && document.documentElement.getAttribute('data-anim') === 'off'
  );
  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setReduced(root.getAttribute('data-anim') === 'off');
    sync();
    const obs = new MutationObserver(sync);
    obs.observe(root, { attributes: true, attributeFilter: ['data-anim'] });
    return () => obs.disconnect();
  }, []);
  return reduced;
}

export default function SaturnSystem({ variant = 'realista' }) {
  const ref = useRef(null);
  const compact = useCompact();
  const reducedAnim = useReducedAnim();

  // Sólo para el prototipo: ?planeta=linea permite fijar un estilo a mano sin
  // tocar código. El switch "Reducir animaciones" manda por encima: es la
  // forma en tiempo real de comparar los dos estilos que pidió Martín.
  const [style, setStyle] = useState(variant);
  useEffect(() => {
    const q = new URLSearchParams(location.search).get('planeta');
    if (q === 'linea' || q === 'realista') setStyle(q);
  }, []);
  const effectiveStyle = reducedAnim ? 'linea' : style;

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
  const linea = effectiveStyle === 'linea';

  return (
    <div className="saturn" ref={ref} data-variant={effectiveStyle}>
      <svg viewBox={compact ? LAYOUT.compact.viewBox : LAYOUT.wide.viewBox} className="saturn-svg"
        role="img" aria-label="Sistema planetario con accesos a las secciones del portfolio">
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
          {/* sombra propia: da volumen, es lo que saca a las lunas de verse planas */}
          <radialGradient id="satMoonShade" cx="30%" cy="24%" r="76%">
            <stop offset="42%" stopColor="#000000" stopOpacity="0" />
            <stop offset="78%" stopColor="#000000" stopOpacity="0.42" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.78" />
          </radialGradient>

          <clipPath id="satMoonUnit"><circle cx="0" cy="0" r="1" /></clipPath>
          <clipPath id="satPlanetClip"><circle cx={CX} cy={CY} r={R_PLANET} /></clipPath>

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

          {/* trama del estilo de línea: el rayado se concentra en el terminador */}
          <pattern id="satHatch" width="8" height="8" patternUnits="userSpaceOnUse"
            patternTransform={`rotate(${TILT - 34})`}>
            <line x1="0" y1="0" x2="0" y2="8" className="sat-hatch-line" />
          </pattern>
          <radialGradient id="satHatchFade" cx="32%" cy="24%" r="76%">
            <stop offset="26%" stopColor="#000" />
            <stop offset="100%" stopColor="#fff" />
          </radialGradient>
          <mask id="satHatchMask">
            <circle cx={CX} cy={CY} r={R_PLANET} fill="url(#satHatchFade)" />
          </mask>
        </defs>

        {/* resplandor detrás de todo */}
        <ellipse cx={CX} cy={CY} rx="470" ry="320" fill="url(#satGlow)" className="sat-glow" />

        {/* órbitas */}
        <g className="sat-orbits">
          {paths.map((d, i) => <path key={i} d={d} className="sat-orbit" />)}
        </g>

        {linea && (
          <g className="sat-sparks">
            {SPARKS.map((s, i) => (
              <path key={i} d={sparkPath(s.s)} transform={`translate(${s.x} ${s.y})`}
                className="sat-spark" />
            ))}
          </g>
        )}

        {/* anillos por detrás del planeta */}
        <g className="sat-rings"><Rings /></g>

        {/* lunas en su mitad lejana: van ANTES del planeta para quedar tapadas */}
        <g className="sat-moons sat-moons--back" aria-hidden="true">
          {MOONS.map(m => (
            <MoonOrbiter key={`b-${m.href}`} m={m} path={paths[m.orbit]}
              compact={compact} variant={effectiveStyle} layer="back" />
          ))}
        </g>

        {/* planeta */}
        <g className="sat-planet">
          <circle cx={CX} cy={CY} r={R_PLANET} className="sat-planet-body" />
          <g clipPath="url(#satPlanetClip)">
            {/* Las bandas van inclinadas igual que los anillos: en un gigante
                gaseoso son paralelas al plano ecuatorial, y alinearlas con el
                anillo es lo que hace que la esfera se lea como un planeta y no
                como una pelota. Un cuadrado de lado 2R rotado sobre su centro
                sigue cubriendo el círculo inscripto, así que no quedan huecos. */}
            <rect x={CX - R_PLANET} y={CY - R_PLANET} width={R_PLANET * 2} height={R_PLANET * 2}
              transform={`rotate(${TILT} ${CX} ${CY})`} fill="url(#satBands)"
              className="sat-planet-bands" />
            {/* sombra que proyectan los anillos sobre el planeta */}
            <ellipse cx={CX} cy={CY + 4} rx="286" ry="17"
              transform={`rotate(${TILT} ${CX} ${CY})`}
              className="sat-ring-shadow" filter="url(#satBlur)" />
          </g>
          {linea && (
            <circle cx={CX} cy={CY} r={R_PLANET} fill="url(#satHatch)" mask="url(#satHatchMask)" />
          )}
          <circle cx={CX} cy={CY} r={R_PLANET - 0.5} className="sat-rim" />
        </g>

        {/* anillos por delante del planeta */}
        <g className="sat-rings" clipPath="url(#satRingFront)"><Rings /></g>

        {/* lunas en su mitad cercana + etiquetas, siempre por encima */}
        <g className="sat-moons sat-moons--front">
          {MOONS.map(m => (
            <a key={m.href} href={m.href} className="sat-link">
              <MoonOrbiter m={m} path={paths[m.orbit]}
                compact={compact} variant={effectiveStyle} layer="front" />
            </a>
          ))}
        </g>
      </svg>
    </div>
  );
}
