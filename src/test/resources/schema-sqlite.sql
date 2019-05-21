
DROP TABLE IF EXISTS p_group_dashboard;
DROP TABLE IF EXISTS p_widget;
DROP TABLE IF EXISTS p_dashboard;
DROP TABLE IF EXISTS p_datasource;
DROP TABLE IF EXISTS p_group_user;
DROP TABLE IF EXISTS p_user;
DROP TABLE IF EXISTS p_group;

CREATE TABLE
IF NOT EXISTS p_datasource (
    id INTEGER NOT NULL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    username TEXT,
    password TEXT,
    connection_url TEXT,
    driver_class_name TEXT,
    ping TEXT
);

CREATE TABLE
IF NOT EXISTS p_dashboard (
    id INTEGER NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    style TEXT
);

CREATE TABLE
IF NOT EXISTS p_widget (
    id INTEGER NOT NULL PRIMARY KEY,
    dashboard_id INTEGER NOT NULL,
    datasource_id INTEGER,
    title TEXT,
    x INTEGER NOT NULL,
    y INTEGER NOT NULL,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    type TEXT NOT NULL,
    sub_type TEXT,
    sql_query TEXT,
    data TEXT,
    drill_through TEXT,
    style TEXT,
    FOREIGN KEY (dashboard_id) REFERENCES p_dashboard(id),
    FOREIGN KEY (datasource_id) REFERENCES p_datasource(id)
);

CREATE TABLE
IF NOT EXISTS p_user (
    id INTEGER NOT NULL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    name TEXT,
    password TEXT,
    temp_password TEXT,
    session_key TEXT,
    session_timeout INTEGER,
    api_key TEXT,
    sys_role TEXT NOT NULL
);

CREATE TABLE
IF NOT EXISTS p_group (
    id INTEGER NOT NULL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE
IF NOT EXISTS p_group_user (
    user_id INTEGER NOT NULL,
    group_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, group_id),
    FOREIGN KEY (user_id) REFERENCES p_user(id),
    FOREIGN KEY (group_id) REFERENCES p_group(id)
);

CREATE TABLE
IF NOT EXISTS p_group_dashboard (
    dashboard_id INTEGER NOT NULL,
    group_id INTEGER NOT NULL,
    PRIMARY KEY (dashboard_id, group_id),
    FOREIGN KEY (dashboard_id) REFERENCES p_dashboard(id),
    FOREIGN KEY (group_id) REFERENCES p_group(id)
);

CREATE UNIQUE INDEX p_dashboard_unique_name_index ON p_dashboard(name);

-- In test, set admin password.
INSERT INTO p_user(username, password, sys_role)
VALUES('admin', 'f6fdffe48c908deb0f4c3bd36c032e72', 'admin');