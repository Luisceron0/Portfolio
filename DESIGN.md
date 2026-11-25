---
name: Portafolio Luis Alejandro Cerón Muñoz
description: Zine de papel con ajuste Persona punk; cartulina negra, fotocopia, papel magenta, bandas azul y violeta P3R, paneles cortados, cinta, sello y Dymo.
colors:
  surface: "#121014"
  surface-card: "#1b181e"
  paper: "#f2efe8"
  paper-dark: "#e6e2d8"
  ink: "#f2efe8"
  ink-muted: "#b9b3ab"
  tinta: "#0b0a0f"
  tinta-muted: "#4a4540"
  magenta: "#D903D5"
  magenta-deep: "#A8009F"
  magenta-text: "#F25CEB"
  plum: "#5a1257"
  blue: "#1E3BFF"
  blue-deep: "#0B1A8C"
  violet: "#4F1BC4"
  tone-pink: "#FF9CF5"
  tone-ochre: "#E0A24A"
  tone-cyan: "#46C3D8"
  tone-lilac: "#B6A6B6"
  warn: "#ffd23f"
typography:
  display:
    fontFamily: "Arial Black, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "clamp(1.9rem, 6vw, 4.5rem)"
    fontWeight: 900
    fontStyle: italic
    lineHeight: 1
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Arial Black, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "clamp(1.1rem, 5.4vw, 3.75rem)"
    fontWeight: 900
    fontStyle: italic
    lineHeight: 1
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 800
    lineHeight: 1.375
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.33
    letterSpacing: "0.01em"
  dymo:
    fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "0.65rem"
    fontWeight: 800
    letterSpacing: "0.08em"
  brush:
    fontFamily: "Permanent Marker, Arial Black, sans-serif"
    fontSize: "3.75rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.01em"
rounded:
  none: "0"
spacing:
  gutter: "20px"
  gutter-sm: "32px"
  card: "20px"
  card-lg: "28px"
  section: "64px"
  section-lg: "96px"
  band: "80px"
  band-lg: "112px"
  content-max: "72rem"
components:
  button-primary:
    backgroundColor: "{colors.magenta-deep}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "10px 28px"
    height: "48px"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.none}"
    padding: "10px 28px"
    height: "48px"
  button-dark:
    backgroundColor: "{colors.tinta}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "10px 28px"
    height: "48px"
  button-disabled:
    backgroundColor: "{colors.tone-lilac}"
    textColor: "{colors.tinta}"
  card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "{spacing.card}"
  card-blue:
    backgroundColor: "{colors.blue-deep}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
  sheet:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.none}"
  panel:
    backgroundColor: "{colors.warn}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.none}"
  band-magenta:
    backgroundColor: "{colors.magenta}"
    textColor: "{colors.tinta}"
    padding: "{spacing.band}"
  band-blue:
    backgroundColor: "{colors.blue-deep}"
    textColor: "{colors.paper}"
    padding: "{spacing.band}"
  band-violet:
    backgroundColor: "{colors.violet}"
    textColor: "{colors.paper}"
    padding: "{spacing.band}"
  dymo:
    backgroundColor: "{colors.tinta}"
    textColor: "{colors.paper}"
    typography: "{typography.dymo}"
  dymo-magenta:
    backgroundColor: "{colors.magenta-deep}"
    textColor: "{colors.paper}"
    typography: "{typography.dymo}"
  input:
    backgroundColor: "{colors.paper-dark}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.none}"
    padding: "10px 14px"
---

# Design System: Portafolio Luis Alejandro Cerón Muñoz

## Overview

**Creative North Star: "El zine sobre la mesa de trabajo, pasado por el menú de Persona"**

Cada superficie es un material que podría estar físicamente sobre una mesa: cartulina negra con grano como lienzo, fotocopias con sombra sólida plum, bandas a sangre con bordes rasgados (papel magenta, azul P3R y violeta del menú), paneles de color con esquinas cortadas, cinta kraft, sellos de goma y etiquetas Dymo en relieve. El ajuste Persona punk cambia la voz que grita: rótulos en sans negra en cursiva, apretados y en mayúsculas, como los menús de Persona 3 Reload. El texto se reparte en tres voces impresas: sans negra en cursiva para lo que se grita, mecanografiado para los datos y cuerpo sans recto para lo que se lee. El rotulador a mano queda solo como un brochazo: la palabra vertical MENÚ del menú de pausa. La densidad es de recorte pegado: piezas giradas uno o dos grados, solapadas con cinta, nunca un tablero de paneles alineados.

