const { Router } = require('express');
const { getAtletas, createAtleta } = require('../controllers/atletas.controller');

const router = Router();

// Endpoint: GET /api/atletas
router.get('/', getAtletas);

// Endpoint: POST /api/atletas
router.post('/', createAtleta);

// Aquí puedes ir agregando más métodos:
// router.get('/:id', getAtletaById);
// router.put('/:id', updateAtleta);
// router.delete('/:id', deleteAtleta);

module.exports = router;