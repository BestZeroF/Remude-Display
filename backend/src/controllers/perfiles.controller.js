const db = require('../config/db');

const perfilesController = {};

// ==========================================
// FUNCIÓN AUXILIAR DE SEGURIDAD (DRY)
// ==========================================
const validarAccesoPerfil = async (req_user, id_usuario_param, modulo_requiere_deportivo = false) => {
    // 1. Validar que sea el dueño de la cuenta o un Administrador (Rol 3)
    if (req_user.id_usuario !== parseInt(id_usuario_param) && req_user.id_rol !== 3) {
        return { error: true, status: 403, message: 'Acceso denegado. No tienes permisos para modificar este perfil.' };
    }

    // 2. Verificar existencia del usuario destino y su rol
    const { rows } = await db.query('SELECT id_rol FROM usuarios WHERE id_usuario = $1', [id_usuario_param]);
    if (rows.length === 0) {
        return { error: true, status: 404, message: 'El usuario especificado no existe.' };
    }

    const target_rol = rows[0].id_rol;

    // 3. Si el módulo es estrictamente médico/deportivo, bloquear a los Administradores
    if (modulo_requiere_deportivo && target_rol === 3) {
        return { error: true, status: 400, message: 'Operación rechazada. Los perfiles administrativos no requieren ni soportan esta información.' };
    }

    return { error: false };
};

// ==========================================
// 1. PERFIL PERSONAL (Paso 2 del Frontend)
// ==========================================
perfilesController.upsertPerfilPersonal = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const { id_sexo, id_genero, id_estadocivil, rfc, nss, clave_ine, lugar_nacimiento } = req.body;

        const validacion = await validarAccesoPerfil(req.user, id_usuario, false); // Admin sí puede tener perfil personal
        if (validacion.error) return res.status(validacion.status).json({ message: validacion.message });

        const query = `
            INSERT INTO perfiles_personales (id_usuario, id_sexo, id_genero, id_estadocivil, rfc, nss, clave_ine, lugar_nacimiento)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            ON CONFLICT (id_usuario) 
            DO UPDATE SET 
                id_sexo = EXCLUDED.id_sexo,
                id_genero = EXCLUDED.id_genero,
                id_estadocivil = EXCLUDED.id_estadocivil,
                rfc = EXCLUDED.rfc,
                nss = EXCLUDED.nss,
                clave_ine = EXCLUDED.clave_ine,
                lugar_nacimiento = EXCLUDED.lugar_nacimiento
            RETURNING *;
        `;
        const { rows } = await db.query(query, [id_usuario, id_sexo, id_genero, id_estadocivil, rfc, nss, clave_ine, lugar_nacimiento]);

        res.json({ message: 'Perfil personal guardado exitosamente.', data: rows[0] });
    } catch (error) {
        console.error('Error en upsertPerfilPersonal:', error);
        if (error.code === '23505') return res.status(409).json({ message: 'El RFC, NSS o Clave INE ya se encuentra registrado por otro usuario.' });
        if (error.code === '23503') return res.status(400).json({ message: 'Datos de catálogo inválidos (Sexo, Género o Estado Civil).' });
        res.status(500).json({ message: 'Error interno del servidor al procesar el perfil personal.' });
    }
};

// ==========================================
// 2. DOMICILIO (Paso 3 del Frontend)
// ==========================================
perfilesController.upsertDomicilio = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const { celular, telefono_fijo, codigo_postal, colonia, direccion_calle, cruzamientos, num_exterior, num_interior, manzana, lote } = req.body;

        const validacion = await validarAccesoPerfil(req.user, id_usuario, false); // Admin sí puede tener domicilio
        if (validacion.error) return res.status(validacion.status).json({ message: validacion.message });

        const query = `
            INSERT INTO domicilios (id_usuario, celular, telefono_fijo, codigo_postal, colonia, direccion_calle, cruzamientos, num_exterior, num_interior, manzana, lote)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            ON CONFLICT (id_usuario) 
            DO UPDATE SET 
                celular = EXCLUDED.celular,
                telefono_fijo = EXCLUDED.telefono_fijo,
                codigo_postal = EXCLUDED.codigo_postal,
                colonia = EXCLUDED.colonia,
                direccion_calle = EXCLUDED.direccion_calle,
                cruzamientos = EXCLUDED.cruzamientos,
                num_exterior = EXCLUDED.num_exterior,
                num_interior = EXCLUDED.num_interior,
                manzana = EXCLUDED.manzana,
                lote = EXCLUDED.lote
            RETURNING *;
        `;
        const { rows } = await db.query(query, [id_usuario, celular, telefono_fijo, codigo_postal, colonia, direccion_calle, cruzamientos, num_exterior, num_interior, manzana, lote]);

        res.json({ message: 'Domicilio guardado exitosamente.', data: rows[0] });
    } catch (error) {
        console.error('Error en upsertDomicilio:', error);
        res.status(500).json({ message: 'Error interno del servidor al procesar el domicilio.' });
    }
};

