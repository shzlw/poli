CREATE TABLE
IF NOT EXISTS p_user_attribute (
    user_id INTEGER NOT NULL,
    attr_key TEXT NOT NULL,
    attr_value TEXT,
    FOREIGN KEY (user_id) REFERENCES p_user(id)
);