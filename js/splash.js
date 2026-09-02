/* ============================================================
   EDEM Times — splash.js
   Conduce la cortina de carga (ver css/site.css, sección SPLASH).

   Lo que hace, en orden:
   1) Decide si toca ponerla. NO se pone entera si la página se ha
      restaurado con scroll (recarga a media página, vuelta atrás)
      ni si ya se vio en esta sesión — ahí basta con un velo que se
      disuelve, porque la cortina está para tapar el primer pintado,
      no para hacerse notar en cada navegación.
   2) Saca el logotipo de EDEM y escribe «times.» a máquina, letra a
      letra. Espera a la tipografía para hacerlo: mide dónde acaba
      cada letra YA CON BODONI puesta y lleva ahí el filo del
      recorte y el cursor.
   3) Se retira cuando se cumplen las dos cosas: que la mancheta se
      haya terminado de escribir y que lo que carga por detrás (la
      hoja de fuentes, las webfonts, content.json y la primera
      portada del mazo) haya llegado. Con tope duro, pase lo que pase.

   Por qué existe: las webfonts se piden ahora SIN bloquear el pintado
   (ver el <link media="print"> de los HTML). Eso adelanta el primer
   frame, pero deja a la vista el cambio de Georgia a Bodoni. La cortina
   tapa exactamente esa ventana: se retira cuando la tipografía ya está,
   así que el salto no se ve nunca y la portada aparece terminada.

   Contrato con el resto del sitio:
   · window.EdemSplash.done  → promesa que resuelve al retirarse.
   · window.EdemSplash.hit(n)→ marca un hito de carga (lo llama app.js
     cuando la primera portada del mazo ya está montada).
   ============================================================ */
'use strict';

