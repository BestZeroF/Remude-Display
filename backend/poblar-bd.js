const axios = require('axios');
const { fakerES_MX: faker } = require('@faker-js/faker');

const BASE_URL = 'http://localhost:3000/api';

// Función para simular el registro de un tipo de usuario
async function crearUsuarioFalso(rol) {
    let token = '';
    let id_usuario = '';
    const esAtleta = rol === 'atleta';

    try {
        // FASE 1: Registro Base
        const userData = {
            nombre: faker.person.firstName(),
            primer_apellido: faker.person.lastName(),
            segundo_apellido: faker.person.lastName(),
            correo: faker.internet.email().toLowerCase(),
            password: 'Password123!',
            curp: faker.string.alphanumeric(18).toUpperCase()
        };

        const endpoint = esAtleta ? '/auth/registro/atleta' : '/auth/registro/entrenador';
        const res1 = await axios.post(`${BASE_URL}${endpoint}`, userData);
        token = res1.data.token;
        id_usuario = res1.data.id_usuario;

        const api = axios.create({
            baseURL: BASE_URL,
            headers: { Authorization: `Bearer ${token}` }
        });

        // FASE 2: Perfil Personal
        await api.put(`/perfiles/${id_usuario}/personal`, {
            id_sexo: faker.number.int({ min: 1, max: 2 }), // Asume que tienes 2 sexos en DB
            id_genero: faker.number.int({ min: 1, max: 2 }),
            id_estadocivil: 1,
            rfc: faker.string.alphanumeric(13).toUpperCase(),
            nss: faker.string.numeric(11),
            clave_ine: faker.string.alphanumeric(18).toUpperCase(),
            lugar_nacimiento: faker.location.city()
        });

        // FASE 3: Domicilio
        await api.put(`/perfiles/${id_usuario}/domicilio`, {
            celular: faker.string.numeric(10),
            telefono_fijo: faker.string.numeric(10),
            codigo_postal: faker.location.zipCode('#####'),
            colonia: faker.location.street(),
            direccion_calle: faker.location.streetAddress(),
            cruzamientos: 'N/A',
            num_exterior: faker.location.buildingNumber(),
            num_interior: '',
            manzana: '',
            lote: ''
        });

        // FASES 4 y 5 (Solo aplican para perfiles deportivos, no para admins)
        await api.put(`/perfiles/${id_usuario}/medico`, {
            id_tiposangre: 1, 
            peso_kg: parseFloat(faker.number.float({ min: 60, max: 85, fractionDigits: 2 })),
            estatura_mts: parseFloat(faker.number.float({ min: 1.6, max: 1.9, fractionDigits: 2 })),
            alergias_condiciones: 'Ninguna'
        });

        if(esAtleta){
            await api.put(`/perfiles/${id_usuario}/detalles`, {
                id_categoria: 1, id_talla_camisa: 1, id_talla_pantalon: 1, 
                id_talla_short: 1, id_talla_chamarra: 1, talla_calzado: 26.5,
                id_nivel_estudios: 1, institucion_escolar: 'Bachilleres'
            });
        }

        // FASE 6: Enviar a Revisión
        await api.put(`/perfiles/${id_usuario}/enviar-revision`);

        console.log(`✅ ${rol.toUpperCase()} creado: ${userData.nombre} ${userData.primer_apellido}`);
    } catch (error) {
        console.error(`❌ Error creando ${rol}:`, error.response?.data?.message || error.message);
    }
}

// Bucle principal para sembrar la base de datos
async function sembrarBaseDeDatos(numAtletas, numEntrenadores) {
    console.log('===========================================');
    console.log(`🌱 INICIANDO POBLACIÓN MASIVA DE DATOS`);
    console.log(`Atletas a crear: ${numAtletas} | Entrenadores a crear: ${numEntrenadores}`);
    console.log('===========================================\n');

    for (let i = 0; i < numAtletas; i++) {
        await crearUsuarioFalso('atleta');
    }

    for (let i = 0; i < numEntrenadores; i++) {
        await crearUsuarioFalso('entrenador');
    }

    console.log('\n===========================================');
    console.log('🎉 BASE DE DATOS POBLADA EXITOSAMENTE');
    console.log('Ya puedes ir a PgAdmin/DBeaver y ver todos tus nuevos registros.');
    console.log('===========================================');
}

// ==========================================
// CONFIGURACIÓN: ¿Cuántos quieres crear?
// (Puedes cambiar estos números)
// ==========================================
sembrarBaseDeDatos(5, 3); // Creará 5 atletas y 3 entrenadores