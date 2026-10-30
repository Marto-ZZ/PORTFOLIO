import { crater, arco, rng, trazoPresion } from './sketch.js';

const LUZ = 222;

const decimales = (d, n) => d.replace(/-?\d+\.\d+/g, (x) => String(Math.round(x * 10 ** n) / 10 ** n));
const trazos = (lista, n) => lista.map((t) => ({ ...t, d: decimales(t.d, n) }));

const HORIZ_APEX = 286;
const HORIZ_COMBA = 250;
const SUELO = 1130;

const fyHorizonte = (x) => HORIZ_APEX + HORIZ_COMBA * Math.pow((x - 600) / 700, 2);

const TERRENO = [
  { x: 660, t: 0.04, r: 32 },
  { x: 328, t: 0.12, r: 50 },
  { x: 912, t: 0.19, r: 60 },
  { x: 452, t: 0.3,  r: 74 },
  { x: 150, t: 0.44, r: 90 },
  { x: 784, t: 0.53, r: 102 },
  { x: 560, t: 0.7,  r: 124 },
  { x: 1090, t: 0.8, r: 144 },
  { x: 286, t: 0.93, r: 164 },
];

const azar = rng(31);
export const ROCOSA = {
  horizonte: trazos(trazoPresion({
    x0: -160, x1: 1360, fy: fyHorizonte,
    segmentos: 15, grosorMin: 0.45, grosorMax: 3.2, temblor: 9, semilla: 5,
  }), 1),
  horizonteFino: trazos(trazoPresion({
    x0: 90, x1: 1140, fy: (x) => fyHorizonte(x) + 13,
    segmentos: 9, grosorMin: 0.3, grosorMax: 1.1, temblor: 12, semilla: 17,
  }), 1),
  crateres: TERRENO.map((c, i) => {
    const base = fyHorizonte(c.x);
    const y = base + (SUELO - base) * Math.pow(c.t, 1.3);
    const achatado = 0.2 + 0.46 * c.t;
    const partes = crater({ cx: 0, cy: 0, r: 1, luz: LUZ, semilla: 3 + i * 11 });
    const visibles = c.t < 0.4 ? partes.slice(0, 2) : partes;
    return {
      opacidad: (0.4 + 0.6 * c.t).toFixed(2),
      transform: `translate(${c.x} ${y.toFixed(0)}) scale(${c.r} ${(c.r * achatado).toFixed(1)})`,
      partes: visibles.map((s) => ({ d: decimales(s.d, 3), w: (s.w * 1.25).toFixed(4), o: s.o })),
    };
  }),
  suelo: Array.from({ length: 14 }, (_, i) => {
    const t = 0.12 + (i / 13) * 0.88;
    const x = 40 + azar() * 1140;
    const base = fyHorizonte(x);
    const y = base + (SUELO - base) * Math.pow(t, 1.4);
    const largo = 12 + 52 * t;
    const incl = 0.5 + 0.5 * azar();
    return {
      w: (0.5 + 1.5 * t).toFixed(2),
      o: (0.25 + 0.6 * t).toFixed(2),
      d: `M ${x.toFixed(0)} ${y.toFixed(0)} L ${(x + largo * incl * 0.7).toFixed(0)} ${(y + largo).toFixed(0)}`,
    };
  }),
};

const rad = (a) => (a * Math.PI) / 180;
export const ORBITAS = [
  { rx: 520, ry: 180, rot: -16, a0: -150, a1: 130, w: 1.7, ticks: [-96, -20, 64] },
  { rx: 385, ry: 132, rot: 22, a0: 20, a1: 320, w: 1.1, ticks: [86, 214] },
  { rx: 645, ry: 232, rot: 6, a0: -60, a1: 250, w: 2.1, ticks: [-10, 118, 206] },
].map((o) => {
  const medio = (o.rx + o.ry) / 2;
  return {
    transform: `rotate(${o.rot} 600 550) translate(600 550) scale(${o.rx} ${o.ry})`,
    d: decimales(arco(0, 0, 1, o.a0, o.a1), 4),
    w: (o.w / medio).toFixed(5),
    ticks: o.ticks.map((a) => `M ${Math.cos(rad(a)).toFixed(4)} ${Math.sin(rad(a)).toFixed(4)} L ${(Math.cos(rad(a)) * 1.07).toFixed(4)} ${(Math.sin(rad(a)) * 1.07).toFixed(4)}`).join(' '),
    wTick: (0.9 / medio).toFixed(5),
  };
});

export const ONDAS = [150, 288, 426, 564, 714].map((r, i) => ({
  transform: `translate(905 862) scale(${r})`,
  d: decimales(arco(0, 0, 1, 168 + i * 4, 292 - i * 5), 4),
  w: (2.2 / r).toFixed(5),
}));
