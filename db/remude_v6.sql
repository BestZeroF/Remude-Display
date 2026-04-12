--
-- PostgreSQL database dump
--

\restrict Rpf3O7bwca1qJHS9h4XwSibcxaCvgTUs6YoPJZhYAO8LJv5BbNvq8D3RLbTTMx2

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: administrativos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.administrativos (
    id_admin integer NOT NULL,
    id_usuario integer,
    nivel_permisos integer DEFAULT 1
);


ALTER TABLE public.administrativos OWNER TO postgres;

--
-- Name: administrativos_id_admin_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.administrativos_id_admin_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.administrativos_id_admin_seq OWNER TO postgres;

--
-- Name: administrativos_id_admin_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.administrativos_id_admin_seq OWNED BY public.administrativos.id_admin;


--
-- Name: atleta_disciplina; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.atleta_disciplina (
    id_atleta integer NOT NULL,
    id_disciplina integer NOT NULL
);


ALTER TABLE public.atleta_disciplina OWNER TO postgres;

--
-- Name: atletas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.atletas (
    id_atleta integer NOT NULL,
    id_usuario integer,
    id_entrenador integer,
    id_estatus integer,
    curp character varying(18) NOT NULL,
    fecha_nacimiento date,
    estado_validacion character varying(20) DEFAULT 'BORRADOR'::character varying
);


ALTER TABLE public.atletas OWNER TO postgres;

--
-- Name: atletas_id_atleta_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.atletas_id_atleta_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.atletas_id_atleta_seq OWNER TO postgres;

--
-- Name: atletas_id_atleta_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.atletas_id_atleta_seq OWNED BY public.atletas.id_atleta;


--
-- Name: catalogo_categorias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.catalogo_categorias (
    id_categoria integer NOT NULL,
    nombre_categoria character varying(100) NOT NULL
);


ALTER TABLE public.catalogo_categorias OWNER TO postgres;

--
-- Name: catalogo_categorias_id_categoria_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.catalogo_categorias_id_categoria_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.catalogo_categorias_id_categoria_seq OWNER TO postgres;

--
-- Name: catalogo_categorias_id_categoria_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.catalogo_categorias_id_categoria_seq OWNED BY public.catalogo_categorias.id_categoria;


--
-- Name: catalogo_estadocivil; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.catalogo_estadocivil (
    id_estadocivil integer NOT NULL,
    nombre_estado character varying(50) NOT NULL
);


ALTER TABLE public.catalogo_estadocivil OWNER TO postgres;

--
-- Name: catalogo_estadocivil_id_estadocivil_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.catalogo_estadocivil_id_estadocivil_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.catalogo_estadocivil_id_estadocivil_seq OWNER TO postgres;

--
-- Name: catalogo_estadocivil_id_estadocivil_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.catalogo_estadocivil_id_estadocivil_seq OWNED BY public.catalogo_estadocivil.id_estadocivil;


--
-- Name: catalogo_estatus; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.catalogo_estatus (
    id_estatus integer NOT NULL,
    nombre_estatus character varying(30) NOT NULL
);


ALTER TABLE public.catalogo_estatus OWNER TO postgres;

--
-- Name: catalogo_estatus_id_estatus_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.catalogo_estatus_id_estatus_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.catalogo_estatus_id_estatus_seq OWNER TO postgres;

--
-- Name: catalogo_estatus_id_estatus_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.catalogo_estatus_id_estatus_seq OWNED BY public.catalogo_estatus.id_estatus;


--
-- Name: catalogo_genero; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.catalogo_genero (
    id_genero integer NOT NULL,
    nombre_genero character varying(50) NOT NULL
);


ALTER TABLE public.catalogo_genero OWNER TO postgres;

--
-- Name: catalogo_genero_id_genero_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.catalogo_genero_id_genero_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.catalogo_genero_id_genero_seq OWNER TO postgres;

--
-- Name: catalogo_genero_id_genero_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.catalogo_genero_id_genero_seq OWNED BY public.catalogo_genero.id_genero;


--
-- Name: catalogo_nivelestudios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.catalogo_nivelestudios (
    id_nivel integer NOT NULL,
    nombre_nivel character varying(100) NOT NULL
);


ALTER TABLE public.catalogo_nivelestudios OWNER TO postgres;

--
-- Name: catalogo_nivelestudios_id_nivel_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.catalogo_nivelestudios_id_nivel_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.catalogo_nivelestudios_id_nivel_seq OWNER TO postgres;

