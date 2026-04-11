const db = require('../config/db');
const bcrypt = require('bcryptjs');

const atletasController = {};

// Función auxiliar para verificar permisos (DRY)
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

// POST /api/atletas (Registrar un nuevo atleta usando Mega-Consulta CTE)
atletasController.crearAtleta = async (req, res) => {
    try {
        const {
            // Datos de Usuario
            nombre, primer_apellido, segundo_apellido, correo, password,
            // Datos Base Atleta y Perfil Personal
            curp, fecha_nacimiento, id_sexo, id_genero, rfc, nss, clave_ine, id_estadocivil, lugar_nacimiento,
            // Datos de Domicilio
            celular, telefono_fijo, codigo_postal, colonia, direccion_calle, cruzamientos, num_exterior, num_interior, manzana, lote,
            // Datos Médicos y Disciplina
            id_tiposangre, peso_kg, estatura_mts, alergias_condiciones, id_disciplina,
            // Detalles Deportivos y Extras
            id_categoria, id_talla_camisa, id_talla_pantalon, id_talla_short, id_talla_chamarra, talla_calzado, id_nivel_estudios, institucion_escolar
        } = req.body;

        // 1. Validar Permisos
        if (req.user.id_rol !== 2 && req.user.id_rol !== 3) {
            return res.status(403).json({ message: 'No tienes permisos para registrar atletas. Solo entrenadores o administradores pueden hacerlo.' });
        }

        let id_entrenador_asignado = null;

        // 2. Si es Entrenador, obtener su ID
        if (req.user.id_rol === 2) {
            const queryEntrenador = 'SELECT id_entrenador FROM entrenadores WHERE id_usuario = $1';
            const resultEntrenador = await db.query(queryEntrenador, [req.user.id_usuario]);
            
            if (resultEntrenador.rows.length === 0) {
                return res.status(404).json({ message: 'No se encontró el perfil de entrenador asociado a esta cuenta.' });
            }
            id_entrenador_asignado = resultEntrenador.rows[0].id_entrenador;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // MEGA-CONSULTA CTE: Inserta en las 7 tablas de un solo golpe (Ajustada a id_usuario)
        const query = `
            WITH nuevo_usuario AS (
                INSERT INTO usuarios (id_rol, nombre, primer_apellido, segundo_apellido, correo, password, estado_cuenta)
                VALUES ($1, $2, $3, $4, $5, $6, true) RETURNING id_usuario
            ),
            nuevo_atleta AS (
                INSERT INTO atletas (id_usuario, id_entrenador, id_estatus, curp, fecha_nacimiento)
                VALUES ((SELECT id_usuario FROM nuevo_usuario), $7, 1, $8, $9) RETURNING id_atleta
            ),
            nuevo_perfil AS (
                INSERT INTO perfiles_personales (id_usuario, id_sexo, id_genero, id_estadocivil, rfc, nss, clave_ine, lugar_nacimiento)
                VALUES ((SELECT id_usuario FROM nuevo_usuario), $10, $11, $12, $13, $14, $15, $16)
            ),
            nuevo_domicilio AS (
                INSERT INTO domicilios (id_usuario, celular, telefono_fijo, codigo_postal, colonia, direccion_calle, cruzamientos, num_exterior, num_interior, manzana, lote)
                VALUES ((SELECT id_usuario FROM nuevo_usuario), $17, $18, $19, $20, $21, $22, $23, $24, $25, $26)
            ),
            nuevo_medico AS (
                INSERT INTO perfiles_medicos (id_usuario, id_tiposangre, peso_kg, estatura_mts, alergias_condiciones)
                VALUES ((SELECT id_usuario FROM nuevo_usuario), $27, $28, $29, $30)
            ),
            nueva_disciplina AS (
                INSERT INTO atleta_disciplina (id_atleta, id_disciplina)
                VALUES ((SELECT id_atleta FROM nuevo_atleta), $31)
            )
            INSERT INTO detalles_atletas (id_usuario, id_categoria, id_talla_camisa, id_talla_pantalon, id_talla_short, id_talla_chamarra, talla_calzado, id_nivel_estudios, institucion_escolar)
            VALUES ((SELECT id_usuario FROM nuevo_usuario), $32, $33, $34, $35, $36, $37, $38, $39)
            RETURNING (SELECT id_atleta FROM nuevo_atleta) AS id_atleta_nuevo;
        `;

        const values = [
            1, nombre, primer_apellido, segundo_apellido, correo, hashedPassword, 
            id_entrenador_asignado, curp, fecha_nacimiento, 
            id_sexo, id_genero, id_estadocivil, rfc, nss, clave_ine, lugar_nacimiento,
            celular, telefono_fijo, codigo_postal, colonia, direccion_calle, cruzamientos, num_exterior, num_interior, manzana, lote,
            id_tiposangre, peso_kg, estatura_mts, alergias_condiciones,
            id_disciplina,
            id_categoria, id_talla_camisa, id_talla_pantalon, id_talla_short, id_talla_chamarra, talla_calzado, id_nivel_estudios, institucion_escolar
        ];

        const { rows } = await db.query(query, values);
        
        res.status(201).json({
            message: 'Atleta registrado exitosamente con todo su expediente.',
            id_atleta: rows[0].id_atleta_nuevo
        });

    } catch (error) {
        console.error('Error en registro de atleta:', error);
        if (error.code === '23505') {
            return res.status(409).json({ message: 'El correo, CURP o RFC ya están registrados en el sistema.' });
        }
        if (error.code === '23503') {
            return res.status(400).json({ message: 'Algún dato de catálogo (ej. sexo, talla, categoría o disciplina) es inválido.' });
        }
        res.status(500).json({ message: 'Error interno del servidor al procesar el expediente del atleta.' });
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