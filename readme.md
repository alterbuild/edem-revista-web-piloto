# EDEM Times — web oficial

Sitio estático de **EDEM Times**, la revista de EDEM Escuela de Empresarios (Marina de Empresas). Construido con el design system «EDEM Revista»: sin frameworks, sin build — listo para subir a cualquier hosting.

## Estructura

```
edem-times-web/
├── index.html            Home: hero, kiosko, actualidad, conócenos, ecosistema, suscripción
├── noticias.html         Portal de noticias: portada, lo último y flujo filtrable por sección
├── noticia.html          Ficha de una noticia — se abre como noticia.html?a=<id>
├── css/
│   ├── tokens.css        Tokens del design system (color, tipografía, espaciado)
│   ├── site.css          Estilos del sitio (usa los tokens)
│   └── news.css          Estilos del portal, de la ficha y del bloque «Actualidad»
├── js/
│   ├── app.js            Home: hero, kiosko, conócenos, ecosistema y visor flipbook
│   ├── cms.js            ★ ORIGEN DE DATOS de las noticias: JSON local o CMS headless
│   ├── news.js           Render del portal, de la ficha y del bloque de la home
│   ├── chrome.js         Cabecera, menú y formulario en las páginas de noticias
│   └── icons.js          Los iconos de Lucide que usa la web (shim local)
├── data/
│   ├── content.json      ★ CONTENIDO DE LA HOME — ediciones, ecosistema, enlaces
│   └── noticias.json     ★ CONTENIDO DEL PORTAL — secciones, noticias y config del CMS
├── revistas/             Las revistas maquetadas (una página HTML por número + versión A4)
└── assets/               Logos, favicon e imágenes (assets/img/)
```

**Dos ritmos, dos contenidos.** La revista es mensual y vive en `revistas/` + `content.json`;
el portal de noticias es continuo y vive entero en `noticias.json`. Se cruzan en dos sitios:
el bloque «Actualidad» de la home (las cuatro últimas noticias) y el campo `revista` de cada
noticia, que abre la página exacta del visor con `index.html?visor=<edición>&pag=<página>`.

## Publicar

Sube la carpeta `edem-times-web/` tal cual a cualquier hosting estático (Netlify, Vercel, GitHub Pages, un Apache/Nginx…). No hay build ni dependencias de servidor. **Debe servirse por HTTP** (el visor carga las revistas con `fetch`); abrir `index.html` con doble clic muestra la home pero no las portadas vivas ni el visor.

Prueba local: `python3 -m http.server 8000` dentro de la carpeta y abre `http://localhost:8000`.

## Actualizar contenido (sin tocar código)

Todo el contenido de la home vive en **`data/content.json`**:

- **Publicar un nuevo número**: añade la revista a `revistas/` (misma estructura: `<section class="page">` por página), añade su entrada en `issues` y apunta `site.latest` a su `id`. El hero, el kiosko, el visor y el pie se actualizan solos.
- **Ecosistema (La Marina)**: edita `ecosystem` — cada iniciativa lleva verbo, descripción, foto (`img` + `alt`) y su línea de enlace con la revista (`meta`).
- Colores admitidos en los campos `color`/`badgeColor`: `edem`, `lanzadera`, `angels`, `neutral`.

## Publicar una noticia

Todo el portal sale de **`data/noticias.json`**. Publicar es añadir un objeto a `noticias`:
no hay que crear ningún HTML ni tocar código. La ficha se sirve sola en
`noticia.html?a=<id>` y la noticia aparece en la portada, en «Lo último», en su sección y
—si le pones `portada`— en la home.