--
-- Name: catalogo_nivelestudios_id_nivel_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.catalogo_nivelestudios_id_nivel_seq OWNED BY public.catalogo_nivelestudios.id_nivel;


--
-- Name: catalogo_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.catalogo_roles (
    id_rol integer NOT NULL,
    nombre_rol character varying(50) NOT NULL
);


ALTER TABLE public.catalogo_roles OWNER TO postgres;

--
-- Name: catalogo_roles_id_rol_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.catalogo_roles_id_rol_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.catalogo_roles_id_rol_seq OWNER TO postgres;

--
-- Name: catalogo_roles_id_rol_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.catalogo_roles_id_rol_seq OWNED BY public.catalogo_roles.id_rol;


--
-- Name: catalogo_sexo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.catalogo_sexo (
    id_sexo integer NOT NULL,
    nombre_sexo character varying(50) NOT NULL
);


ALTER TABLE public.catalogo_sexo OWNER TO postgres;

--
-- Name: catalogo_sexo_id_sexo_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.catalogo_sexo_id_sexo_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.catalogo_sexo_id_sexo_seq OWNER TO postgres;

--
-- Name: catalogo_sexo_id_sexo_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.catalogo_sexo_id_sexo_seq OWNED BY public.catalogo_sexo.id_sexo;


--
-- Name: catalogo_tallas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.catalogo_tallas (
    id_talla integer NOT NULL,
    nomenclatura character varying(10) NOT NULL
);


ALTER TABLE public.catalogo_tallas OWNER TO postgres;

--
-- Name: catalogo_tallas_id_talla_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.catalogo_tallas_id_talla_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.catalogo_tallas_id_talla_seq OWNER TO postgres;

--
-- Name: catalogo_tallas_id_talla_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.catalogo_tallas_id_talla_seq OWNED BY public.catalogo_tallas.id_talla;


--
-- Name: catalogo_tiponotificacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.catalogo_tiponotificacion (
    id_tiponotif integer NOT NULL,
    nombre_tipo character varying(50) NOT NULL
);


ALTER TABLE public.catalogo_tiponotificacion OWNER TO postgres;

--
-- Name: catalogo_tiponotificacion_id_tiponotif_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.catalogo_tiponotificacion_id_tiponotif_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.catalogo_tiponotificacion_id_tiponotif_seq OWNER TO postgres;

--
-- Name: catalogo_tiponotificacion_id_tiponotif_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.catalogo_tiponotificacion_id_tiponotif_seq OWNED BY public.catalogo_tiponotificacion.id_tiponotif;


--
-- Name: catalogo_tiposangre; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.catalogo_tiposangre (
    id_tiposangre integer NOT NULL,
    grupo_sanguineo character varying(10) NOT NULL
);


ALTER TABLE public.catalogo_tiposangre OWNER TO postgres;

--
-- Name: catalogo_tiposangre_id_tiposangre_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.catalogo_tiposangre_id_tiposangre_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.catalogo_tiposangre_id_tiposangre_seq OWNER TO postgres;

--
-- Name: catalogo_tiposangre_id_tiposangre_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.catalogo_tiposangre_id_tiposangre_seq OWNED BY public.catalogo_tiposangre.id_tiposangre;


--
-- Name: catalogo_tiposdocumento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.catalogo_tiposdocumento (
    id_tipodoc integer NOT NULL,
    nombre_tipo character varying(30) NOT NULL
);


ALTER TABLE public.catalogo_tiposdocumento OWNER TO postgres;

--
-- Name: catalogo_tiposdocumento_id_tipodoc_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.catalogo_tiposdocumento_id_tipodoc_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.catalogo_tiposdocumento_id_tipodoc_seq OWNER TO postgres;

--
-- Name: catalogo_tiposdocumento_id_tipodoc_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.catalogo_tiposdocumento_id_tipodoc_seq OWNED BY public.catalogo_tiposdocumento.id_tipodoc;


--
-- Name: detalles_atletas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.detalles_atletas (
    id_detalle integer NOT NULL,
    id_categoria integer,
    id_talla_camisa integer,
    id_talla_pantalon integer,
    id_talla_short integer,
    id_talla_chamarra integer,
    talla_calzado numeric(4,1),
    id_nivel_estudios integer,
    institucion_escolar character varying(200),
    id_usuario integer NOT NULL
);


ALTER TABLE public.detalles_atletas OWNER TO postgres;

--
-- Name: detalles_atletas_id_detalle_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.detalles_atletas_id_detalle_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.detalles_atletas_id_detalle_seq OWNER TO postgres;

