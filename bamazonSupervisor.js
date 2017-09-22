const MySql = require('mysql');
const Inquirer = require('inquirer');
const Table = require('cli-table');
const connection = MySql.createConnection({host: "localhost", port: 3306, user:"root", password: "Wagstaff2017", database: "bamazon_db"});

function displayDeptSales(deptName) {
    connection.query('SELECT * FROM departments', 
    	function(err, res) {
        if (err) { console.log(err) };
        var deptProductsTbl = new Table({
            head: ['Department ID', ' Dept. Name', 'Overhead Costs', 'Sales', "Total Profit"],
            colWidths: [15, 15, 20, 10, 15]
        });
        for (i = 0; i < res.length; i++) {
            deptProductsTbl.push(
                [res[i].dept_id, res[i].dept_name, res[i].over_head_cost, res[i].product_sales, (res[i].product_sales - res[i].over_head_cost)]
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
            choices: ["View Product Sales by Department", "Create New Department", "Remove Department"]
        }
    ]).then(function(user) {
        switch (user.choice) {
            case "View Product Sales by Department":
            displayDeptSales();
            break;
            case "Create New Department":
            departmentInquirer();
            break;
            case "Remove Department":
            removeInquirer();
            break;
        }
    });
};
function departmentInquirer() {
	Inquirer.prompt([ 
        {
            name: "deptName",
            type: "input",
            message: "Deparment Name?"
        },
        {
            name: "overheadCost",
            type: "input",
            message: "Overhead Cost?"
        },
    ]).then(function(userInput) {
        var deptName = userInput.deptName.trim();
        var overheadCost = userInput.overheadCost.trim();
        var productSales = 0;
        createNewDept(deptName, overheadCost, productSales);
    });
};
function createNewDept(deptName, overheadCost, productSales) {
    connection.query('INSERT INTO departments(dept_Name, over_head_cost, product_sales) VALUES ("' + deptName + '","' + overheadCost + '",' + productSales + ')');
    mainInquirer();
};
function removeInquirer() {
    Inquirer.prompt([ 
        {
            name: "id",
            type: "input",
            message: "Department ID?"
        },
    ]).then(function(userInput) {
        var id = userInput.id;
        removeDept(id);    
    });
};
function removeDept(id) {
    connection.query('DELETE FROM departments WHERE dept_id = ' + id);
    mainInquirer();
};
mainInquirer();