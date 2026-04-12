const db = require('../config/db');

const atletasController = {};

// ==========================================
// FUNCIÓN AUXILIAR DE SEGURIDAD (DRY)
// ==========================================
const verificarPermisosAtleta = async (id_atleta_param, id_usuario_token, id_rol_token) => {
    const checkQuery = `
        SELECT a.id_usuario, a.id_entrenador, e.id_usuario AS id_usuario_entrenador
        FROM atletas a
        LEFT JOIN entrenadores e ON a.id_entrenador = e.id_entrenador
        WHERE a.id_atleta = $1
    `;
    const { rows } = await db.query(checkQuery, [id_atleta_param]);
    
    if (rows.length === 0) return { error: 'Atleta no encontrado.', status: 404 };
    
    const atleta = rows[0];
    
    // Admin (3) puede ver todo
    if (id_rol_token === 3) return { permitido: true };
    // El propio atleta (1) puede ver su perfil
    if (id_rol_token === 1 && atleta.id_usuario === id_usuario_token) return { permitido: true };
    // El entrenador (2) solo puede ver a los atletas asignados a él
    if (id_rol_token === 2 && atleta.id_usuario_entrenador === id_usuario_token) return { permitido: true };
    
    return { error: 'Acceso denegado. No tienes permisos sobre este atleta.', status: 403 };
};

// ==========================================
// NUEVO: GET /api/atletas/validar-curp/:curp
// ==========================================
atletasController.validarCURP = async (req, res) => {
    try {
        const { curp } = req.params;
        
        // 1. Buscar en la tabla de atletas (incluso si son "avances")
        const queryAtletas = 'SELECT curp FROM atletas WHERE curp = $1';
        const { rows: rowsAtletas } = await db.query(queryAtletas, [curp]);
        
        if (rowsAtletas.length > 0) {
            return res.json({ existe: true });
        }

        // 2. Buscar en la tabla de entrenadores (por si acaso un entrenador intenta registrarse como atleta)
        const queryEntrenadores = 'SELECT curp FROM entrenadores WHERE curp = $1';
        const { rows: rowsEntrenadores } = await db.query(queryEntrenadores, [curp]);

        if (rowsEntrenadores.length > 0) {
            return res.json({ existe: true });
        }

        // Si no existe en ningún lado
        return res.json({ existe: false });
        
    } catch (error) {
        console.error('Error al validar CURP:', error);
        res.status(500).json({ message: 'Error interno del servidor al validar la CURP.' });
    }
};

// GET /api/atletas/:id (Perfil completo con JOINs a todas las tablas ajustadas a id_usuario)
atletasController.obtenerAtletaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const permiso = await verificarPermisosAtleta(id, req.user.id_usuario, req.user.id_rol);
        if (permiso.error) return res.status(permiso.status).json({ message: permiso.error });

        const query = `
            SELECT 
                a.id_atleta, a.curp, a.fecha_nacimiento, ce.nombre_estatus,
                u.nombre, u.primer_apellido, u.segundo_apellido, u.correo, u.estado_cuenta,
                pp.rfc, pp.nss, pp.clave_ine, pp.lugar_nacimiento, sx.nombre_sexo, gen.nombre_genero, ec.nombre_estado AS estado_civil,
                dom.celular, dom.codigo_postal, dom.colonia, dom.direccion_calle, dom.cruzamientos, dom.num_exterior,
                pm.peso_kg, pm.estatura_mts, pm.alergias_condiciones, ts.grupo_sanguineo,
                da.talla_calzado, da.institucion_escolar, cat.nombre_categoria, ne.nombre_nivel AS nivel_estudios,
                tc.nomenclatura AS talla_camisa, tp.nomenclatura AS talla_pantalon,
                disc.nombre_disciplina
            FROM atletas a
            INNER JOIN usuarios u ON a.id_usuario = u.id_usuario
            INNER JOIN catalogo_estatus ce ON a.id_estatus = ce.id_estatus
            LEFT JOIN perfiles_personales pp ON u.id_usuario = pp.id_usuario
            LEFT JOIN catalogo_sexo sx ON pp.id_sexo = sx.id_sexo
            LEFT JOIN catalogo_genero gen ON pp.id_genero = gen.id_genero
            LEFT JOIN catalogo_estadocivil ec ON pp.id_estadocivil = ec.id_estadocivil
            LEFT JOIN domicilios dom ON u.id_usuario = dom.id_usuario
            LEFT JOIN perfiles_medicos pm ON u.id_usuario = pm.id_usuario
            LEFT JOIN catalogo_tiposangre ts ON pm.id_tiposangre = ts.id_tiposangre
            LEFT JOIN detalles_atletas da ON u.id_usuario = da.id_usuario
            LEFT JOIN catalogo_categorias cat ON da.id_categoria = cat.id_categoria
            LEFT JOIN catalogo_nivelestudios ne ON da.id_nivel_estudios = ne.id_nivel
            LEFT JOIN catalogo_tallas tc ON da.id_talla_camisa = tc.id_talla
            LEFT JOIN catalogo_tallas tp ON da.id_talla_pantalon = tp.id_talla
            LEFT JOIN atleta_disciplina ad ON a.id_atleta = ad.id_atleta
            LEFT JOIN disciplinas disc ON ad.id_disciplina = disc.id_disciplina
            WHERE a.id_atleta = $1
        `;
        const { rows } = await db.query(query, [id]);

        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener atleta:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

