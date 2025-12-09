Bodevix - Demo web

Descripción:
Aplicación web de gestión de inventario (Express + SQLite + Sequelize) con frontend estático (Bootstrap + Chart.js). Incluye autenticación simple, roles y permisos, historial de movimientos y visualizaciones (dashboard).

**Cómo usar**
- **Instalar dependencias:**

```powershell
npm install
```

- **Sembrar y ejecutar (desarrollo, reinicia la DB):**

```powershell
# ESTE SCRIPT RECREA LA DB (usa sync({force:true}))
node .\scripts\seedUsersAndProducts.js
npm run dev
```

- **Alternativa no destructiva:**
  - Si no quieres reiniciar la BD, usa los scripts no destructivos adicionales:
    - `scripts/assignCreators.js` — asigna `usuarioCreadorId` a productos que lo faltan (no reinicia DB).
    - `scripts/seedHistorialMovements.js` — genera movimientos de historial (no reinicia DB).

**Scripts añadidos**
- `scripts/seedUsersAndProducts.js` — crea roles/usuarios legibles (admin, juan, ana, maria, lector), ubicaciones, categorías y productos; asigna `usuarioCreadorId` y registra entradas en `Historial`.
- `scripts/assignCreators.js` — asigna `usuarioCreadorId` a productos existentes que no lo tengan (usa un usuario Admin si hace falta).
- `scripts/seedHistorialMovements.js` — crea movimientos de historial aleatorios (entradas, salidas, ajustes) y actualiza las cantidades de productos.

**Endpoints útiles**
- `GET /api/products` — lista productos activos.
- `POST /api/products` — crear producto (solo Admin).
- `PUT /api/products/:id` — actualizar producto.
- `DELETE /api/products/:id` — eliminar (soft-delete) o registrar salida parcial según rol.
- `GET /api/historial` — ver historial de movimientos.

**Roles y permisos (resumen)**
- `Admin`: puede crear/reactivar/eliminar productos, gestionar roles/usuarios y ver todo.
- `Bodeguero`: puede añadir stock a productos existentes, pero solo si esos productos fueron creados por un Admin.
- `Encargado de inventario`: puede registrar salidas parciales (con razón) y ver dashboard/historial; también sólo sobre productos creados por Admin.
- `Vendedor independiente`: permisos cercanos a Admin excepto gestionar roles/usuarios.
- `Lector`: solo visualización.

**Notas móviles**
- Interfaz adaptativa: añadí mejoras CSS para móviles (badges en navbar, canvases responsivos, modales casi fullscreen). El menú Admin dentro del toggle está mostrado como lista apilada en móviles para facilitar el acceso.

**Precauciones**
- Muchos scripts de seed usan `connectDB(models)` que ejecuta `sync({ force: true })` y recrea la base de datos. Haz copia de `bodega.sqlite` si quieres preservar datos.
- Los scripts que no recrean la DB (`assignCreators.js`, `seedHistorialMovements.js`) solo actualizan datos existentes.

**Cómo probar en teléfono**
1. Ejecuta el servidor en tu PC: `npm run dev`.
2. Encuentra la IP local de tu PC (ej. `192.168.1.50`) y abre en el teléfono: `http://192.168.1.50:3000`.
3. Usa las credenciales creadas por el seed (`admin`, `juan`, `ana`, `maria`, `lector`) para probar roles.

**Ejecutar solo historial (ejemplo)**
```powershell
# Genera 30 movimientos en el historial y actualiza cantidades
node .\scripts\seedHistorialMovements.js
```

**Sugerencias / mejoras futuras**
- Añadir un script no destructivo para sincronizar permisos/roles en bases existentes.
- Mostrar el `creador` en la vista de producto en el frontend.
- Añadir tests automáticos y un pipeline de CI.

Créditos: Proyecto de ejemplo "Bodevix" — Nicolás Guajardo y colaboradores.
