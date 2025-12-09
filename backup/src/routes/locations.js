// src/routes/locations.js
const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const { loadUser, checkPermission } = require('../middleware/auth');

// Todas las rutas en este archivo requieren el permiso 'Gestionar Ubicaciones'.
router.use(loadUser, checkPermission('Gestionar Ubicaciones'));

// --- Rutas CRUD de Ubicaciones ---

// GET /api/locations -> Obtener todas las ubicaciones
router.get('/', locationController.getAllLocations);

// POST /api/locations -> Crear una nueva ubicación
router.post('/', locationController.createLocation);

// PUT /api/locations/:id -> Actualizar una ubicación
router.put('/:id', locationController.updateLocation);

// DELETE /api/locations/:id -> Eliminar una ubicación
router.delete('/:id', locationController.deleteLocation);

module.exports = router;
