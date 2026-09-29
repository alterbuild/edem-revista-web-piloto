/* ============================================================
   EDEM Times — cms.js
   Capa de ORIGEN DE DATOS del portal de noticias.

   El resto de la web (js/news.js, js/app.js) no sabe de dónde
   salen las noticias: pide `EdemCMS.load()` y recibe siempre el
   mismo modelo normalizado. Hoy la fuente es data/noticias.json;
   mañana puede ser un CMS headless sin tocar ni una plantilla.

   Modelo normalizado (lo único que el render conoce):
     { portal, secciones:[{id,nombre,color,desc}],
       noticias:[{ id, seccion, portada, titulo, entradilla, fecha,
                   autor, autorRol, lectura, img, imgMini, alt, pie,
                   etiquetas[], cuerpo[], revista }] }

   `imgMini` es la misma foto en pequeño, para las listas de sumario del portal
   (se pintan a 50-60px). Siempre viene rellena: si el CMS no ofrece una
   versión reducida, cae en `img`, así que el render nunca tiene que preguntar.

   Bloques de `cuerpo`: p · h2 · cita · lista · img · destacado · dato

   Para enchufar un CMS: data/noticias.json → "cms": { activo:true,
   tipo:"strapi|wordpress|contentful|hygraph|generico", endpoint:"…" }.
   Si la API falla, se cae con red al contenido local del JSON.

   Y LAS EDICIONES DE LA REVISTA, igual: data/content.json → "cms"
   (ver EDICIONES, al final). Con eso la redacción publica un número
   subiendo su PDF al CMS: portada, kiosko, visor y buscador salen solos.
   ============================================================ */
'use strict';

