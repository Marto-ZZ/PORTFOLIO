import { useEffect, useRef, useState } from 'react';
import LunaDibujo from './LunaDibujo.jsx';
import {
  SaturnoDefs, SaturnoCuerpo, SaturnoAnillosAtras, SaturnoAnillosAdelante,
} from './SaturnoDibujo.jsx';
import { CIELO } from './saturno.precalc.js';
import './SaturnSystem.css';

const CX = 550;
const CY = 350;
const R_PLANET = 165;
const TILT = -14;

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
  { rx: 468, ry: 224 },
];

const MOONS = [
  { href: '#sobre-mi',  es: 'Sobre mí',  en: 'About',    orbit: 1, dur: 168, start: 0.12, r: 36, side: -1, tone: 'rocosa',    tinte: '--ambar'   },
  { href: '#skills',    es: 'Skills',    en: 'Skills',   orbit: 2, dur: 205, start: 0.38, r: 40, side:  1, tone: 'gaseosa',   tinte: '--cian'    },
  { href: '#proyectos', es: 'Proyectos', en: 'Projects', orbit: 2, dur: 205, start: 0.60, r: 38, side:  1, tone: 'volcanica', tinte: '--magenta' },
  { href: '#contacto',  es: 'Contacto',  en: 'Contact',  orbit: 1, dur: 168, start: 0.87, r: 34, side: -1, tone: 'helada',    tinte: '--violeta' },
];

const LAYOUT = {
  wide:    { viewBox: '-80 -10 1340 700' },
  compact: { viewBox: '0 32 1100 680' },
};

const MUESTRAS = 120;
const CAJA = { w: 560, h: 240 };

