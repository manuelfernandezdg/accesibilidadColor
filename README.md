# Contrast Checker
 
Una herramienta para evaluar el contraste de color entre fondo y figura según los criterios de accesibilidad de la WAI-WCAG.
 
---
 
## ¿Para qué sirve?
 
Cuando diseñamos interfaces, elegir colores que se vean bien no siempre es suficiente. Una combinación visualmente atractiva puede resultar ilegible para personas con baja visión, daltonismo o quienes usan pantallas en condiciones de luz adversa. Esta app permite ingresar dos valores hexadecimales —uno para el fondo, otro para el texto o figura— y obtener de inmediato el ratio de contraste y su nivel de conformidad según la WCAG.
 
## Funcionalidades
 
- Ingreso de colores en formato hexadecimal (#RRGGBB)
- Selector de color nativo del navegador como alternativa visual
- Sliders de Hue, Saturation y Lightness (HSL) para ajustar cada color con precisión
- Vista previa en tiempo real con texto grande, texto normal y figura circular
- Cálculo del ratio de contraste basado en luminancia relativa (fórmula oficial WCAG)
- Rating automático en niveles A, AA y AAA
---
 
## La WAI y las WCAG
 
La **Web Accessibility Initiative (WAI)** es una rama del W3C dedicada a desarrollar estándares y materiales de apoyo para hacer la web accesible a personas con discapacidad. Su trabajo más influyente son las **Web Content Accessibility Guidelines (WCAG)**, una serie de pautas técnicas organizadas en tres niveles de conformidad.
 
### Niveles de conformidad
 
| Nivel | Texto normal | Texto grande* | Descripción |
|-------|-------------|---------------|-------------|
| **A** | 3.0 : 1 | 3.0 : 1 | Mínimo absoluto. Cubre solo los casos más básicos. |
| **AA** | 4.5 : 1 | 3.0 : 1 | Estándar recomendado. Es el umbral exigido por la mayoría de las regulaciones de accesibilidad. |
| **AAA** | 7.0 : 1 | 4.5 : 1 | Nivel óptimo. Garantiza legibilidad en condiciones difíciles y para usuarios con visión reducida. |
 
*Texto grande: 18pt o más, o 14pt en negrita.*
 
### Cómo se calcula el ratio
 
El ratio de contraste se obtiene comparando la **luminancia relativa** de dos colores. La luminancia es una medida de cuánta luz percibe el ojo humano a partir de un color dado, teniendo en cuenta que somos más sensibles al verde y menos al azul.
 
```
Ratio = (L1 + 0.05) / (L2 + 0.05)
```
 
Donde `L1` es la luminancia del color más claro y `L2` la del más oscuro. El resultado va de 1:1 (sin contraste, colores idénticos) hasta 21:1 (negro sobre blanco).
 
---
 
## Tecnologías
 
Vanilla HTML, CSS y JavaScript. Sin dependencias externas. Un solo archivo.
 
## Uso
 
Abrir `contrast-checker.html` directamente en cualquier navegador moderno.