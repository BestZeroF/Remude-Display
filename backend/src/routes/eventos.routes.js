const express = require('express');
const router = express.Router();
const eventosController = require('../controllers/eventos.controller');

// POST /api/eventos
router.post('/', eventosController.crearEvento);

module.exports = router;