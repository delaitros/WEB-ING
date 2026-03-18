/* ============================================================
   GV INGENIEROS — Main Script
   ============================================================ */

/* ---- Sticky Header ---- */
const header = document.getElementById('header');

function updateHeader() {
  if (window.scrollY > 20) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

/* ---- Mobile Nav Toggle ---- */
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');

navToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('nav--open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

// Close nav on link click
nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('nav--open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* ---- Parallax Hero ---- */
const heroParallax = document.getElementById('heroParallax');

function updateParallax() {
  if (!heroParallax) return;
  const scrollY = window.scrollY;
  heroParallax.style.transform = `translateY(${scrollY * 0.35}px)`;
}

window.addEventListener('scroll', updateParallax, { passive: true });

/* ---- Stagger Animations (Intersection Observer) ---- */
const staggerObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        staggerObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.stagger-item').forEach(el => {
  staggerObserver.observe(el);
});

/* ---- Contact Form ---- */
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const email = document.getElementById('email').value.trim();
  const servicio = document.getElementById('servicio').value;
  const mensaje = document.getElementById('mensaje').value.trim();

  if (!nombre || !email || !servicio) return;

  const text = encodeURIComponent(
    `Hola GV Ingenieros,\n\nNombre/Empresa: ${nombre}\nEmail: ${email}\nServicio: ${servicio}\n${mensaje ? `\nMensaje: ${mensaje}` : ''}\n\nQuedo a disposición. Saludos.`
  );

  window.open(`https://wa.me/5492804551369?text=${text}`, '_blank', 'noopener,noreferrer');
});

/* ---- Smooth active nav link on scroll ---- */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove('nav__link--active'));
        const activeLink = document.querySelector(`.nav__link[href="#${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add('nav__link--active');
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach(section => sectionObserver.observe(section));
