// src/routes/categories.js
<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { loadUser, checkPermission } = require('../middleware/auth');

// Todas las rutas en este archivo requieren el permiso 'Gestionar Productos'.
router.use(loadUser, checkPermission('Gestionar Productos'));

// --- Rutas CRUD de Categorías ---
=======

const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { loadUser, checkRole } = require('../middleware/auth');

// Todas las rutas en este archivo requieren ser admin.
// Aplicamos los middlewares a nivel de router para no repetirlos.
router.use(loadUser, checkRole('Admin'));

// --- Rutas CRUD de Categorías (Solo para Admins) ---
>>>>>>> d4375837180d22a0f4540aa41f172f365d68471a

// GET /api/categories -> Obtener todas las categorías
router.get('/', categoryController.getAllCategories);

// POST /api/categories -> Crear una nueva categoría
router.post('/', categoryController.createCategory);

// PUT /api/categories/:id -> Actualizar una categoría
router.put('/:id', categoryController.updateCategory);

// DELETE /api/categories/:id -> Eliminar una categoría
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
