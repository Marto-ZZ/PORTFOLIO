import { rng } from './sketch.js';

const p = (n) => Math.round(n * 1000) / 1000;
const rad = (g) => (g * Math.PI) / 180;

function ruido(semilla, { amp = 1, armonicos = 3, periodica = false } = {}) {
  const r = rng(semilla);
  const f = new Float64Array(armonicos), fase = new Float64Array(armonicos), a = new Float64Array(armonicos);
  for (let i = 0; i < armonicos; i++) {
    f[i] = 2 * Math.PI * (periodica ? 2 + i + Math.floor(r() * 2) : (i + 1) * (0.8 + r() * 0.9));
    fase[i] = r() * Math.PI * 2;
    a[i] = amp / Math.pow(i + 1, 1.2);
  }
  if (!amp) return () => 0;
  return (t) => {
    let s = 0;
    for (let i = 0; i < armonicos; i++) s += a[i] * Math.sin(f[i] * t + fase[i]);
    return s;
  };
}

function suave(pts, cerrada = false) {
  const n = pts.length;
  if (n < 2) return '';
  const g = (i) => (cerrada ? pts[((i % n) + n) % n] : pts[Math.min(Math.max(i, 0), n - 1)]);
  let d = `M${p(pts[0][0])} ${p(pts[0][1])}`;
  const segs = cerrada ? n : n - 1;
  for (let i = 0; i < segs; i++) {
    const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2);
    d += `C${p(p1[0] + (p2[0] - p0[0]) / 6)} ${p(p1[1] + (p2[1] - p0[1]) / 6)} `
      + `${p(p2[0] - (p3[0] - p1[0]) / 6)} ${p(p2[1] - (p3[1] - p1[1]) / 6)} `
      + `${p(p2[0])} ${p(p2[1])}`;
  }
  return cerrada ? `${d}Z` : d;
}

export function elipse({
  cx = 0, cy = 0, rx = 1, ry = rx, giro = 0, a0 = 0, a1 = 360,
  temblor = 0.008, semilla = 1, paso = 12,
} = {}) {
  const completa = Math.abs(a1 - a0) >= 360;
  const cg = Math.cos(rad(giro)), sg = Math.sin(rad(giro));

  if (!temblor) {
    const punto = (a) => {
      const x = rx * Math.cos(rad(a)), y = ry * Math.sin(rad(a));
      return `${p(cx + x * cg - y * sg)} ${p(cy + x * sg + y * cg)}`;
    };
    const arcoA = (hasta, largo) => `A${p(rx)} ${p(ry)} ${p(giro)} ${largo} ${a1 >= a0 ? 1 : 0} ${punto(hasta)}`;
    if (completa) return `M${punto(a0)}${arcoA(a0 + 180, 0)}${arcoA(a0, 0)}Z`;
    return `M${punto(a0)}${arcoA(a1, Math.abs(a1 - a0) > 180 ? 1 : 0)}`;
  }

  const f = ruido(semilla, { amp: temblor, periodica: true });
  const n = Math.max(3, Math.round(Math.abs(a1 - a0) / paso));
  const pts = [];
  for (let i = 0; i < (completa ? n : n + 1); i++) {
    const a = a0 + ((a1 - a0) * i) / n;
    const k = 1 + f((((a % 360) + 360) % 360) / 360);
    const x = rx * k * Math.cos(rad(a)), y = ry * k * Math.sin(rad(a));
    pts.push([cx + x * cg - y * sg, cy + x * sg + y * cg]);
  }
  return suave(pts, completa);
}

export function circulo({ r = 1, ...resto } = {}) {
  return elipse({ rx: r, ry: r, ...resto });
}

export function estrella({
  cx = 0, cy = 0, r = 1, puntas = 5, interior = 0.46, giro = -90,
  semilla = 1, desorden = 0.06, punta = 0.16, valle = 0.2, comba = 0.08,
} = {}) {
  const rand = rng(semilla);
  const J = (m) => (rand() - 0.5) * 2 * m;
  const v = [];
  for (let i = 0; i < puntas * 2; i++) {
    const esPunta = i % 2 === 0;
    const a = rad(giro + (i * 180) / puntas + J(desorden * 30));
    const rr = r * (esPunta ? 1 + J(desorden) : interior * (1 + J(desorden)));
    v.push({ x: cx + rr * Math.cos(a), y: cy + rr * Math.sin(a), esPunta });
  }
  const N = v.length;
  const hacia = (A, B, t) => [A.x + (B.x - A.x) * t, A.y + (B.y - A.y) * t];
  const entra = [], sale = [];
  for (let i = 0; i < N; i++) {
    const t = v[i].esPunta ? punta : valle;
    entra.push(hacia(v[i], v[(i - 1 + N) % N], t));
    sale.push(hacia(v[i], v[(i + 1) % N], t));
  }
  let d = `M${p(entra[0][0])} ${p(entra[0][1])}`;
  for (let i = 0; i < N; i++) {
    d += `Q${p(v[i].x)} ${p(v[i].y)} ${p(sale[i][0])} ${p(sale[i][1])}`;
    const sig = entra[(i + 1) % N];
    const mx = (sale[i][0] + sig[0]) / 2, my = (sale[i][1] + sig[1]) / 2;
    d += `Q${p(mx + (cx - mx) * comba)} ${p(my + (cy - my) * comba)} ${p(sig[0])} ${p(sig[1])}`;
  }
  return `${d}Z`;
}

