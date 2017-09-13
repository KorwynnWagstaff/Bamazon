DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;
USE bamazon_db;
CREATE TABLE products(
	item_id int not null auto_increment,
    product_name varchar(50) not null,
    dept_name varchar(50) not null,
    price decimal(10,2) not null,
    stk_quantity int not null,
    PRIMARY KEY (item_id)
);
INSERT INTO products(product_name, dept_name, price, stk_quantity) 
VALUES ('Apple', 'Food', 1.99, 100), 
('Orange', 'Food', 2.19, 100),
('Banana', 'Food', 2.39, 100),
('Pear', 'Food', 2.59, 100),
('Tomato', 'Food', 2.79, 100),
('Grape', 'Food', 2.99, 100),
('Chocolate', 'Food', 3.19, 100),
('Pancake', 'Food', 3.39, 100),
('Pork Chop', 'Food', 3.59, 100),
('Chicken', 'Food', 3.79, 100),
('Coors Light', 'Beer', 5.99, 100), 
('Budweiser', 'Beer', 6.19, 100),
('Bud Light', 'Beer', 6.39, 100),
('Rodeo Clown', 'Beer', 6.59, 100),
('Green Room', 'Beer', 6.79, 100),
('Corona Light', 'Beer', 6.99, 100),
('Corona Extra', 'Beer', 7.19, 100),
('Mich Ultra', 'Beer', 7.39, 100),
('Lone Star', 'Beer', 7.59, 100),
('Keystone', 'Beer', 7.79, 100);

CREATE TABLE departments(
	dept_id int not null auto_increment,
    dept_name varchar(50) not null,
    over_head_cost decimal (10,2) not null,
    product_sales decimal (10,2) not null,
    PRIMARY KEY (dept_id)
);

INSERT INTO departments(dept_name, over_head_cost, product_sales) 
VALUES ('Food', 10000, 0), 
('Beer', 20000, 0);

SELECT * FROM products;
SELECT * FROM departments;