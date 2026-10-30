import { tramaEsfera } from './sketch.js';
import {
  circulo, elipse, banda, latitudCortada, espiral, estrella, titileo,
  agruparPorGrosor, puntosComoPath,
} from './doodle.js';

export const INCLINACION = -14;

const K = 0.332;

const ANILLOS_SUELTOS = [
  { rx: 1.721, w: 0.0145 },
  { rx: 1.667, w: 0.0125 },
  { rx: 1.612, w: 0.0145 },
  { rx: 1.455, w: 0.0145 },
  { rx: 1.388, w: 0.0125 },
  { rx: 1.248, w: 0.0100, tenue: true },
].map((a, i) => ({
  ...a,
  d: elipse({ rx: a.rx, ry: a.rx * K, giro: INCLINACION, a0: -90, a1: 270, paso: 10, temblor: 0.0035, semilla: 31 + i * 7 }),
}));
export const ANILLOS = {
  firmes: agruparPorGrosor(ANILLOS_SUELTOS.filter((a) => !a.tenue)),
  tenue: agruparPorGrosor(ANILLOS_SUELTOS.filter((a) => a.tenue))[0],
};

const BANDA_FUERA = 1.738, BANDA_DENTRO = 1.232;
export const CORONA = elipse({ rx: BANDA_FUERA, ry: BANDA_FUERA * K, giro: INCLINACION, temblor: 0, paso: 6 })
  + elipse({ rx: BANDA_DENTRO, ry: BANDA_DENTRO * K, giro: INCLINACION, temblor: 0, paso: 6 });

export const GIRO = [
  elipse({ rx: 1.80, ry: 1.80 * K, giro: INCLINACION, a0: -9, a1: 7, paso: 4, temblor: 0 }),
  elipse({ rx: 1.865, ry: 1.865 * K, giro: INCLINACION, a0: -5, a1: 4, paso: 3, temblor: 0 }),
  elipse({ rx: 1.80, ry: 1.80 * K, giro: INCLINACION, a0: 172, a1: 190, paso: 4, temblor: 0 }),
  elipse({ rx: 1.865, ry: 1.865 * K, giro: INCLINACION, a0: 176, a1: 185, paso: 3, temblor: 0 }),
].join('');

export const BANDAS = agruparPorGrosor([
  { yc: -0.76, desde: 'izq', largo: 0.46, w: 0.016 },
  { yc: -0.54, desde: 'ambos', w: 0.017 },
  { yc: -0.32, desde: 'izq', largo: 0.66, gancho: 0.1, w: 0.017 },
  { yc: -0.13, desde: 'der', largo: 0.46, w: 0.016 },
  { yc: 0.09, desde: 'ambos', w: 0.021 },
  { yc: 0.29, desde: 'izq', largo: 0.52, w: 0.016 },
  { yc: 0.66, desde: 'der', largo: 0.62, w: 0.016 },
  { yc: 0.85, desde: 'ambos', w: 0.015 },
].map((b, i) => ({ w: b.w, d: banda({ ...b, k: K, semilla: 101 + i * 13 }) })));

export const RASCADO = [
  latitudCortada({ yc: -0.65, k: K, semilla: 7, desdeX: -0.1, largo: [0.08, 0.2] }),
  latitudCortada({ yc: -0.43, k: K, semilla: 19, desdeX: 0.18, largo: [0.07, 0.18] }),
  latitudCortada({ yc: 0.19, k: K, semilla: 23, desdeX: 0.05, largo: [0.08, 0.22] }),
  latitudCortada({ yc: 0.755, k: K, semilla: 41, hastaX: 0.2, largo: [0.07, 0.18] }),
].join('');

export const TORMENTA = espiral({ cx: -0.47, cy: -0.14, r: 0.11, vueltas: 1.7, achatado: 0.62, semilla: 5 });

export const SOMBRA = agruparPorGrosor(tramaEsfera({
  luz: 222, lineas: 10, desde: 0.52, hasta: 0.975, afinado: 0.55,
  grosorMin: 0.0095, grosorMax: 0.0095, semilla: 9,
}))[0];

export const CONTORNO = circulo({ r: 1, temblor: 0.004, semilla: 3 });
export const CONTORNO_SOMBRA = elipse({ rx: 0.985, a0: -25, a1: 115, paso: 10, temblor: 0.003, semilla: 8 });

export const CIELO = {
  estrellas: [
    { x: 150, y: 92, r: 20, s: 1 }, { x: 1118, y: 560, r: 17, s: 2 },
    { x: 905, y: 44, r: 11, s: 3 }, { x: 330, y: 652, r: 10, s: 4 },
  ].map((e) => estrella({ cx: e.x, cy: e.y, r: e.r, semilla: e.s, giro: -90 + (e.s % 2 ? 6 : -8) })).join(''),
  titileos: [
    { x: 300, y: 58, r: 9 }, { x: 700, y: 28, r: 7 }, { x: 1180, y: 168, r: 8 },
    { x: 40, y: 330, r: 7 }, { x: 1000, y: 662, r: 8 }, { x: 560, y: 664, r: 6 },
    { x: 1215, y: 392, r: 6 },
  ].map((t, i) => titileo({ cx: t.x, cy: t.y, r: t.r, semilla: 20 + i })).join(''),
  puntos: puntosComoPath([
    { x: 232, y: 182, r: 3 }, { x: 620, y: 70, r: 2.4 }, { x: 1060, y: 118, r: 3 },
    { x: 80, y: 562, r: 2.5 }, { x: 470, y: 640, r: 2 }, { x: 1180, y: 660, r: 2.5 },
    { x: 1240, y: 290, r: 2 }, { x: -20, y: 172, r: 2.5 }, { x: 762, y: 672, r: 2 },
  ]),
};
