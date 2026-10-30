import './viaje.css';

const T_IDA = 300;
const T_VUELTA = 420;

let capa = null;

function armarCapa() {
  if (capa) return capa;
  capa = document.createElement('div');
  capa.className = 'viaje';
  capa.setAttribute('aria-hidden', 'true');
  capa.innerHTML = '<div class="viaje-velo"></div><div class="viaje-estelas"></div><div class="viaje-portal"></div>';
  const estelas = capa.querySelector('.viaje-estelas');
  let s = 7;
  const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 26; i++) {
    const e = document.createElement('span');
    e.style.left = `${(r() * 100).toFixed(1)}%`;
    e.style.height = `${(10 + r() * 26).toFixed(1)}vh`;
    e.dataset.velocidad = (0.22 + r() * 0.26).toFixed(2);
    e.dataset.fase = r().toFixed(2);
    if (r() < 0.4) e.classList.add('de-color');
    estelas.appendChild(e);
  }
  document.body.appendChild(capa);
  return capa;
}

export function aterrizar(seccion, { completo = false } = {}) {
  const head = seccion?.querySelector('.section-head');
  const luna = head?.querySelector('.section-moon');
  if (!luna) return;
  const h = head.getBoundingClientRect();
  const l = luna.getBoundingClientRect();
  if (l.bottom < 0 || l.top > innerHeight) return;
  const cx = l.left - h.left + l.width / 2;
  const cy = l.top - h.top + l.height / 2;
  const anillos = completo ? [0, 180] : [0];
  for (const retraso of anillos) {
    const a = document.createElement('span');
    a.className = 'aterrizaje-anillo';
    a.style.left = `${cx}px`;
    a.style.top = `${cy}px`;
    a.style.width = a.style.height = `${l.width}px`;
    head.appendChild(a);
    a.animate([
      { transform: 'translate(-50%, -50%) scale(0.75)', opacity: 0.85 },
      { transform: 'translate(-50%, -50%) scale(2.7)', opacity: 0 },
    ], { duration: 1100, delay: retraso, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'backwards' })
      .finished.then(() => a.remove(), () => a.remove());
  }
  if (completo) {
    luna.animate([
      { transform: 'scale(1.45) rotate(-24deg)', opacity: 0.4 },
      { transform: 'scale(0.94) rotate(3deg)', opacity: 1, offset: 0.62 },
      { transform: 'none', opacity: 1 },
    ], { duration: 820, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
  }
}

const dosFrames = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

export function viajar({ origen, destino, direccion, saltar }) {
  const c = armarCapa();
  const color = getComputedStyle(destino).getPropertyValue('--sx').trim() || '#8b7cf6';
  const vw = innerWidth, vh = innerHeight;
  const o = origen || { x: vw / 2, y: vh / 2 };
  const alcance = Math.hypot(Math.max(o.x, vw - o.x), Math.max(o.y, vh - o.y));
  const TOTAL = T_IDA + T_VUELTA;

  c.style.setProperty('--c', color);
  c.style.setProperty('--ox', `${o.x}px`);
  c.style.setProperty('--oy', `${o.y}px`);
  c.style.setProperty('--alcance', `${alcance}px`);
  c.classList.add('activa');
  const anims = [];
  const animar = (el, k, op) => { const a = el.animate(k, op); anims.push(a); return a; };

  const velo = c.querySelector('.viaje-velo');
  const cubrir = animar(velo, [{ opacity: 0 }, { opacity: 1 }], { duration: T_IDA, easing: 'cubic-bezier(0.5, 0, 0.75, 0)', fill: 'forwards' });

  const portal = c.querySelector('.viaje-portal');
  portal.replaceChildren();
  const icono = document.querySelector(`#trayecto a[href="#${destino.id}"] svg`);
  if (icono) {
    const copia = icono.cloneNode(true);
    copia.removeAttribute('width');
    copia.removeAttribute('height');
    copia.querySelectorAll('[id]').forEach((el) => {
      const viejo = el.id, nuevo = `viaje-${viejo}`;
      el.id = nuevo;
      copia.querySelectorAll(`[clip-path="url(#${viejo})"]`).forEach((u) => u.setAttribute('clip-path', `url(#${nuevo})`));
    });
    portal.appendChild(copia);
    portal.style.left = `${o.x}px`;
    portal.style.top = `${o.y}px`;
    const inicio = 22 / 240, fin = (alcance * 1.6) / 240;
    animar(portal, [
      { transform: `translate(-50%, -50%) scale(${inicio}) rotate(0deg)`, opacity: 1 },
      { transform: `translate(-50%, -50%) scale(${inicio * 1.5}) rotate(-6deg)`, opacity: 1, offset: 0.25 },
      { transform: `translate(-50%, -50%) scale(${fin}) rotate(-30deg)`, opacity: 0 },
    ], { duration: T_IDA + 160, easing: 'cubic-bezier(0.55, 0, 0.9, 0.3)', fill: 'forwards' });
  }

  const estelas = c.querySelector('.viaje-estelas');
  animar(estelas, [
    { opacity: 0 }, { opacity: 1, offset: 0.3 }, { opacity: 1, offset: 0.55 }, { opacity: 0 },
  ], { duration: TOTAL, easing: 'ease-in-out', fill: 'both' });
  const desde = direccion > 0 ? '115vh' : '-45vh';
  const hasta = direccion > 0 ? '-45vh' : '115vh';
  for (const e of estelas.children) {
    const v = parseFloat(e.dataset.velocidad) * 1000;
    animar(e, [
      { transform: `translateY(${desde}) scaleY(0.4)` },
      { transform: `translateY(${hasta}) scaleY(1)` },
    ], { duration: v, delay: -parseFloat(e.dataset.fase) * v, iterations: Infinity, easing: 'linear' });
  }

  let cortado = false;
  const limpiar = () => {
    anims.forEach((a) => a.cancel());
    anims.length = 0;
    c.classList.remove('activa');
  };

  const terminado = (async () => {
    try { await cubrir.finished; } catch { return; }
    if (cortado) return;
    await saltar();
    await dosFrames();
    if (cortado) return;
    aterrizar(destino, { completo: true });
    const abrir = animar(velo, [{ opacity: 1 }, { opacity: 0 }], { duration: T_VUELTA, easing: 'cubic-bezier(0.25, 1, 0.5, 1)', fill: 'forwards' });
    try { await abrir.finished; } catch { return; }
    limpiar();
  })();

  return {
    terminado,
    cortar() {
      if (cortado) return;
      cortado = true;
      limpiar();
    },
  };
}
