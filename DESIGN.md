---
name: Portafolio Luis Alejandro Cerón Muñoz
description: Zine de papel armado sobre la mesa; cartulina negra, fotocopia, papel magenta, cinta, sello y Dymo (RF-110 v5).
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
  tone-pink: "#FF9CF5"
  tone-ochre: "#E0A24A"
  tone-cyan: "#46C3D8"
  tone-lilac: "#B6A6B6"
  warn: "#ffd23f"
  steel: "#8d8a92"
typography:
  display:
    fontFamily: "Permanent Marker, Arial Black, sans-serif"
    fontSize: "clamp(2.15rem, 6vw, 4.5rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.01em"
  headline:
    fontFamily: "Permanent Marker, Arial Black, sans-serif"
    fontSize: "clamp(1.1rem, 5.4vw, 3.75rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.01em"
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
  sheet:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.none}"
  band-magenta:
    backgroundColor: "{colors.magenta}"
    textColor: "{colors.tinta}"
    padding: "{spacing.band}"
  band-lilac:
    backgroundColor: "{colors.tone-lilac}"
    textColor: "{colors.tinta}"
    padding: "{spacing.band}"
  dymo:
    backgroundColor: "{colors.tinta}"
    textColor: "{colors.paper}"
    typography: "{typography.dymo}"
  dymo-magenta:
    backgroundColor: "{colors.magenta-deep}"
    textColor: "{colors.paper}"
    typography: "{typography.dymo}"
  postit:
    backgroundColor: "{colors.warn}"
    textColor: "{colors.tinta}"
  input:
    backgroundColor: "{colors.paper-dark}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.none}"
    padding: "10px 14px"
---

# Design System: Portafolio Luis Alejandro Cerón Muñoz

## Overview

**Creative North Star: "El zine sobre la mesa de trabajo"**

Cada superficie es un material que podría estar físicamente sobre una mesa: cartulina negra con grano como lienzo, fotocopias con sombra sólida plum, bandas de papel magenta a sangre con bordes rasgados, cinta kraft, sellos de goma, etiquetas Dymo en relieve y notas adhesivas. El texto se reparte en tres voces impresas: rotulador a mano para lo que se grita, mecanografiado para los datos y cuerpo sans recto para lo que se lee. La densidad es de recorte pegado: piezas giradas uno o dos grados, solapadas con cinta, nunca un tablero de paneles alineados.

El movimiento conserva la mecánica de los menús de Persona 3 Reload (curvas de golpe y de rebote, entradas laterales, cursor que salta), pero lo que se mueve es papel: una cortina de papel magenta, títulos que se despliegan, cintas que se pegan y sellos que golpean. Con movimiento reducido todo queda quieto y visible.

Rechazo confirmado: el panel de luz neón con glow, glitch, separación RGB, desenfoque, vidrio y mono de terminal con tracking abierto. Tampoco esquinas redondeadas ni sombras difusas: el papel se corta, no se redondea.

**Key Characteristics:**
- Materiales, no paneles: cada color es un papel, una tinta o una cinta.
- Sombras sólidas desplazadas (plum o tinta), nunca difusas.
- Recortes con `clip-path` irregular: bordes rasgados, cartulina cortada, extremos de cinta en zigzag.
- Tres voces: rotulador, mecanografiado y sans impreso.
- Contraste medido por script, no estimado.
- Movimiento P3R con materiales de papel; quieto con movimiento reducido.

## Colors

Paleta de taller: cartulina negra, fotocopia y papel magenta, con papeles de color como acentos de orientación por sección.

### Primary
- **Papel Magenta** (magenta): bandas a sangre del hero, el CV y secciones alternas; cortina de entrada, resaltador y brochazo del cursor. Encima solo va tinta (4.63:1).
- **Magenta Profundo** (magenta-deep): relleno del botón primario y de la Dymo magenta con letra papel (5.78:1), y magenta como texto sobre papel (sellos, organización, error de campo).
- **Tinta Magenta** (magenta-text): magenta como texto sobre negro: números de sección, sellos sobre cartulina, organizaciones, anillo de foco (6.76:1).

### Secondary
- **Plum de Sombra** (plum): solo decoración. Sombras sólidas de fotocopias, fotos, títulos y recortes; salpicaduras detrás de los números. Nunca texto.

