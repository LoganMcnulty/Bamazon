var inquirer = require("inquirer");
var managerScript = require("./bamazonManager");
// var managerPass = new managerScript();

console.log(managerScript);
console.log(managerScript.manager)

managerScript.manager();

function launchBamazon(){
    inquirer.prompt([
        {
          type: "list",
          name: "role",
          message: "\nAre you a Customer, Manager, or Supervisor?",
          choices: ["Customer", "Manager", "Supervisor"]
        },
      ]).then(function(user) {
          if (user.role === "Customer"){
            console.log("fail")
          }
          else if (user.role === "Manager") {
            managerPass.launchBamazonManager();
          }
          else{
            console.log("fail")
          }
      })
}