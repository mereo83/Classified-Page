const express = require('express');
const router = express.Router();
const db = require('../data/db');

// Create a comment on a listing
router.post('/create/:listingId', async (req, res) => {
  const listingId = req.params.listingId;
  const { content } = req.body;
  const userId = req.user.id;

  try {
    const insertQuery = 'INSERT INTO comments (listing_id, user_id, content) VALUES (?, ?, ?)';
    await db.query(insertQuery, [listingId, userId, content]);

    res.status(201).json({ message: 'Comment created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetch comments for a listing
router.get('/:listingId', async (req, res) => {
  const listingId = req.params.listingId;

  try {
    // SQL query to retrieve comments for a specific listing
    const selectQuery = 'SELECT * FROM comments WHERE listing_id = ?';
    const [rows] = await db.query(selectQuery, [listingId]);

    // Send the comments as a JSON response
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a comment on a listing
router.put('/:commentId', async (req, res) => {
  const commentId = req.params.commentId;
  const { content } = req.body;
  const userId = req.user.id;

  try {
    // SQL query to update a comment if it belongs to the authenticated user
    const updateQuery = 'UPDATE comments SET content = ? WHERE id = ? AND user_id = ?';
    const result = await db.query(updateQuery, [content, commentId, userId]);

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Comment not found or you do not have permission to update it' });
    } else {
      res.json({ message: 'Comment updated successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a comment on a listing
router.delete('/:commentId', async (req, res) => {
  const commentId = req.params.commentId;
  const userId = req.user.id;

  try {
    // SQL query to delete a comment if it belongs to the authenticated user
    const deleteQuery = 'DELETE FROM comments WHERE id = ? AND user_id = ?';
    const result = await db.query(deleteQuery, [commentId, userId]);

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Comment not found or you do not have permission to delete it' });
    } else {
      res.json({ message: 'Comment deleted successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
