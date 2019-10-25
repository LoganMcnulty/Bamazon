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



})