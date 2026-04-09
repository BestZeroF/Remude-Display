--
-- PostgreSQL database dump
--

\restrict 0ZnmaxBYJdNJKR3xdW7mfF55P81oLF50gUos7zvztsgSKUcZk8jQ3DhQyak3HlO

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
    id_talla integer,
    curp character varying(18) NOT NULL,
    fecha_nacimiento date NOT NULL
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
    apellidos character varying(100) NOT NULL,
    correo character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    estado_cuenta boolean DEFAULT true
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
-- Name: catalogo_estatus id_estatus; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalogo_estatus ALTER COLUMN id_estatus SET DEFAULT nextval('public.catalogo_estatus_id_estatus_seq'::regclass);


--
-- Name: catalogo_roles id_rol; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalogo_roles ALTER COLUMN id_rol SET DEFAULT nextval('public.catalogo_roles_id_rol_seq'::regclass);


--
-- Name: catalogo_tallas id_talla; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalogo_tallas ALTER COLUMN id_talla SET DEFAULT nextval('public.catalogo_tallas_id_talla_seq'::regclass);


--
-- Name: catalogo_tiponotificacion id_tiponotif; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalogo_tiponotificacion ALTER COLUMN id_tiponotif SET DEFAULT nextval('public.catalogo_tiponotificacion_id_tiponotif_seq'::regclass);


--
-- Name: catalogo_tiposdocumento id_tipodoc; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalogo_tiposdocumento ALTER COLUMN id_tipodoc SET DEFAULT nextval('public.catalogo_tiposdocumento_id_tipodoc_seq'::regclass);


--
-- Name: disciplinas id_disciplina; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.disciplinas ALTER COLUMN id_disciplina SET DEFAULT nextval('public.disciplinas_id_disciplina_seq'::regclass);


--
-- Name: documentos id_documento; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documentos ALTER COLUMN id_documento SET DEFAULT nextval('public.documentos_id_documento_seq'::regclass);


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
-- Name: solicitudes_reasignacion id_solicitud; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitudes_reasignacion ALTER COLUMN id_solicitud SET DEFAULT nextval('public.solicitudes_reasignacion_id_solicitud_seq'::regclass);


--
-- Name: usuarios id_usuario; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id_usuario SET DEFAULT nextval('public.usuarios_id_usuario_seq'::regclass);


--
-- Data for Name: administrativos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.administrativos (id_admin, id_usuario, nivel_permisos) FROM stdin;
\.


--
-- Data for Name: atleta_disciplina; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.atleta_disciplina (id_atleta, id_disciplina) FROM stdin;
\.


--
-- Data for Name: atletas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.atletas (id_atleta, id_usuario, id_entrenador, id_estatus, id_talla, curp, fecha_nacimiento) FROM stdin;
5	1	\N	1	\N	ABCD123456EFGHIJ78	2005-08-15
\.


--
-- Data for Name: catalogo_estatus; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.catalogo_estatus (id_estatus, nombre_estatus) FROM stdin;
1	Activo
\.


--
-- Data for Name: catalogo_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.catalogo_roles (id_rol, nombre_rol) FROM stdin;
1	Deportista
2	Entrenador
3	Administrador
\.


--
-- Data for Name: catalogo_tallas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.catalogo_tallas (id_talla, nomenclatura) FROM stdin;
\.


--
-- Data for Name: catalogo_tiponotificacion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.catalogo_tiponotificacion (id_tiponotif, nombre_tipo) FROM stdin;
\.


--
-- Data for Name: catalogo_tiposdocumento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.catalogo_tiposdocumento (id_tipodoc, nombre_tipo) FROM stdin;
\.


--
-- Data for Name: disciplinas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.disciplinas (id_disciplina, nombre_disciplina) FROM stdin;
\.


--
-- Data for Name: documentos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.documentos (id_documento, id_usuario, id_tipodoc, id_estatus, ruta_archivo, motivo_rechazo, fecha_subida, fecha_vencimiento) FROM stdin;
\.


--
-- Data for Name: entrenadores; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.entrenadores (id_entrenador, id_usuario, titulo_logro, fecha_logro, descripcion, especialidad, curp) FROM stdin;
8	10	\N	\N	\N	Atletismo	GAAA060101XXXXXXXX
\.


