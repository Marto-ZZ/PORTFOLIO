import { Renderer, Program, Mesh, Color, Triangle } from 'ogl';
import { useEffect, useRef, useState } from 'react';
import './Galaxy.css';

/* Fondo del hero: shader de galaxia de reactbits.dev (https://reactbits.dev/backgrounds/galaxy),
   adaptado a los criterios de rendimiento y tema del resto del sitio. El shader
   en sí (vertex/fragment) NO se tocó, para no arriesgar romperlo a mano; lo
   que se adaptó es todo lo que lo rodea:

   - El original llama requestAnimationFrame para siempre y sólo deja de
     avanzar uTime con disableAnimation, pero sigue renderizando cada frame
     igual (GPU trabajando en vano). Acá el loop se PARA del todo — mismo
     criterio que Waves/LogoLoop/SaturnSystem — cuando el hero no está en
     pantalla, la pestaña está oculta, o "Reducir animaciones" está activo.
   - lightMode se ata al tema del sitio (mismo patrón de MutationObserver
     sobre data-theme que ya usa el resto del hero): en el tema oscuro es la
     galaxia normal, transparente sobre el fondo; en el claro usa el modo
     "tinta" que trae el propio shader, pensado para fondos claros.
   - mouseInteraction queda apagado: .hero-bg tiene pointer-events:none (para
     no robarle clicks a los botones y a las lunas de Saturno), así que la
     repulsión al mouse del componente original necesitaría reescribir esa
     regla; no se pidió, así que no se toca. */

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`;

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec3 uResolution;
uniform vec2 uFocal;
uniform vec2 uRotation;
uniform float uStarSpeed;
uniform float uDensity;
uniform float uHueShift;
uniform float uSpeed;
uniform vec2 uMouse;
uniform float uGlowIntensity;
uniform float uSaturation;
uniform bool uMouseRepulsion;
uniform float uTwinkleIntensity;
uniform float uRotationSpeed;
uniform float uRepulsionStrength;
uniform float uMouseActiveFactor;
uniform float uAutoCenterRepulsion;
uniform bool uTransparent;
uniform float uLightMode;

varying vec2 vUv;

#define NUM_LAYER 4.0
#define STAR_COLOR_CUTOFF 0.2
#define MAT45 mat2(0.7071, -0.7071, 0.7071, 0.7071)
#define PERIOD 3.0

float Hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float tri(float x) {
  return abs(fract(x) * 2.0 - 1.0);
}

float tris(float x) {
  float t = fract(x);
  return 1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0));
}

float trisn(float x) {
  float t = fract(x);
  return 2.0 * (1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0))) - 1.0;
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float Star(vec2 uv, float flare) {
  float d = length(uv);
  float m = (0.05 * uGlowIntensity) / d;
  float rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * flare * uGlowIntensity;
  uv *= MAT45;
  rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * 0.3 * flare * uGlowIntensity;
  m *= smoothstep(1.0, 0.2, d);
  return m;
}

vec3 StarLayer(vec2 uv) {
  vec3 col = vec3(0.0);

  vec2 gv = fract(uv) - 0.5;
  vec2 id = floor(uv);

  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 offset = vec2(float(x), float(y));
      vec2 si = id + vec2(float(x), float(y));
      float seed = Hash21(si);
      float size = fract(seed * 345.32);
      float glossLocal = tri(uStarSpeed / (PERIOD * seed + 1.0));
      float flareSize = smoothstep(0.9, 1.0, size) * glossLocal;

      float red = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 1.0)) + STAR_COLOR_CUTOFF;
      float blu = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 3.0)) + STAR_COLOR_CUTOFF;
      float grn = min(red, blu) * seed;
      vec3 base = vec3(red, grn, blu);

      float hue = atan(base.g - base.r, base.b - base.r) / (2.0 * 3.14159) + 0.5;
      hue = fract(hue + uHueShift / 360.0);
      float sat = length(base - vec3(dot(base, vec3(0.299, 0.587, 0.114)))) * uSaturation;
      float val = max(max(base.r, base.g), base.b);
      base = hsv2rgb(vec3(hue, sat, val));

      vec2 pad = vec2(tris(seed * 34.0 + uTime * uSpeed / 10.0), tris(seed * 38.0 + uTime * uSpeed / 30.0)) - 0.5;

      float star = Star(gv - offset - pad, flareSize);
      vec3 color = base;

      float twinkle = trisn(uTime * uSpeed + seed * 6.2831) * 0.5 + 1.0;
      twinkle = mix(1.0, twinkle, uTwinkleIntensity);
      star *= twinkle;

      col += star * size * color;
    }
  }

  return col;
}

void main() {
  vec2 focalPx = uFocal * uResolution.xy;
  vec2 uv = (vUv * uResolution.xy - focalPx) / uResolution.y;

  vec2 mouseNorm = uMouse - vec2(0.5);

  if (uAutoCenterRepulsion > 0.0) {
    vec2 centerUV = vec2(0.0, 0.0);
    float centerDist = length(uv - centerUV);
    vec2 repulsion = normalize(uv - centerUV) * (uAutoCenterRepulsion / (centerDist + 0.1));
    uv += repulsion * 0.05;
  } else if (uMouseRepulsion) {
    vec2 mousePosUV = (uMouse * uResolution.xy - focalPx) / uResolution.y;
    float mouseDist = length(uv - mousePosUV);
    vec2 repulsion = normalize(uv - mousePosUV) * (uRepulsionStrength / (mouseDist + 0.1));
    uv += repulsion * 0.05 * uMouseActiveFactor;
  } else {
    vec2 mouseOffset = mouseNorm * 0.1 * uMouseActiveFactor;
    uv += mouseOffset;
  }

  float autoRotAngle = uTime * uRotationSpeed;
  mat2 autoRot = mat2(cos(autoRotAngle), -sin(autoRotAngle), sin(autoRotAngle), cos(autoRotAngle));
  uv = autoRot * uv;

  uv = mat2(uRotation.x, -uRotation.y, uRotation.y, uRotation.x) * uv;

  vec3 col = vec3(0.0);

  for (float i = 0.0; i < 1.0; i += 1.0 / NUM_LAYER) {
    float depth = fract(i + uStarSpeed * uSpeed);
    float scale = mix(20.0 * uDensity, 0.5 * uDensity, depth);
    float fade = depth * smoothstep(1.0, 0.9, depth);
    col += StarLayer(uv * scale + i * 453.32) * fade;
  }

  if (uLightMode > 0.5) {
    float energy = max(max(col.r, col.g), col.b);
    float coverage = clamp(smoothstep(0.0, 0.42, energy) * 0.92, 0.0, 0.92);
    vec3 ink = clamp(col * 0.48, 0.0, 0.82);
    gl_FragColor = vec4(mix(vec3(1.0), ink, coverage), 1.0);
  } else if (uTransparent) {
    float alpha = length(col);
    alpha = smoothstep(0.0, 0.3, alpha);
    alpha = min(alpha, 1.0);
    gl_FragColor = vec4(col, alpha);
  } else {
    gl_FragColor = vec4(col, 1.0);
  }
}
`;

