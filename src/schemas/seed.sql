--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2 (Debian 17.2-1.pgdg120+1)
-- Dumped by pg_dump version 17.2 (Debian 17.2-1.pgdg120+1)

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

--
-- Name: drizzle; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA drizzle;


ALTER SCHEMA drizzle OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: __drizzle_migrations; Type: TABLE; Schema: drizzle; Owner: postgres
--

CREATE TABLE drizzle.__drizzle_migrations (
    id integer NOT NULL,
    hash text NOT NULL,
    created_at bigint
);


ALTER TABLE drizzle.__drizzle_migrations OWNER TO postgres;

--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE; Schema: drizzle; Owner: postgres
--

CREATE SEQUENCE drizzle.__drizzle_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNER TO postgres;

--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: drizzle; Owner: postgres
--

ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNED BY drizzle.__drizzle_migrations.id;


--
-- Name: clients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clients (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone,
    deleted_at timestamp without time zone,
    first_name text NOT NULL,
    last_name text NOT NULL,
    label text GENERATED ALWAYS AS (((first_name || ' '::text) || last_name)) STORED NOT NULL,
    dob timestamp without time zone NOT NULL,
    phone text,
    email text
);


ALTER TABLE public.clients OWNER TO postgres;

--
-- Name: clients_services; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clients_services (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone,
    deleted_at timestamp without time zone,
    client_id uuid NOT NULL,
    service_id uuid NOT NULL,
    description text NOT NULL
);


ALTER TABLE public.clients_services OWNER TO postgres;

--
-- Name: organizations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.organizations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone,
    deleted_at timestamp without time zone,
    label text NOT NULL,
    email text NOT NULL
);


ALTER TABLE public.organizations OWNER TO postgres;

--
-- Name: service_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.service_categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone,
    deleted_at timestamp without time zone,
    label text NOT NULL,
    description text
);


ALTER TABLE public.service_categories OWNER TO postgres;

--
-- Name: services; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.services (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone,
    deleted_at timestamp without time zone,
    label text NOT NULL,
    address text NOT NULL,
    phone text,
    email text,
    category uuid NOT NULL,
    description text,
    organization_id uuid NOT NULL
);


ALTER TABLE public.services OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone,
    deleted_at timestamp without time zone,
    first_name text NOT NULL,
    last_name text NOT NULL,
    phone character varying(256),
    email text NOT NULL,
    organization_id uuid NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: __drizzle_migrations id; Type: DEFAULT; Schema: drizzle; Owner: postgres
--

ALTER TABLE ONLY drizzle.__drizzle_migrations ALTER COLUMN id SET DEFAULT nextval('drizzle.__drizzle_migrations_id_seq'::regclass);


--
-- Data for Name: __drizzle_migrations; Type: TABLE DATA; Schema: drizzle; Owner: postgres
--

COPY drizzle.__drizzle_migrations (id, hash, created_at) FROM stdin;
1       0238dc203f4aa3611d6978ef5a1a3241f4c36c807e21a789ccd0aa2a9a755d0b        1734449125893
2       3ac9d8a3d0bc8c85942743565dc6791f2b673034d5d9b6e1ef5dda690bbd426f        1734449543998
\.


--
-- Data for Name: clients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clients (id, created_at, updated_at, deleted_at, first_name, last_name, dob, phone, email) FROM stdin;
\.


--
-- Data for Name: clients_services; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clients_services (id, created_at, updated_at, deleted_at, client_id, service_id, description) FROM stdin;
\.


--
-- Data for Name: organizations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.organizations (id, created_at, updated_at, deleted_at, label, email) FROM stdin;
c257c016-176d-4769-a1b7-ec8ce8b8ba76    2025-01-31 14:29:57.625899      \N      \N      pinche-org      pinchedevelopper@gmail.com
\.


--
-- Data for Name: service_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.service_categories (id, created_at, updated_at, deleted_at, label, description) FROM stdin;
8a7412c5-5a6b-4d29-8758-0034ad3f46c5    2025-01-31 14:29:57.626434      \N      \N      Supportive Housing      Housing with staff to assist clients.
325961ab-7b00-46f3-b2af-c56e6898417b    2025-01-31 14:29:57.626434      \N      \N      Community Health Centre Primary health care.
\.


--
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.services (id, created_at, updated_at, deleted_at, label, address, phone, email, category, description, organization_id) FROM stdin;
3a0f50e0-deab-4a2d-b26f-b8c82ddf5cfe    2025-01-31 14:29:57.626893      \N      \N      pinche-service  123 address     \N      \N      8a7412c5-5a6b-4d29-8758-0034ad3f46c5    \N      c257c016-176d-4769-a1b7-ec8ce8b8ba76
a8720513-2ded-4ef2-a30f-f67910f7067f    2025-01-31 14:29:57.626893      \N      \N      pinche-service  123 address     \N      \N      325961ab-7b00-46f3-b2af-c56e6898417b    \N      c257c016-176d-4769-a1b7-ec8ce8b8ba76
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, created_at, updated_at, deleted_at, first_name, last_name, phone, email, organization_id) FROM stdin;
f73c0c63-8a54-4c63-8036-509b0b92b8fa    2025-01-31 14:49:49.483165      \N      \N      pinche  dev     \N      pinchedevelopper@gmail.com      c257c016-176d-4769-a1b7-ec8ce8b8ba76
\.


--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE SET; Schema: drizzle; Owner: postgres
--

SELECT pg_catalog.setval('drizzle.__drizzle_migrations_id_seq', 2, true);


--
-- Name: __drizzle_migrations __drizzle_migrations_pkey; Type: CONSTRAINT; Schema: drizzle; Owner: postgres
--

ALTER TABLE ONLY drizzle.__drizzle_migrations
    ADD CONSTRAINT __drizzle_migrations_pkey PRIMARY KEY (id);


--
-- Name: clients_services clients_services_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients_services
    ADD CONSTRAINT clients_services_pkey PRIMARY KEY (id);


--
-- Name: clients organizations_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT organizations_id_unique PRIMARY KEY (id);


--
-- Name: organizations organizations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organizations_pkey PRIMARY KEY (id);


--
-- Name: service_categories service_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_categories
    ADD CONSTRAINT service_categories_pkey PRIMARY KEY (id);


--
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: clients_services clients_services_client_id_clients_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients_services
    ADD CONSTRAINT clients_services_client_id_clients_id_fk FOREIGN KEY (client_id) REFERENCES public.clients(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: clients_services clients_services_service_id_services_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients_services
    ADD CONSTRAINT clients_services_service_id_services_id_fk FOREIGN KEY (service_id) REFERENCES public.services(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: services services_organization_id_organizations_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_organization_id_organizations_id_fk FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: users users_organization_id_organizations_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_organization_id_organizations_id_fk FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- PostgreSQL database dump complete
--
