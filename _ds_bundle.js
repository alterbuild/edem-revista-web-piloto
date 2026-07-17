/* @ds-bundle: {"format":4,"namespace":"EDEMRevistaDesignSystem_7d0987","components":[{"name":"ArticleCard","sourcePath":"components/core/ArticleCard.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"}],"sourceHashes":{"components/core/ArticleCard.jsx":"7a26b2fc9006","components/core/Badge.jsx":"8f14fdf983b9","components/core/Button.jsx":"f9b265b384a1","explorations/doc-page.js":"f106e1b77ea0","ui_kits/revista/pilot-app.js":"dec93b369286"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.EDEMRevistaDesignSystem_7d0987 = window.EDEMRevistaDesignSystem_7d0987 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TONES = {
  edem: {
    bg: 'var(--edem)',
    fg: '#ffffff'
  },
  lanzadera: {
    bg: 'var(--lanzadera)',
    fg: '#ffffff'
  },
  angels: {
    bg: 'var(--angels)',
    fg: '#ffffff'
  },
  neutral: {
    bg: 'var(--ink-100)',
    fg: 'var(--ink-700)'
  },
  teal: {
    bg: 'var(--edem-teal-50)',
    fg: 'var(--edem-teal-800)'
  }
};

/**
 * Category / ecosystem badge. Uppercase overline, pill by default.
 * tone: edem | lanzadera | angels | neutral | teal
 */
