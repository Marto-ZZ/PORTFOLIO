import LunaDibujo, { LunaClip } from './LunaDibujo.jsx';
import './SectionMoon.css';

export default function SectionMoon({ tone = 'rocosa' }) {
  return (
    <svg className="section-moon" viewBox="-1.3 -1.3 2.6 2.6" aria-hidden="true">
      <defs>
        <LunaClip />
        <radialGradient id={`halo-${tone}`} cx="50%" cy="50%" r="50%">
          <stop offset="62%" stopColor="var(--sx)" stopOpacity="0.16" />
          <stop offset="100%" stopColor="var(--sx)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="0" cy="0" r="1.3" fill={`url(#halo-${tone})`} />
      <LunaDibujo tone={tone} />
    </svg>
  );
}
