// src/routes/historial.js
const express = require('express');
const router = express.Router();
const historialController = require('../controllers/historialController');
<<<<<<< HEAD
const { loadUser, checkPermission } = require('../middleware/auth');

// @route   GET api/historial
// @desc    Obtener todo el historial de movimientos
// @access  Private (Requiere permiso 'Ver Historial')
router.get('/', [loadUser, checkPermission('Ver Historial')], historialController.getHistory);
=======
const { loadUser, checkRole } = require('../middleware/auth');

// @route   GET api/historial
// @desc    Obtener todo el historial de movimientos
// @access  Private (Admin, Encargado de inventario)
router.get('/', loadUser, checkRole(['Admin', 'Encargado de inventario']), historialController.getHistory);
>>>>>>> d4375837180d22a0f4540aa41f172f365d68471a

module.exports = router;
