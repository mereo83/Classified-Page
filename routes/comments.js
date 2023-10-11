const express = require('express');
const router = express.Router();
const db = require('../data/db'); // Import the db module
const session = require('express-session');

// Create a comment on a listing
router.post('/create/:listingId', async (req, res) => {
  try {
    const listingId = req.params.listingId;
    const { cmessage } = req.body; // Assuming cmessage corresponds to comment content
    const userId = req.session.user.id; // Access user information from the session

    const insertQuery = 'INSERT INTO Contact (productid, userid, cmessage) VALUES (?, ?, ?)';

    const results = await executeQuery(insertQuery, [listingId, userId, cmessage]);

    if (results.error) {
      return res.status(500).json({ error: results.error });
    }

    res.status(201).json({ message: 'Comment created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetch comments for a listing
router.get('/:listingId', async (req, res) => {
  try {
    const listingId = req.params.listingId;

    const selectQuery = 'SELECT * FROM Contact WHERE productid = ?';

    const results = await executeQuery(selectQuery, [listingId]);

    if (results.error) {
      return res.status(500).json({ error: results.error });
    }

    const rows = results[0];
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a comment on a listing
router.put('/:commentId', async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const { cmessage } = req.body; // Assuming cmessage corresponds to comment content
    const userId = req.session.user.id; // Access user information from the session

    const updateQuery = 'UPDATE Contact SET cmessage = ? WHERE id = ? AND userid = ?';

    const results = await executeQuery(updateQuery, [cmessage, commentId, userId]);

    if (results.error) {
      return res.status(500).json({ error: results.error });
    }

    if (results.affectedRows === 0) {
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
  try {
    const commentId = req.params.commentId;
    const userId = req.session.user.id; // Access user information from the session

    const deleteQuery = 'DELETE FROM Contact WHERE id = ? AND userid = ?';

    const results = await executeQuery(deleteQuery, [commentId, userId]);

    if (results.error) {
      return res.status(500).json({ error: results.error });
    }

    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Comment not found or you do not have permission to delete it' });
    } else {
      res.json({ message: 'Comment deleted successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Define a function to execute the database query
function executeQuery(query, parameters) {
  return new Promise((resolve, reject) => {
    db.query(query, parameters, (err, results) => {
      if (err) {
        reject({ error: 'Database Error: ' + err });
      } else {
        resolve(results);
      }
    });
  });
}

module.exports = router;
