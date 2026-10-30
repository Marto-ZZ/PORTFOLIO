import {
  INCLINACION, ANILLOS, CORONA, GIRO, BANDAS, RASCADO, TORMENTA, SOMBRA, CONTORNO, CONTORNO_SOMBRA,
} from './saturno.precalc.js';
import './SaturnoDibujo.css';

export function SaturnoDefs() {
  return (
    <>
      <clipPath id="satDiscoU" clipPathUnits="userSpaceOnUse">
        <circle cx="0" cy="0" r="1" />
      </clipPath>
      <clipPath id="satFrenteU" clipPathUnits="userSpaceOnUse">
        <rect x="-3.2" y="0" width="6.4" height="2.6" transform={`rotate(${INCLINACION})`} />
      </clipPath>
    </>
  );
}

function Anillos() {
  return (
    <>
      <path d={CORONA} className="sat-fondo" fillRule="evenodd" />
      {ANILLOS.firmes.map((a) => <path key={a.w} d={a.d} strokeWidth={a.w} className="sat-tinta" />)}
      <path d={ANILLOS.tenue.d} strokeWidth={ANILLOS.tenue.w} className="sat-tinta sat-tinta--tenue" />
    </>
  );
}

export function SaturnoAnillosAtras() {
  return (
    <g className="sat-anillos-doodle">
      <Anillos />
      <path d={GIRO} strokeWidth={0.011} className="sat-tinta" />
    </g>
  );
}

export function SaturnoAnillosAdelante() {
  return (
    <g className="sat-anillos-doodle" clipPath="url(#satFrenteU)">
      <Anillos />
    </g>
  );
}

export function SaturnoCuerpo() {
  return (
    <g className="sat-cuerpo-doodle">
      <circle cx="0" cy="0" r="1" className="sat-fondo" />
      <g clipPath="url(#satDiscoU)">
        <path d={SOMBRA.d} strokeWidth={SOMBRA.w} className="sat-tinta sat-tinta--sombra" />
        <g transform={`rotate(${INCLINACION})`}>
          {BANDAS.map((b) => <path key={b.w} d={b.d} strokeWidth={b.w} className="sat-tinta" />)}
          <path d={RASCADO} strokeWidth={0.011} className="sat-tinta" />
          <path d={TORMENTA} strokeWidth={0.013} className="sat-tinta" />
        </g>
      </g>
      <path d={CONTORNO} strokeWidth={0.021} className="sat-tinta" />
      <path d={CONTORNO_SOMBRA} strokeWidth={0.013} className="sat-tinta" />
    </g>
  );
}

export default function SaturnoDibujo() {
  return (
    <>
      <defs><SaturnoDefs /></defs>
      <SaturnoAnillosAtras />
      <SaturnoCuerpo />
      <SaturnoAnillosAdelante />
    </>
  );
}
