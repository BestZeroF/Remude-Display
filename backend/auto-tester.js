const axios = require('axios');
const { fakerES_MX: faker } = require('@faker-js/faker'); // Para generar nombres mexicanos reales

// La ruta donde corre tu backend local
const BASE_URL = 'http://localhost:3000/api';

async function ejecutarAutoTester() {
    console.log('===========================================');
    console.log('🤖 INICIANDO AUTO-TESTER REMUDE V5.0');
    console.log('===========================================\n');

    let token = '';
    let id_usuario = '';

    // ==========================================
    // FASE 1: CREAR CUENTA BASE
    // ==========================================
    try {
        console.log('⏳ [Fase 1] Inventando datos y registrando nuevo Atleta...');
        const atletaData = {
            nombre: faker.person.firstName(),
            primer_apellido: faker.person.lastName(),
            segundo_apellido: faker.person.lastName(),
            correo: faker.internet.email().toLowerCase(),
            password: 'Password123!',
            curp: faker.string.alphanumeric(18).toUpperCase()
        };

        const res1 = await axios.post(`${BASE_URL}/auth/registro/atleta`, atletaData);
        token = res1.data.token;
        id_usuario = res1.data.id_usuario;
        
        console.log(`✅ [Fase 1] OK! Atleta creado: ${atletaData.nombre} ${atletaData.primer_apellido}`);
        console.log(`🔑 Token capturado: Bearer ${token.substring(0, 15)}...`);
    } catch (error) {
        console.error('❌ Falló la Fase 1:', error.response?.data || error.message);
        return; 
    }

    // Configurar cliente seguro de Axios (Inyecta el token automáticamente como lo hará React después)
    const api = axios.create({
        baseURL: BASE_URL,
        headers: { Authorization: `Bearer ${token}` }
    });

    // ==========================================
    // FASE 2: PERFIL PERSONAL
    // ==========================================
    try {
        console.log('\n⏳ [Fase 2] Llenando Perfil Personal...');
        const personalData = {
            id_sexo: 1, // Nota: Asume que el ID 1 existe en tu catalogo_sexo
            id_genero: 1,
            id_estadocivil: 1,
            rfc: faker.string.alphanumeric(13).toUpperCase(),
            nss: faker.string.numeric(11),
            clave_ine: faker.string.alphanumeric(18).toUpperCase(),
            lugar_nacimiento: faker.location.city()
        };

        await api.put(`/perfiles/${id_usuario}/personal`, personalData);
        console.log('✅ [Fase 2] OK! Perfil personal guardado.');
    } catch (error) {
        console.error('❌ Falló la Fase 2:', error.response?.data || error.message);
        console.log('💡 TIP: Si ves un error aquí, revisa que tus catálogos (ej. catalogo_sexo) no estén vacíos en la base de datos.');
        return;
    }

    // ==========================================
    // FASE 3: DOMICILIO
    // ==========================================
    try {
        console.log('\n⏳ [Fase 3] Llenando Dirección...');
        const domicilioData = {
            celular: faker.string.numeric(10),
            telefono_fijo: faker.string.numeric(10),
            codigo_postal: faker.location.zipCode('#####'),
            colonia: faker.location.street(),
            direccion_calle: faker.location.streetAddress(),
            cruzamientos: 'Entre calle 1 y calle 2',
            num_exterior: faker.location.buildingNumber(),
            num_interior: '',
            manzana: '15',
            lote: '4'
        };

        await api.put(`/perfiles/${id_usuario}/domicilio`, domicilioData);
        console.log('✅ [Fase 3] OK! Domicilio registrado exitosamente.');
    } catch (error) {
        console.error('❌ Falló la Fase 3:', error.response?.data || error.message);
        return;
    }

    // ==========================================
    // FASE 4: PERFIL MÉDICO
    // ==========================================
    try {
        console.log('\n⏳ [Fase 4] Generando Ficha Médica...');
        const medicoData = {
            id_tiposangre: 1, 
            peso_kg: parseFloat(faker.number.float({ min: 55, max: 90, fractionDigits: 2 })),
            estatura_mts: parseFloat(faker.number.float({ min: 1.5, max: 2.0, fractionDigits: 2 })),
            alergias_condiciones: 'Ninguna'
        };

        await api.put(`/perfiles/${id_usuario}/medico`, medicoData);
        console.log('✅ [Fase 4] OK! Perfil médico guardado.');
    } catch (error) {
        console.error('❌ Falló la Fase 4:', error.response?.data || error.message);
        return;
    }

    // ==========================================
    // FASE 5: DETALLES Y ACADEMIA
    // ==========================================
    try {
        console.log('\n⏳ [Fase 5] Llenando Tallas y Academia...');
        const detallesData = {
            id_categoria: 1,
            id_talla_camisa: 1,
            id_talla_pantalon: 1,
            id_talla_short: 1,
            id_talla_chamarra: 1,
            talla_calzado: 27.5,
            id_nivel_estudios: 1,
            institucion_escolar: 'CBTIS 214'
        };

        await api.put(`/perfiles/${id_usuario}/detalles`, detallesData);
        console.log('✅ [Fase 5] OK! Detalles deportivos listos.');
    } catch (error) {
        console.error('❌ Falló la Fase 5:', error.response?.data || error.message);
        return;
    }

    // ==========================================
    // FASE 6: ENVIAR A REVISIÓN
    // ==========================================
    try {
        console.log('\n⏳ [Fase 6] Enviando expediente completo a revisión...');
        await api.put(`/perfiles/${id_usuario}/enviar-revision`);
        console.log('✅ [Fase 6] OK! Estatus del atleta cambiado a "En Revisión".');
    } catch (error) {
        console.error('❌ Falló la Fase 6:', error.response?.data || error.message);
        return;
    }

    console.log('\n🎉 ¡TEST COMPLETADO CON ÉXITO!');
    console.log('El flujo de Progressive Profiling V5.0 funciona perfectamente de principio a fin.');
    console.log('===========================================\n');
}

ejecutarAutoTester();