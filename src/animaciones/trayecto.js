import { aterrizar } from './viaje.js';

const root = document.documentElement;
const animOn = () => root.getAttribute('data-anim') !== 'off';
const saltando = () => 'saltando' in root.dataset;

export function iniciarTrayecto() {
  const riel = document.getElementById('trayecto');
  const barra = document.getElementById('trayectoBarra');
  if (!riel) return;

  let desde = 0, hasta = 1, visible = null, avance = -1, aviso = 0;

  const medir = () => {
    const primera = document.getElementById('sobre-mi');
    desde = primera ? primera.getBoundingClientRect().top + scrollY - innerHeight * 0.5 : 0;
    hasta = Math.max(desde + 1, document.documentElement.scrollHeight - innerHeight);
  };

  const pintar = (y) => {
    const v = y > desde;
    if (v !== visible) {
      visible = v;
      riel.classList.toggle('en-viaje', v);
      barra?.classList.toggle('en-viaje', v);
    }
    const a = Math.round(Math.min(1, Math.max(0, (y - desde) / (hasta - desde))) * 1000) / 1000;
    if (a !== avance) {
      avance = a;
      riel.style.setProperty('--avance', a);
      barra?.style.setProperty('--avance', a);
    }
  };

  new ResizeObserver(() => { medir(); pintar(scrollY); }).observe(document.body);

  let raf = 0;
  addEventListener('scroll', () => {
    if (raf) return;
    raf = requestAnimationFrame(() => { raf = 0; pintar(scrollY); });
  }, { passive: true });

  let actual = null;
  const llegada = (id, seccion) => {
    document.querySelectorAll('.nav-links a, .nav-mobile a, .trayecto a').forEach((a) => {
      const es = a.getAttribute('href') === `#${id}`;
      a.classList.toggle('active', es);
      if (es) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    });
    riel.querySelectorAll('a.llega').forEach((x) => x.classList.remove('llega'));
    clearTimeout(aviso);
    if (!animOn()) return;
    const a = riel.querySelector(`a[href="#${id}"]`);
    if (a) {
      a.classList.add('llega');
      aviso = setTimeout(() => a.classList.remove('llega'), 1800);
    }
    if (!saltando()) aterrizar(seccion);
  };

  const io = new IntersectionObserver((entradas) => {
    for (const e of entradas) {
      if (!e.isIntersecting || e.target.id === actual) continue;
      const primera = actual === null;
      actual = e.target.id;
      if (primera) {
        riel.querySelectorAll('a').forEach((a) => a.classList.toggle('active', a.getAttribute('href') === `#${actual}`));
      } else {
        llegada(actual, e.target);
      }
    }
  }, { rootMargin: '-45% 0px -45% 0px' });
  ['inicio', 'sobre-mi', 'skills', 'proyectos', 'contacto'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) io.observe(el);
  });
}
