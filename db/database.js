const Database = require("better-sqlite3");
const path = require('path');

const dbPath = path.join(__dirname, "booklibrary.db");
const db = new Database(dbPath);
db.pragma('foreign_keys = ON');

// create the database if it does not exist
db.exec(`
    CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        author TEXT NOT NULL,
        description TEXT,
        genre TEXT,
        image TEXT DEFAULT NULL,
    );
    CREATE TABLE IF NOT EXISTS shelves (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        shelf_name TEXT NOT NULL,
        location TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS shelves_with_books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        book_id INTEGER NOT NULL,
        shelf_id INTEGER NOT NULL,
        FOREIGN KEY (book_id) REFERENCES books(id),
        FOREIGN KEY (shelf_id) REFERENCES shelves(id)

    );
`);

module.exports = db;