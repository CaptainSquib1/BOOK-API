const express = require('express');
const router = express.Router();
const db = require('../db/database');

function getFeaturesForLocation(bookId) {
    return db.prepare(`
        SELECT sh.id, sh.description
        FROM shelves sh
                 JOIN shelves_with_books swb ON sh.id = swb.shelf_id
        WHERE swb.book_id = ?
        ORDER BY  sh.description
    `).all(bookId);
}

// GET all locations
router.get('/', (req, res) => {
    try {
        const books = db.prepare(`
            SELECT id, name, author, description, genre, timeofaddition
            FROM books
            ORDER BY name
        `).all();

        const locationsWithFeatures = books.map((book) => ({
            ...book,
            features: getFeaturesForLocation(book.id)
        }));
        res.json(locationsWithFeatures);
    } catch(error) {
        res.status(500).json({error: 'Failed to fetch locations'});
    }
});

// GET one location by id
router.get('/:id', (req, res) =>{
    try {
        const book = db
            .prepare('SELECT * FROM books WHERE id = ?')
            .get(req.params.id);
        if (!book) {
            return res.status(404).json({error: 'Book not found'});
        }
        res.json(book);
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


// POST create a new location (with optional features)
router.post('/', (req, res) => {
    const { name, address, description, hours, features } = req.body;

    if (!name || !address) {
        return res.status(400).json({ error: 'Name and address are required' });
    }

    try {
        // Insert the location
        const result = db.prepare(`
            INSERT INTO books (name, address, description, hours)
            VALUES (?, ?, ?, ?)
        `).run(name, address, description || null, hours || null);

        const bookId = result.lastInsertRowid;

        // Insert features into join table (if provided)
        if (Array.isArray(features)) {
            const insertFeature = db.prepare(`
                INSERT INTO locations_with_features (location_id, feature_id)
                VALUES (?, ?)
            `);

            for (const featureId of features) {
                insertFeature.run(bookId, featureId);
            }
        }

        // Return the created location with features
        const newBook = {
            id: bookId,
            name,
            address,
            description: description || null,
            hours: hours || null,
            features: Array.isArray(features) ? features : []
        };

        res.status(201).json(newBook);

    } catch (error) {
        res.status(500).json({ error: 'Failed to create book' });
    }
});

module.exports = router;