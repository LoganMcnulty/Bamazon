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

INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales) values ('Jeans', 'clothing and fashion', 35, 12, 35*2);
INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales) values ('V-neck shirt', 'clothing and fashion', 15, 20, 15*2);
INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales) values ('Mens dress shoes', 'clothing and fashion', 65, 3, 65*2);
INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales) values ('Jogger Sweats', 'clothing and fashion', 25, 8, 25*2);
INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales) values ('blutooth speaker', 'electronics', 95, 10, 95*2);
INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales) values ('AlienWare Laptop', 'electronics', 1200, 4, 1200*1);
INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales) values ('wireless mouse', 'electronics', 18, 15, 18*4);
INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales) values ('wireless keyboard', 'electronics', 45, 13, 45*3);
INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales) values ('iPhone Charger', 'electronics', 9, 39, 9*10);
INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales) values ('stock trading', 'education and books', 35, 10, 35*5);
INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales) values ('Almond Butter', 'food and kitchen', 7, 20, 7*15);
INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales) values ('Mixed Nuts (5 lb bag)', 'food and kitchen', 28, 37, 28*3);
INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales) values ('Air Fryer', 'food and kitchen', 55, 15, 55*4);
INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales) values ('Ninja Blender', 'food and kitchen', 70, 9, 70*2);
INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales) values ('gatorade water bottle', 'sports', 3, 2, 3*25);
INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales) values ('protein powder', 'sports', 45, 28, 45*9);
INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales) values ('running shoes', 'sports', 95, 10, 95*3);
INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales) values ('foam roller', 'sports', 8, 36, 8*3);
INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales) values ('perfect pushup', 'sports', 15, 20, 15*4);

CREATE TABLE departments (
  department_id INTEGER(11) AUTO_INCREMENT NOT NULL PRIMARY KEY,
  department_name VARCHAR(30) NOT NULL,
  over_head_costs INTEGER(10) NOT NULL
);

INSERT INTO departments (department_name, over_head_costs) values ('food and kitchen', 350);
INSERT INTO departments (department_name, over_head_costs) values ('education and books', 150);
INSERT INTO departments (department_name, over_head_costs) values ('electronics', 500);
INSERT INTO departments (department_name, over_head_costs) values ('sports', 250);
INSERT INTO departments (department_name, over_head_costs) values ('clothing and fashion', 450);



-- FOR  CALCULATING PROFIT

SELECT d.department_name, d.over_head_costs, p.sales
FROM departments d
LEFT JOIN (SELECT p.department_name, SUM(p.product_sales) AS sales
FROM products p
GROUP BY p.department_name) p
ON d.department_name=p.department_name;