-- SQLite
CREATE TABLE
IF NOT EXISTS p_saved_query (
    id INTEGER NOT NULL PRIMARY KEY,
    datasource_id INTEGER,
    name TEXT NOT NULL UNIQUE,
    sql_query TEXT,
    endpoint_name TEXT UNIQUE,
    endpoint_accesscode TEXT
);

CREATE TABLE
IF NOT EXISTS p_audit_log (
    id INTEGER NOT NULL PRIMARY KEY,
    created_at INTEGER NOT NULL,
    type TEXT NOT NULL,
    data TEXT
);

CREATE INDEX idx_audit_log_created_at ON p_audit_log (created_at);
