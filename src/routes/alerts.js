// src/routes/alerts.js

const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');
const { loadUser, checkRole } = require('../middleware/auth');

// @route   GET /api/alerts
// @desc    Obtener todas las alertas activas
// @access  Private (Admin, Bodeguero, Encargado de inventario)
router.get('/', loadUser, checkRole(['Admin', 'Bodeguero', 'Encargado de inventario']), alertController.getActiveAlerts);

// @route   PUT /api/alerts/:id/resolve
// @desc    Resolver una alerta (marcar como inactiva)
// @access  Private (Admin, Encargado de inventario)
router.put('/:id/resolve', loadUser, checkRole(['Admin', 'Encargado de inventario']), alertController.resolveAlert);

module.exports = router;
