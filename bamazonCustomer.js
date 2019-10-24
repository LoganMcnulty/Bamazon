var mysql = require("mysql");
var inquirer = require("inquirer");

inquirer.prompt([
    {
        type: "password",
        name: "PW",
        message: "Enter MySQL PW"
    }
    ]).then(function(user) {

var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: user.PW,
    database: "bamazon"
  });

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    launchBamazon();
});

function launchBamazon(){
    inquirer.prompt([
        {
          type: "list",
          name: "bid_ask",
          message: "\nWould you like to browse or post an item?",
          choices: ["browse", "end connection"]
        },
      ]).then(function(user) {
          if (user.bid_ask === "browse"){
            showItemsByDepartment()
          }
          else {
            connection.end(function(err) {
                if (err) throw err
                console.log("Thanks for visiting!");
              });
          }
      })
};

function showItemsByDepartment(){
    connection.query("SELECT department_name FROM products GROUP BY department_name", function(err, res){
        if (err) throw err;
        console.log("\n---Here's a list of our existing Deparments---\n")
        for (i = 0; i < res.length; i++){
            console.log(`${res[i].department_name}`);
        }
        console.log( )
        inquirer.prompt([
            {
                type: "input",
                name: "selectedDepartment",
                message: "Which Department would you like to browse?"
            },
            ]).then(function(user) {
                showItemsForSelectedDepartment(user.selectedDepartment.trim().toLowerCase());
            })
    })
}

function showItemsForSelectedDepartment(departmentPass) {
    connection.query(`SELECT * FROM products WHERE department_name = "${departmentPass}"`, function(err, res) {
        if (err) throw err;
        console.log(`\n---Here's a list of availale products and their prices from the ${departmentPass} Department---\n`)
        for (i = 0; i < res.length; i++){
            item = (`Item: ${res[i].product_name}, Price: ${res[i].price}, ItemID: ${res[i].id}`)
            console.log(`${item}\n `)
        }
        inquirer.prompt([
            {
                type: "input",
                name: "selectedItemID",
                message: "Please enter the itemID of the item you'd wish to purchase"
            },
            {
                type: "input",
                name: "selectedItemQuantity",
                message: "Please enter the quatntity you'd like to purchase"
            }
            ]).then(function(user) {
                selectedItemID = parseInt(user.selectedItemID);
                selectedItemQuantity = parseInt(user.selectedItemQuantity);

            if((isNaN(selectedItemID)) && (isNaN(selectedItemID))){
                console.log("\n---Please make valid numerical entries and try again!---");
                endConnection();
            }
            else { 
                console.log("\n---Verifying ID given---")
                let validIDs = [];
                for (i = 0; i < res.length; i++){
                    validIDs.push(res[i].id);
                }
                if(validIDs.includes(selectedItemID)){
                    checkOrderQuantity(selectedItemID, selectedItemQuantity, departmentPass);
                }
                else{
                    console.log("\n---You have entered an invalid ItemID, please try again---\n")
                    endConnection();
                }
            }
        })
    });
};

function checkOrderQuantity(selectedItemID, selectedItemQuantity){
    console.log("\n---Checking order quantity---")
    connection.query(`SELECT stock_quantity FROM products WHERE id = "${selectedItemID}"`, function(err, res) {
        if (err) throw err;
        if (res[0].stock_quantity >= selectedItemQuantity){
            calculateOrderPrice(selectedItemID, selectedItemQuantity, res[0].stock_quantity);
        }
        else {
            console.log(`---Your order size of ${selectedItemQuantity} is greater than the current stock which is ${res[0].stock_quantity}---`)
            endConnection();
        }
    })
}

function calculateOrderPrice(itemID, itemQuantity, stockQuantity){
    connection.query(`SELECT price FROM products WHERE id = "${itemID}"`, function(err, res){
        if (err) throw err;
        totalPriceToConsumer = itemQuantity * res[0].price;
        console.log(`\n---Thank you for your oder, the total cost is: $${totalPriceToConsumer}---`)
        newOrder(itemID, itemQuantity, stockQuantity, totalPriceToConsumer);
    })
}

function newOrder(itemID, itemQuantity, stockQuantity, totalPriceToConsumer){
    console.log("\n---Updating products Inventory---\n")
    var query = connection.query("UPDATE products SET ? WHERE ?",
    [{
        stock_quantity: stockQuantity - itemQuantity,
    },
    {
        id: itemID
    }]
    , function (err, res){
        if (err) throw err;
        console.log(`---${query.sql}---`);
        endConnection();
    });
    // console.log(itemQuantity)
    // inquirer.prompt([
    //     {
    //         type: "input",
    //         name: "bidderName",
    //         message: "What is your name?"
    //     },
    //     {
    //         type: "input",
    //         name: "newBidID",
    //         message: "What would you like to bid on? (Please enter ItemID)"
    //     },
    //     {
    //         type: "input",
    //         name: "newBidPrice",
    //         message: "What is your bid?"
    //     },
    //     ]).then(function(user) {
    //         if (user.newBidPrice.charAt(0) === "$"){
    //             fixedBid = user.newBidPrice.substring(1,100);
    //             fixedBid = parseInt(fixedBid, 10);
    //             fixedID = parseInt(user.newBidID, 10);
    //         }
    //         else{
    //             fixedBid = parseInt(user.newBidPrice, 10);
    //             fixedID = parseInt(user.newBidID, 10);
    //         }
    //         userSelectionID = fixedID;
    //         userBid = fixedBid;
    //         compareID = fixedID - 1;

    //         if (userBid < responseData[compareID].price){
    //             console.log(`Sorry ${user.bidderName}, your bid needs to be higher than the current price!`)
    //             endConnection();
    //         }
    //         else{
    //             console.log(`Congrats ${user.bidderName}, you are now the highest bidder!`);
    //             updateProductWithOrder(user);
    //         }
    //     });
}

function endConnection(){
    inquirer.prompt([
        {
          type: "list",
          name: "endConnection",
          message: (`\nWhat would you like to do?`),
          choices: ["Brose Items", "End connection to platform"]
        },
    ]).then(function(user) {
         if (user.endConnection === "Brose Items"){
            showItemsByDepartment();
        }
        else{
            connection.end(function(err) {
                if (err) throw err
                console.log("Thanks for visiting!");
              });
        }
    })
}
})