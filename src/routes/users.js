// src/routes/users.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); 
const { loadUser, checkPermission } = require('../middleware/auth');

// Todas las rutas en este archivo requieren el permiso 'Gestionar Usuarios'.
router.use(loadUser, checkPermission('Gestionar Usuarios'));

// --- Rutas CRUD de Usuarios ---

// GET /api/users -> Obtener todos los usuarios
router.get('/', userController.getAllUsers);

// PUT /api/users/:id -> Actualizar un usuario
router.put('/:id', userController.updateUser);

// DELETE /api/users/:id -> Eliminar un usuario
router.delete('/:id', userController.deleteUser);

// POST /api/users -> Crear un nuevo usuario
router.post('/', userController.createUser);

module.exports = router;