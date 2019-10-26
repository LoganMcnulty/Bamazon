// require NPMs
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
        launchBamazonSupervisor();
    });

    function launchBamazonSupervisor(){
        inquirer.prompt([
            {
              type: "list",
              name: "task",
              message: "\nSelect the desired supervisory task",
              choices: ["View Product Sales by Department", "Create New Department"]
            },
          ]).then(function(user) {
              if (user.task === "View Product Sales by Department"){
                profitCalc()
              }
              else{
                newDepartment();
              }
          })
    };


 // --- PROFIT CALC FUNCTION ---
    function profitCalc(){
        connection.query(
            "SELECT d.department_id, d.department_name, d.over_head_costs, p.sales FROM departments d LEFT JOIN (SELECT p.department_name, SUM(p.product_sales) AS sales FROM products p GROUP BY p.department_name) p ON d.department_name=p.department_name", 
            function(err, res){
                if (err) throw err;

                var table = new Table({
                    head: ['Department ID','Department Name','Overhead costs', 'Total Sales', 'Profit']
                  , colWidths: [20, 30, 20, 20, 20]
                });

                console.log(res)

                for (i = 0; i <res.length; i++){
                //catch for if a department does not have any sales (response = null)
                    if (!res[i].sales){
                        sales = 0;
                    }
                    else{
                        sales = res[i].sales
                    }
                    let departmentProfitArray = [];
                    departmentProfit = res[i].sales - res[i].over_head_costs;
                    departmentProfitArray.push(res[i].department_id, res[i].department_name, res[i].over_head_costs, sales, departmentProfit)
                    table.push(departmentProfitArray);
                }
                console.log(table.toString())
                endConnection();
        }
        )
    }

 // --- NEW DEPARTMENT FUNCTION ---   
    function newDepartment() {
        inquirer.prompt([
            {
                type: "input",
                name: "newDepartmentName",
                message: (`Enter the name of the new department`)
            },
            {
                type: "input",
                name: "newDepartmentCost",
                message: (`What are the overhead costs for the new department?`)
            }
        ]).then(function(user){
            connection.query(
                "INSERT INTO departments SET ?",
                {
                    department_name: user.newDepartmentName,
                    over_head_costs: user.newDepartmentCost,
                },
                function(err, res) {
                    if (err) throw err
                    console.log(`\n---Success new ${user.newDepartmentName} department added!---`)
                    endConnection();
                }
            )
            
        })
    }

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
                launchBamazonSupervisor();
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