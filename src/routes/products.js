// src/routes/products.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController'); 
<<<<<<< HEAD
const { loadUser, checkPermission } = require('../middleware/auth'); 
=======
const { loadUser, checkRole } = require('../middleware/auth'); 
>>>>>>> d4375837180d22a0f4540aa41f172f365d68471a

// --- Rutas CRUD de Productos con Permisos ---

// 1. LEER todos los productos (permiso para todos los usuarios logueados)
router.get('/', loadUser, productController.getAllProducts);

<<<<<<< HEAD
// 2. CREAR un producto
// Crear producto: Admin (Gestionar Productos) o Bodeguero (Añadir Stock) para añadir cantidad
router.post('/', loadUser, checkPermission(['Gestionar Productos', 'Añadir Stock']), productController.createProduct);

// 3. ACTUALIZAR un producto
// Actualizar producto: solo Admin (Gestionar Productos)
router.put('/:id', loadUser, checkPermission('Gestionar Productos'), productController.updateProduct);

// 4. ELIMINAR un producto
// Eliminar/registrar salida: Admin (Gestionar Productos) o Encargado (Sacar Productos)
router.delete('/:id', loadUser, checkPermission(['Gestionar Productos', 'Sacar Productos']), productController.deleteProduct);
=======
// 2. CREAR un producto (permiso para admin y bodeguero)
router.post('/', loadUser, checkRole(['Admin', 'Bodeguero']), productController.createProduct);

// 3. ACTUALIZAR un producto (permiso para admin y bodeguero)
router.put('/:id', loadUser, checkRole(['Admin', 'bodeguero']), productController.updateProduct);

// 4. ELIMINAR un producto (permiso para admin y encargado de inventario)
router.delete('/:id', loadUser, checkRole(['Admin', 'Encargado de inventario']), productController.deleteProduct);
>>>>>>> d4375837180d22a0f4540aa41f172f365d68471a

module.exports = router;