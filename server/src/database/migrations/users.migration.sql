CREATE TABLE IF NOT EXISTS users (
    user_id     SERIAL        PRIMARY KEY,
    email       VARCHAR(255)  NOT NULL,
    password    VARCHAR(255)  NOT NULL,
    created_at  TIMESTAMP      DEFAULT NOW(),
    updated_at  TIMESTAMP      DEFAULT NOW()
);