# MecaTron - Guia Rapida de Arquitectura Frontend

## Objetivo

Landing estatica en espanol para promocionar el sistema MecaTron.

El proyecto esta pensado para:

- Cargar rapido sin build step.
- Mantener estilos y comportamiento en 3 archivos simples.
- Ser facil de extender por personas y por agentes IA.

## Estructura del proyecto

- `index.html`: estructura semantica de la pagina y anclas de navegacion.
- `assets/css/style.css`: tokens visuales, layout, componentes y breakpoints.
- `assets/js/main.js`: interacciones UI (header responsive, boton top, contador, contactos).

## Mapa de secciones (HTML)

- `header.site-header`: marca + boton `nav-toggle` + `nav.main-nav`.
- `section.hero`: propuesta principal y CTA.
- `section#producto`, `section#beneficios`, `section#testimonios`, `section#pricing`: bloques de contenido.
- `section#form-solicitar-demo`: bloque de conversion con `demo-info` y `demo-form-wrap`.
- `button#btn-volver-arriba`: boton flotante para subir al inicio.

## Mapa de estilos (CSS)

Convencion de comentarios en archivo:

- `/* [tokens] ... */`
- `/* [layout/*] ... */`
- `/* [section/*] ... */`
- `/* [state/*] ... */`
- `/* [breakpoint/*] ... */`

Capas principales:

1. Tokens y reset: variables globales, tipografia y base comun.
2. Header/nav: estado normal y estado colapsado (`.is-collapsed-nav`).
3. Secciones base: tarjeta `.section`, espaciado y titulos.
4. Hero: distribucion principal y panel de tarjetas.
5. Demo: layout doble columna, formulario y contador.
6. Responsive: ajustes en `980px` y `720px`.

## Mapa de comportamiento (JS)

Convencion de comentarios en archivo:

- `// [feature/*] ...`

Bloques funcionales:

1. `[feature/back-to-top]`
   - Muestra/oculta `#btn-volver-arriba` segun `window.scrollY`.
2. `[feature/nav]`
   - Calcula si la nav debe colapsar.
   - Fuerza colapso en movil (`mobileCollapseMaxWidth = 720`).
   - Gestiona apertura/cierre, click externo y tecla `Escape`.
3. `[feature/contact-links]`
   - Decodifica datos de contacto y redirige a `tel:` / `mailto:`.
4. `[feature/char-counter]`
   - Actualiza contador de caracteres y estados visuales del textarea.

## Dependencias entre archivos

- `index.html` define clases/ids consumidos por CSS y JS.
- `style.css` depende de clases estructurales (`.site-header`, `.demo-form`, etc.).
- `main.js` depende de selectores exactos:
  - `#btn-volver-arriba`
  - `.site-header`, `.home-link`, `.main-nav`, `.nav-toggle`
  - `.demo-contact-link`
  - `#demo-mensaje`, `#demo-char-counter`

Si cambias clases o ids en HTML, actualiza CSS y JS en el mismo commit.

## Reglas para cambios futuros

1. Mantener la convencion de comentarios por categoria.
2. Evitar estilos inline y evitar logica JS en HTML.
3. No romper anclas de navegacion (`href="#..."` debe existir como `id`).
4. Cualquier cambio responsive en nav debe validar width cercano a `720px`.
5. Mantener accesibilidad basica:
   - `aria-label` en botones/iconos sin texto.
   - Soporte de teclado para menu (`Escape`, foco al toggle).

## Checklist rapido antes de cerrar cambios

- No hay errores de sintaxis en HTML/CSS/JS.
- Navegacion funciona en desktop y movil.
- El formulario demo mantiene alineacion visual con `demo-info`.
- El contador de caracteres responde al input.
- Boton "volver arriba" aparece y funciona.
