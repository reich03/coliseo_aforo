-- Datos iniciales para desarrollo (H2)
-- MERGE es idempotente: inserta si no existe, ignora si ya existe
MERGE INTO usuarios (id, username, email, active)
    KEY (username)
    VALUES ('00000000-0000-0000-0000-000000000001', 'admin', 'admin@coliseo.co', true);

MERGE INTO usuarios (id, username, email, active)
    KEY (username)
    VALUES ('00000000-0000-0000-0000-000000000002', 'operador', 'operador@coliseo.co', true);
