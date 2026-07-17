# EDEM Times — Design System

Sistema de diseño e identidad visual para **EDEM Times**, la revista de EDEM Escuela de Empresarios, dentro del ecosistema **Marina de Empresas** (junto a Lanzadera y Angels). EDEM Times tiene edición física en papel; la web replica la experiencia de lectura de un PDF maquetado.

## Contexto de la marca
- **EDEM Escuela de Empresarios** — escuela de negocios y management en Valencia (fundada 2002). Grados, Másteres, Formación Executive y Alta Dirección. Lema operativo: *"empresarios formando a empresarios"*, *"se aprende haciendo"*.
- **Marina de Empresas** — polo de emprendimiento de Juan Roig en la Marina de València. Tres iniciativas: **EDEM** (formación), **Lanzadera** (aceleradora/incubadora), **Angels** (inversión).
- Campaña de marca actual: *"Unpopular Opinion: EDEM — La opción difícil"*. Boletín: **BOGA**, "el mail que rema a contracorriente" (metáfora náutica recurrente — ancla, remo, puerto).

## Fuentes consultadas
- Sitio oficial: `https://edem.eu/` (home, textos, imágenes de campaña 2026).
- **Logo oficial**: aportado por el usuario como PNG (`uploads/pasted-1784139471676-0.png`). Color primario **#008AAD** extraído pixel-exact del wordmark con muestreo de canvas.
- Ecosistema: `marinadeempresas.es`, `lanzadera.es`, `angelscapital.es`.
- No se localizó un manual de identidad corporativa público de EDEM. El CSS/tipografías reales del sitio no eran recuperables con las herramientas de navegación (devuelven markdown sin estilos).

## CONTENT FUNDAMENTALS — cómo se escribe
- **Tono**: directo, retador, con orgullo del esfuerzo. "La opción difícil", "No es para todos", "complicarse la vida y demostrarlo con hechos". Nada blando ni corporativo-genérico.
- **Persona**: tutea al lector ("tú", "elegir EDEM es elegir…"). Cercano pero exigente.
- **Casing**: titulares en may/min normal con tipografía serif display; overlines en MAYÚSCULAS con tracking amplio (`Número 1 · Marina de Empresas`). Nombres de sección tipo "Radar Lanzadera", "Pasillo EDEM".
- **Metáforas náuticas**: remar, contracorriente, puerto, ancla, marina, "a bordo". Úsalas con moderación, dan carácter.
- **Cifras con orgullo**: "+2.100 alumnos insertados", "+1,5M€ en becas". Datos concretos, nunca vagos.
- **Emoji**: no en superficie de producto. Un guiño puntual (⚓) sólo en microcopy informal (confirmaciones). Por defecto, sin emoji.
- **Vibe**: revista editorial premium + escuela de negocios ambiciosa. Serio pero con nervio.

## VISUAL FOUNDATIONS
- **Color**: primario **teal / petróleo #008AAD** (real, del logo). Escala completa 50→900 en `tokens/colors.css`. Neutrales "petrol ink" (slate frío con tinte teal) para texto. Fondo **paper** #FBFAF6 (off-white cálido, stock de revista). Máx. 1–2 fondos por pieza (paper y petról oscuro para modo lectura).
- **Acentos de ecosistema**: EDEM teal (real); **Lanzadera** coral `#E8502D` y **Angels** índigo `#3B3A7A` son **PLACEHOLDERS** — pendientes de los hex oficiales. Se usan como badges de categoría color-codificados.
- **Tipografía**: **Bodoni Moda** para display/titulares — **estándar aprobado: peso 900 "Black" con `font-optical-sizing:none` + `'opsz' 14`** (engorda los trazos finos; nunca titulares finos); **Archivo** (grotesca limpia) para cuerpo y UI. Ambas son **sustitutas de Google Fonts** — ver Caveats.
- **Layout**: rejilla centrada máx. 1200px. Hero asimétrico (texto/imagen 6+6). Rejilla de artículos a 3 columnas. Generoso espacio en blanco editorial.
- **Esquinas**: contenidas — `radius-sm` (4px) en botones, `radius-lg` (14px) en tarjetas. Badges tipo pill (`radius-pill`). Nada excesivamente redondeado.
- **Sombras**: suaves y con tinte frío (`--shadow-sm/md/lg`); `--shadow-book` pronunciada para el efecto de revista abierta.
- **Tarjetas**: fondo blanco, borde hairline `--border-hair`, esquina `radius-lg`, sombra sutil que se eleva en hover (`translateY(-6px)` + `shadow-lg`), imagen con zoom suave.
- **Hover**: color más oscuro (teal 500→600), fondo tint suave en outline/ghost, elevación en tarjetas, gap creciente en enlaces con flecha. **Press**: `translateY(1px)`.
- **Animación**: transiciones 150–300ms con `cubic-bezier(.4,0,.2,1)`; entradas con fade+rise. Flipbook: rotación 3D `rotateY` 820ms para el paso de página, con sombra de pliegue.
- **Imágenes**: fotografía real de campus/personas, cálida y documental. Overlays de gradiente petról para texto sobre foto.

