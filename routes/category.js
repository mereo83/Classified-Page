const express = require('express');
const router = express.Router();
const db = require('../data/db');

// Create a new category
router.post('/create', (req, res) => {
  const { title } = req.body;

  // SQL query to insert a new category into the Category table
  const insertQuery = 'INSERT INTO Category (title) VALUES (?)';

  db.query(insertQuery, [title], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.status(201).json({ message: 'Category created successfully' });
    }
  });
});

// Fetch all categories
router.get('/', (req, res) => {
  // SQL query to retrieve all categories from the Category table
  const selectQuery = 'SELECT * FROM Category';

  db.query(selectQuery, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.status(200).json(results);
    }
  });
});

// Fetch category by ID
router.get('/:categoryId', (req, res) => {
  const categoryId = req.params.categoryId;

  // SQL query to retrieve a specific category by its ID
  const selectQuery = 'SELECT * FROM Category WHERE id = ?';

  db.query(selectQuery, [categoryId], (err, results) => {
    if (err) {
      console.error(err);
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
});

// Update category by ID
router.put('/:categoryId', (req, res) => {
  const categoryId = req.params.categoryId;
  const { title } = req.body;

  // SQL query to update a category by its ID
  const updateQuery = 'UPDATE Category SET title = ? WHERE id = ?';

  db.query(updateQuery, [title, categoryId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      if (results.affectedRows === 0) {
        res.status(404).json({ error: 'Category not found' });
      } else {
        res.json({ message: 'Category updated successfully' });
      }
    }
  });
});

// Delete category by ID
router.delete('/:categoryId', (req, res) => {
  const categoryId = req.params.categoryId;

  // SQL query to delete a category by its ID
  const deleteQuery = 'DELETE FROM Category WHERE id = ?';

  db.query(deleteQuery, [categoryId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      if (results.affectedRows === 0) {
        res.status(404).json({ error: 'Category not found' });
      } else {
        res.json({ message: 'Category deleted successfully' });
      }
    }
  });
});

module.exports = router;
