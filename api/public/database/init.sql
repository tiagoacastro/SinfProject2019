DROP TABLE IF EXISTS private_data;
DROP TABLE IF EXISTS logs;
DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS master_data;
DROP TABLE IF EXISTS processes_events;
DROP TABLE IF EXISTS processes;
DROP TABLE IF EXISTS events;
DROP TYPE IF EXISTS categories;
DROP TYPE IF EXISTS documents;
DROP TYPE IF EXISTS method;

CREATE TABLE companies (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL UNIQUE,
  c_key         TEXT NOT NULL UNIQUE,
  client_id     TEXT NOT NULL UNIQUE,
  secret_id     TEXT NOT NULL UNIQUE,
  tenant        TEXT NOT NULL UNIQUE,
  organization  TEXT NOT NULL UNIQUE
);

CREATE TABLE private_data (
  id            SERIAL PRIMARY KEY,
  id_company    INTEGER REFERENCES companies (id) ON UPDATE CASCADE,
  document_1    TEXT NOT NULL UNIQUE,
  document_2    TEXT NOT NULL UNIQUE
);

CREATE TYPE categories AS ENUM('Product', 'Document', 'Customer_Entity', 'Supplier_Entity');
CREATE TYPE documents AS ENUM('Sales Order', 'Purchase Order', 'Delivery Order', 'Goods Receipt', 'Sales Invoice', 'Purchase Invoice', 'Payment', 'Payment Receipt');
CREATE TYPE method AS ENUM('Manual', 'Automatic');

CREATE TABLE master_data (
  id            SERIAL PRIMARY KEY,
  reference_1   TEXT NOT NULL,
  reference_2   TEXT NOT NULL,
  category      categories NOT NULL
);

CREATE TABLE processes (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL UNIQUE,
  active        BOOLEAN DEFAULT TRUE
);

CREATE TABLE events (
  id            SERIAL PRIMARY KEY,
  document      documents NOT NULL,
  method        method NOT NULL
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
  document      TEXT NOT NULL,
  success       BOOLEAN NOT NULL,
  message       TEXT
);