DROP TABLE IF EXISTS private_data;
DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS master_data;
DROP TABLE IF EXISTS processes_events;
DROP TABLE IF EXISTS processes;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS logs;
DROP TYPE IF EXISTS categories;

CREATE TABLE companies (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL UNIQUE,
  client_id     TEXT NOT NULL UNIQUE,
  secret_id     TEXT NOT NULL UNIQUE,
  tenant        TEXT NOT NULL UNIQUE,
  organization  TEXT NOT NULL UNIQUE
);

CREATE TABLE private_data (
  id            SERIAL PRIMARY KEY,
  id_company    INTEGER REFERENCES companies (id) ON UPDATE CASCADE,
  document_1    TEXT NOT NULL UNIQUE,
  document_2    TEXT NOT NULL UNIQUE,
);

CREATE TYPE categories AS ENUM('Product', 'Document', 'Entity');

CREATE TABLE master_data (
  id            SERIAL PRIMARY KEY,
  reference_1   TEXT NOT NULL UNIQUE,
  reference_2   TEXT NOT NULL UNIQUE,
  category      categories NOT NULL
);

CREATE TABLE processes (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL UNIQUE
);

CREATE TABLE events (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL UNIQUE
);

CREATE TABLE processes_events (
  id_process    INTEGER REFERENCES processes (id) ON UPDATE CASCADE ON DELETE CASCADE,
  id_event      INTEGER REFERENCES events (id) ON UPDATE CASCADE ON DELETE SET NULL,
  position      INTEGER NOT NULL,
  PRIMARY KEY (id_process, id_event)
);

CREATE TABLE logs (
  id            SERIAL PRIMARY KEY,
  moment        TIMESTAMP NOT NULL,
  id_company    INTEGER NOT NULL REFERENCES companies (id) ON UPDATE CASCADE,
  document      TEXT,
  success       BOOLEAN NOT NULL
);