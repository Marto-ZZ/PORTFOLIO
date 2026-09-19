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
    // duration es lo que más define si la página "se siente" rápida o pesada:
    // es el tiempo que sigue deslizándose después de soltar la rueda.
    // Medido: 1.1 -> 968ms hasta frenar (se percibe como lag), 0.8 -> 699ms,
    // 0.6 -> 533ms, 0.45 -> 401ms. El scroll nativo ronda los 100-150ms.
    // 0.6 conserva el deslizamiento suave sin que la página se sienta lenta.
    lenis = new Lenis({ duration: 0.6, smoothWheel: true, touchMultiplier: 1.5 });
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