// ==========================================
// 3. PERFIL MÉDICO (Paso 4 del Frontend)
// ==========================================
perfilesController.upsertPerfilMedico = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const { id_tiposangre, peso_kg, estatura_mts, alergias_condiciones } = req.body;

        const validacion = await validarAccesoPerfil(req.user, id_usuario, true); // Bloquea a Admins destino
        if (validacion.error) return res.status(validacion.status).json({ message: validacion.message });

        const query = `
            INSERT INTO perfiles_medicos (id_usuario, id_tiposangre, peso_kg, estatura_mts, alergias_condiciones)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (id_usuario) 
            DO UPDATE SET 
                id_tiposangre = EXCLUDED.id_tiposangre,
                peso_kg = EXCLUDED.peso_kg,
                estatura_mts = EXCLUDED.estatura_mts,
                alergias_condiciones = EXCLUDED.alergias_condiciones
            RETURNING *;
        `;
        const { rows } = await db.query(query, [id_usuario, id_tiposangre, peso_kg, estatura_mts, alergias_condiciones]);

        res.json({ message: 'Perfil médico guardado exitosamente.', data: rows[0] });
    } catch (error) {
        console.error('Error en upsertPerfilMedico:', error);
        if (error.code === '23503') return res.status(400).json({ message: 'Error de integridad: El tipo de sangre ingresado no existe.' });
        if (error.code === '22P02') return res.status(400).json({ message: 'Error de formato: Datos numéricos inválidos en peso o estatura.' });
        res.status(500).json({ message: 'Error interno del servidor al procesar el perfil médico.' });
    }
};

// ==========================================
// 4. DETALLES / UNIFORMES (Paso 5 del Frontend)
// ==========================================
perfilesController.upsertDetalles = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const { id_categoria, id_talla_camisa, id_talla_pantalon, id_talla_short, id_talla_chamarra, talla_calzado, id_nivel_estudios, institucion_escolar } = req.body;

        const validacion = await validarAccesoPerfil(req.user, id_usuario, true); // Bloquea a Admins destino
        if (validacion.error) return res.status(validacion.status).json({ message: validacion.message });

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
        console.error('Error en upsertDetalles:', error);
        if (error.code === '23503') return res.status(400).json({ message: 'Error de integridad: Tallas, categoría o nivel de estudios no existen en el catálogo.' });
        res.status(500).json({ message: 'Error interno del servidor al procesar los detalles.' });
    }
};

// ==========================================
// 5. ENVIAR A REVISIÓN (Paso Final del Wizard)
// ==========================================
perfilesController.enviarARevision = async (req, res) => {
    try {
        const { id_usuario } = req.params;

        const validacion = await validarAccesoPerfil(req.user, id_usuario, false); 
        if (validacion.error) return res.status(validacion.status).json({ message: validacion.message });

        // Actualizamos el estatus del atleta asumiendo que "2" es "En Revisión"
        const query = `
            UPDATE atletas 
            SET id_estatus = 2 
            WHERE id_usuario = $1 
            RETURNING *;
        `;
        
        const { rows } = await db.query(query, [id_usuario]);

        if (rows.length === 0) {
            return res.json({ message: 'Perfil enviado a revisión exitosamente.' });
        }

        res.json({ message: 'Expediente deportivo enviado a revisión exitosamente.', data: rows[0] });
    } catch (error) {
        console.error('Error en enviarARevision:', error);
        // NUEVA LÍNEA: Atrapamos el error si el estatus 2 no existe
        if (error.code === '23503') return res.status(400).json({ message: 'Error de catálogo: El estatus destino (2) no existe en la base de datos.' });
        res.status(500).json({ message: 'Error interno del servidor al enviar a revisión.' });
    }
};

module.exports = perfilesController;