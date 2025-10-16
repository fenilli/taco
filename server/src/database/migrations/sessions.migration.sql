CREATE TABLE IF NOT EXISTS sessions (
    session_id   SERIAL        PRIMARY KEY,
    user_id      INTEGER       NOT NULL
        REFERENCES users(user_id)
        ON DELETE CASCADE,
    user_agent   VARCHAR(255)  NOT NULL,
    created_at   TIMESTAMP      DEFAULT NOW(),
    expires_at   TIMESTAMP      NOT NULL
);