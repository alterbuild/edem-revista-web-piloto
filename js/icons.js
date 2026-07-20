/* ============================================================
   EDEM Times — icons.js
   Sustituye al bundle completo de Lucide (~360 KB desde unpkg)
   por los 17 iconos que usa la web, con los mismos trazados
   (extraídos de lucide@0.525.0). Expone window.lucide.createIcons
   con el mismo contrato: reemplaza cada <i data-lucide> por su
   SVG conservando clases y atributos del elemento original.
   ============================================================ */
'use strict';
(function () {
  const ICONS = {"anchor":[["path",{"d":"M12 22V8"}],["path",{"d":"M5 12H2a10 10 0 0 0 20 0h-3"}],["circle",{"cx":"12","cy":"5","r":"3"}]],"arrow-right":[["path",{"d":"M5 12h14"}],["path",{"d":"m12 5 7 7-7 7"}]],"arrow-up-right":[["path",{"d":"M7 7h10v10"}],["path",{"d":"M7 17 17 7"}]],"book-marked":[["path",{"d":"M10 2v8l3-3 3 3V2"}],["path",{"d":"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"}]],"book-open":[["path",{"d":"M12 7v14"}],["path",{"d":"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"}]],"chevron-down":[["path",{"d":"m6 9 6 6 6-6"}]],"chevron-left":[["path",{"d":"m15 18-6-6 6-6"}]],"chevron-right":[["path",{"d":"m9 18 6-6-6-6"}]],"library":[["path",{"d":"m16 6 4 14"}],["path",{"d":"M12 6v14"}],["path",{"d":"M8 8v12"}],["path",{"d":"M4 4v16"}]],"list":[["path",{"d":"M3 12h.01"}],["path",{"d":"M3 18h.01"}],["path",{"d":"M3 6h.01"}],["path",{"d":"M8 12h13"}],["path",{"d":"M8 18h13"}],["path",{"d":"M8 6h13"}]],"mail":[["path",{"d":"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"}],["rect",{"x":"2","y":"4","width":"20","height":"16","rx":"2"}]],"maximize":[["path",{"d":"M8 3H5a2 2 0 0 0-2 2v3"}],["path",{"d":"M21 8V5a2 2 0 0 0-2-2h-3"}],["path",{"d":"M3 16v3a2 2 0 0 0 2 2h3"}],["path",{"d":"M16 21h3a2 2 0 0 0 2-2v-3"}]],"minimize":[["path",{"d":"M8 3v3a2 2 0 0 1-2 2H3"}],["path",{"d":"M21 8h-3a2 2 0 0 1-2-2V3"}],["path",{"d":"M3 16h3a2 2 0 0 1 2 2v3"}],["path",{"d":"M16 21v-3a2 2 0 0 1 2-2h3"}]],"menu":[["path",{"d":"M4 12h16"}],["path",{"d":"M4 18h16"}],["path",{"d":"M4 6h16"}]],"newspaper":[["path",{"d":"M15 18h-5"}],["path",{"d":"M18 14h-8"}],["path",{"d":"M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9a2 2 0 0 1 2-2h2"}],["rect",{"width":"8","height":"4","x":"10","y":"6","rx":"1"}]],"printer":[["path",{"d":"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"}],["path",{"d":"M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"}],["rect",{"x":"6","y":"14","width":"12","height":"8","rx":"1"}]],"quote":[["path",{"d":"M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"}],["path",{"d":"M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"}]],"waypoints":[["circle",{"cx":"12","cy":"4.5","r":"2.5"}],["path",{"d":"m10.2 6.3-3.9 3.9"}],["circle",{"cx":"4.5","cy":"12","r":"2.5"}],["path",{"d":"M7 12h10"}],["circle",{"cx":"19.5","cy":"12","r":"2.5"}],["path",{"d":"m13.8 17.7 3.9-3.9"}],["circle",{"cx":"12","cy":"19.5","r":"2.5"}]],"x":[["path",{"d":"M18 6 6 18"}],["path",{"d":"m6 6 12 12"}]]};
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const DEFAULTS = { xmlns: SVG_NS, width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };

  function build(nodes) {
    const svg = document.createElementNS(SVG_NS, 'svg');
    for (const k in DEFAULTS) svg.setAttribute(k, DEFAULTS[k]);
    (function append(parent, children) {
      for (const [tag, attrs, kids] of children) {
        const el = document.createElementNS(SVG_NS, tag);
        for (const a in attrs) el.setAttribute(a, attrs[a]);
        if (kids) append(el, kids);
        parent.appendChild(el);
      }
    })(svg, nodes);
    return svg;
  }

  function createIcons() {
    document.querySelectorAll('[data-lucide]').forEach(el => {
      const name = el.getAttribute('data-lucide'), nodes = ICONS[name];
      if (!nodes) return;
      const svg = build(nodes);
      for (const at of el.attributes) {
        if (at.name === 'data-lucide' || at.name === 'class') continue;
        svg.setAttribute(at.name, at.value);
      }
      svg.setAttribute('class', ('lucide lucide-' + name + ' ' + el.getAttribute('class')).trim());
      el.replaceWith(svg);
    });
  }

  window.lucide = { createIcons };
})();
