import { useEffect, useRef } from 'react';
import '../components/MyComponents/ScrollVelocity.css';

const root = document.documentElement;
const animOn = () => root.getAttribute('data-anim') !== 'off';

function Fila({ children, baseVelocity, numCopies, className, parallaxClassName, scrollerClassName, parallaxStyle, scrollerStyle, velocityMapping }) {
  const parallaxRef = useRef(null);
  const scrollerRef = useRef(null);
  const copiaRef = useRef(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const copia = copiaRef.current;
    if (!scroller || !copia) return;

    let anim = null;
    let enVista = false;

    const armar = () => {
      const ancho = copia.offsetWidth;
      if (!ancho) return;
      const t = anim ? anim.currentTime : 0;
      anim?.cancel();
      const desde = baseVelocity >= 0 ? -ancho : 0;
      const hasta = baseVelocity >= 0 ? 0 : -ancho;
      const duracion = (ancho / Math.max(1, Math.abs(baseVelocity))) * 1000;
      anim = scroller.animate(
        [{ transform: `translateX(${desde}px)` }, { transform: `translateX(${hasta}px)` }],
        { duration: duracion, iterations: Infinity, easing: 'linear' },
      );
      anim.currentTime = t || duracion * 1000;
      sincronizar();
    };
    const sincronizar = () => {
      if (!anim) return;
      if (enVista && animOn()) anim.play();
      else anim.pause();
    };

    const [vMin, vMax] = velocityMapping?.input || [0, 1000];
    const [fMin, fMax] = velocityMapping?.output || [0, 5];
    let ultimaY = scrollY, ultimaT = performance.now();
    let factor = 0, sentido = 1, raf = 0, ultimoFrame = 0;
    const aplicar = () => { if (anim) anim.playbackRate = sentido * (1 + factor); };
    const decaer = (ahora) => {
      const dt = (ahora - ultimoFrame) / 1000;
      ultimoFrame = ahora;
      factor *= Math.exp(-dt / 0.25);
      if (factor < 0.02) { factor = 0; raf = 0; aplicar(); return; }
      aplicar();
      raf = requestAnimationFrame(decaer);
    };
    const alScrollear = () => {
      if (!enVista || !anim) return;
      const ahora = performance.now();
      const dt = Math.max(1, ahora - ultimaT) / 1000;
      const v = (scrollY - ultimaY) / dt;
      ultimaY = scrollY; ultimaT = ahora;
      if (v !== 0) sentido = v > 0 ? 1 : -1;
      const f = fMin + ((Math.abs(v) - vMin) / (vMax - vMin)) * (fMax - fMin);
      factor = Math.max(factor * 0.6, Math.min(f, fMax * 2));
      aplicar();
      if (!raf) { ultimoFrame = ahora; raf = requestAnimationFrame(decaer); }
    };

    const io = new IntersectionObserver(([e]) => {
      enVista = e.isIntersecting;
      ultimaY = scrollY; ultimaT = performance.now();
      sincronizar();
    }, { rootMargin: '100px 0px' });
    io.observe(parallaxRef.current);
    const ro = new ResizeObserver(armar);
    ro.observe(copia);
    const mo = new MutationObserver(sincronizar);
    mo.observe(root, { attributes: true, attributeFilter: ['data-anim'] });
    addEventListener('scroll', alScrollear, { passive: true });

    return () => {
      io.disconnect(); ro.disconnect(); mo.disconnect();
      removeEventListener('scroll', alScrollear);
      cancelAnimationFrame(raf);
      anim?.cancel();
    };
  }, [baseVelocity]);

  const copias = [];
  for (let i = 0; i < numCopies; i++) {
    copias.push(
      <span className={className} key={i} ref={i === 0 ? copiaRef : null}>
        {children}&nbsp;
      </span>,
    );
  }
  return (
    <div ref={parallaxRef} className={parallaxClassName} style={parallaxStyle}>
      <div ref={scrollerRef} className={scrollerClassName} style={scrollerStyle}>
        {copias}
      </div>
    </div>
  );
}

export default function BandaVelocidad({
  texts = [],
  velocity = 100,
  className = '',
  numCopies = 6,
  velocityMapping = { input: [0, 1000], output: [0, 5] },
  parallaxClassName = 'parallax',
  scrollerClassName = 'scroller',
  parallaxStyle,
  scrollerStyle,
}) {
  return (
    <section>
      {texts.map((text, i) => (
        <Fila key={i} className={className} baseVelocity={i % 2 !== 0 ? -velocity : velocity}
          numCopies={numCopies} velocityMapping={velocityMapping}
          parallaxClassName={parallaxClassName} scrollerClassName={scrollerClassName}
          parallaxStyle={parallaxStyle} scrollerStyle={scrollerStyle}>
          {text}
        </Fila>
      ))}
    </section>
  );
}
