-- ---------- LIMPEZA INICIAL ----------
-- Remove tipos ENUM existentes
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS booking_status CASCADE;

-- ---------- TIPOS ENUM ----------
-- Funções do usuário no sistema
CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin');

-- Situação de uma reserva de sala
CREATE TYPE booking_status AS ENUM ('reserved', 'approved', 'rejected', 'cancelled', 'completed', 'released');

-- ---------- TABELAS ----------
-- Usuários do sistema
CREATE TABLE IF NOT EXISTS users (
    user_id              SERIAL PRIMARY KEY,              -- Chave primária
    name                 VARCHAR(100)     NOT NULL,       -- Nome completo
    email                VARCHAR(100)     NOT NULL UNIQUE,-- E‑mail único
    password             VARCHAR(255)     NOT NULL,       -- Hash da senha
    registration_number  VARCHAR(20),                     -- Matrícula (opcional)
    role                 VARCHAR(20)      NOT NULL DEFAULT 'student', -- Papel
    created_at           TIMESTAMP        NOT NULL DEFAULT NOW(),     -- Data de criação
    updated_at           TIMESTAMP        NOT NULL DEFAULT NOW()      -- Última atualização
);

-- Tipos de sala (auditório, laboratório, etc.)
CREATE TABLE IF NOT EXISTS room_types (
    room_type_id  SERIAL PRIMARY KEY,
    type_name     VARCHAR(50)  NOT NULL UNIQUE,           -- Nome do tipo
    description   TEXT,                                   -- Descrição opcional
    created_at    TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- Salas individuais
CREATE TABLE IF NOT EXISTS rooms (
    room_id       SERIAL PRIMARY KEY,
    room_type_id  INT          NOT NULL REFERENCES room_types(room_type_id), -- FK para room_types
    name          VARCHAR(50)  NOT NULL UNIQUE,          -- Identificação da sala
    capacity      INT          NOT NULL CHECK (capacity > 0), -- Capacidade máxima
    location      VARCHAR(100),                          -- Localização física
    description   TEXT,
    is_active     BOOLEAN      NOT NULL DEFAULT TRUE,    -- Sala disponível?
    created_at    TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- Reservas de salas
CREATE TABLE IF NOT EXISTS bookings (
    booking_id   SERIAL PRIMARY KEY,
    user_id      INT           NOT NULL REFERENCES users(user_id),   -- Quem reservou
    room_id      INT           NOT NULL REFERENCES rooms(room_id),   -- Sala reservada
    start_time   TIMESTAMP     NOT NULL,                             -- Início
    end_time     TIMESTAMP     NOT NULL,                             -- Fim
    status       VARCHAR(20)   NOT NULL DEFAULT 'reserved',         -- Status
    reason       TEXT,                                               -- Motivo da reserva
    created_at   TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMP     NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_end_after_start CHECK (end_time > start_time)     -- Garantia de horário
);

-- Notificações relacionadas a reservas
CREATE TABLE IF NOT EXISTS notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id         INT        NOT NULL REFERENCES users(user_id),   -- Destinatário
    booking_id      INT                 REFERENCES bookings(booking_id), -- Reserva (opcional)
    message         TEXT       NOT NULL,                             -- Conteúdo
    is_read         BOOLEAN    NOT NULL DEFAULT FALSE,               -- Já foi lida?
    created_at      TIMESTAMP  NOT NULL DEFAULT NOW()
);

-- Tabela para armazenar as sessões
CREATE TABLE IF NOT EXISTS "sessions" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL,
  CONSTRAINT "sessions_pkey" PRIMARY KEY ("sid")
);

CREATE INDEX IF NOT EXISTS "IDX_sessions_expire" ON "sessions" ("expire");

-- ---------- ÍNDICES AUXILIARES ----------
CREATE INDEX idx_rooms_room_type_id       ON rooms(room_type_id);
CREATE INDEX idx_bookings_user_id         ON bookings(user_id);
CREATE INDEX idx_bookings_room_id         ON bookings(room_id);
CREATE INDEX idx_notifications_user_id    ON notifications(user_id);
CREATE INDEX idx_notifications_booking_id ON notifications(booking_id);

-- Criar tipos de sala
INSERT INTO room_types (type_name) VALUES
('telefonica'),
('estudos')
ON CONFLICT (type_name) DO NOTHING;

-- Criar salas
INSERT INTO rooms (room_type_id, name, capacity, location, description, is_active) VALUES
-- Salas telefônicas (2º andar)
((SELECT room_type_id FROM room_types WHERE type_name = 'telefonica'), 'Telefonica 1', 1, '2º andar', 'Sala telefônica individual', true),
((SELECT room_type_id FROM room_types WHERE type_name = 'telefonica'), 'Telefonica 2', 1, '2º andar', 'Sala telefônica individual', true),

-- Salas de estudos (térreo)
((SELECT room_type_id FROM room_types WHERE type_name = 'estudos'), 'Estudos 1', 6, 'Térreo', 'Sala de estudos em grupo', true),
((SELECT room_type_id FROM room_types WHERE type_name = 'estudos'), 'Estudos 2', 6, 'Térreo', 'Sala de estudos em grupo', true),
((SELECT room_type_id FROM room_types WHERE type_name = 'estudos'), 'Estudos 3', 6, 'Térreo', 'Sala de estudos em grupo', true),
((SELECT room_type_id FROM room_types WHERE type_name = 'estudos'), 'Estudos 4', 6, 'Térreo', 'Sala de estudos em grupo', true),
((SELECT room_type_id FROM room_types WHERE type_name = 'estudos'), 'Estudos 5', 6, 'Térreo', 'Sala de estudos em grupo', true),
((SELECT room_type_id FROM room_types WHERE type_name = 'estudos'), 'Estudos 6', 6, 'Térreo', 'Sala de estudos em grupo', true),
((SELECT room_type_id FROM room_types WHERE type_name = 'estudos'), 'Estudos 7', 6, 'Térreo', 'Sala de estudos em grupo', true),

-- Sala de estudos (1º andar)
((SELECT room_type_id FROM room_types WHERE type_name = 'estudos'), 'Estudos Individual', 2, '1º andar', 'Sala de estudos individual', true)
ON CONFLICT (name) DO NOTHING;