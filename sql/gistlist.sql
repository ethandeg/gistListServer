DROP DATABASE IF EXISTS "gistlist";
CREATE DATABASE "gistlist";
\c "gistlist";

\i gistlist-schema.sql
\i gistlist-seed.sql