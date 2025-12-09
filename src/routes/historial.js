// src/routes/historial.js
const express = require('express');
const router = express.Router();
const historialController = require('../controllers/historialController');
const { loadUser, checkPermission } = require('../middleware/auth');

// @route   GET api/historial
// @desc    Obtener todo el historial de movimientos
// @access  Private (Requiere permiso 'Ver Historial')
router.get('/', [loadUser, checkPermission('Ver Historial')], historialController.getHistory);

module.exports = router;
