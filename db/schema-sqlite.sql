
DROP TABLE IF EXISTS p_widget;
DROP TABLE IF EXISTS p_datasource;
DROP TABLE IF EXISTS p_filter;
DROP TABLE IF EXISTS p_dashboard;

CREATE TABLE
IF NOT EXISTS p_datasource (
    id INTEGER NOT NULL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    username TEXT,
    password TEXT,
    connection_url TEXT,
    type TEXT,
    ping TEXT
);

CREATE TABLE
IF NOT EXISTS p_dashboard (
    id INTEGER NOT NULL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    width INTEGER,
    height INTEGER
);

CREATE TABLE
IF NOT EXISTS p_filter (
    id INTEGER NOT NULL PRIMARY KEY,
    dashboard_id INTEGER NOT NULL,
    data TEXT NOT NULL,
    FOREIGN KEY (dashboard_id) REFERENCES p_dashboard(id)
);

CREATE TABLE
IF NOT EXISTS p_widget (
    id INTEGER NOT NULL PRIMARY KEY,
    dashboard_id INTEGER NOT NULL,
    datasource_id INTEGER NOT NULL,
    data TEXT NOT NULL,
    FOREIGN KEY (dashboard_id) REFERENCES p_dashboard(id),
    FOREIGN KEY (datasource_id) REFERENCES p_datasource(id)
);