El movimiento conserva la mecánica de los menús de Persona 3 Reload (curvas de golpe y de rebote, entradas laterales, cursor que salta), pero lo que se mueve es papel: una cortina de papel magenta, títulos que se despliegan, cintas que se pegan y sellos que golpean. Con movimiento reducido todo queda quieto y visible.

Rechazo confirmado: el panel de luz neón con glow, glitch, separación RGB, desenfoque, vidrio y mono de terminal con tracking abierto. Tampoco esquinas redondeadas ni sombras difusas: el papel se corta, no se redondea. La luz de agua de la banda azul es plana, de borde duro y quieta, nunca un brillo.

**Key Characteristics:**
- Materiales, no paneles de interfaz: cada color es un papel, una tinta o una cinta.
- Sombras sólidas desplazadas (plum o tinta), nunca difusas.
- Recortes con `clip-path`: bordes rasgados, cartulina cortada, panel con dos esquinas en diagonal, extremos de cinta en zigzag.
- Tres voces: sans negra en cursiva, mecanografiado y sans impreso; cero bytes de fuente salvo el brochazo.
- Contraste medido por script (39 pares), no estimado.
- Movimiento P3R con materiales de papel; quieto con movimiento reducido.

## Colors

Paleta de taller: cartulina negra, fotocopia y papel magenta, con dos papeles P3R (azul y violeta) para bandas y papeles de color como acentos de orientación por sección.

### Primary
- **Papel Magenta** (magenta): bandas a sangre del hero y el CV, marquesina inversa, cortina de entrada, resaltador y brochazo del cursor. Encima solo va tinta (4.63:1).
- **Magenta Profundo** (magenta-deep): relleno del botón primario y de la Dymo magenta con letra papel (5.78:1), y magenta como texto sobre papel (sellos, organización, error de campo).
- **Tinta Magenta** (magenta-text): magenta como texto sobre negro: números de sección, sellos sobre cartulina, organizaciones, MENÚ vertical, anillo de foco (6.76:1).

### Secondary
- **Plum de Sombra** (plum): solo decoración. Sombras sólidas de fotocopias, fotos, títulos y recortes; salpicaduras detrás de los números sobre negro. Nunca texto.
- **Azul P3R** (blue) y **Azul Profundo** (blue-deep): banda Cómo trabajo, en degradado de blue-deep arriba a blue abajo, y relleno del panel del menú de pausa (blue-deep). Sobre blue solo papel (5.85:1); sobre blue-deep, papel (11.87:1), ink-muted (6.55:1) y tone-pink (7.35:1).
- **Violeta del Menú** (violet): banda de Habilidades, con una cuña diagonal azul y motas claras. Solo papel encima (8.00:1).

### Tertiary
- **Papeles de tono** (tone-pink, tone-ochre, tone-cyan, tone-lilac, más magenta-text como tono magenta): un tono por sección que orienta al lector. Legibles como texto sobre negro y con tinta encima cuando son papel (todos sobre 7.6:1). El ocre es además la cinta kraft; el cian es el resaltador alterno; el lila es el pie de página, el cuarto panel del proceso y el botón deshabilitado.
- **Amarillo de Panel** (warn): relleno por defecto de `.m-panel` (estado, alertas, nota privada, marcas `[PENDIENTE]`, primer paso del proceso). Tinta encima.

### Neutral
- **Cartulina Negra** (surface): lienzo de toda la página, con grano claro fijo al 4 %.
- **Cartulina de Tarjeta** (surface-card): relleno de las tarjetas recortadas.
- **Fotocopia** (paper): hojas, tira del título, botón secundario, borde de papel de las tarjetas, texto sobre azul y violeta.
- **Papel Oscuro** (paper-dark): campos del formulario.
- **Texto Claro** (ink, mismo valor que paper) y **Texto Secundario Claro** (ink-muted): texto sobre negro (ink-muted también sobre blue-deep).
- **Tinta** (tinta) y **Tinta Secundaria** (tinta-muted): texto sobre papel, magenta y paneles.

