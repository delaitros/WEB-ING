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

/* ═══════════════════════════════════════════════════════════════
   GV CHAT WIDGET — iOS iMessage + macOS tab
═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── config ── */
  const WA_GV = '5492804581369';
  const WA_SVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';

  const ENGINEERS = [
    {
      id:      'vidal',
      name:    'Ingeniero Félix Vidal',
      short:   'Ingeniero Vidal',
      role:    'Higiene Laboral',
      wa:      WA_GV,
      waText:  'Hola Ingeniero Vidal, me comunico desde la web de GV Ingenieros.',
    },
    {
      id:      'galarza',
      name:    'Ingeniero Aldo Galarza',
      short:   'Ingeniero Galarza',
      role:    'Izaje & Presión',
      wa:      '5492804692596',
      waText:  'Hola Ingeniero Galarza, me comunico desde la web de GV Ingenieros.',
    },
  ];

  /* ── state ── */
  const s = { step: null, nombre: '', ubicacion: '', servicios: [] };
  let chatStarted = false;

  /* ── DOM ── */
  const $  = id => document.getElementById(id);
  const tab    = $('gvChatTab');
  const win    = $('gvChatWin');
  const msgs   = $('gvChatMsgs');
  const input  = $('gvChatInput');
  const send   = $('gvChatSend');
  const minBtn = $('gvChatMin');
  const clock  = $('gvChatClock');

  /* ── clock ── */
  function tickClock() {
    const t = new Date();
    clock.textContent = t.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false });
  }
  tickClock();
  setInterval(tickClock, 30000);

  /* ── ui helpers ── */
  const now = () => new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false });

  function scroll() {
    requestAnimationFrame(() => { msgs.scrollTop = msgs.scrollHeight; });
  }

  function addMsg(html, dir) {
    const el = document.createElement('div');
    el.className = 'gv-msg ' + (dir || 'inc');
    el.innerHTML = '<div class="gv-bubble">' + html + '</div><span class="gv-msg-time">' + now() + '</span>';
    msgs.appendChild(el);
    scroll();
    return el;
  }

  function typing(ms) {
    return new Promise(function (res) {
      const el = document.createElement('div');
      el.className = 'gv-typing';
      el.innerHTML = '<div class="gv-tdot"></div><div class="gv-tdot"></div><div class="gv-tdot"></div>';
      msgs.appendChild(el);
      scroll();
      setTimeout(function () { el.remove(); res(); }, ms || 1000);
    });
  }

  function qr(opts, cb) {
    const wrap = document.createElement('div');
    wrap.className = 'gv-qr';
    opts.forEach(function (o) {
      const label = typeof o === 'string' ? o : o.label;
      const val   = typeof o === 'string' ? o : o.value;
      const btn   = document.createElement('button');
      btn.className = 'gv-qr-btn';
      btn.textContent = label;
      btn.addEventListener('click', function () {
        wrap.remove();
        addMsg(label, 'out');
        cb(val, label);
      });
      wrap.appendChild(btn);
    });
    msgs.appendChild(wrap);
    scroll();
    return wrap;
  }

  function waLink(href, label) {
    const a = document.createElement('a');
    a.href = href; a.target = '_blank'; a.rel = 'noopener';
    a.className = 'gv-wa-cta';
    a.innerHTML = WA_SVG + label;
    msgs.appendChild(a);
    scroll();
    return a;
  }

  function showInput(ph) {
    $('gvChatBar').classList.remove('gv-hidden');
    input.placeholder = ph || 'Escribe un mensaje…';
    setTimeout(function () { input.focus(); }, 120);
  }
  function hideInput() {
    $('gvChatBar').classList.add('gv-hidden');
    input.value = '';
    send.classList.remove('gv-visible');
  }

  /* ── minimize / expand ── */
  function minimize() {
    win.classList.add('gv-hidden');
    win.setAttribute('aria-hidden', 'true');
    tab.classList.remove('gv-hidden');
  }
  function expand() {
    tab.classList.add('gv-hidden');
    win.classList.remove('gv-hidden');
    win.setAttribute('aria-hidden', 'false');
    scroll();
  }

  minBtn.addEventListener('click', minimize);
  tab.addEventListener('click', function () {
    expand();
    if (!chatStarted) { chatStarted = true; startChat(); }
  });

  /* ═══ CONVERSATION FLOW ═══ */

  async function startChat() {
    hideInput();
    /* date separator */
    const sep = document.createElement('div');
    sep.className = 'gv-msg-date';
    sep.textContent = new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
    msgs.appendChild(sep);

    await typing(700);
    addMsg('¡Hola! 👋 Soy el asistente de <strong>GV Ingenieros</strong>.');
    await typing(1050);
    addMsg('¿En qué área te podemos ayudar?');
    qr(
      ['Sistemas de Izaje', 'Aparatos sometidos a presión', 'Higiene Laboral', 'Consulta general'],
      stepService
    );
  }

  async function stepService(val) {
    s.servicios.push(val);
    await typing(900);
    addMsg('<strong>' + val + '</strong> es una de nuestras especialidades 💼<br>¿Te interesa algún otro servicio?');
    qr(
      ['Sí, ver más', 'No, continuar →'],
      async function (v) {
        if (v === 'Sí, ver más') {
          const rest = ['Sistemas de Izaje', 'Aparatos sometidos a presión', 'Higiene Laboral'].filter(function (x) {
            return !s.servicios.includes(x);
          });
          if (rest.length) {
            qr(rest, async function (v2) { s.servicios.push(v2); await stepLocation(); });
          } else {
            await stepLocation();
          }
        } else {
          await stepLocation();
        }
      }
    );
  }

  async function stepLocation() {
    await typing(800);
    addMsg('¿De qué ciudad o provincia sos?');
    s.step = 'location';
    showInput('Ej: Comodoro Rivadavia…');
  }

  async function stepName() {
    await typing(900);
    addMsg('¡<strong>' + s.ubicacion + '</strong>! Operamos mucho en esa zona 🗺️');
    await typing(700);
    addMsg('¿Cuál es tu nombre?');
    s.step = 'name';
    showInput('Tu nombre…');
  }

  async function stepEngineer() {
    hideInput();
    await typing(900);
    addMsg('Mucho gusto, <strong>' + s.nombre + '</strong> 👋');
    await typing(1100);
    addMsg('¿Querés hablar directamente con uno de nuestros ingenieros?');
    qr(
      ['Sí, quiero un ingeniero', 'No, solo tengo una consulta'],
      async function (v) {
        if (v.startsWith('Sí')) {
          await pickEngineer();
        } else {
          await sendConsulta();
        }
      }
    );
  }

  async function pickEngineer() {
    await typing(800);
    addMsg('¿Con qué área necesitás hablar?');
    qr(
      ENGINEERS.map(function (e) { return { label: e.short + ' — ' + e.role, value: e.id }; }),
      async function (id) {
        const eng = ENGINEERS.find(function (e) { return e.id === id; });
        await typing(700);
        addMsg('¡Perfecto! Tocá el botón para hablar con <strong>' + eng.name + '</strong> ahora mismo 👇');
        const txt = eng.waText + '\n\n👤 *Nombre:* ' + s.nombre +
                    '\n📍 *Ubicación:* ' + s.ubicacion +
                    '\n🔧 *Intereses:* ' + s.servicios.join(', ');
        waLink('https://wa.me/' + eng.wa + '?text=' + encodeURIComponent(txt),
               'Abrir WhatsApp con ' + eng.short.split(' ').pop());
        /* also notify GV team */
        notifyTeam(eng.name);
        s.step = 'done';
      }
    );
  }

  async function sendConsulta() {
    await typing(800);
    addMsg('¡Perfecto! Enviá tu consulta a nuestro equipo 📩');
    const txt = buildMsg(false);
    const btn = waLink('https://wa.me/' + WA_GV + '?text=' + encodeURIComponent(txt), 'Enviar consulta por WhatsApp');
    btn.addEventListener('click', function () {
      setTimeout(function () {
        btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="white"><polyline points="20 6 9 17 4 12" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg> ¡Enviado!';
        btn.style.background = '#1a56db';
        btn.style.pointerEvents = 'none';
      }, 500);
    });
    s.step = 'done';
  }

  function buildMsg(engName) {
    return '🏗️ *Nueva consulta — GV Ingenieros Web*\n\n' +
           '👤 *Nombre:* ' + s.nombre + '\n' +
           '📍 *Ubicación:* ' + s.ubicacion + '\n' +
           '🔧 *Servicios de interés:* ' + s.servicios.join(', ') + '\n' +
           '💬 *Solicitó ingeniero:* ' + (engName ? 'Sí (' + engName + ')' : 'No');
  }

  function notifyTeam(engName) {
    /* Fire-and-forget: open WA for the team notification in background */
    const url = 'https://wa.me/' + WA_GV + '?text=' + encodeURIComponent(buildMsg(engName));
    const a = document.createElement('a');
    a.href = url; a.target = '_blank'; a.rel = 'noopener';
    /* We don't auto-open to avoid pop-up blockers; the engineer WA btn is enough */
  }

  /* ── input handling ── */
  input.addEventListener('input', function () {
    send.classList.toggle('gv-visible', input.value.trim().length > 0);
  });
  input.addEventListener('keydown', function (e) { if (e.key === 'Enter') handleSend(); });
  send.addEventListener('click', handleSend);

  function handleSend() {
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    send.classList.remove('gv-visible');
    addMsg(text, 'out');
    if (s.step === 'location') { s.ubicacion = text; stepName(); }
    else if (s.step === 'name') { s.nombre = text; stepEngineer(); }
  }

})();
