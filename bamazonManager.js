// Require NPMs 
    var mysql = require("mysql");
    var inquirer = require("inquirer");
    var Table = require('cli-table');

// --- GIT HUB MYSQL PASSWORD PROTECTION PROMPT ---
inquirer.prompt([
    {
        type: "password",
        name: "PW",
        message: "Enter MySQL PW"
    }
    ]).then(function(user) {

// CONNECT TO SQL DB
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
        launchBamazonManager();
    });

// --- LAUNCH FUNCTION --- 
    function launchBamazonManager(){
        inquirer.prompt([
            {
            type: "list",
            name: "task",
            message: "\nSelect the desired managerial task",
            choices: ["View Products for Sale", "Add To Inventory", "View Low Inventory", "Add a New Product"]
            },
        ]).then(function(user) {
            if (user.task === "View Products for Sale"){
                showItemsByDepartment()
            }
            else if (user.task === "Add To Inventory"){
                addToInventory();
            }
            else if (user.task === "View Low Inventory"){
                viewLowInventory();
            }
            else {
                addItem();
            }
        })
    };

//--- VIEW INVENTORY FUNCTIONS ---
    function showItemsByDepartment(){
        connection.query("SELECT department_name FROM products GROUP BY department_name", function(err, res){
            if (err) throw err;
            console.log("\n---List of existing Deparments---\n")
            for (i = 0; i < res.length; i++){
                console.log(`${res[i].department_name}`);
            }
            console.log();
            inquirer.prompt([
                {
                    type: "input",
                    name: "selectedDepartment",
                    message: "Which Department would you like to check?"
                },
                ]).then(function(user) {
                    showItemsForSelectedDepartment(user.selectedDepartment.trim().toLowerCase());
                })
        }
        )
    }

    function showItemsForSelectedDepartment(departmentPass) {
        connection.query(`SELECT * FROM products WHERE department_name = "${departmentPass}"`, function(err, res) {
            if (err) throw err;

            var table = new Table({
                head: ['Product','Inventory', 'ItemID']
              , colWidths: [30, 15, 10]
            });

            console.log(`\n---Inventory from the ${departmentPass} Department---\n`)
            for (i = 0; i < res.length; i++){
                let itemArray=[];
                itemArray.push(res[i].product_name, res[i].stock_quantity, res[i].id);
                table.push(itemArray);
            }
            console.log(table.toString())
            endConnection();
        });
    };

//---ADD TO INVENTORY FUNCTIONS ---
    function addToInventory() {
        connection.query("SELECT id FROM products", function(err, res){
            if (err) throw err;
            inquirer.prompt([
                {
                    type: "input",
                    name: "selectedItemID",
                    message: "Enter the itemID of the item you'd like to add inventory to"
                },
                {
                    type: "input",
                    name: "selectedItemQuantity",
                    message: "Enter the quantity you'd like to add"
                }
                ]).then(function(user) {
                    selectedItemID = parseInt(user.selectedItemID);
                    selectedItemQuantity = parseInt(user.selectedItemQuantity);
            // catch for numbers only 
                if((isNaN(selectedItemID)) || (isNaN(selectedItemQuantity))){
                    console.log("\n---Please make valid numerical entries and try again!---");
                    endConnection();
                }
            // verifying id 
                else { 
                    console.log("\n---Verifying ID provided---")
                    let validIDs = [];
                    for (i = 0; i < res.length; i++){
                        validIDs.push(res[i].id);
                    }
                    if(validIDs.includes(selectedItemID)){
                        pullCurrentQuantity(selectedItemID, selectedItemQuantity);
                    }
                    else{
                        console.log("\n---You have entered an invalid ItemID, please try again---\n")
                        endConnection();
                    }
                }
            })
    })
    }

    function pullCurrentQuantity(selectedItemID, selectedItemQuantity){
        connection.query(`SELECT stock_quantity, product_name FROM products WHERE id = "${selectedItemID}"`, function(err, res) {
            if (err) throw err;
            newQuantity = selectedItemQuantity + res[0].stock_quantity;
            addToInventoryPt2(selectedItemID, newQuantity, res[0].product_name);
        })
    }

    function addToInventoryPt2(selectedItemID, newQuantity, itemName){
        connection.query("UPDATE products SET ? WHERE ?",
        [{
            stock_quantity: newQuantity,
        },
        {
            id: selectedItemID
        }]
        , function (err, res){
            if (err) throw err;
            console.log(`\n---new inventory of ${itemName}(s) is ${newQuantity}---\n`);
            endConnection();
        });
    }

