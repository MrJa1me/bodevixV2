// src/routes/roles.js
const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
<<<<<<< HEAD
const { loadUser, checkPermission } = require('../middleware/auth');

// Todas las rutas aquí deberían requerir el permiso de 'Gestionar Roles'
router.use(loadUser, checkPermission('Gestionar Roles'));

// Obtener todos los roles
router.get('/', roleController.getAllRoles);

// Obtener los permisos de un rol específico
router.get('/:roleId/permisos', roleController.getRolePermissions);

// Actualizar los permisos de un rol específico
router.put('/:roleId/permisos', roleController.updateRolePermissions);
=======
const { loadUser, checkRole } = require('../middleware/auth');

// Obtener todos los roles (permiso para admin)
router.get('/', loadUser, checkRole(['Admin']), roleController.getAllRoles);

// Obtener los permisos de un rol específico
router.get('/:roleId/permisos', loadUser, checkRole(['Admin']), roleController.getRolePermissions);

// Actualizar los permisos de un rol específico
router.put('/:roleId/permisos', loadUser, checkRole(['Admin']), roleController.updateRolePermissions);
>>>>>>> d4375837180d22a0f4540aa41f172f365d68471a

module.exports = router;
