import {
  titileo, circulo as circuloFino, elipse as elipseFina, rayos, trazo, mancha, placa, puntosComoPath,
} from './doodle.js';

const circulo = (o) => circuloFino({ paso: 24, ...o });
const elipse = (o) => elipseFina({ paso: 24, ...o });
const dos = (v) => (typeof v === 'string'
  ? v.replace(/-?\d+\.\d+/g, (n) => String(Math.round(n * 100) / 100))
  : Array.isArray(v) ? v.map(dos)
    : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, dos(x)])) : v);

const CX = 12, CY = 12, R = 8.3;

export const PLANETITA_ROCOSA = dos({
  trazos: circulo({ cx: 9.6, cy: 9.7, r: 2.4, temblor: 0.05, semilla: 131 })
    + circulo({ cx: 14.9, cy: 13.4, r: 1.7, temblor: 0.05, semilla: 132 })
    + circulo({ cx: 9.2, cy: 15.4, r: 1.1, temblor: 0.05, semilla: 133 }),
  finos: elipse({ cx: 9.8, cy: 9.9, rx: 1.5, a0: 100, a1: 350, paso: 25, temblor: 0 }),
  sombra: true,
});

export const PLANETITA_GASEOSA = dos({
  trazos: trazo([[4.3, 8.4], [9.5, 9.4], [15.8, 8.6]], { semilla: 141 })
    + trazo([[3.8, 11.7], [12, 13.3], [20.2, 11.6]], { semilla: 142 })
    + trazo([[9.4, 16.5], [14.5, 16.9], [19, 15.4]], { semilla: 143 }),
  finos: elipse({ cx: 8.4, cy: 15.2, rx: 1.9, ry: 0.95, temblor: 0, paso: 30 }),
  sombra: true,
});

export const PLANETITA_VOLCANICA = dos({
  trazos: mancha({ cx: 10.8, cy: 12.6, r: 2.3, semilla: 151, irregularidad: 0.2, n: 10 }),
  finos: rayos({ cx: 10.8, cy: 12.6, r0: 3.4, r1: 5, n: 7, semilla: 152, a0: 170, a1: 460 }),
  puntos: puntosComoPath([
    { x: 4.9, y: 4.6, r: 0.75 }, { x: 6.5, y: 3.3, r: 0.8 }, { x: 8.3, y: 2.7, r: 0.7 }, { x: 3.6, y: 6.3, r: 0.65 },
  ]),
  sombra: true,
});

export const PLANETITA_HELADA = dos({
  trazos: trazo([[3.9, 8.6], [11, 11.8], [20.2, 15.2]], { semilla: 161 }),
  finos: trazo([[4.3, 10.3], [11, 13.4], [19.4, 16.8]], { semilla: 162 })
    + titileo({ cx: 9.2, cy: 6.9, r: 1.7, semilla: 163 })
    + placa({ cx: 14.8, cy: 7.1, r: 1.6, lados: 5, semilla: 164 }),
  sombra: true,
});

export const PLANETITA_CONTINENTES = dos({
  trazos: mancha({ cx: 8.4, cy: 9, r: 3.4, semilla: 171, irregularidad: 0.3, n: 12 })
    + mancha({ cx: 15.6, cy: 15.4, r: 2.7, semilla: 172, irregularidad: 0.3, n: 12 }),
  sombra: false,
});

export const COHETE = dos({
  cuerpo: 'M12 2.8C14.9 4.9 15.95 8.4 15.6 12.6L15.25 16.3L8.75 16.3L8.4 12.6C8.05 8.4 9.1 4.9 12 2.8Z',
  ventana: circulo({ cx: 12, cy: 9.3, r: 1.9, temblor: 0.04, semilla: 91 }),
  aletas: 'M8.55 12.6L6.1 15.1L6.35 17.7L8.8 16.25M15.45 12.6L17.9 15.1L17.65 17.7L15.2 16.25',
});

export const DISCO = dos(circulo({ cx: CX, cy: CY, r: R, temblor: 0.012, semilla: 121 }));

