/* ============================================================
   GV INGENIEROS — script.js v2
   ============================================================ */

/* ---- THEME TOGGLE ---- */
(function () {
  const root = document.documentElement;
  // Apply saved theme immediately to avoid flash
  if (localStorage.getItem('gv-theme') === 'light') {
    root.setAttribute('data-theme', 'light');
  }
  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isLight = root.getAttribute('data-theme') === 'light';
      if (isLight) {
        root.removeAttribute('data-theme');
        localStorage.setItem('gv-theme', 'dark');
      } else {
        root.setAttribute('data-theme', 'light');
        localStorage.setItem('gv-theme', 'light');
      }
    });
  });
})();

/* ---- SPLASH SCREEN ---- */
(function () {
  const splash = document.getElementById('splash');
  if (!splash) return;

  // Prevent background scroll while splash is visible
  document.body.style.overflow = 'hidden';

  // Dismiss after 2.6s → fade out over 0.9s → remove
  setTimeout(() => {
    splash.classList.add('out');
    document.body.style.overflow = '';
    setTimeout(() => splash.remove(), 950);
  }, 2600);

  // Also allow skipping on tap/click
  splash.addEventListener('click', () => {
    splash.classList.add('out');
    document.body.style.overflow = '';
    setTimeout(() => splash.remove(), 950);
  }, { once: true });
})();

/* ---- Header scroll state ---- */
const header  = document.getElementById('header');
const waBtn   = document.getElementById('waBtn');
const hasHero = !!document.getElementById('heroParallax');

function onScroll() {
  const y = window.scrollY;
  // Only toggle scrolled class when there's a hero (subpages keep header always opaque)
  if (hasHero) header.classList.toggle('scrolled', y > 20);
  // Show WA button after 300px
  if (waBtn) waBtn.classList.toggle('visible', y > 300);
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

/* ---- Nav Dropdown ---- */
document.querySelectorAll('.nav__dropdown').forEach(dropdown => {
  const btn = dropdown.querySelector('.nav__dropdown-btn');
  if (!btn) return;
  btn.addEventListener('click', e => {
    e.stopPropagation();
    dropdown.classList.toggle('open');
    document.querySelectorAll('.nav__dropdown').forEach(other => {
      if (other !== dropdown) other.classList.remove('open');
    });
  });
});
document.addEventListener('click', () => {
  document.querySelectorAll('.nav__dropdown').forEach(d => d.classList.remove('open'));
});

/* ---- Contact form → WhatsApp ---- */
const _contactForm = document.getElementById('contactForm');
if (_contactForm) _contactForm.addEventListener('submit', e => {
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
  window.open(`https://wa.me/5492804581369?text=${text}`, '_blank', 'noopener,noreferrer');
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

/* ---- Scroll Progress Bar ---- */
(function () {
  const bar = document.getElementById('scrollProgressBar');
  if (!bar) return;
  function update() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ---- Timeline active on scroll ---- */
(function () {
  const timelineEl    = document.getElementById('timeline');
  const fillEl        = document.getElementById('timelineFill');
  const timelineItems = document.querySelectorAll('.timeline__item');
  if (!timelineEl || !fillEl || !timelineItems.length) return;

  function update() {
    const rect     = timelineEl.getBoundingClientRect();
    const lineTop  = rect.top + window.scrollY + 8;
    const lineH    = timelineEl.offsetHeight - 16;
    const scrollMid = window.scrollY + window.innerHeight * 0.55;
    const progress = Math.min(1, Math.max(0, (scrollMid - lineTop) / lineH));
    fillEl.style.height = (progress * 100) + '%';

    timelineItems.forEach(item => {
      const dotY = item.querySelector('.timeline__dot').getBoundingClientRect().top + window.scrollY;
      item.classList.toggle('is-active', dotY <= scrollMid);
    });
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ---- Blueprint: loop continuo dibuja → pausa → borra → repite ---- */
(function () {
  const stage = document.getElementById('bpStage');
  if (!stage) return;

  const DRAW_END  = 4600;  // ms hasta que termina el último trazo
  const HOLD      = 2800;  // ms de pausa con todo dibujado
  const ERASE_DUR = 500;   // ms de borrado rápido
  const PAUSE     = 400;   // ms de silencio antes del próximo ciclo

  function cycle() {
    // 1. Dibujar
    stage.classList.remove('bp-erasing');
    void stage.offsetWidth;          // forzar reflow para reiniciar transiciones
    stage.classList.add('bp-active');

    // 2. Después de terminar de dibujar + pausa, borrar
    setTimeout(function () {
      stage.classList.add('bp-erasing');
      stage.classList.remove('bp-active');

      // 3. Después de borrar, esperar y reiniciar
      setTimeout(function () {
        stage.classList.remove('bp-erasing');
        setTimeout(cycle, PAUSE);
      }, ERASE_DUR);
    }, DRAW_END + HOLD);
  }

  // Arrancar cuando entra en el viewport (solo la primera vez)
  var started = false;
  var obs = new IntersectionObserver(function (entries) {
    if (!entries[0].isIntersecting || started) return;
    started = true;
    cycle();
  }, { threshold: 0.15 });
  obs.observe(stage);
})();

/* ---- Gauges: animar aguja y arco al hacer scroll ---- */
(function () {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('active');
      obs.unobserve(e.target);
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('.gauge').forEach(g => obs.observe(g));
})();

/* ---- Bento cards: touch/click toggle for devices without hover ---- */
document.addEventListener('DOMContentLoaded', () => {
  const isTouchOnly = () => window.matchMedia('(hover: none)').matches;
  document.querySelectorAll('.bento__card').forEach(card => {
    card.addEventListener('click', e => {
      if (!isTouchOnly()) return;          // desktop hover handles it
      if (e.target.closest('.card-link')) return; // let link navigate
      const isOpen = card.classList.contains('is-open');
      document.querySelectorAll('.bento__card.is-open')
        .forEach(c => c.classList.remove('is-open'));
      if (!isOpen) card.classList.add('is-open');
    });
  });
});