(function () {

  /* ---------- utilidades ---------- */

  /* Lee 'a.b[0].c' de un objeto sin reventar por el camino. Acepta también
     varias rutas separadas por '|' y devuelve la primera que dé algo: los CMS
     cambian de nombre los campos entre versiones (Strapi v4 mete todo bajo
     `attributes`, v5 lo sube a la raíz) y así un mismo preajuste sirve para las
     dos sin duplicar el mapeo. */
  function pick(obj, path) {
    if (!path) return undefined;
    for (const alt of String(path).split('|')) {
      let v = obj;
      for (const key of alt.trim().replace(/\[(\d+)\]/g, '.$1').split('.')) {
        if (v == null) break;
        v = v[key];
      }
      if (v !== undefined && v !== null && v !== '') return v;
    }
    return undefined;
  }

  const isObj = v => v && typeof v === 'object' && !Array.isArray(v);
  const txt = v => (v == null ? '' : String(v)).trim();

  /* Quita el marcado de un fragmento HTML (títulos y entradillas de WordPress
     vienen con <p> y entidades dentro).
     Con DOMParser y no con el innerHTML de un <div> suelto: un div, aunque no
     esté en la página, CARGA las imágenes que se le metan, y un
     <img src=x onerror=…> pegado en un campo del CMS ejecutaba su onerror. Lo
     que devuelve DOMParser es un documento inerte: ni carga ni ejecuta nada. */
  function stripHtml(s) {
    const doc = new DOMParser().parseFromString(String(s ?? ''), 'text/html');
    return (doc.body ? doc.body.textContent : '').replace(/\s+/g, ' ').trim();
  }

  /* ---------- preajustes por CMS ----------
     Cada uno describe dónde vive la lista y cómo se llaman los campos en esa
     API. `mapeo` en el JSON sobrescribe cualquiera de estas claves. */
  const PRESETS = {
    generico: {
      lista: 'noticias|data|items|results|docs',
      item: '',
      id: 'id|slug',
      seccion: 'seccion|categoria|category',
      portada: 'portada',
      titulo: 'titulo|title',
      entradilla: 'entradilla|extracto|excerpt|summary',
      fecha: 'fecha|date|publishedAt|published_at',
      autor: 'autor|author',
      autorRol: 'autorRol|author_role',
      lectura: 'lectura|readingTime',
      img: 'img|imagen|image|cover',
      imgMini: 'imgMini|miniatura|thumbnail|thumb',
      alt: 'alt|imagenAlt',
      pie: 'pie|caption',
      etiquetas: 'etiquetas|tags',
      cuerpo: 'cuerpo|body|content|contenido',
      revista: 'revista'
    },
    /* Strapi v4 (todo bajo `attributes`) y v5 (campos en la raíz): las rutas
       alternativas con '|' cubren las dos sin cambiar de preajuste. */
    strapi: {
      lista: 'data',
      item: 'data',
      id: 'attributes.slug|slug|id',
      seccion: 'attributes.seccion.data.attributes.slug|seccion.slug|attributes.seccion|seccion',
      portada: 'attributes.portada|portada',
      titulo: 'attributes.titulo|titulo',
      entradilla: 'attributes.entradilla|entradilla',
      fecha: 'attributes.fecha|fecha|attributes.publishedAt|publishedAt',
      autor: 'attributes.autor|autor',
      autorRol: 'attributes.autorRol|autorRol',
      lectura: 'attributes.lectura|lectura',
      img: 'attributes.imagen.data.attributes.url|imagen.url|attributes.img|img',
      // Strapi genera solo los formatos que el original permite: si la foto es
      // pequeña puede no haber `small` y hay que bajar a `thumbnail`
      imgMini: 'attributes.imagen.data.attributes.formats.small.url|imagen.formats.small.url|attributes.imagen.data.attributes.formats.thumbnail.url|imagen.formats.thumbnail.url',
      alt: 'attributes.imagen.data.attributes.alternativeText|imagen.alternativeText|attributes.alt',
      pie: 'attributes.imagen.data.attributes.caption|imagen.caption|attributes.pie',
      etiquetas: 'attributes.etiquetas|etiquetas',
      cuerpo: 'attributes.cuerpo|cuerpo|attributes.contenido|contenido',
      revista: 'attributes.revista|revista'
    },
    wordpress: {
      lista: '',                       // la API devuelve un array pelado
      item: '',
      id: 'slug|id',
      seccion: '_embedded.wp:term.0.0.slug',
      portada: 'acf.portada',
      titulo: 'title.rendered|title',
      entradilla: 'excerpt.rendered|excerpt',
      fecha: 'date_gmt|date',
      autor: '_embedded.author.0.name',
      autorRol: '_embedded.author.0.description',
      lectura: 'acf.lectura',
      img: '_embedded.wp:featuredmedia.0.source_url|jetpack_featured_media_url',
      imgMini: '_embedded.wp:featuredmedia.0.media_details.sizes.medium.source_url|_embedded.wp:featuredmedia.0.media_details.sizes.thumbnail.source_url',
      alt: '_embedded.wp:featuredmedia.0.alt_text',
      pie: '_embedded.wp:featuredmedia.0.caption.rendered',
      etiquetas: 'acf.etiquetas',
      cuerpo: 'content.rendered|content',
      revista: 'acf.revista'
    },
    contentful: {
      lista: 'items',
      item: 'items.0',
      id: 'fields.slug|sys.id',
      seccion: 'fields.seccion.fields.slug|fields.seccion',
      portada: 'fields.portada',
      titulo: 'fields.titulo|fields.title',
      entradilla: 'fields.entradilla|fields.summary',
      fecha: 'fields.fecha|sys.createdAt',
      autor: 'fields.autor.fields.nombre|fields.autor',
      autorRol: 'fields.autorRol',
      lectura: 'fields.lectura',
      img: 'fields.imagen.fields.file.url|fields.img',
      // Contentful no publica derivados: la miniatura se pide por URL con
      // `cms.miniatura` (ver más abajo), p. ej. "{url}?w=160&h=160&fit=fill"
      imgMini: 'fields.miniatura.fields.file.url',
      alt: 'fields.imagen.fields.description',
      pie: 'fields.pie',
      etiquetas: 'fields.etiquetas',
      cuerpo: 'fields.cuerpo|fields.body',
      revista: 'fields.revista'
    },
    hygraph: {
      lista: 'data.noticias|noticias',
      item: 'data.noticia|noticia',
      id: 'slug|id',
      seccion: 'seccion.slug|seccion',
      portada: 'portada',
      titulo: 'titulo',
      entradilla: 'entradilla',
      fecha: 'fecha|publishedAt',
      autor: 'autor.nombre|autor',
      autorRol: 'autor.rol|autorRol',
      lectura: 'lectura',
      img: 'imagen.url|img',
      imgMini: 'imagen.miniatura.url|miniatura.url',
      alt: 'imagen.alt|alt',
      pie: 'pie',
      etiquetas: 'etiquetas',
      cuerpo: 'cuerpo.html|cuerpo.raw|cuerpo',
      revista: 'revista'
    }
  };

  const SECCION_PRESET = {
    id: 'id|slug|attributes.slug|fields.slug',
    nombre: 'nombre|name|titulo|attributes.nombre|fields.nombre',
    color: 'color|attributes.color|fields.color',
    desc: 'desc|descripcion|description|attributes.desc|fields.desc'
  };

  /* ---------- normalización del cuerpo ----------
     El cuerpo es lo que más varía entre CMS: array de bloques propios, rich
     text de Strapi, HTML de WordPress o texto plano. Todo acaba en la misma
     lista de bloques que sabe pintar js/news.js. */

  const BLOQUES = new Set(['p', 'h2', 'h3', 'cita', 'lista', 'img', 'destacado', 'dato']);

  function bloquesDesdeTexto(s) {
    return txt(s).split(/\n{2,}/).map(p => ({ tipo: 'p', texto: p.replace(/\s*\n\s*/g, ' ').trim() }))
      .filter(b => b.texto);
  }

  /* HTML → bloques. Etiquetas fuera de la lista blanca se convierten en su
     texto: el contenido de un CMS es de la casa, pero inyectar su HTML tal cual
     en la página nos dejaría a merced de lo que alguien pegue en el editor. */
  function bloquesDesdeHtml(html) {
    const doc = new DOMParser().parseFromString('<div id="r">' + html + '</div>', 'text/html');
    const raiz = doc.getElementById('r');
    // DOMParser no ejecuta nada, pero lo que quede aquí acabaría impreso como
    // texto del artículo: el código que alguien pegue en el editor del CMS se
    // tira, no se publica.
    raiz.querySelectorAll('script,style,noscript,iframe,object,embed,template').forEach(el => el.remove());
    const out = [];
    const inline = el => el.textContent.replace(/\s+/g, ' ').trim();

    [...raiz.children].forEach(el => {
      const tag = el.tagName.toLowerCase();
      if (tag === 'h1' || tag === 'h2') { const t = inline(el); if (t) out.push({ tipo: 'h2', texto: t }); return; }
      if (tag === 'h3' || tag === 'h4') { const t = inline(el); if (t) out.push({ tipo: 'h3', texto: t }); return; }
      if (tag === 'ul' || tag === 'ol') {
        const items = [...el.querySelectorAll('li')].map(inline).filter(Boolean);
        if (items.length) out.push({ tipo: 'lista', items });
        return;
      }
      if (tag === 'blockquote') {
        const cite = el.querySelector('cite,footer');
        const autor = cite ? inline(cite) : '';
        if (cite) cite.remove();
        const t = inline(el);
        if (t) out.push({ tipo: 'cita', texto: t, autor });
        return;
      }
      if (tag === 'figure' || tag === 'img' || el.querySelector('img')) {
        const im = tag === 'img' ? el : el.querySelector('img');
        if (im) {
          const cap = el.querySelector('figcaption');
          out.push({ tipo: 'img', src: im.getAttribute('src') || '', alt: im.getAttribute('alt') || '', pie: cap ? inline(cap) : '' });
          return;
        }
      }
      const t = inline(el);
      if (t) out.push({ tipo: 'p', texto: t });
    });

    // HTML sin bloques (una tirada de texto suelto con <br>): a párrafos
    if (!out.length) return bloquesDesdeTexto(raiz.textContent);
    return out;
  }

  /* Rich text de Strapi / Hygraph: árbol de nodos {type, children:[{text}]} */
  function bloquesDesdeRich(nodos) {
    const plano = n => (n.children || []).map(c => c.text != null ? c.text : plano(c)).join('');
    const out = [];
    nodos.forEach(n => {
      const t = plano(n).trim();
      switch (n.type) {
        case 'heading':
          if (t) out.push({ tipo: (n.level && n.level > 2) ? 'h3' : 'h2', texto: t });
          break;
        case 'quote':
        case 'blockquote':
          if (t) out.push({ tipo: 'cita', texto: t, autor: '' });
          break;
        case 'list':
        case 'bulleted-list':
        case 'numbered-list': {
          const items = (n.children || []).map(li => plano(li).trim()).filter(Boolean);
          if (items.length) out.push({ tipo: 'lista', items });
          break;
        }
        case 'image':
          out.push({
            tipo: 'img',
            src: pick(n, 'image.url|src') || '',
            alt: pick(n, 'image.alternativeText|alt') || '',
            pie: pick(n, 'image.caption|caption') || ''
          });
          break;
        default:
          if (t) out.push({ tipo: 'p', texto: t });
      }
    });
    return out;
  }

  function normalizaCuerpo(v) {
    if (!v) return [];
    if (Array.isArray(v)) {
      if (!v.length) return [];
      // ya viene en nuestro formato
      if (isObj(v[0]) && BLOQUES.has(v[0].tipo)) return v.filter(b => isObj(b) && BLOQUES.has(b.tipo));
      // rich text (Strapi blocks, Slate…)
      if (isObj(v[0]) && (v[0].type || v[0].children)) return bloquesDesdeRich(v);
      // lista de cadenas
      return v.map(s => ({ tipo: 'p', texto: txt(s) })).filter(b => b.texto);
    }
    if (isObj(v)) {
      if (v.html) return bloquesDesdeHtml(v.html);
      if (v.raw && v.raw.children) return bloquesDesdeRich(v.raw.children);
      if (Array.isArray(v.children)) return bloquesDesdeRich(v.children);
      if (v.rendered) return bloquesDesdeHtml(v.rendered);
      return [];
    }
    const s = String(v);
    return /<\/?[a-z][\s\S]*>/i.test(s) ? bloquesDesdeHtml(s) : bloquesDesdeTexto(s);
  }

  /* ---------- normalización de una noticia ---------- */

  const COLORES = new Set(['edem', 'lanzadera', 'angels', 'neutral']);

  /* URL de un medio, venga como venga del CMS: objeto asset, cadena suelta,
     protocol-relative (Contentful sirve así: //images.ctfassets.net/…) o ruta
     relativa a la que hay que anteponer `baseMedios`.
     Las rutas que empiezan por «/» también van contra `baseMedios`: es como
     sirve Strapi sus subidas (/uploads/revista.pdf) y, sin eso, se pedían al
     dominio de la web en vez de al del CMS. */
  function medio(v, base) {
    if (isObj(v)) v = pick(v, 'url|src|source_url|fields.file.url');
    let u = txt(v);
    if (!u) return '';
    if (u.startsWith('//')) return 'https:' + u;
    if (base && !/^(https?:|data:|blob:)/i.test(u)) {
      try { return new URL(u, base.replace(/\/?$/, '/')).href; } catch (_) { /* base mal escrita: tal cual */ }
    }
    return u;
  }

  /* Contentful no mete los medios dentro de cada entrada: pone un enlace
     {sys:{type:'Link', linkType:'Asset', id}} y el asset aparte, en
     `includes`. Aquí se sustituye cada enlace por lo que apunta, para que
     rutas como fields.pdf.fields.file.url funcionen tal cual. Con tope de
     profundidad: dos entradas pueden enlazarse entre sí. */
  function resuelveEnlaces(json) {
    const inc = json && json.includes;
    if (!inc) return json;
    const idx = {};
    ['Asset', 'Entry'].forEach(t => (inc[t] || []).forEach(x => { if (x && x.sys) idx[t + ':' + x.sys.id] = x; }));
    const walk = (v, depth) => {
      if (depth > 5) return v;
      if (Array.isArray(v)) return v.map(x => walk(x, depth + 1));
      if (!isObj(v)) return v;
      if (v.sys && v.sys.type === 'Link') {
        const t = idx[v.sys.linkType + ':' + v.sys.id];
        return t ? walk(t, depth + 1) : v;
      }
      const o = {};
      for (const k in v) o[k] = walk(v[k], depth + 1);
      return o;
    };
    return Object.assign({}, json, { items: walk(json.items || [], 0) });
  }

  function normalizaNoticia(raw, map, base, plantillaMini) {
    if (!isObj(raw)) return null;
    const g = k => pick(raw, map[k]);

    // la sección puede venir como cadena, como objeto o como relación anidada
    let sec = g('seccion');
    if (isObj(sec)) sec = pick(sec, 'id|slug|nombre|name|attributes.slug|fields.slug');
    if (Array.isArray(sec)) sec = sec[0] && (sec[0].slug || sec[0].id || sec[0]);

    const img = medio(g('img'), base);

    /* Miniatura para las listas de sumario del portal. Orden: la versión
       reducida que declare el preajuste (los formatos de Strapi, los tamaños de
       WordPress…); si no la hay, la plantilla `cms.miniatura` construye la URL
       con la API de imágenes del CMS; y si tampoco, la foto grande, que es lo
       que pasaba antes de existir este campo. Nunca queda vacío si hay `img`. */
    let imgMini = medio(g('imgMini'), base);
    if (!imgMini && img && plantillaMini) {
      imgMini = plantillaMini.includes('{url}')
        ? plantillaMini.replace('{url}', img)
        : img + plantillaMini;   // forma corta: solo la cola de parámetros
    }

    let etiquetas = g('etiquetas');
    if (typeof etiquetas === 'string') etiquetas = etiquetas.split(',').map(s => s.trim());
    if (Array.isArray(etiquetas)) etiquetas = etiquetas.map(t => isObj(t) ? txt(pick(t, 'nombre|name|slug|title')) : txt(t)).filter(Boolean);
    else etiquetas = [];

    let autor = g('autor');
    if (isObj(autor)) autor = pick(autor, 'nombre|name|attributes.nombre|fields.nombre');

    const id = txt(g('id'));
    const titulo = stripHtml(g('titulo'));
    if (!id || !titulo) return null;

    const rev = g('revista');
    return {
      id,
      seccion: txt(sec) || 'campus',
      portada: Number(g('portada')) || 0,
      titulo,
      entradilla: stripHtml(g('entradilla')),
      fecha: txt(g('fecha')).slice(0, 10),
      autor: txt(autor) || 'Redacción EDEM Times',
      autorRol: txt(g('autorRol')),
      lectura: Number(g('lectura')) || 0,
      img,
      imgMini: imgMini || img,
      alt: stripHtml(g('alt')),
      pie: stripHtml(g('pie')),
      etiquetas,
      cuerpo: normalizaCuerpo(g('cuerpo')),
      revista: isObj(rev) && rev.issue ? rev : null
    };
  }

  function normalizaSeccion(raw) {
    if (typeof raw === 'string') return { id: raw, nombre: raw, color: 'neutral', desc: '' };
    const id = txt(pick(raw, SECCION_PRESET.id));
    if (!id) return null;
    const color = txt(pick(raw, SECCION_PRESET.color)).toLowerCase();
    return {
      id,
      nombre: txt(pick(raw, SECCION_PRESET.nombre)) || id,
      color: COLORES.has(color) ? color : 'neutral',
      desc: txt(pick(raw, SECCION_PRESET.desc))
    };
  }

  /* ---------- lectura remota ---------- */

  async function pideJSON(url, cfg) {
    const r = await fetch(url, { headers: cfg.headers || {}, cache: 'no-cache' });
    if (!r.ok) throw new Error('HTTP ' + r.status + ' en ' + url);
    return r.json();
  }

  /* Caché de sesión: evita repetir la llamada al CMS al navegar de la portada a
     una ficha y volver. `cacheSegundos: 0` la desactiva. */
  function cacheGet(clave, seg) {
    if (!seg) return null;
    try {
      const raw = sessionStorage.getItem(clave);
      if (!raw) return null;
      const { t, v } = JSON.parse(raw);
      if (Date.now() - t > seg * 1000) return null;
      return v;
    } catch (_) { return null; }
  }
  function cacheSet(clave, valor, seg) {
    if (!seg) return;
    try { sessionStorage.setItem(clave, JSON.stringify({ t: Date.now(), v: valor })); } catch (_) { /* modo privado */ }
  }

  function listaDe(json, ruta) {
    if (Array.isArray(json)) return json;
    const v = ruta ? pick(json, ruta) : null;
    if (Array.isArray(v)) return v;
    // último recurso: el primer array que haya en la raíz de la respuesta
    for (const k in json) if (Array.isArray(json[k])) return json[k];
    return [];
  }

  /* ---------- API pública ---------- */

  const ORDEN = (a, b) => (b.fecha || '').localeCompare(a.fecha || '');

  let promesa = null;

  async function cargaLocal() {
    const r = await fetch('data/noticias.json', { cache: 'no-cache' });
    if (!r.ok) throw new Error('HTTP ' + r.status + ' en data/noticias.json');
    return r.json();
  }

  function desdeLocal(json) {
    const map = PRESETS.generico;
    return {
      portal: json.portal || {},
      origen: 'local',
      secciones: (json.secciones || []).map(normalizaSeccion).filter(Boolean),
      noticias: (json.noticias || []).map(n => normalizaNoticia(n, map)).filter(Boolean).sort(ORDEN)
    };
  }

  async function desdeCMS(json) {
    const cfg = json.cms || {};
    const map = Object.assign({}, PRESETS[cfg.tipo] || PRESETS.generico, cfg.mapeo || {});
    const seg = cfg.cacheSegundos === 0 ? 0 : (cfg.cacheSegundos || 300);
    const clave = 'edemtimes:noticias:' + cfg.endpoint;
    const base = cfg.baseMedios || '';

    let bruto = cacheGet(clave, seg);
    if (!bruto) {
      bruto = await pideJSON(cfg.endpoint, cfg);
      cacheSet(clave, bruto, seg);
    }
    if (cfg.tipo === 'contentful') bruto = resuelveEnlaces(bruto);

    const noticias = listaDe(bruto, map.lista).map(n => normalizaNoticia(n, map, base, cfg.miniatura)).filter(Boolean).sort(ORDEN);
    if (!noticias.length) throw new Error('El CMS no ha devuelto noticias reconocibles');

    let secciones = (json.secciones || []).map(normalizaSeccion).filter(Boolean);
    if (cfg.endpointSecciones) {
      try {
        const s = await pideJSON(cfg.endpointSecciones, cfg);
        const remotas = listaDe(s, map.lista).map(normalizaSeccion).filter(Boolean);
        if (remotas.length) secciones = remotas;
      } catch (e) { console.warn('[EDEM Times] secciones del CMS no disponibles, se usan las locales:', e.message); }
    }
    // secciones que el CMS usa pero no ha declarado: se crean al vuelo para que
    // ninguna noticia se quede sin etiqueta ni fuera del filtro
    const conocidas = new Set(secciones.map(s => s.id));
    noticias.forEach(n => {
      if (n.seccion && !conocidas.has(n.seccion)) {
        conocidas.add(n.seccion);
        secciones.push({ id: n.seccion, nombre: n.seccion.charAt(0).toUpperCase() + n.seccion.slice(1), color: 'neutral', desc: '' });
      }
    });

    return { portal: json.portal || {}, origen: 'cms', secciones, noticias };
  }

  /* Carga el catálogo completo (portal + home). Una sola promesa por página. */
  function load() {
    if (promesa) return promesa;
    promesa = (async () => {
      let json;
      try { json = await cargaLocal(); }
      catch (e) { console.warn('[EDEM Times] no se pudo leer data/noticias.json:', e.message); return { portal: {}, origen: 'vacio', secciones: [], noticias: [] }; }

      const cfg = json.cms || {};
      if (cfg.activo && cfg.endpoint) {
        try { return await desdeCMS(json); }
        catch (e) {
          // el CMS manda, pero si se cae la web no se queda en blanco
          console.warn('[EDEM Times] CMS no disponible, se usa el contenido local:', e.message);
          return Object.assign(desdeLocal(json), { origen: 'local-fallback' });
        }
      }
      return desdeLocal(json);
    })();
    return promesa;
  }

  /* Una noticia por su id. Si el CMS declara `endpointNoticia`, se pide suelta
     (más barato que traerse la colección entera para leer un artículo). */
  async function loadOne(id) {
    if (!id) return null;
    let json = null;
    try { json = await cargaLocal(); } catch (_) { /* seguimos con load() */ }
    const cfg = (json && json.cms) || {};

    if (cfg.activo && cfg.endpoint && cfg.endpointNoticia) {
      try {
        const map = Object.assign({}, PRESETS[cfg.tipo] || PRESETS.generico, cfg.mapeo || {});
        const url = cfg.endpointNoticia.replace('{id}', encodeURIComponent(id));
        let bruto = await pideJSON(url, cfg);
        if (cfg.tipo === 'contentful') bruto = resuelveEnlaces(bruto);
        const item = map.item ? pick(bruto, map.item) : bruto;
        const uno = normalizaNoticia(Array.isArray(item) ? item[0] : item, map, cfg.baseMedios || '', cfg.miniatura);
        if (uno) return uno;
      } catch (e) { console.warn('[EDEM Times] ficha del CMS no disponible, se busca en la lista:', e.message); }
    }
    const { noticias } = await load();
    return noticias.find(n => n.id === id) || null;
  }

  /* ============================================================
     EDICIONES DE LA REVISTA (data/content.json → issues)
     ============================================================
     Mismo principio que las noticias: la portada (js/app.js), el pie de las
     tres páginas (js/shell.js) y el buscador reciben siempre el mismo modelo
     de edición, salga de content.json o de un CMS headless.

     Modelo normalizado:
       { id, nr, title, chip, badge, badgeColor, desc, meta, note, fecha,
         pdf, file, print, cover, pages, latest,
         hero: { title, titleHtml, sub, lead } }
       · pdf   — el PDF de la edición: lo que se sube al CMS, o una ruta del
                 sitio (revistas/pdf/n3.pdf). El visor lo pinta página a página
                 con js/revistas-pdf.js.
       · file  — una revista maquetada en HTML (las de revistas/). Si una
                 edición trae las dos cosas, el visor usa esta —se ve más nítida
                 y pesa menos— y el PDF queda para descargar.
       · cover — imagen de portada, opcional. Sin ella se pinta la primera
                 página del PDF (o del HTML). Subirla ahorra a la portada de la
                 web cargar PDF.js y la primera página de cada PDF.
       · print — lo que abre el botón de imprimir o descargar; por defecto,
                 el PDF.
       · hero  — los textos que acompañan a la portada en la cabecera de la
                 web cuando esa edición está delante de la pila.
     Una edición sin id, sin título o sin nada que leer (ni pdf ni file) se
     descarta: no habría forma de enseñarla.

     Para enchufar un CMS: data/content.json → "cms": { activo:true,
     tipo:"strapi|wordpress|contentful|hygraph|generico", endpoint:"…" }.
     Si el CMS falla o tarda más de `espera` ms, se usan las locales. */

  const PRESETS_EDICION = {
    generico: {
      lista: 'ediciones|issues|revistas|data|items|results|docs',
      id: 'id|slug', numero: 'numero|number|num', nr: 'nr', title: 'title|titulo', chip: 'chip',
      badge: 'badge|etiqueta', badgeColor: 'badgeColor|color',
      desc: 'desc|descripcion|description|resumen|summary', meta: 'meta', note: 'note|nota',
      fecha: 'fecha|date|publishedAt|published_at',
      pdf: 'pdf|archivo|documento', file: 'file|html', print: 'print|imprimible',
      cover: 'cover|portada|imagen|image', pages: 'pages|paginas',
      heroTitle: 'hero.title|hero.titulo', heroTitleHtml: 'hero.titleHtml',
      heroSub: 'hero.sub|subtitulo|subtitle|sub', heroLead: 'hero.lead|entradilla|lead',
      latest: 'latest|ultima'
    },
    /* Strapi v4 (todo bajo `attributes`, medios en .data.attributes) y v5
       (campos y medios en la raíz): las rutas alternativas cubren las dos. */
    strapi: {
      lista: 'data',
      id: 'attributes.slug|slug|documentId|id', numero: 'attributes.numero|numero', nr: 'attributes.nr|nr',
      title: 'attributes.titulo|titulo|attributes.title|title',
      badge: 'attributes.etiqueta|etiqueta', badgeColor: 'attributes.color|color',
      desc: 'attributes.descripcion|descripcion', meta: 'attributes.meta|meta', note: 'attributes.nota|nota',
      fecha: 'attributes.fecha|fecha|attributes.publishedAt|publishedAt',
      pdf: 'attributes.pdf.data.attributes.url|pdf.url',
      cover: 'attributes.portada.data.attributes.formats.large.url|attributes.portada.data.attributes.url|portada.formats.large.url|portada.url',
      pages: 'attributes.paginas|paginas',
      heroSub: 'attributes.subtitulo|subtitulo', heroLead: 'attributes.entradilla|entradilla',
      latest: 'attributes.ultima|ultima'
    },
    /* WordPress: un tipo de entrada «revista» con campos ACF. Los campos de
       archivo de ACF tienen que devolver «File Array» o «File URL» (con
       «File ID» solo llega un número y no hay de dónde sacar la dirección). */
    wordpress: {
      lista: '',
      id: 'slug|id', numero: 'acf.numero', title: 'title.rendered|title',
      badge: 'acf.etiqueta', badgeColor: 'acf.color', desc: 'acf.descripcion|excerpt.rendered',
      note: 'acf.nota', fecha: 'date_gmt|date',
      pdf: 'acf.pdf.url|acf.pdf',
      cover: 'acf.portada.url|acf.portada|_embedded.wp:featuredmedia.0.source_url',
      pages: 'acf.paginas', heroSub: 'acf.subtitulo', heroLead: 'acf.entradilla', latest: 'acf.ultima'
    },
    contentful: {
      lista: 'items',
      id: 'fields.slug|sys.id', numero: 'fields.numero', title: 'fields.titulo|fields.title',
      badge: 'fields.etiqueta', badgeColor: 'fields.color', desc: 'fields.descripcion|fields.description',
      note: 'fields.nota', fecha: 'fields.fecha|sys.createdAt',
      pdf: 'fields.pdf.fields.file.url', cover: 'fields.portada.fields.file.url',
      pages: 'fields.paginas', heroSub: 'fields.subtitulo', heroLead: 'fields.entradilla', latest: 'fields.ultima'
    },
    hygraph: {
      lista: 'data.revistas|revistas|data.ediciones|ediciones',
      id: 'slug|id', numero: 'numero', title: 'titulo|title',
      badge: 'etiqueta', badgeColor: 'color', desc: 'descripcion',
      note: 'nota', fecha: 'fecha|publishedAt',
      pdf: 'pdf.url', cover: 'portada.url',
      pages: 'paginas', heroSub: 'subtitulo', heroLead: 'entradilla', latest: 'ultima'
    }
  };

  function normalizaEdicion(raw, map, base) {
    if (!isObj(raw)) return null;
    map = map || PRESETS_EDICION.generico;
    const g = k => (map[k] ? pick(raw, map[k]) : undefined);

    const id = txt(g('id'));
    const title = stripHtml(g('title'));
    const pdf = medio(g('pdf'), base);
    const file = txt(g('file'));
    if (!id || !title || !(pdf || file)) return null;

    const fecha = txt(g('fecha')).slice(0, 10);
    const num = txt(g('numero'));
    const year = /^\d{4}/.test(fecha) ? fecha.slice(0, 4) : '';
    const pages = Number(g('pages')) || 0;
    const color = txt(g('badgeColor')).toLowerCase();
    const soloPdf = pdf && !file;

    // los textos de portada: se conservan los campos que ya traiga (content.json
    // guarda también kicker, chips…, que lee el buscador) y encima los mapeados
    const hero = Object.assign({}, isObj(raw.hero) ? raw.hero : {});
    const heroTitle = stripHtml(g('heroTitle')), heroTitleHtml = txt(g('heroTitleHtml'));
    const heroSub = stripHtml(g('heroSub')), heroLead = stripHtml(g('heroLead'));
    if (heroTitle) hero.title = heroTitle;
    if (heroTitleHtml) hero.titleHtml = heroTitleHtml;
    if (heroSub) hero.sub = heroSub;
    if (heroLead) hero.lead = heroLead;

    return {
      id, title, fecha, pages, pdf, file,
      nr: txt(g('nr')) || (num ? 'Nº ' + num + (year ? ' · ' + year : '') : year),
      chip: txt(g('chip')) || (num ? 'Nº ' + num + ' · ' + title : title),
      badge: stripHtml(g('badge')),
      badgeColor: COLORES.has(color) ? color : 'edem',
      desc: stripHtml(g('desc')),
      meta: txt(g('meta')) || (pages ? pages + ' páginas' + (soloPdf ? ' · PDF' : '') : (soloPdf ? 'Edición digital · PDF' : '')),
      note: stripHtml(g('note')),
      cover: medio(g('cover'), base),
      print: medio(g('print'), base) || pdf || file,
      latest: g('latest') === true || g('latest') === 'true' || g('latest') === 1,
      hero
    };
  }

  async function edicionesDelCMS(cfg) {
    const map = Object.assign({}, PRESETS_EDICION[cfg.tipo] || PRESETS_EDICION.generico, cfg.mapeo || {});
    const seg = cfg.cacheSegundos === 0 ? 0 : (cfg.cacheSegundos || 300);
    const clave = 'edemtimes:ediciones:' + cfg.endpoint;
    let bruto = cacheGet(clave, seg);
    if (!bruto) {
      bruto = await pideJSON(cfg.endpoint, cfg);
      cacheSet(clave, bruto, seg);
    }
    if (cfg.tipo === 'contentful') bruto = resuelveEnlaces(bruto);
    const lista = listaDe(bruto, map.lista).map(e => normalizaEdicion(e, map, cfg.baseMedios || '')).filter(Boolean);
    // de la más nueva a la más vieja, si el CMS las fecha todas
    if (lista.length && lista.every(e => e.fecha)) lista.sort((a, b) => b.fecha.localeCompare(a.fecha));
    return lista;
  }

  /* Recibe el content.json tal cual y devuelve una copia con `issues`
     normalizadas (del CMS si está activo y responde; si no, las locales) y con
     `site.latest` apuntando a una edición que exista. La usa js/shell.js al
     cargar content.json, así que TODA la web ve las mismas ediciones. */
  async function ediciones(json) {
    if (!json) return json;
    const out = Object.assign({}, json, { site: Object.assign({}, json.site) });
    out.issues = (json.issues || []).map(e => normalizaEdicion(e, PRESETS_EDICION.generico)).filter(Boolean);
    out.issuesOrigen = 'local';

    const cfg = json.cms || {};
    if (cfg.activo && cfg.endpoint) {
      try {
        const espera = Number(cfg.espera) || 6000;
        const remotas = await Promise.race([
          edicionesDelCMS(cfg),
          new Promise((_, no) => setTimeout(() => no(new Error('el CMS ha tardado más de ' + espera + ' ms')), espera))
        ]);
        if (!remotas.length) throw new Error('el CMS no ha devuelto ediciones con PDF o HTML');
        out.issues = remotas;
        out.issuesOrigen = 'cms';
      } catch (e) {
        // el CMS manda, pero si se cae la revista no desaparece de la web
        console.warn('[EDEM Times] ediciones del CMS no disponibles, se usan las locales:', e.message);
        out.issuesOrigen = 'local-fallback';
      }
    }

    // la última: la que diga content.json (si viene de ahí y existe), la que el
    // CMS marque como última, la más reciente por fecha o, si no, la primera
    const ids = new Set(out.issues.map(e => e.id));
    let latest = out.issuesOrigen === 'cms' ? '' : txt(out.site.latest);
    if (!ids.has(latest)) {
      const marcada = out.issues.find(e => e.latest);
      const reciente = out.issues.filter(e => e.fecha).sort((a, b) => b.fecha.localeCompare(a.fecha))[0];
      latest = (marcada || reciente || out.issues[0] || {}).id || '';
    }
    out.site.latest = latest;
    // una edición recién subida al CMS sin etiqueta: la última se anuncia sola
    if (out.issuesOrigen === 'cms') {
      const ult = out.issues.find(e => e.id === latest);
      if (ult && !ult.badge) { ult.badge = 'Última edición'; ult.badgeColor = 'lanzadera'; }
    }
    return out;
  }

  window.EdemCMS = {
    load, loadOne, pick, normalizaCuerpo, PRESETS,
    ediciones, normalizaEdicion, PRESETS_EDICION
  };
})();
