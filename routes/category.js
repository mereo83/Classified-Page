const express = require('express');
const router = express.Router();
const db = require('../data/db'); // Import the db module
const session = require('express-session');

// Define a function to execute database queries with error handling
async function executeQuery(query, parameters) {
  try {
    const results = await new Promise((resolve, reject) => {
      db.query(query, parameters, (err, results) => {
        if (err) {
          reject({ error: 'Database Error: ' + err });
        } else {
          resolve(results);
        }
      });
    });
    return results;
  } catch (error) {
    throw error;
  }
}

// Create a new category
router.post('/create', async (req, res) => {
  try {
    const { title } = req.body;
    const insertQuery = 'INSERT INTO Category (title) VALUES (?)';
    const results = await executeQuery(insertQuery, [title]);
    
    if (results.error) {
      return res.status(500).json({ error: results.error });
    }
    res.status(201).json({ message: 'Category created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetch all categories
router.get('/', async (req, res) => {
  try {
    const selectQuery = 'SELECT * FROM Category';
    const results = await executeQuery(selectQuery);
    
    if (results.error) {
      return res.status(500).json({ error: results.error });
    }
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetch category by ID
router.get('/:categoryId', async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const selectQuery = 'SELECT * FROM Category WHERE id = ?';
    const results = await executeQuery(selectQuery, [categoryId]);
    
    if (results.error) {
      return res.status(500).json({ error: results.error });
    }
    
    const category = results[0];
    if (!category) {
      res.status(404).json({ error: 'Category not found' });
    } else {
      res.status(200).json(category);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update category by ID
router.put('/:categoryId', async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const { title } = req.body;
    const updateQuery = 'UPDATE Category SET title = ? WHERE id = ?';
    const results = await executeQuery(updateQuery, [title, categoryId]);
    
    if (results.error) {
      return res.status(500).json({ error: results.error });
    }
    
    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Category not found' });
    } else {
      res.json({ message: 'Category updated successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete category by ID
router.delete('/:categoryId', async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const deleteQuery = 'DELETE FROM Category WHERE id = ?';
    const results = await executeQuery(deleteQuery, [categoryId]);
    
    if (results.error) {
      return res.status(500).json({ error: results.error });
    }
    
    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Category not found' });
    } else {
      res.json({ message: 'Category deleted successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
