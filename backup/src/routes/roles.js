// src/routes/roles.js
const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { loadUser, checkPermission } = require('../middleware/auth');

// Todas las rutas aquí deberían requerir el permiso de 'Gestionar Roles'
router.use(loadUser, checkPermission('Gestionar Roles'));

// Obtener todos los roles
router.get('/', roleController.getAllRoles);

// Obtener los permisos de un rol específico
router.get('/:roleId/permisos', roleController.getRolePermissions);

// Actualizar los permisos de un rol específico
router.put('/:roleId/permisos', roleController.updateRolePermissions);

module.exports = router;
