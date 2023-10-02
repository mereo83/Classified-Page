const express = require('express');
const router = express.Router();
const db = require('../data/db');

// Contact the seller of a listing
router.post('/:listingId/seller', (req, res) => {
  const listingId = req.params.listingId;
  const { message } = req.body;
  const userId = req.user.id;

  // SQL query to insert a message to the seller
  const insertQuery = 'INSERT INTO contact_messages (listing_id, user_id, message, sender_type) VALUES (?, ?, ?, ?)';
  
  // Execute the query with the provided details
  db.query(insertQuery, [listingId, userId, message, 'buyer'], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.status(201).json({ message: 'Message sent to seller successfully' });
    }
  });
});

// Contact the buyer of a listing
router.post('/:listingId/buyer', (req, res) => {
  const listingId = req.params.listingId;
  const { message } = req.body;
  const userId = req.user.id;

  // SQL query to insert a message to the buyer
  const insertQuery = 'INSERT INTO contact_messages (listing_id, user_id, message, sender_type) VALUES (?, ?, ?, ?)';
  
  // Execute the query with the provided details
  db.query(insertQuery, [listingId, userId, message, 'seller'], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.status(201).json({ message: 'Message sent to buyer successfully' });
    }
  });
});

// Fetch messages for a listing
router.get('/:listingId/messages', (req, res) => {
  const listingId = req.params.listingId;
  const userId = req.user.id;

  // SQL query to retrieve messages for a specific listing
  const selectQuery = 'SELECT * FROM contact_messages WHERE listing_id = ? AND (user_id = ? OR sender_type = ?)';
  
  // Execute the query with the provided details
  db.query(selectQuery, [listingId, userId, 'seller'], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.status(200).json(results[0]);
    }
  });
});

module.exports = router;
