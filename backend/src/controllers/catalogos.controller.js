const db = require('../config/db');

// Obtener todos los elementos de un catálogo específico
const getCatalogos = async (req, res) => {
    const { tabla } = req.params;
    
    // CORRECCIÓN V5.0: Lista blanca extendida para incluir TODOS los catálogos necesarios para los formularios del frontend
    const tablasPermitidas = [
        'catalogo_roles', 
        'catalogo_estatus', 
        'catalogo_tallas', 
        'catalogo_tiposdocumento', 
        'catalogo_tiponotificacion', 
        'disciplinas',
        'catalogo_sexo',
        'catalogo_genero',
        'catalogo_estadocivil',
        'catalogo_tiposangre',
        'catalogo_categorias',
        'catalogo_nivelestudios'
    ];

    if (!tablasPermitidas.includes(tabla)) {
        return res.status(400).json({ message: "Catálogo no válido o no autorizado" });
    }

    try {
        const query = `SELECT * FROM ${tabla} ORDER BY 1 ASC`;
        const result = await db.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(`Error al obtener catálogo ${tabla}:`, error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Registrar un nuevo elemento en un catálogo
const crearCatalogoItem = async (req, res) => {
    const { tabla } = req.params;
    const { nombre } = req.body; 

    // Mapeo dinámico de qué columna se debe llenar dependiendo de la tabla
    const configuracion = {
        'catalogo_roles': 'nombre_rol',
        'catalogo_estatus': 'nombre_estatus',
        'catalogo_tallas': 'nomenclatura',
        'catalogo_tiposdocumento': 'nombre_tipo',
        'catalogo_tiponotificacion': 'nombre_tipo',
        'disciplinas': 'nombre_disciplina',
        'catalogo_sexo': 'nombre_sexo',
        'catalogo_genero': 'nombre_genero',
        'catalogo_estadocivil': 'nombre_estado',
        'catalogo_tiposangre': 'grupo_sanguineo',
        'catalogo_categorias': 'nombre_categoria',
        'catalogo_nivelestudios': 'nombre_nivel'
    };

    const columna = configuracion[tabla];

    if (!columna) {
        return res.status(400).json({ message: "Catálogo no válido para inserción o no existe" });
    }

    if (!nombre) {
        return res.status(400).json({ message: `El campo '${columna}' es requerido para esta tabla` });
    }

    try {
        const query = `INSERT INTO ${tabla} (${columna}) VALUES ($1) RETURNING *`;
        const result = await db.query(query, [nombre]);
        
        res.status(201).json({
            message: "Item registrado correctamente",
            item: result.rows[0]
        });
    } catch (error) {
        console.error(`Error al registrar en catálogo ${tabla}:`, error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

module.exports = {
    getCatalogos,
    crearCatalogoItem
};