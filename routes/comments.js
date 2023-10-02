const express = require('express');
const router = express.Router();
const db = require('../data/db');

// Create a comment on a listing
router.post('/create/:listingId', (req, res) => {
  const listingId = req.params.listingId;
  const { content } = req.body;
  const userId = req.user.id;

  // SQL query to insert a comment on a listing
  const insertQuery = 'INSERT INTO comments (listing_id, user_id, content) VALUES (?, ?, ?)';
  
  // Execute the query with the provided details
  db.query(insertQuery, [listingId, userId, content], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.status(201).json({ message: 'Comment created successfully' });
    }
  });
});

// Fetch comments for a listing
router.get('/:listingId', (req, res) => {
  const listingId = req.params.listingId;

  // SQL query to retrieve comments for a specific listing
  const selectQuery = 'SELECT * FROM comments WHERE listing_id = ?';
  
  // Execute the query with the provided details
  db.query(selectQuery, [listingId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      const rows = results[0];
      res.status(200).json(rows);
    }
  });
});

// Update a comment on a listing
router.put('/:commentId', (req, res) => {
  const commentId = req.params.commentId;
  const { content } = req.body;
  const userId = req.user.id;

  // SQL query to update a comment if it belongs to the authenticated user
  const updateQuery = 'UPDATE comments SET content = ? WHERE id = ? AND user_id = ?';
  
  // Execute the query with the provided details
  db.query(updateQuery, [content, commentId, userId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      if (results.affectedRows === 0) {
        res.status(404).json({ error: 'Comment not found or you do not have permission to update it' });
      } else {
        res.json({ message: 'Comment updated successfully' });
      }
    }
  });
});

// Delete a comment on a listing
router.delete('/:commentId', (req, res) => {
  const commentId = req.params.commentId;
  const userId = req.user.id;

  // SQL query to delete a comment if it belongs to the authenticated user
  const deleteQuery = 'DELETE FROM comments WHERE id = ? AND user_id = ?';
  
  // Execute the query with the provided details
  db.query(deleteQuery, [commentId, userId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      if (results.affectedRows === 0) {
        res.status(404).json({ error: 'Comment not found or you do not have permission to delete it' });
      } else {
        res.json({ message: 'Comment deleted successfully' });
      }
    }
  });
});

module.exports = router;
