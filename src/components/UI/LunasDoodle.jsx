import { W, CONTORNO, ACENTO, VOLCANICA, HELADA } from './lunas.precalc.js';

function Contorno() {
  return (
    <>
      <path d={CONTORNO} strokeWidth={W.contorno} className="luna-tinta" />
      <path d={ACENTO} strokeWidth={W.acento} className="luna-tinta" />
    </>
  );
}

function Grupos({ grupos }) {
  return grupos.map((g) => <path key={g.w} d={g.d} strokeWidth={g.w} className="luna-tinta" />);
}

export function LunaVolcanica({ clipId }) {
  const v = VOLCANICA;
  return (
    <>
      <circle cx="0" cy="0" r="1" className="luna-disco" />
      <g clipPath={`url(#${clipId})`}>
        <Grupos grupos={v.adentro} />
        <path d={v.manchas} className="luna-punto" />
      </g>
      <Contorno />
      <path d={v.penachoColumna} strokeWidth={W.medio} className="luna-tinta" />
      <path d={v.penachoPuntos} className="luna-punto" />
    </>
  );
}

export function LunaHelada({ clipId }) {
  return (
    <>
      <circle cx="0" cy="0" r="1" className="luna-disco" />
      <g clipPath={`url(#${clipId})`}>
        <Grupos grupos={HELADA.adentro} />
      </g>
      <Contorno />
    </>
  );
}
