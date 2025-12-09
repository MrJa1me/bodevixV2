// src/routes/locations.js
<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const { loadUser, checkPermission } = require('../middleware/auth');

// Todas las rutas en este archivo requieren el permiso 'Gestionar Ubicaciones'.
router.use(loadUser, checkPermission('Gestionar Ubicaciones'));

// --- Rutas CRUD de Ubicaciones ---
=======

const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const { loadUser, checkRole } = require('../middleware/auth');

// Todas las rutas en este archivo requieren ser admin.
// Aplicamos los middlewares a nivel de router para no repetirlos.
router.use(loadUser, checkRole('Admin'));

// --- Rutas CRUD de Ubicaciones (Solo para Admins) ---
>>>>>>> d4375837180d22a0f4540aa41f172f365d68471a

// GET /api/locations -> Obtener todas las ubicaciones
router.get('/', locationController.getAllLocations);

// POST /api/locations -> Crear una nueva ubicación
router.post('/', locationController.createLocation);

// PUT /api/locations/:id -> Actualizar una ubicación
router.put('/:id', locationController.updateLocation);

// DELETE /api/locations/:id -> Eliminar una ubicación
router.delete('/:id', locationController.deleteLocation);

module.exports = router;
