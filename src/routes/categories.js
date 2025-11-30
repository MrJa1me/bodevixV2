// src/routes/categories.js

const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { loadUser, checkRole } = require('../middleware/auth');

// Todas las rutas en este archivo requieren ser admin.
// Aplicamos los middlewares a nivel de router para no repetirlos.
router.use(loadUser, checkRole('Admin'));

// --- Rutas CRUD de Categorías (Solo para Admins) ---

// GET /api/categories -> Obtener todas las categorías
router.get('/', categoryController.getAllCategories);

// POST /api/categories -> Crear una nueva categoría
router.post('/', categoryController.createCategory);

// PUT /api/categories/:id -> Actualizar una categoría
router.put('/:id', categoryController.updateCategory);

// DELETE /api/categories/:id -> Eliminar una categoría
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
