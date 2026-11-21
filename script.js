/* ==========================================================================
   ABIN BINOY — PORTFOLIO  ·  script.js  (Vanilla JS, no dependencies)
   --------------------------------------------------------------------------
   1. CONFIG  ← contact-form credentials live here (see README.md)
   2. Helpers
   3. Split text, loader
   4. Navigation (scroll state, active link, mobile menu, smooth scroll)
   5. Reveal / skills / timelines
   6. 3D tilt + hero parallax
   7. Golden particles (canvas)
   8. Custom cursor (desktop only)
   9. Project modal
  10. Contact form (Formspree or EmailJS)
  ========================================================================== */

/* 1 ─ CONFIG ─────────────────────────────────────────────────────────── */
const CONFIG = {
  // Choose ONE: 'formspree' | 'emailjs' | 'none'
  // 'none' = form is not configured yet; visitors are offered the email/WhatsApp fallback.
  provider: 'none',

  // Option A — Formspree (easiest): create a form at https://formspree.io
  // and paste your endpoint, e.g. 'https://formspree.io/f/abcdwxyz'
  formspreeEndpoint: '',

  // Option B — EmailJS: https://www.emailjs.com  (free tier available)
  emailjs: {
    publicKey: '',   // Account → API keys → Public Key
    serviceId: '',   // Email Services → Service ID
    templateId: ''   // Email Templates → Template ID
    // Template variables available: {{from_name}} {{from_email}} {{subject}} {{message}}
  },

  fallbackEmail: 'abinbinoyporunnolil@gmail.com',
  fallbackWhatsApp: 'https://wa.me/919744119901'
};

/* Skill stage labels (levels are set with data-level in index.html) */
const LEVEL_LABELS = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced', expert: 'Expert' };

/* 2 ─ HELPERS ────────────────────────────────────────────────────────── */
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
const root = document.documentElement;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const safe = fn => { try { return fn(); } catch (e) { /* storage / API unavailable */ } };

/* 3 ─ SPLIT TEXT + LOADER ────────────────────────────────────────────── */
(function splitText() {
  let n = 0;
  $$('[data-split]').forEach(el => {
    const text = el.dataset.split;
    el.setAttribute('aria-hidden', 'true');
    [...text].forEach(ch => {
      const s = document.createElement('span');
      s.className = 'char';
      s.style.setProperty('--i', n++);
      s.textContent = ch;
      el.appendChild(s);
    });
  });
})();

(function loader() {
  const el = $('#loader');
  const bar = $('#loaderBar');
  let done = false;
  let pct = 0;

  const finish = () => {
    if (done) return;
    done = true;
    if (bar) bar.style.width = '100%';
    setTimeout(() => {
      if (el) el.classList.add('hide');
      root.classList.add('loaded');
      document.body.classList.remove('no-scroll');
      setTimeout(() => el && el.remove(), 1100);
    }, 350);
  };

  if (!el) { root.classList.add('loaded'); return; }
  document.body.classList.add('no-scroll');

  // fake-but-honest progress: creeps up until the real load event
  const tick = setInterval(() => {
    pct = Math.min(90, pct + Math.random() * 12);
    if (bar) bar.style.width = pct + '%';
  }, 180);

  const minTime = reduceMotion ? 200 : 1900;
  const start = performance.now();
  const ready = () => {
    clearInterval(tick);
    setTimeout(finish, Math.max(0, minTime - (performance.now() - start)));
  };

  if (document.readyState === 'complete') ready();
  else window.addEventListener('load', ready, { once: true });
  setTimeout(() => { clearInterval(tick); finish(); }, 6000); // safety net
})();

/* Footer year + skill level labels */
(function small() {
  const y = $('#year'); if (y) y.textContent = new Date().getFullYear();
  $$('.skill').forEach(s => {
    const lvl = (s.dataset.level || 'beginner').toLowerCase();
    const label = $('.skill-level', s);
    if (label) label.textContent = LEVEL_LABELS[lvl] || 'Beginner';
  });
})();