--
-- Name: detalles_atletas_id_detalle_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.detalles_atletas_id_detalle_seq OWNED BY public.detalles_atletas.id_detalle;


--
-- Name: disciplinas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.disciplinas (
    id_disciplina integer NOT NULL,
    nombre_disciplina character varying(100) NOT NULL
);


ALTER TABLE public.disciplinas OWNER TO postgres;

--
-- Name: disciplinas_id_disciplina_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.disciplinas_id_disciplina_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.disciplinas_id_disciplina_seq OWNER TO postgres;

--
-- Name: disciplinas_id_disciplina_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.disciplinas_id_disciplina_seq OWNED BY public.disciplinas.id_disciplina;


--
-- Name: documentos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.documentos (
    id_documento integer NOT NULL,
    id_usuario integer,
    id_tipodoc integer,
    id_estatus integer,
    ruta_archivo character varying(255) NOT NULL,
    motivo_rechazo text,
    fecha_subida timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    fecha_vencimiento date
);


ALTER TABLE public.documentos OWNER TO postgres;

--
-- Name: documentos_id_documento_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.documentos_id_documento_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.documentos_id_documento_seq OWNER TO postgres;

--
-- Name: documentos_id_documento_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.documentos_id_documento_seq OWNED BY public.documentos.id_documento;


--
-- Name: domicilios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.domicilios (
    id_domicilio integer NOT NULL,
    id_usuario integer,
    celular character varying(20),
    telefono_fijo character varying(20),
    codigo_postal character varying(10),
    colonia character varying(150),
    direccion_calle character varying(150),
    cruzamientos character varying(150),
    num_exterior character varying(20),
    num_interior character varying(20),
    manzana character varying(20),
    lote character varying(20)
);


ALTER TABLE public.domicilios OWNER TO postgres;

--
-- Name: domicilios_id_domicilio_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.domicilios_id_domicilio_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.domicilios_id_domicilio_seq OWNER TO postgres;

--
-- Name: domicilios_id_domicilio_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.domicilios_id_domicilio_seq OWNED BY public.domicilios.id_domicilio;


--
-- Name: entrenadores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.entrenadores (
    id_entrenador integer NOT NULL,
    id_usuario integer,
    titulo_logro character varying(150),
    fecha_logro date,
    descripcion text,
    especialidad character varying(100),
    curp character varying(18)
);


ALTER TABLE public.entrenadores OWNER TO postgres;

--
-- Name: entrenadores_id_entrenador_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.entrenadores_id_entrenador_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.entrenadores_id_entrenador_seq OWNER TO postgres;

--
-- Name: entrenadores_id_entrenador_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.entrenadores_id_entrenador_seq OWNED BY public.entrenadores.id_entrenador;


--
-- Name: espacios_deportivos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.espacios_deportivos (
    id_espacio integer NOT NULL,
    id_estatus integer,
    nombre_espacio character varying(150) NOT NULL,
    ubicacion character varying(250)
);


ALTER TABLE public.espacios_deportivos OWNER TO postgres;

--
-- Name: espacios_deportivos_id_espacio_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.espacios_deportivos_id_espacio_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.espacios_deportivos_id_espacio_seq OWNER TO postgres;

--
-- Name: espacios_deportivos_id_espacio_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.espacios_deportivos_id_espacio_seq OWNED BY public.espacios_deportivos.id_espacio;


--
-- Name: eventos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.eventos (
    id_evento integer NOT NULL,
    id_admin integer,
    nombre_evento character varying(150) NOT NULL,
    fecha_inicio date NOT NULL,
    fecha_fin date,
    descripcion text
);


ALTER TABLE public.eventos OWNER TO postgres;

--
-- Name: eventos_id_evento_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.eventos_id_evento_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.eventos_id_evento_seq OWNER TO postgres;

--
-- Name: eventos_id_evento_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.eventos_id_evento_seq OWNED BY public.eventos.id_evento;


--
-- Name: historial_deportivo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.historial_deportivo (
    id_historial integer NOT NULL,
    id_atleta integer,
    descripcion text,
    fecha_evento date
);


ALTER TABLE public.historial_deportivo OWNER TO postgres;

--
-- Name: historial_deportivo_id_historial_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.historial_deportivo_id_historial_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.historial_deportivo_id_historial_seq OWNER TO postgres;

--
-- Name: historial_deportivo_id_historial_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.historial_deportivo_id_historial_seq OWNED BY public.historial_deportivo.id_historial;


