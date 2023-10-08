const express = require('express');
const app = express();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const port = 9000;

// Middleware for handling cookies
app.use(cookieParser());
app.use(
  session({
    secret: 'your_random_secret_here', // Use a secure and random secret
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 3600000, // Set your desired session duration in milliseconds
    },
  })
);

// Middleware for handling JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware for serving static files from the 'public' directory
app.use(express.static('public'));

// Import your route handlers
const usersRoute = require('./routes/users');
const listingsRoute = require('./routes/listings');
const commentsRoute = require('./routes/comments'); // Add this line for comments
const contactRoute = require('./routes/contact'); // Add this line for contact
const categoryRoute = require('./routes/category'); // Add this line for category

// Define your routes
app.use('/api/users', usersRoute);
app.use('/api/listings', listingsRoute);
app.use('/api/comments', commentsRoute); // Use the correct route for comments
app.use('/api/contact', contactRoute); // Use the correct route for contact
app.use('/api/category', categoryRoute); // Use the correct route for category

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