(function () {
  const el = document.getElementById('splash');
  if (!el) return;

  const root = document.documentElement;
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FONT_CAP = 620;   // si la tipografía tarda más, se escribe con la de respaldo
  const LOGO = 220;       // lo que tarda el logotipo en asentarse antes de escribir
  const KEY = 66;         // milisegundos por letra
  const HOLD = 160;       // lo que se queda la mancheta escrita antes de irse
  const MAX = 2400;       // tope duro: pase lo que pase, a los 2,4s se va

  let resolveDone;
  const done = new Promise(r => { resolveDone = r; });

  /* ---- ¿versión completa o solo un velo? ----
     sessionStorage puede lanzar en modo privado antiguo: siempre en try. */
  let seen = false;
  try { seen = sessionStorage.getItem('edem-splash') === '1'; } catch (_) {}
  const quick = seen || window.scrollY > 40;   // ya vista, o recarga a media página
  const still = quick || REDUCED;              // sin máquina de escribir

  if (quick) el.classList.add('sp-quick');
  root.classList.add('sp-on');

  /* Para revisar el diseño de la cortina sin cronómetro: entrar con #splash en la
     URL la deja puesta. SOLO FUNCIONA SIRVIENDO EN LOCAL: en un dominio público
     un enlace con ese hash —compartido, guardado en marcadores, pegado en un
     chat— dejaría la portada tapada para siempre, y una ayuda de desarrollo no
     puede poder tanto. Fuera de local el hash se ignora sin más. */
  const LOCAL = location.protocol === 'file:'
    || /^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])$/i.test(location.hostname)
    || /\.local$/i.test(location.hostname);
  let holdOpen = LOCAL && location.hash === '#splash';

  /* ---- la máquina de escribir ----
     El texto ya está compuesto en el HTML; lo único que cambia es --cut, el
     filo del recorte, que va saltando al final de cada letra. Se mide con
     getBoundingClientRect para que el filo caiga EXACTO en el borde de cada
     una (las letras de Bodoni no miden lo mismo y un `steps()` a ojo partía
     la «m» por la mitad). El cursor cuelga de ese mismo --cut. */
  const type = document.getElementById('sp-type');
  let resolveTyped;
  const typed = new Promise(r => { resolveTyped = r; });
  let writing = false;

  function write() {
    if (writing) return;
    writing = true;
    el.classList.add('sp-mark');                 // el logotipo entra
    // sin máquina de escribir (sesión repetida o movimiento reducido) el CSS ya
    // deja «times.» entero; aquí solo hay que dar por escrito
    if (still) { resolveTyped(); return; }
    const ink = type && type.querySelector('.ink');
    const letters = type ? [...type.querySelectorAll('.ink i')] : [];
    if (!ink || !letters.length) {
      // el marcado no es el esperado: mejor la marca entera que un hueco en blanco
      if (type) type.style.setProperty('--cut', '100%');
      resolveTyped();
      return;
    }

    // dónde acaba cada letra, en píxeles desde el principio del texto
    const x0 = ink.getBoundingClientRect().left;
    const stops = letters.map(l => l.getBoundingClientRect().right - x0);

    /* Se escribe DESPUÉS de que el logotipo haya entrado, no a la vez: primero
       aparece EDEM y luego, al lado, se teclea «times.». Es el orden que se lee. */
    setTimeout(() => {
      el.classList.add('sp-typing');
      let i = 0;
      (function tick() {
        type.style.setProperty('--cut', stops[i].toFixed(1) + 'px');
        if (++i < stops.length) {
          // el punto final se hace esperar un pelín más, como al escribir de verdad
          setTimeout(tick, i === stops.length - 1 ? KEY * 2 : KEY);
          return;
        }
        setTimeout(() => { el.classList.add('sp-typed'); resolveTyped(); }, 150);
      }());
    }, LOGO);
  }

  /* ---- la retirada ----
     Los tiempos van por reloj y no por transitionend a propósito: con
     «movimiento reducido» el sitio anula todas las duraciones (regla global de
     site.css) y el evento no llegaría nunca. */
  let going = false, fast = still;
  function leave() {
    if (going || holdOpen) return;
    going = true;
    write();                                     // por si aún no había salido
    typed.then(() => setTimeout(() => {
      el.classList.add('sp-go');                 // la mancheta se apaga subiendo
      setTimeout(() => {
        el.classList.add('sp-off');              // y el velo se disuelve
        setTimeout(finish, fast ? 240 : 400);
      }, fast ? 0 : 160);
    }, fast ? 0 : HOLD));
  }

  /* Tocar la cortina la salta. Es a la vez cortesía —quien tiene prisa entra— y
     VÁLVULA DE SEGURIDAD: pase lo que pase (un temporizador estrangulado por
     tener la pestaña de fondo, una promesa que no resuelve, el hold de arriba),
     la portada nunca se queda detrás de un telón sin salida. El texto sale
     entero en vez de terminar de teclearse: al que toca no se le hace esperar. */
  function skip() {
    holdOpen = false;
    fast = true;
    el.classList.add('sp-skip');
    resolveTyped();
    leave();
  }
  el.addEventListener('pointerdown', skip);
  el.addEventListener('click', skip);

  function finish() {
    root.classList.remove('sp-on');
    el.remove();
    try { sessionStorage.setItem('edem-splash', '1'); } catch (_) {}
    // el hero mide su recorrido con el alto real: al soltar el scroll conviene
    // que vuelva a medir (app.js escucha «resize» para eso)
    dispatchEvent(new Event('resize'));
    resolveDone();
  }

  let readyCalled = false;
  function ready() { if (!readyCalled) { readyCalled = true; leave(); } }

  /* ---- hitos de carga ----
     No pintan nada, solo deciden CUÁNDO puede irse la cortina: en cuanto han
     llegado los cuatro (o cuando se agota el tope). */
  const STEPS = ['css', 'fonts', 'data', 'cover'];
  const seenStep = {};
  function hit(name) {
    if (seenStep[name] || STEPS.indexOf(name) < 0) return;
    seenStep[name] = true;
    if (Object.keys(seenStep).length === STEPS.length) ready();
  }

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  // 1· la hoja de Google Fonts (se pide sin bloquear: <link media="print">)
  const gf = document.getElementById('gfonts');
  const cssIn = !gf || window.__gfontsIn
    ? Promise.resolve()
    : Promise.race([new Promise(r => addEventListener('edem:gfonts', r, { once: true })), sleep(1200)]);
  cssIn.then(() => hit('css'));

  /* 2· las webfonts de verdad. Se piden EXPLÍCITAMENTE las caras que se ven
        nada más entrar (la mancheta y el titular del hero) en vez de confiar
        solo en document.fonts.ready: `ready` promete que no queda nada
        PENDIENTE, y justo después de activar la hoja todavía no hay nada
        pendiente porque el navegador no ha recalculado estilos — resolvería en
        falso. Con fonts.load() la petición se lanza aquí y la espera es de
        verdad. Tope por si se atasca: con la de respaldo se escribe igual, y
        las medidas de las letras se toman sobre lo que haya puesto. */
  const NEED = ['700 1em Archivo', 'italic 600 1em "Bodoni Moda"', '900 1em "Bodoni Moda"'];
  const fonts = document.fonts
    ? Promise.race([
      cssIn.then(() => Promise.all(NEED.map(f => document.fonts.load(f))))
        .then(() => document.fonts.ready, () => null),
      sleep(1500)
    ])
    : Promise.resolve();
  fonts.then(() => hit('fonts'));

  // 3· content.json (lo pide js/shell.js y lo comparte en window.EdemContent)
  (window.EdemContent
    ? Promise.race([Promise.resolve(window.EdemContent).catch(() => null), sleep(1400)])
    : Promise.resolve()
  ).then(() => hit('data'));

  // 4· la primera portada del mazo, que la canta app.js con hit('cover').
  //    Donde no hay mazo (portal de noticias, ficha) el hito se da por hecho.
  if (!document.querySelector('.heroDeck')) hit('cover');

  /* La mancheta se escribe en cuanto la tipografía está —o a los FONT_CAP ms,
     con la de respaldo—, sin esperar al resto de hitos: así el segundo que dura
     la cortina se usa en enseñar la marca y no en mirar un papel en blanco. */
  Promise.race([fonts, sleep(FONT_CAP)]).then(write);

  // topes: el de siempre, y el `load` del documento por si algo se cayó
  setTimeout(ready, quick ? 420 : MAX);
  addEventListener('load', () => setTimeout(ready, quick ? 0 : 200));

  window.EdemSplash = { done, hit, leave: ready };
}());
