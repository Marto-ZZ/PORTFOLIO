import Lenis from 'lenis';

// Smooth scroll "premium" (estilo Awwwards) con Lenis. Respeta el toggle de
// animaciones del panel de ajustes (data-anim) y prefers-reduced-motion, que
// ya se refleja en data-anim desde el script anti-flash del <head>.
export function initSmoothScroll() {
  const root = document.documentElement;
  let lenis = null;
  let raf = 0;

  function start() {
    if (lenis) return;
    lenis = new Lenis({ duration: 1.1, smoothWheel: true, touchMultiplier: 1.5 });
    window.__lenis = lenis;
    const loop = (t) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
  }
  function stop() {
    if (!lenis) return;
    cancelAnimationFrame(raf); raf = 0;
    lenis.destroy();
    lenis = null;
    window.__lenis = null;
  }
  function sync() {
    if (root.getAttribute('data-anim') !== 'off') start();
    else stop();
  }

  // Los enlaces internos (#seccion) usan el scroll suave de Lenis cuando está activo.
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || !lenis) return;
    const href = a.getAttribute('href');
    if (href.length < 2) return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target);
  });

  sync();
  new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ['data-anim'] });
}
