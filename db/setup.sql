-- create the table for locations
CREATE TABLE books (
                           id INTEGER PRIMARY KEY AUTOINCREMENT,
                           name TEXT NOT NULL,
                           author TEXT NOT NULL,
                           description TEXT,
                           genre TEXT
);
-- create location features
CREATE TABLE shelves (
                                   id INTEGER PRIMARY KEY AUTOINCREMENT,
                                   shelf_name TEXT NOT NULL,
                                   location TEXT NOT NULL
);
-- create joining table

CREATE TABLE shelves_with_books (
                                         id INTEGER PRIMARY KEY AUTOINCREMENT,
                                         book_id INTEGER NOT NULL,
                                         shelf_id INTEGER NOT NULL,
                                         FOREIGN KEY (book_id) REFERENCES books(id),
                                         FOREIGN KEY (shelf_id) REFERENCES shelves_with_books(id)

);

INSERT INTO books (name, author, description, genre) VALUES ('Downtown', '123 Main St.', 'Very good!', '9-2'),
                                                                 ('Uptown', '456 North St.', 'Very bad :(', '2-9');

INSERT INTO shelves (shelf_name,location) VALUES ('Very good!', 'weow'),
                                                   ('Access to the playground','weow'),
                                                   ('Safe','weow'),
                                                   ('Dog friendly','weow'),
                                                   ('24/7','weow');

INSERT INTO shelves_with_books (book_id, shelf_id) VALUES (1,1),
                                                                     (1,2),
                                                                     (2,1),
                                                                     (2,4),
                                                                     (2,5)