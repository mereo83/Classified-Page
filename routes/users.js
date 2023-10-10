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
// This route returns the session data
router.get('/get-session', (req, res) => {
  try {
    // Access the session data
    const sessionData = req.session;

    if (!sessionData) {
      return res.status(404).json({ error: 'Session data not found' });
    }

    // Send the session data as a response
    res.json({ session: sessionData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Create Account
router.post('/register', (req, res) => {
  const { username, email, password, phonenumber } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing username, email, or password' });
  }

  try {
    // Format the current date and time for 'created_on' and 'updated_on'
    const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' '); // Format as 'YYYY-MM-DD HH:MM:SS'

    const insertQuery = 'INSERT INTO User (username, email, passwd, phonenumber, created_on, updated_on) VALUES (?, ?, ?, ?, STR_TO_DATE(?, "%Y-%m-%d %H:%i:%s"), STR_TO_DATE(?, "%Y-%m-%d %H:%i:%s"))';
    db.query(insertQuery, [username, email, password, phonenumber, currentDate, currentDate], (err, results) => {
      if (err) {
        console.error('Database Error:', err);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        console.log('User registered successfully');
        res.status(201).json({ message: 'User registered successfully' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Log In
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  try {
    const selectQuery = 'SELECT * FROM User WHERE email = ?';
    db.query(selectQuery, [email], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (results.length === 0) {
        console.log(`No user found for email: ${email}`);
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const user = results[0];

      console.log(`User found: ${user.email}`);
      
      if (password === user.passwd) {
        req.session.user = { id: user.id, username: user.username, email: user.email };
        return res.status(200).json({ message: 'Login successful' });
      } else {
        console.log('Password mismatch');
        return res.status(401).json({ error: 'Invalid credentials' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/update', (req, res) => {
  const { username, email } = req.body;
  
  try {
    // Check if req.session.user exists and has an 'id' property
    if (req.session.user && req.session.user.id) {
      const userId = req.session.user.id; // Get the user ID from the session

      // Fetch the existing 'created_on' date from the database
      db.query('SELECT created_on FROM User WHERE id = ?', [userId], (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length === 0) {
          return res.status(404).json({ error: 'User not found' });
        }

        const createdOnDate = results[0].created_on;

        // Update 'updated_on' and 'username' and 'email'
        const updateQuery = 'UPDATE User SET username=?, email=?, updated_on=NOW() WHERE id=?';
        db.query(updateQuery, [username, email, userId], (err, results) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
          }

          if (results.affectedRows === 0) {
            res.status(404).json({ error: 'User not found or you do not have permission to update it' });
          } else {
            res.json({ message: 'User profile updated successfully', created_on: createdOnDate });
          }
        });
      });
    } else {
      // Handle the case where the user is not authenticated
      res.status(401).json({ error: 'Unauthorized' });
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
