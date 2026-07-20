/* ============================================================
   EDEM Times — app.js
   Contenido dirigido por data/content.json (editable a mano o
   desde un CMS). Si el fetch falla (p. ej. abriendo el archivo
   en local sin servidor), se usa el catálogo embebido DEFAULTS.
   ============================================================ */
'use strict';

const DEFAULTS = {
  site: { latest: 'n2' },
  newsletter: { endpoint: '' },
  issues: [
    {
      id: 'n2', file: 'revistas/n2.html', print: 'revistas/n2.html',
      nr: 'Nº 2 · 2026', title: 'Tracción', chip: 'Nº 2 · Tracción',
      badge: 'Última edición', badgeColor: 'lanzadera',
      desc: 'Crónica del Hackathon, entrevista cruzada alumno × CEO, radar Lanzadera, métricas de Angels y pasatiempos.',
      meta: '24 páginas · edición física + digital · 2026',
      hero: {
        kicker: 'Nº 2 · 2026 · Última edición',
        titleHtml: 'Trac&shy;ción<span class="pt">.</span>',
        num: '2',
        sub: 'El arte de hacer que las cosas funcionen',
        lead: '24 páginas a toda máquina: la crónica del Hackathon desde dentro, una entrevista cruzada alumno × CEO, el radar de Lanzadera, las métricas que mira Angels y pasatiempos para el trayecto de vuelta.',
        chips: ['24 páginas', 'Edición física + digital', 'Marina de Empresas']
      }
    },
    {
      id: 'n1v2', file: 'revistas/n1-v2.html', print: 'revistas/n1-v2-print.html',
      nr: 'Nº 1 · 2026', title: 'Bienvenidos a EDEM', chip: 'Nº 1 · Contracorriente',
      badge: 'Contracorriente', badgeColor: 'edem',
      desc: 'El número fundacional: el manual de supervivencia en la Marina, tipografía brutal, sellos, radar Lanzadera y duotonos.',
      meta: '10 páginas · edición física + digital · 2026'
    },
    {
      id: 'n1', file: 'revistas/n1.html', print: 'revistas/n1-print.html',
      nr: 'Nº 1 · maqueta', title: 'Bienvenidos a EDEM', chip: 'Nº 1 · maqueta',
      badge: 'Archivo', badgeColor: 'angels',
      desc: 'La primera maqueta del piloto: el origen de EDEM Times, de portada a contraportada.',
      meta: '10 páginas · maqueta inicial'
    }
  ],
  articles: [
    { issue: 'n2', color: 'edem', cat: 'Pasillo EDEM', title: 'El Hackathon desde dentro: 48 horas a toda máquina', excerpt: 'Crónica en primera persona del fin de semana en el que 120 alumnos convirtieron café y post-its en cinco empresas reales.', page: 4, img: 'assets/img/perfil-ee.jpg' },
    { issue: 'n2', color: 'lanzadera', cat: 'Radar Lanzadera', title: '3 startups de Lanzadera rompiendo moldes', excerpt: 'Del muelle al mercado global: las apuestas del último cohorte que ya mueven el Mediterráneo.', page: 12, img: 'assets/img/intro-grados.jpg' },
    { issue: 'n2', color: 'angels', cat: 'Angels', title: 'Los secretos de Angels para medir el éxito', excerpt: 'Las métricas que un inversor mira antes que cualquier promesa — y las que ignora por completo.', page: 14, img: 'assets/img/campus-talento.jpg' }
  ],
  ecosystem: [
    { name: 'EDEM', role: 'Formar', color: 'edem', url: 'https://edem.eu/', desc: 'Escuela de empresarios y directivos en Valencia. Grados, másteres y alta dirección con una regla: se aprende haciendo.', img: 'assets/img/eco-edem.jpg', alt: 'Fachada de EDEM en la Marina de València, con la grúa del puerto al lado', meta: 'Aquí se hace esta revista' },
    { name: 'Lanzadera', role: 'Acelerar', color: 'lanzadera', url: 'https://lanzadera.es/', desc: 'La aceleradora que empuja startups desde el muelle de la Marina hasta el mercado. Su radar llena páginas de esta revista.', img: 'assets/img/eco-lanzadera.jpg', alt: 'Equipo de una startup trabajando en las oficinas de Lanzadera', meta: 'Sección «Radar Lanzadera»' },
    { name: 'Angels', role: 'Invertir', color: 'angels', url: 'https://www.angelscapital.es/', desc: 'La sociedad de inversión de Juan Roig. Capital y criterio para los líderes que eligen la opción difícil.', img: 'assets/img/eco-angels.jpg', alt: 'Público de inversores en el Investors Day de Angels', meta: 'Sección «Angels»' }
  ],
  social: [
    { id: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/school/edem-escuela-de-empresarios/' },
    { id: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/edemempresarios/' },
    { id: 'youtube', label: 'YouTube', url: 'https://www.youtube.com/user/EDEMEmpresariosEs' }
  ]
};

const ECO_COLORS = { edem: 'var(--edem)', lanzadera: 'var(--lanzadera)', angels: 'var(--angels)', neutral: 'var(--ink-500)' };
const color = c => ECO_COLORS[c] || ECO_COLORS.neutral;
const esc = s => String(s ?? '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
const $ = id => document.getElementById(id);
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)');

let C = DEFAULTS;
let MAGS = DEFAULTS.issues;

const SOC_SVG = {
  linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>',
  instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>',
  youtube: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>'
};

/* ================= render de la home ================= */
function latestIssue() { return MAGS.find(m => m.id === C.site.latest) || MAGS[0]; }

function renderHero() {
  const m = latestIssue(), h = m.hero || {};
  if (h.kicker) $('hero-kicker').textContent = h.kicker;
  if (h.titleHtml) $('hero-title').innerHTML = h.titleHtml;
  if (h.num) $('hero-num').textContent = h.num;
  if (h.sub) $('hero-sub').textContent = h.sub;
  if (h.lead) $('hero-lead').textContent = h.lead;
  if (h.chips) $('hero-chips').innerHTML = h.chips.map(c => '<span class="chip">' + esc(c) + '</span>').join('');
  buildDeck();
}

/* ---- pila de portadas del hero: rota entre ediciones ---- */
let deckOrder = [], deckTimer = null, deckPaused = false;
const issueNum = m => (m.hero && m.hero.num) || (String(m.nr || '').match(/\d+/) || ['•'])[0];

function buildDeck() {
  const deck = $('hero-deck'); if (!deck) return;
  const latest = latestIssue();
  deckOrder = [latest, ...MAGS.filter(x => x !== latest)].map(x => x.id);
  deck.innerHTML = deckOrder.map(id => {
    const m = MAGS.find(x => x.id === id);
    return '<div class="deckcard" data-deck="' + id + '"><div class="coverslot" data-mag="' + id + '" role="button" tabindex="0" title="Leer en el visor" aria-label="Leer ' + esc(m.nr) + ' en el visor"><span class="cslabel"><span>EDEM Times</span><span>' + esc(m.nr) + '</span></span></div></div>';
  }).join('');
  $('deck-dots').innerHTML = deckOrder.map(id => {
    const m = MAGS.find(x => x.id === id);
    return '<button class="ddot" data-deckdot="' + id + '" aria-label="Mostrar ' + esc(m.nr) + ' · ' + esc(m.title) + '"></button>';
  }).join('');
  applyDeck();

  const wrap = $('hero-deck-wrap');
  wrap.addEventListener('click', e => {
    const dot = e.target.closest('[data-deckdot]');
    if (dot) { advanceDeck(dot.dataset.deckdot); restartDeck(); return; }
    const card = e.target.closest('.deckcard');
    if (card && card.dataset.deck !== deckOrder[0]) {
      // una portada trasera pasa al frente en vez de abrir el visor
      e.stopPropagation(); advanceDeck(card.dataset.deck); restartDeck();
    }
  });
  wrap.addEventListener('mouseenter', () => { deckPaused = true; });
  wrap.addEventListener('mouseleave', () => { deckPaused = false; });
  wrap.addEventListener('focusin', () => { deckPaused = true; });
  wrap.addEventListener('focusout', () => { deckPaused = false; });
  restartDeck();
}

function applyDeck() {
  const deck = $('hero-deck');
  deckOrder.forEach((id, i) => {
    const c = deck.querySelector('[data-deck="' + id + '"]');
    if (!c || c.classList.contains('fly')) return;
    c.className = 'deckcard p' + Math.min(i, 2);
    c.style.zIndex = 20 - i;
  });
  updateDeckUI();
}

function advanceDeck(toId) {
  if (toId === deckOrder[0]) return;
  const deck = $('hero-deck'), frontId = deckOrder[0];
  if (toId) { while (deckOrder[0] !== toId) deckOrder.push(deckOrder.shift()); }
  else deckOrder.push(deckOrder.shift());
  const fly = deck.querySelector('[data-deck="' + frontId + '"]');
  if (REDUCED.matches || !fly) { applyDeck(); return; }
  // la portada frontal «sale» del montón y se recoloca debajo
  fly.classList.add('fly'); fly.style.zIndex = 40;
  applyDeck();
  setTimeout(() => { fly.classList.remove('fly'); applyDeck(); }, 520);
}

function restartDeck() {
  clearInterval(deckTimer);
  if (REDUCED.matches || deckOrder.length < 2) return;
  deckTimer = setInterval(() => { if (!deckPaused && !document.hidden) advanceDeck(); }, 5200);
}

function updateDeckUI() {
  const m = MAGS.find(x => x.id === deckOrder[0]); if (!m) return;
  const cap = $('deck-cap');
  cap.classList.remove('on');
  setTimeout(() => {
    cap.innerHTML = '<span class="cnr">' + esc(m.nr) + '</span><span class="ct disp-i">' + esc(m.title) + '</span>';
    cap.classList.add('on');
  }, 220);
  document.querySelectorAll('.ddot').forEach(d => d.classList.toggle('on', d.dataset.deckdot === deckOrder[0]));
  const bn = $('hero-num'), num = issueNum(m);
  if (bn.textContent !== num) {
    bn.classList.add('swap');
    setTimeout(() => { bn.textContent = num; bn.classList.remove('swap'); }, 320);
  }
}

function renderKiosko() {
  $('kgrid').innerHTML = MAGS.map(m =>
    '<article class="kcard rv">' +
    '<div class="kcv"><span class="kbadge" style="background:' + color(m.badgeColor) + '">' + esc(m.badge) + '</span>' +
    '<div class="coverslot" data-mag="' + m.id + '" role="button" tabindex="0" title="Leer en el visor" aria-label="Leer ' + esc(m.nr) + ' en el visor"><span class="cslabel"><span>EDEM Times</span><span>' + esc(m.nr) + '</span></span></div></div>' +
    '<div class="kbody"><span class="nr">' + esc(m.nr) + '</span><h3 class="disp">' + esc(m.title) + '</h3><p>' + esc(m.desc) + '</p><span class="kmeta">' + esc(m.meta) + '</span>' +
    '<div class="kacts"><button class="btn pri" data-visor="' + m.id + '"><i data-lucide="book-open" class="lu"></i> Leer</button>' +
    '<a class="btn out" href="' + encodeURI(m.print) + '" target="_blank" rel="noopener"><i data-lucide="printer" class="lu"></i> A4</a></div></div></article>').join('');
  const n = MAGS.length;
  $('kcount').textContent = n + (n === 1 ? ' edición' : ' ediciones');
}

function renderArticles() {
  const latest = latestIssue();
  $('numero-note').textContent = latest.nr + ' «' + latest.title + '» · cada artículo abre el visor por su página';
  // el número de la edición, en grande y fantasma, detrás del sumario
  const nr = (latest.nr.match(/\d+/) || ['1'])[0];
  $('nghost').textContent = String(nr).padStart(2, '0');
  // el primero va destacado, como la apertura de un sumario de revista
  $('agrid').innerHTML = C.articles.map((a, i) =>
    '<article class="acard rv' + (i === 0 ? ' feat' : '') + '" data-art="' + i + '" role="button" tabindex="0" aria-label="Leer «' + esc(a.title) + '» en el visor">' +
    '<div class="im"><span class="imfall"><i data-lucide="anchor" class="lu"></i></span><img src="' + esc(a.img) + '" loading="lazy" onerror="this.remove()" alt=""></div>' +
    '<div class="abody"><span class="apg" aria-hidden="true">' + String(a.page).padStart(2, '0') + '</span>' +
    '<span class="abadge" style="background:' + color(a.color) + '">' + esc(a.cat) + '</span>' +
    '<h3 class="disp">' + esc(a.title) + '</h3><p>' + esc(a.excerpt) + '</p>' +
    '<div class="afoot"><span class="go">Leer en el visor <i data-lucide="arrow-right" class="lu" style="width:15px;height:15px"></i></span><span class="pnum">pág. ' + String(a.page).padStart(2, '0') + '</span></div></div></article>').join('');
}

/* Tríptico apilado: cada ficha es sticky y se queda clavada mientras la
   siguiente sube a taparla, dejando asomar el borde superior de la anterior
   (de ahí el desfase por --i). El raíl de la izquierda marca la activa. */
function renderEcosystem() {
  $('egrid').innerHTML = C.ecosystem.map((e, i) =>
    '<article class="epanel" id="eco-' + i + '" style="--acc:' + color(e.color) + ';--i:' + i + '" data-eco="' + i + '">' +
    '<div class="epanel-in">' +
    '<figure class="ephoto"><img src="' + esc(e.img) + '" alt="' + esc(e.alt || '') + '" loading="lazy" decoding="async"></figure>' +
    '<div class="ecopy">' +
    '<div class="ehead"><span class="eidx">' + String(i + 1).padStart(2, '0') + '</span>' +
    '<span class="role disp">' + esc(e.role) + '</span></div>' +
    '<h3 class="disp">' + esc(e.name) + '</h3>' +
    '<p class="edesc">' + esc(e.desc) + '</p>' +
    (e.meta ? '<p class="emeta">' + esc(e.meta) + '</p>' : '') +
    '<a class="elink" href="' + esc(e.url) + '" target="_blank" rel="noopener">Visitar ' + esc(e.name) + ' <i data-lucide="arrow-up-right" class="lu"></i></a>' +
    '</div></div></article>').join('');

  $('econav').innerHTML = C.ecosystem.map((e, i) =>
    '<li><a href="#eco-' + i + '" style="--acc:' + color(e.color) + '" data-econav="' + i + '">' +
    '<span class="n">' + String(i + 1).padStart(2, '0') + '</span>' +
    '<span class="v">' + esc(e.role) + '</span>' +
    '<span class="b">' + esc(e.name) + '</span></a></li>').join('');

  observeEcosystem();
}

/* La ficha activa es la última cuyo borde superior ya ha pasado la línea de
   anclaje; así el raíl sigue al apilado y no a la visibilidad (con las fichas
   montadas unas sobre otras, un IntersectionObserver se queda corto).
   Solo se mide mientras la sección está cerca de pantalla, y con un rAF por
   frame como el resto de efectos de scroll. */
let ecoBound = false, ecoPanels = [], ecoLinks = [], ecoCur = -1, ecoTick = false;

/* El raíl y las fichas se sueltan del sticky cuando su caja deja de caber en el
   contenedor, así que solo se mueven juntos si miden lo mismo (el CSS les da a
   ambos --eco-card-h y el mismo margen inferior). El alto base es un min-height:
   si un texto largo estira una ficha por encima, aquí se propaga el alto real
   para que el raíl lo siga y el titular no se quede clavado mientras el mazo ya
   sube — que es lo que recortaba las esquinas superiores contra el borde. */
function ecoSyncHeights() {
  const wrap = document.querySelector('.ecowrap');
  if (!wrap || !ecoPanels.length) return;
  wrap.style.removeProperty('--eco-card-h');          // vuelve al valor del CSS...
  const h = Math.max(...ecoPanels.map(p => p.offsetHeight));   // ...y se mide
  wrap.style.setProperty('--eco-card-h', h + 'px');
}

function ecoMeasure() {
  ecoTick = false;
  const sec = $('ecosistema');
  if (!sec || !ecoPanels.length) return;
  const box = sec.getBoundingClientRect();
  if (box.bottom < 0 || box.top > innerHeight) return;

  const line = innerHeight * .34;
  let act = 0;
  ecoPanels.forEach((p, i) => { if (p.getBoundingClientRect().top <= line) act = i; });
  if (act === ecoCur) return;
  ecoCur = act;
  ecoLinks.forEach((a, j) => a.classList.toggle('on', j === act));
}

function observeEcosystem() {
  // el render puede repetirse (recarga de content.json): se refrescan los nodos
  ecoPanels = [...document.querySelectorAll('.epanel')];
  ecoLinks = [...document.querySelectorAll('[data-econav]')];
  ecoCur = -1;
  if (!ecoPanels.length) return;

  // sin sticky (movimiento reducido) no hay alturas que sincronizar
  if (REDUCED.matches) { ecoCur = 0; ecoLinks.forEach((a, j) => a.classList.toggle('on', !j)); return; }
  ecoSyncHeights();
  ecoMeasure();

  if (ecoBound) return;   // el listener se pone una sola vez
  ecoBound = true;
  addEventListener('scroll', () => {
    if (ecoTick) return;
    ecoTick = true;
    requestAnimationFrame(ecoMeasure);
  }, { passive: true });
  // al cambiar el ancho las fichas se reflowean: hay que volver a igualar cajas
  addEventListener('resize', () => { ecoSyncHeights(); ecoMeasure(); }, { passive: true });
  // las webfonts pueden llegar después del primer render y estirar el texto
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(ecoSyncHeights);
}

function renderFooter() {
  $('soc').innerHTML = C.social.map(s =>
    '<a href="' + esc(s.url) + '" target="_blank" rel="noopener" aria-label="' + esc(s.label) + '">' + (SOC_SVG[s.id] || '') + '</a>').join('');
  $('foot-ediciones').innerHTML = MAGS.map(m =>
    '<a href="#" data-visor="' + m.id + '">' + esc(m.nr) + ' · ' + esc(m.title) + '</a>').join('');
}

/* delegación: todo lo que abre el visor */
document.addEventListener('click', e => {
  const v = e.target.closest('[data-visor]');
  if (v) { e.preventDefault(); openVisor(v.dataset.visor); return; }
  const slot = e.target.closest('.coverslot[data-mag]');
  if (slot) { openVisor(slot.dataset.mag); return; }
  const card = e.target.closest('.acard[data-art]');
  if (card) { const a = C.articles[+card.dataset.art]; openVisor(a.issue, a.page - 1); return; }
  const open = e.target.closest('[data-open-visor]');
  if (open) { e.preventDefault(); closeMenu(); openVisor(latestIssue().id); }
});
document.addEventListener('keydown', e => {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.coverslot[data-mag],.acard[data-art]')) {
    e.preventDefault(); e.target.click();
  }
});

/* ================= menú móvil ================= */
const menubtn = $('menubtn'), mnav = $('mnav'), mscrim = $('mscrim');
let scrimT;

function setMenu(open) {
  mnav.classList.toggle('open', open);
  menubtn.setAttribute('aria-expanded', String(open));
  menubtn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  menubtn.innerHTML = '<i data-lucide="' + (open ? 'x' : 'menu') + '" class="lu"></i>';
  if (window.lucide) lucide.createIcons();
  clearTimeout(scrimT);
  if (open) {
    mscrim.hidden = false;
    requestAnimationFrame(() => mscrim.classList.add('on'));   // dos frames: el velo entra con transición
  } else {
    mscrim.classList.remove('on');
    scrimT = setTimeout(() => { mscrim.hidden = true; }, 280);
  }
}
function closeMenu() { if (mnav.classList.contains('open')) setMenu(false); }

menubtn.addEventListener('click', () => setMenu(!mnav.classList.contains('open')));
mnav.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
mscrim.addEventListener('click', closeMenu);
addEventListener('keydown', e => { if (e.key === 'Escape' && mnav.classList.contains('open')) { closeMenu(); menubtn.focus(); } });
// si se pasa a escritorio con el menú abierto, se cierra solo.
// MediaQueryList.addEventListener no existe antes de Safari 14: sin este puente
// esta línea lanzaba TypeError y se llevaba por delante TODO lo que va después
// del script — incluida la inmersión (los «beats» del hero).
function onMQ(mq, fn) {
  if (mq.addEventListener) mq.addEventListener('change', fn);
  else if (mq.addListener) mq.addListener(fn);
}
onMQ(matchMedia('(min-width:681px)'), e => { if (e.matches) closeMenu(); });

/* ================= aparición al hacer scroll ================= */
let revealIO = null;
function observeReveals() {
  if (REDUCED.matches) { document.querySelectorAll('.rv').forEach(el => el.classList.add('in')); return; }
  if (!revealIO) {
    revealIO = new IntersectionObserver(es => es.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); revealIO.unobserve(en.target); }
    }), { threshold: .12, rootMargin: '0px 0px -5% 0px' });
  }
  document.querySelectorAll('.rv:not(.in)').forEach(el => revealIO.observe(el));
}

