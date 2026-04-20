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

module.exports = router;