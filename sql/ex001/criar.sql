CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    email TEXT
);

INSERT INTO users (nome, email) VALUES
("Henry", "henry@gmail.com"),
("Isis", "isis@gmail.com");

SELECT * FROM users;