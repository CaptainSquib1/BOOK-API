const express = require('express');
const router = express.Router();
const db = require('../db/database');

function getBooksforShelves(shelfId) {
    return db.prepare(`
        SELECT b.id, b.name, b.author, b.description, b.genre, b.timeofaddition
        FROM books b
                 JOIN shelves_with_books swb ON b.id = swb.book_id
        WHERE swb.shelf_id = ?
        ORDER BY b.name
    `).all(shelfId);
}

// GET all shelves
router.get('/', (req, res) => {
    try {
        const shelves = db.prepare(`
            SELECT id, shelf_name
            FROM shelves
            ORDER BY shelf_name
        `).all();

        const shelveswithbooks = shelves.map((shelf) => ({
            ...shelf,
            books: getBooksforShelves(shelf.id)
        }));
        res.json(shelveswithbooks);
    } catch(error) {
        res.status(500).json({error: 'Failed to fetch shelves'});
    }
});

// GET one shelf by id
router.get('/:id', (req, res) =>{
    try {
        const shelf = db
            .prepare('SELECT * FROM shelves WHERE id = ?')
            .get(req.params.id);
        if (!shelf) {
            return res.status(404).json({error: 'Shelf not found'});
        }
        res.json(shelf);
    }catch(error) {
        res.status(500).json({error: 'Failed to fetch the book'});
    }
});

/*
POST /locations
Content-Type: application/json

{
  "name": "Campus Cafe",
  "address": "123 College Ave",
  "description": "Student hangout",
  "hours": "Mon-Fri 8am-6pm",
  "features": [1, 2]
}
 */

router.post('/', (req, res) => {
    const { shelfId } = req.body
    const { bookId } = req.body;
    console.log('shelfId:', shelfId, 'bookId:', bookId)

    if (!bookId) {
        return res.status(400).json({ error: 'bookId is required' });
    }

    try {

        const shelf = db.prepare('SELECT id FROM shelves WHERE id = ?').get(shelfId);
        if (!shelf) {
            return res.status(404).json({ error: 'Shelf not found' });
        }

        const book = db.prepare('SELECT id FROM books WHERE id = ?').get(bookId);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        //check all shelves for book placement
        // same shelf
        const existing = db.prepare(`
            SELECT id FROM shelves_with_books 
            WHERE shelf_id = ? AND book_id = ?
        `).get(shelfId, bookId);

        if (existing) {
            return res.status(405).json({ error: 'Book is already on this shelf' });
        }

        //other shelf
        const othershelf = db.prepare(`
            SELECT id FROM shelves_with_books
            WHERE book_id = ?
            `)
        if (othershelf) {
            return res.status(405).json({ error: 'Book is already on a shelf' });
        }

        // Add the book to the shelf
        db.prepare(`
            INSERT INTO shelves_with_books (shelf_id, book_id) 
            VALUES (?, ?)
        `).run(shelfId, bookId);

        res.status(201).json({ message: 'Book added to shelf', shelfId, bookId });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add book to shelf' });
    }
});

module.exports = router;