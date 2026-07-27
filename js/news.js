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

  // ojo con el `trim`: ''.split(/\s+/) devuelve [''], que es 1, y sin él cada
  // bloque sin texto (una foto, un dato) sumaba una palabra de propina
  const cuentaPalabras = s => { const t = String(s || '').trim(); return t ? t.split(/\s+/).length : 0; };
  function palabras(n) {
    return (n.cuerpo || []).reduce((t, b) => t + cuentaPalabras(b.texto) + cuentaPalabras((b.items || []).join(' ')), 0);
  }
  /* Minutos de lectura: SIEMPRE contados sobre el cuerpo (200 palabras/minuto,
     que es la media de lectura en pantalla). El campo `lectura` solo entra
     cuando no hay cuerpo que contar, que es lo que pasa con los CMS cuyo
     endpoint de lista devuelve las noticias sin el texto completo. */
  const minutos = n => {
    const p = palabras(n);
    return p ? Math.max(1, Math.round(p / 200)) : (Number(n.lectura) || 1);
  };
  // etiqueta de sumario: en las listas de la portada manda cuánto cuesta leer
  // la noticia, no cuándo se publicó (la fecha ya va en la ficha y en la meta)
  const lectura = n => minutos(n) + ' min de lectura';

  /* miniatura de sumario: la foto pequeña que acompaña al titular en las listas
     del portal (raíl, agenda y columnas de sección). Sin pie ni alt: el titular
     que va al lado ya cuenta la noticia, así que para un lector de pantalla es
     decoración. Si la imagen no carga, se quita y la línea se queda a texto. */
  // `imgMini` es la versión reducida que sirva el CMS; con el JSON local es la
  // misma foto (ver js/cms.js), así que aquí basta con pedir siempre la pequeña
  const mini = n => n.imgMini || n.img;
  function miniatura(n) {
    return mini(n)
      ? '<img class="nmini" src="' + esc(mini(n)) + '" alt="" loading="lazy" decoding="async" onerror="this.remove()">'
      : '';
  }

  function indexaSecciones(secciones) {
    const m = {};
    secciones.forEach(s => { m[s.id] = s; });
    return id => m[id] || { id, nombre: id || 'EDEM Times', color: 'neutral', desc: '' };
  }

  /* ---------- tarjetas ----------
     Los formatos de una portada de periódico:
     `lead`   apertura a toda columna, con la foto arriba
     `sec`    secundaria de la columna central: titular a la izquierda, foto a
              la derecha (en móvil se apila y la foto sube arriba, lo hace el CSS)
     `banda`  la de la banda de cierre: foto arriba, titular y poco más
     `card`   la unidad del flujo, con entradilla
     `row`    línea de sumario del bloque de la home */
  function tarjeta(n, sec, tipo) {
    const s = sec(n.seccion);
    const badge = '<span class="nbadge" style="background:' + color(s.color) + '">' + esc(s.nombre) + '</span>';
    // antetítulo en el color de su sección: es lo que deja leer la portada por
    // temas de un vistazo, y pesa menos que la chapa de la apertura
    const kick = '<span class="nkick" style="color:' + color(s.color) + '">' + esc(s.nombre) + '</span>';
    const meta = '<span class="nmeta"><time datetime="' + esc(n.fecha) + '">' + esc(fechaLarga(n.fecha)) + '</time>' +
      '<span class="sep">·</span><span class="nread">' + minutos(n) + ' min</span></span>';
    const foto = n.img
      ? '<div class="nim"><img src="' + esc(n.img) + '" alt="' + esc(n.alt || '') + '" loading="lazy" decoding="async" onerror="this.closest(\'.nim\').classList.add(\'nofoto\');this.remove()"></div>'
      : '<div class="nim nofoto"></div>';

    if (tipo === 'row') {
      // el antetítulo va sin color en línea: la línea de sumario solo se usa en
      // el bloque de la home, sobre fondo marino, y allí manda el CSS
      return '<a class="nrow" href="' + esc(urlNoticia(n.id)) + '">' +
        '<div class="nrowtxt"><span class="nkick">' + esc(s.nombre) + '</span>' +
        '<h3 class="disp">' + esc(n.titulo) + '</h3>' +
        '<span class="nago">' + esc(lectura(n)) + '</span></div>' +
        (mini(n) ? '<img class="nthumb" src="' + esc(mini(n)) + '" alt="" loading="lazy" decoding="async" onerror="this.remove()">' : '') +
        '</a>';
    }
    /* Secundaria de la columna central. La foto va PRIMERO en el HTML y el CSS
       la manda a la derecha con row-reverse: así, cuando en móvil la tarjeta se
       apila, la foto queda arriba sin tocar el orden del documento. Los estilos
       en línea del antetítulo son seguros aquí porque esta variante no se usa
       en el bloque de la home, que es donde el CSS tiene que mandar. */
    if (tipo === 'sec') {
      return '<a class="ncard hcard" href="' + esc(urlNoticia(n.id)) + '">' + foto +
        '<div class="nbody">' + kick +
        '<h3 class="disp">' + esc(n.titulo) + '</h3>' +
        '<p>' + esc(n.entradilla) + '</p>' +
        '<span class="nago">' + esc(lectura(n)) + '</span>' +
        '</div></a>';
    }
    // banda de cierre: foto, antetítulo y titular. Sin entradilla, que a cuatro
    // columnas no se lee y lo que se busca ahí es barrer titulares.
    if (tipo === 'banda') {
      return '<a class="ncard bcard" href="' + esc(urlNoticia(n.id)) + '">' + foto +
        '<div class="nbody">' + kick +
        '<h3 class="disp">' + esc(n.titulo) + '</h3>' +
        '<span class="nago">' + esc(lectura(n)) + '</span>' +
        '</div></a>';
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
    // seis titulares: es lo que mide la apertura al lado, así que la columna
    // llega abajo sin dejar el hueco que quedaba con tres
    const resto = noticias.filter(n => n !== lead)
      .sort((a, b) => (b.portada ? 1 : 0) - (a.portada ? 1 : 0))
      .slice(0, 6);

    host.innerHTML =
      '<div class="dlead rv">' + tarjeta(lead, sec, 'lead') + '</div>' +
      '<div class="dlist rv">' + resto.map(n => tarjeta(n, sec, 'row')).join('') +
      '<a class="dall" href="noticias.html"><span>Ver todas las noticias</span><i data-lucide="arrow-right" class="lu"></i></a>' +
      '</div>';

    // el raíl cierra con la frescura del diario: cuántas hay lo canta ya la
    // parrilla de al lado, y el titular no necesita una chapa que lo repita
    const nota = $('actualidad-note');
    if (nota) nota.textContent = 'Última publicada, ' + relativa(noticias[0].fecha) + '.';
    iconos(); reveals();
  }

  /* ============================================================
     2 · PORTAL DE NOTICIAS (noticias.html)
     ============================================================ */
  const PASO = 6;   // cuántas noticias añade cada «Cargar más»

  async function portal() {
    const host = $('np-grid'); if (!host) return;
    const { noticias, secciones, portal: cfg } = await window.EdemCMS.load();
    const sec = indexaSecciones(secciones);

    // la fecha de hoy, como el cabecero de un diario
    const hoy = $('np-hoy');
    if (hoy) {
      const d = new Date();
      hoy.textContent = d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    }

    if (cfg && cfg.titulo) $('np-title').innerHTML = cfg.titulo;

    if (!noticias.length) {
      host.innerHTML = '<p class="nvacio">Todavía no hay noticias publicadas. Vuelve pronto.</p>';
      return;
    }

    /* ---- reparto de la portada ----
       La apertura y las tres secundarias de la columna central salen de las
       marcadas con `portada`, por orden de marca, y lo que falte lo completan
       las más recientes. Tres y no dos: es lo que llena la columna hasta donde
       llega la apertura, en vez de dejar medio palmo de aire entre las dos.
       A partir de ahí, cada noticia aparece UNA vez en la portada: la banda de
       cierre y el raíl de «Lo último» se sirven de lo que queda, en ese orden.
       Es lo que evita que el mismo titular se lea tres veces mientras se baja. */
    const lead = noticias.find(n => n.portada === 1) || noticias[0];
    const resto = noticias.filter(n => n !== lead);
    const marcadas = resto.filter(n => n.portada).sort((a, b) => a.portada - b.portada);
    const secundarias = marcadas.concat(resto.filter(n => !n.portada)).slice(0, 3);
    /* las cuatro con foto grande: son las únicas que se retiran de los bloques
       por sección de abajo, porque repetir una foto de apertura a media página
       es lo que de verdad se nota. Los titulares sueltos sí pueden volver a
       salir ordenados por tema: es otro eje de lectura, no una repetición. */
    const grandes = new Set([lead].concat(secundarias).map(n => n.id));
    const banda = resto.filter(n => !grandes.has(n.id)).slice(0, 4);
    const enPortada = new Set([...grandes].concat(banda.map(n => n.id)));

    $('np-lead-card').innerHTML = tarjeta(lead, sec, 'lead');
    $('np-sec').innerHTML = secundarias.map(n => tarjeta(n, sec, 'sec')).join('');
    $('np-banda').innerHTML = banda.map(n => tarjeta(n, sec, 'banda')).join('');

    /* raíl: lo último es un índice cronológico de lo que NO está arriba */
    const ultimo = noticias.filter(n => !enPortada.has(n.id)).slice(0, 5);
    // sección arriba, titular y los minutos debajo: el antetítulo es lo que
    // ordena la lista de un vistazo y los minutos son el pie, no el rótulo
    const linea = n => '<li><a href="' + esc(urlNoticia(n.id)) + '"><span class="utxt">' +
      '<span class="usec" style="color:' + color(sec(n.seccion).color) + '">' + esc(sec(n.seccion).nombre) + '</span>' +
      '<span class="utit">' + esc(n.titulo) + '</span>' +
      '<span class="nago">' + esc(lectura(n)) + '</span></span>' +
      miniatura(n) + '</a></li>';
    $('np-ultimo').innerHTML = (ultimo.length ? ultimo : noticias.slice(0, 5)).map(linea).join('');

    /* raíl: la agenda, si la hay. Es la sección de servicio del portal —fechas,
       convocatorias y avisos— y en un raíl se consulta mucho mejor que perdida
       en el flujo. Si el CMS no trae esa sección, la caja no se pinta. */
    const agenda = noticias.filter(n => n.seccion === 'agenda').slice(0, 3);
    const cajaAgenda = $('np-agendabox');
    if (cajaAgenda && agenda.length) {
      $('np-agenda').innerHTML = agenda.map(n =>
        '<li><a href="' + esc(urlNoticia(n.id)) + '"><span class="utxt">' +
        '<span class="uhora">' + esc(fechaCorta(n.fecha)) + '</span>' +
        '<span class="utit">' + esc(n.titulo) + '</span></span>' +
        miniatura(n) + '</a></li>').join('');
      cajaAgenda.hidden = false;
    }

    /* ---- filtro por sección ---- */
    const usadas = secciones.filter(s => noticias.some(n => n.seccion === s.id));
    const cuenta = id => noticias.filter(n => n.seccion === id).length;
    $('np-filtros').innerHTML =
      '<button class="nfil on" type="button" data-fil="todas" aria-pressed="true">Todas <span class="fnum">' + noticias.length + '</span></button>' +
      usadas.map(s => '<button class="nfil" type="button" data-fil="' + esc(s.id) + '" aria-pressed="false" style="--fc:' + color(s.color) + '">' +
        esc(s.nombre) + ' <span class="fnum">' + cuenta(s.id) + '</span></button>').join('');

    /* ---- el diario por secciones (vista en reposo) ----
       Una columna por sección, con su filete grueso arriba: la destacada con
       foto y debajo el resto en titulares. Se pinta una sola vez, porque no
       depende ni del filtro ni de la búsqueda. */
    const bloques = $('np-secciones');
    if (bloques) {
      bloques.innerHTML = usadas.map(s => {
        const items = noticias.filter(n => n.seccion === s.id && !grandes.has(n.id));
        if (!items.length) return '';
        const dest = items[0], lista = items.slice(1, 4);
        const c = color(s.color);
        return '<section class="nsecblock rv" style="--sc:' + c + '">' +
          '<div class="h"><span class="nm">' + esc(s.nombre) + '</span>' +
          '<button class="all" type="button" data-fil="' + esc(s.id) + '">Ver las ' + cuenta(s.id) +
          ' <i data-lucide="arrow-right" class="lu"></i></button></div>' +
          '<p class="d">' + esc(s.desc || '') + '</p>' +
          '<a class="dest" href="' + esc(urlNoticia(dest.id)) + '">' +
          (dest.img ? '<img src="' + esc(dest.img) + '" alt="' + esc(dest.alt || '') + '" loading="lazy" decoding="async" onerror="this.remove()">' : '') +
          '<h3 class="disp">' + esc(dest.titulo) + '</h3>' +
          '<p>' + esc(dest.entradilla) + '</p>' +
          '<span class="nago">' + esc(lectura(dest)) + '</span></a>' +
          (lista.length ? '<ul class="tt">' + lista.map(n =>
            '<li><a href="' + esc(urlNoticia(n.id)) + '"><span class="utxt">' +
            '<span class="utit">' + esc(n.titulo) + '</span>' +
            '<span class="nago">' + esc(lectura(n)) + '</span></span>' +
            miniatura(n) + '</a></li>').join('') + '</ul>' : '') +
          '</section>';
      }).join('');
    }

    let filtro = 'todas', visibles = PASO, consulta = '';

    /* sección + texto: primero se recorta por sección y lo que quede lo ordena
       el buscador (js/search.js), con el mismo criterio que el panel de la lupa */
    function seleccion() {
      const base = filtro === 'todas' ? noticias : noticias.filter(n => n.seccion === filtro);
      return consulta && window.EdemSearch ? window.EdemSearch.filtra(base, consulta) : base;
    }

    /* Dos vistas bajo la misma barra: en reposo el diario por secciones; en
       cuanto se filtra o se busca, la rejilla plana de resultados con «cargar
       más». Cambiar de vista es cambiar cuál de las dos está oculta. */
    function pinta() {
      const filtrando = filtro !== 'todas' || !!consulta;

      if (bloques) bloques.hidden = filtrando;
      host.hidden = !filtrando;

      if (!filtrando) {
        $('np-mas').hidden = true;
        $('np-secdesc').textContent = '';
        $('np-count').textContent = noticias.length + ' noticias en ' + usadas.length + ' secciones';
        iconos(); reveals();
        return;
      }

      const lista = seleccion();
      const trozo = lista.slice(0, visibles);
      host.innerHTML = trozo.length
        ? trozo.map(n => tarjeta(n, sec, 'card')).join('')
        : '<p class="nvacio">Ninguna noticia coincide con «' + esc(consulta) + '»' +
          (filtro === 'todas' ? '' : ' en ' + esc(sec(filtro).nombre)) + '.</p>';
      $('np-mas').hidden = trozo.length >= lista.length;
      $('np-count').textContent = consulta
        ? lista.length + (lista.length === 1 ? ' resultado' : ' resultados')
        : trozo.length + ' de ' + lista.length + (lista.length === 1 ? ' noticia' : ' noticias');
      const s = filtro === 'todas' ? null : sec(filtro);
      $('np-secdesc').textContent = consulta ? '' : (s ? s.desc : '');
      iconos();
    }
    pinta();

    /* ---- buscador en línea del flujo ---- */
    const campo = $('np-buscar'), limpia = $('np-buscar-x');
    if (campo) {
      let t = 0;
      const aplica = () => {
        consulta = campo.value.trim();
        visibles = PASO;
        limpia.hidden = !campo.value;
        pinta();
      };
      campo.addEventListener('input', () => { clearTimeout(t); t = setTimeout(aplica, 110); });
      campo.addEventListener('keydown', e => {
        if (e.key === 'Escape' && campo.value) { e.stopPropagation(); campo.value = ''; aplica(); }
      });
      limpia.addEventListener('click', () => { campo.value = ''; aplica(); campo.focus(); });
      // noticias.html?q=hackathon abre el portal ya filtrado
      const q = new URLSearchParams(location.search).get('q');
      if (q) { campo.value = q; aplica(); }
    }

    /* un solo camino para elegir sección: lo usan la barra de filtros y los
       «Ver las N» de cada bloque, así que la barra siempre refleja lo que se
       está viendo, se haya pulsado donde se haya pulsado */
    function aplicaFiltro(id) {
      filtro = id; visibles = PASO;
      document.querySelectorAll('.nfil').forEach(x => {
        const on = x.dataset.fil === id;
        x.classList.toggle('on', on);
        x.setAttribute('aria-pressed', String(on));
      });
      pinta();
      // el foco se queda en el filtro, pero la rejilla debe verse desde arriba
      const caja = $('np-flujo');
      if (caja) caja.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    $('np-filtros').addEventListener('click', e => {
      const b = e.target.closest('[data-fil]'); if (!b) return;
      aplicaFiltro(b.dataset.fil);
    });
    if (bloques) bloques.addEventListener('click', e => {
      const b = e.target.closest('[data-fil]'); if (!b) return;
      aplicaFiltro(b.dataset.fil);
    });
    $('np-mas').addEventListener('click', () => { visibles += PASO; pinta(); });

    // hash de sección: noticias.html#emprende abre ya filtrado
    const h = decodeURIComponent(location.hash.slice(1));
    if (h && usadas.some(s => s.id === h)) aplicaFiltro(h);
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

  /* ---- arranque en versalitas: las tres primeras palabras del cuerpo ----
     Se marca sobre el primer nodo de texto para no tocar un enlace o una
     negrita que empiece el párrafo. Si la primera palabra es muy corta
     («El», «A») se coge una más, que si no la entrada queda coja. */
  function entradilla(p) {
    const t = p.firstChild;
    if (!t || t.nodeType !== 3) return;
    const crudo = t.nodeValue.trimStart();
    const palabras = crudo.split(/\s+/);
    const n = palabras[0].length <= 3 ? 4 : 3;
    if (palabras.length <= n) return;
    // el corte se busca sobre el texto original para respetar sus espacios
    const m = new RegExp('^(?:\\S+\\s+){' + (n - 1) + '}\\S+').exec(crudo);
    if (!m) return;
    const span = document.createElement('span');
    span.className = 'aentrada';
    span.textContent = m[0];
    p.replaceChild(document.createTextNode(crudo.slice(m[0].length)), t);
    p.insertBefore(span, p.firstChild);
  }

  /* ---- destino del botón «volver» ----
     Si la visita llegó desde el propio portal, el clic deshace ese paso con
     history.back() (así se conserva el scroll y el filtro que tuviera la
     lista) y este destino solo hace de red. Si se entró en frío —enlace
     compartido, buscador, marcador— no hay nada que deshacer y lleva a la
     sección de la noticia, que es el paso anterior de la ruta de las migas. */
  function destinoVuelta(sec) {
    const previa = interna(document.referrer);
    if (previa) {
      const f = previa.pathname.split('/').pop() || 'index.html';
      if (f === 'noticias.html') return 'noticias.html';
      if (f === 'noticia.html') return previa.href;
      if (f === 'index.html') return 'index.html';
    }
    return 'noticias.html#' + sec.id;
  }
  // referrer del mismo sitio: solo entonces tiene sentido retroceder
  function interna(ref) {
    if (!ref) return null;
    try { const u = new URL(ref, location.href); return u.origin === location.origin ? u : null; }
    catch { return null; }
  }
  function volver() {
    const btn = $('avolver'); if (!btn) return;
    btn.addEventListener('click', () => {
      if (interna(document.referrer) && history.length > 1) history.back();
      else location.href = btn.dataset.href;
    });
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

    const atras = destinoVuelta(sec);

    host.innerHTML =
      '<header class="ahead"><div class="wrap awrap">' +
        '<div class="aruta">' +
          '<button class="avolver" type="button" id="avolver" data-href="' + esc(atras) + '">' +
            '<i data-lucide="arrow-left" class="lu"></i><span>Volver</span></button>' +
          '<nav class="amiga" aria-label="Ruta de navegación">' +
            '<a href="index.html">Portada</a><span aria-hidden="true">›</span>' +
            '<a href="noticias.html">Actualidad</a><span aria-hidden="true">›</span>' +
            '<a href="noticias.html#' + esc(sec.id) + '" style="color:' + c + '">' + esc(sec.nombre) + '</a>' +
            '<span aria-hidden="true">›</span>' +
            '<span class="actual" aria-current="page">' + esc(n.titulo) + '</span>' +
          '</nav>' +
        '</div>' +
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
    if (p1 && !p1.classList.contains('adest')) { p1.classList.add('acap'); entradilla(p1); }

    volver();
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
