/* ============================================================
   EDEM Times — chrome.js
   Lo mínimo que necesitan las páginas del portal de noticias para
   que la cabecera y el pie se comporten igual que en la home:
   menú móvil, iconos y aparición al hacer scroll.

   En index.html NO se carga: de eso ya se encarga js/app.js, que
   además lleva el hero, el visor y el sistema de diseño.
   ============================================================ */
'use strict';

(function () {
  const $ = id => document.getElementById(id);
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- menú móvil ---------- */
  const menubtn = $('menubtn'), mnav = $('mnav'), mscrim = $('mscrim');
  if (menubtn && mnav) {
    let scrimT;
    function setMenu(open) {
      mnav.classList.toggle('open', open);
      menubtn.setAttribute('aria-expanded', String(open));
      menubtn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      menubtn.innerHTML = '<i data-lucide="' + (open ? 'x' : 'menu') + '" class="lu"></i>';
      if (window.lucide) lucide.createIcons();
      clearTimeout(scrimT);
      if (!mscrim) return;
      if (open) {
        mscrim.hidden = false;
        requestAnimationFrame(() => mscrim.classList.add('on'));
      } else {
        mscrim.classList.remove('on');
        scrimT = setTimeout(() => { mscrim.hidden = true; }, 280);
      }
    }
    const closeMenu = () => { if (mnav.classList.contains('open')) setMenu(false); };
    menubtn.addEventListener('click', () => setMenu(!mnav.classList.contains('open')));
    mnav.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
    if (mscrim) mscrim.addEventListener('click', closeMenu);
    addEventListener('keydown', e => { if (e.key === 'Escape') { closeMenu(); } });
    // Safari < 14 no tiene addEventListener en MediaQueryList (ver app.js)
    const mq = matchMedia('(min-width:681px)');
    const onWide = e => { if (e.matches) closeMenu(); };
    if (mq.addEventListener) mq.addEventListener('change', onWide);
    else if (mq.addListener) mq.addListener(onWide);
    window.closeMenu = closeMenu;
  }

  /* ---------- aparición al hacer scroll ----------
     Mismo contrato que en app.js: news.js llama a window.observeReveals()
     después de pintar para dar de alta lo que acaba de crear. */
  let io = null;
  window.observeReveals = function () {
    if (REDUCED.matches) { document.querySelectorAll('.rv').forEach(el => el.classList.add('in')); return; }
    if (!io) {
      io = new IntersectionObserver(es => es.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      }), { threshold: .12, rootMargin: '0px 0px -5% 0px' });
    }
    document.querySelectorAll('.rv:not(.in)').forEach(el => io.observe(el));
  };

  /* ---------- suscripción al boletín (mismo formulario que la home) ---------- */
  const form = $('sub-form');
  if (form) form.addEventListener('submit', async e => {
    e.preventDefault();
    const msg = $('sub-msg');
    if (form.empresa && form.empresa.value) return;            // honeypot
    const email = form.email.value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      msg.textContent = 'Revisa el email: no parece válido.'; msg.classList.add('err'); form.email.focus(); return;
    }
    msg.classList.remove('err');
    const btn = form.querySelector('button[type=submit]');
    btn.disabled = true;
    let endpoint = '';
    try {
      const r = await fetch('data/content.json', { cache: 'no-cache' });
      if (r.ok) endpoint = ((await r.json()).newsletter || {}).endpoint || '';
    } catch (_) { /* sin JSON: modo demo */ }
    try {
      if (endpoint) {
        const r = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, list: 'edem-times' }) });
        if (!r.ok) throw new Error('HTTP ' + r.status);
      } else {
        try { localStorage.setItem('edemtimes-sub', email); } catch (_) { /* navegación privada */ }
      }
      msg.textContent = '¡Bienvenido a bordo! Te avisaremos con cada nueva edición ⚓';
      form.reset();
    } catch (_) {
      msg.textContent = 'No hemos podido suscribirte ahora mismo. Inténtalo de nuevo en unos minutos.';
      msg.classList.add('err');
    } finally { btn.disabled = false; }
  });

  /* ---------- arranque ---------- */
  function boot() {
    if (window.lucide) lucide.createIcons();
    window.observeReveals();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