### Tertiary
- **Papeles de tono** (tone-pink, tone-ochre, tone-cyan, tone-lilac, más magenta-text como tono magenta): un tono por sección que orienta al lector. Legibles como texto sobre negro y con tinta encima cuando son papel (todos sobre 7.6:1). El ocre es además la cinta kraft; el cian es el resaltador alterno; el lila es la fotocopia vieja.
- **Nota Adhesiva** (warn): estado y marcas `[PENDIENTE]`. Tinta encima.

### Neutral
- **Cartulina Negra** (surface): lienzo de toda la página, con grano claro fijo al 4 %.
- **Cartulina de Tarjeta** (surface-card): relleno de las tarjetas recortadas.
- **Fotocopia** (paper): hojas, tira del título, botón secundario, borde de papel de las tarjetas.
- **Papel Oscuro** (paper-dark): campos del formulario.
- **Texto Claro** (ink, mismo valor que paper) y **Texto Secundario Claro** (ink-muted): texto sobre negro.
- **Tinta** (tinta) y **Tinta Secundaria** (tinta-muted): texto sobre papel, magenta y notas.
- **Acero** (steel): grapas y metal, solo decoración.

### Named Rules
**The Tinta Sobre Magenta Rule.** Sobre el papel magenta el texto es SIEMPRE tinta. Papel sobre magenta da 3.71:1 y no pasa. Para letra clara sobre magenta se usa magenta-deep.

**The Un Magenta No Basta Rule.** Ningún magenta pasa las tres pruebas: papel magenta para bandas, magenta-deep para rellenos con letra papel y magenta sobre papel, magenta-text para texto sobre negro. No se intercambian.

**The Muted Por Superficie Rule.** ink-muted vive solo sobre negro; nunca sobre papel. tinta-muted vive solo sobre papel, paper-dark, warn, rosa y cian.

**The Lila Solo Tinta Rule.** Sobre tone-lilac (banda o fotocopia vieja) solo tinta: tinta-muted da 4.11:1 y magenta-deep 2.88:1.