export function rayos({
  cx = 0, cy = 0, r0 = 1.15, r1 = 1.55, n = 16, semilla = 1,
  variacion = 0.45, a0 = 0, a1 = 360, desorden = 0.3,
} = {}) {
  const rand = rng(semilla);
  const completa = Math.abs(a1 - a0) >= 360;
  let d = '';
  for (let i = 0; i < n; i++) {
    const t = completa ? (i + (rand() - 0.5) * desorden) / n : (i + 0.5 + (rand() - 0.5) * desorden) / n;
    const a = rad(a0 + (a1 - a0) * t);
    const l0 = r0 * (1 + (rand() - 0.5) * 0.08);
    const l1 = r0 + (r1 - r0) * (1 - rand() * variacion);
    d += `M${p(cx + l0 * Math.cos(a))} ${p(cy + l0 * Math.sin(a))}`
      + `L${p(cx + l1 * Math.cos(a))} ${p(cy + l1 * Math.sin(a))}`;
  }
  return d;
}

export function espiral({
  cx = 0, cy = 0, r = 1, vueltas = 1.6, giro = 0, achatado = 1,
  sentido = 1, semilla = 1, temblor = 0.05,
} = {}) {
  const f = ruido(semilla, { amp: temblor });
  const n = Math.max(8, Math.round(vueltas * 14));
  const cg = Math.cos(rad(giro)), sg = Math.sin(rad(giro));
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const a = sentido * t * vueltas * 2 * Math.PI;
    const rr = r * (0.1 + 0.9 * t) * (1 + f(t));
    const x = rr * Math.cos(a), y = rr * Math.sin(a) * achatado;
    pts.push([cx + x * cg - y * sg, cy + x * sg + y * cg]);
  }
  return suave(pts);
}

export function mancha({
  cx = 0, cy = 0, r = 1, semilla = 1, irregularidad = 0.22,
  n = 14, achatado = 1, giro = 0,
} = {}) {
  const f = ruido(semilla, { amp: irregularidad, periodica: true, armonicos: 3 });
  const cg = Math.cos(rad(giro)), sg = Math.sin(rad(giro));
  const pts = [];
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const a = t * 2 * Math.PI;
    const rr = r * (1 + f(t));
    const x = rr * Math.cos(a), y = rr * Math.sin(a) * achatado;
    pts.push([cx + x * cg - y * sg, cy + x * sg + y * cg]);
  }
  return suave(pts, true);
}

export function placa({ cx = 0, cy = 0, r = 1, lados = 5, semilla = 1, desorden = 0.3, giro = 0 } = {}) {
  const rand = rng(semilla);
  let d = '';
  for (let i = 0; i < lados; i++) {
    const a = rad(giro + (360 * (i + (rand() - 0.5) * desorden)) / lados);
    const rr = r * (1 + (rand() - 0.5) * desorden);
    d += `${i ? 'L' : 'M'}${p(cx + rr * Math.cos(a))} ${p(cy + rr * Math.sin(a))}`;
  }
  return `${d}Z`;
}

export function trazo(puntos, { semilla = 1, temblor = 0 } = {}) {
  if (!temblor) return suave(puntos);
  const rand = rng(semilla);
  return suave(puntos.map(([x, y], i) => (
    i === 0 || i === puntos.length - 1
      ? [x, y]
      : [x + (rand() - 0.5) * temblor, y + (rand() - 0.5) * temblor]
  )));
}

