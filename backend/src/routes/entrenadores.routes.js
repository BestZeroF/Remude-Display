const { Router } = require('express');
const { getDashboardResumen } = require('../controllers/entrenadores.controller');

const router = Router();

// Por ahora dejamos la ruta abierta para probar, luego le pondremos el middleware
router.get('/dashboard', getDashboardResumen);

module.exports = router;