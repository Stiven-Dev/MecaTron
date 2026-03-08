# MecaTron - Guia Rapida de Arquitectura Frontend

## Objetivo

Landing estatica en espanol para promocionar MecaTron (software de gestion para talleres).

El proyecto esta pensado para:

- Cargar rapido sin build step.
- Mantener estilos y comportamiento en archivos simples.
- Facilitar mantenimiento por personas y por agentes IA.

## Estructura del proyecto

- `index.html`: estructura semantica, copy comercial, anclas y componentes UI.
- `assets/css/style.css`: tokens visuales, layout, componentes, tema oscuro y responsive.
- `assets/js/main.js`: interacciones (nav, formulario, tema, toggles, contadores).
- `assets/img/*.svg`: ilustraciones de apoyo originales usadas en secciones de producto/beneficios.

## Mapa de secciones (HTML)

- `header.site-header`: marca + `nav-toggle` + `nav.main-nav` con anclas.
- `section.hero`: propuesta de valor, CTA y lista de pruebas funcionales.
- `section#producto`: flujo de operacion + tarjetas problema/solucion + imagen de apoyo.
- `section#beneficios`: metricas con contador animado + boton mostrar/ocultar + bloque expandible.
- `section#testimonios`: prueba social por roles.
- `section#pricing`: planes comerciales con plan destacado.
- `section#form-solicitar-demo`: bloque de conversion con formulario validable.
- `footer.site-footer`: enlaces de contacto/redes (simuladas) + derechos reservados.
- Botones flotantes:
  - `#btn-theme-toggle`: alterna tema claro/oscuro.
  - `#btn-volver-arriba`: vuelve al inicio.

## Mapa de estilos (CSS)

Convencion de comentarios en archivo:

- `/* [tokens] ... */`
- `/* [layout/*] ... */`
- `/* [section/*] ... */`
- `/* [state/*] ... */`
- `/* [theme/*] ... */`
- `/* [breakpoint/*] ... */`

Capas principales:

1. Tokens y reset: paleta, fuentes y base global.
2. Header/nav: estado normal y colapsado (`.is-collapsed-nav`).
3. Secciones de contenido: hero, producto, beneficios, testimonios y pricing.
4. Demo/formulario: layout dual, estados de validacion y feedback.
5. Footer inline + botones flotantes.
6. Tema oscuro (`html[data-theme="dark"]`) con contraste reforzado.
7. Breakpoints en `980px` y `720px`.

## Mapa de comportamiento (JS)

Convencion de comentarios en archivo:

- `// [feature/*] ...`

Bloques funcionales:

1. `[feature/back-to-top]`
   - Muestra/oculta `#btn-volver-arriba` segun `scrollY`.
2. `[feature/nav]`
   - Colapsa nav segun espacio disponible o viewport movil.
   - Maneja apertura/cierre, click externo y tecla `Escape`.
3. `[feature/char-counter]`
   - Actualiza contador del textarea (`#demo-mensaje`).
4. `[feature/form-submit]`
   - Valida formulario demo, marca campos invalidos y muestra feedback dinamico.
5. `[feature/theme-toggle]`
   - Alterna tema claro/oscuro y persiste preferencia en `localStorage`.
6. `[feature/benefits-toggle]`
   - Muestra/oculta el panel de detalles de beneficios.
7. `[feature/benefits-counter]`
   - Anima metricas al entrar en viewport (IntersectionObserver + requestAnimationFrame).

## Dependencias entre archivos

- `index.html` define clases/ids consumidos por CSS y JS.
- `style.css` depende de estructura semantica y clases de estado.
- `main.js` depende de estos selectores clave:
  - `#btn-volver-arriba`
  - `#btn-theme-toggle`
  - `.site-header`, `.home-link`, `.main-nav`, `.nav-toggle`
  - `.demo-form`, `#demo-mensaje`, `#demo-char-counter`, `#demo-form-feedback`
  - `.info-toggle-btn` (usa `data-toggle-target`)
  - `.metric-counter[data-end]`

Si cambias clases o ids en HTML, actualiza CSS y JS en el mismo commit.

## Reglas para cambios futuros

1. Mantener la convencion de comentarios por categoria.
2. Evitar estilos inline y evitar logica JS embebida en HTML.
3. No romper anclas (`href="#..."` debe existir como `id`).
4. Probar nav responsive en anchos cercanos a `720px`.
5. Mantener accesibilidad minima:
   - `aria-label` en botones/iconos sin texto.
   - `aria-expanded` / `aria-controls` en toggles.
   - Soporte de teclado para menu (`Escape`, foco al toggle).

## Checklist rapido antes de cerrar cambios

- No hay errores de sintaxis en HTML/CSS/JS.
- Navegacion funciona en desktop y movil.
- Formulario demo valida y muestra feedback sin `alert`.
- Toggle de tema aplica y persiste correctamente.
- Boton de beneficios muestra/oculta contenido.
- Contadores de beneficios animan al entrar a seccion.
- Botones flotantes (tema/top) visibles y operativos.
