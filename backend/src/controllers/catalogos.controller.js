const db = require('../config/db');

// Obtener todos los elementos de un catálogo específico
const getCatalogos = async (req, res) => {
    const { tabla } = req.params;
    
    // Lista blanca de tablas permitidas para evitar SQL Injection
    const tablasPermitidas = [
        'catalogo_roles', 'catalogo_estatus', 'catalogo_tallas', 
        'catalogo_tiposdocumento', 'catalogo_tiponotificacion', 'disciplinas'
    ];

    if (!tablasPermitidas.includes(tabla)) {
        return res.status(400).json({ message: "Catálogo no válido" });
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
    const { nombre } = req.body; // El valor a insertar (nombre_rol, nombre_estatus, etc.)

    const configuracion = {
        'catalogo_roles': 'nombre_rol',
        'catalogo_estatus': 'nombre_estatus',
        'catalogo_tallas': 'nomenclatura',
        'catalogo_tiposdocumento': 'nombre_tipo',
        'catalogo_tiponotificacion': 'nombre_tipo',
        'disciplinas': 'nombre_disciplina'
    };

    const columna = configuracion[tabla];

    if (!columna) {
        return res.status(400).json({ message: "Catálogo no válido o no existe" });
    }

    if (!nombre) {
        return res.status(400).json({ message: `El campo '${columna}' es requerido` });
    }

    try {
        const query = `INSERT INTO ${tabla} (${columna}) VALUES ($1) RETURNING *`;
        const result = await db.query(query, [nombre]);
        
        res.status(201).json({
            message: "Item registrado correctamente",
            item: result.rows[0]
        });
    } catch (error) {
        console.error(`Error al insertar en ${tabla}:`, error);
        res.status(500).json({ message: "Error interno al registrar en catálogo" });
    }
};

module.exports = {
    getCatalogos,
    crearCatalogoItem
};