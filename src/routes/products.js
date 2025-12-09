// src/routes/products.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController'); 
const { loadUser, checkRole } = require('../middleware/auth'); 

// --- Rutas CRUD de Productos con Permisos ---

// 1. LEER todos los productos (permiso para todos los usuarios logueados)
router.get('/', loadUser, productController.getAllProducts);

// 2. CREAR un producto (permiso para admin y bodeguero)
router.post('/', loadUser, checkRole(['Admin', 'Bodeguero']), productController.createProduct);

// 3. ACTUALIZAR un producto (permiso para admin y bodeguero)
router.put('/:id', loadUser, checkRole(['Admin', 'Bodeguero']), productController.updateProduct);

// 4. ELIMINAR un producto (permiso para admin y encargado de inventario)
router.delete('/:id', loadUser, checkRole(['Admin', 'Encargado de inventario']), productController.deleteProduct);

module.exports = router;