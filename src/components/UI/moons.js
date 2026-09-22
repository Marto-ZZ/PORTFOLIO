/* Geometría de las lunas, compartida entre el hero y las secciones.

   El guion del portfolio es: Martín es el planeta y cada sección es una luna
   que lo orbita. Para que eso se lea, la luna que ves girando en el hero tiene
   que ser LA MISMA que te recibe cuando llegás a la sección. Por eso la forma
   vive acá y no duplicada en cada componente: si se toca un cráter, se toca en
   los dos lados a la vez. */

// Cráteres en coordenadas unitarias (-1..1 = borde de la luna).
// Se mantienen dentro de |pos| + r < 0.95 para no necesitar recorte.
export const CRATERS = [
  { x: -0.30, y: -0.34, r: 0.21 },
  { x:  0.26, y: -0.08, r: 0.15 },
  { x: -0.08, y:  0.34, r: 0.25 },
  { x:  0.44, y:  0.32, r: 0.13 },
  { x: -0.54, y:  0.14, r: 0.12 },
  { x:  0.10, y: -0.52, r: 0.11 },
];

// Bandas de la gigante gaseosa (posición en Y, unitaria).
export const BANDAS = [-0.62, -0.34, -0.06, 0.22, 0.52];

// Fracturas de la luna volcánica: líneas quebradas, no círculos, para que se
// distinga de un vistazo de la rocosa.
export const FRACTURAS = [
  'M -0.72 -0.18 L -0.3 -0.32 L 0.02 -0.05 L 0.38 -0.2 L 0.68 0.02',
  'M -0.45 0.5 L -0.16 0.22 L 0.16 0.38 L 0.52 0.2',
  'M -0.05 -0.6 L 0.06 -0.3 L -0.12 0.02',
];

// Manchas de la luna helada.
export const HIELO = [
  { cx: -0.2, cy: -0.3, rx: 0.55, ry: 0.34 },
  { cx: 0.3, cy: 0.4, rx: 0.42, ry: 0.26 },
];

/* Qué luna le toca a cada sección. Es la fuente de verdad del guion: el hero
   la usa para las órbitas y las secciones para su encabezado y su fondo. */
export const LUNAS = {
  'sobre-mi': { tone: 'rocosa', patron: 'crateres' },
  'skills': { tone: 'gaseosa', patron: 'bandas' },
  'proyectos': { tone: 'volcanica', patron: 'orbitas' },
  'contacto': { tone: 'helada', patron: 'senal' },
};
