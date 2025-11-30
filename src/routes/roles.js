// src/routes/roles.js
const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { loadUser, checkRole } = require('../middleware/auth');

// Obtener todos los roles (permiso para admin)
router.get('/', loadUser, checkRole(['Admin']), roleController.getAllRoles);

// Obtener los permisos de un rol específico
router.get('/:roleId/permisos', loadUser, checkRole(['Admin']), roleController.getRolePermissions);

// Actualizar los permisos de un rol específico
router.put('/:roleId/permisos', loadUser, checkRole(['Admin']), roleController.updateRolePermissions);

module.exports = router;
