const pendientes = () => [...document.querySelectorAll('.section:not(.lista)')];
const enRatoLibre = (fn) => (window.requestIdleCallback ? requestIdleCallback(fn, { timeout: 3000 }) : setTimeout(fn, 300));

export function mostrarTodas() {
  const faltan = pendientes();
  faltan.forEach((s) => s.classList.add('lista'));
  return faltan.length > 0;
}

export function iniciarSecciones() {
  const siguiente = () => {
    const [s] = pendientes();
    if (!s) return;
    s.classList.add('lista');
    enRatoLibre(siguiente);
  };
  enRatoLibre(siguiente);
}
