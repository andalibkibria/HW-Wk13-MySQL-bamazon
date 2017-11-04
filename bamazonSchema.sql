DROP DATABASE bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
product_name VARCHAR(100) NOT NULL,
department_name VARCHAR(100) NOT NULL,
price FLOAT(10,2) NOT NULL,
stock_quantity INTEGER(11) NOT NULL,
PRIMARY KEY(item_id));