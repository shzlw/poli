-- For SQLite
DROP TABLE IF EXISTS p_shared_report;
DROP TABLE IF EXISTS p_user_favourite;
DROP TABLE IF EXISTS p_project_report;
DROP TABLE IF EXISTS p_project;
DROP TABLE IF EXISTS p_group_report;
DROP TABLE IF EXISTS p_component;
DROP TABLE IF EXISTS p_report;
DROP TABLE IF EXISTS p_datasource;
DROP TABLE IF EXISTS p_user_attribute;
DROP TABLE IF EXISTS p_canned_report;
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
IF NOT EXISTS p_report (
    id INTEGER NOT NULL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    style TEXT
);

CREATE TABLE
IF NOT EXISTS p_component (
    id INTEGER NOT NULL PRIMARY KEY,
    report_id INTEGER NOT NULL,
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
    FOREIGN KEY (report_id) REFERENCES p_report(id)
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
IF NOT EXISTS p_group_report (
    report_id INTEGER NOT NULL,
    group_id INTEGER NOT NULL,
    PRIMARY KEY (report_id, group_id),
    FOREIGN KEY (report_id) REFERENCES p_report(id),
    FOREIGN KEY (group_id) REFERENCES p_group(id)
);

CREATE TABLE
IF NOT EXISTS p_canned_report (
    id INTEGER NOT NULL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    created_at INTEGER NOT NULL,
    name TEXT NOT NULL,
    data TEXT,
    FOREIGN KEY (user_id) REFERENCES p_user(id)
);

CREATE TABLE
IF NOT EXISTS p_user_attribute (
    user_id INTEGER NOT NULL,
    attr_key TEXT NOT NULL,
    attr_value TEXT,
    FOREIGN KEY (user_id) REFERENCES p_user(id)
);

-- v0.10.0 new tables
CREATE TABLE
IF NOT EXISTS p_project (
    id INTEGER NOT NULL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE
IF NOT EXISTS p_project_report (
    project_id INTEGER NOT NULL,
    report_id INTEGER NOT NULL,
    PRIMARY KEY (project_id, report_id),
    FOREIGN KEY (project_id) REFERENCES p_project(id),
    FOREIGN KEY (report_id) REFERENCES p_report(id)
);

CREATE TABLE
IF NOT EXISTS p_group_project (
    project_id INTEGER NOT NULL,
    group_id INTEGER NOT NULL,
    PRIMARY KEY (project_id, group_id),
    FOREIGN KEY (project_id) REFERENCES p_project(id),
    FOREIGN KEY (group_id) REFERENCES p_group(id)
);

CREATE TABLE
IF NOT EXISTS p_user_favourite (
    user_id INTEGER NOT NULL,
    report_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES p_user(id)
);

CREATE TABLE
IF NOT EXISTS p_shared_report (
    id INTEGER NOT NULL PRIMARY KEY,
    share_key VARCHAR NOT NULL,
    report_id INTEGER NOT NULL,
    report_type VARCHAR NOT NULL,
    user_id INTEGER NOT NULL,
    created_at INTEGER NOT NULL,
    expired_by INTEGER NOT NULL,
    FOREIGN KEY (report_id) REFERENCES p_report(id),
    FOREIGN KEY (user_id) REFERENCES p_user(id)
);

INSERT INTO p_user(username, temp_password, sys_role)
VALUES('admin', 'f6fdffe48c908deb0f4c3bd36c032e72', 'admin');