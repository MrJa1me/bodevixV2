// src/routes/auth.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');
const { loadUser } = require('../middleware/auth');

// Ruta para crear usuarios de prueba.
router.post('/register', authController.register);

// Devuelve info del usuario "logueado" por cabecera X-User
router.get('/me', loadUser, authController.me);

module.exports = router;