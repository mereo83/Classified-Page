-- Create the OLX-like classified database
CREATE DATABASE olx_classified;

USE olx_classified;

-- Create the users table with indexing on email
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  INDEX (email)
);

-- Create the listings table with indexing on user_id
CREATE TABLE listings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  location VARCHAR(255) NOT NULL,
  contact_info VARCHAR(255) NOT NULL,
  user_id INT NOT NULL,
  INDEX (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create the comments table with indexing on user_id and listing_id
CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  content TEXT NOT NULL,
  listing_id INT NOT NULL,
  user_id INT NOT NULL,
  INDEX (listing_id),
  INDEX (user_id),
  FOREIGN KEY (listing_id) REFERENCES listings(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create the contact_messages table with indexing on user_id, listing_id, and email
CREATE TABLE contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  message TEXT NOT NULL,
  listing_id INT NOT NULL,
  user_id INT NOT NULL,
  sender_type ENUM('buyer', 'seller') NOT NULL,
  INDEX (listing_id),
  INDEX (user_id),
  FOREIGN KEY (listing_id) REFERENCES listings(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
