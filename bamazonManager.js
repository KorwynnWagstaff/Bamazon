const MySql = require('mysql');
const Inquirer = require('inquirer');
const Table = require('cli-table');
const connection = MySql.createConnection({host: "localhost", port: 3306, user:"root", password: "Wagstaff2017", database: "bamazon_db"});

function chooseDept() {
	Inquirer.prompt({
    	name: "choice",
    	type: "rawlist",
    	message: "Display departments [Food] or [Beer]",
    	choices: ["Food", "Beer"]
  	}).then(function(user) {
  	var deptName = user.choice
    displayDeptProducts(deptName);
  });
}
function displayDeptProducts(deptName) {
    connection.query('SELECT * FROM products WHERE ?', [{dept_name: deptName}], 
    	function(err, res) {
        if (err) { console.log(err) };
        var deptProductsTbl = new Table({
            head: ['Item ID', 'Product', 'Category', 'Price', 'Quantity'],
            colWidths: [10, 15, 10, 10, 10]
        });
        for (i = 0; i < res.length; i++) {
            deptProductsTbl.push(
                [res[i].item_id, res[i].product_name, res[i].dept_name, res[i].price, res[i].stk_quantity]
            );
        }
        console.log(deptProductsTbl.toString());
        mainInquirer();
    });
};
function mainInquirer() {
    Inquirer.prompt([
        {
            name: "choice",
            type: "rawlist",
            message: "What would you like to do?",
            choices: ["View Products", "View Low Inventory", "Add Inventory", "Add New Product", "Remove Product"]
        }
    ]).then(function(user) {
        switch (user.choice) {
            case "View Products":
            chooseDept();
            break;
            case "View Low Inventory":
            displayLowInventory();
            break;
            case "Add Inventory":
            addInventory();
            break;
            case "Add New Product":
            addNewProduct();
            break;
            case "Remove Product":
            removeInqurier();
            break;
        }
    });
};
function displayLowInventory() {
    connection.query('SELECT * FROM products WHERE stk_quantity <= 5 ORDER BY stk_quantity ASC', function(err, res) {
        if (err) { console.log(err) };
        var lowInvTbl = new Table({
            head: ['Item ID', 'Product', 'Quantity'],
            colWidths: [10, 15, 10]
        });
        for (i = 0; i < res.length; i++) {
            lowInvTbl.push(
                [res[i].item_id, res[i].product_name, res[i].stk_quantity]
            );
        }
        console.log(lowInvTbl.toString());
        mainInquirer();
    });

};
function addInventory() {
    Inquirer.prompt([ 
        {
            name: "id",
            type: "input",
            message: "Item ID to restock."
        },
        {
            name: "quantity",
            type: "input",
            message: "How many?"
        },
    ]).then(function(userInput) {
        var id = userInput.id.trim();
        var newQuantity = userInput.quantity.trim();
        updateProduct(id, newQuantity);
    });
};
function updateProduct(id, newQuantity) {
    connection.query('SELECT * FROM products WHERE item_id = ' + id, function(err, res)
    {
        if (err) { console.log(err) };
        connection.query('UPDATE products SET stk_quantity = stk_quantity + ' + newQuantity + ' WHERE item_id = ' + id);
        mainInquirer();
    });
}
function addNewProduct() {
    Inquirer.prompt([ 
        {
            name: "productName",
            type: "input",
            message: "Product Name?"
        },
        {
            name: "deptName",
            type: "input",
            message: "Department?"
        },
        {
            name: "price",
            type: "input",
            message: "Price",
        },
        {
            name: "quantity",
            type: "input",
            message: "Amount?"
        },
    ]).then(function(userInput) {
        var productName = userInput.productName.trim();
        var deptName = userInput.deptName.trim();
        var price = userInput.price.trim();
        var quantity = userInput.quantity.trim();
        createNewProduct(productName, deptName, price, quantity);    
    });
};
function createNewProduct(productName, deptName, price, quantity) {
    connection.query('INSERT INTO products(product_name, dept_name, price, stk_quantity) VALUES ("' + productName + '","' + deptName + '",' +
        price + ',' + quantity + ')');
    mainInquirer();
};
function removeInqurier() {
    Inquirer.prompt([ 
        {
            name: "id",
            type: "input",
            message: "Item ID?"
        },
    ]).then(function(userInput) {
        var id = userInput.id;
        removeProduct(id);    
    });
};
function removeProduct(id) {
    connection.query('DELETE FROM products WHERE item_id = ' + id);
    mainInquirer();
};
mainInquirer();