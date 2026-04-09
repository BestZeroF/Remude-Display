const { Router } = require('express');
const { 
    getAtletas, 
    createAtleta, 
    getAtletaById, 
    updateAtleta, 
    deleteAtleta 
} = require('../controllers/atletas.controller');

const router = Router();

// Endpoint: GET /api/atletas
// Obtiene la lista de todos los atletas
router.get('/', getAtletas);

// Endpoint: POST /api/atletas
// Registra un nuevo atleta
router.post('/', createAtleta);

// Endpoint: GET /api/atletas/:id
// Obtiene el detalle de un atleta específico por su id_atleta
router.get('/:id', getAtletaById);

// Endpoint: PUT /api/atletas/:id
// Actualiza la información de un atleta específico
router.put('/:id', updateAtleta);

// Endpoint: DELETE /api/atletas/:id
// Elimina un atleta (siempre y cuando no tenga dependencias)
router.delete('/:id', deleteAtleta);

module.exports = router;