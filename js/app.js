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
  join: {
    kicker: 'Conócenos',
    titleHtml: 'La revista<br>la haces tú<span class="pt">.</span>',
    lead: 'EDEM Times la escriben, la fotografían y la maquetan alumnos de EDEM. No hace falta experiencia previa: hace falta tener ganas de contar lo que pasa aquí dentro. Cada edición abre la redacción — y siempre queda sitio.',
    note: 'Redacción abierta a todos los grados y másteres',
    cta: { label: 'Quiero participar', url: 'mailto:comunicacion@edem.es?subject=Quiero%20participar%20en%20EDEM%20Times' },
    roles: [
      { t: 'Escribe', d: 'Crónicas, entrevistas, columnas y hasta los pasatiempos. Si tienes algo que contar, tienes página.' },
      { t: 'Fotografía', d: 'El campus, la Marina, los eventos. Una buena foto abre sección y se queda en el papel.' },
      { t: 'Diseña', d: 'Maqueta, ilustra, inventa portadas. El papel admite cualquier idea que aguante la imprenta.' },
      { t: 'Edita', d: 'Cierra temas, corrige, decide el sumario. Se aprende haciendo — y aquí se hace una revista de verdad.' }
    ],
    ticker: ['Escribe', 'Fotografía', 'Diseña', 'Edita', 'Difunde', 'Entrevista', 'Propón']
  },
  ecosystem: [
    { name: 'EDEM', role: 'Formar', color: 'edem', url: 'https://edem.eu/', logo: 'assets/edem-logo-white.png', desc: 'Escuela de empresarios y directivos en Valencia. Grados, másteres y alta dirección con una regla: se aprende haciendo.', img: 'assets/img/eco-edem.jpg', alt: 'Fachada de EDEM en la Marina de València, con la grúa del puerto al lado', meta: 'Aquí se hace esta revista' },
    { name: 'Lanzadera', role: 'Acelerar', color: 'lanzadera', url: 'https://lanzadera.es/', logo: 'assets/logo-lanzadera-white.png', desc: 'La aceleradora que empuja startups desde el muelle de la Marina hasta el mercado. Su radar llena páginas de esta revista.', img: 'assets/img/eco-lanzadera.jpg', alt: 'Equipo de una startup trabajando en las oficinas de Lanzadera', meta: 'Sección «Radar Lanzadera»' },
    { name: 'Angels', role: 'Invertir', color: 'angels', url: 'https://www.angelscapital.es/', logo: 'assets/logo-angels-white.png', desc: 'La sociedad de inversión de Juan Roig. Capital y criterio para los líderes que eligen la opción difícil.', img: 'assets/img/eco-angels.jpg', alt: 'Público de inversores en el Investors Day de Angels', meta: 'Sección «Angels»' }
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

/* El hero ya no pinta antetítulo ni chips (ver el comentario en index.html): el
   número lo canta el pie de la pila de portadas. Los campos `kicker` y `chips`
   de content.json siguen ahí y no molestan — simplemente no se leen. */
function renderHero() {
  const m = latestIssue(), h = m.hero || {};
  if (h.titleHtml) $('hero-title').innerHTML = h.titleHtml;
  if (h.num) $('hero-num').textContent = h.num;
  if (h.sub) $('hero-sub').textContent = h.sub;
  if (h.lead) $('hero-lead').textContent = h.lead;
  buildDeck();
}

/* ---- el paisaje flat del hero: encuadre según la pantalla ----
   El dibujo es apaisado (1440×620) y se pinta con «slice», o sea que rellena
   la caja recortando lo que sobra. En una pantalla vertical lo que sobra son
   los laterales, y la grúa, la lancha o las palmeras salían partidas. Cada
   capa lleva en data-vbm un viewBox pensado para el móvil: más estrecho —se
   queda con la dársena— y con cielo de sobra por arriba, que es por donde
   interesa que recorte. El viewBox no se puede tocar desde CSS, de ahí este
   puente; el resto del reajuste (lo que se aparta o se retira) va en site.css. */
(function heroSceneFrame() {
  const svgs = [...document.querySelectorAll('.hscene svg[data-vbm]')];
  if (!svgs.length) return;
  const XS = matchMedia('(max-width:680px)');   // el mismo corte de móvil que usa site.css
  const apply = () => svgs.forEach(s => {
    if (!s.dataset.vbw) s.dataset.vbw = s.getAttribute('viewBox');   // el de escritorio, tal cual venía
    s.setAttribute('viewBox', XS.matches ? s.dataset.vbm : s.dataset.vbw);
  });
  apply();
  onMQ(XS, apply);
})();

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

/* El sumario «En este número» ya no existe: su sitio lo ocupa «Actualidad», la
   portada del diario digital, que pinta js/news.js con data/noticias.json (o con
   el CMS headless). */

/* ---------- Conócenos: la invitación a hacer la revista ----------
   La sección se clava (.jstage sticky) y el scroll va encendiendo las formas de
   participar, una a una, mientras la barra de la derecha marca el recorrido.
   Mismo patrón de rendimiento que el resto de efectos: un rAF por frame y solo
   clases y transform — nada que obligue a recalcular layout. */
/* Fondos flat: una escena de formas planas por forma de participar. Sin
   degradados ni desenfoques — círculos, rectángulos y triángulos de color
   plano. Cada escena lleva su fondo y su acento, que también tiñe las cajas.
   Si hay más formas que escenas, el ciclo se repite. */
const JOIN_SCENES = [
  { bg: '#06333f', acc: '#e8502d', art:
    '<circle class="sh" style="--d:.05s;--dy:40px" cx="1140" cy="235" r="215" fill="#e8502d"/>' +
    '<rect class="sh" style="--d:.12s;--dx:-50px" x="40" y="560" width="300" height="400" rx="10" fill="#ffffff" opacity=".10"/>' +
    '<rect class="sh" style="--d:.2s;--dx:-30px" x="130" y="510" width="300" height="400" rx="10" fill="#74c1d5" opacity=".26"/>' +
    '<rect class="sh" style="--d:.28s" x="180" y="585" width="180" height="14" rx="7" fill="#06333f" opacity=".5"/>' +
    '<rect class="sh" style="--d:.34s" x="180" y="630" width="215" height="14" rx="7" fill="#06333f" opacity=".38"/>' +
    '<rect class="sh" style="--d:.4s" x="180" y="675" width="130" height="14" rx="7" fill="#06333f" opacity=".38"/>' +
    '<path class="sh" style="--d:.46s;--dy:60px" d="M600 900 L815 520 L1030 900 Z" fill="#ffffff" opacity=".08"/>' +
    '<circle class="sh" style="--d:.52s" cx="640" cy="120" r="58" fill="#74c1d5" opacity=".45"/>' },
  { bg: '#12213f', acc: '#008aad', art:
    '<rect class="sh" style="--d:.05s;--dx:60px" x="810" y="120" width="520" height="520" rx="18" fill="#008aad" opacity=".9"/>' +
    '<circle class="sh" style="--d:.14s" cx="1070" cy="380" r="175" fill="#12213f"/>' +
    '<circle class="sh" style="--d:.2s" cx="1070" cy="380" r="92" fill="#b4dee9" opacity=".9"/>' +
    '<circle class="sh" style="--d:.26s" cx="1035" cy="345" r="30" fill="#ffffff"/>' +
    '<path class="sh" style="--d:.32s;--dy:70px" d="M0 900 L300 470 L600 900 Z" fill="#ffffff" opacity=".09"/>' +
    '<path class="sh" style="--d:.38s;--dy:70px" d="M260 900 L520 590 L780 900 Z" fill="#e8502d" opacity=".8"/>' +
    '<circle class="sh" style="--d:.44s;--dy:-40px" cx="215" cy="205" r="86" fill="#e8502d" opacity=".85"/>' },
  { bg: '#3b3a7a', acc: '#e8502d', art:
    '<path class="sh" style="--d:.05s;--dx:70px" d="M1440 190 A250 250 0 0 1 1440 690 Z" fill="#e8502d"/>' +
    '<rect class="sh" style="--d:.12s;--dx:-60px" x="0" y="0" width="330" height="330" fill="#ffffff" opacity=".10"/>' +
    '<rect class="sh" style="--d:.18s;--dx:-40px" x="120" y="330" width="210" height="210" fill="#b4dee9" opacity=".85"/>' +
    '<circle class="sh" style="--d:.24s" cx="330" cy="330" r="105" fill="#008aad"/>' +
    '<path class="sh" style="--d:.3s;--dy:60px" d="M560 900 L560 640 L820 640 Z" fill="#ffffff" opacity=".13"/>' +
    '<rect class="sh" style="--d:.36s;--dy:60px" x="880" y="740" width="420" height="26" fill="#ffffff" opacity=".22"/>' +
    '<rect class="sh" style="--d:.42s;--dy:60px" x="880" y="800" width="260" height="26" fill="#ffffff" opacity=".14"/>' },
  { bg: '#0e2129', acc: '#008aad', art:
    '<rect class="sh" style="--d:.05s;--dy:70px" x="90" y="430" width="150" height="470" fill="#008aad"/>' +
    '<rect class="sh" style="--d:.11s;--dy:70px" x="270" y="300" width="150" height="600" fill="#ffffff" opacity=".12"/>' +
    '<rect class="sh" style="--d:.17s;--dy:70px" x="450" y="560" width="150" height="340" fill="#e8502d" opacity=".9"/>' +
    '<circle class="sh" style="--d:.24s;--dy:-50px" cx="1130" cy="300" r="200" fill="#008aad" opacity=".22"/>' +
    '<circle class="sh" style="--d:.3s;--dy:-50px" cx="1130" cy="300" r="112" fill="#b4dee9" opacity=".9"/>' +
    '<path class="sh" style="--d:.36s;--dx:60px" d="M1440 900 L1080 900 L1440 560 Z" fill="#ffffff" opacity=".08"/>' +
    '<rect class="sh" style="--d:.42s;--dy:-40px" x="760" y="90" width="26" height="220" fill="#e8502d"/>' }
];

function renderJoinScenes(n) {
  const host = $('jscenes');
  if (!host) return;
  host.innerHTML = Array.from({ length: n }, (_, i) => {
    const s = JOIN_SCENES[i % JOIN_SCENES.length];
    return '<div class="jscene" data-jscene="' + i + '" data-bg="' + s.bg + '" data-acc="' + s.acc + '">' +
      '<svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' + s.art + '</svg></div>';
  }).join('');
}

function renderJoin() {
  const j = C.join || DEFAULTS.join;
  $('join-kicker').textContent = j.kicker || 'Conócenos';
  $('join-title').innerHTML = j.titleHtml || '';
  $('join-lead').textContent = j.lead || '';
  const cta = j.cta || {};
  $('join-acts').innerHTML =
    (cta.url ? '<a class="btn pri" href="' + esc(cta.url) + '"><i data-lucide="mail" class="lu"></i> ' + esc(cta.label || 'Quiero participar') + '</a>' : '') +
    '<button class="btn ghost lt" data-open-visor><i data-lucide="book-open" class="lu"></i> Leer</button>' +
    (j.note ? '<span class="jnote">' + esc(j.note) + '</span>' : '');
  $('jroles').innerHTML = (j.roles || []).map((r, i) =>
    '<li><button class="jrole" type="button" data-jrole="' + i + '" aria-expanded="false">' +
    '<span class="jn">' + String(i + 1).padStart(2, '0') + '</span>' +
    '<span class="jt disp">' + esc(r.t) + '</span>' +
    '<span class="jd"><span>' + esc(r.d) + '</span></span></button></li>').join('');
  // el rótulo del pie va dos veces: así el bucle del carrusel no tiene costura
  const words = (j.ticker && j.ticker.length ? j.ticker : (j.roles || []).map(r => r.t));
  const strip = words.map(w => '<span>' + esc(w) + '</span>').join('');
  $('jtrack').innerHTML = strip + strip;
  renderJoinScenes((j.roles || []).length || 1);
  observeJoin();
}

let joinBound = false, joinCards = [], joinScenes = [], joinCur = -1, joinTick = false, joinLock = 0;

/* enciende la escena de fondo i y pasa su fondo y su acento a la sección:
   el mismo color plano manda en el fondo, en la caja activa y en la barra */
function setJoinScene(i) {
  if (!joinScenes.length) return;
  const k = Math.min(joinScenes.length - 1, Math.max(0, i));
  joinScenes.forEach((s, n) => s.classList.toggle('on', n === k));
  const sec = $('conocenos'), sc = joinScenes[k];
  if (sec && sc) {
    sec.style.setProperty('--jbg', sc.dataset.bg);
    sec.style.setProperty('--jacc', sc.dataset.acc);
  }
}
const JOIN_FLAT = matchMedia('(max-width:1020px)');
// en móvil (y con movimiento reducido) no hay clavado: se abren todas
const joinFlat = () => REDUCED.matches || JOIN_FLAT.matches;

function setJoinRole(i) {
  if (i === joinCur) return;
  joinCur = i;
  setJoinScene(i);
  joinCards.forEach((b, k) => {
    const on = k === i;
    b.classList.toggle('on', on);
    b.setAttribute('aria-expanded', String(on));
  });
}

function joinMeasure() {
  joinTick = false;
  const sec = $('conocenos'), stage = sec && sec.querySelector('.jstage');
  if (!sec || !stage || !joinCards.length) return;
  if (joinFlat()) {
    joinCur = -1;
    setJoinScene(0);                                 // sin clavado, una sola escena
    joinCards.forEach(b => { b.classList.add('on'); b.setAttribute('aria-expanded', 'true'); });
    return;
  }
  const box = sec.getBoundingClientRect();
  if (box.bottom < 0 || box.top > innerHeight) return;
  const range = Math.max(1, sec.offsetHeight - stage.offsetHeight);
  const p = Math.min(1, Math.max(0, -box.top / range));
  const bar = $('jbar');
  if (bar) bar.style.transform = 'scaleY(' + (0.05 + p * 0.95).toFixed(3) + ')';
  if (Date.now() < joinLock) return;                 // un clic reciente manda sobre el scroll
  setJoinRole(Math.min(joinCards.length - 1, Math.floor(p * joinCards.length)));
}

function observeJoin() {
  joinCards = [...document.querySelectorAll('[data-jrole]')];
  joinScenes = [...document.querySelectorAll('[data-jscene]')];
  joinCur = -1;
  setJoinScene(0);
  if (!joinCards.length) return;
  joinMeasure();
  if (joinBound) return;
  joinBound = true;
  const kick = () => { if (!joinTick) { joinTick = true; requestAnimationFrame(joinMeasure); } };
  addEventListener('scroll', kick, { passive: true });
  addEventListener('resize', kick, { passive: true });
  onMQ(JOIN_FLAT, () => { joinCur = -1; joinMeasure(); });
  $('jroles').addEventListener('click', e => {
    const b = e.target.closest('[data-jrole]');
    if (!b || joinFlat()) return;
    joinLock = Date.now() + 2600;
    setJoinRole(+b.dataset.jrole);
  });
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
    // la marca se firma con su logotipo en blanco, no con el nombre escrito
    '<h3 class="elogoh">' + (e.logo
      ? '<img class="elogo" src="' + esc(e.logo) + '" alt="' + esc(e.name) + '" loading="lazy" decoding="async">'
      : '<span class="disp">' + esc(e.name) + '</span>') + '</h3>' +
    '<p class="edesc">' + esc(e.desc) + '</p>' +
    (e.meta ? '<p class="emeta">' + esc(e.meta) + '</p>' : '') +
    '<a class="elink" href="' + esc(e.url) + '" target="_blank" rel="noopener">Visitar ' + esc(e.name) + ' <i data-lucide="arrow-up-right" class="lu"></i></a>' +
    '</div></div></article>').join('');

  $('econav').innerHTML = C.ecosystem.map((e, i) =>
    '<li><a href="#eco-' + i + '" style="--acc:' + color(e.color) + '" data-econav="' + i + '">' +
    '<span class="n">' + String(i + 1).padStart(2, '0') + '</span>' +
    '<span class="v">' + esc(e.role) + '</span>' +
    '<span class="b">' + (e.logo
      ? '<img class="enavlogo" src="' + esc(e.logo) + '" alt="' + esc(e.name) + '" loading="lazy" decoding="async">'
      : esc(e.name)) + '</span></a></li>').join('');

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

let ecoPrev = -1;

function ecoMeasure() {
  ecoTick = false;
  const sec = $('ecosistema');
  if (!sec || !ecoPanels.length) return;
  // alto de ventana: innerHeight puede llegar a 0 en vistas embebidas, así que
  // clientHeight hace de red — si no, la sección se daría siempre por fuera
  const vh = innerHeight || document.documentElement.clientHeight || 800;
  const box = sec.getBoundingClientRect();
  if (box.bottom < 0 || box.top > vh) return;

  // --ecoP: 0 cuando la sección entra por abajo, 1 cuando acaba de salir por
  // arriba. Mueve las dos tramas del fondo (ver .eweave/.esigns en el CSS).
  // Se redondea a tres decimales y solo se escribe si cambia: una custom
  // property nueva invalida el estilo de todo el subárbol.
  const p = Math.min(1, Math.max(0, -box.top / Math.max(1, sec.offsetHeight - vh)));
  const q = +p.toFixed(3);
  if (q !== ecoPrev) { ecoPrev = q; sec.style.setProperty('--ecoP', q); }

  const line = vh * .34;
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
  // el logotipo vuelve al principio: el hero es sticky, así que un enlace a
  // #ultima no mueve nada (para el navegador ya está en pantalla)
  const top = e.target.closest('[data-top]');
  if (top) {
    e.preventDefault(); closeMenu();
    scrollTo({ top: 0, behavior: REDUCED.matches ? 'auto' : 'smooth' });
    if (window.showHeader) showHeader();
    return;
  }
  const v = e.target.closest('[data-visor]');
  if (v) { e.preventDefault(); openVisor(v.dataset.visor); return; }
  const slot = e.target.closest('.coverslot[data-mag]');
  if (slot) { openVisor(slot.dataset.mag); return; }
  const open = e.target.closest('[data-open-visor]');
  if (open) { e.preventDefault(); closeMenu(); openVisor(latestIssue().id); }
});
document.addEventListener('keydown', e => {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.coverslot[data-mag]')) {
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
    if (window.showHeader) showHeader();   // el panel cuelga de la cabecera
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
// 861px = el ancho al que la cabecera recupera sus enlaces (ver site.css)
onMQ(matchMedia('(min-width:861px)'), e => { if (e.matches) closeMenu(); });

/* ================= la cabecera se aparta al bajar =================
   Bajando estorba —y en móvil se come 68px de pantalla justo cuando el hero
   está clavado—; subiendo tiene que estar ahí al instante. Un rAF por frame y
   una sola clase: nada que obligue a recalcular layout.
   El menú abierto cuelga de la cabecera, así que mientras esté abierto se queda. */
(function autoHideHeader() {
  const head = document.querySelector('header.site');
  if (!head) return;
  const TOP = 90;        // arriba del todo siempre visible
  const DEAD = 6;        // rebote inercial y temblores del trackpad: se ignoran
  let lastY = Math.max(0, scrollY), hidden = false, ticking = false;

  function set(on) { if (on !== hidden) { hidden = on; head.classList.toggle('hide', on); } }
  // solo se esconde durante el hero, que es donde estorba de verdad (está
  // clavado y ocupa la pantalla entera). De la primera sección de después
  // —«Actualidad»— al pie se queda fija.
  function inHero() {
    const k = $('actualidad') || $('kiosko');
    return !k || k.getBoundingClientRect().top > head.offsetHeight;
  }
  function update() {
    ticking = false;
    const y = Math.max(0, scrollY), d = y - lastY;
    if (y < TOP || mnav.classList.contains('open') || !inHero()) { lastY = y; set(false); return; }
    if (Math.abs(d) < DEAD) return;
    lastY = y;
    set(d > 0);
  }
  addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  addEventListener('pageshow', () => { lastY = Math.max(0, scrollY); set(false); });
  window.showHeader = () => { lastY = Math.max(0, scrollY); set(false); };
}());

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

  // Fondo sólido del hero = color de la FRANJA tras la barra inferior flotante de
  // Safari iOS 26 (ver comentario en site.css, .hero). Va por JS y en rgb() PLANO
  // a propósito: iOS extiende a la safe-area los rgb/hex, pero NO los color-mix()
  // (comprobado en simulador: con color-mix la franja se quedaba clara). El color
  // sigue la escena: papel en superficie → mar (--seaP) → profundidad (--deepP),
  // igual que el color-mix de site.css, que queda como respaldo para no-JS/Chrome.
  const hx = h => [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16));
  const CREAM = hx('fbfaf6'), SEAC = hx('6fb4cb'), DEEPC = hx('052635');
  const lerp = (a, b, t) => Math.round(a + (b - a) * t);
  const q24 = v => Math.round(v * 24) / 24;   // cuantiza el color de la franja
  const heroCol = (seaP, deepP) => {
    const r = lerp(lerp(CREAM[0], SEAC[0], seaP), DEEPC[0], deepP);
    const g = lerp(lerp(CREAM[1], SEAC[1], seaP), DEEPC[1], deepP);
    const b = lerp(lerp(CREAM[2], SEAC[2], seaP), DEEPC[2], deepP);
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  };

  let pinTop = 0, range = 0, vh = 0, waveEnd = 0, seg = 0, enabled = true;
  let ticking = false, prevSea = -1, prevDeep = -1, prevCue = -1, prevBg = '';
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

  // classList solo cuando cambia de verdad: tocarlo en cada frame invalidaría
  // el estilo del hero y nos comeríamos lo que acabamos de ahorrar.
  const flags = {};
  function flag(name, on) {
    if (flags[name] === on) return;
    flags[name] = on;
    hero.classList.toggle(name, on);
  }

  function update() {
    ticking = false;
    if (!enabled) {
      root.style.setProperty('--seaP', '0');
      root.style.setProperty('--deepP', '0');
      root.style.setProperty('--cueP', '0');
      root.style.backgroundColor = heroCol(0, 0); prevBg = '';
      flag('dry', false); flag('sunk', false);
      return;
    }
    const s = window.scrollY - pinTop;              // px recorridos dentro del pin
    if (s < -vh || s > range + vh) return;          // fuera de pantalla: nada que hacer

    const seaP = clamp01(s / waveEnd);
    const deepP = step(waveEnd * 0.55, waveEnd * 0.98, s);
    prevSea = write('--seaP', seaP, prevSea);
    prevDeep = write('--deepP', deepP, prevDeep);
    // El color de la franja se cuantiza (q24): cambia unas pocas veces en todo el
    // scroll, no en cada frame. Así el repintado del fondo del hero no compite por
    // fps con la inmersión —que ya mueve olas, burbujas y desenfoques—; la franja
    // es fina y los saltos de color no se aprecian.
    const bg = heroCol(q24(seaP), q24(deepP));
    if (bg !== prevBg) { prevBg = bg; root.style.backgroundColor = bg; }

    // la flecha se apaga con el mismo tramo de salida del último beat, así
    // desaparece justo cuando se suelta el pin y aparece el kiosko debajo.
    const uLast = (s - waveEnd - (N - 1) * seg) / seg;
    const cueP = deepP * (1 - step(.9, 1, uLast));
    prevCue = write('--cueP', cueP, prevCue);

    // apagamos de verdad lo que la opacidad ya hacía invisible (ver site.css):
    // mientras se ven las olas, el relato de debajo no tiene por qué estar
    // animándose, y una vez bajo el agua el fondo y las crestas tampoco.
    flag('dry', deepP < 0.002);
    flag('sunk', seaP > 0.995);

    for (let i = 0; i < N; i++) {
      const u = (s - waveEnd - i * seg) / seg;      // 0→1 dentro de la ventana del beat
      const ph = (clamp01(u) - 0.5) * 2;            // -1 entra · 0 centrado · 1 sale
      // Entra rápido, se queda quieto la mayor parte del tramo, y sale.
      // El ÚLTIMO no se apaga dentro del pin: aguanta entero hasta que el hero
      // se suelta (u=1) y se va subiendo con él, ya en scroll normal. Antes se
      // desvanecía justo en el pin y quedaba una pantalla entera de azul vacío
      // antes de que asomara el kiosko; así el hueco lo ocupa el propio texto
      // saliendo. No hay riesgo de que el borde del kiosko lo recorte: el texto
      // va centrado en el hero, o sea media pantalla por encima de ese borde,
      // y las dos cosas suben a la vez.
      const op = i === N - 1
        ? step(0, .22, u) * (1 - step(1, 1.3, u))
        : step(0, .22, u) * (1 - step(.82, 1, u));
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

  // la flecha bajo el agua no salta al kiosko: solo empuja un beat más.
  const deepcue = hero.querySelector('.deepcue');
  if (deepcue) deepcue.addEventListener('click', e => {
    e.preventDefault();
    const s = window.scrollY - pinTop;
    const idx = s < waveEnd ? 0 : Math.floor((s - waveEnd) / seg) + 1;
    const target = idx >= N ? pinTop + range + vh + 1 : pinTop + waveEnd + idx * seg + seg / 2;
    window.scrollTo({ top: target, behavior: 'smooth' });
  });

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
    m.imgs = imgs.map(u => new URL(u, base).href);
    return m.data;
  })();
  m.loading.catch(() => { m.loading = null; });
  return m.loading;
}
/* Precalienta las imágenes de una edición para que pasar página sea instantáneo.
   Antes se hacía dentro de loadIssue, o sea en el arranque para TODAS las
   ediciones a la vez, compitiendo con el primer render y el scroll; ahora se
   lanza al abrir el visor y, para el resto, en huecos libres del navegador. */