/* 4 ─ NAVIGATION ─────────────────────────────────────────────────────── */
(function navigation() {
  const nav = $('#nav');
  const burger = $('#burger');
  const links = $$('[data-nav]');
  const toTop = $('#toTop');
  const progress = $('#scrollProgress');
  const sections = links.map(a => $(a.getAttribute('href'))).filter(Boolean);
  const MQ = window.matchMedia('(max-width: 1180px)');

  /* scroll state (rAF throttled) */
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      nav.classList.toggle('scrolled', y > 24);
      toTop.classList.toggle('show', y > 700);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.setProperty('--sp', max > 0 ? clamp(y / max, 0, 1) : 0);
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* active section highlighting */
  const setActive = id => links.forEach(a => {
    const on = a.getAttribute('href') === '#' + id;
    a.classList.toggle('active', on);
    if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
  });
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(s => io.observe(s));
  }

  /* mobile menu */
  const setMenu = open => {
    nav.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('no-scroll', open);
    // keep hidden menu out of the tab order on mobile
    $('#navLinks').toggleAttribute('inert', MQ.matches && !open);
  };
  burger.addEventListener('click', () => setMenu(!nav.classList.contains('menu-open')));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('menu-open')) { setMenu(false); burger.focus(); }
  });
  const syncMenu = () => { if (!MQ.matches) { setMenu(false); $('#navLinks').removeAttribute('inert'); } else if (!nav.classList.contains('menu-open')) $('#navLinks').setAttribute('inert', ''); };
  MQ.addEventListener ? MQ.addEventListener('change', syncMenu) : MQ.addListener(syncMenu);
  syncMenu();

  /* smooth scrolling with fixed-nav offset (works for every in-page link) */
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const target = $(id);
    if (!target) return;
    e.preventDefault();
    if (nav.classList.contains('menu-open')) setMenu(false);
    const top = id === '#home' ? 0 : target.getBoundingClientRect().top + window.scrollY - (nav.offsetHeight - 4);
    window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
    history.replaceState(null, '', id);
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });

  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));
})();

/* 5 ─ REVEAL / TIMELINE PROGRESS ─────────────────────────────────────── */
(function reveal() {
  const items = $$('.reveal, .section-head');
  if (!('IntersectionObserver' in window)) { items.forEach(i => i.classList.add('in')); return; }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  items.forEach(i => io.observe(i));

  /* timeline gold line fills as you scroll */
  const timelines = $$('[data-timeline]');
  if (!timelines.length) return;
  let t = false;
  const update = () => {
    t = false;
    const vh = window.innerHeight;
    timelines.forEach(tl => {
      const r = tl.getBoundingClientRect();
      const p = clamp((vh * 0.6 - r.top) / r.height, 0, 1);
      tl.style.setProperty('--p', p.toFixed(3));
    });
  };
  const req = () => { if (!t) { t = true; requestAnimationFrame(update); } };
  window.addEventListener('scroll', req, { passive: true });
  window.addEventListener('resize', req);
  update();
})();

/* 6 ─ 3D TILT + HERO PARALLAX ────────────────────────────────────────── */
(function tilt() {
  if (!finePointer || reduceMotion) return;
  $$('[data-tilt]').forEach(el => {
    let raf = 0;
    const max = el.classList.contains('project') ? 7 : 4;
    el.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--mx', (x * 100) + '%');
        el.style.setProperty('--my', (y * 100) + '%');
        el.style.transform = `perspective(900px) rotateX(${((0.5 - y) * max).toFixed(2)}deg) rotateY(${((x - 0.5) * max * 1.3).toFixed(2)}deg) translateZ(0)`;
        el.style.transition = 'transform .12s ease-out, border-color .4s, box-shadow .4s';
      });
    });
    el.addEventListener('pointerleave', () => {
      cancelAnimationFrame(raf);
      el.style.transition = 'transform .7s cubic-bezier(.2,.8,.2,1), border-color .4s, box-shadow .4s';
      el.style.transform = '';
    });
  });
})();

(function parallax() {
  if (reduceMotion) return;
  const portrait = $('#portrait');
  const glow = $('.hero-glow');
  const hero = $('#home');
  if (!portrait || !hero) return;
  let mx = 0, my = 0, sy = 0, raf = 0;

  const apply = () => {
    raf = 0;
    const s = clamp(sy, 0, window.innerHeight);
    portrait.style.transform = `translate3d(${mx * 14}px, ${my * 10 - s * 0.06}px, 0)`;
    if (glow) glow.style.transform = `translate3d(${mx * -24}px, ${my * -16 + s * 0.12}px, 0)`;
  };
  const req = () => { if (!raf) raf = requestAnimationFrame(apply); };

  if (finePointer) {
    hero.addEventListener('pointermove', e => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
      req();
    });
  }
  window.addEventListener('scroll', () => { sy = window.scrollY; req(); }, { passive: true });
})();

