const { Router } = require('express');
const { login, registroEntrenador } = require('../controllers/auth.controller');

const router = Router();

// Endpoint: POST /api/auth/login
router.post('/login', login);

// Endpoint: POST /api/auth/registro/entrenador
router.post('/registro/entrenador', registroEntrenador);

module.exports = router;