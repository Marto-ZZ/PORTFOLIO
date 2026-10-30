export function rng(seed) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const p = (n) => Math.round(n * 10000) / 10000;

export function arco(cx, cy, r, a0, a1) {
  const rad = (a) => (a * Math.PI) / 180;
  const x0 = cx + r * Math.cos(rad(a0)), y0 = cy + r * Math.sin(rad(a0));
  const x1 = cx + r * Math.cos(rad(a1)), y1 = cy + r * Math.sin(rad(a1));
  const largo = Math.abs(a1 - a0) > 180 ? 1 : 0;
  const sweep = a1 > a0 ? 1 : 0;
  return `M ${p(x0)} ${p(y0)} A ${r} ${r} 0 ${largo} ${sweep} ${p(x1)} ${p(y1)}`;
}

export function tramaEsfera({
  r = 1, luz = 225, lineas = 11, desde = 0.12, hasta = 0.9,
  grosorMin = 0.014, grosorMax = 0.038, semilla = 7, afinado = 0,
} = {}) {
  const rand = rng(semilla);
  const a = ((luz + 180) * Math.PI) / 180;
  const ux = Math.cos(a), uy = Math.sin(a);
  const px = -uy, py = ux;
  const out = [];

  for (let i = 0; i < lineas; i++) {
    const t = i / (lineas - 1);
    const d = (desde + (hasta - desde) * Math.pow(t, 0.88)) * r;
    const h = Math.sqrt(Math.max(r * r - d * d, 0));
    if (h < 0.06 * r) continue;

    const forma = 1 - afinado * (1 - Math.pow(t, 0.7));

    const recorte0 = (0.9 + rand() * 0.12) * forma;
    const recorte1 = (0.9 + rand() * 0.12) * forma;
    const cx = d * ux, cy = d * uy;

    const giro = (rand() - 0.5) * 0.105;
    const gx = px * Math.cos(giro) - py * Math.sin(giro);
    const gy = px * Math.sin(giro) + py * Math.cos(giro);

    const x0 = cx + h * gx * recorte0, y0 = cy + h * gy * recorte0;
    const x1 = cx - h * gx * recorte1, y1 = cy - h * gy * recorte1;

    const arqueo = (0.26 - 0.2 * t) * h;
    const qx = cx + ux * arqueo, qy = cy + uy * arqueo;

    out.push({
      d: `M ${p(x0)} ${p(y0)} Q ${p(qx)} ${p(qy)} ${p(x1)} ${p(y1)}`,
      w: p(grosorMin + (grosorMax - grosorMin) * Math.pow(t, 1.3)),
      o: p(0.28 + 0.6 * Math.pow(t, 0.8)),
    });
  }
  return out;
}

export function crater({ cx, cy, r, luz = 225, semilla = 3 }) {
  const rand = rng(semilla);
  const jitter = (m) => (rand() - 0.5) * m;
  const aLuz = luz;
  const partes = [];

  partes.push({
    d: arco(cx, cy, r, aLuz - 78 + jitter(14), aLuz + 78 + jitter(14)),
    w: 0.034, o: 0.85,
  });
  partes.push({
    d: arco(cx, cy, r * (1 + jitter(0.05)), aLuz + 108 + jitter(12), aLuz + 232 + jitter(12)),
    w: 0.017, o: 0.45,
  });
  if (r > 0.13) {
    const ax = Math.cos((aLuz * Math.PI) / 180), ay = Math.sin((aLuz * Math.PI) / 180);
    for (let i = 0; i < 2; i++) {
      const f = 0.32 + i * 0.26;
      partes.push({
        d: `M ${p(cx + ax * r * f - ay * r * 0.42)} ${p(cy + ay * r * f + ax * r * 0.42)}`
          + ` L ${p(cx + ax * r * f + ay * r * 0.42)} ${p(cy + ay * r * f - ax * r * 0.42)}`,
        w: 0.016, o: 0.4,
      });
    }
  }
  return partes;
}

export function trazoPresion({
  x0, x1, fy, segmentos = 13, grosorMin = 0.5, grosorMax = 3.4,
  temblor = 0, semilla = 5,
} = {}) {
  const rand = rng(semilla);
  const paso = (x1 - x0) / segmentos;
  const out = [];

  for (let i = 0; i < segmentos; i++) {
    const a = x0 + i * paso;
    const b = a + paso * 1.15;
    const m = (a + b) / 2;
    const cy = 2 * fy(m) - (fy(a) + fy(b)) / 2 + (rand() - 0.5) * temblor;
    const t = (i + 0.5) / segmentos;
    const presion = Math.sin(Math.PI * t);
    out.push({
      d: `M ${p(a)} ${p(fy(a))} Q ${p(m)} ${p(cy)} ${p(b)} ${p(fy(b))}`,
      w: p(grosorMin + grosorMax * Math.pow(presion, 1.3)),
      o: p(0.22 + 0.78 * presion),
    });
  }
  return out;
}
