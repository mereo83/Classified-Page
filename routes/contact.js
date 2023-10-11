const express = require('express');
const router = express.Router();
const db = require('../data/db');
const session = require('express-session');

// Common function to send a message
async function sendMessage(req, res, listingId, message, senderType) {
  try {
    const userId = req.session.user.id;
    const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // SQL query to insert a message
    const insertQuery = 'INSERT INTO Contact (productid, userid, cmessage, sender_type, created_on) VALUES (?, ?, ?, ?, ?)';

    const queryParameters = [listingId, userId, message, senderType, currentDate];

    const results = await executeQuery(insertQuery, queryParameters);

    if (results.error) {
      return res.status(500).json({ error: results.error });
    }

    const successMessage = senderType === 'buyer' ? 'Message sent to seller successfully' : 'Message sent to buyer successfully';
    console.log(successMessage);
    res.status(201).json({ message: successMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Send a message to the seller of a listing
router.post('/:listingId/seller', (req, res) => {
  const listingId = req.params.listingId;
  const { message } = req.body;
  sendMessage(req, res, listingId, message, 'buyer');
});

// Send a message to the buyer of a listing
router.post('/:listingId/buyer', (req, res) => {
  const listingId = req.params.listingId;
  const { message } = req.body;
  sendMessage(req, res, listingId, message, 'seller');
});

// Fetch messages for a listing
router.get('/:listingId/messages', async (req, res) => {
  try {
    const listingId = req.params.listingId;
    const userId = req.session.user.id;

    // SQL query to retrieve messages for a specific listing
    const selectQuery = 'SELECT * FROM Contact WHERE productid = ? AND (userid = ? OR sender_type = ?)';

    const results = await executeQuery(selectQuery, [listingId, userId, 'seller']);

    if (results.error) {
      return res.status(500).json({ error: results.error });
    }

    res.status(200).json(results[0]);
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
