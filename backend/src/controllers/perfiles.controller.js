const db = require('../config/db');

const perfilesController = {};

// ==========================================\n// FUNCIÓN AUXILIAR DE SEGURIDAD (DRY) CON CANDADO DE EDICIÓN
// ==========================================
const validarAccesoPerfil = async (req_user, id_usuario_param, modulo_requiere_deportivo = false) => {
    // 1. Validar que sea el dueño, su entrenador asignado o un Admin
    if (req_user.id_usuario !== parseInt(id_usuario_param) && req_user.id_rol !== 3 && req_user.id_rol !== 2) {
        return { error: true, status: 403, message: 'Acceso denegado. No tienes permisos para modificar este perfil.' };
    }

    // 2. Extraer rol y estado de validación del objetivo
    const queryTarget = `
        SELECT u.id_rol, a.estado_validacion 
        FROM usuarios u
        LEFT JOIN atletas a ON u.id_usuario = a.id_usuario
        WHERE u.id_usuario = $1
    `;
    const { rows } = await db.query(queryTarget, [id_usuario_param]);
    
    if (rows.length === 0) {
        return { error: true, status: 404, message: 'El usuario especificado no existe.' };
    }

    const target_rol = rows[0].id_rol;
    const estado_validacion = rows[0].estado_validacion;

    // 3. BLOQUEO POR REVISIÓN: Si está en revisión o aprobado, nadie (excepto el admin) puede editar
    if (target_rol === 1 && req_user.id_rol !== 3) {
        if (estado_validacion === 'EN_REVISION') {
            return { error: true, status: 403, message: 'El perfil está en revisión por el Administrador. No se pueden hacer cambios.' };
        }
        if (estado_validacion === 'APROBADO') {
            return { error: true, status: 403, message: 'El perfil ya fue aprobado. No se permiten modificaciones.' };
        }
    }

    // 4. Bloqueo de módulos deportivos para admins
    if (modulo_requiere_deportivo && target_rol === 3) {
        return { error: true, status: 400, message: 'Los perfiles administrativos no soportan esta información.' };
    }

    return { error: false };
};