--
-- Name: notificaciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notificaciones (
    id_notificaciones integer NOT NULL,
    id_usuario integer,
    id_tiponotif integer,
    titulo character varying(100) NOT NULL,
    mensaje text NOT NULL,
    leido boolean DEFAULT false,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.notificaciones OWNER TO postgres;

--
-- Name: notificaciones_id_notificaciones_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notificaciones_id_notificaciones_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notificaciones_id_notificaciones_seq OWNER TO postgres;

--
-- Name: notificaciones_id_notificaciones_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notificaciones_id_notificaciones_seq OWNED BY public.notificaciones.id_notificaciones;


--
-- Name: perfiles_medicos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.perfiles_medicos (
    id_perfil_medico integer NOT NULL,
    id_tiposangre integer,
    peso_kg numeric(5,2),
    estatura_mts numeric(4,2),
    alergias_condiciones text,
    id_usuario integer NOT NULL
);


ALTER TABLE public.perfiles_medicos OWNER TO postgres;

--
-- Name: perfiles_medicos_id_perfil_medico_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.perfiles_medicos_id_perfil_medico_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.perfiles_medicos_id_perfil_medico_seq OWNER TO postgres;

--
-- Name: perfiles_medicos_id_perfil_medico_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.perfiles_medicos_id_perfil_medico_seq OWNED BY public.perfiles_medicos.id_perfil_medico;


--
-- Name: perfiles_personales; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.perfiles_personales (
    id_perfil integer NOT NULL,
    id_usuario integer,
    id_sexo integer,
    id_genero integer,
    id_estadocivil integer,
    rfc character varying(13),
    nss character varying(20),
    clave_ine character varying(25),
    lugar_nacimiento character varying(150)
);


ALTER TABLE public.perfiles_personales OWNER TO postgres;

--
-- Name: perfiles_personales_id_perfil_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.perfiles_personales_id_perfil_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.perfiles_personales_id_perfil_seq OWNER TO postgres;

--
-- Name: perfiles_personales_id_perfil_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.perfiles_personales_id_perfil_seq OWNED BY public.perfiles_personales.id_perfil;


--
-- Name: solicitudes_reasignacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.solicitudes_reasignacion (
    id_solicitud integer NOT NULL,
    id_usuario integer,
    id_atleta integer,
    id_entrenador integer,
    id_estatus integer,
    motivo text,
    fecha_solicitud timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.solicitudes_reasignacion OWNER TO postgres;

--
-- Name: solicitudes_reasignacion_id_solicitud_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.solicitudes_reasignacion_id_solicitud_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.solicitudes_reasignacion_id_solicitud_seq OWNER TO postgres;

--
-- Name: solicitudes_reasignacion_id_solicitud_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.solicitudes_reasignacion_id_solicitud_seq OWNED BY public.solicitudes_reasignacion.id_solicitud;


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id_usuario integer NOT NULL,
    id_rol integer,
    nombre character varying(100) NOT NULL,
    primer_apellido character varying(100) CONSTRAINT usuarios_apellidos_not_null NOT NULL,
    correo character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    estado_cuenta boolean DEFAULT true,
    segundo_apellido character varying(100)
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_usuario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_usuario_seq OWNER TO postgres;

--
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_usuario_seq OWNED BY public.usuarios.id_usuario;


--
-- Name: administrativos id_admin; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administrativos ALTER COLUMN id_admin SET DEFAULT nextval('public.administrativos_id_admin_seq'::regclass);


--
-- Name: atletas id_atleta; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.atletas ALTER COLUMN id_atleta SET DEFAULT nextval('public.atletas_id_atleta_seq'::regclass);


--
-- Name: catalogo_categorias id_categoria; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalogo_categorias ALTER COLUMN id_categoria SET DEFAULT nextval('public.catalogo_categorias_id_categoria_seq'::regclass);


--
-- Name: catalogo_estadocivil id_estadocivil; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalogo_estadocivil ALTER COLUMN id_estadocivil SET DEFAULT nextval('public.catalogo_estadocivil_id_estadocivil_seq'::regclass);


--
-- Name: catalogo_estatus id_estatus; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalogo_estatus ALTER COLUMN id_estatus SET DEFAULT nextval('public.catalogo_estatus_id_estatus_seq'::regclass);


--
-- Name: catalogo_genero id_genero; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalogo_genero ALTER COLUMN id_genero SET DEFAULT nextval('public.catalogo_genero_id_genero_seq'::regclass);


--
-- Name: catalogo_nivelestudios id_nivel; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalogo_nivelestudios ALTER COLUMN id_nivel SET DEFAULT nextval('public.catalogo_nivelestudios_id_nivel_seq'::regclass);


--
-- Name: catalogo_roles id_rol; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalogo_roles ALTER COLUMN id_rol SET DEFAULT nextval('public.catalogo_roles_id_rol_seq'::regclass);


--
-- Name: catalogo_sexo id_sexo; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalogo_sexo ALTER COLUMN id_sexo SET DEFAULT nextval('public.catalogo_sexo_id_sexo_seq'::regclass);


--
-- Name: catalogo_tallas id_talla; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalogo_tallas ALTER COLUMN id_talla SET DEFAULT nextval('public.catalogo_tallas_id_talla_seq'::regclass);


--
-- Name: catalogo_tiponotificacion id_tiponotif; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalogo_tiponotificacion ALTER COLUMN id_tiponotif SET DEFAULT nextval('public.catalogo_tiponotificacion_id_tiponotif_seq'::regclass);


--
-- Name: catalogo_tiposangre id_tiposangre; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalogo_tiposangre ALTER COLUMN id_tiposangre SET DEFAULT nextval('public.catalogo_tiposangre_id_tiposangre_seq'::regclass);


--
-- Name: catalogo_tiposdocumento id_tipodoc; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalogo_tiposdocumento ALTER COLUMN id_tipodoc SET DEFAULT nextval('public.catalogo_tiposdocumento_id_tipodoc_seq'::regclass);


--
-- Name: detalles_atletas id_detalle; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalles_atletas ALTER COLUMN id_detalle SET DEFAULT nextval('public.detalles_atletas_id_detalle_seq'::regclass);


--
-- Name: disciplinas id_disciplina; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.disciplinas ALTER COLUMN id_disciplina SET DEFAULT nextval('public.disciplinas_id_disciplina_seq'::regclass);


--
-- Name: documentos id_documento; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documentos ALTER COLUMN id_documento SET DEFAULT nextval('public.documentos_id_documento_seq'::regclass);


--
-- Name: domicilios id_domicilio; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.domicilios ALTER COLUMN id_domicilio SET DEFAULT nextval('public.domicilios_id_domicilio_seq'::regclass);


--
-- Name: entrenadores id_entrenador; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.entrenadores ALTER COLUMN id_entrenador SET DEFAULT nextval('public.entrenadores_id_entrenador_seq'::regclass);


--
-- Name: espacios_deportivos id_espacio; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.espacios_deportivos ALTER COLUMN id_espacio SET DEFAULT nextval('public.espacios_deportivos_id_espacio_seq'::regclass);


--
-- Name: eventos id_evento; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.eventos ALTER COLUMN id_evento SET DEFAULT nextval('public.eventos_id_evento_seq'::regclass);


--
-- Name: historial_deportivo id_historial; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_deportivo ALTER COLUMN id_historial SET DEFAULT nextval('public.historial_deportivo_id_historial_seq'::regclass);


--
-- Name: notificaciones id_notificaciones; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notificaciones ALTER COLUMN id_notificaciones SET DEFAULT nextval('public.notificaciones_id_notificaciones_seq'::regclass);


--
-- Name: perfiles_medicos id_perfil_medico; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfiles_medicos ALTER COLUMN id_perfil_medico SET DEFAULT nextval('public.perfiles_medicos_id_perfil_medico_seq'::regclass);


--
-- Name: perfiles_personales id_perfil; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfiles_personales ALTER COLUMN id_perfil SET DEFAULT nextval('public.perfiles_personales_id_perfil_seq'::regclass);


--
-- Name: solicitudes_reasignacion id_solicitud; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitudes_reasignacion ALTER COLUMN id_solicitud SET DEFAULT nextval('public.solicitudes_reasignacion_id_solicitud_seq'::regclass);


--
-- Name: usuarios id_usuario; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id_usuario SET DEFAULT nextval('public.usuarios_id_usuario_seq'::regclass);


--
-- Name: administrativos administrativos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administrativos
    ADD CONSTRAINT administrativos_pkey PRIMARY KEY (id_admin);


--
-- Name: atleta_disciplina atleta_disciplina_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.atleta_disciplina
    ADD CONSTRAINT atleta_disciplina_pkey PRIMARY KEY (id_atleta, id_disciplina);


--
-- Name: atletas atletas_curp_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.atletas
    ADD CONSTRAINT atletas_curp_key UNIQUE (curp);


--
-- Name: atletas atletas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.atletas
    ADD CONSTRAINT atletas_pkey PRIMARY KEY (id_atleta);


--
-- Name: catalogo_categorias catalogo_categorias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalogo_categorias
    ADD CONSTRAINT catalogo_categorias_pkey PRIMARY KEY (id_categoria);


--
-- Name: catalogo_estadocivil catalogo_estadocivil_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalogo_estadocivil
    ADD CONSTRAINT catalogo_estadocivil_pkey PRIMARY KEY (id_estadocivil);


--
-- Name: catalogo_estatus catalogo_estatus_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalogo_estatus
    ADD CONSTRAINT catalogo_estatus_pkey PRIMARY KEY (id_estatus);


--
-- Name: catalogo_genero catalogo_genero_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalogo_genero
    ADD CONSTRAINT catalogo_genero_pkey PRIMARY KEY (id_genero);


--
-- Name: catalogo_nivelestudios catalogo_nivelestudios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalogo_nivelestudios
    ADD CONSTRAINT catalogo_nivelestudios_pkey PRIMARY KEY (id_nivel);


--
-- Name: catalogo_roles catalogo_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalogo_roles
    ADD CONSTRAINT catalogo_roles_pkey PRIMARY KEY (id_rol);


--
-- Name: catalogo_sexo catalogo_sexo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalogo_sexo
    ADD CONSTRAINT catalogo_sexo_pkey PRIMARY KEY (id_sexo);


--
-- Name: catalogo_tallas catalogo_tallas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalogo_tallas
    ADD CONSTRAINT catalogo_tallas_pkey PRIMARY KEY (id_talla);


--
-- Name: catalogo_tiponotificacion catalogo_tiponotificacion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalogo_tiponotificacion
    ADD CONSTRAINT catalogo_tiponotificacion_pkey PRIMARY KEY (id_tiponotif);


--
-- Name: catalogo_tiposangre catalogo_tiposangre_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalogo_tiposangre
    ADD CONSTRAINT catalogo_tiposangre_pkey PRIMARY KEY (id_tiposangre);


--
-- Name: catalogo_tiposdocumento catalogo_tiposdocumento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalogo_tiposdocumento
    ADD CONSTRAINT catalogo_tiposdocumento_pkey PRIMARY KEY (id_tipodoc);


--
-- Name: detalles_atletas detalles_atletas_id_usuario_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalles_atletas
    ADD CONSTRAINT detalles_atletas_id_usuario_key UNIQUE (id_usuario);


--
-- Name: detalles_atletas detalles_atletas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalles_atletas
    ADD CONSTRAINT detalles_atletas_pkey PRIMARY KEY (id_detalle);


--
-- Name: disciplinas disciplinas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.disciplinas
    ADD CONSTRAINT disciplinas_pkey PRIMARY KEY (id_disciplina);


--
-- Name: documentos documentos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documentos
    ADD CONSTRAINT documentos_pkey PRIMARY KEY (id_documento);


--
-- Name: domicilios domicilios_id_usuario_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.domicilios
    ADD CONSTRAINT domicilios_id_usuario_key UNIQUE (id_usuario);


--
-- Name: domicilios domicilios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.domicilios
    ADD CONSTRAINT domicilios_pkey PRIMARY KEY (id_domicilio);


--
-- Name: entrenadores entrenadores_curp_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.entrenadores
    ADD CONSTRAINT entrenadores_curp_key UNIQUE (curp);


--
-- Name: entrenadores entrenadores_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.entrenadores
    ADD CONSTRAINT entrenadores_pkey PRIMARY KEY (id_entrenador);


--
-- Name: espacios_deportivos espacios_deportivos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.espacios_deportivos
    ADD CONSTRAINT espacios_deportivos_pkey PRIMARY KEY (id_espacio);


--
-- Name: eventos eventos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.eventos
    ADD CONSTRAINT eventos_pkey PRIMARY KEY (id_evento);


--
-- Name: historial_deportivo historial_deportivo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_deportivo
    ADD CONSTRAINT historial_deportivo_pkey PRIMARY KEY (id_historial);


--
-- Name: notificaciones notificaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notificaciones
    ADD CONSTRAINT notificaciones_pkey PRIMARY KEY (id_notificaciones);


--
-- Name: perfiles_medicos perfiles_medicos_id_usuario_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfiles_medicos
    ADD CONSTRAINT perfiles_medicos_id_usuario_key UNIQUE (id_usuario);


--
-- Name: perfiles_medicos perfiles_medicos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfiles_medicos
    ADD CONSTRAINT perfiles_medicos_pkey PRIMARY KEY (id_perfil_medico);


--
-- Name: perfiles_personales perfiles_personales_id_usuario_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfiles_personales
    ADD CONSTRAINT perfiles_personales_id_usuario_key UNIQUE (id_usuario);


--
-- Name: perfiles_personales perfiles_personales_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfiles_personales
    ADD CONSTRAINT perfiles_personales_pkey PRIMARY KEY (id_perfil);


--
-- Name: solicitudes_reasignacion solicitudes_reasignacion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitudes_reasignacion
    ADD CONSTRAINT solicitudes_reasignacion_pkey PRIMARY KEY (id_solicitud);


--
-- Name: usuarios usuarios_correo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_correo_key UNIQUE (correo);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id_usuario);


--
-- Name: administrativos administrativos_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administrativos
    ADD CONSTRAINT administrativos_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario) ON DELETE CASCADE;


