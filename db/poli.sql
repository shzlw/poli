
DROP TABLE IF EXISTS p_datasource;

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
IF NOT EXISTS p_board (
    id INTEGER NOT NULL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    width INTEGER,
    height INTEGER
);

CREATE TABLE
IF NOT EXISTS p_filter (
    id INTEGER NOT NULL PRIMARY KEY,
    board_id INTEGER NOT NULL,
    data TEXT NOT NULL,
    FOREIGN KEY (board_id) REFERENCES p_board(id)
);

