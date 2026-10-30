import SectionMoon from './SectionMoon.jsx';
import { LUNAS } from './moons.js';

export default function SectionHead({ id, num, kickerEs, kickerEn, titleEs, titleEn }) {
  const luna = LUNAS[id];
  return (
    <header className="section-head reveal">
      <SectionMoon tone={luna?.tone} />
      <div className="section-head-txt">
        <span className="kicker">
          <span className="kicker-num">{num}</span>
          <span data-es={kickerEs} data-en={kickerEn}>{kickerEs}</span>
        </span>
        <h2 className="section-title" data-es={titleEs} data-en={titleEn}>{titleEs}</h2>
      </div>
    </header>
  );
}