/* ================= inmersión: el mar sube y aparece el relato =================
   Mientras dura #heroPin el hero queda clavado (sticky). El recorrido se reparte
   en dos actos: primero el mar cubre la pantalla (--seaP 0→1), después van
   entrando los «beats» de texto (cada uno recibe su propio --ph y su opacidad).

   Rendimiento: un único rAF por frame, las medidas del layout se cachean y solo
   se escriben transform/opacity (propiedades que el compositor resuelve sin
   recalcular layout ni pintar). */
(function immersion() {
  const pin = $('heroPin'), hero = pin && pin.querySelector('.hero'), deep = $('deep');
  if (!pin || !hero || !deep || REDUCED.matches) return;

  // --seaP/--deepP van sobre el hero, no sobre :root: escribir una custom
  // property en :root invalida el estilo de TODO el documento en cada frame.
  const root = hero;
  const beats = [...deep.querySelectorAll('[data-beat]')];
  const N = beats.length;
  const clamp01 = v => v < 0 ? 0 : v > 1 ? 1 : v;
  // suavizado tipo smoothstep: entradas y salidas sin tirones
  const step = (a, b, v) => { const t = clamp01((v - a) / (b - a)); return t * t * (3 - 2 * t); };

  let pinTop = 0, range = 0, vh = 0, waveEnd = 0, seg = 0, enabled = true;
  let ticking = false, prevSea = -1, prevDeep = -1;
  const prevPh = new Array(N).fill(null), prevOp = new Array(N).fill(null);

  function measure() {
    enabled = getComputedStyle(hero).position === 'sticky';
    // el recorrido real del sticky es alto del pin − alto del HERO, no − innerHeight.
    // En Safari iOS innerHeight oscila al plegarse la barra de direcciones (svh↔lvh)
    // mientras que el hero mide 100svh fijo: usar innerHeight desincronizaba los
    // beats del scroll justo al empezar a bajar. offsetHeight no miente.
    vh = hero.offsetHeight || window.innerHeight;
    pinTop = pin.getBoundingClientRect().top + window.scrollY;
    range = Math.max(1, pin.offsetHeight - vh);
    // el primer acto (subida del agua) se lleva ~1 pantalla de scroll
    waveEnd = Math.min(range * 0.3, vh);
    seg = (range - waveEnd) / N;
  }

  function write(prop, val, prev) {
    if (Math.abs(val - prev) < 0.001) return prev;
    root.style.setProperty(prop, val.toFixed(4));
    return val;
  }

  function update() {
    ticking = false;
    if (!enabled) {
      root.style.setProperty('--seaP', '0');
      root.style.setProperty('--deepP', '0');
      return;
    }
    const s = window.scrollY - pinTop;              // px recorridos dentro del pin
    if (s < -vh || s > range + vh) return;          // fuera de pantalla: nada que hacer

    prevSea = write('--seaP', clamp01(s / waveEnd), prevSea);
    prevDeep = write('--deepP', step(waveEnd * 0.55, waveEnd * 0.98, s), prevDeep);

    for (let i = 0; i < N; i++) {
      const u = (s - waveEnd - i * seg) / seg;      // 0→1 dentro de la ventana del beat
      const ph = (clamp01(u) - 0.5) * 2;            // -1 entra · 0 centrado · 1 sale
      // entra rápido, se queda quieto la mayor parte del tramo, y sale.
      // el último aguanta más y se va justo antes de soltarse el pin, para que
      // el borde del kiosko no llegue a recortar el texto.
      const op = step(0, .22, u) * (1 - step(i === N - 1 ? .9 : .82, 1, u));
      const b = beats[i];
      if (Math.abs(ph - prevPh[i]) > 0.001) { b.style.setProperty('--ph', ph.toFixed(4)); prevPh[i] = ph; }
      if (Math.abs(op - prevOp[i]) > 0.001) { b.style.opacity = op.toFixed(3); prevOp[i] = op; }
    }
  }

  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };

  /* burbujas y motas: puro CSS una vez creadas (el compositor las mueve solo) */
  function scatter(host, n, minSize, maxSize, minDur, maxDur) {
    if (!host) return;
    host.innerHTML = '';
    for (let i = 0; i < n; i++) {
      const b = document.createElement('span'), size = minSize + Math.random() * (maxSize - minSize);
      b.style.cssText = 'left:' + (Math.random() * 100).toFixed(2) + '%;' +
        'width:' + size.toFixed(1) + 'px;height:' + size.toFixed(1) + 'px;' +
        '--dx:' + (Math.random() * 70 - 35).toFixed(0) + 'px;' +
        'animation-duration:' + (minDur + Math.random() * (maxDur - minDur)).toFixed(1) + 's;' +
        'animation-delay:-' + (Math.random() * 24).toFixed(1) + 's';
      host.appendChild(b);
    }
  }
  function bubbles() {
    const small = window.innerWidth < 700;
    scatter($('bubbles'), small ? 10 : 18, 3, 12, 9, 21);
    scatter($('motes'), small ? 7 : 12, 3, 7, 16, 30);
  }

  let rz, lastW = window.innerWidth;
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', () => {
    clearTimeout(rz);
    rz = setTimeout(() => {
      // En Safari iOS «resize» salta cada vez que se pliega o despliega la barra
      // de direcciones, o sea constantemente mientras se baja. Remedir es barato;
      // regenerar las burbujas no lo es (y además las hace parpadear), así que
      // eso solo cuando cambia el ANCHO: rotación o cambio de ventana de verdad.
      const w = window.innerWidth;
      measure();
      if (w !== lastW) { lastW = w; bubbles(); }
      update();
    }, 120);
  });
  // al volver a la pestaña el rAF estaba parado: recolocamos por si se scrolleó fuera
  addEventListener('visibilitychange', () => { if (!document.hidden) { measure(); update(); } });
  // vuelta atrás en iOS: la página sale de la bfcache ya scrolleada y sin disparar scroll
  addEventListener('pageshow', () => { measure(); update(); });
  addEventListener('orientationchange', () => setTimeout(() => { measure(); update(); }, 300));
  bubbles();
  measure();
  update();
  // el mazo de portadas y las fuentes cambian la altura del hero al cargar
  addEventListener('load', () => { measure(); update(); });
})();

