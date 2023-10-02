// app.js

const express = require('express');
const app = express();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const port = 9000;

// ... Other imports and middleware ...
app.use(express.json());

app.use(cookieParser());
app.use(
  session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 3600000, // Set your desired session duration in milliseconds
    },
  })
);

// Import and use the routes
const usersRoute = require('./routes/users');
const listingsRoute = require('./routes/listings');
const commentsRoute = require('./routes/comments'); // Add this line for comments
const contactRoute = require('./routes/contact'); // Add this line for contact

app.use('/api/users', usersRoute);
app.use('/api/listings', listingsRoute);
app.use('/api/comments', commentsRoute); // Use the correct route for comments
app.use('/api/contact', contactRoute); // Use the correct route for contact

// ... Define other middleware and settings ...

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
