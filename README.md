# Accesibilidad y color

Herramienta web estática (sin framework ni build) para evaluar el **contraste de color** entre fondo, figura y acento según los criterios de accesibilidad de la **WAI-WCAG**, con simulación de daltonismo y una salida CSS lista para copiar.

**Ver en vivo:** <span style="color:#FF843D">→</span> [manuelfernandezdg.github.io/accesibilidadColor](https://manuelfernandezdg.github.io/accesibilidadColor/)

---

## ¿Para qué sirve?

Cuando diseñamos interfaces, elegir colores que se vean bien no siempre es suficiente. Una combinación visualmente atractiva puede resultar ilegible para personas con baja visión, daltonismo o quienes usan pantallas en condiciones de luz adversa.

La app trabaja con **tres colores** —fondo, figura/texto y acento— y devuelve en tiempo real:

- el **ratio de contraste** y su **nivel de conformidad** según la WCAG,
- el nivel del **acento no textual** (WCAG 1.4.11),
- una **simulación de daltonismo** para cada tipo de CVD,
- una **salida CSS** con los tres colores como tokens y estilos de muestra.

Colores de prueba por defecto:

- Fondo: `#030B16` <span style="background:#030B16">&nbsp;&nbsp;&nbsp;&nbsp;</span>
- Figura: `#CFD7E2` <span style="background:#CFD7E2">&nbsp;&nbsp;&nbsp;&nbsp;</span>
- Acento: `#FF843D` <span style="background:#FF843D">&nbsp;&nbsp;&nbsp;&nbsp;</span>

## Funcionalidades

- Tres colores independientes (fondo, figura/texto y acento), cada uno con input hex, selector nativo del navegador y sliders **HSL**.
- Vista previa en vivo: titular, párrafo, botón y enlace, con los ratios de contraste en el encabezado.
- **Ratio de contraste** por luminancia relativa (fórmula oficial WCAG), tanto para el texto como para el acento.
- **Rating automático** en niveles A, AA y AAA + nivel del acento (WCAG 1.4.11).
- **Simulación de daltonismo** (CVD): protanopia, deuteranopia, tritanopia y sus variantes.
- Tabla de referencia con los criterios de contraste de la WCAG 2.1.
- **Salida CSS** con los colores como tokens y estilos de muestra para titular, párrafo, botón y enlace, con botón para copiar.

---

## La WAI y las WCAG

La **Web Accessibility Initiative (WAI)** es una rama del W3C dedicada a desarrollar estándares y materiales de apoyo para hacer la web accesible a personas con discapacidad. Su trabajo más influyente son las **Web Content Accessibility Guidelines (WCAG)**, una serie de pautas técnicas organizadas en tres niveles de conformidad.

### Niveles de conformidad

| Nivel | Texto normal | Texto grande* | Uso recomendado |
|-------|-------------|---------------|-----------------|
| **A** | <span style="color:#FFC64D">3.0 : 1</span> | <span style="color:#FFC64D">3.0 : 1</span> | Mínimo aceptable, solo en casos muy específicos |
| **AA** | <span style="color:#1AFF98">4.5 : 1</span> | <span style="color:#FFC64D">3.0 : 1</span> | Estándar recomendado para la mayoría de interfaces |
| **AAA** | <span style="color:#4DC1FF">7.0 : 1</span> | <span style="color:#1AFF98">4.5 : 1</span> | Máxima accesibilidad, ideal para texto crítico |

*Texto grande: 18pt o más, o 14pt en negrita.*

### Cómo se calcula el ratio

El ratio de contraste se obtiene comparando la **luminancia relativa** de dos colores. La luminancia es una medida de cuánta luz percibe el ojo humano a partir de un color dado, teniendo en cuenta que somos más sensibles al verde y menos al azul.

```
Ratio = (L1 + 0.05) / (L2 + 0.05)
```

Donde `L1` es la luminancia del color más claro y `L2` la del más oscuro. El resultado va de 1:1 (sin contraste, colores idénticos) hasta 21:1 (negro sobre blanco).

El **acento** se evalúa contra el fondo con el mismo cálculo (criterio **1.4.11** para componentes no textuales).

---

## Simulación de daltonismo

La simulación aplica matrices de confusión a los tres colores y recalcula todos los ratios, para ver cómo se comporta la paleta ante distintos tipos de deficiencia de visión del color:

| Tipo | Aproximación |
|------|--------------|
| Protanopia | Sin rojo · ~1% ♂ |
| Deuteranopia | Sin verde · ~1% ♂ |
| Tritanopia | Sin azul · ~0.01% |
| Protanomalía | Rojo débil · ~1% ♂ |
| Deuteranomalía | Verde débil · ~5% ♂ |
| Acromatopsia | Sin color · muy raro |

## Salida CSS

Al final de la página, el módulo **Salida CSS** genera en vivo un snippet con los tres colores como tokens y estilos de muestra:

```css
:root {
  --bg: #030B16;
  --fg: #CFD7E2;
  --ac: #FF843D;
}

h1, .titular {
  color: var(--ac);
  font-size: 2rem;
  line-height: 1.3;
}

p, .parrafo {
  color: var(--fg);
  font-size: 1rem;
  line-height: 1.7;
}

button, .boton {
  background: var(--ac);
  color: var(--bg);
  border: 2px solid var(--ac);
  border-radius: 0.375rem;
  padding: 0.5rem 1.125rem;
  font: inherit;
}

a, .link {
  color: var(--ac);
  border-bottom: 1.5px solid var(--ac);
  text-decoration: none;
}
```

El botón **Copiar** copia el snippet completo al portapapeles.

---

## Paleta del sistema

La interfaz usa tokens CSS en `:root` (capa `tokens`). Los mismos colores que ves en la app:

### Acento y niveles

| Token | Descripción | Muestra |
|-------|-------------|---------|
| `--accent` | Acento | `#FF843D` <span style="background:#FF843D">&nbsp;&nbsp;&nbsp;&nbsp;</span> |
| `--accent2` | Acento claro | `#FFB88F` <span style="background:#FFB88F">&nbsp;&nbsp;&nbsp;&nbsp;</span> |
| `--pass-a` | Nivel A | `#FFC64D` <span style="background:#FFC64D">&nbsp;&nbsp;&nbsp;&nbsp;</span> |
| `--pass-aa` | Nivel AA | `#1AFF98` <span style="background:#1AFF98">&nbsp;&nbsp;&nbsp;&nbsp;</span> |
| `--pass-aaa` | Nivel AAA | `#4DC1FF` <span style="background:#4DC1FF">&nbsp;&nbsp;&nbsp;&nbsp;</span> |
| `--danger` | Errores / fail | `#FF6B6B` <span style="background:#FF6B6B">&nbsp;&nbsp;&nbsp;&nbsp;</span> |

### Texto y superficies

| Token | Descripción | Muestra |
|-------|-------------|---------|
| `--bg` | Fondo de la interfaz | `#1B1C1D` <span style="background:#1B1C1D">&nbsp;&nbsp;&nbsp;&nbsp;</span> |
| `--surface` | Superficie de paneles | `#070808` <span style="background:#070808">&nbsp;&nbsp;&nbsp;&nbsp;</span> |
| `--surface2` | Superficies hundidas | `#0C0D0D` <span style="background:#0C0D0D">&nbsp;&nbsp;&nbsp;&nbsp;</span> |
| `--border` | Bordes de componentes | `#24354C` <span style="background:#24354C">&nbsp;&nbsp;&nbsp;&nbsp;</span> |
| `--text` | Texto principal | `#CFD7E2` <span style="background:#CFD7E2">&nbsp;&nbsp;&nbsp;&nbsp;</span> |
| `--text3` | Texto secundario | `#8A96A8` <span style="background:#8A96A8">&nbsp;&nbsp;&nbsp;&nbsp;</span> |

## Uso

No requiere instalación ni build: abrir `index.html` en el navegador o verlo publicado en [GitHub Pages](https://manuelfernandezdg.github.io/accesibilidadColor/). Todo el estilado vive en `css/estilos.css` y la lógica en `js/app.js`.
