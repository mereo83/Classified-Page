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

// Create a new listing
router.post('/create', (req, res) => {
  try {
    const { title, description, category_id, price, paddress } = req.body;
    const userId = req.session.user.id; // Get the user ID from the authenticated user

    const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // SQL query to insert a new listing into the database
    const insertQuery = 'INSERT INTO Products (title, description, category_id, price, paddress, userid, created_on, updated_on) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

    // Execute the query with the provided listing details, user ID, and timestamps
    db.query(insertQuery, [title, description, category_id, price, paddress, userId, currentDate, currentDate], (err, results) => {
      if (err) {
        console.error('Database Error:', err);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        console.log('Listing created successfully');
        res.status(201).json({ message: 'Listing created successfully' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Other listing routes (get by ID, search, delete, comment) should follow a similar pattern with session and try-catch blocks.

module.exports = router;