--
-- Name: atleta_disciplina atleta_disciplina_id_atleta_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.atleta_disciplina
    ADD CONSTRAINT atleta_disciplina_id_atleta_fkey FOREIGN KEY (id_atleta) REFERENCES public.atletas(id_atleta) ON DELETE CASCADE;


--
-- Name: atleta_disciplina atleta_disciplina_id_disciplina_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.atleta_disciplina
    ADD CONSTRAINT atleta_disciplina_id_disciplina_fkey FOREIGN KEY (id_disciplina) REFERENCES public.disciplinas(id_disciplina) ON DELETE CASCADE;


--
-- Name: atletas atletas_id_entrenador_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.atletas
    ADD CONSTRAINT atletas_id_entrenador_fkey FOREIGN KEY (id_entrenador) REFERENCES public.entrenadores(id_entrenador) ON DELETE SET NULL;


--
-- Name: atletas atletas_id_estatus_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.atletas
    ADD CONSTRAINT atletas_id_estatus_fkey FOREIGN KEY (id_estatus) REFERENCES public.catalogo_estatus(id_estatus);


--
-- Name: atletas atletas_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.atletas
    ADD CONSTRAINT atletas_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario) ON DELETE CASCADE;


--
-- Name: detalles_atletas detalles_atletas_id_categoria_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalles_atletas
    ADD CONSTRAINT detalles_atletas_id_categoria_fkey FOREIGN KEY (id_categoria) REFERENCES public.catalogo_categorias(id_categoria);


