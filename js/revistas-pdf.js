/* ============================================================
   EDEM Times — revistas-pdf.js
   Ediciones en PDF: la portada (su primera página) y las páginas
   del visor. Es lo que permite publicar una edición subiendo SOLO
   el PDF al CMS, sin maquetarla en HTML.

   PDF.js (Mozilla) se carga SOLO cuando hace falta: una edición en
   PDF sin imagen de portada, o el visor abierto en una edición en
   PDF. Son ~1,6 MB de código que la portada no paga mientras las
   ediciones sean HTML o traigan su portada subida.
   Se usa la versión «legacy», la que funciona también en Safari y
   Chrome de hace unos años.

   API (la usa js/app.js):
     EdemPDF.info(url)            → { n, labels[], ratio }
     EdemPDF.page(url, i, ancho)  → { url, w, h }   (i empieza en 0)
     EdemPDF.cover(url, ancho)    → { url, w, h }   (la página 1)
   Las `url` que devuelve son blob: de una imagen JPEG ya pintada,
   cacheadas por página y ancho: pasar dos veces por una página no
   la vuelve a pintar.

   OJO si el PDF vive en otro dominio (el de un CMS): PDF.js lo pide
   con fetch, así que ese servidor tiene que mandar la cabecera
   Access-Control-Allow-Origin (Contentful y Strapi lo hacen de
   serie; un WordPress normalmente hay que configurarlo). Si no, el
   visor ofrece abrir el PDF en una pestaña y la portada se queda en
   su rótulo. Y conviene exportarlo «optimizado para web»
   (linealizado): así la portada solo descarga su primera página.
   ============================================================ */
'use strict';

(function () {
  const VER = '5.4.624';
  const PKG = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@' + VER + '/';

  let lib = null;
  function pdfjs() {
    if (!lib) {
      lib = import(PKG + 'legacy/build/pdf.min.mjs').then(m => {
        m.GlobalWorkerOptions.workerSrc = PKG + 'legacy/build/pdf.worker.min.mjs';
        return m;
      });
      lib.catch(() => { lib = null; });           // un fallo de red no se queda cacheado
    }
    return lib;
  }

  /* Un documento por URL. disableAutoFetch + disableStream: PDF.js pide por
     rangos (HTTP Range) solo los trozos de las páginas que se pintan, en vez
     de bajarse el PDF entero —la portada no necesita más que la página 1—.
     Si el servidor no admite rangos, lo descarga entero y ya está. */
  const docs = new Map();
  function doc(url) {
    if (!docs.has(url)) {
      const p = pdfjs().then(m => m.getDocument({
        url,
        disableAutoFetch: true,
        disableStream: true,
        isEvalSupported: false,                    // nada de eval con fuentes del PDF
        cMapUrl: PKG + 'cmaps/',
        cMapPacked: true,
        standardFontDataUrl: PKG + 'standard_fonts/',
        wasmUrl: PKG + 'wasm/'
      }).promise);
      p.catch(() => docs.delete(url));
      docs.set(url, p);
    }
    return docs.get(url);
  }

  /* Rótulos de página para el selector del visor: los marcadores del PDF
     («Editorial», «Entrevista»…) si los trae, como los data-screen-label de
     las revistas en HTML; si no, «Página N». */
  async function labelsOf(d) {
    const out = Array.from({ length: d.numPages }, (_, i) => 'Página ' + (i + 1));
    try {
      const outline = await d.getOutline();
      for (const it of outline || []) {
        let dest = it.dest;
        if (typeof dest === 'string') dest = await d.getDestination(dest);
        if (!Array.isArray(dest) || !dest[0]) continue;
        const idx = typeof dest[0] === 'number' ? dest[0] : await d.getPageIndex(dest[0]);
        if (idx >= 0 && idx < out.length && it.title) out[idx] = String(it.title).trim();
      }
    } catch (_) { /* sin marcadores: se queda «Página N» */ }
    return out;
  }

  const infos = new Map();
  function info(url) {
    if (!infos.has(url)) {
      const p = doc(url).then(async d => {
        const p1 = await d.getPage(1);
        const vp = p1.getViewport({ scale: 1 });
        return { n: d.numPages, labels: await labelsOf(d), ratio: vp.height / vp.width };
      });
      p.catch(() => infos.delete(url));
      infos.set(url, p);
    }
    return infos.get(url);
  }

  /* Pinta la página i a `ancho` px en un canvas y la guarda como JPEG. Un JPEG
     y no el canvas: el mismo pliego sale a la vez en la mitad del libro y en
     la hoja que gira, y un blob se reutiliza sin volver a pintar; además ocupa
     una fracción de la memoria de un canvas del mismo tamaño. */
  const pages = new Map();
  let queue = Promise.resolve();                   // de una en una: no se pisan
  function page(url, i, ancho) {
    const w = Math.max(200, Math.round(ancho || 1200));
    const key = url + '|' + i + '|' + w;
    if (!pages.has(key)) {
      const job = queue.then(async () => {
        const d = await doc(url);
        const pg = await d.getPage(i + 1);
        const vp = pg.getViewport({ scale: w / pg.getViewport({ scale: 1 }).width });
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(vp.width);
        canvas.height = Math.round(vp.height);
        const ctx = canvas.getContext('2d', { alpha: false });
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await pg.render({ canvas, canvasContext: ctx, viewport: vp }).promise;
        const blob = await new Promise(res => canvas.toBlob(res, 'image/jpeg', .9));
        const out = { url: URL.createObjectURL(blob), w: canvas.width, h: canvas.height };
        canvas.width = canvas.height = 0;          // suelta la memoria del lienzo ya
        pg.cleanup();
        return out;
      });
      // la fila sigue aunque una página se atasque (una descarga colgada no
      // puede dejar el visor entero esperando)
      queue = Promise.race([job.catch(() => {}), new Promise(r => setTimeout(r, 20000))]);
      job.catch(() => pages.delete(key));
      pages.set(key, job);
    }
    return pages.get(key);
  }

  const cover = (url, ancho) => page(url, 0, ancho || 640);

  window.EdemPDF = { info, page, cover, warm: pdfjs };
})();
