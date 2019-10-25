DROP DATABASE IF EXISTS Bamazon;
CREATE DATABASE Bamazon;

USE Bamazon;

CREATE TABLE products (
  id INTEGER(11) AUTO_INCREMENT NOT NULL PRIMARY KEY,
  product_name VARCHAR(30) NOT NULL,
  department_name VARCHAR(30) NOT NULL,
  price INTEGER(10) NOT NULL,
  stock_quantity INTEGER(10),
  product_sales INTEGER(10)
);

INSERT INTO products (product_name, department_name, price, stock_quantity) values ('Jeans', 'clothing and fashion', 35, 12);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('V-neck shirt', 'clothing and fashion', 15, 20);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('Mens dress shoes', 'clothing and fashion', 65, 3);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('Jogger Sweats', 'clothing and fashion', 25, 8);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('blutooth speaker', 'electronics', 95, 10);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('AlienWare Laptop', 'electronics', 1200, 4);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('wireless mouse', 'electronics', 18, 15);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('wireless keyboard', 'electronics', 45, 13);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('iPhone Charger', 'electronics', 9, 39);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('stock trading', 'education and books', 35, 10);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('Almond Butter', 'food and kitchen', 7, 20);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('Mixed Nuts (5 lb bag)', 'food and kitchen', 28, 37);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('Air Fryer', 'food and kitchen', 55, 15);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('Ninja Blender', 'food and kitchen', 70, 9);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('gatorade water bottle', 'sports', 3, 2);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('protein powder', 'sports', 45, 28);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('running shoes', 'sports', 95, 10);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('foam roller', 'sports', 8, 36);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('perfect pushup', 'sports', 15, 20);

CREATE TABLE departments (
  department_id INTEGER(11) AUTO_INCREMENT NOT NULL PRIMARY KEY,
  department_name VARCHAR(30) NOT NULL,
  over_head_costs INTEGER(10) NOT NULL
);

