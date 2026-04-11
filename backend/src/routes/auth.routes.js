const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// ==========================================
// RUTAS DE AUTENTICACIÓN Y REGISTRO BASE
// (Prefijo en app.js: /api/auth)
// ==========================================

// Iniciar sesión
router.post('/login', authController.login);

// Registro Fase 1: Cuentas Base (Paso 1 del Frontend)
router.post('/registro/atleta', authController.registrarAtletaDesdeCero);
router.post('/registro/entrenador', authController.registroEntrenador);

// Recuperación de contraseña
router.post('/recuperar-password', authController.recuperarPassword);
router.put('/reset-password', authController.resetPassword);

module.exports = router;