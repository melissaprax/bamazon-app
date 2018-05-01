let mysql = require('mysql');
let inquirer = require('inquirer');
require('console.table');

// initialize connection
let connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'bamazon'
});

// test connection
connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
    }
    loadProducts();
});

function loadProducts() {
    let query = 'SELECT * FROM products';
    connection.query(query, function(err, res) {
        // show the products
        console.table(res);

        // prompt customer for product
        promptCustomerForItem(res);
    });
}

function promptCustomerForItem(inventory) {
    inquirer.prompt([{
        type: 'input',
        name: 'choice', 
        message: 'What is the ID of the item you would like to purchase?',
    }]).then(function(val) {
        let choiceID = parseInt(val.choice);
        //query products to see if there is enough 
        let product = checkInventory(choiceID, inventory);
        if (product) {
            promptCustomerForQuantity(product);
        } else {
            console.log("That item is out of stock");
            loadProducts();
        }
    });
    
}

function promptCustomerForQuantity(product) {
    inquirer.prompt([{
        //prompt for quanity  (going to be a number)
    }]).then(function(val) {
        let quanity = parseInt(val.quantity);
        if (quanity > product.stock_quantity) {
            console.log('not enough');
            loadProducts();
        } else {
            makePurchase(product, quantity);
        }
    })
}

function makePurchase(purchase, quantity) {
    connection.query(
        //update database
        'UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?'
        [quantity, product.item_id],
        function(err, res) {

        }
    )
}

function checkInventory(choiceID, inventory) {
    for(var i=0; i < inventory.length; i++) {
        if (inventory[i].item_id === choiceId) {
            return inventory[i];
        }
    }
    return null; 
}