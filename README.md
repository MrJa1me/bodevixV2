Bodevix - Demo local

Descripción:
Aplicación web simple (front-end) para gestionar un inventario localmente usando localStorage. Cubre historias básicas: login (perfil simple), agregar/editar/eliminar productos, registrar movimientos de entrada/salida, filtros por categoría, vista lista, totales y alertas de stock bajo.

Cómo usar:
1. Abrir `index.html` en un navegador moderno (Chromium/Edge/Firefox). Para un servidor local simple en PowerShell puedes ejecutar:

    python -m http.server 8000 --bind 127.0.0.1

Luego abrir http://127.0.0.1:8000 en tu navegador.

Características implementadas:
- Login básico (se guarda el nombre de usuario en localStorage).
- CRUD de productos (id, nombre, categoría, cantidad, precio, ubicación, descripción, umbral de alerta).
- Filtros por categoría y búsqueda por nombre/descripción.
- Registro de movimientos (entradas/salidas) y historial.
- Totales: número total de unidades y costo total.
- Alerta visual para productos con stock por debajo del umbral.

Limitaciones y siguientes pasos:
- Esta es una app puramente cliente; para multiusuario real o persistencia compartida necesitarás un backend.
- Se pueden añadir export/import CSV, autenticación real, y tests.

Créditos: Proyecto de ejemplo "Bodevix".