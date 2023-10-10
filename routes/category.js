const express = require('express');
const router = express.Router();
const db = require('../data/db'); // Import the db module
const session = require('express-session');

// Set up the session middleware
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

// Create a new category
router.post('/create', (req, res) => {
  try {
    const { title } = req.body;
  
    // SQL query to insert a new category into the Category table
    const insertQuery = 'INSERT INTO Category (title) VALUES (?)';
  
    db.query(insertQuery, [title], (err, results) => {
      if (err) {
        console.error('Database Error:', err);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        res.status(201).json({ message: 'Category created successfully' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetch all categories
router.get('/', (req, res) => {
  try {
    // SQL query to retrieve all categories from the Category table
    const selectQuery = 'SELECT * FROM Category';
  
    db.query(selectQuery, (err, results) => {
      if (err) {
        console.error('Database Error:', err);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        res.status(200).json(results);
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetch category by ID
router.get('/:categoryId', (req, res) => {
  try {
    const categoryId = req.params.categoryId;
  
    // SQL query to retrieve a specific category by its ID
    const selectQuery = 'SELECT * FROM Category WHERE id = ?';
  
    db.query(selectQuery, [categoryId], (err, results) => {
      if (err) {
        console.error('Database Error:', err);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        const category = results[0];
        if (!category) {
          res.status(404).json({ error: 'Category not found' });
        } else {
          res.status(200).json(category);
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update category by ID
router.put('/:categoryId', (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const { title } = req.body;
  
    // SQL query to update a category by its ID
    const updateQuery = 'UPDATE Category SET title = ? WHERE id = ?';
  
    db.query(updateQuery, [title, categoryId], (err, results) => {
      if (err) {
        console.error('Database Error:', err);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        if (results.affectedRows === 0) {
          res.status(404).json({ error: 'Category not found' });
        } else {
          res.json({ message: 'Category updated successfully' });
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete category by ID
router.delete('/:categoryId', (req, res) => {
  try {
    const categoryId = req.params.categoryId;
  
    // SQL query to delete a category by its ID
    const deleteQuery = 'DELETE FROM Category WHERE id = ?';
  
    db.query(deleteQuery, [categoryId], (err, results) => {
      if (err) {
        console.error('Database Error:', err);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        if (results.affectedRows === 0) {
          res.status(404).json({ error: 'Category not found' });
        } else {
          res.json({ message: 'Category deleted successfully' });
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
