ALTER TABLE p_report ADD project TEXT;

CREATE TABLE
IF NOT EXISTS p_user_favourite (
    user_id INTEGER NOT NULL,
    report_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, report_id),
    FOREIGN KEY (user_id) REFERENCES p_user(id),
    FOREIGN KEY (report_id) REFERENCES p_report(id)
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