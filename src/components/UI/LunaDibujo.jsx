import { asset } from '../../assets.js';
import { LunaVolcanica, LunaHelada } from './LunasDoodle.jsx';
import './LunaDibujo.css';

const RASTER = {
  rocosa:  { href: asset('/images/luna-rocosa.png'),  vb: 1.05 },
  gaseosa: { href: asset('/images/luna-gaseosa.png'), vb: 1.25 },
};

const DOODLE = {
  volcanica: LunaVolcanica,
  helada: LunaHelada,
};

export function LunaClip({ id = 'lunaClip' }) {
  return (
    <clipPath id={id} clipPathUnits="userSpaceOnUse">
      <circle cx="0" cy="0" r="1" />
    </clipPath>
  );
}

export default function LunaDibujo({ tone = 'rocosa', clipId = 'lunaClip' }) {
  const Doodle = DOODLE[tone];
  if (Doodle) return <Doodle clipId={clipId} />;

  const { href, vb } = RASTER[tone] || RASTER.rocosa;
  return (
    <>
      <circle cx="0" cy="0" r="1" className="luna-disco" />
      <image href={href} x={-vb} y={-vb} width={vb * 2} height={vb * 2} />
    </>
  );
}