/* 7 ─ GOLDEN PARTICLES (canvas) ──────────────────────────────────────── */
(function particles() {
  const canvas = $('#particles');
  if (!canvas || reduceMotion) { if (canvas) canvas.remove(); return; }
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  let w, h, dpr, parts = [], running = true, last = 0;

  const count = () => clamp(Math.round((window.innerWidth * window.innerHeight) / 24000), 24, 70);
  const make = () => ({
    x: Math.random() * w, y: Math.random() * h,
    r: Math.random() * 1.6 + 0.4,
    vx: (Math.random() - 0.5) * 0.18,
    vy: -(Math.random() * 0.32 + 0.08),
    a: Math.random() * 0.5 + 0.15,
    tw: Math.random() * Math.PI * 2,
    ts: Math.random() * 0.02 + 0.006
  });
  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    parts = Array.from({ length: count() }, make);
  };
  const frame = t => {
    if (!running) return;
    requestAnimationFrame(frame);
    if (t - last < 32) return; // ~30fps cap keeps it light
    last = t;
    ctx.clearRect(0, 0, w, h);
    for (const p of parts) {
      p.x += p.vx; p.y += p.vy; p.tw += p.ts;
      if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
      if (p.x < -10) p.x = w + 10; else if (p.x > w + 10) p.x = -10;
      const o = p.a * (0.6 + 0.4 * Math.sin(p.tw));
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
      g.addColorStop(0, `rgba(230,199,122,${o})`);
      g.addColorStop(1, 'rgba(212,175,55,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2); ctx.fill();
    }
  };
  let rt;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(resize, 200); });
  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    if (running) requestAnimationFrame(frame);
  });
  resize();
  requestAnimationFrame(frame);
})();

/* 8 ─ CUSTOM CURSOR (fine pointers only) ─────────────────────────────── */
(function cursor() {
  const dot = $('#cursorDot'), ring = $('#cursorRing');
  if (!dot || !ring) return;
  if (!finePointer) { dot.remove(); ring.remove(); return; }
  let x = -100, y = -100, rx = -100, ry = -100, started = false;

  window.addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    x = e.clientX; y = e.clientY;
    dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    if (!started) { started = true; rx = x; ry = y; root.classList.add('has-cursor'); }
    root.classList.remove('cursor-hidden');
  }, { passive: true });
  document.addEventListener('pointerleave', () => root.classList.add('cursor-hidden'));
  document.addEventListener('mouseleave', () => root.classList.add('cursor-hidden'));
  document.addEventListener('pointerover', e => {
    ring.classList.toggle('is-hover', !!e.target.closest('a, button, input, textarea, label, [data-tilt]'));
  });

  const loop = () => {
    rx += (x - rx) * 0.16; ry += (y - ry) * 0.16;
    ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
    requestAnimationFrame(loop);
  };
  loop();
})();

/* 9 ─ PROJECT DETAILS MODAL ──────────────────────────────────────────── */
(function modal() {
  const m = $('#projectModal');
  if (!m) return;
  const panel = $('.modal-panel', m);
  let lastFocus = null;

  const fill = card => {
    $('#modalImg').src = $('img', card).src;
    $('#modalImg').alt = $('img', card).alt;
    $('#modalType').textContent = $('[data-field="type"]', card).textContent;
    $('#modalTitle').textContent = $('[data-field="title"]', card).textContent;
    $('#modalDesc').innerHTML = $('[data-field="desc"]', card).innerHTML;
    $('#modalTags').innerHTML = $('[data-field="tags"]', card).innerHTML;
    $('#modalExtra').innerHTML = $('.project-extra', card).innerHTML;
    const repo = $('[data-repo]', card);
    if (repo) $('#modalRepo').href = repo.href;
  };

  const open = card => {
    lastFocus = document.activeElement;
    fill(card);
    m.hidden = false;
    document.body.classList.add('no-scroll');
    panel.focus();
  };
  const close = () => {
    m.hidden = true;
    document.body.classList.remove('no-scroll');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  };

  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-open-project]');
    if (btn) { open(btn.closest('[data-project]')); return; }
    if (e.target.closest('[data-close-modal]')) close();
  });

  document.addEventListener('keydown', e => {
    if (m.hidden) return;
    if (e.key === 'Escape') { close(); return; }
    if (e.key === 'Tab') { // focus trap
      const f = $$('a[href], button:not([disabled])', m).filter(el => el.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], lastEl = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === panel)) { e.preventDefault(); lastEl.focus(); }
      else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); first.focus(); }
    }
  });
})();