```json
{
  "id": "hackathon-2026-cierre",     // identificador de la URL (minúsculas y guiones)
  "seccion": "campus",               // id de una de las `secciones`
  "portada": 1,                      // 1 = apertura · 2 y 3 = destacadas · sin campo = flujo
  "titulo": "…",
  "entradilla": "…",
  "fecha": "2026-07-22",             // ISO; ordena el portal de más nueva a más vieja
  "autor": "Marta Gil",
  "autorRol": "Redacción · 2º de GDE",
  "lectura": 6,                      // minutos; si falta, se calcula por palabras
  "img": "assets/img/perfil-ee.jpg",
  "alt": "…", "pie": "…",
  "etiquetas": ["Hackathon"],
  "revista": { "issue": "n2", "page": 4, "texto": "…" },   // opcional: enlaza al visor
  "cuerpo": [ { "tipo": "p", "texto": "…" } ]
}
```

Bloques admitidos en `cuerpo`: `p` (párrafo), `h2` y `h3` (ladillos), `cita`
(`{texto, autor}`), `lista` (`{items:[…]}`), `img` (`{src, alt, pie}`), `destacado`
(frase suelta) y `dato` (`{cifra, texto}`). El primer párrafo se compone con capitular.

> Las 13 noticias que trae el archivo son **contenido de ejemplo** —textos, autores y
> declaraciones inventados— para ver el diseño con material realista. Sustitúyelas por las
> reales antes de publicar.

## Conectar un CMS headless

El portal está preparado para dejar de leer el JSON y leer de una API sin tocar plantillas.
Toda la fontanería está en **`js/cms.js`**, que normaliza lo que llegue al mismo modelo que
usa el render. Se activa desde el bloque `cms` de `data/noticias.json`:

```json
"cms": {
  "activo": true,
  "tipo": "strapi",                  // strapi · wordpress · contentful · hygraph · generico
  "endpoint": "https://cms.edem.es/api/noticias?populate=*&sort=fecha:desc",
  "endpointNoticia": "https://cms.edem.es/api/noticias?filters[slug][$eq]={id}&populate=*",
  "endpointSecciones": "https://cms.edem.es/api/secciones",
  "headers": { "Authorization": "Bearer <token público de solo lectura>" },
  "cacheSegundos": 300,
  "mapeo": { "titulo": "attributes.headline" }
}
```

- **`tipo`** carga un preajuste de mapeo (dónde está la lista y cómo se llama cada campo en
  esa API). **`mapeo`** sobrescribe campo a campo lo que haga falta; acepta rutas con punto
  (`attributes.imagen.data.attributes.url`) y varias alternativas separadas por `|`.
- El **cuerpo** se normaliza venga como venga: bloques propios, rich text de Strapi/Hygraph,
  HTML de WordPress o texto plano. El HTML se convierte a bloques con lista blanca de
  etiquetas, así que nada de lo que se pegue en el editor se inyecta tal cual en la página.
- **Si la API falla, la web no se queda en blanco**: cae automáticamente al contenido local
  de `noticias.json` y lo avisa por consola.
- `headers` viaja al navegador: pon ahí solo tokens públicos de lectura, nunca claves
  privadas. Si el CMS no permite CORS o exige clave privada, la alternativa limpia es que el
  build regenere `data/noticias.json` con este mismo esquema y dejar `cms.activo` en `false`.

La home (`content.json`) sigue el mismo principio: `app.js` solo necesita ese JSON, así que
cualquier CMS puede generarlo en el deploy. Si no carga, se usa el catálogo embebido
`DEFAULTS` de `app.js`.

### Suscripción a las novedades

Por defecto el formulario funciona en modo demo (valida el email y muestra confirmación). Para suscripciones reales, pon la URL de tu servicio en `newsletter.endpoint` del JSON: recibirá un `POST` con `{"email": "...", "list": "edem-times"}`. Sirve cualquier endpoint de Mailchimp/Brevo/API propia que acepte JSON.

## Notas de marca (heredadas del design system)

- Primario **#008AAD** extraído del logotipo oficial. Los acentos de **Lanzadera** (`#E8502D`) y **Angels** (`#3B3A7A`) son placeholders pendientes de confirmar con cada marca.
- Tipografías **Bodoni Moda** (display) y **Archivo** (cuerpo) vía Google Fonts — sustitutas hasta disponer de las fuentes licenciadas de EDEM.
- El sistema de diseño completo es consultable en la propia web: pie de página → «Sistema de diseño».
