const express = require('express');
const router = express.Router();
const db = require('../data/db');

// Create a new listing
router.post('/create', async (req, res) => {
  const { title, description, category, price, location, contactInfo } = req.body;
  const userId = req.user.id; // Get the user ID from the authenticated user

  try {
    // SQL query to insert a new listing into the database
    const insertQuery = 'INSERT INTO listings (title, description, category, price, location, contact_info, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
    
    // Execute the query with the provided listing details and the user ID
    await db.query(insertQuery, [title, description, category, price, location, contactInfo, userId]);

    // Send a success response if the listing is created successfully
    res.status(201).json({ message: 'Listing created successfully' });
  } catch (error) {
    console.error(error);
    // Send an error response if there is an internal server error
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetch a single listing by ID
router.get('/:listingId', async (req, res) => {
  const listingId = req.params.listingId; // Get the listing ID from the URL

  try {
    // SQL query to retrieve a single listing by its ID
    const selectQuery = 'SELECT * FROM listings WHERE id = ?';
    
    // Execute the query with the listing ID
    const [rows] = await db.query(selectQuery, [listingId]);

    if (rows.length === 0) {
      // Send a 404 response if the listing is not found
      res.status(404).json({ error: 'Listing not found' });
    } else {
      // Send the listing data if it is found
      const listing = rows[0];
      res.status(200).json(listing);
    }
  } catch (error) {
    console.error(error);
    // Send an error response if there is an internal server error
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Search for listings based on various criteria
router.get('/search', async (req, res) => {
  const { category, location, minPrice, maxPrice, keywords } = req.query; // Get search parameters from query

  try {
    // SQL query to search for listings based on provided criteria
    const selectQuery = 'SELECT * FROM listings WHERE category LIKE ? AND location LIKE ? AND price BETWEEN ? AND ? AND title LIKE ?';
    
    // Execute the query with the search parameters
    const [rows] = await db.query(selectQuery, [`%${category}%`, `%${location}%`, minPrice, maxPrice, `%${keywords}%`]);

    // Send the search results as a JSON response
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    // Send an error response if there is an internal server error
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a listing by ID
router.delete('/:listingId', async (req, res) => {
  const listingId = req.params.listingId; // Get the listing ID from the URL
  const userId = req.user.id; // Get the user ID from the authenticated user

  try {
    // SQL query to delete a listing by its ID and user ID (for authorization)
    const deleteQuery = 'DELETE FROM listings WHERE id=? AND user_id=?';
    
    // Execute the query with the listing ID and user ID
    const result = await db.query(deleteQuery, [listingId, userId]);

    if (result.affectedRows === 0) {
      // Send a 404 response if the listing is not found or unauthorized
      res.status(404).json({ error: 'Listing not found or you do not have permission to delete it' });
    } else {
      // Send a success response if the listing is deleted successfully
      res.json({ message: 'Listing deleted successfully' });
    }
  } catch (error) {
    console.error(error);
    // Send an error response if there is an internal server error
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Comment on a listing by ID
router.post('/comment/:listingId', async (req, res) => {
  const listingId = req.params.listingId; // Get the listing ID from the URL
  const { commentContent } = req.body; // Get the comment content from the request body
  const userId = req.user.id; // Get the user ID from the authenticated user

  try {
    // SQL query to insert a comment into the database for a specific listing
    const insertQuery = 'INSERT INTO listing_comments (listing_id, user_id, content) VALUES (?, ?, ?)';
    
    // Execute the query with the listing ID, user ID, and comment content
    await db.query(insertQuery, [listingId, userId, commentContent]);

    // Send a success response if the comment is added successfully
    res.status(201).json({ message: 'Comment added successfully' });
  } catch (error) {
    console.error(error);
    // Send an error response if there is an internal server error
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