--
-- Name: detalles_atletas detalles_atletas_id_nivel_estudios_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalles_atletas
    ADD CONSTRAINT detalles_atletas_id_nivel_estudios_fkey FOREIGN KEY (id_nivel_estudios) REFERENCES public.catalogo_nivelestudios(id_nivel);


--
-- Name: detalles_atletas detalles_atletas_id_talla_camisa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalles_atletas
    ADD CONSTRAINT detalles_atletas_id_talla_camisa_fkey FOREIGN KEY (id_talla_camisa) REFERENCES public.catalogo_tallas(id_talla);


--
-- Name: detalles_atletas detalles_atletas_id_talla_chamarra_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalles_atletas
    ADD CONSTRAINT detalles_atletas_id_talla_chamarra_fkey FOREIGN KEY (id_talla_chamarra) REFERENCES public.catalogo_tallas(id_talla);


--
-- Name: detalles_atletas detalles_atletas_id_talla_pantalon_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalles_atletas
    ADD CONSTRAINT detalles_atletas_id_talla_pantalon_fkey FOREIGN KEY (id_talla_pantalon) REFERENCES public.catalogo_tallas(id_talla);


--
-- Name: detalles_atletas detalles_atletas_id_talla_short_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalles_atletas
    ADD CONSTRAINT detalles_atletas_id_talla_short_fkey FOREIGN KEY (id_talla_short) REFERENCES public.catalogo_tallas(id_talla);


