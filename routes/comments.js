const express = require('express');
const router = express.Router();
const db = require('../data/db'); // Import the db module
const session = require('express-session');

// Set up the session middleware
router.use(
  session({
    secret: 'your_secret_key', // Change this to a strong secret
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 3600000, // Set your desired session duration in milliseconds
    }
  })
);

// Create a comment on a listing
router.post('/create/:listingId', (req, res) => {
  try {
    const listingId = req.params.listingId;
    const { cmessage } = req.body; // Assuming cmessage corresponds to comment content
    const userId = req.session.user.id; // Access user information from the session

    // SQL query to insert a comment on a listing
    const insertQuery = 'INSERT INTO Contact (productid, userid, cmessage) VALUES (?, ?, ?)';

    // Execute the query with the provided details
    db.query(insertQuery, [listingId, userId, cmessage], (err, results) => {
      if (err) {
        console.error('Database Error:', err);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        res.status(201).json({ message: 'Comment created successfully' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetch comments for a listing
router.get('/:listingId', (req, res) => {
  try {
    const listingId = req.params.listingId;

    // SQL query to retrieve comments for a specific listing
    const selectQuery = 'SELECT * FROM Contact WHERE productid = ?';

    // Execute the query with the provided details
    db.query(selectQuery, [listingId], (err, results) => {
      if (err) {
        console.error('Database Error:', err);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        const rows = results[0];
        res.status(200).json(rows);
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a comment on a listing
router.put('/:commentId', (req, res) => {
  try {
    const commentId = req.params.commentId;
    const { cmessage } = req.body; // Assuming cmessage corresponds to comment content
    const userId = req.session.user.id; // Access user information from the session

    // SQL query to update a comment if it belongs to the authenticated user
    const updateQuery = 'UPDATE Contact SET cmessage = ? WHERE id = ? AND userid = ?';

    // Execute the query with the provided details
    db.query(updateQuery, [cmessage, commentId, userId], (err, results) => {
      if (err) {
        console.error('Database Error:', err);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        if (results.affectedRows === 0) {
          res.status(404).json({ error: 'Comment not found or you do not have permission to update it' });
        } else {
          res.json({ message: 'Comment updated successfully' });
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a comment on a listing
router.delete('/:commentId', (req, res) => {
  try {
    const commentId = req.params.commentId;
    const userId = req.session.user.id; // Access user information from the session

    // SQL query to delete a comment if it belongs to the authenticated user
    const deleteQuery = 'DELETE FROM Contact WHERE id = ? AND userid = ?';

    // Execute the query with the provided details
    db.query(deleteQuery, [commentId, userId], (err, results) => {
      if (err) {
        console.error('Database Error:', err);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        if (results.affectedRows === 0) {
          res.status(404).json({ error: 'Comment not found or you do not have permission to delete it' });
        } else {
          res.json({ message: 'Comment deleted successfully' });
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