// ==========================================\n// 1. PERFIL PERSONAL (Paso 2 del Frontend)
// ==========================================
perfilesController.upsertPerfilPersonal = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const validacion = await validarAccesoPerfil(req.user, id_usuario);
        if (validacion.error) return res.status(validacion.status).json({ message: validacion.message });

        const { id_sexo, id_genero, id_estado_civil, rfc, nss, clave_ine, lugar_nacimiento } = req.body;

        const query = `
            INSERT INTO perfiles_personales (id_usuario, id_sexo, id_genero, id_estado_civil, rfc, nss, clave_ine, lugar_nacimiento)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            ON CONFLICT (id_usuario) 
            DO UPDATE SET 
                id_sexo = EXCLUDED.id_sexo,
                id_genero = EXCLUDED.id_genero,
                id_estado_civil = EXCLUDED.id_estado_civil,
                rfc = EXCLUDED.rfc,
                nss = EXCLUDED.nss,
                clave_ine = EXCLUDED.clave_ine,
                lugar_nacimiento = EXCLUDED.lugar_nacimiento
            RETURNING *;
        `;
        const { rows } = await db.query(query, [id_usuario, id_sexo, id_genero, id_estado_civil, rfc, nss, clave_ine, lugar_nacimiento]);

        res.json({ message: 'Perfil personal guardado exitosamente.', data: rows[0] });
    } catch (error) {
        if (error.code === '23505') return res.status(400).json({ message: 'El RFC, NSS o INE ya está registrado por otro usuario.' });
        if (error.code === '22P02') return res.status(400).json({ message: 'Formato de dato inválido (revisa los IDs numéricos).' });
        console.error('Error upsert perfil personal:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

// ==========================================\n// 2. DOMICILIO (Paso 3 del Frontend)
// ==========================================
perfilesController.upsertDomicilio = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const validacion = await validarAccesoPerfil(req.user, id_usuario);
        if (validacion.error) return res.status(validacion.status).json({ message: validacion.message });

        const { calle, num_exterior, num_interior, cruzamientos, colonia, codigo_postal, localidad, municipio, estado } = req.body;

        const query = `
            INSERT INTO domicilios (id_usuario, calle, num_exterior, num_interior, cruzamientos, colonia, codigo_postal, localidad, municipio, estado)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            ON CONFLICT (id_usuario) 
            DO UPDATE SET 
                calle = EXCLUDED.calle,
                num_exterior = EXCLUDED.num_exterior,
                num_interior = EXCLUDED.num_interior,
                cruzamientos = EXCLUDED.cruzamientos,
                colonia = EXCLUDED.colonia,
                codigo_postal = EXCLUDED.codigo_postal,
                localidad = EXCLUDED.localidad,
                municipio = EXCLUDED.municipio,
                estado = EXCLUDED.estado
            RETURNING *;
        `;
        const { rows } = await db.query(query, [id_usuario, calle, num_exterior, num_interior, cruzamientos, colonia, codigo_postal, localidad, municipio, estado]);

        res.json({ message: 'Domicilio guardado exitosamente.', data: rows[0] });
    } catch (error) {
        console.error('Error upsert domicilio:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

// ==========================================\n// 3. PERFIL MÉDICO (Paso 4 - Bloqueado para Admins en su perfil)
// ==========================================
perfilesController.upsertPerfilMedico = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const validacion = await validarAccesoPerfil(req.user, id_usuario, true);
        if (validacion.error) return res.status(validacion.status).json({ message: validacion.message });

        const { id_tipo_sangre, peso_kg, estatura_cm, alergias, padecimientos, cirugias, lesiones } = req.body;

        const query = `
            INSERT INTO perfiles_medicos (id_usuario, id_tipo_sangre, peso_kg, estatura_cm, alergias, padecimientos, cirugias, lesiones)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            ON CONFLICT (id_usuario) 
            DO UPDATE SET 
                id_tipo_sangre = EXCLUDED.id_tipo_sangre,
                peso_kg = EXCLUDED.peso_kg,
                estatura_cm = EXCLUDED.estatura_cm,
                alergias = EXCLUDED.alergias,
                padecimientos = EXCLUDED.padecimientos,
                cirugias = EXCLUDED.cirugias,
                lesiones = EXCLUDED.lesiones
            RETURNING *;
        `;
        const { rows } = await db.query(query, [id_usuario, id_tipo_sangre, peso_kg, estatura_cm, alergias, padecimientos, cirugias, lesiones]);

        res.json({ message: 'Perfil médico guardado exitosamente.', data: rows[0] });
    } catch (error) {
        console.error('Error upsert perfil médico:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

// ==========================================\n// 4. DETALLES ATLETAS (Paso 5 - Bloqueado para Admins en su perfil)
// ==========================================
perfilesController.upsertDetalles = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const validacion = await validarAccesoPerfil(req.user, id_usuario, true);
        if (validacion.error) return res.status(validacion.status).json({ message: validacion.message });

        const { id_categoria, id_talla_camisa, id_talla_pantalon, id_talla_short, id_talla_chamarra, talla_calzado, id_nivel_estudios, institucion_escolar } = req.body;

        const query = `
            INSERT INTO detalles_atletas (id_usuario, id_categoria, id_talla_camisa, id_talla_pantalon, id_talla_short, id_talla_chamarra, talla_calzado, id_nivel_estudios, institucion_escolar)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            ON CONFLICT (id_usuario) 
            DO UPDATE SET 
                id_categoria = EXCLUDED.id_categoria,
                id_talla_camisa = EXCLUDED.id_talla_camisa,
                id_talla_pantalon = EXCLUDED.id_talla_pantalon,
                id_talla_short = EXCLUDED.id_talla_short,
                id_talla_chamarra = EXCLUDED.id_talla_chamarra,
                talla_calzado = EXCLUDED.talla_calzado,
                id_nivel_estudios = EXCLUDED.id_nivel_estudios,
                institucion_escolar = EXCLUDED.institucion_escolar
            RETURNING *;
        `;
        const { rows } = await db.query(query, [id_usuario, id_categoria, id_talla_camisa, id_talla_pantalon, id_talla_short, id_talla_chamarra, talla_calzado, id_nivel_estudios, institucion_escolar]);

        res.json({ message: 'Detalles físicos y académicos guardados exitosamente.', data: rows[0] });
    } catch (error) {
        console.error('Error upsert detalles:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

// ==========================================\n// 5. ENVIAR A REVISIÓN (El entrenador bloquea la cuenta al terminar)
// ==========================================
perfilesController.enviarARevision = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const validacion = await validarAccesoPerfil(req.user, id_usuario);
        if (validacion.error) return res.status(validacion.status).json({ message: validacion.message });

        const query = `UPDATE atletas SET estado_validacion = 'EN_REVISION' WHERE id_usuario = $1 RETURNING estado_validacion`;
        const { rows } = await db.query(query, [id_usuario]);

        if (rows.length === 0) return res.status(404).json({ message: 'Atleta no encontrado.' });

        res.json({ message: 'Perfil enviado a revisión exitosamente. Ya no podrá ser editado.', data: rows[0] });
    } catch (error) {
        console.error('Error al enviar a revisión:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

module.exports = perfilesController;