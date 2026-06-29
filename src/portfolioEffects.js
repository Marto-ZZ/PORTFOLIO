'use strict';

/* Lógica del portfolio portada tal cual desde el script.js original.
   Se ejecuta una vez tras montar la app de React (DOM ya disponible). */
export function initPortfolio() {
  const root = document.documentElement;
  const FINE = matchMedia('(pointer: fine)').matches;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { } },
  };

  const prefs = {
    theme: root.getAttribute('data-theme') === 'light' ? 'light' : 'dark',
    lang: store.get('def-lang') === 'en' ? 'en' : 'es',
    anim: root.getAttribute('data-anim') !== 'off',
    bg3d: store.get('def-3d') !== 'off',
  };

  const animOn = () => prefs.anim;
  const isDark = () => root.getAttribute('data-theme') !== 'light';

  /* /// NAV: fondo, autoocultado, scroll-spy /// */
  const nav = document.getElementById('nav');
  const logoDot = document.querySelector('.nav-logo .dot');
  let lastY = scrollY;

  addEventListener('scroll', () => {
    const y = scrollY;
    nav.classList.toggle('scrolled', y > 30);
    if (animOn()) {
      if (y > 320 && y > lastY + 6) nav.classList.add('hidden');
      else if (y < lastY - 4) nav.classList.remove('hidden');
    }
    lastY = y;
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
      document.querySelectorAll('.nav-links a').forEach(a =>
        a.classList.toggle('active', a.getAttribute('href') === '#' + id));
      if (!first && animOn() && logoDot) {
        logoDot.classList.remove('pulse');
        void logoDot.offsetWidth;
        logoDot.classList.add('pulse');
      }
    }
  }, { rootMargin: '-45% 0px -45% 0px' });
  ids.forEach(id => { const el = document.getElementById(id); if (el) spy.observe(el); });

  /* /// REVELADO COREOGRAFIADO /// */
  let revealIO = null;
  function initReveals() {
    if (!animOn()) return;
    revealIO = new IntersectionObserver(entries => {
      const batch = entries.filter(e => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      batch.forEach((entry, i) => {
        const el = entry.target;
        el.style.setProperty('--reveal-delay', (i * 80) + 'ms');
        el.classList.add('in');
        revealIO.unobserve(el);
      });
    }, { threshold: 0.14 });
    document.querySelectorAll('.reveal:not(.in)').forEach(el => revealIO.observe(el));
  }
  initReveals();

  /* /// NOMBRE: las letras suben (sólo en carga) /// */
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
      // El apellido va en color de marca (no contorno transparente): el tratamiento
      // visible vive en CSS (.h-line--stroke) para que sea legible y respete el tema.
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

  /* /// TERMINAL martin.py /// */
  const codeLines = [
    { t: 'class Developer:', c: 'kw' },
    { t: '    name  = "Martín Sogoloff"', c: 'str' },
    { t: '    role  = "Full Stack & Software Developer"', c: 'str' },
    { t: '    focus = ["UX/UI", "Frontend", "Backend"]', c: 'fn' },
    { t: '' },
    { t: '    stack = [', c: 'txt' },
    { t: '        "Python", "JavaScript", "Node.js",', c: 'str' },
    { t: '        "HTML", "CSS", "React",', c: 'str' },
    { t: '        "Figma", "Git",', c: 'str' },
    { t: '    ]', c: 'txt' },
    { t: '' },
    { t: '    def build(self, idea):', c: 'kw' },
    { t: '        # código + diseño', c: 'com' },
    { t: '        return producto_real', c: 'txt' },
  ];
  const col = c => `var(--code-${c})`;
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const tw = document.getElementById('tw');
  const codeWin = document.querySelector('.code-window');
   
  function renderFull() {
    if (tw) {
      tw.innerHTML = codeLines
        .map(l => `<span style="color:${col(l.c || 'txt')}">${esc(l.t)}</span>`).join('\n');
    }
  }
  if (tw) {
    if (!animOn()) {
      renderFull();
    } else {
      let li = 0, ci = 0, done = '';
      const step = () => {
        if (!animOn()) { renderFull(); return; }
        if (li >= codeLines.length) {
          setTimeout(() => { tw.innerHTML = ''; done = ''; li = 0; ci = 0; step(); }, 3200);
          return;
        }
        const line = codeLines[li];
        const color = col(line.c || 'txt');
        if (ci < line.t.length) {
          tw.innerHTML = done + `<span style="color:${color}">${esc(line.t.slice(0, ++ci))}</span><span class="tw-caret">▋</span>`;
          setTimeout(step, 26);
        } else {
          done += `<span style="color:${color}">${esc(line.t)}</span>\n`;
          tw.innerHTML = done + `<span class="tw-caret">▋</span>`;
          li++; ci = 0;
          setTimeout(step, line.t === '' ? 70 : 120);
        }
      };
      setTimeout(step, 700);
    }
    // el punto verde "ejecuta" el código
    const green = codeWin && codeWin.querySelector('.code-dot.green');
    if (green && animOn()) {
      green.addEventListener('pointerenter', () => codeWin.classList.add('running'));
      codeWin.addEventListener('animationend', e => {
        if (e.animationName === 'code-run') codeWin.classList.remove('running');
      });
    }
  }

  /* /// GALERÍAS DE PROYECTO /// */
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
    stopAuto(g);
    timers.set(g, setInterval(() => apply(g, (parseInt(g.dataset.index, 10) || 0) + 1, 1), AUTO));
  }
  function stopAuto(g) { const t = timers.get(g); if (t) clearInterval(t); timers.delete(g); }
  function restart(g) { stopAuto(g); if (!g.matches(':hover')) startAuto(g); }

  window.slideGallery = (btn, dir) => { const g = btn.closest('.gallery'); apply(g, (parseInt(g.dataset.index, 10) || 0) + dir, dir); restart(g); };
  window.goToSlide = (dot, i) => { const g = dot.closest('.gallery'); apply(g, i, 0); restart(g); };

  document.querySelectorAll('.gallery').forEach(g => {
    const slides = g.querySelectorAll('.slide');
    const active = parseInt(g.dataset.index, 10) || 0;
    slides.forEach((s, i) => {
      setSlide(s, i === active ? 0 : (i > active ? 1 : -1), { instant: true, z: i === active ? 3 : 1 });
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
  });

  /* /// SKILLS: color de marca + borde cónico /// */
  const skills = [...document.querySelectorAll('.skill')];
  const glowMap = [
    ['devicon-python-plain', '#4b8bbe'],
    ['devicon-javascript-plain', '#f7df1e'],
    ['devicon-react-original', '#61dafb'],
    ['devicon-html5-plain', '#e34f26'],
    ['devicon-css3-plain', '#3c99dc'],
    ['devicon-figma-plain', '#f24e1e'],
    ['devicon-github-original', '#cfcfe6'],
  ];
  skills.forEach(card => {
    let glow = 'var(--accent-glow)';
    for (const [cls, c] of glowMap) if (card.querySelector('.' + cls)) { glow = c; break; }
    if (card.querySelector('#ux-ico')) glow = '#cfcfe6';
    if (card.querySelector('#node-ico')) glow = '#5FA04E';
    if (card.querySelector('#fastapi-ico')) glow = '#009688';
    card.style.setProperty('--glow', glow);
  });

  let skillsInView = false;
  let px = -999, py = -999, pointerMoved = false;
  const skillsSection = document.getElementById('skills');
  if (skillsSection && FINE) {
    new IntersectionObserver(es => { skillsInView = es[0].isIntersecting; }, { rootMargin: '120px' }).observe(skillsSection);
    addEventListener('pointermove', e => { px = e.clientX; py = e.clientY; pointerMoved = true; }, { passive: true });
    const loop = () => {
      if (pointerMoved && skillsInView && animOn()) {
        for (const card of skills) {
          const r = card.getBoundingClientRect();
          const ang = Math.atan2(py - (r.top + r.height / 2), px - (r.left + r.width / 2)) * 180 / Math.PI + 90;
          card.style.setProperty('--ang', ang.toFixed(1) + 'deg');
        }
        pointerMoved = false;
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  /* /// BOTONES MAGNÉTICOS (sutil) /// */
  if (FINE) {
    document.querySelectorAll('.btn').forEach(el => {
      el.addEventListener('pointermove', e => {
        if (!animOn()) return;
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${((e.clientX - (r.left + r.width / 2)) * 0.12).toFixed(1)}px, ${((e.clientY - (r.top + r.height / 2)) * 0.18 - 2).toFixed(1)}px)`;
      }, { passive: true });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; }, { passive: true });
    });
  }

  /* /// IDIOMA ES / EN /// */
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

  /* /// PANEL DE AJUSTES /// */
  const metaTheme = document.getElementById('metaTheme');
  const sBtn = document.getElementById('settingsBtn');
  const sPanel = document.getElementById('settingsPanel');
  const themeSeg = document.getElementById('themeSeg');
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

  function syncSeg() {
    themeSeg.querySelectorAll('.seg-btn').forEach(b => b.classList.toggle('is-on', b.dataset.themeVal === prefs.theme));
  }
  function applyTheme(t, animate) {
    if (animate) { root.classList.add('theming'); setTimeout(() => root.classList.remove('theming'), 600); }
    prefs.theme = t;
    root.setAttribute('data-theme', t);
    store.set('def-theme', t);
    metaTheme.setAttribute('content', t === 'light' ? '#FAF6F1' : '#0a0a0f');
    syncSeg();
    hero3D.retheme();
  }
  themeSeg.addEventListener('click', e => {
    const b = e.target.closest('.seg-btn');
    if (b && b.dataset.themeVal !== prefs.theme) applyTheme(b.dataset.themeVal, true);
  });

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
      if (tw) renderFull();
    } else {
      if (revealIO) revealIO.disconnect();
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
      document.querySelectorAll('.gallery').forEach(stopAuto);
      if (tw) renderFull();
    }
    hero3D.sync();
  });

  /* /// RELOJ DEL FOOTER (hora de Buenos Aires) /// */
  (function clock() {
    const el = document.getElementById('footClock');
    if (!el) return;
    try {
      const fmt = new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/Argentina/Buenos_Aires' });
      const tick = () => { el.textContent = 'Buenos Aires · ' + fmt.format(new Date()); };
      tick(); setInterval(tick, 30000);
    } catch { el.textContent = 'Buenos Aires'; }
  })();

  /* /// FONDO 3D: curvas de nivel flotantes /// */
  const hero3D = (() => {
    const URL = 'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js';
    const holder = document.getElementById('hero3d');
    // El fondo 3D fue reemplazado por el componente <Waves/>; si no existe el
    // holder, devolvemos una API inerte para no romper nada (tema, ajustes...).
    if (!holder) return { enable() {}, retheme() {}, sync() {} };
    const surface = document.getElementById('inicio');
    let THREE = null, renderer, scene, camera, group, lines = [];
    let raf = 0, last = 0, built = false, failed = false, visible = true, building = false;
    let tpx = 0, ppx = 0;

    const palette = () => isDark()
      ? { main: 0x8b7cf6, alt: 0xa99bff, near: 0.15, far: 0.02, additive: true }
      : { main: 0x8B5E3C, alt: 0xA0724E, near: 0.16, far: 0.03, additive: false };

    function retheme() {
      if (!built) return;
      const p = palette();
      const blend = p.additive ? THREE.AdditiveBlending : THREE.NormalBlending;
      const main = new THREE.Color(p.main), alt = new THREE.Color(p.alt);
      for (const ln of lines) {
        ln.mat.color.copy(p.additive ? main.clone().lerp(alt, (1 - ln.fade) * 0.8) : main);
        ln.mat.opacity = p.far + (p.near - p.far) * ln.fade;
        ln.mat.blending = blend;
        ln.mat.needsUpdate = true;
      }
      if (!running() && renderer) renderer.render(scene, camera);
    }

    function build() {
      const w = holder.clientWidth || innerWidth, h = holder.clientHeight || innerHeight;
      const canvas = document.createElement('canvas');
      const attrs = { antialias: true, alpha: true, powerPreference: 'low-power' };
      const ctx = canvas.getContext('webgl2', attrs) || canvas.getContext('webgl', attrs);
      if (!ctx) throw new Error('sin WebGL');
      renderer = new THREE.WebGLRenderer({ canvas, context: ctx, ...attrs });
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
      renderer.setSize(w, h);
      renderer.setClearColor(0x000000, 0);
      holder.appendChild(renderer.domElement);

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(46, w / h, 0.1, 140);
      camera.position.set(0, 7.5, 18);
      camera.lookAt(0, 1.2, -4);

      const small = innerWidth < 760;
      const COLS = small ? 70 : 130, ROWS = small ? 18 : 30, W = 56, D = 38;
      group = new THREE.Group();
      lines = [];
      for (let j = 0; j < ROWS; j++) {
        const z = -D / 2 + (j / (ROWS - 1)) * D;
        const fade = j / (ROWS - 1);
        const positions = new Float32Array(COLS * 3);
        const base = new Array(COLS);
        for (let i = 0; i < COLS; i++) {
          const x = -W / 2 + (i / (COLS - 1)) * W;
          base[i] = { x, z };
          positions[i * 3] = x; positions[i * 3 + 1] = 0; positions[i * 3 + 2] = z;
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const mat = new THREE.LineBasicMaterial({ transparent: true, depthWrite: false });
        group.add(new THREE.Line(geo, mat));
        lines.push({ geo, mat, base, fade });
      }
      group.rotation.x = -0.6;
      group.position.y = -1.4;
      scene.add(group);

      addEventListener('resize', onResize);
      new IntersectionObserver(es => { visible = es[0].isIntersecting; sync(); }).observe(surface);
      surface.addEventListener('pointermove', e => {
        const r = surface.getBoundingClientRect();
        tpx = ((e.clientX - r.left) / r.width - 0.5);
      });
      built = true;
      retheme();
    }

    function onResize() {
      if (!built) return;
      const w = holder.clientWidth || innerWidth, h = holder.clientHeight || innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }

    function frame(t) {
      raf = requestAnimationFrame(frame);
      if (t - last < 33) return;
      last = t;
      const tt = t * 0.00034;
      for (const ln of lines) {
        const pos = ln.geo.attributes.position;
        for (let i = 0; i < ln.base.length; i++) {
          const { x, z } = ln.base[i];
          pos.setY(i, Math.sin(x * 0.17 + tt) * Math.cos(z * 0.15 - tt * 0.7) * 1.7 + Math.sin(x * 0.4 - z * 0.3 + tt * 0.9) * 0.55);
        }
        pos.needsUpdate = true;
      }
      ppx += (tpx - ppx) * 0.04;
      camera.position.x = ppx * 2.4;
      camera.lookAt(0, 1.2, -4);
      renderer.render(scene, camera);
    }

    const running = () => raf !== 0;
    function sync() {
      const should = prefs.bg3d && prefs.anim && built && visible;
      if (should && !running()) { last = 0; raf = requestAnimationFrame(frame); }
      else if (!should && running()) { cancelAnimationFrame(raf); raf = 0; }
    }

    async function enable(v) {
      prefs.bg3d = v;
      if (!v) { sync(); holder.hidden = true; return; }
      if (failed || building || !prefs.anim) { if (!prefs.anim) holder.hidden = true; return; }
      holder.hidden = false;
      if (!built) {
        building = true;
        try { THREE = await import(/* @vite-ignore */ URL); build(); }
        catch { failed = true; holder.hidden = true; bg3dSwitch.setAttribute('aria-checked', 'false'); }
        building = false;
      }
      sync();
    }

    if (prefs.bg3d && prefs.anim) enable(true); else holder.hidden = true;
    return { enable, retheme, sync };
  })();

  // refleja el estado inicial del tema sin animar
  applyTheme(prefs.theme, false);
}
