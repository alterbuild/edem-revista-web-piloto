/* ============================================================
   EDEM Times — search.js
   El buscador de la casa: la lupa de la cabecera abre un panel
   que busca a la vez en las noticias del portal, en las ediciones
   de la revista, en las secciones y en las páginas del sitio.

   No necesita marcado en el HTML: el panel se monta solo y
   cualquier elemento con [data-buscar] lo abre (la lupa de la
   barra y la entrada del menú móvil). Atajos: ⌘K / Ctrl+K y «/».

   Las noticias llegan por EdemCMS.load(), así que el buscador
   ve lo mismo que el portal, venga del JSON local o del CMS.
   Se expone `EdemSearch.filtra(lista, q)` para que el buscador
   en línea de la página de Actualidad (js/news.js) ordene con
   exactamente el mismo criterio que el panel.
   ============================================================ */
'use strict';

(function () {

  const esc = s => String(s ?? '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));

  /* Texto «plano» para comparar: sin acentos y en minúsculas, pero con la
     MISMA longitud que el original (descomponer y quitar los diacríticos deja
     cada letra en un carácter). Eso es lo que permite subrayar la coincidencia
     sobre el texto de verdad, con sus tildes. */
  const plano = s => String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const terminos = q => plano(q).split(/[^\p{L}\p{N}]+/u).filter(t => t.length > 1);

  /* ---------- puntuación ----------
     Un resultado vale si TODOS los términos aparecen en alguna parte; lo que
     cambia el orden es dónde aparecen: el titular manda, el cuerpo apenas. */
  const PESOS = { t: 40, k: 16, s: 10, c: 4 };

  function puntua(h, ts, frase) {
    let total = 0;
    for (const t of ts) {
      let s = 0;
      if (h.t.includes(t)) { s += PESOS.t; if (new RegExp('(^|[^\\p{L}\\p{N}])' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'u').test(h.t)) s += 20; }
      if (h.k.includes(t)) s += PESOS.k;
      if (h.s.includes(t)) s += PESOS.s;
      if (h.c.includes(t)) s += PESOS.c;
      if (!s) return 0;                       // falta un término: fuera
      total += s;
    }
    if (frase.length > 2 && h.t.includes(frase)) total += 30;   // la frase entera en el titular
    if (h.t.startsWith(frase)) total += 20;
    return total;
  }

  /* ---------- índice ---------- */
  const cuerpoTexto = n => (n.cuerpo || [])
    .map(b => [b.texto, b.pie, b.cifra, (b.items || []).join(' '), b.autor].filter(Boolean).join(' '))
    .join(' ');

  function heno(o) {   // {t: titular, s: subtítulo, k: palabras clave, c: cuerpo}
    return { t: plano(o.t), s: plano(o.s), k: plano(o.k), c: plano(o.c) };
  }

  const hayNoticia = (function () {
    const cache = new WeakMap();
    return function (n) {
      let h = cache.get(n);
      if (!h) {
        h = heno({
          t: n.titulo, s: n.entradilla,
          k: [n.autor, n.autorRol, n.seccion, (n.etiquetas || []).join(' ')].filter(Boolean).join(' '),
          c: cuerpoTexto(n)
        });
        cache.set(n, h);
      }
      return h;
    };
  })();

  /* ---------- segunda pasada: tolerancia a erratas ----------
     Solo entra si la búsqueda literal se ha quedado a cero. Compara término a
     término contra las palabras del titular y las claves admitiendo una
     errata (una letra cambiada, sobrante o de menos), que es lo que salva
     «hackaton» → «hackathon» o «lanzadeta» → «lanzadera». */
  function cerca(a, b) {
    if (a === b) return true;
    const la = a.length, lb = b.length;
    if (Math.abs(la - lb) > 1) return false;
    let i = 0, j = 0, fallos = 0;
    while (i < la && j < lb) {
      if (a[i] === b[j]) { i++; j++; continue; }
      if (++fallos > 1) return false;
      if (la > lb) i++; else if (lb > la) j++; else { i++; j++; }
    }
    return true;
  }

  function palabrasDe(h) {
    if (!h._w) h._w = Array.from(new Set((h.t + ' ' + h.k).split(/[^\p{L}\p{N}]+/u).filter(w => w.length > 3)));
    return h._w;
  }

  function puntuaLaxo(h, ts) {
    let total = 0;
    for (const t of ts) {
      if (t.length < 5) {                       // en palabras cortas una errata cambia demasiado
        if (!h.t.includes(t) && !h.k.includes(t)) return 0;
        total += 20; continue;
      }
      const w = palabrasDe(h).find(p => cerca(p, t) || (p.length > t.length && cerca(p.slice(0, t.length), t)));
      if (!w) return 0;
      total += 24;
    }
    return total;
  }

  /* Busca sobre cualquier colección: `dameH` dice de dónde sale el pajar de
     cada elemento (el índice del panel lo trae hecho; las noticias del portal
     lo calculan al vuelo). Devuelve además si ha hecho falta la pasada laxa. */
  function selecciona(lista, q, dameH) {
    const ts = terminos(q);
    if (!ts.length) return { items: lista.slice(), laxo: false, ts };
    const frase = plano(q).trim();
    const ord = ps => ps
      .sort((a, b) => b.p - a.p || String(b.x.fecha || '').localeCompare(String(a.x.fecha || '')))
      .map(o => o.x);

    const exacta = lista.map(x => ({ x, p: puntua(dameH(x), ts, frase) })).filter(o => o.p > 0);
    if (exacta.length) return { items: ord(exacta), laxo: false, ts };

    const laxa = lista.map(x => ({ x, p: puntuaLaxo(dameH(x), ts) })).filter(o => o.p > 0);
    return { items: ord(laxa), laxo: laxa.length > 0, ts };
  }

  /* Filtra y ordena una lista de noticias. Lo usa el buscador en línea del
     portal (js/news.js) además del panel. */
  function filtra(lista, q) {
    return selecciona(lista, q, hayNoticia).items;
  }

  /* ---------- catálogo completo (noticias + revistas + secciones + páginas) ---------- */
  const PAGINAS = [
    { titulo: 'Portada', desc: 'La última edición de EDEM Times y todo lo demás.', url: 'index.html', icono: 'anchor', clave: 'inicio home portada revista' },
    { titulo: 'Actualidad', desc: 'El portal de noticias: campus, emprendimiento, inversión y alumni.', url: 'noticias.html', icono: 'newspaper', clave: 'noticias diario actualidad' },
    { titulo: 'Kiosko de revistas', desc: 'Todas las ediciones, de la primera a la última, en el visor.', url: 'index.html#kiosko', icono: 'library', clave: 'kiosko ediciones numeros archivo hemeroteca' },
    { titulo: 'Conócenos', desc: 'Cómo participar en la revista: escribir, fotografiar, ilustrar o proponer temas.', url: 'index.html#conocenos', icono: 'book-marked', clave: 'participar redaccion equipo escribir colaborar' },
    { titulo: 'Ecosistema', desc: 'EDEM, Lanzadera y Angels: la Marina de Empresas.', url: 'index.html#ecosistema', icono: 'waypoints', clave: 'marina empresas lanzadera angels edem' },
    { titulo: 'Suscríbete', desc: 'Un correo con cada nueva edición y lo publicado en el portal.', url: 'index.html#suscribete', icono: 'mail', clave: 'newsletter boletin correo email suscripcion suscribirme suscribirse apuntarme alta' }
  ];

  let indice = null;      // promesa del catálogo, una por página

  function construye() {
    if (indice) return indice;
    indice = (async () => {
      const items = [];

      /* noticias y secciones */
      let noticias = [], secciones = [];
      try { ({ noticias, secciones } = await window.EdemCMS.load()); }
      catch (e) { console.warn('[EDEM Times] el buscador no ha podido leer las noticias:', e.message); }

      const nombreSec = {};
      secciones.forEach(s => { nombreSec[s.id] = s; });

      noticias.forEach(n => {
        const s = nombreSec[n.seccion] || { nombre: n.seccion || 'EDEM Times', color: 'neutral' };
        items.push({
          tipo: 'noticia', grupo: 'Noticias',
          titulo: n.titulo, desc: n.entradilla, kick: s.nombre, color: s.color,
          url: 'noticia.html?a=' + encodeURIComponent(n.id),
          img: n.img, fecha: n.fecha, cuerpo: cuerpoTexto(n),
          h: hayNoticia(n)
        });
      });

      secciones.forEach(s => {
        const cuantas = noticias.filter(n => n.seccion === s.id).length;
        if (!cuantas) return;
        items.push({
          tipo: 'seccion', grupo: 'Secciones',
          titulo: s.nombre, desc: s.desc, kick: cuantas + (cuantas === 1 ? ' noticia' : ' noticias'),
          color: s.color, icono: 'newspaper',
          url: 'noticias.html#' + encodeURIComponent(s.id),
          h: heno({ t: s.nombre, s: s.desc, k: 'seccion ' + s.id, c: '' })
        });
      });

      /* ediciones de la revista */
      try {
        const r = await fetch('data/content.json', { cache: 'no-cache' });
        if (r.ok) {
          const c = await r.json();
          (c.issues || []).forEach(i => {
            const hero = i.hero || {};
            items.push({
              tipo: 'revista', grupo: 'La revista',
              titulo: i.title, desc: i.desc, kick: i.nr, icono: 'book-open',
              url: 'index.html?visor=' + encodeURIComponent(i.id),
              h: heno({
                t: [i.title, i.nr, i.chip].filter(Boolean).join(' '),
                s: i.desc, k: [i.badge, hero.sub, (hero.chips || []).join(' ')].filter(Boolean).join(' '),
                c: [i.meta, hero.lead].filter(Boolean).join(' ')
              })
            });
          });
        }
      } catch (e) { console.warn('[EDEM Times] el buscador no ha podido leer las ediciones:', e.message); }

      /* páginas fijas */
      PAGINAS.forEach(p => items.push({
        tipo: 'pagina', grupo: 'Ir a', titulo: p.titulo, desc: p.desc, icono: p.icono, url: p.url,
        h: heno({ t: p.titulo, s: p.desc, k: p.clave, c: '' })
      }));

      return { items, noticias, secciones };
    })();
    return indice;
  }

  /* ---------- subrayado de la coincidencia ---------- */
  function marca(txt, ts) {
    const src = String(txt ?? '');
    const p = plano(src);
    if (!ts.length || p.length !== src.length) return esc(src);
    const trozos = [];
    ts.forEach(t => { let i = p.indexOf(t); while (i > -1) { trozos.push([i, i + t.length]); i = p.indexOf(t, i + t.length); } });
    if (!trozos.length) return esc(src);
    trozos.sort((a, b) => a[0] - b[0]);
    let out = '', pos = 0;
    for (const [a, b] of trozos) {
      if (a < pos) continue;                    // solapada con la anterior
      out += esc(src.slice(pos, a)) + '<mark>' + esc(src.slice(a, b)) + '</mark>';
      pos = b;
    }
    return out + esc(src.slice(pos));
  }

  /* Del cuerpo solo se enseña la frase donde cae la primera coincidencia. */
  function extracto(cuerpo, ts) {
    if (!cuerpo || !ts.length) return '';
    const p = plano(cuerpo);
    let i = -1;
    for (const t of ts) { const j = p.indexOf(t); if (j > -1 && (i < 0 || j < i)) i = j; }
    if (i < 0) return '';
    const desde = Math.max(0, i - 60), hasta = Math.min(cuerpo.length, i + 120);
    return (desde ? '… ' : '') + cuerpo.slice(desde, hasta).trim() + (hasta < cuerpo.length ? ' …' : '');
  }

  /* ---------- panel ---------- */
  const ECO = { edem: 'var(--edem)', lanzadera: 'var(--lanzadera)', angels: 'var(--angels)', neutral: 'var(--ink-500)' };
  const color = c => ECO[c] || ECO.neutral;
  const TOPE = { noticia: 8, revista: 4, seccion: 5, pagina: 4 };
  const ORDEN_GRUPOS = ['Noticias', 'La revista', 'Secciones', 'Ir a'];

  let raiz = null, campo = null, cuerpo = null, ultimoFoco = null, sel = -1, opciones = [], tDebounce = 0;

  function monta() {
    if (raiz) return;
    raiz = document.createElement('div');
    raiz.className = 'sbusca';
    raiz.id = 'sbusca';
    raiz.hidden = true;
    raiz.innerHTML =
      '<div class="scrim" data-scerrar></div>' +
      '<div class="spanel" role="dialog" aria-modal="true" aria-label="Buscar en EDEM Times">' +
        '<div class="sbar">' +
          '<i data-lucide="search" class="lu"></i>' +
          '<input id="sbusca-q" type="search" role="combobox" aria-expanded="true" aria-controls="sbusca-res" aria-autocomplete="list" ' +
            'placeholder="Buscar noticias, revistas, secciones…" autocomplete="off" autocorrect="off" spellcheck="false" aria-label="Buscar en EDEM Times">' +
          '<button type="button" class="sx" data-scerrar aria-label="Cerrar el buscador"><i data-lucide="x" class="lu"></i></button>' +
        '</div>' +
        '<div class="sbody" id="sbusca-res" role="listbox" aria-label="Resultados"></div>' +
        '<p class="sfoot"><span><kbd>↑</kbd><kbd>↓</kbd> moverse</span><span><kbd>↵</kbd> abrir</span><span><kbd>Esc</kbd> cerrar</span></p>' +
      '</div>';
    document.body.appendChild(raiz);
    campo = raiz.querySelector('#sbusca-q');
    cuerpo = raiz.querySelector('#sbusca-res');
    if (window.lucide) lucide.createIcons();

    raiz.addEventListener('click', e => { if (e.target.closest('[data-scerrar]')) cerrar(); });
    campo.addEventListener('input', () => { clearTimeout(tDebounce); tDebounce = setTimeout(pinta, 90); });
    campo.addEventListener('keydown', teclas);
    cuerpo.addEventListener('mousemove', e => {
      const it = e.target.closest('.sitem');
      if (it) mueve(opciones.indexOf(it), false);
    });
  }

  function fila(it, ts, i) {
    const medio = it.img
      ? '<img class="sthumb" src="' + esc(it.img) + '" alt="" loading="lazy" decoding="async" onerror="this.remove()">'
      : '<span class="sic"><i data-lucide="' + esc(it.icono || 'newspaper') + '" class="lu"></i></span>';
    const kick = it.kick ? '<span class="sk" style="color:' + color(it.color) + '">' + esc(it.kick) + '</span>' : '';
    const sub = marca(it.desc || '', ts) || esc(extracto(it.cuerpo, ts));
    return '<a class="sitem" role="option" aria-selected="false" id="sbusca-op' + i + '" href="' + esc(it.url) + '">' +
      medio +
      '<span class="stxt">' + kick +
        '<span class="st">' + marca(it.titulo, ts) + '</span>' +
        (sub ? '<span class="sd">' + sub + '</span>' : '') +
      '</span>' +
      '<i data-lucide="arrow-right" class="lu sgo"></i>' +
    '</a>';
  }

  function grupo(nombre, filas) {
    return '<section class="sgrupo"><p class="h">' + esc(nombre) + '</p>' + filas.join('') + '</section>';
  }

  async function pinta() {
    const { items, noticias } = await construye();
    const q = campo.value.trim();
    const ts = terminos(q);

    if (!ts.length) {
      /* sin consulta: lo último publicado y por dónde empezar */
      const sug = items.filter(i => i.tipo === 'noticia').slice(0, 4);
      const secs = items.filter(i => i.tipo === 'seccion');
      cuerpo.innerHTML =
        (sug.length ? grupo('Lo último', sug.map((i, n) => fila(i, [], n))) : '') +
        (secs.length ? grupo('Secciones', secs.map((i, n) => fila(i, [], sug.length + n))) : '') +
        (!sug.length && !secs.length ? '<p class="svacio">El buscador no ha podido cargar el contenido.</p>' : '');
      tras();
      return;
    }

    const { items: puntuados, laxo } = selecciona(items, q, it => it.h);

    if (!puntuados.length) {
      cuerpo.innerHTML = '<p class="svacio"><strong>Sin resultados para «' + esc(q) + '»</strong>' +
        '<span>Prueba con una palabra más corta, el nombre de una sección o el autor.</span>' +
        '<a class="btn out" href="noticias.html"><i data-lucide="newspaper" class="lu"></i> Ver todas las noticias</a></p>';
      tras();
      return;
    }

    const porGrupo = {};
    puntuados.forEach(it => {
      const g = porGrupo[it.grupo] || (porGrupo[it.grupo] = []);
      if (g.length < TOPE[it.tipo]) g.push(it);
    });

    let n = 0, html = laxo
      ? '<p class="snota">Nada coincide exactamente con «' + esc(q) + '». Esto es lo más parecido:</p>'
      : '';
    ORDEN_GRUPOS.forEach(g => {
      if (!porGrupo[g]) return;
      html += grupo(g, porGrupo[g].map(it => fila(it, laxo ? [] : ts, n++)));
    });
    const total = puntuados.length;
    const enNoticias = puntuados.filter(it => it.tipo === 'noticia').length;
    html += '<p class="stotal"><span>' + total + (total === 1 ? ' resultado' : ' resultados') +
      (noticias.length ? ' · ' + noticias.length + ' publicadas' : '') + '</span>' +
      (enNoticias > TOPE.noticia
        ? '<a href="noticias.html?q=' + encodeURIComponent(q) + '">Ver las ' + enNoticias + ' noticias en Actualidad →</a>'
        : '') + '</p>';
    cuerpo.innerHTML = html;
    tras();
  }

  /* alta de los resultados recién pintados: iconos, lista de opciones y foco */
  function tras() {
    if (window.lucide) lucide.createIcons();
    opciones = Array.from(cuerpo.querySelectorAll('.sitem'));
    sel = -1;
    mueve(0, false);
    cuerpo.scrollTop = 0;
  }

  function mueve(i, desplaza) {
    if (!opciones.length) { campo.removeAttribute('aria-activedescendant'); return; }
    const n = (i + opciones.length) % opciones.length;
    if (n === sel) return;
    if (opciones[sel]) { opciones[sel].classList.remove('on'); opciones[sel].setAttribute('aria-selected', 'false'); }
    sel = n;
    const el = opciones[sel];
    el.classList.add('on');
    el.setAttribute('aria-selected', 'true');
    campo.setAttribute('aria-activedescendant', el.id);
    if (desplaza) el.scrollIntoView({ block: 'nearest' });
  }

  function teclas(e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); mueve(sel + 1, true); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); mueve(sel - 1, true); }
    else if (e.key === 'Home' && opciones.length) { e.preventDefault(); mueve(0, true); }
    else if (e.key === 'End' && opciones.length) { e.preventDefault(); mueve(opciones.length - 1, true); }
    else if (e.key === 'Enter') {
      if (opciones[sel]) { e.preventDefault(); opciones[sel].click(); }
    } else if (e.key === 'Escape') { e.preventDefault(); cerrar(); }
  }

  /* ---------- abrir / cerrar ---------- */
  let tAnim = 0;

  function abrir(texto) {
    // con el visor de revistas abierto (que va por encima de todo) el panel
    // quedaría detrás: allí el atajo no hace nada
    const visor = document.getElementById('visor');
    if (visor && !visor.hidden) return;
    monta();
    if (window.closeMenu) window.closeMenu();      // si el menú móvil estaba abierto
    clearTimeout(tAnim);
    ultimoFoco = document.activeElement;
    raiz.hidden = false;
    document.documentElement.classList.add('sbusca-on');
    requestAnimationFrame(() => raiz.classList.add('on'));
    if (typeof texto === 'string') campo.value = texto;
    campo.focus();
    campo.select();
    construye();
    pinta();
  }

  function cerrar() {
    if (!raiz || raiz.hidden) return;
    raiz.classList.remove('on');
    document.documentElement.classList.remove('sbusca-on');
    clearTimeout(tAnim);
    tAnim = setTimeout(() => { raiz.hidden = true; }, 240);
    if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus();
  }

  const abierto = () => !!raiz && !raiz.hidden;

  /* ---------- enganches ---------- */
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-buscar]');
    if (!b) return;
    e.preventDefault();
    abrir();
  });

  addEventListener('keydown', e => {
    // ⌘K / Ctrl+K en cualquier sitio; «/» solo si no se está escribiendo
    const escribiendo = /^(input|textarea|select)$/i.test((e.target.tagName || '')) || e.target.isContentEditable;
    if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) { e.preventDefault(); abierto() ? cerrar() : abrir(); return; }
    if (e.key === '/' && !escribiendo && !e.metaKey && !e.ctrlKey && !e.altKey) { e.preventDefault(); abrir(); return; }
    if (e.key === 'Escape' && abierto()) cerrar();
  });

  window.EdemSearch = { abrir, cerrar, filtra, plano, terminos, marca };
})();
