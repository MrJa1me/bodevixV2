<<<<<<< HEAD
Bodevix - Demo web

Descripción:
Aplicación web de gestión de inventario (Express + SQLite + Sequelize) con frontend estático (Bootstrap + Chart.js). Incluye autenticación simple, roles y permisos, historial de movimientos y visualizaciones (dashboard).

**Cómo usar**
- **Instalar dependencias:**
=======


# Bodevix — Demo local (Backend + Frontend)

Aplicación de inventario con frontend estático (carpeta `public/`) y backend en Node + Express + Sequelize (SQLite).

Resumen rápido
- Backend: `bodevix3/app.js` — expone API HTTP en /api/* y sirve el frontend localizado en `public/`.
- Base de datos: SQLite (archivo `bodega.sqlite` en la raíz del proyecto `bodevix3/`).

Requisitos
- Node.js 16+ (o compatible). Comprueba con `node -v`.

Instalación y ejecución
1. Abre una terminal y sitúate en la carpeta del proyecto:

```powershell
cd "C:\Users\...\bodevix3 (4)\bodevix3"
```

2. Instala dependencias:
>>>>>>> d4375837180d22a0f4540aa41f172f365d68471a

```powershell
npm install
```

<<<<<<< HEAD
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
=======
3. Ejecuta la app:

- En producción:

```powershell
npm start
```

- En desarrollo (reinicio automático con nodemon):

```powershell
npm run dev
```

Abre en tu navegador: http://localhost:3000

Dónde está la base de datos
- El archivo SQLite se crea y usa en: `bodevix3/bodega.sqlite`.
- La app sincroniza los modelos al arrancar (Sequelize `sync({ alter: true })`).
- Al iniciar, el sistema crea roles por defecto si no existen: `Admin`, `Bodeguero`, `Encargado de inventario`, `Vendedor independiente`, `Lector`.

Autenticación y permisos (nota importante)
- Actual: la API utiliza un mecanismo simplificado para desarrollo. NO hay tokens JWT por ahora.
- Para simular un usuario autenticado, incluye la cabecera HTTP `X-User` con el username en las peticiones.
- Ejemplo: `X-User: admin` — el middleware `loadUser` buscará al usuario en la tabla `Usuarios` y rellenará `req.user`.

Crear usuarios
- Puedes crear usuarios mediante la ruta API:

  POST /api/auth/register

  Body (JSON): { "username": "nombre", "roleId": 1 }

  - `roleId` debe existir (los roles por defecto empiezan en 1).

- O usa los scripts útiles en `scripts/`:
  - `node scripts/createNewUser.js` — crear un usuario (el ejemplo del script crea `admin` con rol `Admin`).
  - `node scripts/updateAdminRole.js` — actualizar un usuario para que sea Admin.

Rutas importantes (resumen)
- GET /api/products  (Requiere cabecera `X-User` — cualquier usuario autenticado puede leer)
- POST /api/products (Requiere `X-User` con rol `Admin` o `Bodeguero`)
- PUT /api/products/:id (Requiere `X-User` con rol `Admin` o `Bodeguero`)
- DELETE /api/products/:id (Requiere `X-User` con rol `Admin` o `Encargado de inventario`)
- POST /api/auth/register  (crear usuario — prueba simple)
- GET /api/auth/me  (devuelve información del usuario indicado en `X-User`)

Ejemplos rápidos (curl / PowerShell)

1) Crear usuario (registro simplificado):

```powershell
curl -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d '{"username":"admin","roleId":1}'
```

2) Consultar el usuario actual (usa la cabecera X-User):

```powershell
curl http://localhost:3000/api/auth/me -H "X-User: admin"
```

3) Obtener productos (ejemplo):

```powershell
curl http://localhost:3000/api/products -H "X-User: admin"
```

Consejos y resolución de errores comunes
- Error "Cannot find module app.js" — asegúrate de ejecutar `node app.js` desde la carpeta `bodevix3` (no desde la raíz del workspace). Por eso: `cd bodevix3; npm start`.
- Si la DB no se crea, revisa permisos en la carpeta y asegúrate de que `Sequelize` puede escribir el archivo `bodega.sqlite`.
- La app crea roles por defecto al arrancar; si necesitas crear un usuario de prueba llama `node scripts/createNewUser.js`.

Estado y limitaciones
- Esta es una aplicación demo y NO debe usarse en producción tal cual: autenticar con JWT o sesiones y añadir validación/hasheo de contraseñas es necesario para un entorno real.

Contribuciones y mejoras sugeridas
- Añadir JWT o autenticación basada en sesiones.
- Validaciones más estrictas y pruebas automatizadas.
- Añadir un migrador y backups para SQLite o migrar a PostgreSQL para producción.

---
Créditos: Ejemplo Bodevix — autor: MrJa1me
```
=======
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

Créditos: Proyecto de "Nicolas Guajardo G. Y Grupo 9".
>>>>>>> d4375837180d22a0f4540aa41f172f365d68471a
