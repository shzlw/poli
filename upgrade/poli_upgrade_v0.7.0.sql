CREATE TABLE
IF NOT EXISTS p_canned_report (
    id INTEGER NOT NULL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    created_at INTEGER NOT NULL,
    name TEXT NOT NULL,
    data TEXT,
    FOREIGN KEY (user_id) REFERENCES p_user(id)
);