export function puntadas(puntos, { cada = 0.12, largo = 0.07, semilla = 1, desde = 0.1, hasta = 0.9 } = {}) {
  const rand = rng(semilla);
  const tramos = [];
  let total = 0;
  for (let i = 1; i < puntos.length; i++) {
    const [ax, ay] = puntos[i - 1], [bx, by] = puntos[i];
    const l = Math.hypot(bx - ax, by - ay);
    tramos.push({ ax, ay, bx, by, l, desde: total });
    total += l;
  }
  let d = '';
  for (let s = total * desde; s <= total * hasta; s += cada * (0.75 + rand() * 0.5)) {
    const t = tramos.find((q) => s <= q.desde + q.l) || tramos[tramos.length - 1];
    const u = (s - t.desde) / t.l;
    const x = t.ax + (t.bx - t.ax) * u, y = t.ay + (t.by - t.ay) * u;
    const nx = -(t.by - t.ay) / t.l, ny = (t.bx - t.ax) / t.l;
    const l = largo * (0.7 + rand() * 0.6);
    d += `M${p(x - nx * l)} ${p(y - ny * l)}L${p(x + nx * l)} ${p(y + ny * l)}`;
  }
  return d;
}

function latitud(yc, k = 0.33, r = 1) {
  const h = (k * yc + Math.sqrt(r * r * (1 + k * k) - yc * yc)) / (1 + k * k);
  const base = yc - k * h;
  return { h, y: (x) => base + k * Math.sqrt(Math.max(h * h - x * x, 0)) };
}

export function banda({ yc, k = 0.33, desde = 'izq', largo = 1, gancho = 0, semilla = 1, temblor = 0.01, margen = 0.985 }) {
  const { h, y } = latitud(yc, k);
  const hh = h * margen;
  let x0, x1;
  if (desde === 'der') { x1 = hh; x0 = hh - 2 * hh * largo; }
  else if (desde === 'ambos') { x0 = -hh; x1 = hh; }
  else { x0 = -hh; x1 = -hh + 2 * hh * largo; }
  const f = ruido(semilla, { amp: temblor });
  const n = Math.max(4, Math.round(Math.abs(x1 - x0) / 0.12));
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const x = x0 + ((x1 - x0) * i) / n;
    pts.push([x, y(x) + f(i / n)]);
  }
  if (gancho) {
    const sentido = desde === 'der' ? -1 : 1;
    const [ex, ey] = desde === 'der' ? pts[0] : pts[pts.length - 1];
    const cxg = ex, cyg = ey - gancho;
    const rulo = [];
    for (let i = 1, a = 90 - 35; a >= -125; a -= 35, i++) {
      const g = gancho * (1 - 0.07 * i);
      rulo.push([cxg + sentido * g * Math.cos(rad(a)), cyg + g * Math.sin(rad(a))]);
    }
    if (desde === 'der') return suave([...rulo.reverse(), ...pts]);
    return suave([...pts, ...rulo]);
  }
  return suave(pts);
}

export function latitudCortada({ yc, k = 0.33, semilla = 1, largo = [0.1, 0.28], hueco = [0.05, 0.16], margen = 0.9, desdeX = null, hastaX = null }) {
  const rand = rng(semilla);
  const { h, y } = latitud(yc, k);
  let x = desdeX ?? -h * margen;
  const fin = hastaX ?? h * margen;
  x += rand() * hueco[1];
  let d = '';
  while (x < fin) {
    const l = largo[0] + rand() * (largo[1] - largo[0]);
    const xe = Math.min(x + l, fin);
    const xm = (x + xe) / 2;
    d += `M${p(x)} ${p(y(x))}Q${p(xm)} ${p(2 * y(xm) - (y(x) + y(xe)) / 2)} ${p(xe)} ${p(y(xe))}`;
    x = xe + hueco[0] + rand() * (hueco[1] - hueco[0]);
  }
  return d;
}

export function agruparPorGrosor(trazos) {
  const por = new Map();
  for (const { d, w } of trazos) {
    if (!d) continue;
    por.set(w, (por.get(w) || '') + d);
  }
  return [...por].map(([w, d]) => ({ w, d }));
}

export function puntosComoPath(puntos) {
  return puntos.map(({ x, y, r }) => (
    `M${p(x - r)} ${p(y)}a${p(r)} ${p(r)} 0 1 0 ${p(2 * r)} 0a${p(r)} ${p(r)} 0 1 0 ${p(-2 * r)} 0Z`
  )).join('');
}

export function titileo({ cx = 0, cy = 0, r = 1, semilla = 1 } = {}) {
  const rand = rng(semilla);
  const J = () => (rand() - 0.5) * 0.12 * r;
  return `M${p(cx + J())} ${p(cy - r)}L${p(cx + J())} ${p(cy + r)}`
    + `M${p(cx - r)} ${p(cy + J())}L${p(cx + r)} ${p(cy + J())}`;
}