--
-- Name: detalles_atletas detalles_atletas_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalles_atletas
    ADD CONSTRAINT detalles_atletas_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario) ON DELETE CASCADE;


--
-- Name: documentos documentos_id_estatus_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documentos
    ADD CONSTRAINT documentos_id_estatus_fkey FOREIGN KEY (id_estatus) REFERENCES public.catalogo_estatus(id_estatus);


--
-- Name: documentos documentos_id_tipodoc_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documentos
    ADD CONSTRAINT documentos_id_tipodoc_fkey FOREIGN KEY (id_tipodoc) REFERENCES public.catalogo_tiposdocumento(id_tipodoc);


--
-- Name: documentos documentos_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documentos
    ADD CONSTRAINT documentos_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario) ON DELETE CASCADE;


--
-- Name: domicilios domicilios_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.domicilios
    ADD CONSTRAINT domicilios_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario) ON DELETE CASCADE;


--
-- Name: entrenadores entrenadores_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.entrenadores
    ADD CONSTRAINT entrenadores_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario) ON DELETE CASCADE;


--
-- Name: espacios_deportivos espacios_deportivos_id_estatus_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.espacios_deportivos
    ADD CONSTRAINT espacios_deportivos_id_estatus_fkey FOREIGN KEY (id_estatus) REFERENCES public.catalogo_estatus(id_estatus);


