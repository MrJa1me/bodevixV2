```markdown
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

```powershell
npm install
```

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