function Badge({
  children,
  tone = 'edem',
  solid = true,
  size = 'md',
  style = {},
  ...rest
}) {
  const t = TONES[tone] || TONES.edem;
  const pad = size === 'sm' ? '4px 10px' : '6px 13px';
  const fs = size === 'sm' ? 11 : 12;
  const soft = {
    background: 'transparent',
    color: t.bg,
    border: `1.5px solid ${t.bg}`
  };
  const filled = {
    background: t.bg,
    color: t.fg,
    border: '1.5px solid transparent'
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    className: "edem-badge",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontFamily: 'var(--font-sans)',
      fontWeight: 700,
      fontSize: fs,
      letterSpacing: '.14em',
      textTransform: 'uppercase',
      lineHeight: 1,
      padding: pad,
      borderRadius: 'var(--radius-pill)',
      ...(solid ? filled : soft),
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/ArticleCard.jsx
try { (() => {
/**
 * Standard article card for the magazine grid.
 * Image on top, ecosystem badge, serif display title, excerpt, meta row.
 */
function ArticleCard({
  image,
  imageAlt = '',
  tone = 'edem',
  category = 'EDEM',
  title,
  excerpt,
  meta,
  href = '#',
  style = {}
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("a", {
    className: "edem-article-card",
    href: href,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-hair)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      textDecoration: 'none',
      transition: 'transform var(--dur) var(--ease-out), box-shadow var(--dur) var(--ease-out)',
      transform: hover ? 'translateY(-6px)' : 'none',
      boxShadow: hover ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: '3 / 2',
      overflow: 'hidden',
      background: 'var(--ink-100)'
    }
  }, image ? /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: imageAlt,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block',
      transition: 'transform var(--dur-slow) var(--ease-out)',
      transform: hover ? 'scale(1.05)' : 'scale(1)'
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '100%',
      display: 'grid',
      placeItems: 'center',
      color: 'var(--ink-300)',
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      letterSpacing: '.1em'
    }
  }, "IMAGEN")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-5)',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: tone,
    size: "sm"
  }, category), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 'var(--fs-h3)',
      lineHeight: 1.14,
      letterSpacing: 'var(--ls-tight)',
      color: 'var(--text-strong)'
    }
  }, title), excerpt && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--fs-small)',
      lineHeight: 1.55,
      color: 'var(--text-muted)',
      flex: 1
    }
  }, excerpt), meta && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      paddingTop: 12,
      borderTop: '1px solid var(--border-hair)',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--fs-caption)',
      color: 'var(--text-faint)',
      letterSpacing: '.02em',
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      color: 'var(--text-link)',
      fontWeight: 600,
      transition: 'gap var(--dur) var(--ease-out)'
    }
  }, "Leer art\xEDculo", /*#__PURE__*/React.createElement("span", {
    style: {
      transform: hover ? 'translateX(4px)' : 'none',
      transition: 'transform var(--dur) var(--ease-out)'
    }
  }, "\u2192")), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto'
    }
  }, meta))));
}
Object.assign(__ds_scope, { ArticleCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/ArticleCard.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * EDEM primary button. Editorial, squared corners, confident.
 * variant: 'primary' | 'secondary' | 'outline' | 'ghost'
 * size: 'sm' | 'md' | 'lg'
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  iconLeft = null,
  iconRight = null,
  as = 'button',
  onClick,
  style = {},
  ...rest
}) {
  const pads = {
    sm: '9px 16px',
    md: '13px 24px',
    lg: '17px 34px'
  };
  const fss = {
    sm: 14,
    md: 15,
    lg: 17
  };
  const base = {
    fontFamily: 'var(--font-sans)',
    fontWeight: 600,
    fontSize: fss[size],
    letterSpacing: '.01em',
    lineHeight: 1,
    padding: pads[size],
    borderRadius: 'var(--radius-sm)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    cursor: disabled ? 'not-allowed' : 'pointer',
    border: '1.5px solid transparent',
    transition: 'background var(--dur-fast) var(--ease-standard), color var(--dur-fast) var(--ease-standard), border-color var(--dur-fast) var(--ease-standard), transform var(--dur-fast) var(--ease-standard), box-shadow var(--dur-fast) var(--ease-standard)',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    opacity: disabled ? 0.45 : 1
  };
  const variants = {
    primary: {
      background: 'var(--color-primary)',
      color: 'var(--color-on-primary)',
      boxShadow: 'var(--shadow-sm)'
    },
    secondary: {
      background: 'var(--ink-900)',
      color: 'var(--paper)'
    },
    outline: {
      background: 'transparent',
      color: 'var(--color-primary)',
      borderColor: 'var(--color-primary)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-strong)'
    }
  };
  const hoverFor = {
    primary: {
      background: 'var(--color-primary-hover)'
    },
    secondary: {
      background: 'var(--ink-800)'
    },
    outline: {
      background: 'var(--color-primary-soft)'
    },
    ghost: {
      background: 'var(--ink-100)'
    }
  };
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const composed = {
    ...base,
    ...variants[variant],
    ...(hover && !disabled ? hoverFor[variant] : {}),
    ...(press && !disabled ? {
      transform: 'translateY(1px)'
    } : {}),
    ...style
  };
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: "edem-button",
    style: composed,
    disabled: as === 'button' ? disabled : undefined,
    onClick: disabled ? undefined : onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPress(false);
    },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false)
  }, rest), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// explorations/doc-page.js
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)
// Copied omelette starter. Re-running copy_starter_component with this kind overwrites this file with the latest version (page content is unaffected).
/* BEGIN USAGE */
/**
 * <doc-page> — paged-document shell for printable HTML.
 *
 * On screen the document renders as a single continuous sheet on a desk
 * background (Google Docs' pageless view): you scroll one tall page card.
 * There is no manual page-splitting — write the whole document as normal
 * flow inside <doc-page> and the browser's print engine paginates it at
 * export.
 *
 * At print the component injects `@page { size: …; margin: 0 }` (which
 * leaves Chrome no margin box to draw its date/URL/page-count header in)
 * and moves the visual margin onto the sheet's own padding, so the printed
 * page has the same inset you see on screen. Standard break-hygiene rules
 * (`break-inside: avoid` on figures, code blocks, images and table rows;
 * `orphans/widows: 3`) are applied so paragraphs and groups split cleanly.
 * On screen and at print, headings default to `text-wrap: balance` and
 * body text (p, li, blockquote, figcaption) to `text-wrap: pretty`, so
 * the document avoids widowed/orphaned words; the defaults have zero
 * specificity, so any text-wrap you declare on those elements wins.
 * The component also marks the document as owning its print CSS (a
 * `meta[name="omelette-owns-print"]` it injects at runtime), so the
 * PDF export never injects page-geometry CSS of its own on top.
 *
 * Usage:
 *   <style>doc-page:not(:defined){visibility:hidden}</style>
 *   <doc-page size="letter" margin="0.75in">
 *     <h1>Title</h1>
 *     <p>…body…</p>
 *   </doc-page>
 *   <script src="doc-page.js"></script>
 *
 * Attributes:
 *   size    — letter | a4 | legal (default letter)
 *   orientation — portrait (default) | landscape. For documents built to
 *           export, always set it explicitly. landscape swaps the named
 *           size's dimensions (letter landscape prints 11in × 8.5in).
 *   width / height — explicit CSS lengths, override `size` and
 *           `orientation`: the page IS the design's size (a poster
 *           printed at its true dimensions). With both set, the component
 *           also declares the page box as the preview size (a
 *           `meta[name="omelette-fixed-size"]` it injects at runtime,
 *           never overriding one you author), so the in-app preview
 *           scales the whole sheet into view.
 *   content-width / content-height — the design's own fixed dimensions
 *           (CSS lengths), for scaling a fixed-size design ONTO the named
 *           paper: content lays out at exactly this size, and the
 *           component scales it to fit the printable area (centered
 *           horizontally, top-aligned), so e.g. a 960px-wide poster lands
 *           on one Letter page. Both must be set; they do not change the
 *           page box — `size`/`orientation` (or `width`/`height`)
 *           still name the paper. For pages WITHOUT running
 *           header/footer slots — the fit box fills the printable area
 *           and does not subtract slot heights.
 *   margin  — printable inset on every page (default 0.75in); margin="0"
 *           makes pages full-bleed (content then owns its own insets)
 *
 * Running header/footer (optional): give an element `slot="header"` or
 * `slot="footer"` and it repeats on every printed page via
 * `position: fixed`. To keep body text from sliding under it, the
 * component prints inside a single-cell table whose <thead>/<tfoot> are
 * spacers sized to the header/footer height — browsers repeat thead/tfoot
 * on every page, so each sheet's content starts below the header and ends
 * above the footer. On screen the header/footer render once at the
 * top/bottom of the sheet.
 *
 * Print best practices for the content you author:
 * - Multi-column text: use CSS columns (`column-count` +
 *   `column-gap`), never side-by-side flex/grid columns — only real
 *   CSS columns flow and break across pages. `column-span: all` lets
 *   a heading span the columns; `hyphens: auto` (needs `lang` on
 *   the html element) keeps narrow columns readable.
 * - Page breaks: `break-before: page` on an element that must start
 *   a new page (a chapter, an appendix). Add your own kept-together
 *   blocks (callouts, stat tiles, cards) to a `break-inside: avoid`
 *   rule, and keep each one shorter than a page.
 * - Extend `orphans: 3; widows: 3` to any custom text blocks you add
 *   (p and li are covered by default).
 * - Give long tables a <thead> — browsers repeat it on every printed
 *   page.
 * - No `position: fixed`/`sticky` and no viewport units in content:
 *   fixed elements stamp every printed page (running headers/footers go
 *   in the component's slots) and `100vh` mis-sizes at print.
 *
 * Author content as static HTML so the user can click-to-edit any text
 * directly. Do not set width/padding/background on the document body —
 * the component owns the sheet box.
 */
