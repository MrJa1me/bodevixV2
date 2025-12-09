// src/routes/products.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController'); 
const { loadUser, checkPermission } = require('../middleware/auth'); 

// --- Rutas CRUD de Productos con Permisos ---

// 1. LEER todos los productos (permiso para todos los usuarios logueados)
router.get('/', loadUser, productController.getAllProducts);

// 2. CREAR un producto
// Crear producto: Admin (Gestionar Productos) o Bodeguero (Añadir Stock) para añadir cantidad
router.post('/', loadUser, checkPermission(['Gestionar Productos', 'Añadir Stock']), productController.createProduct);

// 3. ACTUALIZAR un producto
// Actualizar producto: solo Admin (Gestionar Productos)
router.put('/:id', loadUser, checkPermission('Gestionar Productos'), productController.updateProduct);

// 4. ELIMINAR un producto
// Eliminar/registrar salida: Admin (Gestionar Productos) o Encargado (Sacar Productos)
router.delete('/:id', loadUser, checkPermission(['Gestionar Productos', 'Sacar Productos']), productController.deleteProduct);

module.exports = router;