### Named Rules
**The Tinta Sobre Magenta Rule.** Sobre el papel magenta el texto es SIEMPRE tinta. Papel sobre magenta da 3.71:1 y no pasa. Para letra clara sobre magenta se usa magenta-deep.

**The Un Magenta No Basta Rule.** Ningún magenta pasa las tres pruebas: papel magenta para bandas, magenta-deep para rellenos con letra papel y magenta sobre papel, magenta-text para texto sobre negro. No se intercambian.

**The Solo Papel Sobre Azul Rule.** Sobre la banda azul y la violeta el texto es papel. tone-pink sobre blue da 3.6:1 y no pasa; el rosa vive solo sobre blue-deep (panel del menú). Las tarjetas dentro de una banda son su propio material (panel, hoja) y llevan su propia tinta.

**The Muted Por Superficie Rule.** ink-muted vive solo sobre negro y blue-deep; nunca sobre papel. tinta-muted vive solo sobre papel, paper-dark, warn, rosa y cian.

**The Lila Solo Tinta Rule.** Sobre tone-lilac (pie, panel lila) solo tinta: tinta-muted da 4.11:1 y magenta-deep 2.88:1.

**The Textura Solo Sube Rule.** Una textura sobre un fondo cercano al umbral solo puede subir el contraste. El papel magenta y el violeta llevan motas claras (no grano oscuro, que apagaba el magenta a ~#C903C5 y dejaba la tinta en ~4.0:1); el magenta renderizado queda en ~#DB13D8. Su trama de semitonos es de puntos de papel y solo en las esquinas. Las manchas de luz de la banda azul quedan sobre el azul profundo de arriba, para que el papel siga por encima de 4.5:1.

**The Contraste Medido Rule.** Todo par texto y fondo nuevo entra en `scripts/check-contrast.mjs` con 4.5:1 mínimo; un hex que cambia en `tailwind.config.ts` cambia también allí.

## Typography

**Display Font:** sans negra del sistema en cursiva (`--font-heavy`: Arial Black, Helvetica Neue a 900, Helvetica, Arial), cero bytes
**Body Font:** Helvetica Neue del sistema (Helvetica, Arial, sans-serif)
**Label/Mono Font:** monoespaciada del sistema (ui-monospace, SFMono-Regular, Menlo, Consolas)
**Brush Font:** Permanent Marker, autoalojada con next/font/local (woff2 subset Latin, Apache 2.0), solo como acento

**Character:** Rótulo de menú de Persona (negra, cursiva, mayúsculas, tracking negativo) para gritar lo poco que se grita, máquina de escribir para datos y etiquetas, sans impreso y recto para todo lo que se lee de verdad.

### Hierarchy
- **Display** (900 cursiva, 1.9rem en móvil, 3.75rem en sm, 4.5rem en md, interlineado 1, mayúsculas, -0.03em): el nombre del hero en recortes de nota de rescate, cada palabra un recorte distinto con su giro y sombra plum. Números de sección en la misma voz, de 3.75rem a 8rem; título del caso (3rem a 4.5rem).
- **Headline** (900 cursiva, clamp(1.1rem, 5.4vw, 1.6rem) en móvil, 3rem en sm, 3.75rem en md): h2 de sección dentro de la tira de fotocopia sesgada; títulos de proyecto (1.875rem a 2.25rem); opciones del menú de pausa (1.5rem a 2.25rem); enlaces de la nav, marquesina y títulos cortos de tarjeta y de paso.
- **Title** (800, 1.125rem a 1.5rem, interlineado 1.375, tracking ajustado): títulos de cargo y de grado, en el sans del cuerpo.
- **Body** (400, 1rem a 1.125rem, interlineado 1.625): párrafos, pitch y resultados; ancho máximo de 42rem en intros.
- **Label** (700, 0.75rem, monoespaciada): etiquetas de formulario, `dt` de metadatos, flujo de datos, enlaces de evidencia, pista del menú.
- **Dymo** (800, 0.6rem a 0.75rem, mayúsculas, tracking 0.08em, sans): roles del hero, chips de stack, categorías, estado, idioma y filtros. También la letra de los botones.
- **Sello** (900 cursiva, mayúsculas, tracking 0.02em): fechas, números 01, 02, 03 de pilares y habilidades, disponibilidad.
- **Brush** (Permanent Marker 400, 3.75rem, vertical): solo la palabra MENÚ del menú de pausa, en magenta-text, `aria-hidden`.

### Named Rules
**The Rótulo Escaso Rule.** La sans negra en cursiva solo en el nombre del hero, los h2 de sección y sus números, títulos de proyecto y de caso, menú de pausa, nav, marquesina, sellos y títulos cortos de tarjeta. Nunca en párrafos, inputs, chips ni código; los títulos largos de varias líneas (cargos y grados) van en el sans del cuerpo, extrabold.

**The Brochazo Único Rule.** Permanent Marker no es texto de lectura: solo el acento vertical del menú de pausa, decorativo y oculto a lectores de pantalla.

**The Mecanografiado Sin Aire Rule.** La monoespaciada lleva tracking de 0.01em, no el tracking abierto de terminal. El aire en mayúsculas es exclusivo de la Dymo (0.08em).

## Layout

Columna de contenido de 72rem centrada, con márgenes de 20px en móvil y 32px desde sm. Secciones normales con 64px vertical (96px desde sm); las bandas (magenta, azul o violeta, elegidas con `band` en `Section`) salen a sangre con 80px vertical (112px desde sm) y 32px de margen arriba y abajo para que los bordes rasgados respiren. Tarjetas con 20px de relleno interior (28px desde sm). El hero usa dos columnas desde lg (1.35fr y 1fr): a la izquierda el nombre en recortes, debajo una tira Dymo por rol, el pitch en fotocopia con cinta, la línea de apoyo, los CTA, GitHub y LinkedIn, y al final ubicación y sello de disponibilidad; a la derecha el menú de pausa. Titular, pitch, CTA y GitHub caben en 375x667. Las piezas se giran entre -2 y 2 grados y se solapan con cinta; los textos largos quedan rectos. En la banda violeta, desde md, las palabras en abanico ocupan solo la mitad derecha, detrás del contenido. Las anclas compensan 5rem por la nav fija. Objetivos táctiles de 44px como mínimo (botones 48px); las opciones del menú de pausa llevan 0.7rem de relleno vertical para no bajar de 24px.

## Elevation & Depth

Profundidad de papel apilado: sombras sólidas desplazadas sin desenfoque, nunca ambientales. La sombra dice "esta hoja está encima de la otra", no "esto flota". La profundidad con el puntero (parallax en dos capas) y el levantamiento al hover usan la misma sombra sólida.

### Shadow Vocabulary
- **Hoja apilada** (`box-shadow: 6px 6px 0 #5a1257`): fotocopias, fotos polaroid y la tira del título (como capa recortada desplazada 6px).
- **Panel** (capa tinta con el mismo recorte, `translate: 6px 6px`): paneles de color.
- **Recorte** (`filter: drop-shadow(3px 3px 0 #5a1257)`): palabras del nombre, logotipo de la nav (2px).
- **Levantar tarjeta** (`filter: drop-shadow(-8px 8px 0 #5a1257)` con `translate(4px, -4px)`): hover de tarjetas.
- **Botón** (capa recortada tinta, papel o magenta desplazada `-5px 5px`): aparece solo en hover.

### Named Rules
**The Sombra Sólida Rule.** Toda sombra es sólida, con desplazamiento y sin desenfoque, en plum o tinta. Nada de sombra difusa, glow, blur ni backdrop-filter.

## Shapes

Cero esquinas redondeadas: el radio de Tailwind está anulado a 0 en todos los pasos para que un `rounded-*` olvidado no reintroduzca una curva. La forma la dan los recortes con `clip-path`: borde rasgado arriba y abajo en bandas (16 puntos por lado), recorte irregular de cartulina en tarjetas (12 puntos, con borde de papel de 3px por detrás), panel con dos esquinas cortadas en diagonal de 1.4rem (`--cut-panel`), tira rasgada en los lados y sesgada para títulos, extremos dentados en cinta y kraft, extremos en V en la Dymo, borde perforado en boletas de formación. Los adornos son SVG dibujados a mano en el código con trazos irregulares y extremos redondos: brochazo, salpicadura, garabato de flecha, círculo de rotulador, chincheta y viñetas de asterisco o check.

**The Recorte En Pseudo Rule.** En elementos interactivos y contenedores con contenido enfocable nunca se recorta el propio elemento (recortaría el anillo de foco): la forma va en `::before`, la sombra en `::after`, y el elemento queda rectangular.

**The Tres Adornos Rule.** Como máximo 3 adornos (brochazo, garabato o salpicadura) por pantalla. La cinta es construcción y no cuenta.

**The Sesgo Solo En Capas Rule.** El sesgo vive en pseudo-elementos de piezas bajas (la tira del título, `skewX(-12deg) rotate(-1.5deg)`) o en la cortina a pantalla completa; nunca en contenedores altos.

## Components

### Buttons
Etiquetas de papel recortadas que se despegan al pasar el puntero.
- **Shape:** recorte irregular de 10 puntos en `::before`, sin radio (0).
- **Primary:** relleno magenta-deep con grano, letra papel, Dymo extrabold en mayúsculas 0.875rem, 48px de alto.
- **Secondary:** fotocopia con letra tinta y sombra magenta al hover.
- **Dark:** cartulina tinta con letra papel y sombra papel; es el primario sobre papel magenta.
- **Hover / Focus:** el botón se desplaza `3px, -2px`, el papel se estira 4 % y aparece la capa de sombra desplazada; curva `--ease-snap` en 220 ms. Foco con anillo según superficie.
- **Disabled:** papel lila con letra tinta, sin movimiento.

### Chips
- **Style:** etiqueta Dymo: cinta tinta (o magenta-deep) con letra papel en relieve, mayúsculas, tracking 0.08em, extremos en V. Variante con borde interior de papel de 1px.
- **State:** filtro activo en Dymo magenta girada -2 grados; inactivo con borde. En stack, saltan escalonados (40ms por chip) al revelarse y suben 3px al hover.

### Cards / Containers
- **Corner Style:** recorte irregular de cartulina, sin radio.
- **Background:** cartulina de tarjeta con grano claro y borde de papel de 3px que asoma por detrás; variante `.m-card--blue` en blue-deep.
- **Shadow Strategy:** levantar tarjeta al hover (ver Elevation & Depth).
- **Border:** solo el borde de papel recortado.
- **Internal Padding:** 20px, 28px desde sm.
- **Fotocopia:** hoja de papel con grano y sombra plum para pitch, flujo de datos, fichas y grupos de habilidades. **Boleta** perforada a la izquierda para formación.
- **Panel:** papel de color (`--panel-bg`, amarillo por defecto) con dos esquinas cortadas y sombra tinta sólida de 6px, forma y sombra en pseudo-elementos. Pasos del proceso en amarillo, rosa, cian y lila; alertas y éxito del formulario (cian), nota privada del caso, hueco de captura pendiente y marcas `[PENDIENTE]`. Texto en tinta.

### Bandas
- **Magenta** (`.m-magenta`): hero y CV. Motas claras, semitonos de papel en dos esquinas, bordes rasgados. Texto tinta.
- **Azul** (`.m-blue`): Cómo trabajo. Degradado de blue-deep a blue, con manchas de luz de agua cian, planas, de borde duro y sin animación, en los 7.5rem de arriba. Texto papel.
- **Violeta** (`.m-violet`): Habilidades. Violeta con una cuña diagonal azul al 50 % y motas claras; detrás, `FanWords`: los nombres de los grupos en palabras gigantes en abanico (`.p-fan`, sans negra cursiva al 16 %), `aria-hidden`, desde md y solo en la mitad derecha. Texto papel.
- **SectionHeading** con `onColor` pone número e intro en papel y la salpicadura en tinta sobre azul y violeta; `onPaper` los pone en tinta.

### Inputs / Fields
- **Style:** papel oscuro con línea inferior de tinta de 2px, sin radio, texto tinta, placeholder tinta-muted; etiqueta mecanografiada en negrita encima.
- **Focus:** la línea inferior pasa a magenta-deep y aparece el anillo tinta con separación papel.
- **Error:** mensaje en magenta-deep sobre papel (5.13:1).

### Navigation
Barra fija de cartulina negra con borde inferior rasgado magenta y una tira de cinta magenta que crece con el progreso de lectura. Logotipo en sans negra cursiva sobre un recorte de papel girado -6 grados con cinta. Enlaces en sans negra cursiva; en hover, foco y sección actual los barre un resaltador magenta de bordes irregulares y la letra pasa a tinta. Idioma en dos Dymo. Por debajo de xl, botón de menú en cartulina recortada de 44px y lista plegable.

### Menú de pausa (signature)
El menú de Persona repintado: cartulina recortada en azul profundo (`.m-card.m-card--blue`), girada -2 grados y pegada con cinta, con MENÚ vertical a brocha en magenta-text. Opciones en sans negra cursiva que alternan papel y tone-pink, cada una con su giro; la seleccionada pasa a tinta, se desplaza 10px y crece 12 % con `--ease-spring`. El cursor es un brochazo magenta estirable con un trozo de cinta como punta, que golpea al llegar y respira. Cada opción lleva 0.7rem de relleno vertical (objetivo de 24px como mínimo).

### Sellos, cinta y Dymo del hero
- **Sello de goma:** sans negra cursiva en mayúsculas con doble recuadro, giro de -4 grados y tinta gastada (alfa 0.7 a 1, siempre legible). Magenta-text sobre negro, magenta-deep sobre papel, tinta sobre magenta. Golpea al revelarse.
- **Cinta adhesiva:** kraft translúcida 80x24px con extremos en zigzag; se pega al revelarse 120ms después de su hoja.
- **Roles:** una tira Dymo por rol debajo del nombre, sin partirse en dos líneas; los separadores quedan solo para lectores de pantalla.

### Movimiento
- Curvas: `--ease-snap` (cubic-bezier(0.2, 0.9, 0.1, 1)) para entradas y hovers; `--ease-spring` (cubic-bezier(0.34, 1.56, 0.64, 1)) para cursor, sellos, cintas y chips.
- Cortina de entrada: hoja magenta rasgada y tiras de tinta y papel en diagonal, 0.85s; sin puntero.
- Entradas: el hero entra escalonado desde la izquierda (28px); el resto se revela con desplazamiento lateral de 32px. El título se despliega y golpea; los trazos se dibujan; las capturas se descubren con un tajo dentado.
- Ligado al scroll donde existe `animation-timeline`: el número de sección se desliza, la cinta de progreso crece. Marquesina en bucle de 28s.
- La luz de agua, la cuña y el abanico son estáticos.

## Do's and Don'ts

### Do:
- **Do** poner solo tinta sobre papel magenta (4.63:1); para letra clara usar magenta-deep con papel (5.78:1).
- **Do** poner solo papel sobre las bandas azul y violeta; tone-pink e ink-muted solo sobre blue-deep.
- **Do** usar tinta, tinta-muted o magenta-deep sobre papel, y solo tinta sobre lila.
- **Do** hacer que cualquier textura sobre un fondo cercano al umbral solo suba el contraste (motas claras en el magenta, medido ~#DB13D8).
- **Do** usar sombras sólidas desplazadas en plum (#5a1257) o tinta, 3px a 8px, sin desenfoque.
- **Do** recortar con `clip-path` en pseudo-elementos en todo lo interactivo y en paneles con contenido enfocable, para que el foco quede entero.
- **Do** dar anillo de foco magenta-text con separación negra sobre cartulina, anillo papel sobre las bandas azul y violeta, y anillo tinta sobre papel, magenta, paneles y kraft.
- **Do** añadir cada par nuevo de texto y fondo a `npm run check:contrast`.
- **Do** dejar todo quieto y visible con `prefers-reduced-motion`: sin cortina, sin marquesina, sin parallax, sin entradas.

### Don't:
- **Don't** poner papel ni ink sobre magenta (3.71:1), ni tone-pink sobre blue (3.6:1).
- **Don't** usar ink-muted sobre papel, ni tinta-muted o magenta-deep sobre lila.
- **Don't** usar la sans negra cursiva en párrafos, inputs, chips, código ni títulos largos de varias líneas; cargos y grados van en sans extrabold.
- **Don't** usar Permanent Marker como texto de lectura; solo el MENÚ vertical.
- **Don't** pasar de 3 adornos (brochazo, garabato, salpicadura) por pantalla; la cinta no cuenta.
- **Don't** usar esquinas redondeadas, sombras difusas, vidrio, blur, glow ni neón.
- **Don't** usar glitch ni separación RGB, ni animar la luz de agua.
- **Don't** aplicar skewX a contenedores altos: desbordan en móvil. El sesgo vive en la tira del título y en la cortina a pantalla completa.
- **Don't** animar filtros ni el grano: el ruido es un `feTurbulence` estático.
- **Don't** usar grano oscuro sobre el papel magenta: lo apaga por debajo del umbral.
