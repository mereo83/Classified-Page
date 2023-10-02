const express = require('express');
const router = express.Router();
const db = require('../data/db');

// Create a new listing
router.post('/create', (req, res) => {
  const { title, description, category, price, location, contactInfo } = req.body;
  const userId = req.user.id; // Get the user ID from the authenticated user

  // SQL query to insert a new listing into the database
  const insertQuery = 'INSERT INTO listings (title, description, category, price, location, contact_info, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
  
  // Execute the query with the provided listing details and the user ID
  db.query(insertQuery, [title, description, category, price, location, contactInfo, userId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.status(201).json({ message: 'Listing created successfully' });
    }
  });
});

// Fetch a single listing by ID
router.get('/:listingId', (req, res) => {
  const listingId = req.params.listingId; // Get the listing ID from the URL

  // SQL query to retrieve a single listing by its ID
  const selectQuery = 'SELECT * FROM listings WHERE id = ?';
  
  // Execute the query with the listing ID
  db.query(selectQuery, [listingId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const rows = results[0];

    if (rows.length === 0) {
      res.status(404).json({ error: 'Listing not found' });
    } else {
      const listing = rows[0];
      res.status(200).json(listing);
    }
  });
});

// Search for listings based on various criteria
router.get('/search', (req, res) => {
  const { category, location, minPrice, maxPrice, keywords } = req.query; // Get search parameters from query

  // SQL query to search for listings based on provided criteria
  const selectQuery = 'SELECT * FROM listings WHERE category LIKE ? AND location LIKE ? AND price BETWEEN ? AND ? AND title LIKE ?';
  
  // Execute the query with the search parameters
  db.query(selectQuery, [`%${category}%`, `%${location}%`, minPrice, maxPrice, `%${keywords}%`], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    res.status(200).json(results[0]);
  });
});

// Delete a listing by ID
router.delete('/:listingId', (req, res) => {
  const listingId = req.params.listingId; // Get the listing ID from the URL
  const userId = req.user.id; // Get the user ID from the authenticated user

  // SQL query to delete a listing by its ID and user ID (for authorization)
  const deleteQuery = 'DELETE FROM listings WHERE id=? AND user_id=?';
  
  // Execute the query with the listing ID and user ID
  db.query(deleteQuery, [listingId, userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Listing not found or you do not have permission to delete it' });
    } else {
      res.json({ message: 'Listing deleted successfully' });
    }
  });
});

// Comment on a listing by ID
router.post('/comment/:listingId', (req, res) => {
  const listingId = req.params.listingId; // Get the listing ID from the URL
  const { commentContent } = req.body; // Get the comment content from the request body
  const userId = req.user.id; // Get the user ID from the authenticated user

  // SQL query to insert a comment into the database for a specific listing
  const insertQuery = 'INSERT INTO listing_comments (listing_id, user_id, content) VALUES (?, ?, ?)';
  
  // Execute the query with the listing ID, user ID, and comment content
  db.query(insertQuery, [listingId, userId, commentContent], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    res.status(201).json({ message: 'Comment added successfully' });
  });
});

module.exports = router;
