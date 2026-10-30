import { tramaEsfera, rng } from './sketch.js';
import {
  circulo, elipse, rayos, trazo, puntadas, placa, titileo, mancha,
  agruparPorGrosor, puntosComoPath,
} from './doodle.js';

const LUZ = 222;
export const W = { contorno: 0.05, acento: 0.032, rasgo: 0.036, medio: 0.028, fino: 0.022, trama: 0.02 };

const p3 = (n) => Math.round(n * 1000) / 1000;

export const CONTORNO = circulo({ r: 1, temblor: 0.006, semilla: 3 });
export const ACENTO = elipse({ rx: 0.968, a0: -20, a1: 118, paso: 10, temblor: 0.004, semilla: 4 });

const PELE = { x: -0.18, y: 0.04 };
const LOKI = { x: 0.42, y: -0.3 };

const penacho = () => {
  const rand = rng(97);
  const a = (-128 * Math.PI) / 180;
  const n = [Math.cos(a), Math.sin(a)];
  const t = [-n[1], n[0]];
  const P = (u, v) => [n[0] * (1 + u) + t[0] * v, n[1] * (1 + u) + t[1] * v];
  const nube = (alto, ancho, base, cant, rMin, rMax) => Array.from({ length: cant }, (_, i) => {
    const th = Math.PI * ((i + 0.5 + (rand() - 0.5) * 0.6) / cant);
    const [x, y] = P(base + alto * Math.sin(th) + (rand() - 0.5) * 0.03, -ancho * Math.cos(th));
    return { x: p3(x), y: p3(y), r: p3(rMin + rand() * (rMax - rMin)) };
  });
  const [x0, y0] = n, [x1, y1] = P(0.2, 0.01);
  return {
    puntos: [
      ...nube(0.3, 0.36, 0, 9, 0.022, 0.036),
      ...nube(0.17, 0.2, 0.01, 5, 0.016, 0.026),
    ],
    columna: `M${p3(x0)} ${p3(y0)}L${p3(x1)} ${p3(y1)}`,
  };
};

const V = {
  sombra: tramaEsfera({
    luz: LUZ, lineas: 9, desde: 0.3, hasta: 0.94, afinado: 0.45,
    grosorMin: W.trama, grosorMax: W.trama, semilla: 5,
  }),
  peleBorde: mancha({ cx: PELE.x, cy: PELE.y, r: 0.2, semilla: 11, irregularidad: 0.16, achatado: 0.9, giro: 163 }),
  peleLago: mancha({ cx: PELE.x + 0.02, cy: PELE.y + 0.015, r: 0.085, semilla: 12, irregularidad: 0.22 }),
  peleEyecta: rayos({ cx: PELE.x, cy: PELE.y, r0: 0.27, r1: 0.47, n: 13, semilla: 13, variacion: 0.6, desorden: 0.5, a0: 172, a1: 455 }),
  loki: mancha({ cx: LOKI.x, cy: LOKI.y, r: 0.13, semilla: 21, irregularidad: 0.2, achatado: 0.78, giro: 145 }),
  lokiCostra: trazo([[LOKI.x - 0.08, LOKI.y - 0.02], [LOKI.x - 0.01, LOKI.y + 0.02], [LOKI.x + 0.07, LOKI.y - 0.01]], { semilla: 22, temblor: 0.015 })
    + trazo([[LOKI.x - 0.04, LOKI.y + 0.06], [LOKI.x + 0.04, LOKI.y + 0.065]], { semilla: 23, temblor: 0.01 }),
  patera: mancha({ cx: 0.24, cy: 0.52, r: 0.065, semilla: 31, irregularidad: 0.25 }),
  lavaA: trazo([[-0.36, 0.14], [-0.53, 0.33], [-0.5, 0.55], [-0.61, 0.7], [-0.53, 0.815]], { semilla: 41, temblor: 0.02 }),
  lavaB: trazo([[-0.26, 0.22], [-0.4, 0.39], [-0.38, 0.55], [-0.5, 0.7], [-0.53, 0.815]], { semilla: 42, temblor: 0.02 }),
  manchas: [
    { x: -0.6, y: -0.4, r: 0.038 }, { x: -0.3, y: -0.62, r: 0.03 },
    { x: 0.02, y: -0.76, r: 0.033 }, { x: 0.12, y: -0.52, r: 0.026 },
    { x: -0.76, y: -0.1, r: 0.03 },
  ],
  penacho: penacho(),
};

export const VOLCANICA = {
  adentro: agruparPorGrosor([
    ...V.sombra,
    { d: V.peleEyecta, w: W.fino }, { d: V.lokiCostra, w: W.fino },
    { d: V.lavaA, w: W.medio }, { d: V.lavaB, w: W.medio },
    { d: V.peleLago, w: W.medio }, { d: V.patera, w: W.medio },
    { d: V.peleBorde, w: W.rasgo }, { d: V.loki, w: W.rasgo },
  ]),
  manchas: puntosComoPath(V.manchas),
  penachoColumna: V.penacho.columna,
  penachoPuntos: puntosComoPath(V.penacho.puntos),
};

function gemela(pts, sep) {
  const [x0, y0] = pts[0], [x1, y1] = pts[pts.length - 1];
  const l = Math.hypot(x1 - x0, y1 - y0);
  const nx = -(y1 - y0) / l, ny = (x1 - x0) / l;
  return pts.map(([x, y]) => [x + nx * sep, y + ny * sep]);
}

const LINEAE = [
  { pts: [[-1.08, -0.4], [-0.45, -0.16], [0.2, 0.14], [0.7, 0.36], [1.08, 0.5]], w: W.rasgo, w2: W.fino, puntadas: true },
  { pts: [[-0.95, 0.36], [-0.35, 0.5], [0.2, 0.74], [0.55, 0.96]], w: W.medio, w2: W.fino * 0.85 },
  { pts: [[-0.12, -1.06], [0.18, -0.62], [0.55, -0.3], [1.06, -0.12]], w: W.medio, w2: W.fino * 0.85 },
];

export const HELADA = {
  adentro: agruparPorGrosor([
    ...tramaEsfera({
      luz: LUZ, lineas: 8, desde: 0.34, hasta: 0.94, afinado: 0.5,
      grosorMin: W.trama, grosorMax: W.trama, semilla: 41,
    }),
    ...LINEAE.flatMap((l, i) => [
      { d: trazo(l.pts, { semilla: 51 + i, temblor: 0.02 }), w: l.w },
      { d: trazo(gemela(l.pts, 0.058), { semilla: 61 + i, temblor: 0.025 }), w: l.w2 },
      ...(l.puntadas
        ? [{ d: puntadas(l.pts, { cada: 0.13, largo: 0.06, semilla: 71, desde: 0.18, hasta: 0.82 }), w: W.fino }]
        : []),
    ]),
    {
      d: [
        placa({ cx: -0.48, cy: -0.52, r: 0.125, lados: 5, semilla: 81, giro: 10 }),
        placa({ cx: -0.24, cy: -0.62, r: 0.09, lados: 4, semilla: 82, giro: 30 }),
        placa({ cx: -0.37, cy: -0.335, r: 0.08, lados: 5, semilla: 83, giro: -15 }),
        placa({ cx: -0.67, cy: -0.33, r: 0.068, lados: 4, semilla: 84, giro: 45 }),
      ].join(''),
      w: W.medio,
    },
    {
      d: titileo({ cx: 0.1, cy: -0.2, r: 0.1, semilla: 91 }) + titileo({ cx: -0.72, cy: 0.1, r: 0.068, semilla: 92 }),
      w: W.medio,
    },
  ]),
};
