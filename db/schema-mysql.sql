-- For PostgreSQL
DROP TABLE IF EXISTS p_audit_log;
DROP TABLE IF EXISTS p_saved_query;
DROP TABLE IF EXISTS p_shared_report;
DROP TABLE IF EXISTS p_user_favourite;
DROP TABLE IF EXISTS p_group_report;
DROP TABLE IF EXISTS p_component;
DROP TABLE IF EXISTS p_report;
DROP TABLE IF EXISTS p_datasource;
DROP TABLE IF EXISTS p_user_attribute;
DROP TABLE IF EXISTS p_canned_report;
DROP TABLE IF EXISTS p_group_user;
DROP TABLE IF EXISTS p_user;
DROP TABLE IF EXISTS p_group;
DROP TABLE IF EXISTS p_db_meta;

CREATE TABLE
IF NOT EXISTS p_datasource (
    id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(256) UNIQUE NOT NULL ,
    username VARCHAR(256),
    password VARCHAR(256),
    connection_url VARCHAR(256),
    driver_class_name VARCHAR(256),
    ping VARCHAR(256)
);

CREATE TABLE
IF NOT EXISTS p_report (
    id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(256) NOT NULL UNIQUE,
    style VARCHAR(256),
    project VARCHAR(256)
);

CREATE TABLE
IF NOT EXISTS p_component (
    id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    report_id BIGINT NOT NULL,
    datasource_id BIGINT,
    title VARCHAR(256),
    x BIGINT NOT NULL,
    y BIGINT NOT NULL,
    width BIGINT NOT NULL,
    height BIGINT NOT NULL,
    type VARCHAR(256) NOT NULL,
    sub_type VARCHAR(256),
    sql_query VARCHAR(256),
    data VARCHAR(256),
    drill_through VARCHAR(256),
    style VARCHAR(256),
    FOREIGN KEY (report_id) REFERENCES p_report(id)
);

CREATE TABLE
IF NOT EXISTS p_user (
    id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(256) NOT NULL UNIQUE,
    name VARCHAR(256),
    password VARCHAR(256),
    temp_password VARCHAR(256),
    session_key VARCHAR(256),
    session_timeout BIGINT,
    api_key VARCHAR(256),
    sys_role VARCHAR(256) NOT NULL
);

CREATE TABLE
IF NOT EXISTS p_group (
    id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(256) NOT NULL UNIQUE
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
    id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    created_at BIGINT NOT NULL,
    name VARCHAR(256) NOT NULL,
    data VARCHAR(256),
    FOREIGN KEY (user_id) REFERENCES p_user(id)
);

CREATE TABLE
IF NOT EXISTS p_user_attribute (
    user_id BIGINT NOT NULL,
    attr_key VARCHAR(256) NOT NULL,
    attr_value VARCHAR(256),
    FOREIGN KEY (user_id) REFERENCES p_user(id)
);

-- v0.10.0 new tables
CREATE TABLE
IF NOT EXISTS p_user_favourite (
    user_id BIGINT NOT NULL,
    report_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, report_id),
    FOREIGN KEY (user_id) REFERENCES p_user(id),
    FOREIGN KEY (report_id) REFERENCES p_report(id)
);

CREATE TABLE
IF NOT EXISTS p_shared_report (
    id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    share_key VARCHAR(256) NOT NULL,
    report_id BIGINT NOT NULL,
    report_type VARCHAR(256) NOT NULL,
    user_id BIGINT NOT NULL,
    created_at BIGINT NOT NULL,
    expired_by BIGINT NOT NULL,
    FOREIGN KEY (report_id) REFERENCES p_report(id),
    FOREIGN KEY (user_id) REFERENCES p_user(id)
);

CREATE TABLE
IF NOT EXISTS p_saved_query (
    id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    datasource_id INTEGER,
    name VARCHAR(256) NOT NULL UNIQUE,
    sql_query VARCHAR(256),
    endpoint_name VARCHAR(256) UNIQUE,
    endpoint_accesscode VARCHAR(256)
);

CREATE TABLE
IF NOT EXISTS p_audit_log (
    id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    created_at INTEGER NOT NULL,
    type VARCHAR(256) NOT NULL,
    data VARCHAR(256)
);

CREATE INDEX idx_audit_log_created_at ON p_audit_log (created_at);

CREATE TABLE
IF NOT EXISTS p_db_meta (
    database_name VARCHAR(256),
    database_type VARCHAR(256),
    table_name VARCHAR(256) ,
    table_anonymous VARCHAR(256),
    col_info VARCHAR(256),
    key_info VARCHAR(256)
);


INSERT INTO p_user(username, temp_password, sys_role)
VALUES('admin', 'f6fdffe48c908deb0f4c3bd36c032e72', 'admin');