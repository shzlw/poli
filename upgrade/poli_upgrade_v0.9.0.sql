CREATE TABLE
IF NOT EXISTS p_user_attribute (
    user_id INTEGER NOT NULL,
    attr_key TEXT,
    attr_value TEXT,
    FOREIGN KEY (user_id) REFERENCES p_user(id)
);