// Mismo patrón que ya usa el resto del hero para leer el tema activo.
function useTheme() {
  const [dark, setDark] = useState(
    () => typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') !== 'light'
  );
  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setDark(root.getAttribute('data-theme') !== 'light');
    sync();
    const obs = new MutationObserver(sync);
    obs.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);
  return dark;
}

export default function Galaxy({
  focal = [0.5, 0.5],
  rotation = [1.0, 0.0],
  starSpeed = 0.4,
  density = 1.6,
  hueShift = 220,
  speed = 0.7,
  glowIntensity = 0.14,
  saturation = 0.15,
  twinkleIntensity = 0.25,
  rotationSpeed = 0.045,
  ...rest
}) {
  const ctnDom = useRef(null);
  const dark = useTheme();
  // El contexto WebGL se crea UNA sola vez (ver el effect de abajo, sin
  // dependencias). El tema se sincroniza aparte, sobre lo ya creado: la
  // primera versión recreaba todo el contexto cada vez que cambiaba el
  // tema, y como el shader cambia de color al instante mientras el resto
  // del sitio hace un fade de 0.5s, el toggle claro/oscuro se veía como un
  // flash. glRef/programRef exponen lo creado acá al otro effect.
  const glRef = useRef(null);
  const programRef = useRef(null);
  const darkRef = useRef(dark);

  useEffect(() => {
    if (!ctnDom.current) return;
    const ctn = ctnDom.current;
    const transparent = true;
    const renderer = new Renderer({ alpha: transparent, premultipliedAlpha: false });
    const gl = renderer.gl;

    if (darkRef.current) {
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.clearColor(0, 0, 0, 0);
    } else {
      gl.clearColor(1, 1, 1, 1);
    }

    let program;
    function resize() {
      renderer.setSize(ctn.offsetWidth, ctn.offsetHeight);
      if (program) {
        program.uniforms.uResolution.value = new Color(
          gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height
        );
      }
    }
    window.addEventListener('resize', resize, false);
    resize();

    const geometry = new Triangle(gl);
    program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new Color(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height) },
        uFocal: { value: new Float32Array(focal) },
        uRotation: { value: new Float32Array(rotation) },
        uStarSpeed: { value: starSpeed },
        uDensity: { value: density },
        uHueShift: { value: hueShift },
        uSpeed: { value: speed },
        uMouse: { value: new Float32Array([0.5, 0.5]) },
        uGlowIntensity: { value: glowIntensity },
        uSaturation: { value: saturation },
        uMouseRepulsion: { value: false },
        uTwinkleIntensity: { value: twinkleIntensity },
        uRotationSpeed: { value: rotationSpeed },
        uRepulsionStrength: { value: 0 },
        uMouseActiveFactor: { value: 0 },
        uAutoCenterRepulsion: { value: 0 },
        uTransparent: { value: transparent },
        uLightMode: { value: darkRef.current ? 0 : 1 },
      },
    });
    glRef.current = gl;
    programRef.current = program;

    const mesh = new Mesh(gl, { geometry, program });
    ctn.appendChild(gl.canvas);

    // El original programa requestAnimationFrame para siempre y sólo deja de
    // avanzar uTime con disableAnimation, pero renderiza cada frame igual
    // (GPU trabajando en vano). Acá el loop se PARA del todo cuando el hero
    // sale de pantalla, la pestaña queda oculta, o "Reducir animaciones" está
    // activo -- mismo criterio que Waves/LogoLoop/SaturnSystem en el resto
    // del sitio.
    let raf = 0;
    let running = false;
    function frame(t) {
      if (!running) return;
      raf = requestAnimationFrame(frame);
      program.uniforms.uTime.value = t * 0.001;
      program.uniforms.uStarSpeed.value = (t * 0.001 * starSpeed) / 10.0;
      renderer.render({ scene: mesh });
    }
    function start() {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(frame);
    }
    function stop() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }

    let visible = true;
    const sync = () => { (visible && !document.hidden && root.getAttribute('data-anim') !== 'off') ? start() : stop(); };
    const root = document.documentElement;
    const io = new IntersectionObserver(es => { visible = es[0].isIntersecting; sync(); });
    io.observe(ctn);
    document.addEventListener('visibilitychange', sync);
    const animObs = new MutationObserver(sync);
    animObs.observe(root, { attributes: true, attributeFilter: ['data-anim'] });
    sync();
    // primer frame ya, para no depender de que el observer dispare antes de pintar
    if (!running) renderer.render({ scene: mesh });

    return () => {
      stop();
      io.disconnect();
      animObs.disconnect();
      document.removeEventListener('visibilitychange', sync);
      window.removeEventListener('resize', resize);
      ctn.removeChild(gl.canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      glRef.current = null;
      programRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- se crea una
    // sola vez a propósito; ver el comentario de arriba.
  }, []);

  // Sincroniza sólo el tema sobre el contexto ya existente (no lo recrea).
  // El fade que tapa el cambio de color vive en Galaxy.css, atado a la misma
  // clase .theming que ya usa el resto del sitio durante la transición.
  useEffect(() => {
    darkRef.current = dark;
    const gl = glRef.current, program = programRef.current;
    if (!gl || !program) return; // primer montaje: ya lo tomó darkRef arriba
    if (dark) {
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.clearColor(0, 0, 0, 0);
    } else {
      gl.clearColor(1, 1, 1, 1);
    }
    program.uniforms.uLightMode.value = dark ? 0 : 1;
  }, [dark]);

  return <div ref={ctnDom} className="galaxy-container" aria-hidden="true" {...rest} />;
}