**The Textura Solo Sube Rule.** Una textura sobre un fondo cercano al umbral solo puede subir el contraste. El papel magenta lleva motas claras (no grano oscuro, que lo apagaba a ~#C903C5 y dejaba la tinta en ~4.0:1); medido renderizado queda en ~#DB13D8. Su trama de semitonos es de puntos de papel y solo en las esquinas.

**The Contraste Medido Rule.** Todo par texto y fondo nuevo entra en `scripts/check-contrast.mjs` con 4.5:1 mínimo; un hex que cambia en `tailwind.config.ts` cambia también allí.

## Typography

**Display Font:** Permanent Marker, autoalojada con next/font/local (subset Latin, 28 KB, Apache 2.0), con Arial Black de respaldo
**Body Font:** Helvetica Neue del sistema (Helvetica, Arial, sans-serif)
**Label/Mono Font:** monoespaciada del sistema (ui-monospace, SFMono-Regular, Menlo, Consolas)

**Character:** Rotulador a mano en mayúsculas para gritar lo poco que se grita, máquina de escribir para datos y etiquetas, sans impreso y recto para todo lo que se lee de verdad.

### Hierarchy
- **Display** (400, 2.15rem en móvil a 4.5rem en md, interlineado 1, mayúsculas): el nombre del hero en recortes de nota de rescate, cada palabra un recorte distinto con su giro y sombra plum. Números de sección en la misma voz, de 3.75rem a 8rem.
- **Headline** (400, clamp(1.1rem, 5.4vw, 1.6rem) en móvil, 3rem en sm, 3.75rem en md, interlineado 1): h2 de sección dentro de la tira de fotocopia rasgada; títulos de proyecto (1.875rem a 2.25rem) con brochazo que se desliza debajo.
- **Title** (800, 1.125rem a 1.5rem, interlineado 1.375, tracking ajustado): títulos de cargo y de grado, en el sans del cuerpo.
- **Body** (400, 1rem a 1.125rem, interlineado 1.625): párrafos, pitch y resultados; ancho máximo de 42rem en intros.
- **Label** (700, 0.75rem, monoespaciada, minúsculas o tal cual): etiquetas de formulario, `dt` de metadatos, flujo de datos, enlaces de evidencia.
- **Dymo** (800, 0.6rem a 0.75rem, mayúsculas, tracking 0.08em, sans): chips de stack, categorías, estado, idioma y filtros. También la letra de los botones.

### Named Rules
**The Rotulador Escaso Rule.** Permanent Marker solo en el nombre del hero, los h2 de sección y sus números, títulos de proyecto, menú de pausa, marquesina, sellos y títulos cortos de tarjeta. Nunca en párrafos, inputs, chips, código ni títulos largos de varias líneas: los cargos y grados van en el sans, extrabold.

**The Mecanografiado Sin Aire Rule.** La monoespaciada lleva tracking de 0.01em, no el tracking abierto de terminal. El aire en mayúsculas es exclusivo de la Dymo (0.08em).

## Layout

Columna de contenido de 72rem centrada, con márgenes de 20px en móvil y 32px desde sm. Secciones normales con 64px vertical (96px desde sm); las bandas de papel magenta o lila salen a sangre con 80px vertical (112px desde sm) y 32px de margen arriba y abajo para que los bordes rasgados respiren. Tarjetas con 20px de relleno interior (28px desde sm). El hero usa dos columnas desde lg (1.35fr y 1fr): nombre, pitch y CTA a la izquierda, menú de pausa a la derecha; todo el primer viewport cabe en 375x667. Las piezas se giran entre -2 y 2 grados y se solapan con cinta; los textos largos quedan rectos. Las anclas compensan 5rem por la nav fija. Objetivos táctiles de 44px como mínimo (botones 48px).

## Elevation & Depth

Profundidad de papel apilado: sombras sólidas desplazadas sin desenfoque, nunca ambientales. La sombra dice "esta hoja está encima de la otra", no "esto flota". La profundidad con el puntero (parallax en dos capas) y el levantamiento al hover usan la misma sombra sólida.

### Shadow Vocabulary
- **Hoja apilada** (`box-shadow: 6px 6px 0 #5a1257`): fotocopias, fotos polaroid y la tira del título (como capa recortada desplazada 6px).
- **Recorte** (`filter: drop-shadow(3px 3px 0 #5a1257)`): palabras del nombre, logotipo de la nav (2px).
- **Nota adhesiva** (`box-shadow: 3px 3px 0 #0b0a0f`): notas amarillas.
- **Levantar tarjeta** (`filter: drop-shadow(-8px 8px 0 #5a1257)` con `translate(4px, -4px)`): hover de tarjetas.
- **Botón** (capa recortada tinta, papel o magenta desplazada `-5px 5px`): aparece solo en hover.

### Named Rules
**The Sombra Sólida Rule.** Toda sombra es sólida, con desplazamiento y sin desenfoque, en plum o tinta. Nada de sombra difusa, glow, blur ni backdrop-filter.

## Shapes

Cero esquinas redondeadas: el radio de Tailwind está anulado a 0 en todos los pasos para que un `rounded-*` olvidado no reintroduzca una curva. La forma la dan los recortes con `clip-path`: borde rasgado arriba y abajo en bandas (16 puntos por lado), recorte irregular de cartulina en tarjetas (12 puntos, con borde de papel de 3px por detrás), tira rasgada en los lados para títulos, extremos dentados en cinta y kraft, extremos en V en la Dymo, borde perforado en boletas de formación. Los adornos son SVG dibujados a mano en el código con trazos irregulares y extremos redondos: brochazo, salpicadura, garabato de flecha, círculo de rotulador, grapa, chincheta y viñetas de asterisco o check.

**The Recorte En Pseudo Rule.** En elementos interactivos nunca se recorta el propio elemento (recortaría el anillo de foco): la forma va en `::before`, la sombra en `::after`, y el elemento queda rectangular.

**The Tres Adornos Rule.** Como máximo 3 adornos (brochazo, garabato o salpicadura) por pantalla. La cinta y las grapas no cuentan: son construcción.

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
- **Background:** cartulina de tarjeta con grano claro y borde de papel de 3px que asoma por detrás.
- **Shadow Strategy:** levantar tarjeta al hover (ver Elevation & Depth).
- **Border:** solo el borde de papel recortado.
- **Internal Padding:** 20px, 28px desde sm.
- **Fotocopia:** hoja de papel con grano y sombra plum para pitch, flujo de datos y fichas; variante lila. **Hoja rayada** con margen magenta para listas. **Boleta** perforada a la izquierda para formación.

### Inputs / Fields
- **Style:** papel oscuro con línea inferior de tinta de 2px, sin radio, texto tinta, placeholder tinta-muted; etiqueta mecanografiada en negrita encima.
- **Focus:** la línea inferior pasa a magenta-deep y aparece el anillo tinta con separación papel.
- **Error:** mensaje en magenta-deep sobre papel (5.13:1).

### Navigation
Barra fija de cartulina negra con borde inferior rasgado magenta y una tira de cinta magenta que crece con el progreso de lectura. Logotipo a rotulador en un recorte de papel girado -6 grados con cinta. Enlaces a rotulador; en hover, foco y página actual los barre un resaltador magenta de bordes irregulares y la letra pasa a tinta. Idioma en dos Dymo. En móvil, botón de menú en cartulina recortada de 44px.

### Menú de pausa (signature)
El menú de Persona repintado: cartulina negra recortada, girada -2 grados y pegada con dos cintas. Opciones a rotulador con giros propios; la seleccionada se desplaza 10px y crece 12 % con `--ease-spring`. El cursor es un brochazo magenta estirable con un trozo de cinta como punta, que golpea al llegar y respira.

### Sellos, cinta y notas
- **Sello de goma:** rotulador en mayúsculas con doble recuadro, giro de -4 grados y tinta gastada (alfa 0.7 a 1, siempre legible). Magenta-text sobre negro, magenta-deep sobre papel, tinta sobre magenta. Golpea al revelarse.
- **Cinta adhesiva:** kraft translúcida 80x24px con extremos en zigzag; se pega al revelarse 120ms después de su hoja.
- **Nota adhesiva:** amarilla (o de tono), franja adhesiva, giro de -1.5 grados, sombra tinta.

### Movimiento
- Curvas: `--ease-snap` (cubic-bezier(0.2, 0.9, 0.1, 1)) para entradas y hovers; `--ease-spring` (cubic-bezier(0.34, 1.56, 0.64, 1)) para cursor, sellos, cintas y chips.
- Cortina de entrada: hoja magenta rasgada y tiras de tinta y papel en diagonal, 0.85s; sin puntero.
- Entradas: el hero entra escalonado desde la izquierda (28px); el resto se revela con desplazamiento lateral de 32px. El título se despliega y golpea; los trazos se dibujan; las capturas se descubren con un tajo dentado.
- Ligado al scroll donde existe `animation-timeline`: el número de sección se desliza, la cinta de progreso crece. Marquesina a rotulador en bucle de 28s.

## Do's and Don'ts

### Do:
- **Do** poner solo tinta sobre papel magenta (4.63:1); para letra clara usar magenta-deep con papel (5.78:1).
- **Do** usar tinta, tinta-muted o magenta-deep sobre papel, y solo tinta sobre lila.
- **Do** hacer que cualquier textura sobre un fondo cercano al umbral solo suba el contraste (motas claras en el magenta, medido ~#DB13D8).
- **Do** usar sombras sólidas desplazadas en plum (#5a1257) o tinta, 3px a 8px, sin desenfoque.
- **Do** recortar con `clip-path` en pseudo-elementos en todo lo interactivo, para que el foco quede entero.
- **Do** dar anillo de foco magenta-text con separación negra sobre cartulina, y anillo tinta sobre papel, magenta, notas, kraft y la banda lila.
- **Do** añadir cada par nuevo de texto y fondo a `npm run check:contrast`.
- **Do** dejar todo quieto y visible con `prefers-reduced-motion`: sin cortina, sin marquesina, sin parallax, sin entradas.

### Don't:
- **Don't** poner papel ni ink sobre magenta (3.71:1).
- **Don't** usar ink-muted sobre papel, ni tinta-muted o magenta-deep sobre lila.
- **Don't** usar Permanent Marker en párrafos, inputs, chips, código ni títulos largos de varias líneas; cargos y grados van en sans extrabold.
- **Don't** pasar de 3 adornos (brochazo, garabato, salpicadura) por pantalla; la cinta y las grapas no cuentan.
- **Don't** usar esquinas redondeadas, sombras difusas, vidrio, blur, glow ni neón.
- **Don't** aplicar skewX a contenedores altos: desbordan en móvil. El sesgo vive solo en la cortina a pantalla completa.
- **Don't** animar filtros ni el grano: el ruido es un `feTurbulence` estático.
- **Don't** usar grano oscuro sobre el papel magenta: lo apaga por debajo del umbral.
