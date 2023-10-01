const express = require('express');
const router = express.Router();
const db = require('../data/db');

// Contact the seller of a listing
router.post('/:listingId/seller', async (req, res) => {
  const listingId = req.params.listingId;
  const { message } = req.body;
  const userId = req.user.id;

  try {
    const insertQuery = 'INSERT INTO contact_messages (listing_id, user_id, message, sender_type) VALUES (?, ?, ?, ?)';
    await db.query(insertQuery, [listingId, userId, message, 'buyer']);

    res.status(201).json({ message: 'Message sent to seller successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Contact the buyer of a listing
router.post('/:listingId/buyer', async (req, res) => {
  const listingId = req.params.listingId;
  const { message } = req.body;
  const userId = req.user.id;

  try {
    const insertQuery = 'INSERT INTO contact_messages (listing_id, user_id, message, sender_type) VALUES (?, ?, ?, ?)';
    await db.query(insertQuery, [listingId, userId, message, 'seller']);

    res.status(201).json({ message: 'Message sent to buyer successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetch messages for a listing
router.get('/:listingId/messages', async (req, res) => {
  const listingId = req.params.listingId;
  const userId = req.user.id;

  try {
    // SQL query to retrieve messages for a specific listing
    const selectQuery = 'SELECT * FROM contact_messages WHERE listing_id = ? AND (user_id = ? OR sender_type = ?)';
    const [rows] = await db.query(selectQuery, [listingId, userId, 'seller']);

    // Send the messages as a JSON response
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
