// src/routes/alerts.js

const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');
<<<<<<< HEAD
const { loadUser, checkPermission } = require('../middleware/auth');

// @route   GET /api/alerts
// @desc    Obtener todas las alertas activas
// @access  Private (Requiere permiso 'Ver Dashboard')
router.get('/', [loadUser, checkPermission('Ver Dashboard')], alertController.getActiveAlerts);

// @route   PUT /api/alerts/:id/resolve
// @desc    Resolver una alerta (marcar como inactiva)
// @access  Private (Requiere permiso 'Resolver Alertas')
router.put('/:id/resolve', [loadUser, checkPermission('Resolver Alertas')], alertController.resolveAlert);
=======
const { loadUser, checkRole } = require('../middleware/auth');

// @route   GET /api/alerts
// @desc    Obtener todas las alertas activas
// @access  Private (Admin, Bodeguero, Encargado de inventario)
router.get('/', loadUser, checkRole(['Admin', 'Bodeguero', 'Encargado de inventario']), alertController.getActiveAlerts);

// @route   PUT /api/alerts/:id/resolve
// @desc    Resolver una alerta (marcar como inactiva)
// @access  Private (Admin, Encargado de inventario)
router.put('/:id/resolve', loadUser, checkRole(['Admin', 'Encargado de inventario']), alertController.resolveAlert);
>>>>>>> d4375837180d22a0f4540aa41f172f365d68471a

module.exports = router;