/* END USAGE */

(() => {
  const PAPER = {
    letter: ['8.5in', '11in'],
    a4: ['210mm', '297mm'],
    legal: ['8.5in', '14in']
  };
  const CSS_LENGTH = /^\d+(\.\d+)?(px|in|mm|cm|pt|pc)$/;
  // Unitless "0" is a valid CSS length and the natural way to write
  // margin="0"; normalise it to 0px so max()/calc() (which reject a bare
  // number) keep working.
  const safeLen = (v, fb) => {
    v = (v || '').trim();
    return v === '0' ? '0px' : CSS_LENGTH.test(v) ? v : fb;
  };
  // CSS length → px number (CSS absolute units are exact: 1in = 96px).
  // Returns NaN for anything safeLen would reject — callers gate on it.
  const PX_PER = {
    px: 1,
    in: 96,
    mm: 96 / 25.4,
    cm: 96 / 2.54,
    pt: 96 / 72,
    pc: 16
  };
  const toPx = v => {
    const m = /^(\d+(?:\.\d+)?)(px|in|mm|cm|pt|pc)$/.exec((v || '').trim());
    return m ? parseFloat(m[1]) * PX_PER[m[2]] : NaN;
  };
  const stylesheet = `
    :host {
      position: relative;
      display: block;
      /* When the viewport is narrower than the page, grow to wrap the
       * sheet (plus this padding) instead of staying viewport-width, so
       * the desk background and right margin reach the sheet's far edge
       * in the horizontal scroll. */
      min-width: max-content;
      min-height: 100vh;
      background: #ece8dd;
      padding: 48px 24px;
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif;
      --doc-page-w: 8.5in;
      --doc-page-h: 11in;
      --doc-page-margin: 0.75in;
      --doc-hdr-h: 0px;
      --doc-ftr-h: 0px;
      --doc-hdr-pad: 0px;
      --doc-ftr-pad: 0px;
    }
    .sheet {
      width: var(--doc-page-w);
      margin: 0 auto;
      background: #fff;
      box-shadow: 0 2px 14px rgba(20, 20, 19, 0.12);
      border-radius: 2px;
      box-sizing: border-box;
      padding: var(--doc-page-margin);
    }
    .frame { width: 100%; border-collapse: collapse; }
    /* Scaled-fit mode (content-width/content-height): the inner .fit box
     * lays the content out at its authored fixed size and scales it onto
     * the printable area; .fit-box reserves the scaled footprint in flow
     * (transforms don't affect layout) and centers it. Without the mode,
     * both divs are unstyled block pass-throughs. */
    .fit-mode .fit-box {
      width: calc(var(--doc-fit-w) * var(--doc-fit-scale));
      height: calc(var(--doc-fit-h) * var(--doc-fit-scale));
      margin: 0 auto;
      break-inside: avoid;
    }
    .fit-mode .fit {
      width: var(--doc-fit-w);
      height: var(--doc-fit-h);
      transform: scale(var(--doc-fit-scale));
      transform-origin: top left;
    }
    .frame td, .frame th { padding: 0; text-align: left; font-weight: inherit; }
    .hdr-space { height: var(--doc-hdr-h); }
    .ftr-space { height: var(--doc-ftr-h); }
    ::slotted([slot="header"]),
    ::slotted([slot="footer"]) { display: block; box-sizing: border-box; }
    @media print {
      :host { background: none; padding: 0; min-width: 0; min-height: 0; }
      .sheet {
        width: auto; margin: 0; box-shadow: none; border-radius: 0;
        padding: 0 var(--doc-page-margin);
      }
      /* The thead/tfoot spacers repeat on every page, so they carry the
       * vertical page margin (which the sheet's own padding cannot, since
       * that padding is consumed once on the first/last page). The running
       * header/footer are fixed inside that band. */
      /* The 0.35in is breathing room between a running header/footer and
       * the body; without one the spacer is exactly the page margin, so a
       * margin="0" full-bleed document gets truly full-bleed pages. */
      .hdr-space { height: max(var(--doc-page-margin), calc(var(--doc-hdr-h) + var(--doc-hdr-pad))); }
      .ftr-space { height: max(var(--doc-page-margin), calc(var(--doc-ftr-h) + var(--doc-ftr-pad))); }
      ::slotted([slot="header"]) {
        position: fixed; top: 0; left: 0; right: 0; margin: 0;
        padding: calc(var(--doc-page-margin) * 0.45) var(--doc-page-margin) 0;
      }
      ::slotted([slot="footer"]) {
        position: fixed; bottom: 0; left: 0; right: 0; margin: 0;
        padding: 0 var(--doc-page-margin) calc(var(--doc-page-margin) * 0.45);
      }
    }
  `;
  class DocPage extends HTMLElement {
    static get observedAttributes() {
      return ['size', 'width', 'height', 'margin', 'orientation', 'content-width', 'content-height'];
    }
    constructor() {
      super();
      this._root = this.attachShadow({
        mode: 'open'
      });
      this._mo = typeof MutationObserver === 'function' ? new MutationObserver(() => this._scheduleMeasure()) : null;
    }

    /** The named paper's [w, h], swapped when orientation="landscape".
     *  Only the named size swaps — explicit width/height are exact values
     *  the author already oriented. */
    _paperSize() {
      const named = PAPER[(this.getAttribute('size') || '').toLowerCase()] || PAPER.letter;
      const landscape = (this.getAttribute('orientation') || '').trim().toLowerCase() === 'landscape';
      return landscape ? [named[1], named[0]] : named;
    }
    get pageWidth() {
      return safeLen(this.getAttribute('width'), this._paperSize()[0]);
    }
    get pageHeight() {
      return safeLen(this.getAttribute('height'), this._paperSize()[1]);
    }
    get pageMargin() {
      return safeLen(this.getAttribute('margin'), '0.75in');
    }

    /** Scaled-fit mode's content box [w, h] as CSS lengths, or null when
     *  the mode is off (either attribute missing/invalid/zero — a partial
     *  declaration falls back to normal flow rather than guessing). */
    _contentFit() {
      const w = safeLen(this.getAttribute('content-width'), null);
      const h = safeLen(this.getAttribute('content-height'), null);
      if (!w || !h) return null;
      const wPx = toPx(w),
        hPx = toPx(h);
      return wPx > 0 && hPx > 0 ? [w, h, wPx, hPx] : null;
    }
    connectedCallback() {
      if (!this._sheet) this._render();
      this._syncSize();
      this._syncPrintPageRule();
      this._ensureTextWrapDefaults();
      this._ensureOwnsPrintMeta();
      this._syncFixedSizeMeta();
      if (this._mo) this._mo.observe(this, {
        subtree: true,
        childList: true,
        characterData: true,
        attributes: true
      });
      this._onResize = () => this._scheduleMeasure();
      window.addEventListener('resize', this._onResize);
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => this._scheduleMeasure());
      }
      this._scheduleMeasure();
    }
    disconnectedCallback() {
      window.removeEventListener('resize', this._onResize);
      if (this._mo) this._mo.disconnect();
      if (this._raf) {
        cancelAnimationFrame(this._raf);
        this._raf = null;
      }
      // Drop the head rules when the last doc-page leaves, so a deleted
      // document's @page geometry and text-wrap defaults can't apply to
      // whatever replaces it.
      const survivor = document.querySelector('doc-page');
      if (!survivor) {
        ['doc-page-print', 'doc-page-text-wrap', 'doc-page-owns-print', 'doc-page-fixed-size'].forEach(id => {
          const tag = document.getElementById(id);
          if (tag) tag.remove();
        });
      } else if (typeof survivor._syncFixedSizeMeta === 'function') {
        // A departed true-size owner hands the page-global preview meta
        // to whatever true-size page remains (or it's removed).
        survivor._syncFixedSizeMeta();
      }
    }
    attributeChangedCallback() {
      if (!this._sheet) return;
      this._syncSize();
      this._syncPrintPageRule();
      this._syncFixedSizeMeta();
      this._scheduleMeasure();
    }
    _render() {
      this._root.innerHTML = `
        <style>${stylesheet}</style>
        <style id="vars"></style>
        <div class="sheet" data-screen-label="Document">
          <table class="frame" role="presentation">
            <thead><tr><th><div class="hdr-space"><slot name="header"></slot></div></th></tr></thead>
            <tbody><tr><td class="body"><div class="fit-box"><div class="fit"><slot></slot></div></div></td></tr></tbody>
            <tfoot><tr><td><div class="ftr-space"><slot name="footer"></slot></div></td></tr></tfoot>
          </table>
        </div>`;
      this._sheet = this._root.querySelector('.sheet');
      this._vars = this._root.getElementById('vars');
    }

    /** Runtime sizing lives in a shadow <style> :host rule, never on the
     *  light-DOM host element, so serialize-persist can't write it back. */
    _syncSize(hdrH, ftrH) {
      // Scaled-fit mode: content at its authored size, scaled onto the
      // printable area (page minus margins on both axes). The factor is a
      // plain number var so calc(length * number) stays valid; 4 decimals
      // keeps the shadow style stable across re-measures. Upscaling is
      // allowed — print transforms are vector, so text and CSS stay crisp
      // (raster images soften, which the catalog bullet warns about).
      const fit = this._contentFit();
      let fitVars = '';
      if (fit) {
        const marginPx = toPx(this.pageMargin) || 0;
        const availW = toPx(this.pageWidth) - 2 * marginPx;
        const availH = toPx(this.pageHeight) - 2 * marginPx;
        const scale = Math.min(availW / fit[2], availH / fit[3]);
        if (scale > 0 && Number.isFinite(scale)) {
          fitVars = '--doc-fit-w:' + fit[0] + ';' + '--doc-fit-h:' + fit[1] + ';' + '--doc-fit-scale:' + scale.toFixed(4) + ';';
        }
      }
      this._sheet.classList.toggle('fit-mode', !!fitVars);
      this._vars.textContent = ':host{' + fitVars + '--doc-page-w:' + this.pageWidth + ';' + '--doc-page-h:' + this.pageHeight + ';' + '--doc-page-margin:' + this.pageMargin + ';' + '--doc-hdr-h:' + (hdrH || 0) + 'px;' + '--doc-ftr-h:' + (ftrH || 0) + 'px;' + '--doc-hdr-pad:' + (hdrH ? '0.35in' : '0px') + ';' + '--doc-ftr-pad:' + (ftrH ? '0.35in' : '0px') + '}';
    }

    /** @page is a no-op inside shadow DOM, so the rule lives in <head>.
     *  Re-appended on every sync so it stays last in source order — the
     *  @page cascade is source-order per descriptor, so this rule wins
     *  over any other @page rule in the document. */
    _syncPrintPageRule() {
      const id = 'doc-page-print';
      let tag = document.getElementById(id);
      if (!tag) {
        tag = document.createElement('style');
        tag.id = id;
      }
      document.head.appendChild(tag);
      tag.textContent = '@page { size: ' + this.pageWidth + ' ' + this.pageHeight + '; margin: 0; } ' + '@media print { html, body { margin: 0 !important; padding: 0 !important; background: none !important; height: auto !important; overflow: visible !important; } ' + 'h1,h2,h3,h4,h5,h6 { break-after: avoid; } ' + 'figure,pre,blockquote,img,svg,tr { break-inside: avoid; } ' + 'p,li { orphans: 3; widows: 3; } ' + '* { -webkit-print-color-adjust: exact; print-color-adjust: exact; } ' + '*, *::before, *::after { animation-delay: -99s !important; animation-duration: .001s !important; ' + 'animation-iteration-count: 1 !important; animation-fill-mode: both !important; ' + 'animation-play-state: running !important; transition-duration: 0s !important; } }';
    }

    /** Typographic defaults for document text: balance headings, avoid
     *  widowed/orphaned words in body copy (browsers without text-wrap
     *  support drop the declarations). Zero-specificity via :where() so
     *  any text-wrap authored on those elements wins; document-level so the
     *  rules reach the slotted (light DOM) content — shadow styles can't.
     *  data-omelette-injected marks the tag for the host editor to strip
     *  at serialize, so it is never written back as authored source. */
    _ensureTextWrapDefaults() {
      if (document.getElementById('doc-page-text-wrap')) return;
      const tag = document.createElement('style');
      tag.id = 'doc-page-text-wrap';
      tag.setAttribute('data-omelette-injected', '');
      tag.textContent = ':where(h1,h2,h3,h4,h5,h6){text-wrap:balance}' + ':where(p,li,blockquote,figcaption){text-wrap:pretty}';
      document.head.appendChild(tag);
    }

    /** Declares that this document owns its print CSS. The instant-PDF
     *  export checks for the meta by NAME PRESENCE alone (content is
     *  ignored) and skips its automatic print-CSS injections, so the
     *  component's @page geometry is never overridden by a heuristic.
     *  data-omelette-injected keeps it out of serialized source. */
    _ensureOwnsPrintMeta() {
      if (document.getElementById('doc-page-owns-print')) return;
      const tag = document.createElement('meta');
      tag.id = 'doc-page-owns-print';
      tag.name = 'omelette-owns-print';
      tag.content = 'true';
      tag.setAttribute('data-omelette-injected', '');
      document.head.appendChild(tag);
    }

    /** This page's valid true-size page box (explicit width AND height)
     *  as [w, h] px ints, or null when the mode is off. */
    _trueSizePx() {
      if (!safeLen(this.getAttribute('width'), null) || !safeLen(this.getAttribute('height'), null)) return null;
      const w = Math.round(toPx(this.pageWidth));
      const h = Math.round(toPx(this.pageHeight));
      return w > 0 && h > 0 ? [w, h] : null;
    }

    /** True-size pages (explicit width AND height) also declare the page
     *  box as the preview size: the in-app preview reads
     *  meta[name="omelette-fixed-size"] (content "W,H" in px ints) and
     *  scales the sheet into view — without it an 18in poster previews at
     *  true size with scrollbars. Never overrides an author-set meta
     *  (only the component's own id is managed). The meta is page-global
     *  while doc-page instances are not, so every sync recomputes the
     *  page-wide owner — the first connected true-size doc-page — and a
     *  non-true-size sibling's sync can never delete the owner's meta.
     *  Removed when no true-size page remains (the owner's disconnect
     *  re-syncs via any survivor) or when an author-set meta exists. */
    _syncFixedSizeMeta() {
      const id = 'doc-page-fixed-size';
      const own = document.getElementById(id);
      const authored = document.querySelector('meta[name="omelette-fixed-size"]:not([data-omelette-injected])');
      // The page-wide owner, not this instance: an upgraded true-size page
      // anywhere in the document keeps the meta alive and sized.
      let box = null;
      for (const el of document.querySelectorAll('doc-page')) {
        box = typeof el._trueSizePx === 'function' ? el._trueSizePx() : null;
        if (box) break;
      }
      if (!box || authored) {
        if (own) own.remove();
        return;
      }
      const tag = own || document.createElement('meta');
      tag.id = id;
      tag.name = 'omelette-fixed-size';
      tag.content = box[0] + ',' + box[1];
      tag.setAttribute('data-omelette-injected', '');
      if (!own) document.head.appendChild(tag);
    }
    _scheduleMeasure() {
      if (this._raf) return;
      this._raf = requestAnimationFrame(() => {
        this._raf = null;
        this._measure();
      });
    }

    /** Slot heights feed the print spacers (--doc-hdr-h / --doc-ftr-h), so
     *  they re-measure on content mutation, resize, and font load. */
    _measure() {
      const hdr = this.querySelector(':scope > [slot="header"]');
      const ftr = this.querySelector(':scope > [slot="footer"]');
      this._syncSize(hdr ? hdr.offsetHeight : 0, ftr ? ftr.offsetHeight : 0);
    }
  }
  if (!customElements.get('doc-page')) {
    customElements.define('doc-page', DocPage);
  }
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "explorations/doc-page.js", error: String((e && e.message) || e) }); }