// PUT /api/atletas/:id (Actualizar info personal básica)
atletasController.actualizarAtleta = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, primer_apellido, segundo_apellido, fecha_nacimiento, celular } = req.body;
        
        const permiso = await verificarPermisosAtleta(id, req.user.id_usuario, req.user.id_rol);
        if (permiso.error) return res.status(permiso.status).json({ message: permiso.error });

        const query = `
            WITH act_usuario AS (
                UPDATE usuarios
                SET nombre = COALESCE($1, nombre), 
                    primer_apellido = COALESCE($2, primer_apellido), 
                    segundo_apellido = COALESCE($3, segundo_apellido)
                WHERE id_usuario = (SELECT id_usuario FROM atletas WHERE id_atleta = $4)
                RETURNING id_usuario
            ), act_atleta AS (
                UPDATE atletas
                SET fecha_nacimiento = COALESCE($5, fecha_nacimiento)
                WHERE id_atleta = $4
            )
            UPDATE domicilios
            SET celular = COALESCE($6, celular)
            WHERE id_usuario = (SELECT id_usuario FROM act_usuario)
            RETURNING id_domicilio;
        `;
        
        await db.query(query, [nombre, primer_apellido, segundo_apellido, id, fecha_nacimiento, celular]);

        res.json({ message: 'Información general del atleta actualizada exitosamente.' });
    } catch (error) {
        console.error('Error al actualizar atleta:', error);
        res.status(500).json({ message: 'Error interno del servidor al actualizar.' });
    }
};

// DELETE /api/atletas/:id (Soft delete)
atletasController.darDeBajaAtleta = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (req.user.id_rol === 1) {
            return res.status(403).json({ message: 'No tienes permiso para realizar esta acción.' });
        }

        const permiso = await verificarPermisosAtleta(id, req.user.id_usuario, req.user.id_rol);
        if (permiso.error) return res.status(permiso.status).json({ message: permiso.error });

        const ESTATUS_INACTIVO = 2; 

        const query = `
            UPDATE atletas SET id_estatus = $1 WHERE id_atleta = $2 RETURNING id_atleta, id_estatus
        `;
        const { rows } = await db.query(query, [ESTATUS_INACTIVO, id]);

        res.json({ 
            message: 'El atleta ha sido dado de baja exitosamente.',
            atleta: rows[0]
        });
    } catch (error) {
        console.error('Error al dar de baja atleta:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

// GET /api/atletas/:id/historial
atletasController.obtenerHistorial = async (req, res) => {
    try {
        const { id } = req.params;

        const permiso = await verificarPermisosAtleta(id, req.user.id_usuario, req.user.id_rol);
        if (permiso.error) return res.status(permiso.status).json({ message: permiso.error });

        const query = `
            SELECT id_historial, descripcion, fecha_evento
            FROM historial_deportivo
            WHERE id_atleta = $1
            ORDER BY fecha_evento DESC
        `;
        const { rows } = await db.query(query, [id]);

        res.json(rows);
    } catch (error) {
        console.error('Error al obtener historial deportivo:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

module.exports = atletasController;