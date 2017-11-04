var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

var connection = mysql.createConnection({
	host: "localhost",
	port: process.env.PORT || 3000,

	user: "root",

	password: "1234",
	database: "bamazon"
});

connection.connect(function(err){
	if (err) throw err;
	console.log("connected as id " + connection.threadId);
});

console.log("Welcome to Bamazon!!");

var table = new Table({
    head: ['Item ID', 'Product Name', 'Department Name', 'Price', 'QTY in Stock']
});


connection.query("SELECT * FROM products", function(err,res){
	if (err) throw err;
	updateTable(res);

	inquirer.prompt([
		{
			type: "input",
			message: "Enter the ID of the product you would like to buy:",
			name: "productID"
		},
		{
			type: "input",
			message: "How many units would you like to buy?",
			name: "buyUnits"
		},
	]).then(function(user){
		console.log("User Buy Input: " + user.buyUnits);
		console.log("User product ID Input: " + user.productID);

		var productID = parseInt(user.productID);
		productID = productID - 1;

		var price = res[productID].price;
		console.log("Item Price:" + price);
		
		var qtyAvalible = res[productID].stock_quantity;
		console.log("DB Stock QTY before order: " + qtyAvalible);

		if(user.buyUnits>qtyAvalible){
			console.log("Insufficient quantity!");
		}else{
			console.log("Qty is avalible, your order has been placed.");
			connection.query("UPDATE products SET ? WHERE ?", [{
			  stock_quantity: qtyAvalible - user.buyUnits
			}, {
			  item_id: user.productID
			}], function(err, res) {});

			var finalPrice = user.buyUnits * price;
			console.log("The total cost will be $" + finalPrice.toFixed(2));
		}
		process.exit();
	});
});

function updateTable(data){
	for (var i = 0; i < data.length; i++){
		table.push(
		    [data[i].item_id, data[i].product_name, data[i].department_name, data[i].price, data[i].stock_quantity]
		);
	}
	console.log(table.toString());
}