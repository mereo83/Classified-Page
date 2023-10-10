const express = require('express');
const router = express.Router();
const db = require('../data/db');
const session = require('express-session');

// Middleware for session management
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

// Contact the seller of a listing
router.post('/:listingId/seller', (req, res) => {
  try {
    const listingId = req.params.listingId;
    const { message } = req.body;
    const userId = req.session.user.id;

    const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // SQL query to insert a message to the seller
    const insertQuery = 'INSERT INTO Contact (productid, userid, cmessage, sender_type, created_on) VALUES (?, ?, ?, ?, ?)';

    // Execute the query with the provided details and timestamps
    db.query(insertQuery, [listingId, userId, message, 'buyer', currentDate], (err, results) => {
      if (err) {
        console.error('Database Error:', err);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        console.log('Message sent to seller successfully');
        res.status(201).json({ message: 'Message sent to seller successfully' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Contact the buyer of a listing
router.post('/:listingId/buyer', (req, res) => {
  try {
    const listingId = req.params.listingId;
    const { message } = req.body;
    const userId = req.session.user.id;

    const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // SQL query to insert a message to the buyer
    const insertQuery = 'INSERT INTO Contact (productid, userid, cmessage, sender_type, created_on) VALUES (?, ?, ?, ?, ?)';

    // Execute the query with the provided details and timestamps
    db.query(insertQuery, [listingId, userId, message, 'seller', currentDate], (err, results) => {
      if (err) {
        console.error('Database Error:', err);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        console.log('Message sent to buyer successfully');
        res.status(201).json({ message: 'Message sent to buyer successfully' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetch messages for a listing
router.get('/:listingId/messages', (req, res) => {
  try {
    const listingId = req.params.listingId;
    const userId = req.session.user.id;

    // SQL query to retrieve messages for a specific listing
    const selectQuery = 'SELECT * FROM Contact WHERE productid = ? AND (userid = ? OR sender_type = ?)';

    // Execute the query with the provided details
    db.query(selectQuery, [listingId, userId, 'seller'], (err, results) => {
      if (err) {
        console.error('Database Error:', err);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        res.status(200).json(results[0]);
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
