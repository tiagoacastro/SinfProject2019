DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS master_data;
DROP TABLE IF EXISTS processes;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS processes_events;

CREATE TABLE companies (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL UNIQUE,
  client_id     TEXT NOT NULL UNIQUE,
  secret_id     TEXT NOT NULL UNIQUE,
  tenant        TEXT NOT NULL UNIQUE,
  organization  TEXT NOT NULL UNIQUE
);

CREATE TABLE master_data (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL UNIQUE,
  reference_1   TEXT NOT NULL UNIQUE,
  reference_2   TEXT NOT NULL UNIQUE
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
  order         INTEGER NOT NULL,
  PRIMARY KEY (id_process, id_event)
);