--
-- Name: eventos eventos_id_admin_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.eventos
    ADD CONSTRAINT eventos_id_admin_fkey FOREIGN KEY (id_admin) REFERENCES public.administrativos(id_admin);


--
-- Name: historial_deportivo historial_deportivo_id_atleta_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_deportivo
    ADD CONSTRAINT historial_deportivo_id_atleta_fkey FOREIGN KEY (id_atleta) REFERENCES public.atletas(id_atleta) ON DELETE CASCADE;


--
-- Name: notificaciones notificaciones_id_tiponotif_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notificaciones
    ADD CONSTRAINT notificaciones_id_tiponotif_fkey FOREIGN KEY (id_tiponotif) REFERENCES public.catalogo_tiponotificacion(id_tiponotif);


--
-- Name: notificaciones notificaciones_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notificaciones
    ADD CONSTRAINT notificaciones_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario) ON DELETE CASCADE;


--
-- Name: perfiles_medicos perfiles_medicos_id_tiposangre_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfiles_medicos
    ADD CONSTRAINT perfiles_medicos_id_tiposangre_fkey FOREIGN KEY (id_tiposangre) REFERENCES public.catalogo_tiposangre(id_tiposangre);


--
-- Name: perfiles_medicos perfiles_medicos_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfiles_medicos
    ADD CONSTRAINT perfiles_medicos_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario) ON DELETE CASCADE;


--
-- Name: perfiles_personales perfiles_personales_id_estadocivil_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfiles_personales
    ADD CONSTRAINT perfiles_personales_id_estadocivil_fkey FOREIGN KEY (id_estadocivil) REFERENCES public.catalogo_estadocivil(id_estadocivil);


--
-- Name: perfiles_personales perfiles_personales_id_genero_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfiles_personales
    ADD CONSTRAINT perfiles_personales_id_genero_fkey FOREIGN KEY (id_genero) REFERENCES public.catalogo_genero(id_genero);


--
-- Name: perfiles_personales perfiles_personales_id_sexo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfiles_personales
    ADD CONSTRAINT perfiles_personales_id_sexo_fkey FOREIGN KEY (id_sexo) REFERENCES public.catalogo_sexo(id_sexo);


--
-- Name: perfiles_personales perfiles_personales_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfiles_personales
    ADD CONSTRAINT perfiles_personales_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario) ON DELETE CASCADE;


--
-- Name: solicitudes_reasignacion solicitudes_reasignacion_id_atleta_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitudes_reasignacion
    ADD CONSTRAINT solicitudes_reasignacion_id_atleta_fkey FOREIGN KEY (id_atleta) REFERENCES public.atletas(id_atleta) ON DELETE CASCADE;


--
-- Name: solicitudes_reasignacion solicitudes_reasignacion_id_entrenador_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitudes_reasignacion
    ADD CONSTRAINT solicitudes_reasignacion_id_entrenador_fkey FOREIGN KEY (id_entrenador) REFERENCES public.entrenadores(id_entrenador) ON DELETE CASCADE;


--
-- Name: solicitudes_reasignacion solicitudes_reasignacion_id_estatus_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitudes_reasignacion
    ADD CONSTRAINT solicitudes_reasignacion_id_estatus_fkey FOREIGN KEY (id_estatus) REFERENCES public.catalogo_estatus(id_estatus);


--
-- Name: solicitudes_reasignacion solicitudes_reasignacion_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitudes_reasignacion
    ADD CONSTRAINT solicitudes_reasignacion_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario) ON DELETE CASCADE;


--
-- Name: usuarios usuarios_id_rol_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_id_rol_fkey FOREIGN KEY (id_rol) REFERENCES public.catalogo_roles(id_rol);


--
-- PostgreSQL database dump complete
--

\unrestrict Rpf3O7bwca1qJHS9h4XwSibcxaCvgTUs6YoPJZhYAO8LJv5BbNvq8D3RLbTTMx2

