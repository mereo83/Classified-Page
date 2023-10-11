const express = require('express');
const router = express.Router();
const { db, queryPromise } = require('../data/db');

// Middleware to check if a user is logged in
function requireLogin(req, res, next) {
  if (!req.session.user || !req.session.user.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// Route to get session data
router.get('/get-session', (req, res) => {
  try {
    const sessionData = req.session;

    if (!sessionData) {
      return res.status(404).json({ error: 'Session data not found' });
    }

    res.json({ session: sessionData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to create an account
router.post('/register', async (req, res) => {
  const { username, email, password, phonenumber } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing username, email, or password' });
  }

  try {
    const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const insertQuery =
      'INSERT INTO User (username, email, passwd, phonenumber, created_on, updated_on) VALUES (?, ?, ?, ?, STR_TO_DATE(?, "%Y-%m-%d %H:%i:%s"), STR_TO_DATE(?, "%Y-%m-%d %H:%i:%s"))';
    await queryPromise(insertQuery, [username, email, password, phonenumber, currentDate, currentDate]);

    console.log('User registered successfully');
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to log in
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const selectQuery = 'SELECT * FROM User WHERE email = ?';
    const results = await queryPromise(selectQuery, [email]);

    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = results[0];

    if (password === user.passwd) {
      req.session.user = { id: user.id, username: user.username, email: user.email };
      return res.status(200).json({ message: 'Login successful' });
    } else {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to update user profile
router.put('/update', requireLogin, async (req, res) => {
  const { username, email } = req.body;
  const userId = req.session.user.id;

  try {
    const dateQuery = 'SELECT created_on FROM User WHERE id = ?';
    const dateResults = await queryPromise(dateQuery, [userId]);

    if (dateResults.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const createdOnDate = dateResults[0].created_on;

    const updateQuery = 'UPDATE User SET username=?, email=?, updated_on=NOW() WHERE id=?';
    const updateResult = await queryPromise(updateQuery, [username, email, userId]);

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found or you do not have permission to update it' });
    }

    res.json({ message: 'User profile updated successfully', created_on: createdOnDate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to get user profile
router.get('/profile', requireLogin, (req, res) => {
  const userProfile = req.session.user;
  res.status(200).json(userProfile);
});

module.exports = router;
