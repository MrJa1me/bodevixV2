// src/routes/users.js
<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); 
const { loadUser, checkPermission } = require('../middleware/auth');

// Todas las rutas en este archivo requieren el permiso 'Gestionar Usuarios'.
router.use(loadUser, checkPermission('Gestionar Usuarios'));

// --- Rutas CRUD de Usuarios ---
=======

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); 
const { loadUser, checkRole } = require('../middleware/auth');

// Todas las rutas en este archivo requieren ser admin.
// Aplicamos los middlewares a nivel de router para no repetirlos.
router.use(loadUser, checkRole('Admin'));

// --- Rutas CRUD de Usuarios (Solo para Admins) ---
>>>>>>> d4375837180d22a0f4540aa41f172f365d68471a

// GET /api/users -> Obtener todos los usuarios
router.get('/', userController.getAllUsers);

// PUT /api/users/:id -> Actualizar un usuario
router.put('/:id', userController.updateUser);

// DELETE /api/users/:id -> Eliminar un usuario
router.delete('/:id', userController.deleteUser);

<<<<<<< HEAD
// POST /api/users -> Crear un nuevo usuario
=======
// POST /api/users -> Crear un nuevo usuario (SOLO ADMIN)
>>>>>>> d4375837180d22a0f4540aa41f172f365d68471a
router.post('/', userController.createUser);

module.exports = router;