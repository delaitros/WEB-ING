/* ============================================================
   GV INGENIEROS — script.js v2
   ============================================================ */

/* ---- Header scroll state ---- */
const header = document.getElementById('header');
const waBtn   = document.getElementById('waBtn');

function onScroll() {
  const y = window.scrollY;
  header.classList.toggle('scrolled', y > 20);
  // Show WA button after 300px
  waBtn.classList.toggle('visible', y > 300);
  // Parallax hero bg
  const heroBg = document.getElementById('heroParallax');
  if (heroBg) heroBg.style.transform = `translateY(${y * 0.28}px)`;
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---- Mobile nav toggle ---- */
const navToggle = document.getElementById('navToggle');
const nav       = document.getElementById('nav');

navToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  navToggle.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', open);
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  navToggle.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
}));

/* ---- Reveal on scroll (IntersectionObserver) ---- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (!e.isIntersecting) return;
    // stagger siblings
    const siblings = Array.from(e.target.parentElement.querySelectorAll('.reveal'));
    const idx = siblings.indexOf(e.target);
    e.target.style.transitionDelay = `${idx * 0.09}s`;
    e.target.classList.add('visible');
    revealObserver.unobserve(e.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ---- Animated counters ---- */
function animateCounter(el, target, duration = 1600) {
  const startTime = performance.now();
  const easeOut = t => 1 - Math.pow(1 - t, 3);

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    el.textContent = Math.round(easeOut(progress) * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const target = parseInt(e.target.dataset.target, 10);
    if (!isNaN(target)) animateCounter(e.target, target);
    counterObserver.unobserve(e.target);
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

/* ---- Progress bar animation ---- */
const progressObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const bar = e.target.querySelector('.report-progress__bar');
    if (bar) bar.style.width = bar.dataset.width + '%';
    progressObserver.unobserve(e.target);
  });
}, { threshold: 0.4 });

document.querySelectorAll('.report-card').forEach(el => progressObserver.observe(el));

/* Set progress bar width from data attribute */
document.querySelectorAll('.report-progress__bar').forEach(bar => {
  const w = bar.getAttribute('data-width');
  if (w) bar.style.setProperty('--target-width', w + '%');
});

/* ---- Active nav link highlight ---- */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav__link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    navLinks.forEach(l => l.classList.remove('nav__link--active'));
    const active = document.querySelector(`.nav__link[href="#${e.target.id}"]`);
    if (active) active.classList.add('nav__link--active');
  });
}, { threshold: 0.35 });

sections.forEach(s => sectionObserver.observe(s));

/* ---- Contact form → WhatsApp ---- */
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const nombre   = document.getElementById('nombre').value.trim();
  const email    = document.getElementById('email').value.trim();
  const servicio = document.getElementById('servicio').value;
  const mensaje  = document.getElementById('mensaje').value.trim();

  if (!nombre || !email || !servicio) return;

  const text = encodeURIComponent(
    `Hola GV Ingenieros,\n\nEmpresa/Contacto: ${nombre}\nEmail: ${email}\nServicio: ${servicio}` +
    (mensaje ? `\n\nMensaje: ${mensaje}` : '') +
    `\n\nQuedo a disposición. Saludos.`
  );
  window.open(`https://wa.me/5492804551369?text=${text}`, '_blank', 'noopener,noreferrer');
});

/* ---- Smooth image fade-in on load ---- */
document.querySelectorAll('img').forEach(img => {
  img.style.opacity = '0';
  img.style.transition = 'opacity 0.6s ease';
  if (img.complete) {
    img.style.opacity = '1';
  } else {
    img.addEventListener('load', () => { img.style.opacity = '1'; });
    img.addEventListener('error', () => { img.style.opacity = '1'; }); // show fallback
  }
});
