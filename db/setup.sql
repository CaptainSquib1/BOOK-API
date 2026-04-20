-- create the table for locations
CREATE TABLE books (
                           id INTEGER PRIMARY KEY AUTOINCREMENT,
                           name TEXT NOT NULL,
                           author TEXT NOT NULL,
                           description TEXT,
                           genre TEXT,
                           timeofaddition TEXT,
                           image TEXT DEFAULT NULL
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

INSERT INTO books (name, author, description, genre, timeofaddition, image) VALUES ('Hobbit', 'JRR Tolkein', 'Very hobbitsy', 'Fiction', 'Idk', 'Newbook.png'),
                                                                 ('Sherlock Holmes', 'Sir Arthur Conan Doyle', 'Elementary', 'Mystery', 'Watson? What is the time?','');

INSERT INTO shelves (shelf_name,location) VALUES ('Brown', 'Upstairs'),
                                                   ('Black','1st Floor'),
                                                   ('Yellow','Downstairs'),
                                                   ('Striped','2nd Floor'),
                                                   ('Orange','Da Basement');

INSERT INTO shelves_with_books (book_id, shelf_id) VALUES (1,1);



DROP TABLE books;
DROP TABLE shelves;
DROP TABLE shelves_with_books;
