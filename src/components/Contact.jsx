import ProfileCard from './MyComponents/ProfileCard.jsx';
import SectionSky from './UI/SectionSky.jsx';
import SectionHead from './UI/SectionHead.jsx';
import { asset } from '../assets.js';

export default function Contact() {
  return (
    <section id="contacto" className="section">
      <SectionSky patron="senal" />
      <div className="container">
        <SectionHead id="contacto" num="04" kickerEs="Trabajemos juntos" kickerEn="Let&rsquo;s work together"
          titleEs="Contacto" titleEn="Contact" />

        <div className="contact">
          <div className="profile-wrap reveal">
            <ProfileCard
              name="Martín Sogoloff"
              title="Software Developer · UX/UI"
              handle="Marto-ZZ"
              status="Disponible"
              contactText="Contacto"
              avatarUrl={asset('/images/profile.jpeg')}
              miniAvatarUrl={asset('/images/profile2.png')}
              iconUrl=""
              grainUrl=""
              innerGradient="linear-gradient(145deg, var(--accent-soft) 0%, var(--accent-glow) 100%)"
              behindGlowColor="var(--accent-glow)"
              onContactClick={() => {
                const target = document.querySelector('.contact-grid');
                if (!target) return;
                if (window.__lenis) {
                  const off = -(window.innerHeight / 2 - target.getBoundingClientRect().height / 2);
                  window.__lenis.scrollTo(target, { offset: off });
                } else {
                  target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }}
             />
          </div>

          <p className="contact-lead reveal"
            data-es="¿Tenés un proyecto en mente? Estoy disponible para trabajo, freelance y colaboraciones."
            data-en="Got a project in mind? I'm open to work, freelance and collaborations.">
            ¿Tenés un proyecto en mente? Estoy disponible para trabajo, freelance y colaboraciones.
          </p>

          {/* El email es la acción principal: antes las tres vías pesaban
              exactamente igual y ninguna se leía como "el" siguiente paso. */}
          <div className="contact-grid">
            <a className="contact-card contact-card--primary reveal" href="mailto:martinsogoloff@gmail.com">
              <span className="cc-ico"><i className="fa-solid fa-envelope" aria-hidden="true"></i></span>
              <span className="cc-label">Email</span>
              <span className="cc-handle">martinsogoloff@gmail.com</span>
              <span className="cc-cta" data-es="Escribime" data-en="Write to me">Escribime</span>
            </a>
            <a className="contact-card reveal" href="https://www.linkedin.com/in/mart%C3%ADn-sogoloff/" target="_blank" rel="noopener">
              <span className="cc-ico"><i className="devicon-linkedin-plain"></i></span>
              <span className="cc-label">LinkedIn</span>
              <span className="cc-handle">martín-sogoloff</span>
            </a>
            <a className="contact-card reveal" href="https://github.com/Marto-ZZ" target="_blank" rel="noopener">
              <span className="cc-ico"><i className="devicon-github-original"></i></span>
              <span className="cc-label">GitHub</span>
              <span className="cc-handle">Marto-ZZ</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
