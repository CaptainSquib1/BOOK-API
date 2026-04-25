const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET all books
router.get('/', (req, res) => {
    try {
        const books = db.prepare(`
            SELECT id, name, author, description, genre, timeofaddition, image
            FROM books
            ORDER BY name
        `).all();

        res.json(books);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch books' });
    }
});

// GET one book by id
router.get('/:id', (req, res) => {
    try {
        const book = db
            .prepare('SELECT * FROM books WHERE id = ?')
            .get(req.params.id);

        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        res.json(book);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch the book' });
    }
});

router.post('/', (req, res) => {
    const {bookName, author, description, genre, image } = req.body;
    console.log('bookName:', bookName, 'author:', author, 'description:', description, 'genre:', genre, 'image:', image);

    if (!bookName) {
        return res.status(400).json({ error: 'bookName is required' });
    }
    if (!author) {
        return res.status(400).json({ error: 'author is required' });
    }

    try {

        const existing = db.prepare(`
            SELECT name FROM books WHERE name = ?
        `).get(bookName);

        if (existing) {
            return res.status(409).json({ error: 'Book already in database' });
        }

        // Add the book to the shelf
        db.prepare(`
            INSERT INTO books (name, author, description, genre, timeofaddition, image) 
            VALUES (?, ?, ?, ?, current_date, ?)
        `).run(bookName, author, description, genre, image);

        res.status(201).json({ message: 'Book added to shelf', bookName, author });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add book to shelf' });
    }
});

module.exports = router;