--
-- Data for Name: espacios_deportivos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.espacios_deportivos (id_espacio, id_estatus, nombre_espacio, ubicacion) FROM stdin;
\.


--
-- Data for Name: eventos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.eventos (id_evento, id_admin, nombre_evento, fecha_inicio, fecha_fin, descripcion) FROM stdin;
\.


--
-- Data for Name: historial_deportivo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.historial_deportivo (id_historial, id_atleta, descripcion, fecha_evento) FROM stdin;
\.


--
-- Data for Name: notificaciones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notificaciones (id_notificaciones, id_usuario, id_tiponotif, titulo, mensaje, leido, fecha_creacion) FROM stdin;
\.


--
-- Data for Name: solicitudes_reasignacion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.solicitudes_reasignacion (id_solicitud, id_usuario, id_atleta, id_entrenador, id_estatus, motivo, fecha_solicitud) FROM stdin;
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id_usuario, id_rol, nombre, apellidos, correo, password, estado_cuenta) FROM stdin;
1	1	Usuario	De Prueba	prueba@test.com	password123	t
10	2	Gerardo	Amaro	jerrygab2006@gmail.com	$2b$10$zqtAwW38Gg4NbVWp2ro4kuA0V3v9liPSlniF7gvwqesWjInzGMVYe	t
\.


--
-- Name: administrativos_id_admin_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.administrativos_id_admin_seq', 1, false);


--
-- Name: atletas_id_atleta_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.atletas_id_atleta_seq', 6, true);


--
-- Name: catalogo_estatus_id_estatus_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.catalogo_estatus_id_estatus_seq', 1, true);


--
-- Name: catalogo_roles_id_rol_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.catalogo_roles_id_rol_seq', 1, true);


--
-- Name: catalogo_tallas_id_talla_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.catalogo_tallas_id_talla_seq', 1, false);


--
-- Name: catalogo_tiponotificacion_id_tiponotif_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.catalogo_tiponotificacion_id_tiponotif_seq', 1, false);


--
-- Name: catalogo_tiposdocumento_id_tipodoc_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.catalogo_tiposdocumento_id_tipodoc_seq', 1, false);


--
-- Name: disciplinas_id_disciplina_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.disciplinas_id_disciplina_seq', 1, false);


--
-- Name: documentos_id_documento_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.documentos_id_documento_seq', 1, false);


--
-- Name: entrenadores_id_entrenador_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.entrenadores_id_entrenador_seq', 8, true);


--
-- Name: espacios_deportivos_id_espacio_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.espacios_deportivos_id_espacio_seq', 1, false);


--
-- Name: eventos_id_evento_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.eventos_id_evento_seq', 1, false);


--
-- Name: historial_deportivo_id_historial_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.historial_deportivo_id_historial_seq', 1, false);


--
-- Name: notificaciones_id_notificaciones_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notificaciones_id_notificaciones_seq', 1, false);


--
-- Name: solicitudes_reasignacion_id_solicitud_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.solicitudes_reasignacion_id_solicitud_seq', 1, false);


--
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_usuario_seq', 10, true);


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
-- Name: catalogo_estatus catalogo_estatus_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalogo_estatus
    ADD CONSTRAINT catalogo_estatus_pkey PRIMARY KEY (id_estatus);


--
-- Name: catalogo_roles catalogo_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalogo_roles
    ADD CONSTRAINT catalogo_roles_pkey PRIMARY KEY (id_rol);


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
-- Name: catalogo_tiposdocumento catalogo_tiposdocumento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalogo_tiposdocumento
    ADD CONSTRAINT catalogo_tiposdocumento_pkey PRIMARY KEY (id_tipodoc);


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
-- Name: atletas atletas_id_talla_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.atletas
    ADD CONSTRAINT atletas_id_talla_fkey FOREIGN KEY (id_talla) REFERENCES public.catalogo_tallas(id_talla);


--
-- Name: atletas atletas_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.atletas
    ADD CONSTRAINT atletas_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario) ON DELETE CASCADE;


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

\unrestrict 0ZnmaxBYJdNJKR3xdW7mfF55P81oLF50gUos7zvztsgSKUcZk8jQ3DhQyak3HlO

