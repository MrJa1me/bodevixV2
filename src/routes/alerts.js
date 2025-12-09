// src/routes/alerts.js

const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');
const { loadUser, checkPermission } = require('../middleware/auth');

// @route   GET /api/alerts
// @desc    Obtener todas las alertas activas
// @access  Private (Requiere permiso 'Ver Dashboard')
router.get('/', [loadUser, checkPermission('Ver Dashboard')], alertController.getActiveAlerts);

// @route   PUT /api/alerts/:id/resolve
// @desc    Resolver una alerta (marcar como inactiva)
// @access  Private (Requiere permiso 'Resolver Alertas')
router.put('/:id/resolve', [loadUser, checkPermission('Resolver Alertas')], alertController.resolveAlert);

module.exports = router;
