const db = require('../config/db');

const atletasController = {};

// ==========================================
// FUNCIÓN AUXILIAR DE SEGURIDAD (Actualizada V7)
// Ahora verifica permisos basados en id_usuario
// ==========================================
const verificarPermisosAtleta = async (id_usuario_atleta, id_usuario_token, id_rol_token) => {
    const checkQuery = `
        SELECT a.id_usuario, a.id_entrenador, e.id_usuario AS id_usuario_entrenador
        FROM atletas a
        LEFT JOIN entrenadores e ON a.id_entrenador = e.id_entrenador
        WHERE a.id_usuario = $1
    `;
    const { rows } = await db.query(checkQuery, [id_usuario_atleta]);
    
    if (rows.length === 0) return { error: 'Atleta no encontrado.', status: 404 };
    
    const atleta = rows[0];
    
    // Admin (3) puede ver todo
    if (id_rol_token === 3) return { permitido: true };
    // El propio atleta (1) puede ver su perfil
    if (id_rol_token === 1 && atleta.id_usuario == id_usuario_token) return { permitido: true };
    // El entrenador (2) solo puede ver a los atletas asignados a él
    if (id_rol_token === 2 && atleta.id_usuario_entrenador == id_usuario_token) return { permitido: true };
    
    return { error: 'Acceso denegado. No tienes permisos sobre este atleta.', status: 403 };
};

// ==========================================
// VALIDAR CURP (Detecta si es Atleta o Entrenador)
// ==========================================
atletasController.validarCURP = async (req, res) => {
    try {
        const { curp } = req.params;

        const queryEntrenador = `
            SELECT u.id_usuario, u.nombre, u.primer_apellido, u.segundo_apellido
            FROM entrenadores e
            INNER JOIN usuarios u ON e.id_usuario = u.id_usuario
            WHERE e.curp = $1
        `;
        const resEntrenador = await db.query(queryEntrenador, [curp]);

        if (resEntrenador.rows.length > 0) {
            const ent = resEntrenador.rows[0];
            return res.json({
                existe: true,
                tipo: 'entrenador',
                id_usuario: ent.id_usuario,
                nombre: `${ent.nombre} ${ent.primer_apellido} ${ent.segundo_apellido || ''}`.trim()
            });
        }

        const queryAtleta = `
            SELECT 
                u.id_usuario, u.nombre, u.primer_apellido, u.segundo_apellido,
                eu.nombre AS ent_nombre, eu.primer_apellido AS ent_apellido, eu.segundo_apellido AS ent_segundo
            FROM atletas a
            INNER JOIN usuarios u ON a.id_usuario = u.id_usuario
            LEFT JOIN entrenadores e ON a.id_entrenador = e.id_entrenador
            LEFT JOIN usuarios eu ON e.id_usuario = eu.id_usuario
            WHERE a.curp = $1
        `;
        const resAtleta = await db.query(queryAtleta, [curp]);

        if (resAtleta.rows.length > 0) {
            const atl = resAtleta.rows[0];
            const entrenadorActual = atl.ent_nombre 
                ? `${atl.ent_nombre} ${atl.ent_apellido} ${atl.ent_segundo || ''}`.trim()
                : 'Sin entrenador asignado';

            return res.json({
                existe: true,
                tipo: 'atleta',
                id_usuario: atl.id_usuario,
                nombre: `${atl.nombre} ${atl.primer_apellido} ${atl.segundo_apellido || ''}`.trim(),
                entrenadorActual: entrenadorActual
            });
        }

        return res.json({ existe: false });

    } catch (error) {
        console.error('Error al validar CURP:', error);
        res.status(500).json({ message: 'Error interno del servidor al validar CURP.' });
    }
};

// ==========================================
// GET /api/atletas/:id (Perfil completo por id_usuario)
// ==========================================
atletasController.obtenerAtletaPorId = async (req, res) => {
    try {
        const { id } = req.params; // Este 'id' es el id_usuario según contrato
        const permiso = await verificarPermisosAtleta(id, req.user.id_usuario, req.user.id_rol);
        if (permiso.error) return res.status(permiso.status).json({ message: permiso.error });

        const query = `
            SELECT 
                u.id_usuario, a.id_atleta, a.curp, a.fecha_nacimiento, ce.nombre_estatus,
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
            WHERE a.id_usuario = $1
        `;
        const { rows } = await db.query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'No se encontró información para este atleta.' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener atleta:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

// ==========================================
// PUT /api/atletas/:id (Actualizar por id_usuario)
// ==========================================
atletasController.actualizarAtleta = async (req, res) => {
    try {
        const { id } = req.params; // id_usuario
        const { nombre, primer_apellido, segundo_apellido, fecha_nacimiento, celular } = req.body;
        
        const permiso = await verificarPermisosAtleta(id, req.user.id_usuario, req.user.id_rol);
        if (permiso.error) return res.status(permiso.status).json({ message: permiso.error });

        await db.query('BEGIN');

        const queryUser = `
            UPDATE usuarios
            SET nombre = COALESCE($1, nombre), 
                primer_apellido = COALESCE($2, primer_apellido), 
                segundo_apellido = COALESCE($3, segundo_apellido)
            WHERE id_usuario = $4
        `;
        await db.query(queryUser, [nombre, primer_apellido, segundo_apellido, id]);

        const queryAtleta = `
            UPDATE atletas
            SET fecha_nacimiento = COALESCE($1, fecha_nacimiento)
            WHERE id_usuario = $2
        `;
        await db.query(queryAtleta, [fecha_nacimiento, id]);

        const queryDom = `
            UPDATE domicilios
            SET celular = COALESCE($1, celular)
            WHERE id_usuario = $2
        `;
        await db.query(queryDom, [celular, id]);

        await db.query('COMMIT');

        res.json({ message: 'Información general del atleta actualizada exitosamente.' });
    } catch (error) {
        await db.query('ROLLBACK');
        console.error('Error al actualizar atleta:', error);
        res.status(500).json({ message: 'Error interno del servidor al actualizar.' });
    }
};

// ==========================================
// DELETE /api/atletas/:id (Soft delete por id_usuario)
// ==========================================
atletasController.darDeBajaAtleta = async (req, res) => {
    try {
        const { id } = req.params; // id_usuario
        
        if (req.user.id_rol === 1) {
            return res.status(403).json({ message: 'No tienes permiso para realizar esta acción.' });
        }

        const permiso = await verificarPermisosAtleta(id, req.user.id_usuario, req.user.id_rol);
        if (permiso.error) return res.status(permiso.status).json({ message: permiso.error });

        const ESTATUS_INACTIVO = 2; 

        const query = `
            UPDATE atletas SET id_estatus = $1 WHERE id_usuario = $2 RETURNING id_atleta, id_estatus
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

// ==========================================
// GET /api/atletas/:id/historial (por id_usuario)
// ==========================================
atletasController.obtenerHistorial = async (req, res) => {
    try {
        const { id } = req.params; // id_usuario

        const permiso = await verificarPermisosAtleta(id, req.user.id_usuario, req.user.id_rol);
        if (permiso.error) return res.status(permiso.status).json({ message: permiso.error });

        const query = `
            SELECT h.id_historial, h.descripcion, h.fecha_evento
            FROM historial_deportivo h
            INNER JOIN atletas a ON h.id_atleta = a.id_atleta
            WHERE a.id_usuario = $1
            ORDER BY h.fecha_evento DESC
        `;
        const { rows } = await db.query(query, [id]);

        res.json(rows);
    } catch (error) {
        console.error('Error al obtener historial deportivo:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

module.exports = atletasController;