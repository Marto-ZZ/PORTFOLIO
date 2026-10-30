'use strict';

export function initPortfolio() {
  const root = document.documentElement;
  const FINE = matchMedia('(pointer: fine)').matches;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { } },
  };

  const prefs = {
    lang: store.get('def-lang') === 'en' ? 'en' : 'es',
    anim: root.getAttribute('data-anim') !== 'off',
  };

  const animOn = () => prefs.anim;

  const nav = document.getElementById('nav');
  const logoDot = document.querySelector('.nav-logo .dot');
  let lastY = scrollY;

  let navRaf = 0;
  addEventListener('scroll', () => {
    if (navRaf) return;
    navRaf = requestAnimationFrame(() => {
      navRaf = 0;
      const y = scrollY;
      nav.classList.toggle('scrolled', y > 30);
      if (animOn()) {
        if (y > 320 && y > lastY + 6) nav.classList.add('hidden');
        else if (y < lastY - 4) nav.classList.remove('hidden');
      }
      lastY = y;
    });
  }, { passive: true });

  const ids = ['inicio', 'sobre-mi', 'skills', 'proyectos', 'contacto'];
  let current = null;
  const spy = new IntersectionObserver(entries => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const id = e.target.id;
      if (id === current) continue;
      const first = current === null;
      current = id;
      document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(a =>
        a.classList.toggle('active', a.getAttribute('href') === '#' + id));
      if (!first && animOn() && logoDot) {
        logoDot.classList.remove('pulse');
        void logoDot.offsetWidth;
        logoDot.classList.add('pulse');
      }
    }
  }, { rootMargin: '-45% 0px -45% 0px' });
  ids.forEach(id => { const el = document.getElementById(id); if (el) spy.observe(el); });

  let revealIO = null;
  function initReveals() {
    if (!animOn()) return;
    revealIO = new IntersectionObserver(entries => {
      const batch = entries.filter(e => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      batch.forEach((entry, i) => {
        const el = entry.target;
        el.style.setProperty('--reveal-delay', Math.min(i, 4) * 60 + 'ms');
        el.classList.add('in');
        revealIO.unobserve(el);
      });
    }, { rootMargin: '100000px 0px 0px 0px' });
    document.querySelectorAll('.reveal:not(.in)').forEach(el => revealIO.observe(el));
  }
  initReveals();

  (function splitName() {
    const h1 = document.querySelector('.hero-name');
    if (!h1) return;
    const lines = [];
    h1.childNodes.forEach(n => {
      if (n.nodeType === 3 && n.textContent.trim()) lines.push({ t: n.textContent.trim(), stroke: false });
      else if (n.nodeType === 1) lines.push({ t: n.textContent.trim(), stroke: true });
    });
    h1.innerHTML = '';
    let i = 0;
    lines.forEach(ln => {
      const line = document.createElement('span');
      line.className = 'h-line';
      if (ln.stroke) line.classList.add('h-line--stroke');
      [...ln.t].forEach(ch => {
        const s = document.createElement('span');
        s.className = 'h-ch';
        s.textContent = ch;
        s.style.setProperty('--i', i++);
        line.appendChild(s);
      });
      h1.appendChild(line);
    });
  })();

  const AUTO = 4600;
  const timers = new Map();

  function setSlide(slide, off, opts = {}) {
    if (opts.instant) slide.classList.add('gs-instant');
    slide.style.setProperty('--off', off);
    slide.style.setProperty('--absoff', Math.min(Math.abs(off), 1));
    if (opts.z !== undefined) slide.style.zIndex = opts.z;
    if (opts.instant) { void slide.offsetWidth; slide.classList.remove('gs-instant'); }
  }
  function apply(gallery, idx, dir) {
    const slides = gallery.querySelectorAll('.slide');
    const dots = gallery.querySelectorAll('.gdot');
    const n = slides.length;
    idx = ((idx % n) + n) % n;
    const old = parseInt(gallery.dataset.index, 10) || 0;
    if (idx === old) return;
    if (!dir) { let d = idx - old; if (d > n / 2) d -= n; if (d < -n / 2) d += n; dir = Math.sign(d) || 1; }
    setSlide(slides[idx], dir, { instant: true, z: 3 });
    slides.forEach((s, i) => {
      if (i === idx) setSlide(s, 0, { z: 3 });
      else if (i === old) setSlide(s, -dir * 0.3, { z: 2 });
      else setSlide(s, dir, { instant: true, z: 1 });
    });
    slides.forEach((s, i) => s.classList.toggle('active', i === idx));
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    gallery.dataset.index = idx;
  }
  function startAuto(g) {
    if (!animOn()) return;
    if (g.dataset.inview === '0') return;
    stopAuto(g);
    timers.set(g, setInterval(() => apply(g, (parseInt(g.dataset.index, 10) || 0) + 1, 1), AUTO));
  }
  function stopAuto(g) { const t = timers.get(g); if (t) clearInterval(t); timers.delete(g); }
  function restart(g) { stopAuto(g); if (!g.matches(':hover')) startAuto(g); }

  window.slideGallery = (btn, dir) => { const g = btn.closest('.gallery'); apply(g, (parseInt(g.dataset.index, 10) || 0) + dir, dir); restart(g); };
  window.goToSlide = (dot, i) => { const g = dot.closest('.gallery'); apply(g, i, 0); restart(g); };

  const iniciales = [];
  document.querySelectorAll('.gallery').forEach(g => {
    const slides = g.querySelectorAll('.slide');
    const active = parseInt(g.dataset.index, 10) || 0;
    slides.forEach((s, i) => {
      s.classList.add('gs-instant');
      setSlide(s, i === active ? 0 : (i > active ? 1 : -1), { z: i === active ? 3 : 1 });
      iniciales.push(s);
      s.querySelectorAll('img').forEach(img => img.addEventListener('dragstart', e => e.preventDefault()));
    });
    g.tabIndex = 0;
    g.setAttribute('aria-label', 'Galería del proyecto');
    g.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        const dir = e.key === 'ArrowRight' ? 1 : -1;
        apply(g, (parseInt(g.dataset.index, 10) || 0) + dir, dir); restart(g);
      }
    });
    let dragX = null;
    const track = g.querySelector('.gallery-track');
    track.addEventListener('pointerdown', e => { dragX = e.clientX; }, { passive: true });
    track.addEventListener('pointerup', e => {
      if (dragX === null) return;
      const d = e.clientX - dragX; dragX = null;
      if (Math.abs(d) > 40) { const dir = d < 0 ? 1 : -1; apply(g, (parseInt(g.dataset.index, 10) || 0) + dir, dir); restart(g); }
    }, { passive: true });
    track.addEventListener('pointercancel', () => { dragX = null; }, { passive: true });
    g.addEventListener('pointerenter', () => stopAuto(g));
    g.addEventListener('pointerleave', () => startAuto(g));
    g.addEventListener('focusin', () => stopAuto(g));
    g.addEventListener('focusout', () => startAuto(g));
    startAuto(g);
    new IntersectionObserver(es => {
      const vis = es[0].isIntersecting;
      g.dataset.inview = vis ? '1' : '0';
      if (vis) startAuto(g); else stopAuto(g);
    }, { rootMargin: '150px' }).observe(g);
  });

  const skills = [...document.querySelectorAll('.skill')];
  const glowMap = [
    ['devicon-python-plain', '#4b8bbe'],
    ['devicon-javascript-plain', '#f7df1e'],
    ['devicon-react-original', '#61dafb'],
    ['devicon-html5-plain', '#e34f26'],
    ['devicon-css3-plain', '#3c99dc'],
    ['devicon-figma-plain', '#f24e1e'],
    ['devicon-github-original', '#cfcfe6'],
    ['devicon-mongodb-plain', '#4faa41'],
    ['devicon-cloudflare-plain', '#f38020'],
    ['devicon-vitejs-plain', '#8b7cf6'],
  ];
  skills.forEach(card => {
    let glow = 'var(--accent-glow)';
    for (const [cls, c] of glowMap) if (card.querySelector('.' + cls)) { glow = c; break; }
    card.style.setProperty('--glow', glow);
  });

  let skillsInView = false;
  let px = -999, py = -999, pointerMoved = false;
  const skillsSection = document.getElementById('skills');
  if (skillsSection && FINE) {
    let centers = [], measuredAt = 0;
    const measure = () => {
      const sx = scrollX, sy = scrollY;
      centers = skills.map(card => {
        const r = card.getBoundingClientRect();
        return { card, cx: r.left + sx + r.width / 2, cy: r.top + sy + r.height / 2 };
      });
      measuredAt = performance.now();
    };

    let raf = 0;
    const loop = () => {
      raf = 0;
      if (!pointerMoved || !skillsInView || !animOn()) return;
      pointerMoved = false;
      if (!centers.length || performance.now() - measuredAt > 500) measure();
      const sx = scrollX, sy = scrollY;
      for (const c of centers) {
        const ang = Math.atan2(py - (c.cy - sy), px - (c.cx - sx)) * 180 / Math.PI + 90;
        c.card.style.setProperty('--ang', ang.toFixed(1) + 'deg');
      }
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(loop); };

    new IntersectionObserver(es => {
      skillsInView = es[0].isIntersecting;
      if (!skillsInView && raf) { cancelAnimationFrame(raf); raf = 0; }
    }, { rootMargin: '120px' }).observe(skillsSection);

    addEventListener('pointermove', e => {
      if (!skillsInView) return;
      px = e.clientX; py = e.clientY; pointerMoved = true;
      schedule();
    }, { passive: true });
  }

  function applyLang(lang) {
    prefs.lang = lang;
    store.set('def-lang', lang);
    root.lang = lang;
    document.querySelectorAll('[data-es][data-en]').forEach(el => { el.innerHTML = el.dataset[lang]; });
    document.querySelectorAll('.lang-opt').forEach(o => o.classList.toggle('active', o.dataset.lang === lang));
  }
  document.getElementById('langSeg').addEventListener('click', e => {
    const b = e.target.closest('.lang-opt');
    if (b && b.dataset.lang !== prefs.lang) applyLang(b.dataset.lang);
  });
  applyLang(prefs.lang);

  const sBtn = document.getElementById('settingsBtn');
  const sPanel = document.getElementById('settingsPanel');
  const animSwitch = document.getElementById('animSwitch');

  sBtn.addEventListener('click', e => {
    e.stopPropagation();
    const open = sPanel.hidden;
    sPanel.hidden = !open;
    sBtn.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', e => {
    if (!sPanel.hidden && !e.target.closest('.settings')) { sPanel.hidden = true; sBtn.setAttribute('aria-expanded', 'false'); }
  });
  addEventListener('keydown', e => {
    if (e.key === 'Escape' && !sPanel.hidden) { sPanel.hidden = true; sBtn.setAttribute('aria-expanded', 'false'); sBtn.focus(); }
  });

  const burger = document.getElementById('navBurger');
  const navMobile = document.getElementById('navMobile');
  if (burger && navMobile) {
    const setMenu = (open) => {
      navMobile.hidden = !open;
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      burger.classList.toggle('is-open', open);
    };
    burger.addEventListener('click', e => {
      e.stopPropagation();
      setMenu(navMobile.hidden);
    });
    navMobile.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('click', e => {
      if (!navMobile.hidden && !e.target.closest('.nav-mobile, .nav-burger')) setMenu(false);
    });
    addEventListener('keydown', e => {
      if (e.key === 'Escape' && !navMobile.hidden) { setMenu(false); burger.focus(); }
    });
    matchMedia('(min-width: 721px)').addEventListener('change', e => { if (e.matches) setMenu(false); });
  }

  function setSwitch(el, on) { el.setAttribute('aria-checked', String(on)); }
  setSwitch(animSwitch, prefs.anim);

  animSwitch.addEventListener('click', () => {
    prefs.anim = !prefs.anim;
    setSwitch(animSwitch, prefs.anim);
    root.setAttribute('data-anim', prefs.anim ? 'on' : 'off');
    store.set('def-anim', prefs.anim ? 'on' : 'off');
    if (prefs.anim) {
      initReveals();
      document.querySelectorAll('.gallery').forEach(startAuto);
    } else {
      if (revealIO) revealIO.disconnect();
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
      document.querySelectorAll('.gallery').forEach(stopAuto);
    }
  });

  requestAnimationFrame(() => requestAnimationFrame(() => {
    iniciales.forEach(s => s.classList.remove('gs-instant'));
  }));

  const cuandoEsteLibre = (fn) => (window.requestIdleCallback ? requestIdleCallback(fn, { timeout: 2000 }) : setTimeout(fn, 600));

  cuandoEsteLibre(function clock() {
    const el = document.getElementById('footClock');
    if (!el) return;
    try {
      const fmt = new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/Argentina/Buenos_Aires' });
      const tick = () => { el.textContent = 'Buenos Aires, ' + fmt.format(new Date()); };
      tick(); setInterval(tick, 30000);
    } catch { el.textContent = 'Buenos Aires'; }
  });
}
