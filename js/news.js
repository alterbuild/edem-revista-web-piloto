/* ============================================================
   EDEM Times — news.js
   Render del portal de noticias (noticias.html), de la ficha de
   noticia (noticia.html) y del bloque «Actualidad» de la home.

   Los datos SIEMPRE llegan por EdemCMS.load() / loadOne(), así que
   este archivo no sabe si vienen del JSON local o de un CMS
   headless: solo sabe pintar el modelo normalizado.

   Cada bloque se arranca solo si su contenedor existe en la
   página, de modo que el mismo script vale para las tres.
   ============================================================ */
'use strict';

(function () {

  const $ = id => document.getElementById(id);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  const ECO_COLORS = { edem: 'var(--edem)', lanzadera: 'var(--lanzadera)', angels: 'var(--angels)', neutral: 'var(--ink-500)' };
  const color = c => ECO_COLORS[c] || ECO_COLORS.neutral;

  /* ---------- fechas ---------- */
  const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const MESES_C = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  // los ISO se leen como fecha local a mano: `new Date('2026-07-22')` es UTC y
  // en España se queda en el día anterior a partir de medianoche
  function aFecha(iso) {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || '');
    return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
  }
  function fechaLarga(iso) { const d = aFecha(iso); return d ? d.getDate() + ' de ' + MESES[d.getMonth()] + ' de ' + d.getFullYear() : ''; }
  function fechaCorta(iso) { const d = aFecha(iso); return d ? d.getDate() + ' ' + MESES_C[d.getMonth()] : ''; }
  function relativa(iso) {
    const d = aFecha(iso); if (!d) return '';
    const dias = Math.round((Date.now() - d.getTime()) / 86400000);
    if (dias <= 0) return 'hoy';
    if (dias === 1) return 'ayer';
    if (dias < 7) return 'hace ' + dias + ' días';
    if (dias < 14) return 'hace 1 semana';
    if (dias < 31) return 'hace ' + Math.round(dias / 7) + ' semanas';
    if (dias < 60) return 'hace 1 mes';
    if (dias < 365) return 'hace ' + Math.round(dias / 30) + ' meses';
    return fechaCorta(iso);
  }

  /* ---------- helpers de modelo ---------- */
  const urlNoticia = id => 'noticia.html?a=' + encodeURIComponent(id);

  function palabras(n) {
    return (n.cuerpo || []).reduce((t, b) => t + (b.texto || '').split(/\s+/).length + (b.items || []).join(' ').split(/\s+/).length, 0);
  }
  const minutos = n => n.lectura || Math.max(1, Math.round(palabras(n) / 200));

  function indexaSecciones(secciones) {
    const m = {};
    secciones.forEach(s => { m[s.id] = s; });
    return id => m[id] || { id, nombre: id || 'EDEM Times', color: 'neutral', desc: '' };
  }

  /* ---------- tarjetas ----------
     Tres formatos, los mismos que usa cualquier portada de periódico:
     `lead` (apertura a toda página), `card` (la unidad del flujo) y `row`
     (línea de sumario, sin foto grande). */
  function tarjeta(n, sec, tipo) {
    const s = sec(n.seccion);
    const badge = '<span class="nbadge" style="background:' + color(s.color) + '">' + esc(s.nombre) + '</span>';
    const meta = '<span class="nmeta"><time datetime="' + esc(n.fecha) + '">' + esc(fechaLarga(n.fecha)) + '</time>' +
      '<span class="sep">·</span><span class="nread">' + minutos(n) + ' min</span></span>';
    const foto = n.img
      ? '<div class="nim"><img src="' + esc(n.img) + '" alt="' + esc(n.alt || '') + '" loading="lazy" decoding="async" onerror="this.closest(\'.nim\').classList.add(\'nofoto\');this.remove()"></div>'
      : '<div class="nim nofoto"></div>';

    if (tipo === 'row') {
      return '<a class="nrow" href="' + esc(urlNoticia(n.id)) + '">' +
        '<div class="nrowtxt"><span class="nkick" style="color:' + color(s.color) + '">' + esc(s.nombre) + '</span>' +
        '<h3 class="disp">' + esc(n.titulo) + '</h3>' +
        '<span class="nago">' + esc(relativa(n.fecha)) + '</span></div>' +
        (n.img ? '<img class="nthumb" src="' + esc(n.img) + '" alt="" loading="lazy" decoding="async" onerror="this.remove()">' : '') +
        '</a>';
    }
    if (tipo === 'lead') {
      return '<a class="ncard lead" href="' + esc(urlNoticia(n.id)) + '">' + foto +
        '<div class="nbody">' + badge +
        '<h2 class="disp">' + esc(n.titulo) + '</h2>' +
        '<p class="nlead">' + esc(n.entradilla) + '</p>' +
        '<div class="nfoot"><span class="nby">Por ' + esc(n.autor) + '</span>' + meta + '</div>' +
        '<span class="ngo">Leer la noticia <i data-lucide="arrow-right" class="lu"></i></span>' +
        '</div></a>';
    }
    return '<a class="ncard" href="' + esc(urlNoticia(n.id)) + '">' + foto +
      '<div class="nbody">' + badge +
      '<h3 class="disp">' + esc(n.titulo) + '</h3>' +
      '<p>' + esc(n.entradilla) + '</p>' +
      '<div class="nfoot">' + meta + '</div>' +
      '</div></a>';
  }

  const iconos = () => { if (window.lucide) lucide.createIcons(); };
  const reveals = () => { if (window.observeReveals) observeReveals(); };

  /* ============================================================
     1 · BLOQUE «ACTUALIDAD» DE LA HOME
     La antigua sección «En este número» pasa a ser la portada del
     diario: apertura + tres titulares + puerta al portal.
     ============================================================ */
  async function bloqueHome() {
    const host = $('dgrid'); if (!host) return;
    const { noticias, secciones } = await window.EdemCMS.load();
    if (!noticias.length) { const s = $('actualidad'); if (s) s.hidden = true; return; }
    const sec = indexaSecciones(secciones);

    // la apertura es la marcada con portada:1; si nadie la marca, la más nueva
    const lead = noticias.find(n => n.portada === 1) || noticias[0];
    const resto = noticias.filter(n => n !== lead)
      .sort((a, b) => (b.portada ? 1 : 0) - (a.portada ? 1 : 0))
      .slice(0, 3);

    host.innerHTML =
      '<div class="dlead rv">' + tarjeta(lead, sec, 'lead') + '</div>' +
      '<div class="dlist rv">' + resto.map(n => tarjeta(n, sec, 'row')).join('') +
      '<a class="dall" href="noticias.html"><span>Ver todas las noticias</span><i data-lucide="arrow-right" class="lu"></i></a>' +
      '</div>';

    const nota = $('actualidad-note');
    if (nota) nota.textContent = noticias.length + ' noticias publicadas · última, ' + relativa(noticias[0].fecha);
    iconos(); reveals();
  }

  /* ============================================================
     2 · PORTAL DE NOTICIAS (noticias.html)
     ============================================================ */
  const PASO = 6;   // cuántas noticias añade cada «Cargar más»

  async function portal() {
    const host = $('np-grid'); if (!host) return;
    const { noticias, secciones, portal: cfg, origen } = await window.EdemCMS.load();
    const sec = indexaSecciones(secciones);

    // la fecha de hoy, como el cabecero de un diario
    const hoy = $('np-hoy');
    if (hoy) {
      const d = new Date();
      hoy.textContent = d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    }

    if (cfg && cfg.titulo) $('np-title').innerHTML = cfg.titulo;
    if (cfg && cfg.kicker) $('np-kicker').textContent = cfg.kicker;
    if (cfg && cfg.lead) $('np-lead').textContent = cfg.lead;
    const aviso = $('np-aviso');
    if (aviso && cfg && cfg.aviso && origen !== 'cms') { aviso.textContent = cfg.aviso; aviso.hidden = false; }

    if (!noticias.length) {
      host.innerHTML = '<p class="nvacio">Todavía no hay noticias publicadas. Vuelve pronto.</p>';
      return;
    }

    /* ---- portada: apertura + dos secundarias + raíl de lo último ---- */
    const lead = noticias.find(n => n.portada === 1) || noticias[0];
    const sec2 = noticias.filter(n => n !== lead && n.portada).slice(0, 2);
    const secundarias = sec2.length === 2 ? sec2 : noticias.filter(n => n !== lead).slice(0, 2);
    $('np-lead-card').innerHTML = tarjeta(lead, sec, 'lead');
    $('np-sec').innerHTML = secundarias.map(n => tarjeta(n, sec, 'card')).join('');
    $('np-ultimo').innerHTML = noticias.slice(0, 6).map(n =>
      '<li><a href="' + esc(urlNoticia(n.id)) + '"><span class="uhora">' + esc(relativa(n.fecha)) + '</span>' +
      '<span class="utit">' + esc(n.titulo) + '</span>' +
      '<span class="usec" style="color:' + color(sec(n.seccion).color) + '">' + esc(sec(n.seccion).nombre) + '</span></a></li>').join('');

    /* ---- filtro por sección ---- */
    const usadas = secciones.filter(s => noticias.some(n => n.seccion === s.id));
    $('np-filtros').innerHTML =
      '<button class="nfil on" type="button" data-fil="todas" aria-pressed="true">Todas <span class="fnum">' + noticias.length + '</span></button>' +
      usadas.map(s => '<button class="nfil" type="button" data-fil="' + esc(s.id) + '" aria-pressed="false" style="--fc:' + color(s.color) + '">' +
        esc(s.nombre) + ' <span class="fnum">' + noticias.filter(n => n.seccion === s.id).length + '</span></button>').join('');

    let filtro = 'todas', visibles = PASO;

    function pinta() {
      const lista = filtro === 'todas' ? noticias : noticias.filter(n => n.seccion === filtro);
      const trozo = lista.slice(0, visibles);
      host.innerHTML = trozo.map(n => tarjeta(n, sec, 'card')).join('');
      $('np-mas').hidden = trozo.length >= lista.length;
      $('np-count').textContent = trozo.length + ' de ' + lista.length + (lista.length === 1 ? ' noticia' : ' noticias');
      const s = filtro === 'todas' ? null : sec(filtro);
      $('np-secdesc').textContent = s ? s.desc : '';
      iconos();
    }
    pinta();

    $('np-filtros').addEventListener('click', e => {
      const b = e.target.closest('[data-fil]'); if (!b) return;
      filtro = b.dataset.fil; visibles = PASO;
      document.querySelectorAll('.nfil').forEach(x => {
        x.classList.toggle('on', x === b);
        x.setAttribute('aria-pressed', String(x === b));
      });
      pinta();
      // el foco se queda en el filtro, pero la rejilla debe verse desde arriba
      const caja = $('np-flujo');
      if (caja) caja.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    $('np-mas').addEventListener('click', () => { visibles += PASO; pinta(); });

    // hash de sección: noticias.html#emprende abre ya filtrado
    const h = decodeURIComponent(location.hash.slice(1));
    if (h && usadas.some(s => s.id === h)) {
      const b = document.querySelector('[data-fil="' + CSS.escape(h) + '"]');
      if (b) b.click();
    }
    reveals();
  }

  /* ============================================================
     3 · FICHA DE NOTICIA (noticia.html?a=id)
     ============================================================ */
  function bloque(b) {
    switch (b.tipo) {
      case 'h2': return '<h2 class="disp">' + esc(b.texto) + '</h2>';
      case 'h3': return '<h3>' + esc(b.texto) + '</h3>';
      case 'cita': return '<figure class="acita"><i data-lucide="quote" class="lu"></i><blockquote>' + esc(b.texto) + '</blockquote>' +
        (b.autor ? '<figcaption>' + esc(b.autor) + '</figcaption>' : '') + '</figure>';
      case 'lista': return '<ul class="alista">' + (b.items || []).map(i => '<li>' + esc(i) + '</li>').join('') + '</ul>';
      case 'img': return '<figure class="afig"><img src="' + esc(b.src) + '" alt="' + esc(b.alt || '') + '" loading="lazy" decoding="async">' +
        (b.pie ? '<figcaption>' + esc(b.pie) + '</figcaption>' : '') + '</figure>';
      case 'destacado': return '<p class="adest disp-i">' + esc(b.texto) + '</p>';
      case 'dato': return '<div class="adato"><span class="cifra disp">' + esc(b.cifra) + '</span><span class="txt">' + esc(b.texto) + '</span></div>';
      default: return '<p>' + esc(b.texto) + '</p>';
    }
  }

  async function ficha() {
    const host = $('art'); if (!host) return;
    const id = new URLSearchParams(location.search).get('a');
    const n = id ? await window.EdemCMS.loadOne(id) : null;

    if (!n) {
      host.innerHTML = '<div class="wrap nvacio"><span class="over">Error 404</span>' +
        '<h1 class="disp">Esta noticia no está<span class="pt">.</span></h1>' +
        '<p>Puede que la hayamos archivado o que el enlace venga cambiado.</p>' +
        '<a class="btn pri" href="noticias.html"><i data-lucide="newspaper" class="lu"></i> Ir al portal de noticias</a></div>';
      document.title = 'Noticia no encontrada — EDEM Times';
      // en vez de dejar un hueco, el 404 ofrece lo último publicado
      await relacionadas({ id: '', seccion: '' });
      iconos();
      return;
    }

    const { secciones } = await window.EdemCMS.load();
    const sec = indexaSecciones(secciones)(n.seccion);
    const c = color(sec.color);
    document.documentElement.style.setProperty('--acc', c);

    /* metadatos: título de pestaña, descripción y tarjeta al compartir */
    document.title = n.titulo + ' — EDEM Times';
    const meta = (sel, attr, val) => { const el = document.querySelector(sel); if (el) el.setAttribute(attr, val); };
    meta('meta[name="description"]', 'content', n.entradilla);
    meta('meta[property="og:title"]', 'content', n.titulo);
    meta('meta[property="og:description"]', 'content', n.entradilla);
    if (n.img) meta('meta[property="og:image"]', 'content', new URL(n.img, location.href).href);
    meta('link[rel="canonical"]', 'href', location.href);

    host.innerHTML =
      '<header class="ahead"><div class="wrap awrap">' +
        '<nav class="amiga" aria-label="Migas"><a href="index.html">Portada</a><span>›</span>' +
        '<a href="noticias.html#' + esc(sec.id) + '" style="color:' + c + '">' + esc(sec.nombre) + '</a></nav>' +
        '<h1 class="disp">' + esc(n.titulo) + '</h1>' +
        '<p class="aentradilla">' + esc(n.entradilla) + '</p>' +
        '<div class="afirma">' +
          '<div class="afirma-txt"><span class="aautor">' + esc(n.autor) + '</span>' +
          (n.autorRol ? '<span class="arol">' + esc(n.autorRol) + '</span>' : '') + '</div>' +
          '<div class="afecha"><time datetime="' + esc(n.fecha) + '">' + esc(fechaLarga(n.fecha)) + '</time>' +
          '<span class="sep">·</span><span>' + minutos(n) + ' min de lectura</span></div>' +
          '<div class="ashare" id="ashare">' +
            '<button class="sbtn" data-share="copiar" aria-label="Copiar enlace"><i data-lucide="link" class="lu"></i></button>' +
            '<a class="sbtn" data-share="linkedin" href="#" target="_blank" rel="noopener" aria-label="Compartir en LinkedIn"><i data-lucide="linkedin" class="lu"></i></a>' +
            '<a class="sbtn" data-share="whatsapp" href="#" target="_blank" rel="noopener" aria-label="Compartir por WhatsApp"><i data-lucide="message-circle" class="lu"></i></a>' +
            '<span class="scopy" id="scopy" role="status" aria-live="polite"></span>' +
          '</div>' +
        '</div>' +
      '</div></header>' +
      (n.img ? '<figure class="ahero"><div class="wrap"><img src="' + esc(n.img) + '" alt="' + esc(n.alt || '') + '" fetchpriority="high" decoding="async">' +
        (n.pie ? '<figcaption>' + esc(n.pie) + '</figcaption>' : '') + '</div></figure>' : '') +
      '<div class="wrap acuerpo"><div class="acol">' +
        n.cuerpo.map(bloque).join('') +
        (n.etiquetas.length ? '<div class="atags">' + n.etiquetas.map(t => '<span class="atag">' + esc(t) + '</span>').join('') + '</div>' : '') +
      '</div></div>' +
      (n.revista ? '<div class="wrap"><aside class="arevista">' +
        '<span class="over">También en papel</span>' +
        '<p class="disp-i">' + esc(n.revista.texto || 'Esta historia tiene versión larga en la revista.') + '</p>' +
        '<a class="btn pri" href="index.html?visor=' + esc(n.revista.issue) + '&pag=' + encodeURIComponent(n.revista.page || 1) + '">' +
        '<i data-lucide="book-open" class="lu"></i> Abrir en el visor</a></aside></div>' : '');

    /* primer párrafo con capitular, como en el papel */
    const p1 = host.querySelector('.acol > p');
    if (p1 && !p1.classList.contains('adest')) p1.classList.add('acap');

    compartir(n);
    await relacionadas(n);
    iconos();
    progreso();
  }

  /* ---- compartir: enlaces nativos, sin scripts de terceros ---- */
  function compartir(n) {
    const url = location.href, t = n.titulo;
    const box = $('ashare'); if (!box) return;
    const li = box.querySelector('[data-share="linkedin"]');
    const wa = box.querySelector('[data-share="whatsapp"]');
    if (li) li.href = 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(url);
    if (wa) wa.href = 'https://wa.me/?text=' + encodeURIComponent(t + ' — ' + url);
    const btn = box.querySelector('[data-share="copiar"]'), aviso = $('scopy');
    if (btn) btn.addEventListener('click', async () => {
      try {
        // en móvil, el compartir del sistema es lo que la gente espera
        if (navigator.share) { await navigator.share({ title: t, text: n.entradilla, url }); return; }
        await navigator.clipboard.writeText(url);
        aviso.textContent = 'Enlace copiado';
        setTimeout(() => { aviso.textContent = ''; }, 2400);
      } catch (_) { /* el usuario canceló o el navegador no deja */ }
    });
  }

  /* ---- sigue leyendo: misma sección primero, luego lo más reciente ---- */
  async function relacionadas(n) {
    const host = $('arel'); if (!host) return;
    const { noticias, secciones } = await window.EdemCMS.load();
    const sec = indexaSecciones(secciones);
    const otras = noticias.filter(x => x.id !== n.id);
    const mismas = otras.filter(x => x.seccion === n.seccion);
    const lista = [...mismas, ...otras.filter(x => x.seccion !== n.seccion)].slice(0, 3);
    if (!lista.length) { host.hidden = true; return; }
    $('arel-grid').innerHTML = lista.map(x => tarjeta(x, sec, 'card')).join('');
  }

  /* ---- barra de progreso de lectura ---- */
  function progreso() {
    const bar = $('aprog'); if (!bar) return;
    let tick = false;
    const calc = () => {
      tick = false;
      const cuerpo = document.querySelector('.acuerpo');
      if (!cuerpo) return;
      // recorrido = lo que mide el cuerpo menos la pantalla; `top` ya es la
      // distancia recorrida en negativo, así que no hace falta tocar scrollY
      const alto = cuerpo.offsetHeight - innerHeight;
      const p = alto > 0 ? Math.min(1, Math.max(0, -cuerpo.getBoundingClientRect().top / alto)) : 0;
      bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
    };
    addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(calc); } }, { passive: true });
    addEventListener('resize', calc, { passive: true });
    calc();
  }

  /* ---------- arranque ---------- */
  function boot() {
    bloqueHome().catch(e => console.warn('[EDEM Times] bloque de actualidad:', e));
    portal().catch(e => console.warn('[EDEM Times] portal de noticias:', e));
    ficha().catch(e => console.warn('[EDEM Times] ficha de noticia:', e));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  window.EdemNews = { tarjeta, fechaLarga, relativa, urlNoticia, minutos };
})();