/* ================= suscripción a novedades ================= */
$('sub-form').addEventListener('submit', async e => {
  e.preventDefault();
  const f = e.target, msg = $('sub-msg');
  if (f.empresa.value) return; // honeypot
  const email = f.email.value.trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    msg.textContent = 'Revisa el email: no parece válido.'; msg.classList.add('err'); f.email.focus(); return;
  }
  msg.classList.remove('err');
  const btn = f.querySelector('button[type=submit]');
  const endpoint = (C.newsletter && C.newsletter.endpoint) || '';
  btn.disabled = true;
  try {
    if (endpoint) {
      const r = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, list: 'edem-times' }) });
      if (!r.ok) throw new Error('HTTP ' + r.status);
    } else {
      try { localStorage.setItem('edemtimes-sub', email); } catch (_) { /* navegación privada */ }
    }
    msg.textContent = '¡Bienvenido a bordo! Te avisaremos con cada nueva edición ⚓';
    f.reset();
  } catch (_) {
    msg.textContent = 'No hemos podido suscribirte ahora mismo. Inténtalo de nuevo en unos minutos.';
    msg.classList.add('err');
  } finally { btn.disabled = false; }
});

/* ================= carga y troceado de cada revista ================= */
async function loadIssue(m) {
  if (m.data) return m.data;
  if (m.loading) return m.loading;
  m.loading = (async () => {
    const txt = await (await fetch(encodeURI(m.file))).text();
    const doc = new DOMParser().parseFromString(txt, 'text/html');
    const links = [...doc.querySelectorAll('head link[rel="stylesheet"]')].map(l => l.outerHTML).join('');
    const styles = [...doc.querySelectorAll('head style')].map(s => s.outerHTML).join('');
    const secs = [...doc.querySelectorAll('section.page')];
    const pages = secs.map(s => s.outerHTML);
    const labels = secs.map((s, i) => (s.dataset.screenLabel || ('Página ' + (i + 1))).replace(/^\d+\s*/, ''));
    const base = new URL(encodeURI(m.file), location.href).href;
    const head = '<base href="' + base + '">' + links + styles +
      '<style>html,body{margin:0!important;padding:0!important;background:#fff!important;overflow:hidden!important}section.page{box-shadow:none!important}</style>';
    m.data = { pages, labels, head, n: pages.length };
    const imgs = [...new Set((pages.join('').match(/src="([^"]+)"/g) || []).map(x => x.slice(5, -1)))];
    imgs.forEach(u => { const im = new Image(); im.src = new URL(u, base).href; });
    return m.data;
  })();
  m.loading.catch(() => { m.loading = null; });
  return m.loading;
}
function pageDoc(m, i) { return '<!DOCTYPE html><html lang="es"><head>' + m.data.head + '</head><body>' + m.data.pages[i] + '</body></html>'; }
function mkPage(m, i) {
  const w = document.createElement('div'); w.className = 'pg';
  if (i == null) { w.classList.add('void'); return { el: w, ready: Promise.resolve() }; }
  const f = document.createElement('iframe');
  f.setAttribute('tabindex', '-1'); f.setAttribute('aria-hidden', 'true'); f.setAttribute('scrolling', 'no');
  f.title = 'Página ' + (i + 1);
  const ready = new Promise(res => {
    let done = false; const ok = () => { if (!done) { done = true; res(); } };
    f.addEventListener('load', () => { try { f.contentDocument.fonts.ready.then(ok); } catch (e) { ok(); } setTimeout(ok, 380); });
    setTimeout(ok, 1600);
  });
  f.srcdoc = pageDoc(m, i);
  w.appendChild(f); return { el: w, ready };
}

/* ================= portadas vivas en home y kiosko ================= */
const slotRO = new ResizeObserver(es => es.forEach(e => fitSlot(e.target)));
function fitSlot(sl) { const pg = sl.querySelector('.pg'); if (pg) pg.style.transform = 'scale(' + (sl.clientWidth / 794) + ')'; }
/* Montar una portada supone parsear un documento entero dentro de un iframe.
   Si eso cae mientras el usuario baja, se nota como un tirón. Por eso:
   1) primero las del mazo del hero, que son las que se ven de entrada;
   2) las del kiosko después, de una en una y en huecos libres del navegador
      (requestIdleCallback), aprovechando el rato largo que dura la inmersión. */
const idle = window.requestIdleCallback || (fn => setTimeout(() => fn({ timeRemaining: () => 8 }), 60));

function mountSlots(m, slots) {
  slots.forEach(sl => {
    const label = sl.querySelector('.cslabel');
    sl.replaceChildren(mkPage(m, 0).el);
    if (label) sl.appendChild(label), label.style.display = 'none';
    fitSlot(sl); slotRO.observe(sl);
  });
}

async function mountCovers() {
  const pending = [];
  for (const m of MAGS) {
    try {
      await loadIssue(m);
      const all = [...document.querySelectorAll('.coverslot[data-mag="' + m.id + '"]')];
      // el mazo del hero es lo único visible al entrar: se monta ya
      mountSlots(m, all.filter(sl => sl.closest('.heroDeck')));
      const rest = all.filter(sl => !sl.closest('.heroDeck'));
      if (rest.length) pending.push([m, rest]);
    } catch (e) { console.warn('No se pudo cargar', m.file, e); }
  }
  // el resto, repartido en huecos libres para no competir con el scroll
  (function next() {
    const job = pending.shift();
    if (!job) return;
    idle(() => { mountSlots(job[0], job[1]); next(); });
  })();
}

/* ================= sistema de diseño ================= */
function swCell(step, hex, lightBg) { return '<div class="c" style="background:' + hex + ';color:' + (lightBg ? 'var(--ink-900)' : '#fff') + '"><b>' + step + '</b><span>' + hex.toUpperCase() + '</span></div>'; }
const DS_TEAL = [['50', '#eef8fb'], ['100', '#dcf0f5'], ['200', '#b4dee9'], ['300', '#74c1d5'], ['400', '#34a3c0'], ['500', '#008aad'], ['600', '#007a99'], ['700', '#006a85'], ['800', '#0a4a5c'], ['900', '#06333f']];
const DS_INK = [['900', '#0c1e24'], ['800', '#183038'], ['700', '#2a3f47'], ['600', '#455a61'], ['500', '#5a6e75'], ['400', '#869aa0'], ['300', '#b9c6ca'], ['200', '#dce4e6'], ['100', '#edf1f2'], ['50', '#f6f9f9']];
$('ds-teal').innerHTML = DS_TEAL.map(([s, h]) => swCell(s, h, +s <= 300)).join('');
$('ds-ink').innerHTML = DS_INK.map(([s, h]) => swCell(s, h, +s <= 300)).join('');
const DS_ECO = [
  { n: 'EDEM', h: '#008aad', tag: 'primario oficial', ok: true },
  { n: 'Lanzadera', h: '#e8502d', tag: 'placeholder — confirmar' },
  { n: 'Angels', h: '#3b3a7a', tag: 'placeholder — confirmar' },
  { n: 'Paper', h: '#fbfaf6', tag: 'fondo revista', light: true, ok: true },
  { n: 'Ink 900', h: '#0c1e24', tag: 'texto · modo lectura', ok: true }
];
$('ds-eco').innerHTML = DS_ECO.map(e => '<div class="ecocard"><div class="sw" style="background:' + e.h + (e.light ? ';border-bottom:1px solid var(--border-hair)' : '') + '"></div><div class="cap"><div class="n">' + e.n + '</div><div class="h">' + e.h.toUpperCase() + '</div><div class="tag" style="color:' + (e.ok ? 'var(--edem-teal-700)' : 'var(--lanzadera)') + '">' + e.tag + '</div></div></div>').join('');
const DS_SEM = [{ n: 'Success', h: '#2e8b6f' }, { n: 'Warning', h: '#d8912e' }, { n: 'Danger', h: '#c7452e' }, { n: 'Info', h: '#008aad' }];
$('ds-sem').innerHTML = DS_SEM.map(e => '<div class="ecocard"><div class="sw" style="background:' + e.h + '"></div><div class="cap"><div class="n">' + e.n + '</div><div class="h">' + e.h.toUpperCase() + '</div></div></div>').join('');
const DS_SPACE = [['space-1', 4], ['space-2', 8], ['space-3', 12], ['space-4', 16], ['space-5', 24], ['space-6', 32], ['space-7', 48], ['space-8', 64], ['space-9', 96], ['space-10', 128]];
$('ds-space').innerHTML = DS_SPACE.map(([n, v]) => '<div class="r"><span class="nm">' + n + '</span><span class="bar" style="width:' + v + 'px"></span>' + v + 'px</div>').join('');

let dsReturnFocus = null;
window.openDS = function () {
  const p = $('ds'); dsReturnFocus = document.activeElement;
  p.hidden = false; p.scrollTop = 0; document.body.classList.add('lock');
  closeMenu(); lucide.createIcons(); $('ds-close').focus();
};
window.closeDS = function () {
  $('ds').hidden = true; document.body.classList.remove('lock');
  if (dsReturnFocus) dsReturnFocus.focus();
};

/* ================= visor flipbook ================= */
const visor = $('visor'), stage = $('v-stage'), bookouter = $('bookouter'), book = $('book');
const halfL = $('half-l'), halfR = $('half-r'), host = $('host'), spine = $('spine');
let M = null, SP = [], cur = 0, animating = false, scale = 1, mode = 'spread', vReturnFocus = null;

function computeMode() { return stage.getBoundingClientRect().width < 720 ? 'single' : 'spread'; }
function spreadsOf(n) { const a = [[null, 0]]; for (let p = 1; p < n; p += 2) a.push([p, p + 1 < n ? p + 1 : null]); return a; }
function buildSpreads(n) { return mode === 'single' ? Array.from({ length: n }, (_, i) => [i, i]) : spreadsOf(n); }
function indexToSpread(p) { return mode === 'single' ? p : (p <= 0 ? 0 : Math.floor((p + 1) / 2)); }
function curPageIndex() { if (!SP.length) return 0; const [l, r] = SP[cur]; return l == null ? r : l; }
function setHalf(half, item) { half.replaceChildren(item.el); half.classList.toggle('void', item.el.classList.contains('void')); }
function curOffset() { if (mode === 'single' || !SP.length) return 0; const [l, r] = SP[cur]; return l == null ? -397 : (r == null ? 397 : 0); }
function bookW() { return mode === 'single' ? 794 : 1588; }

function fitBook() {
  const r = stage.getBoundingClientRect();
  scale = Math.min((r.width - (mode === 'single' ? 90 : 150)) / bookW(), (r.height - 40) / 1123, 1.05);
  bookouter.style.width = bookW() * scale + 'px';
  bookouter.style.height = 1123 * scale + 'px';
  book.style.transform = 'scale(' + scale + ') translateX(' + curOffset() + 'px)';
}

function updateChrome() {
  if (!M || !M.data) return;
  const n = M.data.n, [l, r] = SP[cur];
  if (mode === 'single') {
    $('v-ind').textContent = cur === 0 ? 'Portada · ' + n + ' págs' : 'Pág. ' + (cur + 1) + ' de ' + n;
  } else {
    $('v-ind').textContent = cur === 0 ? 'Portada · ' + n + ' págs' : (r == null ? 'Contraportada' : 'Págs. ' + (l + 1) + '–' + (r + 1) + ' de ' + n);
  }
  $('v-prev').disabled = cur === 0 || animating;
  $('v-next').disabled = cur === SP.length - 1 || animating;
  $('v-dots').innerHTML = SP.map((_, i) => '<button class="vdot' + (i === cur ? ' on' : '') + '" aria-label="Ir al pliego ' + (i + 1) + '" data-dot="' + i + '"></button>').join('');
  $('v-goto').value = String(curPageIndex());
  fitBook();
}

function render() {
  const [l, r] = SP[cur];
  book.classList.toggle('single', mode === 'single');
  if (mode === 'single') {
    halfR.classList.add('hide');
    setHalf(halfL, mkPage(M, l));
    spine.classList.add('off');
  } else {
    halfR.classList.remove('hide');
    setHalf(halfL, mkPage(M, l)); setHalf(halfR, mkPage(M, r));
    spine.classList.toggle('off', l == null || r == null);
  }
  host.replaceChildren(); updateChrome();
}

function jump(s) { if (animating || s === cur || !M) return; cur = Math.max(0, Math.min(s, SP.length - 1)); render(); }

async function turn(dir) {
  if (animating || !M) return;
  const t = cur + dir; if (t < 0 || t >= SP.length) return;
  if (mode === 'single' || REDUCED.matches) { cur = t; render(); return; }
  animating = true; updateChrome();
  const fw = dir > 0, [cl, cr] = SP[cur], [tl, tr] = SP[t];
  const under = mkPage(M, fw ? tr : tl);
  setHalf(fw ? halfR : halfL, under);
  const front = mkPage(M, fw ? cr : cl), back = mkPage(M, fw ? tl : tr);
  const leaf = document.createElement('div'); leaf.className = 'leaf';
  leaf.style.cssText = (fw ? 'right:0;' : 'left:0;') + 'transform-origin:' + (fw ? 'left' : 'right') + ' center;transform:rotateY(0deg);';
  const f1 = document.createElement('div'); f1.className = 'face'; f1.appendChild(front.el); f1.insertAdjacentHTML('beforeend', '<div class="shade"></div>');
  const f2 = document.createElement('div'); f2.className = 'face back'; f2.appendChild(back.el); f2.insertAdjacentHTML('beforeend', '<div class="shade"></div>');
  leaf.append(f1, f2); host.appendChild(leaf);
  spine.classList.toggle('off', tl == null || tr == null);
  await Promise.all([under.ready, front.ready, back.ready]);
  cur = t; fitBook();
  requestAnimationFrame(() => requestAnimationFrame(() => { leaf.style.transform = 'rotateY(' + (fw ? -180 : 180) + 'deg)'; }));
  await new Promise(res => setTimeout(res, 850));
  const land = mkPage(M, fw ? tl : tr);
  setHalf(fw ? halfL : halfR, land);
  await land.ready;
  host.replaceChildren(); animating = false; updateChrome();
}

async function setIssue(id, pageIdx = 0) {
  const m = MAGS.find(x => x.id === id); if (!m) return;
  document.querySelectorAll('.vchip').forEach(c => c.classList.toggle('on', c.dataset.id === id));
  $('v-print').href = encodeURI(m.print || m.file);
  const load = $('v-load');
  if (!m.data) { load.hidden = false; }
  try { await loadIssue(m); }
  catch (e) { load.hidden = true; $('v-ind').textContent = 'No se pudo cargar la edición'; return; }
  load.hidden = true;
  mode = computeMode();
  M = m; SP = buildSpreads(m.data.n); cur = indexToSpread(Math.min(pageIdx, m.data.n - 1));
  $('v-goto').innerHTML = m.data.labels.map((lb, i) => '<option value="' + i + '">' + String(i + 1).padStart(2, '0') + ' · ' + esc(lb) + '</option>').join('');
  render();
}

window.openVisor = function (id, pageIdx = 0) {
  vReturnFocus = document.activeElement;
  visor.hidden = false; document.body.classList.add('lock');
  closeMenu(); setIssue(id, pageIdx);
  lucide.createIcons();
  requestAnimationFrame(fitBook);
  $('v-close').focus();
};
window.closeVisor = function () {
  visor.hidden = true; document.body.classList.remove('lock');
  if (vReturnFocus) vReturnFocus.focus();
};

function applyMode() {
  if (!M || !M.data) { fitBook(); return; }
  const m2 = computeMode();
  if (m2 !== mode) {
    const p = curPageIndex();
    mode = m2; SP = buildSpreads(M.data.n); cur = indexToSpread(p);
    render();
  } else fitBook();
}

$('v-next').addEventListener('click', () => turn(1));
$('v-prev').addEventListener('click', () => turn(-1));
$('v-goto').addEventListener('change', e => jump(indexToSpread(+e.target.value)));
$('v-dots').addEventListener('click', e => { const d = e.target.closest('[data-dot]'); if (d) jump(+d.dataset.dot); });
halfR.addEventListener('click', () => turn(1));
halfL.addEventListener('click', () => { turn(mode === 'single' ? 1 : -1); });

/* gestos táctiles */
let tX = null, tY = null;
stage.addEventListener('touchstart', e => { tX = e.touches[0].clientX; tY = e.touches[0].clientY; }, { passive: true });
stage.addEventListener('touchend', e => {
  if (tX == null) return;
  const dx = e.changedTouches[0].clientX - tX, dy = e.changedTouches[0].clientY - tY;
  tX = tY = null;
  if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4) turn(dx < 0 ? 1 : -1);
}, { passive: true });

document.addEventListener('keydown', e => {
  if (!$('ds').hidden) { if (e.key === 'Escape') closeDS(); return; }
  if (visor.hidden) { if (e.key === 'Escape') closeMenu(); return; }
  if (e.key === 'ArrowRight') turn(1);
  else if (e.key === 'ArrowLeft') turn(-1);
  else if (e.key === 'Home') jump(0);
  else if (e.key === 'End') jump(SP.length - 1);
  else if (e.key === 'Escape') closeVisor();
});

new ResizeObserver(() => { if (!visor.hidden) applyMode(); }).observe(stage);
window.addEventListener('resize', () => { if (!visor.hidden) applyMode(); });

/* ================= arranque ================= */
function renderAll() {
  renderHero(); renderKiosko(); renderArticles(); renderEcosystem(); renderFooter();
  $('v-issues').innerHTML = MAGS.map(m => '<button class="vchip" role="tab" data-id="' + m.id + '" data-visor-issue="' + m.id + '">' + esc(m.chip) + '</button>').join('');
  $('v-issues').onclick = e => { const c = e.target.closest('[data-visor-issue]'); if (c) setIssue(c.dataset.visorIssue, 0); };
  lucide.createIcons();
  observeReveals();
}

async function boot() {
  try {
    const r = await fetch('data/content.json', { cache: 'no-cache' });
    if (r.ok) {
      const json = await r.json();
      C = Object.assign({}, DEFAULTS, json);
      MAGS = C.issues;
    }
  } catch (_) { /* sin servidor o sin JSON: catálogo embebido */ }
  renderAll();
  mountCovers();
}
boot();
