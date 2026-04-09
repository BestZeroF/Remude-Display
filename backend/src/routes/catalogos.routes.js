const express = require('express');
const router = express.Router();
const catalogosController = require('../controllers/catalogos.controller');

// Obtener registros de un catálogo
// Ejemplo: GET /api/catalogos/disciplinas
router.get('/:tabla', catalogosController.getCatalogos);

// Registrar en un catálogo
// Ejemplo: POST /api/catalogos/catalogo_tallas -> Body: { "nombre": "XL" }
router.post('/:tabla', catalogosController.crearCatalogoItem);

module.exports = router;