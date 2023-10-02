const express = require('express');
const router = express.Router();
const db = require('../data/db');

// Create Account
router.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  const insertQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
  db.query(insertQuery, [username, email, password], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.status(201).json({ message: 'User registered successfully' });
    }
  });
});

// Log In
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const selectQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(selectQuery, [email], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const rows = results[0];

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = rows[0];

    // Verify the password (You should replace this with password hashing in the future)
    if (password === user.password) {
      // Create a session for the user (you will need to use a session middleware, e.g., express-session)
      req.session.user = { id: user.id, username: user.username, email: user.email };
      return res.status(200).json({ message: 'Login successful' });
    } else {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  });
});

// Update user profile
router.put('/update', (req, res) => {
  const { username, email } = req.body;
  const userId = req.user.id;

  const updateQuery = 'UPDATE users SET username=?, email=? WHERE id=?';
  db.query(updateQuery, [username, email, userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'User not found or you do not have permission to update it' });
    } else {
      res.json({ message: 'User profile updated successfully' });
    }
  });
});

// Get User Profile
router.get('/profile', (req, res) => {
  if (!req.session.user) {
    res.status(401).json({ error: 'Unauthorized' });
  } else {
    // User is authenticated via session
    const userProfile = req.session.user;
    res.status(200).json(userProfile);
  }
});

module.exports = router;