//---VIEW LOW INVENTORY FUNCTIONS ---
    function viewLowInventory() {
        connection.query("SELECT * FROM products", function(err, res){
            if (err) throw err;
            console.log(`\n--- Displaying products with low inventories (less than 5 in stock) ---`)

            var table = new Table({
                head: ['Product','Inventory', 'Department', 'ItemID']
              , colWidths: [30, 15, 20, 10]
            });

            for (i = 0; i < res.length; i++){
                if (res[i].stock_quantity < 5){
                    let itemArray = [];
                    itemArray.push(res[i].product_name, res[i].stock_quantity, res[i].department_name, res[i].id)
                    table.push(itemArray);
                }
            }
            console.log(table.toString())
        endConnection();
    })
    }

//--- ADD A NEW ITEM FUNCTIONS ---
    function addItem (){   
        inquirer.prompt([
        {
            type: "input",
            name: "newItem",
            message: "What item would you like to add?"
        },
        ]).then(function(user) {
            showDepartments(user.newItem);
        })
    };

    function showDepartments(newItemPass){
        connection.query("SELECT department_name FROM departments", function(err, res){
            if (err) throw err;
            console.log("\n---Existing Deparments---\n")
            let departmentArray = [];
            for (i = 0; i < res.length; i++){
                departmentArray.push(res[i].department_name)
                console.log(`${res[i].department_name}`);
            }
            console.log();
            addItemPt2(newItemPass, departmentArray);
        }
        )
    }

    function addItemPt2(newItemPass, departmentArray){
        var departmentArray = departmentArray
        inquirer.prompt([
        {
            type: "input",
            name: "itemDepartment",
            message: "Which Department will this item be featured in?\n (Enter a new Department if not listed)"
        },
        {
            type: "input",
            name: "startPrice",
            message: "Enter the price"
        },
        {
            type: "input",
            name: "itemStock",
            message: "Enter the starting inventory"
        }
        ]).then(function(user) {
            department = user.itemDepartment.trim().toLowerCase()
            connection.query(
                "INSERT INTO products SET ?",
                {
                    product_name: newItemPass,
                    department_name: department,
                    price: user.startPrice,
                    stock_quantity: user.itemStock
                },
            )

            console.log(`\n---Success, ${user.itemStock} ${newItemPass}(s)  added to the ${department} department!---`)

            if (!departmentArray.includes(user.itemDepartment))
            {
                updateDepartments(user.itemDepartment, user.itemStock, newItemPass);
            }
            else{
                endConnection();
            }
        });
    }

    function updateDepartments(newDepartment, newItemStock, newItemPass) {
        inquirer.prompt([
            {
                type: "input",
                name: "newDepartmentCost",
                message: (`What are the overhead costs for the new ${newDepartment} department?`)
            },
        ]).then(function(user){
            connection.query(
                "INSERT INTO departments SET ?",
                {
                    department_name: newDepartment,
                    over_head_costs: user.newDepartmentCost,
                },
            )
            console.log(`\n---Success, new ${newDepartment} department added!---`)
            console.log(`\n---Success, ${newItemStock} ${newItemPass}(s) added to the ${newDepartment} department!---`)
            endConnection();
        })
    }

// --- END CONNECTION FUNCTION ---
    function endConnection(){
        inquirer.prompt([
            {
            type: "list",
            name: "endConnection",
            message: (`\nWhat would you like to do?`),
            choices: ["Perform another task","End connection to platform"]
            },
        ]).then(function(user) {
            if (user.endConnection === "Perform another task"){
                launchBamazonManager();
            }
            else{
                connection.end(function(err) {
                    // The connection is terminated now
                    console.log("Thanks for visiting!");
                });
            }
        })
    }
})