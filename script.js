    // Cursor customizado (oculto hasta primer movimiento)
    const cursor = document.getElementById('cursor');
    const ring = document.getElementById('cursorRing');
    cursor.style.opacity = '0';
    ring.style.opacity = '0';
    let mx = -999, my = -999, rx = -999, ry = -999;
    let cursorVisible = false;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top = my + 'px';
      if (!cursorVisible) {
        cursor.style.opacity = '1';
        ring.style.opacity = '1';
        cursorVisible = true;
      }
    });

    function animRing() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(animRing);
    }
    animRing();

    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });

    // Nav on scroll
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    });

    // Scroll reveal
    const reveals = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    reveals.forEach(el => io.observe(el));



    // Terminal (bloque de codigo animado en el hero)
    const codeLines = [
      { text: 'class Developer:', color: 'kw' },
      { text: '    name = "Martín Sogoloff"', color: 'str' },
      { text: '    role = "Full Stack Jr."', color: 'str' },
      { text: '    location = "Buenos Aires, Argentina"', color: 'str' },
      { text: '' },
      { text: '    stack = [', color: 'normal' },
      { text: '        "Python", "Machine Learning",', color: 'str' },
      { text: '        "HTML", "CSS", "JS",', color: 'str' },
      { text: '        "Figma", "UX/UI"', color: 'str' },
      { text: '    ]', color: 'normal' },
      { text: '' },
      { text: '    def build(self, idea):', color: 'kw' },
      { text: '        # codigo + diseño', color: 'comment' },
      { text: '        return producto_solido', color: 'normal' },
    ];

    const colorMap = {
      kw: '#c084fc',
      str: '#86efac',
      comment: '#6b7280',
      normal: '#ede9f6',
    };

    const tw = document.getElementById('typewriter-code');
    let lineIdx = 0, charIdx = 0;
    let rendered = '';

    function typeNext() {
      if (lineIdx >= codeLines.length) {
        // Cuando termina, parpadea el cursor y reinicia despues de 3 segundos
        setTimeout(() => {
          tw.innerHTML = '';
          rendered = '';
          lineIdx = 0; charIdx = 0;
          typeNext();
        }, 3000);
        return;
      }

      const line = codeLines[lineIdx];
      const fullText = line.text;
      const color = colorMap[line.color] || '#ede9f6';

      if (charIdx < fullText.length) {
        // Escribir caracter a caracter
        const partial = fullText.slice(0, charIdx + 1);
        tw.innerHTML = rendered + `<span style="color:${color}">${escHtml(partial)}</span><span class="tw-cursor">▋</span>`;
        charIdx++;
        setTimeout(typeNext, 28);
      } else {
        // Linea completa (guardar y pasar a la siguiente)
        rendered += `<span style="color:${color}">${escHtml(fullText)}</span>\n`;
        tw.innerHTML = rendered + `<span class="tw-cursor">▋</span>`;
        lineIdx++;
        charIdx = 0;
        setTimeout(typeNext, fullText === '' ? 80 : 120);
      }
    }

    function escHtml(s) {
      return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }

    // Arrancar la terminal cuando el hero es visible
    setTimeout(typeNext, 800);



    // Galeria de proyectos (slideshow con flechas)
    function getGallery(btn) {
      return btn.closest('.project-gallery');
    }

    function updateGallery(gallery, newIndex) {
      const slides = gallery.querySelectorAll('.gallery-slide');
      const dots = gallery.querySelectorAll('.dot');
      const total = slides.length;
      newIndex = (newIndex + total) % total;

      slides.forEach((s, i) => s.classList.toggle('active', i === newIndex));
      dots.forEach((d, i) => d.classList.toggle('active', i === newIndex));
      gallery.dataset.index = newIndex;
    }

    function slideGallery(btn, dir) {
      const gallery = getGallery(btn);
      const current = parseInt(gallery.dataset.index);
      updateGallery(gallery, current + dir);
    }

    function goToSlide(dot, idx) {
      const gallery = dot.closest('.project-gallery');
      updateGallery(gallery, idx);
    }

    // Auto-avance de las galerias cada 4 segundos
    document.querySelectorAll('.project-gallery').forEach(gallery => {
      setInterval(() => {
        const current = parseInt(gallery.dataset.index);
        const total = gallery.querySelectorAll('.gallery-slide').length;
        updateGallery(gallery, (current + 1) % total);
      }, 4000);
    });
