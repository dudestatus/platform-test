-- Add this table to the db of your choice, then run the program with the following environment variables defined.

-- PLATFORM_TEST_DB_USER
-- PLATFORM_TEST_DB_HOST
-- PLATFORM_TEST_DB
-- PLATFORM_TEST_DB_PASS
-- PLATFORM_TEST_DB_PORT

-- see userRepositoryPostgreSQL.js for defaults

-- Table Definition ----------------------------------------------

CREATE TABLE users (
    id integer DEFAULT nextval('user_id_seq'::regclass) PRIMARY KEY,
    first_name text NOT NULL,
    last_name text NOT NULL DEFAULT '""'::text,
    email text NOT NULL UNIQUE,
    password text NOT NULL,
    salt text NOT NULL,
    logout_time integer
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX user_pkey ON users(id int4_ops);
CREATE UNIQUE INDEX user_email_key ON users(email text_ops);