// ui_kits/revista/pilot-app.js
try { (() => {
/* ================= catálogo de revistas prototipadas ================= */
const MAGS = [{
  id: 'n2',
  file: 'Revista EDEM N2.html',
  print: 'Revista EDEM N2.html',
  nr: 'Nº 2 · 2026',
  title: 'Tracción',
  chip: 'Nº 2 · Tracción',
  badge: 'Última edición',
  badgeBg: 'var(--coral)',
  desc: 'Crónica del Hackathon, entrevista cruzada alumno × CEO, radar Lanzadera, métricas de Angels y pasatiempos.',
  meta: '24 páginas · Bodoni Black · 2026'
}, {
  id: 'n1v2',
  file: 'Revista EDEM N1 v2.html',
  print: 'Revista EDEM N1 v2-print.html',
  nr: 'Nº 1 · v2',
  title: 'Bienvenidos a EDEM',
  chip: 'Nº 1 · v2',
  badge: 'Contracorriente',
  badgeBg: 'var(--teal)',
  desc: 'La dirección de arte definitiva del Nº 1: tipografía brutal, sellos, radar Lanzadera y duotonos.',
  meta: '10 páginas · dirección de arte v2'
}, {
  id: 'n1',
  file: 'Revista EDEM N1.html',
  print: 'Revista EDEM N1-print.html',
  nr: 'Nº 1',
  title: 'Bienvenidos a EDEM',
  chip: 'Nº 1 · maqueta',
  badge: 'Primera maqueta',
  badgeBg: 'var(--indigo)',
  desc: 'La primera maqueta del piloto: el manual de supervivencia en la Marina, de portada a contraportada.',
  meta: '10 páginas · maqueta inicial'
}];
const ART = [{
  bg: 'var(--teal)',
  cat: 'Pasillo EDEM',
  title: 'El Hackathon desde dentro: 48 horas a toda máquina',
  ex: 'Crónica en primera persona del fin de semana en el que 120 alumnos convirtieron café y post-its en cinco empresas reales.',
  pg: 4,
  img: 'https://edem.eu/wp-content/uploads/2026/04/EDEM_Home_Perfil_EE.jpg'
}, {
  bg: 'var(--coral)',
  cat: 'Radar Lanzadera',
  title: '3 startups de Lanzadera rompiendo moldes',
  ex: 'Del muelle al mercado global: las apuestas del último cohorte que ya mueven el Mediterráneo.',
  pg: 12,
  img: 'https://edem.eu/wp-content/uploads/2026/04/EDEM_Home_intro_grados.jpg'
}, {
  bg: 'var(--indigo)',
  cat: 'Angels',
  title: 'Los secretos de Angels para medir el éxito',
  ex: 'Las métricas que un inversor mira antes que cualquier promesa — y las que ignora por completo.',
  pg: 14,
  img: 'https://edem.eu/wp-content/uploads/2026/04/EDEM_Home_talento.jpg'
}];
const RES = window.__resources || {};
const SWAPS = {
  '../../assets/edem-logo-white.png': 'logoW',
  '../../assets/edem-logo.png': 'logoD'
};
function sw(x) {
  for (const u in SWAPS) {
    if (RES[SWAPS[u]]) x = x.split(u).join(RES[SWAPS[u]]);
  }
  return x;
}
/* ================= carga y troceado de cada revista real ================= */
async function loadIssue(m) {
  if (m.data) return m.data;
  if (m.loading) return m.loading;
  m.loading = (async () => {
    const txt = await (await fetch(RES['mag_' + m.id] || encodeURI(m.file))).text();
    const doc = new DOMParser().parseFromString(txt, 'text/html');
    const links = [...document.head.querySelectorAll('style,link[rel="stylesheet"]')].map(n => n.outerHTML).join('');
    const styles = [...doc.querySelectorAll('head style')].map(s => s.outerHTML).join('');
    const secs = [...doc.querySelectorAll('section.page')];
    const pages = secs.map(s => sw(s.outerHTML));
    const labels = secs.map((s, i) => (s.dataset.screenLabel || 'Página ' + (i + 1)).replace(/^\d+\s*/, ''));
    const head = links + styles + '<style>html,body{margin:0!important;padding:0!important;background:#fff!important;overflow:hidden!important}section.page{box-shadow:none!important}</style>';
    m.data = {
      pages,
      labels,
      head,
      n: pages.length
    };
    const imgs = [...new Set((pages.join('').match(/src="([^"]+)"/g) || []).map(x => x.slice(5, -1)))];
    imgs.forEach(u => {
      const im = new Image();
      im.src = u;
    });
    return m.data;
  })();
  return m.loading;
}
function pageDoc(m, i) {
  return '<!DOCTYPE html><html><head>' + m.data.head + '</head><body>' + m.data.pages[i] + '</body></html>';
}
function mkPage(m, i) {
  const w = document.createElement('div');
  w.className = 'pg';
  if (i == null) {
    w.classList.add('void');
    return {
      el: w,
      ready: Promise.resolve()
    };
  }
  const f = document.createElement('iframe');
  f.setAttribute('tabindex', '-1');
  f.setAttribute('aria-hidden', 'true');
  f.setAttribute('scrolling', 'no');
  f.title = 'Página ' + (i + 1);
  const ready = new Promise(res => {
    let done = false;
    const ok = () => {
      if (!done) {
        done = true;
        res();
      }
    };
    f.addEventListener('load', () => {
      try {
        f.contentDocument.fonts.ready.then(ok);
      } catch (e) {
        ok();
      }
      setTimeout(ok, 380);
    });
    setTimeout(ok, 1600);
  });
  f.srcdoc = pageDoc(m, i);
  w.appendChild(f);
  return {
    el: w,
    ready
  };
}

/* ================= portadas vivas en home y kiosko ================= */
const slotRO = new ResizeObserver(es => es.forEach(e => fitSlot(e.target)));
function fitSlot(sl) {
  const pg = sl.querySelector('.pg');
  if (pg) pg.style.transform = 'scale(' + sl.clientWidth / 794 + ')';
}
async function mountCovers() {
  for (const m of MAGS) {
    try {
      await loadIssue(m);
      document.querySelectorAll('.coverslot[data-mag="' + m.id + '"]').forEach(sl => {
        sl.replaceChildren(mkPage(m, 0).el);
        fitSlot(sl);
        slotRO.observe(sl);
      });
    } catch (e) {
      console.warn('No se pudo cargar', m.file, e);
    }
  }
}

/* ================= home: kiosko + artículos ================= */
document.getElementById('kgrid').innerHTML = MAGS.map(m => '<article class="kcard">' + '<div class="kcv"><span class="kbadge" style="background:' + m.badgeBg + '">' + m.badge + '</span>' + '<div class="coverslot" data-mag="' + m.id + '" onclick="openVisor(\'' + m.id + '\')" title="Leer en el visor"><span class="cslabel">portada ' + m.nr + '</span></div></div>' + '<div class="kbody"><span class="nr">' + m.nr + '</span><h3 class="disp">' + m.title + '</h3><p>' + m.desc + '</p><span class="kmeta">' + m.meta + '</span>' + '<div class="kacts"><button class="btn pri" onclick="openVisor(\'' + m.id + '\')"><i data-lucide="book-open" class="lu"></i> Leer</button></div></div></article>').join('');
document.getElementById('agrid').innerHTML = sw(ART.map(a => '<article class="acard" onclick="openVisor(\'n2\',' + (a.pg - 1) + ')">' + '<div class="im"><img src="' + a.img + '" onerror="this.style.opacity=0" alt=""></div>' + '<div class="abody"><span class="abadge" style="background:' + a.bg + '">' + a.cat + '</span>' + '<h3 class="disp">' + a.title + '</h3><p>' + a.ex + '</p>' + '<div class="afoot"><span class="go">Leer en el visor <i data-lucide="arrow-right" class="lu" style="width:15px;height:15px"></i></span><span class="pnum">pág. ' + String(a.pg).padStart(2, '0') + '</span></div></div></article>').join(''));
function subscribe(e) {
  e.preventDefault();
  document.getElementById('sub-msg').textContent = '¡Bienvenido a bordo! Revisa tu correo ⚓';
  e.target.reset();
  return false;
}

/* ================= visor flipbook ================= */
const visor = document.getElementById('visor'),
  stage = document.getElementById('v-stage'),
  bookouter = document.getElementById('bookouter'),
  book = document.getElementById('book');
const halfL = document.getElementById('half-l'),
  halfR = document.getElementById('half-r'),
  host = document.getElementById('host'),
  spine = document.getElementById('spine');
let M = null,
  SP = [],
  cur = 0,
  animating = false,
  scale = 1;
function spreadsOf(n) {
  const a = [[null, 0]];
  for (let p = 1; p < n; p += 2) a.push([p, p + 1 < n ? p + 1 : null]);
  return a;
}
function spreadOf(i) {
  return i <= 0 ? 0 : Math.floor((i + 1) / 2);
}
function setHalf(half, item) {
  half.replaceChildren(item.el);
  half.classList.toggle('void', item.el.classList.contains('void'));
}
function curOffset() {
  if (!SP.length) return 0;
  const [l, r] = SP[cur];
  return l == null ? -397 : r == null ? 397 : 0;
}
function fitBook() {
  const r = stage.getBoundingClientRect();
  scale = Math.min((r.width - 150) / 1588, (r.height - 40) / 1123, 1);
  bookouter.style.width = 1588 * scale + 'px';
  bookouter.style.height = 1123 * scale + 'px';
  book.style.transform = 'scale(' + scale + ') translateX(' + curOffset() + 'px)';
}
function updateChrome() {
  const n = M.data.n,
    [l, r] = SP[cur];
  document.getElementById('v-ind').textContent = cur === 0 ? 'Portada · ' + n + ' págs' : r == null ? 'Contraportada' : 'Págs. ' + (l + 1) + '–' + (r + 1) + ' de ' + n;
  document.getElementById('v-prev').disabled = cur === 0 || animating;
  document.getElementById('v-next').disabled = cur === SP.length - 1 || animating;
  document.getElementById('v-dots').innerHTML = SP.map((_, i) => '<button class="vdot' + (i === cur ? ' on' : '') + '" aria-label="Ir al pliego ' + (i + 1) + '" onclick="jump(' + i + ')"></button>').join('');
  const sel = document.getElementById('v-goto');
  sel.value = String(l == null ? r : l);
  fitBook();
}
function render() {
  const [l, r] = SP[cur];
  setHalf(halfL, mkPage(M, l));
  setHalf(halfR, mkPage(M, r));
  spine.classList.toggle('off', l == null || r == null);
  host.replaceChildren();
  updateChrome();
}
function jump(s) {
  if (animating || s === cur || !M) return;
  cur = s;
  render();
}
async function turn(dir) {
  if (animating || !M) return;
  const t = cur + dir;
  if (t < 0 || t >= SP.length) return;
  animating = true;
  updateChrome();
  const fw = dir > 0,
    [cl, cr] = SP[cur],
    [tl, tr] = SP[t];
  const under = mkPage(M, fw ? tr : tl);
  setHalf(fw ? halfR : halfL, under);
  const front = mkPage(M, fw ? cr : cl),
    back = mkPage(M, fw ? tl : tr);
  const leaf = document.createElement('div');
  leaf.className = 'leaf';
  leaf.style.cssText = (fw ? 'right:0;' : 'left:0;') + 'transform-origin:' + (fw ? 'left' : 'right') + ' center;transform:rotateY(0deg);';
  const f1 = document.createElement('div');
  f1.className = 'face';
  f1.appendChild(front.el);
  f1.insertAdjacentHTML('beforeend', '<div class="shade"></div>');
  const f2 = document.createElement('div');
  f2.className = 'face back';
  f2.appendChild(back.el);
  f2.insertAdjacentHTML('beforeend', '<div class="shade"></div>');
  leaf.append(f1, f2);
  host.appendChild(leaf);
  spine.classList.toggle('off', tl == null || tr == null);
  await Promise.all([under.ready, front.ready, back.ready]);
  cur = t;
  fitBook();
  requestAnimationFrame(() => requestAnimationFrame(() => {
    leaf.style.transform = 'rotateY(' + (fw ? -180 : 180) + 'deg)';
  }));
  await new Promise(res => setTimeout(res, 850));
  const land = mkPage(M, fw ? tl : tr);
  setHalf(fw ? halfL : halfR, land);
  await land.ready;
  host.replaceChildren();
  animating = false;
  updateChrome();
}
async function setIssue(id, pageIdx) {
  const m = MAGS.find(x => x.id === id);
  if (!m) return;
  document.querySelectorAll('.vchip').forEach(c => c.classList.toggle('on', c.dataset.id === id));
  const load = document.getElementById('v-load');
  if (!m.data) {
    load.hidden = false;
  }
  try {
    await loadIssue(m);
  } catch (e) {
    load.hidden = true;
    document.getElementById('v-ind').textContent = 'No se pudo cargar la edición';
    return;
  }
  load.hidden = true;
  M = m;
  SP = spreadsOf(m.data.n);
  cur = spreadOf(Math.min(pageIdx, m.data.n - 1));
  const sel = document.getElementById('v-goto');
  sel.innerHTML = m.data.labels.map((lb, i) => '<option value="' + i + '">' + String(i + 1).padStart(2, '0') + ' · ' + lb + '</option>').join('');
  render();
}
function openVisor(id, pageIdx = 0) {
  visor.hidden = false;
  document.body.classList.add('lock');
  setIssue(id, pageIdx);
  lucide.createIcons();
  requestAnimationFrame(fitBook);
}
function closeVisor() {
  visor.hidden = true;
  document.body.classList.remove('lock');
}
document.getElementById('v-issues').innerHTML = MAGS.map(m => '<button class="vchip" data-id="' + m.id + '" onclick="setIssue(\'' + m.id + '\',0)">' + m.chip + '</button>').join('');
document.getElementById('v-next').addEventListener('click', () => turn(1));
document.getElementById('v-prev').addEventListener('click', () => turn(-1));
document.getElementById('v-goto').addEventListener('change', e => jump(spreadOf(+e.target.value)));
halfR.addEventListener('click', () => turn(1));
halfL.addEventListener('click', () => turn(-1));
document.addEventListener('keydown', e => {
  if (visor.hidden) return;
  if (e.key === 'ArrowRight') turn(1);else if (e.key === 'ArrowLeft') turn(-1);else if (e.key === 'Escape') closeVisor();
});
new ResizeObserver(fitBook).observe(stage);
window.addEventListener('resize', fitBook);
lucide.createIcons();
mountCovers();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/revista/pilot-app.js", error: String((e && e.message) || e) }); }

__ds_ns.ArticleCard = __ds_scope.ArticleCard;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

})();
