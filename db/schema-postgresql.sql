-- v0.9.1 for PostgreSQL
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
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR NOT NULL UNIQUE,
    username VARCHAR,
    password VARCHAR,
    connection_url VARCHAR,
    driver_class_name VARCHAR,
    ping VARCHAR
);

CREATE TABLE
IF NOT EXISTS p_report (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR NOT NULL,
    style VARCHAR
);

CREATE TABLE
IF NOT EXISTS p_component (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    report_id BIGINT NOT NULL,
    datasource_id BIGINT,
    title VARCHAR,
    x BIGINT NOT NULL,
    y BIGINT NOT NULL,
    width BIGINT NOT NULL,
    height BIGINT NOT NULL,
    type VARCHAR NOT NULL,
    sub_type VARCHAR,
    sql_query VARCHAR,
    data VARCHAR,
    drill_through VARCHAR,
    style VARCHAR,
    FOREIGN KEY (report_id) REFERENCES p_report(id)
);

CREATE TABLE 
IF NOT EXISTS p_user (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR NOT NULL UNIQUE,
    name VARCHAR,
    password VARCHAR,
    temp_password VARCHAR,
    session_key VARCHAR,
    session_timeout BIGINT, 
    api_key VARCHAR,
    sys_role VARCHAR NOT NULL
);

CREATE TABLE 
IF NOT EXISTS p_group (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR NOT NULL UNIQUE
); 

CREATE TABLE 
IF NOT EXISTS p_group_user (
    user_id BIGINT NOT NULL,
    group_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, group_id),
    FOREIGN KEY (user_id) REFERENCES p_user(id),
    FOREIGN KEY (group_id) REFERENCES p_group(id)
); 

CREATE TABLE 
IF NOT EXISTS p_group_report (
    report_id BIGINT NOT NULL,
    group_id BIGINT NOT NULL,
    PRIMARY KEY (report_id, group_id),
    FOREIGN KEY (report_id) REFERENCES p_report(id),
    FOREIGN KEY (group_id) REFERENCES p_group(id)
);

CREATE TABLE
IF NOT EXISTS p_canned_report (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL,
    created_at BIGINT NOT NULL,
    name VARCHAR NOT NULL,
    data VARCHAR,
    FOREIGN KEY (user_id) REFERENCES p_user(id)
);

CREATE TABLE
IF NOT EXISTS p_user_attribute (
    user_id INTEGER NOT NULL,
    attr_key VARCHAR NOT NULL,
    attr_value VARCHAR,
    FOREIGN KEY (user_id) REFERENCES p_user(id)
);

CREATE UNIQUE INDEX p_report_unique_name_index ON p_report(name);

INSERT INTO p_user(username, temp_password, sys_role)
VALUES('admin', 'f6fdffe48c908deb0f4c3bd36c032e72', 'admin');