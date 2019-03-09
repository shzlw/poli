
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS transaction_log;

CREATE TABLE
IF NOT EXISTS user (
    id INTEGER NOT NULL PRIMARY KEY,
    name TEXT
);

CREATE TABLE
IF NOT EXISTS transaction_log (
    id INTEGER NOT NULL PRIMARY KEY,
    order_id TEXT,
    qty INTEGER,
    product TEXT,
    buyer TEXT
);

INSERT INTO user(name) VALUES('user1');
INSERT INTO user(name) VALUES('user2');
INSERT INTO user(name) VALUES('user3');
INSERT INTO user(name) VALUES('user4');
INSERT INTO user(name) VALUES('user5');
INSERT INTO user(name) VALUES('user6');
INSERT INTO user(name) VALUES('user7');
INSERT INTO user(name) VALUES('user8');
INSERT INTO user(name) VALUES('user9');
INSERT INTO user(name) VALUES('user10');

INSERT INTO transaction_log(order_id, qty, product, buyer) VALUES('order1', 1, 'product1', 'user1');
INSERT INTO transaction_log(order_id, qty, product, buyer) VALUES('order2', 2, 'product2', 'user2');
INSERT INTO transaction_log(order_id, qty, product, buyer) VALUES('order3', 3, 'product3', 'user3');
INSERT INTO transaction_log(order_id, qty, product, buyer) VALUES('order4', 4, 'product4', 'user4');
INSERT INTO transaction_log(order_id, qty, product, buyer) VALUES('order5', 5, 'product5', 'user5');
INSERT INTO transaction_log(order_id, qty, product, buyer) VALUES('order6', 6, 'product6', 'user6');
INSERT INTO transaction_log(order_id, qty, product, buyer) VALUES('order7', 7, 'product7', 'user7');
INSERT INTO transaction_log(order_id, qty, product, buyer) VALUES('order8', 8, 'product8', 'user8');
INSERT INTO transaction_log(order_id, qty, product, buyer) VALUES('order9', 9, 'product9', 'user9');
INSERT INTO transaction_log(order_id, qty, product, buyer) VALUES('order10', 10, 'product10', 'user10');