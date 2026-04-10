const { Router } = require('express');
const router = Router();
const authController = require('../controllers/auth.controller.js');

// Ruta para iniciar sesión
router.post('/login', authController.login);

// Ruta para el registro inicial de un entrenador (y su cuenta de usuario asociada)
router.post('/registro/entrenador', authController.registroEntrenador);

// Ruta para solicitar la recuperación de contraseña
router.post('/recuperar-password', authController.recuperarPassword);

// Ruta para aplicar la nueva contraseña usando el token temporal
router.put('/reset-password', authController.resetPassword);

module.exports = router;