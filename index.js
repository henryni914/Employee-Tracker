var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "#De198033",
    database: "employee_DB"
});

connection.connect(function (err) {
    if (err) throw err;
    runInit(); //insert initial prompt function here
});

function runInit() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "Add employees",
                "Add roles",
                "Add departments",
                "View employee table",
                "View roles table",
                "View departments table"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "Add employees":
                    addEmployees();
                    break;

                case "Add roles":
                    addRoles();
                    break;

                case "Add departments":
                    addDepartments();
                    break;

                case "View employee table":
                    viewEmployees();
                    break;

                case "View roles table":
                    viewRoles();
                    break;

                case "View departments table":
                    viewDepartments();
                    break;
            }
        });
}