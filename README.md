Bodevix - Demo local

Descripción:
Aplicación web simple (front-end) para gestionar un inventario localmente usando localStorage. Cubre historias básicas: login (perfil simple), agregar/editar/eliminar productos, registrar movimientos de entrada/salida, filtros por categoría, vista lista, totales y alertas de stock bajo.

Cómo usar:
1. Backend + Frontend (modo desarrollo con Node):

    - Nota: esta versión no usa archivos `.env`. Si quieres sobrescribir valores puedes exportar variables de entorno en tu entorno de ejecución (por ejemplo PORT, JWT_SECRET).
    - Instala dependencias:

```powershell
npm install
```

    - Inicia el servidor en modo desarrollo (nodemon):

```powershell
npm run dev
```

    - Abre http://localhost:3000 en tu navegador.

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

Comprobación rápida de la autenticación JWT:

1. Registra un usuario con POST /api/auth/register (puedes usar una herramienta como Postman o curl).
2. Llama POST /api/auth/login con username/password, recibirás { token, perfil }.
3. Guarda el token y llama GET /api/auth/me o GET /api/products con header Authorization: Bearer <token> para verificar el acceso protegido.

Ejemplos (curl) rápidos:

1) Registrar usuario (crear primer usuario):

```bash
curl -X POST http://localhost:3000/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"username":"admin","password":"changeme","perfil":"admin"}'
```

2) Login + obtener token:

```bash
curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"admin","password":"changeme"}'

# Respuesta: { "token": "<JWT>", "perfil":"admin" }
```

3) Llamar a /api/auth/me o a /api/products con el token:

```bash
curl http://localhost:3000/api/auth/me -H "Authorization: Bearer <JWT>"
curl http://localhost:3000/api/products -H "Authorization: Bearer <JWT>"
```



Créditos: Proyecto de ejemplo "Bodevix".