## ICONOGRAPHY
- **Lucide Icons** (vía CDN) — línea, stroke medio, redondeado. Es una **sustitución razonada**: no se identificó un set de iconos propietario de EDEM. Iconos usados: `anchor`, `book-open`, `arrow-right`, `chevron-left/right`, `book-marked`, `quote`, `linkedin`, `instagram`, `youtube`.
- **Sin emoji** en producto. El motivo náutico (ancla ⚓) aparece como icono Lucide, no como emoji, salvo microcopy informal.
- **Logo**: `assets/edem-logo.png` (teal, recortado del original) y `assets/edem-logo-white.png` (versión blanca generada para fondos oscuros). No se ha redibujado ningún mark: ambos derivan del PNG oficial aportado.

## Components (índice)
Ubicados en `components/core/` — importar vía `window.EDEMRevistaDesignSystem_7d0987`:
- **Button** — botón principal editorial. Variantes primary / secondary / outline / ghost; tamaños sm/md/lg; estados hover/press/disabled; iconos.
- **Badge** — badge de categoría/ecosistema (EDEM · Lanzadera · Angels · neutral · teal), solid u outline.
- **ArticleCard** — tarjeta de artículo de la rejilla de la revista (imagen, badge, título serif, extracto, meta). Compone `Badge`.

## Índice del proyecto (manifiesto)
- `styles.css` — punto de entrada global (sólo `@import`).
- `tokens/colors.css` · `tokens/typography.css` · `tokens/spacing.css` — tokens.
- `components/core/` — Button, Badge, ArticleCard (`.jsx` + `.d.ts` + `.prompt.md` + `core.card.html`).
- `guidelines/*.card.html` — specimen cards (Colors, Type, Brand) para la pestaña Design System.
- `ui_kits/revista/index.html` — **prototipo estrella**: single-page con 3 vistas conmutables (Design System · Home · Simulador de Lectura/flipbook). Tailwind + JS nativo + Lucide.
- `assets/` — logo EDEM (teal + blanco).
- `thumbnail.html` — tile del sistema. `SKILL.md` — envoltorio Agent Skill.

## CAVEATS / sustituciones a confirmar
1. **Tipografías**: Bodoni Moda + Archivo son sustitutas de Google Fonts elegidas para casar con el wordmark; **no** son las fuentes licenciadas reales de EDEM. Enviar los archivos de fuente oficiales para reemplazarlas.
2. **Colores Lanzadera/Angels**: placeholders (`#E8502D`, `#3B3A7A`). Confirmar los hex oficiales de cada marca del ecosistema.
3. **Iconos**: Lucide como sustituto (no hay set propietario identificado).
4. **Imágenes**: el prototipo enlaza fotos reales de `edem.eu` de forma remota (con fallback teal si el hotlink se bloquea). Para producción, sustituir por imágenes alojadas/licenciadas.
5. Sólo el **primario #008AAD** está verificado como oficial; el resto de la escala y neutrales se derivaron armónicamente de ese color.
