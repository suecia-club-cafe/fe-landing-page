# Suecia Club Café — landing page

Landing en Next.js para Suecia Club Café, con hero en video, navegación glass, catálogo filtrable, comunidad, links/QR, mapa y carta imprimible.

## Ejecutar

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`.

## Catálogo y futura conexión con Sanity

La fuente local actual está en `data/catalog.ts`. Toda la web consume esa estructura a través de `lib/catalog.ts`.

- `/carta` obtiene productos y categorías desde `getCatalog()`.
- La versión PDF **no es un archivo estático**. El botón `Generar carta en PDF` imprime una vista A4 creada desde exactamente los mismos productos y categorías que recibe `/carta`.
- El navegador abre su vista de impresión; desde ahí se elige **Guardar como PDF**. Así no existe una segunda carta que pueda quedar desactualizada y tampoco se necesita una librería PDF en el servidor.
- `/api/carta-pdf` se conserva únicamente como ruta legacy y redirige a `/carta`, evitando romper enlaces antiguos.

Cuando se conecte Sanity, solo hay que cambiar `lib/catalog.ts` para devolver los productos del CMS con la misma forma de datos. El catálogo web y la carta imprimible se actualizarán juntos.

## Scroll

El scroll de escritorio replica la configuración usada en el proyecto de Karin (`lerp 0.18`, multiplicador de rueda `1.15`), pero está implementado localmente para no añadir una dependencia adicional. Un gesto de rueda alimenta un único destino continuo; no existe el antiguo reparto entre desplazamiento inmediato + cola tardía.

En táctil, móvil o `prefers-reduced-motion`, se deja el scroll nativo.

## V7 — logo SVG animado y foto del letrero

- El isotipo se reconstruye con tres SVG superpuestos en `components/BrandMark.tsx`.
- `suecia-static.svg` permanece inmóvil.
- `suecia-tick-ring.svg` gira en sentido horario.
- `suecia-origin-ring.svg` gira en sentido antihorario.
- El mismo componente se usa en el Hero, la sección/página de Links y el footer.
- La fotografía real del letrero de neón se usa como una pausa editorial de gran formato entre Clientes y Links (`.neon-signature`).


## V8 — cierre de landing

La sección **01 / El Club** fue rediseñada como una composición editorial completa con video real del local, mensaje de marca visible sin depender del wipe animation y chips de contexto (café, horario y ubicación).

## V9 - carta PDF alojada y QR estable

- La carta publicada vive en `public/carta-suecia-club-cafe.pdf`.
- Todos los QR de la carta apuntan a `/api/carta-pdf`, no al nombre físico del archivo. Así el QR puede imprimirse una sola vez y la ruta seguirá siendo válida cuando luego se conecte Sanity.
- Hoy `/api/carta-pdf` redirige al PDF estático. En una fase CMS, esa ruta puede regenerar/publicar la última carta sin cambiar enlaces ni QR.
- `data/catalog.json` es ahora la fuente local única de productos. `data/catalog.ts` la tipa para Next.js y `scripts/generate_static_catalog_pdf.py` lee el mismo JSON para publicar el PDF actual.
- El QR de Carta se genera usando el origen real del sitio en el navegador, por lo que al desplegarlo apuntará automáticamente al dominio final.

## V9 - navegación y galería orbital

- `Inicio` aparece en la navegación. Dentro de `/` usa `#inicio` (sin loader); desde `/carta` usa `/#inicio`, por lo que sí activa la transición de ruta.
- El cálculo de anchors mide la primera fila real de contenido de cada sección. No suma un offset fijo encima del padding que ya tenga la propia sección.
- La galería circular está integrada dentro del capítulo Clientes y mezcla clientes + productos alrededor del BrandMark. En móvil se convierte en un rail horizontal para conservar usabilidad.