function warmIssueImages(m) {
  if (!m.imgs || m.warmed) return;
  m.warmed = true;
  m.imgs.forEach(u => { const im = new Image(); im.src = u; });
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
  // el resto, repartido en huecos libres para no competir con el scroll;
  // al terminar, las imágenes interiores de cada edición, también en huecos
  (function next() {
    const job = pending.shift();
    if (!job) { MAGS.forEach(m => idle(() => warmIssueImages(m))); return; }
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
  // en una sola página (móvil) la revista aprovecha casi todo el ancho: las
  // flechas flotan sobre el margen y además se navega con toque y deslizamiento
  scale = Math.min((r.width - (mode === 'single' ? 44 : 150)) / bookW(), (r.height - 40) / 1123, 1.05);
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
  // solo se desactivan en los extremos: durante la animación turn() encola el
  // siguiente paso, así pasar páginas rápido no pierde ningún clic
  $('v-prev').disabled = cur === 0;
  $('v-next').disabled = cur === SP.length - 1;
  $('v-dots').innerHTML = SP.map((_, i) => '<button class="vdot' + (i === cur ? ' on' : '') + '" aria-label="Ir al pliego ' + (i + 1) + '" data-dot="' + i + '"></button>').join('');
  $('v-goto').value = String(curPageIndex());
  fitBook();
}

function render() {
  turnSeq++;                       // un giro en vuelo ya no debe tocar nada
  book.classList.remove('turning');
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

function jump(s) { if (animating || s === cur || !M) return; queuedTurn = 0; cur = Math.max(0, Math.min(s, SP.length - 1)); render(); }

/* si llega un paso mientras la hoja aún gira, se guarda y se ejecuta al
   terminar: hojear rápido responde a cada pulsación en vez de ignorarlas */
let queuedTurn = 0;

/* cada render() externo (cambio de edición, de modo, salto) invalida cualquier
   giro en vuelo: el turn viejo comprueba este token tras cada espera y, si ya
   no es el suyo, se retira sin tocar las mitades recién reconstruidas */
let turnSeq = 0;

const twoFrames = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

/* fin de giro por transitionend (exacto aunque un frame se retrase o la
   pestaña pierda el foco a mitad de giro), con red de seguridad temporal */
function leafDone(leaf) {
  return new Promise(res => {
    let done = false;
    const ok = () => { if (!done) { done = true; res(); } };
    leaf.addEventListener('transitionend', e => { if (e.target === leaf && e.propertyName === 'transform') ok(); });
    setTimeout(ok, 1150);
  });
}

/* Anatomía del giro, pensada para que nunca se vea un blanco ni un salto:
   1) La página que quedará al descubierto se apila DEBAJO de la actual y la
      hoja se monta oculta: mientras los iframes cargan, el pliego no cambia.
   2) Con todo cargado, en un mismo frame: se retira la página vieja (la cara
      frontal de la hoja es idéntica, nadie lo nota), se muestra la hoja y
      arrancan a la vez el giro y el recentrado del libro (.turning), que en
      portada/contraportada se desliza con la misma curva en vez de saltar.
   3) La página de aterrizaje también se apila debajo mientras la hoja aún la
      tapa; solo cuando está lista se retiran hoja y página vieja de golpe. */
async function turn(dir) {
  if (!M) return;
  if (animating) { queuedTurn = dir; return; }
  const t = cur + dir; if (t < 0 || t >= SP.length) return;
  if (mode === 'single' || REDUCED.matches) { cur = t; render(); return; }
  animating = true;
  const seq = turnSeq;
  const fw = dir > 0, [cl, cr] = SP[cur], [tl, tr] = SP[t];
  const underHalf = fw ? halfR : halfL, landHalf = fw ? halfL : halfR;

  const under = mkPage(M, fw ? tr : tl);
  const oldUnder = underHalf.firstElementChild;
  underHalf.prepend(under.el);

  const front = mkPage(M, fw ? cr : cl), back = mkPage(M, fw ? tl : tr);
  const leaf = document.createElement('div'); leaf.className = 'leaf';
  leaf.style.cssText = (fw ? 'right:0;' : 'left:0;') + 'transform-origin:' + (fw ? 'left' : 'right') + ' center;transform:rotateY(0deg);visibility:hidden;';
  const f1 = document.createElement('div'); f1.className = 'face'; f1.appendChild(front.el);
  f1.insertAdjacentHTML('beforeend', '<div class="shade" style="opacity:0"></div>');
  const f2 = document.createElement('div'); f2.className = 'face back'; f2.appendChild(back.el);
  f2.insertAdjacentHTML('beforeend', '<div class="shade" style="opacity:.55"></div>');
  leaf.append(f1, f2); host.appendChild(leaf);

  const abort = () => { leaf.remove(); under.el.remove(); book.classList.remove('turning'); animating = false; };

  await Promise.all([under.ready, front.ready, back.ready]);
  if (seq !== turnSeq) { abort(); return; }
  await twoFrames();
  if (seq !== turnSeq) { abort(); return; }

  cur = t;
  if (oldUnder) oldUnder.remove();
  underHalf.classList.toggle('void', under.el.classList.contains('void'));
  spine.classList.toggle('off', tl == null || tr == null);
  leaf.style.visibility = '';
  book.classList.add('turning');
  updateChrome();                                    // marcador y puntos ya al empezar el giro
  leaf.style.transform = 'rotateY(' + (fw ? -180 : 180) + 'deg)';
  // barrido de luz: la cara que se levanta se sombrea y la que aterriza se aclara
  f1.lastElementChild.style.opacity = '.5';
  f2.lastElementChild.style.opacity = '0';

  await leafDone(leaf);
  book.classList.remove('turning');
  if (seq !== turnSeq) { abort(); return; }

  const land = mkPage(M, fw ? tl : tr);
  const oldLand = landHalf.firstElementChild;
  landHalf.prepend(land.el);
  await land.ready;
  if (seq !== turnSeq) { land.el.remove(); abort(); return; }

  if (oldLand) oldLand.remove();
  landHalf.classList.toggle('void', land.el.classList.contains('void'));
  host.replaceChildren(); animating = false; updateChrome();
  if (queuedTurn) { const d = queuedTurn; queuedTurn = 0; turn(d); }
}

async function setIssue(id, pageIdx = 0) {
  const m = MAGS.find(x => x.id === id); if (!m) return;
  queuedTurn = 0;
  document.querySelectorAll('.vchip').forEach(c => {
    const on = c.dataset.id === id;
    c.classList.toggle('on', on);
    c.setAttribute('aria-selected', String(on));
  });
  $('v-print').href = encodeURI(m.print || m.file);
  const load = $('v-load');
  if (!m.data) { load.hidden = false; }
  try { await loadIssue(m); }
  catch (e) { load.hidden = true; $('v-ind').textContent = 'No se pudo cargar la edición'; return; }
  load.hidden = true;
  warmIssueImages(m);
  mode = computeMode();
  M = m; SP = buildSpreads(m.data.n); cur = indexToSpread(Math.min(pageIdx, m.data.n - 1));
  $('v-goto').innerHTML = m.data.labels.map((lb, i) => '<option value="' + i + '">' + String(i + 1).padStart(2, '0') + ' · ' + esc(lb) + '</option>').join('');
  render();
}

window.openVisor = function (id, pageIdx = 0) {
  vReturnFocus = document.activeElement;
  visor.hidden = false; document.body.classList.add('lock');
  if (window.syncBarTint) syncBarTint();
  closeMenu(); setIssue(id, pageIdx);
  lucide.createIcons();
  requestAnimationFrame(fitBook);
  $('v-close').focus();
};
window.closeVisor = function () {
  if (fsEl()) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
  visor.hidden = true; document.body.classList.remove('lock');
  if (window.syncBarTint) syncBarTint();
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
halfL.addEventListener('click', e => {
  if (mode !== 'single') { turn(-1); return; }
  // con una sola página, el tercio izquierdo retrocede y el resto avanza
  const r = halfL.getBoundingClientRect();
  turn(e.clientX - r.left < r.width * .34 ? -1 : 1);
});

/* trackpad / rueda horizontal: el gesto natural de hojear en escritorio.
   Umbral alto y periodo de gracia para que un desplazamiento diagonal
   o el rebote inercial no pasen varias páginas de golpe. */
let wheelT = 0;
stage.addEventListener('wheel', e => {
  if (Math.abs(e.deltaX) < 28 || Math.abs(e.deltaX) < Math.abs(e.deltaY) * 1.2) return;
  const now = Date.now();
  if (now - wheelT < 550) return;
  wheelT = now;
  turn(e.deltaX > 0 ? 1 : -1);
}, { passive: true });

/* ---- pantalla completa ---- */
const vfs = $('v-fs');
const fsEl = () => document.fullscreenElement || document.webkitFullscreenElement;
// iOS Safari (iPhone) no permite fullscreen de elementos: el botón desaparece
if (!visor.requestFullscreen && !visor.webkitRequestFullscreen) vfs.hidden = true;
vfs.addEventListener('click', () => {
  if (fsEl()) { (document.exitFullscreen || document.webkitExitFullscreen).call(document); return; }
  const p = (visor.requestFullscreen || visor.webkitRequestFullscreen).call(visor);
  // si el entorno lo deniega (p. ej. un iframe sin allowfullscreen), el botón
  // no puede hacer nada útil: mejor quitarlo que dejarlo mudo
  if (p && p.catch) p.catch(() => { vfs.hidden = true; });
});
function fsSync() {
  const on = !!fsEl();
  vfs.title = on ? 'Salir de pantalla completa (F)' : 'Pantalla completa (F)';
  vfs.setAttribute('aria-label', vfs.title);
  vfs.innerHTML = '<i data-lucide="' + (on ? 'minimize' : 'maximize') + '" class="lu"></i>';
  if (window.lucide) lucide.createIcons();
}
document.addEventListener('fullscreenchange', fsSync);
document.addEventListener('webkitfullscreenchange', fsSync);

/* el foco no se escapa del diálogo: Tab circula por los controles del visor */
function trapFocus(e) {
  const els = [...visor.querySelectorAll('button:not([disabled]):not([hidden]),select,a[href]')]
    .filter(el => el.offsetParent !== null);
  if (!els.length) return;
  const first = els[0], last = els[els.length - 1], a = document.activeElement;
  if (e.shiftKey && (a === first || !visor.contains(a))) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && (a === last || !visor.contains(a))) { e.preventDefault(); first.focus(); }
}

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
  if (e.key === 'Tab') { trapFocus(e); return; }
  // dentro del selector de páginas las flechas son suyas; Esc sí pasa
  if (e.key !== 'Escape' && e.target.matches('select,input,textarea')) return;
  if (e.key === 'ArrowRight') turn(1);
  else if (e.key === 'ArrowLeft') turn(-1);
  else if (e.key === 'Home') jump(0);
  else if (e.key === 'End') jump(SP.length - 1);
  else if (e.key === 'f' || e.key === 'F') { if (!vfs.hidden) vfs.click(); }
  // en pantalla completa, Esc primero sale de ella (lo hace el navegador);
  // el visor solo se cierra con el siguiente Esc
  else if (e.key === 'Escape') { if (!fsEl()) closeVisor(); }
});

new ResizeObserver(() => { if (!visor.hidden) applyMode(); }).observe(stage);
window.addEventListener('resize', () => { if (!visor.hidden) applyMode(); });

/* ================= arranque ================= */
function renderAll() {
  renderHero(); renderKiosko(); renderJoin(); renderEcosystem(); renderFooter();
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
  abrirVisorPorURL();
}
boot();

/* index.html?visor=<id|ultima>&pag=<n> abre el visor directamente.
   Lo usan las fichas del portal de noticias («Abrir en el visor») para llevar a
   la página exacta de la revista donde se publicó la versión larga. */
function abrirVisorPorURL() {
  const q = new URLSearchParams(location.search);
  const id = q.get('visor');
  if (!id) return;
  const m = (id === 'ultima' || id === '1') ? latestIssue() : (MAGS.find(x => x.id === id) || latestIssue());
  const pag = Math.max(1, parseInt(q.get('pag'), 10) || 1);
  openVisor(m.id, pag - 1);
  // la URL se limpia: al cerrar el visor y recargar no vuelve a abrirse solo
  history.replaceState(null, '', location.pathname + location.hash);
}

/* ============ theme-color de la barra inferior del navegador móvil ==========
   La barra inferior es UI del sistema: una página no puede volverla transparente
   ni quitarla, solo publicar un <meta name="theme-color"> como color de fondo.

   Safari iOS (cristal líquido): SIN theme-color, la barra queda en modo cristal y
   REFLEJA en vivo los píxeles de la página que tiene detrás. En el hero eso es el
   mar (#91cede), así que aparecía una «franja azul» pegada a la barra; en las
   secciones oscuras de más abajo se fundía y no se notaba. La barra no se puede
   volver invisible, pero SÍ se puede fijar: con un theme-color ESTÁTICO (definido
   en el <head> del HTML, presente al cargar) iOS pinta la barra de ese color
   sólido y deja de reflejar. Estático a propósito: cuando lo cambiábamos por
   scroll, Safari animaba el tinte con retardo (el «efecto perseguidor»). Por eso
   aquí, en iOS, NO lo tocamos: dejamos el valor fijo del HTML.

   Chrome/Android sí aplica cada cambio al instante y no difumina el fondo, así
   que ahí sí actualizamos el color de la sección que toca el borde inferior del
   viewport y el degradado acompaña al scroll. */
(function barTint() {
  // Reutiliza el <meta name="theme-color"> estático del HTML (uno solo); si no
  // existiera, lo crea. En Chrome/Android se irá actualizando; en iOS se deja fijo.
  const meta = document.querySelector('meta[name="theme-color"]')
    || document.head.appendChild(Object.assign(document.createElement('meta'), { name: 'theme-color' }));

  // Safari de verdad en iOS/iPadOS (Chrome/Firefox/Edge en iOS llevan otro UA).
  // iPadOS moderno se anuncia como «Macintosh»: lo delatan los puntos táctiles.
  const ua = navigator.userAgent;
  const iOS = /iP(hone|ad|od)/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const IOS_SAFARI = iOS && /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(ua);
  if (IOS_SAFARI) { window.syncBarTint = () => {}; return; }   // barra sólida fija (valor del HTML)

  const rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const mix = (a, b, t) => '#' + a.map((v, i) => Math.round(v + (b[i] - v) * t).toString(16).padStart(2, '0')).join('');

  const SURF = rgb('#91cede'), DEEP = rgb('#052635');   // agua de las olas → fondo de la inmersión (.deepTint)
  // «Actualidad» y el kiosko ya no pintan su propio fondo: comparten el de
  // .bajada (ver css/site.css). Estos son los tramos de ESE degradado que le
  // tocan a cada una — el kiosko cierra en el #06333f con el que abre
  // «Conócenos». Si se toca .bajada, hay que tocar esto.
  const ATOP = rgb('#072837'), ABOT = rgb('#0a4152');
  const KTOP = rgb('#0a4152'), KBOT = rgb('#06333f');
  const PAPER = '#fbfaf6';

  const hero = document.querySelector('#heroPin .hero');
  // Secciones con fondo propio bajo el hero, en orden de documento. Un par de
  // colores en vez de uno significa degradado: se interpola según lo metido que
  // esté el borde inferior de la pantalla en la sección.
  const zones = [['actualidad', [ATOP, ABOT]], ['kiosko', [KTOP, KBOT]], ['conocenos', '#0e2129'], ['ecosistema', '#0e2129'], ['suscribete', PAPER]]
    .map(([id, color]) => ({ el: $(id), color }))
    .filter(z => z.el);
  const foot = document.querySelector('footer.site');
  if (foot) zones.push({ el: foot, color: '#0c1e24' });

  let cur = '', ticking = false;
  function apply() {
    ticking = false;
    let c;
    if (visor && !visor.hidden) c = '#0b1c23';          // fondo del visor
    else {
      const y = scrollY + innerHeight;                  // borde inferior del viewport
      for (let i = zones.length - 1; i >= 0; i--) {
        const r = zones[i].el.getBoundingClientRect(), top = r.top + scrollY;
        if (y >= top) {
          const col = zones[i].color;
          c = Array.isArray(col)
            ? mix(col[0], col[1], Math.min(1, (y - top) / Math.max(1, r.height)))
            : col;
          break;
        }
      }
      if (!c) {                                         // aún en el hero: según baja la inmersión
        const deepP = hero ? parseFloat(hero.style.getPropertyValue('--deepP')) || 0 : 0;
        c = mix(SURF, DEEP, deepP);
      }
    }
    if (c !== cur) { cur = c; meta.content = c; }
  }
  const kick = () => { if (!ticking) { ticking = true; requestAnimationFrame(apply); } };
  window.syncBarTint = kick;
  addEventListener('scroll', kick, { passive: true });
  addEventListener('resize', kick, { passive: true });
  addEventListener('load', kick);
  apply();
}());
