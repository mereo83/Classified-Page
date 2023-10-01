const express = require('express');
const router = express.Router();
const db = require('../data/db');

// Create Account
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const insertQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    const result = await db.query(insertQuery, [username, email, password]);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Log In
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const selectQuery = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await db.query(selectQuery, [email]);

    if (rows.length === 0) {
      res.status(401).json({ error: 'Invalid credentials' });
    } else {
      const user = rows[0];

      // Verify the password (You should replace this with password hashing in the future)
      if (password === user.password) {
        // Create a session for the user (you will need to use a session middleware, e.g., express-session)
        req.session.user = { id: user.id, username: user.username, email: user.email };
        res.status(200).json({ message: 'Login successful' });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/update', async (req, res) => {
  const { username, email } = req.body;
  const userId = req.user.id;

  try {
    const updateQuery = 'UPDATE users SET username=?, email=? WHERE id=?';
    const result = await db.query(updateQuery, [username, email, userId]);

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'User not found or you do not have permission to update it' });
    } else {
      res.json({ message: 'User profile updated successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
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
