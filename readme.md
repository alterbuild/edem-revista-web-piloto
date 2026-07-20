# EDEM Times — web oficial

Sitio estático de **EDEM Times**, la revista de EDEM Escuela de Empresarios (Marina de Empresas). Construido con el design system «EDEM Revista»: sin frameworks, sin build — listo para subir a cualquier hosting.

## Estructura

```
edem-times-web/
├── index.html            Home: hero, kiosko, artículos, ecosistema, suscripción
├── css/
│   ├── tokens.css        Tokens del design system (color, tipografía, espaciado)
│   └── site.css          Estilos del sitio (usa los tokens)
├── js/app.js             Toda la lógica: render de la home, visor flipbook, formulario
├── data/content.json     ★ EL CONTENIDO — ediciones, artículos, ecosistema, enlaces
├── revistas/             Las revistas maquetadas (una página HTML por número + versión A4)
└── assets/               Logos, favicon e imágenes (assets/img/)
```

## Publicar

Sube la carpeta `edem-times-web/` tal cual a cualquier hosting estático (Netlify, Vercel, GitHub Pages, un Apache/Nginx…). No hay build ni dependencias de servidor. **Debe servirse por HTTP** (el visor carga las revistas con `fetch`); abrir `index.html` con doble clic muestra la home pero no las portadas vivas ni el visor.

Prueba local: `python3 -m http.server 8000` dentro de la carpeta y abre `http://localhost:8000`.

## Actualizar contenido (sin tocar código)

Todo el contenido de la home vive en **`data/content.json`**:

- **Publicar un nuevo número**: añade la revista a `revistas/` (misma estructura: `<section class="page">` por página), añade su entrada en `issues` y apunta `site.latest` a su `id`. El hero, el kiosko, el visor y el pie se actualizan solos.
- **Artículos destacados**: edita `articles` (categoría, color, titular, extracto, página del visor e imagen).
- **Ecosistema (La Marina)**: edita `ecosystem` — cada iniciativa lleva verbo, descripción, foto (`img` + `alt`) y su línea de enlace con la revista (`meta`).
- Colores admitidos en los campos `color`/`badgeColor`: `edem`, `lanzadera`, `angels`, `neutral`.

### Conectar un CMS

`app.js` solo necesita que `data/content.json` exista con ese esquema. Cualquier CMS headless (Strapi, Contentful, Sanity, WordPress + plugin REST…) puede generar ese JSON en el deploy, o puedes cambiar la URL del fetch en `boot()` (js/app.js) para leerlo directamente de la API del CMS. Si el JSON no carga, la web usa el catálogo embebido `DEFAULTS` de `app.js` como respaldo.

### Suscripción a las novedades

Por defecto el formulario funciona en modo demo (valida el email y muestra confirmación). Para suscripciones reales, pon la URL de tu servicio en `newsletter.endpoint` del JSON: recibirá un `POST` con `{"email": "...", "list": "edem-times"}`. Sirve cualquier endpoint de Mailchimp/Brevo/API propia que acepte JSON.

## Notas de marca (heredadas del design system)

- Primario **#008AAD** extraído del logotipo oficial. Los acentos de **Lanzadera** (`#E8502D`) y **Angels** (`#3B3A7A`) son placeholders pendientes de confirmar con cada marca.
- Tipografías **Bodoni Moda** (display) y **Archivo** (cuerpo) vía Google Fonts — sustitutas hasta disponer de las fuentes licenciadas de EDEM.
- El sistema de diseño completo es consultable en la propia web: pie de página → «Sistema de diseño».
