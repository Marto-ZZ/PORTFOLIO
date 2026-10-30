import { useId } from 'react';
import {
  PLANETITA_ROCOSA, PLANETITA_GASEOSA, PLANETITA_VOLCANICA, PLANETITA_HELADA,
  PLANETITA_CONTINENTES, COHETE, DISCO,
} from './doodles.precalc.js';
import './Doodles.css';

const GROSOR = 1.6;

function Icono({ size = 24, grosor = GROSOR, titulo, className = '', viewBox = '0 0 24 24', children, ...resto }) {
  return (
    <svg viewBox={viewBox} width={size} height={size} fill="none" stroke="currentColor"
      strokeWidth={grosor} strokeLinecap="round" strokeLinejoin="round"
      className={`doodle ${className}`}
      role={titulo ? 'img' : undefined} aria-hidden={titulo ? undefined : true} {...resto}>
      {titulo && <title>{titulo}</title>}
      {children}
    </svg>
  );
}

export const Cohete = (p) => {
  const c = COHETE;
  return (
    <Icono {...p}>
      <g transform="rotate(45 12 12)">
        <path d={c.cuerpo} /><path d={c.ventana} /><path d={c.aletas} />
      </g>
    </Icono>
  );
};

const SATELITE = {
  cuerpo: 'M10.4 9.5H13.6Q14.4 9.5 14.4 10.3V14.3Q14.4 15.1 13.6 15.1H10.4Q9.6 15.1 9.6 14.3V10.3Q9.6 9.5 10.4 9.5Z',
  paneles: 'M1.9 10.3H7.3V14.3H1.9ZM4.6 10.3V14.3M16.7 10.3H22.1V14.3H16.7ZM19.4 10.3V14.3M7.3 12.3H9.6M14.4 12.3H16.7',
  antena: 'M12 9.5V7.9M9.9 6.5Q12 8.9 14.1 6.5',
  senal: 'M10 4.3Q12 3 14 4.3M8.6 2.6Q12 0.6 15.4 2.6',
};
export const Satelite = (p) => (
  <Icono {...p}>
    <g transform="rotate(-28 12 12)">
      <path d={SATELITE.paneles} /><path d={SATELITE.cuerpo} /><path d={SATELITE.antena} />
      <path d={SATELITE.senal} />
    </g>
  </Icono>
);

const CX = 12, CY = 12, R = 8.3;
const SOMBRA_MINI = 'M13.9 19.6L19.4 13.9M11.4 19.9L19.6 11.4M16.8 18.4L18.6 16.6';

const PLANETITAS = {
  rocosa: PLANETITA_ROCOSA,
  gaseosa: PLANETITA_GASEOSA,
  volcanica: PLANETITA_VOLCANICA,
  helada: PLANETITA_HELADA,
  continentes: PLANETITA_CONTINENTES,
};

export const Planetita = ({ tipo = 'rocosa', ...p }) => {
  const t = PLANETITAS[tipo] || PLANETITAS.rocosa;
  const id = `pl-${useId().replace(/:/g, '')}`;
  const finos = (t.sombra ? SOMBRA_MINI : '') + (t.finos || '');
  return (
    <Icono {...p}>
      <defs><clipPath id={id}><circle cx={CX} cy={CY} r={R} /></clipPath></defs>
      <g clipPath={`url(#${id})`}>
        <path d={t.trazos} />
        {finos && <path d={finos} strokeWidth="1.1" />}
      </g>
      <path d={DISCO} />
      {t.puntos && <path d={t.puntos} fill="currentColor" stroke="none" />}
    </Icono>
  );
};

