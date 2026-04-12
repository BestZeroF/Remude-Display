const express = require('express');
const router = express.Router();
const eventosController = require('../controllers/eventos.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Proteger con JWT (Requerido para leer req.user en el controller)
router.use(authMiddleware);

// POST /api/eventos
router.post('/', eventosController.crearEvento);

module.exports = router;