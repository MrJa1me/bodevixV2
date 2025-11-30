// src/routes/users.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); 
const { loadUser, checkRole } = require('../middleware/auth');

// Todas las rutas en este archivo requieren ser admin.
// Aplicamos los middlewares a nivel de router para no repetirlos.
router.use(loadUser, checkRole('Admin'));

// --- Rutas CRUD de Usuarios (Solo para Admins) ---

// GET /api/users -> Obtener todos los usuarios
router.get('/', userController.getAllUsers);

// PUT /api/users/:id -> Actualizar un usuario
router.put('/:id', userController.updateUser);

// DELETE /api/users/:id -> Eliminar un usuario
router.delete('/:id', userController.deleteUser);

// POST /api/users -> Crear un nuevo usuario (SOLO ADMIN)
router.post('/', userController.createUser);

module.exports = router;