# Secciones de la página de Inicio

Listado de las secciones de la home (`apps/web/src/app/page.tsx`), en el orden exacto en que aparecen. Solo contenido — sin detalles de diseño.

## 1. Hero

- Etiqueta corta sobre el título ("eyebrow").
- Título principal (dos partes: inicio + acento).
- Descripción corta.
- Botón de WhatsApp con mensaje predefinido.
- Línea de confianza (ícono + texto corto).
- Foto principal de clientes reales.
- Hasta 3 fotos secundarias adicionales (recuerdos de otros viajes).

## 2. Promociones Destacadas

- Etiqueta: "02 · Viajes para empezar a imaginar"
- Título: "Algunas formas de vivir tu próximo viaje"
- Subtítulo explicativo.
- Enlace de texto "Ver todas las promociones" — lleva a la página de
  Facebook de la agencia (las promociones no tienen página propia en el
  sitio, el catálogo completo se administra en Facebook).
- Ilustración decorativa (no fotográfica) detrás de la promoción
  destacada.
- 1 promoción destacada + hasta 2 promociones secundarias:
  - Destacada: destino, título, resumen, precio en USD y duración
    (días/noches), botón de WhatsApp para cotizar ese paquete.
  - Secundarias (sin foto, estilo "boleto"): destino, título, resumen,
    precio, enlace de texto "Conocer" que también lleva a Facebook.

## 3. Inspiración desde el Blog

- Etiqueta configurable (default: "Inspiración para tu viaje").
- Título configurable en dos partes (default: "Consejos y guías" + "para explorar el mundo").
- Subtítulo configurable.
- 1 artículo destacado + hasta 2 artículos secundarios, cada uno con:
  - Foto de portada, categoría (eyebrow), título, resumen.
  - Tiempo estimado de lectura.
  - Enlace "Leer guía completa" a la nota individual.
  - Badge "Destacado" en el artículo principal.
- Botón de cierre configurable (default: "Ver todos los artículos del blog", enlaza a `/blog`).

## 4. Testimonios y Experiencias de Clientes

- Etiqueta: "Viajeros Satisfechos"
- Título: "Historias y experiencias que nos respaldan"
- Subtítulo: "La tranquilidad de nuestros clientes es nuestro mayor orgullo."
- 1 testimonio protagonista + hasta 2 testimonios de apoyo, cada uno con:
  - Comentario del cliente.
  - Foto/avatar (o inicial del nombre si no hay foto).
  - Calificación en estrellas.
  - Nombre del cliente, destino del viaje y ubicación del cliente.

## 5. Preguntas Frecuentes (FAQ)

- Etiqueta: "Antes de dar el siguiente paso"
- Título: "Preguntas frecuentes sobre tu próximo viaje"
- Subtítulo: "Resolvemos tus principales inquietudes sobre formas de pago, asesoría y planificación."
- Lista de preguntas y respuestas (acordeón, la primera abierta por defecto).
- Cierre: "¿No encuentras tu respuesta?" + enlace de WhatsApp "Pregúntale a una asesora".

---

El cierre y llamado a la acción final ("Llegaste hasta aquí. ¿Hacia dónde
seguimos?" + CTA de WhatsApp) ya no es una sección propia de Inicio — vive
integrado en el Footer (`packages/ui/src/layout/Footer.tsx`), que se
renderiza en `apps/web/src/app/layout.tsx` y es compartido por todas las
páginas del sitio, no solo Inicio.