/* 10 ─ CONTACT FORM ──────────────────────────────────────────────────── */
(function contactForm() {
  const form = $('#contactForm');
  if (!form) return;
  const status = $('#formStatus');
  const submit = $('#cfSubmit');

  const rules = {
    name: v => v.trim().length >= 2 || 'Please enter your name (at least 2 characters).',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Please enter a valid email address.',
    subject: v => v.trim().length >= 3 || 'Please add a subject (at least 3 characters).',
    message: v => v.trim().length >= 10 || 'Your message should be at least 10 characters.'
  };

  const setError = (name, msg) => {
    const input = form.elements[name];
    const err = $('#err-' + name);
    input.closest('.field').classList.toggle('invalid', !!msg);
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (msg) input.setAttribute('aria-describedby', 'err-' + name); else input.removeAttribute('aria-describedby');
    err.textContent = msg || '';
  };
  const validateField = name => {
    const r = rules[name](form.elements[name].value);
    setError(name, r === true ? '' : r);
    return r === true;
  };
  Object.keys(rules).forEach(n => {
    form.elements[n].addEventListener('blur', () => validateField(n));
    form.elements[n].addEventListener('input', () => { if (form.elements[n].closest('.field').classList.contains('invalid')) validateField(n); });
  });

  const show = (type, html) => { status.className = 'form-status ' + type; status.innerHTML = html; };
  const mailtoHref = d => `mailto:${CONFIG.fallbackEmail}?subject=${encodeURIComponent(d.subject)}&body=${encodeURIComponent(d.message + '\n\n— ' + d.name + ' (' + d.email + ')')}`;
  const fallbackHtml = d => `You can reach me directly instead: <a href="${mailtoHref(d)}">send an email</a> or <a href="${CONFIG.fallbackWhatsApp}" target="_blank" rel="noopener noreferrer">message me on WhatsApp</a>.`;

  const configured = () => {
    if (CONFIG.provider === 'formspree') return /^https:\/\/formspree\.io\/f\/\w+/.test(CONFIG.formspreeEndpoint);
    if (CONFIG.provider === 'emailjs') { const c = CONFIG.emailjs; return !!(c.publicKey && c.serviceId && c.templateId); }
    return false;
  };

  async function send(d) {
    if (CONFIG.provider === 'formspree') {
      const res = await fetch(CONFIG.formspreeEndpoint, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: d.name, email: d.email, subject: d.subject, message: d.message, _replyto: d.email })
      });
      if (!res.ok) throw new Error('Formspree ' + res.status);
      return;
    }
    // EmailJS REST API — no SDK needed
    const c = CONFIG.emailjs;
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: c.serviceId, template_id: c.templateId, user_id: c.publicKey,
        template_params: { from_name: d.name, from_email: d.email, reply_to: d.email, subject: d.subject, message: d.message }
      })
    });
    if (!res.ok) throw new Error('EmailJS ' + res.status);
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    status.className = 'form-status'; status.textContent = '';

    // honeypot: silently pretend success to bots
    if (form.elements['_gotcha'].value) { show('ok', 'Thank you!'); form.reset(); return; }

    const valid = Object.keys(rules).map(validateField).every(Boolean);
    if (!valid) {
      show('err', 'Please fix the highlighted fields and try again.');
      const firstBad = Object.keys(rules).find(n => form.elements[n].closest('.field').classList.contains('invalid'));
      if (firstBad) form.elements[firstBad].focus();
      return;
    }

    const data = { name: form.elements.name.value.trim(), email: form.elements.email.value.trim(), subject: form.elements.subject.value.trim(), message: form.elements.message.value.trim() };

    if (!configured()) {
      show('err', 'The message form is not connected yet, so nothing was sent. ' + fallbackHtml(data));
      return;
    }

    submit.classList.add('is-loading'); submit.disabled = true;
    try {
      await send(data);
      show('ok', 'Thank you, ' + data.name.split(' ')[0].replace(/[<>&"]/g, '') + '! Your message has been sent. I\'ll get back to you soon.');
      form.reset();
      Object.keys(rules).forEach(n => setError(n, ''));
    } catch (err) {
      show('err', 'Sorry, something went wrong while sending. ' + fallbackHtml(data));
    } finally {
      submit.classList.remove('is-loading'); submit.disabled = false;
    }
  });
})();
