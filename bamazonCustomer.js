const MySql = require('mysql');
const Inquirer = require('inquirer');
const Table = require('cli-table');
const connection = MySql.createConnection({host: "localhost", port: 3306, user:"root", password: "Wagstaff2017", database: "bamazon_db"});

function chooseDept() {
	Inquirer.prompt({
    	name: "choice",
    	type: "rawlist",
    	message: "Display departments [Food] or [Beer] products",
    	choices: ["Food", "Beer"]
  	}).then(function(answer) {
  	var deptChoice = answer.choice
    displayDeptProducts(deptChoice);
  });
}
function displayDeptProducts(deptChoice) {
    connection.query('SELECT * FROM products WHERE ?', [{dept_name: deptChoice }], 
    	function(err, res) {
        if (err) { console.log(err) };
        var productsTbl = new Table({
            head: ['Item ID', 'Product', 'Category', 'Price', 'Quantity'],
            colWidths: [10, 15, 10, 10, 10]
        });
        for (i = 0; i < res.length; i++) {
            productsTbl.push(
                [res[i].item_id, res[i].product_name, res[i].dept_name, res[i].price, res[i].stk_quantity]
            );
        }
        console.log(productsTbl.toString());
        purchaseInquirer(deptChoice);
    });
};
function purchaseInquirer(deptChoice) {
    Inquirer.prompt([
        {
            name: "id",
            type: "input",
            message: "Item ID for purchase."
        }, {
            name: 'quantity',
            type: 'input',
            message: "How many?"
        },

    ]).then(function(answers) {
        var id = answers.id;
        var quantity = answers.quantity;
        if (id < 21) {
        	makePurchase(id, deptChoice, quantity);
        }
        else {
        	console.log("No ids match with the one you entered");
        	chooseDept();
        }
    });
};
function makePurchase(id, deptChoice, quantity) {
    connection.query('SELECT * FROM products WHERE item_id = ' + id, function(err, res) {
        if (err) { console.log(err) };
        var totalCost = parseFloat(res[0].price * quantity).toFixed(2);
        if (quantity <= res[0].stk_quantity) {
            console.log("Enough in stock!");
            console.log("Total cost for " + res[0].product_name + "[" + quantity + "]" + " is " + "$" + parseFloat(totalCost).toFixed(2) + ".");
            connection.query('UPDATE products SET stk_quantity = stk_quantity - ' + quantity + ' WHERE item_id = ' + id);
            // connection.query('UPDATE departments SET product_sales = product_sales + ' + totalCost + ' WHERE dept_name = ' + deptChoice);
        } else {
            console.log("Insufficent quatity of" + res[0].product_name + "(s)!");
        }
        // updateProductSales(deptChoice, totalCost);
        chooseDept();
    });
};
// function updateProductSales(deptChoice, totalCost) {
// 	connection.query('SELECT * FROM departments WHERE dept_name = ' + deptChoice, function(err, res) {
//         if (err) { console.log(err) };
//         connection.query('UPDATE departments SET product_sales = product_sales + ' +totalCost + ' WHERE dept_name = ' + deptChoice);
//         chooseDept();
//     });
// };
chooseDept();