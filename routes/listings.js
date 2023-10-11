const express = require('express');
const router = express.Router();
const db = require('../data/db');
const session = require('express-session');

// Create a new listing
router.post('/create', async (req, res) => {
  try {
    const { title, description, category_id, price, paddress } = req.body;
    const userId = req.session.user.id;

    const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const insertQuery =
      'INSERT INTO Products (title, description, category_id, price, paddress, userid, created_on, updated_on) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

    const queryParameters = [title, description, category_id, price, paddress, userId, currentDate, currentDate];

    // Use async/await to execute the database query and handle any errors
    const results = await executeQuery(insertQuery, queryParameters);

    if (results.error) {
      return res.status(500).json({ error: results.error });
    }

    console.log('Listing created successfully');
    res.status(201).json({ message: 'Listing created successfully' });
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
