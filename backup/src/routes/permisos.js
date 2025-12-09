// src/routes/permisos.js
const express = require('express');
const router = express.Router();
const permisoController = require('../controllers/permisoController');
const { loadUser, checkPermission } = require('../middleware/auth');

// Obtener todos los permisos (requiere permiso 'Gestionar Roles')
router.get('/', [loadUser, checkPermission('Gestionar Roles')], permisoController.getAllPermisos);

module.exports = router;
