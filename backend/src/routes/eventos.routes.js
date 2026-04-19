const express = require('express');
const router = express.Router();
const eventosController = require('../controllers/eventos.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Proteger todas las rutas con JWT
router.use(authMiddleware);

// Rutas de eventos
router.get('/', eventosController.obtenerEventos);
router.post('/', eventosController.crearEvento);
router.delete('/:id', eventosController.eliminarEvento);

module.exports = router;