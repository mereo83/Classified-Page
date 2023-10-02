CREATE DATABASE ClassifiedApp;


CREATE TABLE User(
id int NOT NULL UNIQUE PRIMARY KEY AUTO_INCREMENT
username varchar(50) NOT NULL UNIQUE,
email varchar(50) NOT NULL UNIQUE,
passwd varchar(50) NOT NULL,
created_on datetime,
updated_on datetime
);


CREATE TABLE Category(
id int NOT NULL UNIQUE PRIMARY KEY AUTO_INCREMENT,
title varchar(50) NOT NULL,
created_on datetime,
updated_on datetime
);

CREATE TABLE Products(
id int NOT NULL UNIQUE PRIMARY KEY AUTO_INCREMENT
category_id int NOT NULL,
title varchar(50) NOT NULL UNIQUE,
price varchar(50) NOT NULL UNIQUE,
paddress varchar(50) NOT NULL,
pstatus varchar(50) NOT NULL default=1,
created_on datetime,
updated_on datetime,
FOREIGN KEY(category_id) REFERENCES Category(id)
);


CREATE TABLE Contact(
id int NOT NULL UNIQUE PRIMARY KEY AUTO_INCREMENT
userid int NOT NULL,
productid int NOT NULL,
cmessage varchar(250) NOT NULL UNIQUE,
created_on datetime,
updated_on datetime,
FOREIGN KEY(userid) REFERENCES User(id),
FOREIGN KEY(productid) REFERENCES Products(id)
);


-- Create the comments table with indexing on user_id and listing_id
CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  content TEXT NOT NULL,
  product_id INT NOT NULL,
  user_id INT NOT NULL,
  INDEX (product_id),
  INDEX (user_id),
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (user_id) REFERENCES User(id)
);


-- Create the contact_messages table with indexing on user_id, listing_id, and email
CREATE TABLE contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  message TEXT NOT NULL,
  product_id INT NOT NULL,
  user_id INT NOT NULL,
  sender_type ENUM('buyer', 'seller') NOT NULL,
  INDEX (product_id),
  INDEX (user_id),
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (user_id) REFERENCES User(id)
);