function recorrido(rx, ry, tilt = TILT) {
  const t = (tilt * Math.PI) / 180, cg = Math.cos(t), sg = Math.sin(t);
  const punto = (p) => {
    const a = Math.PI + 2 * Math.PI * p;
    const x = rx * Math.cos(a), y = ry * Math.sin(a);
    return [CX + x * cg - y * sg, CY + x * sg + y * cg];
  };
  const N = 2000, pts = [], acum = [0];
  for (let i = 0; i <= N; i++) pts.push(punto(i / N));
  for (let i = 1; i <= N; i++) acum.push(acum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const total = acum[N];
  const res = [];
  let j = 0;
  for (let k = 0; k <= MUESTRAS; k++) {
    const meta = (k / MUESTRAS) * total;
    while (j < N - 1 && acum[j + 1] < meta) j++;
    const u = (meta - acum[j]) / ((acum[j + 1] - acum[j]) || 1);
    res.push([pts[j][0] + (pts[j + 1][0] - pts[j][0]) * u, pts[j][1] + (pts[j + 1][1] - pts[j][1]) * u]);
  }
  return res;
}

function keyframes(pts, vb, mitad) {
  const kf = pts.map(([x, y], k) => ({
    offset: k / MUESTRAS,
    transform: `translate(${(((x - vb.x) - CAJA.w / 2) / CAJA.w * 100).toFixed(3)}%, ${(((y - vb.y) - CAJA.h / 2) / CAJA.h * 100).toFixed(3)}%)`,
  }));
  if (!mitad) return kf;
  const atras = mitad === 'atras';
  const out = [];
  for (const k of kf) {
    if (k.offset === 0.5) {
      out.push({ ...k, opacity: atras ? 1 : 0 }, { ...k, opacity: atras ? 0 : 1 });
    } else {
      out.push({ ...k, opacity: atras === (k.offset < 0.5) ? 1 : 0 });
    }
  }
  return out;
}

const CAJA_VB = `${-CAJA.w / 2} ${-CAJA.h / 2} ${CAJA.w} ${CAJA.h}`;

function LunaCuerpo({ m, layer }) {
  return (
    <svg viewBox={CAJA_VB} className={`sat-luna sat-moon-vis sat-moon-vis--${layer}`}
      data-luna={m.href} data-capa={layer} aria-hidden="true">
      <g transform={`scale(${m.r})`}>
        <LunaDibujo tone={m.tone} clipId="satMoonUnit" />
      </g>
    </svg>
  );
}

function LunaEtiqueta({ m, compact }) {
  const lead = 70 * m.side;
  const lift = -66;
  return (
    <svg viewBox={CAJA_VB} className="sat-luna sat-luna-etiqueta" data-luna={m.href} data-capa="etiqueta">
      {!compact && (
        <line className="sat-lead" x1={m.r * 0.7 * m.side} y1={-m.r * 0.5}
          x2={lead - 6 * m.side} y2={lift + 6} />
      )}
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
      <circle r={Math.max(m.r + 16, 38)} className="sat-hit" />
    </svg>
  );
}

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

const EN_PLANETA = `translate(${CX} ${CY}) scale(${R_PLANET})`;

const SaturnoLinea = () => (
  <g className="sat-planet" transform={EN_PLANETA}><SaturnoCuerpo /></g>
);
const AnillosLineaAtras = () => (
  <g className="sat-rings" transform={EN_PLANETA}><SaturnoAnillosAtras /></g>
);
const AnillosLineaAdelante = () => (
  <g className="sat-rings" transform={EN_PLANETA}><SaturnoAnillosAdelante /></g>
);

export default function SaturnSystem() {
  const ref = useRef(null);
  const compact = useCompact();

  const paths = ORBITS.map(o => ellipsePath(o.rx, o.ry));
  const vbStr = compact ? LAYOUT.compact.viewBox : LAYOUT.wide.viewBox;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const [vx, vy] = vbStr.split(' ').map(Number);
    const vb = { x: vx, y: vy };
    const recorridos = ORBITS.map(o => recorrido(o.rx, o.ry));
    const anims = [];
    for (const m of MOONS) {
      for (const pieza of el.querySelectorAll(`[data-luna="${m.href}"]`)) {
        const capa = pieza.dataset.capa;
        const mitad = capa === 'back' ? 'atras' : capa === 'front' ? 'adelante' : null;
        const a = pieza.animate(keyframes(recorridos[m.orbit], vb, mitad), {
          duration: m.dur * 1000, iterations: Infinity, easing: 'linear',
        });
        a.currentTime = m.start * m.dur * 1000;
        anims.push(a);
      }
    }
    const root = document.documentElement;
    let fuera = false, encima = false;
    const sync = () => {
      const quieto = fuera || encima || document.hidden || root.getAttribute('data-anim') === 'off';
      for (const a of anims) (quieto ? a.pause() : a.play());
    };
    const io = new IntersectionObserver(es => { fuera = !es[0].isIntersecting; sync(); });
    io.observe(el);
    const entra = () => { encima = true; sync(); };
    const sale = () => { encima = el.matches(':hover') || el.contains(document.activeElement); sync(); };
    const saleDiferido = () => setTimeout(sale);
    el.addEventListener('pointerenter', entra);
    el.addEventListener('pointerleave', sale);
    el.addEventListener('focusin', entra);
    el.addEventListener('focusout', saleDiferido);
    document.addEventListener('visibilitychange', sync);
    const mo = new MutationObserver(sync);
    mo.observe(root, { attributes: true, attributeFilter: ['data-anim'] });
    sync();
    return () => {
      io.disconnect(); mo.disconnect();
      el.removeEventListener('pointerenter', entra);
      el.removeEventListener('pointerleave', sale);
      el.removeEventListener('focusin', entra);
      el.removeEventListener('focusout', saleDiferido);
      document.removeEventListener('visibilitychange', sync);
      anims.forEach(a => a.cancel());
    };
  }, [vbStr]);

  return (
    <div className="saturn" ref={ref}>
      <svg viewBox={vbStr} className="saturn-svg"
        role="img" aria-label="Sistema planetario con accesos a las secciones del portfolio">
        <defs>
          <clipPath id="satMoonUnit"><circle cx="0" cy="0" r="1" /></clipPath>

          <SaturnoDefs />
        </defs>

        <g className="sat-orbits">
          {paths.map((d, i) => <path key={i} d={d} className="sat-orbit" />)}
        </g>

        <g className="sat-cielo">
          <path d={CIELO.estrellas} className="sat-tinta" strokeWidth="2.4" />
          <path d={CIELO.titileos} className="sat-tinta" strokeWidth="2.2" />
          <path d={CIELO.puntos} className="sat-punto" />
        </g>

        <AnillosLineaAtras />
      </svg>

      <div className="sat-capa">
        {MOONS.map(m => <LunaCuerpo key={m.href} m={m} layer="back" />)}
      </div>

      <svg viewBox={vbStr} className="saturn-svg sat-capa" aria-hidden="true">
        <SaturnoLinea />
        <AnillosLineaAdelante />
      </svg>

      <div className="sat-capa sat-capa--links">
        {MOONS.map(m => (
          <a key={m.href} href={m.href} className="sat-link" style={{ '--sx': `var(${m.tinte})` }}>
            <LunaCuerpo m={m} layer="front" />
            <LunaEtiqueta m={m} compact={compact} />
          </a>
        ))}
      </div>
    </div>
  );
}
