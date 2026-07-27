/* ============================================================
   EDEM Times — shell.js
   La cabecera y el pie, definidos UNA sola vez para las tres
   páginas del sitio (index, noticias y noticia). Los enlaces
   salen de data/content.json → "chrome"; si no hay servidor o
   el JSON falla, se usa el respaldo embebido de aquí abajo.

   Lo estático se queda en el HTML (la marca, la lupa, los dos
   botones de acción y la hamburguesa): son piezas con conducta
   propia y cambian de forma según la página. Lo que se pinta
   aquí es la LISTA de enlaces, que es lo que se repetía copiado
   tres veces y se desincronizaba.

   Reglas de resolución (una sola lista sirve para todas):
   · «#seccion» se queda tal cual si esa sección existe en la
     página; si no, se convierte en «index.html#seccion».
   · el enlace que apunta a la página actual no se pinta (en la
     barra ya estás ahí; el sitio marca la actual con el botón
     de .hacts).
   · en la portada, «index.html» pasa a ser un salto arriba
     (data-top, que app.js entiende) en vez de una recarga.
   ============================================================ */
'use strict';

(function () {

  /* ---------- respaldo embebido (mismo contenido que content.json) ---------- */
  const DEFAULT_CHROME = {
    navMax: 4,
    nav: [
      { label: 'Buscar', icon: 'search', action: 'buscar', menu: true },
      { label: 'Portada', href: 'index.html', icon: 'anchor' },
      { label: 'Kiosko', href: '#kiosko', icon: 'library' },
      { label: 'Actualidad', href: 'noticias.html', icon: 'newspaper', menu: true },
      { label: 'Conócenos', href: '#conocenos', icon: 'book-marked' },
      { label: 'Ecosistema', href: '#ecosistema', icon: 'waypoints' },
      { label: 'Suscríbete', href: '#suscribete', icon: 'mail' }
    ],
    footer: {
      tagline: 'Empresarios formando a empresarios',
      columns: [
        {
          h: 'EDEM Times', links: [
            { label: 'Portada', href: 'index.html' },
            { label: 'Actualidad', href: 'noticias.html' },
            { label: 'Kiosko de revistas', href: '#kiosko' },
            { label: 'Participar en la revista', href: '#conocenos' }
          ]
        },
        { h: 'Ediciones', issues: true },
        {
          h: 'Marina de Empresas', links: [
            { label: 'EDEM Escuela de Empresarios', href: 'https://edem.eu/' },
            { label: 'Lanzadera', href: 'https://lanzadera.es/' },
            { label: 'Angels', href: 'https://www.angelscapital.es/' },
            { label: 'Marina de Empresas', href: 'https://marinadeempresas.es/' }
          ]
        },
        {
          h: 'Recursos', links: [
            { label: 'Suscríbete a las novedades', href: '#suscribete' },
            { label: 'Proponer un tema', href: 'mailto:comunicacion@edem.es?subject=Tengo%20un%20tema%20para%20EDEM%20Times' },
            { label: 'Contacto', href: 'mailto:comunicacion@edem.es' },
            { label: 'Sistema de diseño', action: 'ds', pages: ['index.html'] }
          ]
        }
      ],
      base: {
        copyright: '© {year} EDEM · Escuela de Empresarios',
        legal: [
          { label: 'Aviso legal', href: 'https://edem.eu/aviso-legal/' },
          { label: 'Privacidad', href: 'https://edem.eu/privacidad/' },
          { label: 'Cookies', href: 'https://edem.eu/politica-de-cookies/' }
        ],
        note: 'Parte de Marina de Empresas · Lanzadera · Angels'
      }
    }
  };

  const DEFAULT_SOCIAL = [
    { id: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/school/edem-escuela-de-empresarios/' },
    { id: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/edemempresarios/' },
    { id: 'youtube', label: 'YouTube', url: 'https://www.youtube.com/user/EDEMEmpresariosEs' }
  ];

  const DEFAULT_ISSUES = [
    { id: 'n2', nr: 'Nº 2 · 2026', title: 'Tracción' },
    { id: 'n1v2', nr: 'Nº 1 · 2026', title: 'Bienvenidos a EDEM' },
    { id: 'n1', nr: 'Nº 1 · maqueta', title: 'Bienvenidos a EDEM' }
  ];

  /* Los tres logos de redes no están en icons.js (allí solo va lo que usa la
     interfaz); van aquí con el trazado de lucide, como antes en el HTML. */
  const SOC_SVG = {
    linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>',
    instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>',
    youtube: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>'
  };

  const esc = s => String(s ?? '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  const PAGE = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const HOME = PAGE === 'index.html';

  /* content.json se pide UNA vez por página: app.js reutiliza esta misma
     promesa en vez de repetir el fetch (ver su boot()). */
  window.EdemContent = window.EdemContent || (async function () {
    try {
      const r = await fetch('data/content.json', { cache: 'no-cache' });
      if (r.ok) return await r.json();
    } catch (_) { /* sin servidor o sin JSON: respaldo embebido */ }
    return null;
  })();

  /* ---------- resolución de enlaces ---------- */
  const external = h => /^https?:/i.test(h);
  const isPage = h => !!h && !external(h) && h.charAt(0) !== '#' && !/^[a-z]+:/i.test(h);
  const isCurrent = h => isPage(h) && h.toLowerCase() === PAGE;

  // «#kiosko» vale tal cual donde esa sección existe; donde no, va a la portada
  function resolve(href) {
    if (!href) return '#';
    if (href.charAt(0) !== '#') return href;
    const id = href.slice(1);
    return (id && document.getElementById(id)) ? href : 'index.html' + href;
  }

  // devuelve el href final y los atributos extra (target, data-*) de un item
  function link(item) {
    if (item.action === 'buscar') return { href: '#', extra: ' data-buscar' };
    if (item.action === 'ds') return null;            // no es un enlace: se pinta como botón
    const raw = item.href || '#';
    if (raw === 'index.html' && HOME) return { href: '#', extra: ' data-top' };
    const href = resolve(raw);
    return { href, extra: external(href) ? ' target="_blank" rel="noopener"' : '' };
  }

  // enlaces que tienen sentido en esta página («pages» los limita a alguna)
  const usable = items => (items || []).filter(i => !i.pages || i.pages.indexOf(PAGE) !== -1);
  // en la barra y el menú, además, se cae el que apunta a la página actual;
  // en el pie NO: ahí la lista hace de mapa del sitio y se quiere completa
  const visible = items => usable(items).filter(i => !isCurrent(i.href));

  /* ---------- cabecera ---------- */
  function renderNav(chrome) {
    const items = visible(chrome.nav);

    const main = document.getElementById('hnav');
    if (main) {
      // en la barra solo caben unos pocos (ver el corte de 860px en site.css):
      // los de menú y los que sobran del cupo viven en el panel móvil
      main.innerHTML = items.filter(i => !i.menu && !i.action)
        .slice(0, chrome.navMax || 4)
        .map(i => { const l = link(i); return '<a href="' + esc(l.href) + '"' + l.extra + '>' + esc(i.label) + '</a>'; })
        .join('');
    }

    const mnav = document.getElementById('mnav');
    if (mnav) {
      const html = items.map(i => {
        const l = link(i);
        return '<a href="' + esc(l.href) + '"' + l.extra + '>' +
          '<i data-lucide="' + esc(i.icon || 'chevron-right') + '" class="lu ic"></i>' +
          '<span>' + esc(i.label) + '</span>' +
          '<i data-lucide="chevron-right" class="lu ch"></i></a>';
      }).join('');
      // el botón de «Leer» ya está en el HTML y cierra el panel: se queda el último
      mnav.insertAdjacentHTML('afterbegin', html);
      // y entra justo detrás del último enlace, sean los que sean (site.css
      // tiene la escalera hasta ocho; esto la remata en el escalón que toque)
      const mcta = mnav.querySelector('.mcta');
      if (mcta) mcta.style.transitionDelay = (0.04 * (items.length + 1)).toFixed(2) + 's';
    }
  }

  /* ---------- pie ---------- */
  function colHtml(col, issues) {
    let body;
    if (col.issues) {
      // en la portada app.js intercepta [data-visor] y abre el visor sin recargar;
      // desde el portal de noticias el href lleva a index.html y lo abre al llegar
      body = issues.map(m => '<a href="index.html?visor=' + encodeURIComponent(m.id) + '" data-visor="' + esc(m.id) + '">' +
        esc(m.nr) + ' · ' + esc(m.title) + '</a>').join('');
    } else {
      body = usable(col.links).map(i => {
        if (i.action === 'ds') return '<button class="aslink" type="button" data-ds>' + esc(i.label) + '</button>';
        const l = link(i);
        const cur = isCurrent(i.href) ? ' aria-current="page"' : '';
        return '<a href="' + esc(l.href) + '"' + l.extra + cur + '>' + esc(i.label) + '</a>';
      }).join('');
    }
    return '<div class="col"><p class="h">' + esc(col.h) + '</p>' + body + '</div>';
  }

  function renderFooter(chrome, social, issues) {
    const foot = document.getElementById('sitefoot');
    if (!foot) return;
    const f = chrome.footer || {}, base = f.base || {};

    const soc = social.map(s => '<a href="' + esc(s.url) + '" target="_blank" rel="noopener" aria-label="' + esc(s.label) + '">' +
      (SOC_SVG[s.id] || '') + '</a>').join('');

    const cols = (f.columns || []).map(c => colHtml(c, issues)).join('');

    const legal = (base.legal || []).map(l =>
      '<a href="' + esc(l.href) + '" target="_blank" rel="noopener">' + esc(l.label) + '</a>').join(' · ');

    foot.innerHTML =
      '<div class="wrap fgrid">' +
        '<div class="col brandcol">' +
          '<img class="flogo" src="assets/edem-logo-white.png" alt="EDEM" width="88" height="22">' +
          '<p class="tag">' + esc(f.tagline || '') + '</p>' +
          '<div class="soc" id="soc">' + soc + '</div>' +
        '</div>' + cols +
      '</div>' +
      '<div class="fbase"><div class="wrap">' +
        '<span>' + esc(String(base.copyright || '').replace('{year}', new Date().getFullYear())) + '</span>' +
        '<span>' + legal + '</span>' +
        '<span>' + esc(base.note || '') + '</span>' +
      '</div></div>';
  }

  /* el sistema de diseño solo existe en la portada (lo monta app.js) */
  document.addEventListener('click', e => {
    if (e.target.closest('[data-ds]') && window.openDS) { e.preventDefault(); openDS(); }
  });

  /* ---------- arranque ---------- */
  (async function boot() {
    const json = await window.EdemContent;
    const chrome = (json && json.chrome) || DEFAULT_CHROME;
    const social = (json && json.social) || DEFAULT_SOCIAL;
    const issues = (json && json.issues) || DEFAULT_ISSUES;

    const paint = () => {
      renderNav(chrome);
      renderFooter(chrome, social, issues);
      if (window.lucide) lucide.createIcons();
      if (window.observeReveals) observeReveals();
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', paint);
    else paint();
  })();

})();
