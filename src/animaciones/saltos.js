import { viajar as viajarEntreLunas, aterrizar } from './viaje.js';
import { mostrarTodas } from './secciones.js';

const root = document.documentElement;
const lenis = () => window.__lenis;

let enCurso = null;
let finSalto = 0;

const buscar = (id) => (id ? document.getElementById(id) : null);

function enfocar(target) {
  const el = target.querySelector('h2') || target;
  if (!el.hasAttribute('tabindex') && !el.matches('a, button, input, textarea, select')) el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
}

function seccionEn(y) {
  const medio = y + innerHeight * 0.5;
  let elegida = null;
  for (const s of document.querySelectorAll('section[id]')) {
    const top = s.getBoundingClientRect().top + scrollY;
    if (top <= medio) elegida = s;
  }
  return elegida;
}

function marcarSalto() {
  root.dataset.saltando = '';
  clearTimeout(finSalto);
}
function terminarSalto(demora = 120) {
  clearTimeout(finSalto);
  finSalto = setTimeout(() => {
    delete root.dataset.saltando;
    document.getElementById('nav')?.classList.remove('hidden');
  }, demora);
}

const frame = () => new Promise((r) => requestAnimationFrame(r));

async function llegarExacto(target, y) {
  if (mostrarTodas()) {
    await frame();
    await frame();
  }
  const posicion = () => (target ? target.getBoundingClientRect().top + scrollY : y);
  scrollTo({ top: posicion(), behavior: 'instant' });
  if (target) {
    let quieto = 0;
    for (let i = 0; i < 20 && quieto < 3; i++) {
      await frame();
      if (Math.abs(target.getBoundingClientRect().top) < 2) { quieto++; continue; }
      quieto = 0;
      scrollTo({ top: posicion(), behavior: 'instant' });
    }
  }
  lenis()?.resize?.();
}

function ir({ target, y, origen, foco = true }) {
  enCurso?.cortar();
  enCurso = null;
  const l = lenis();
  const destinoY = target ? target.getBoundingClientRect().top + scrollY : y;
  const destino = target || seccionEn(destinoY);

  if (!l) {
    llegarExacto(target, destinoY).then(() => { if (target && foco) enfocar(target); });
    return;
  }

  marcarSalto();
  const distancia = Math.abs(destinoY - scrollY);
  const planeta = destino?.matches('section[id]');

  if (planeta && distancia < 60) {
    aterrizar(destino, { completo: true });
    terminarSalto(0);
  } else if (planeta) {
    const viaje = viajarEntreLunas({
      origen, destino, direccion: destinoY > scrollY ? 1 : -1,
      saltar: async () => {
        await llegarExacto(target, destinoY);
        if (target && foco) enfocar(target);
      },
    });
    enCurso = viaje;
    viaje.terminado.finally(() => {
      if (enCurso !== viaje) return;
      enCurso = null;
      terminarSalto();
    });
    return;
  } else {
    l.scrollTo(target || destinoY, { onComplete: () => terminarSalto() });
    terminarSalto(1500);
  }
  if (target && foco) enfocar(target);
}

export function iniciarSaltos() {
  const url = () => location.pathname + location.search;

  if (location.hash) {
    const target = buscar(decodeURIComponent(location.hash.slice(1)));
    history.replaceState({ seccion: target?.id ?? null }, '', url());
    if (target) {
      requestAnimationFrame(() => llegarExacto(target));
    }
  }

  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = decodeURIComponent(a.getAttribute('href').slice(1));
    const target = buscar(id);
    if (!target) return;
    e.preventDefault();

    history.replaceState({ ...history.state, y: scrollY }, '', url());
    history.pushState({ seccion: id }, '', url());

    let origen = { x: e.clientX, y: e.clientY };
    if (!e.detail) {
      const r = a.getBoundingClientRect();
      origen = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }
    ir({ target, origen });
  }, true);

  addEventListener('popstate', (e) => {
    const s = e.state || {};
    if (typeof s.y === 'number') ir({ y: s.y, foco: false });
    else if (s.seccion && buscar(s.seccion)) ir({ target: buscar(s.seccion) });
    else ir({ y: 0, foco: false });
  });
}
