// src/routes/historial.js
const express = require('express');
const router = express.Router();
const historialController = require('../controllers/historialController');
const { loadUser, checkRole } = require('../middleware/auth');

// @route   GET api/historial
// @desc    Obtener todo el historial de movimientos
// @access  Private (Admin, Encargado de inventario)
router.get('/', loadUser, checkRole(['Admin', 'Encargado de inventario']), historialController.getHistory);

module.exports = router;
