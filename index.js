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
    makeBid(); //insert initial prompt function here
});

function runInit() {
    var query = "select title, department_id, salary from roleTable ";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
    })
}
function addStuff() {
    var query = "insert into employeeTable set ?"
    connection.query(query,
        {
            first_name: "Hello",
            last_name: "World",
        },
        function (err, res) {
            if (err) throw err;
            console.table(res);
        }
    );

    // logs the actual query being run
    console.log(query.sql);
}

function makeBid() {
    connection.query("SELECT * FROM employeeTable", function (err, res) {
        if (err) throw err;
        console.log(res);
        const firstAndLast = [];
        res.forEach(element => {
            firstAndLast.push(element.first_name + " " + element.last_name);
            console.log(firstAndLast);
            // connection.end();
        });
        inquirer
            .prompt([
                {
                    type: 'list',
                    message: 'Which employee would you like to remove?',
                    name: 'item',
                    choices: firstAndLast
                }
            ]).then(function (data) {
                // console.log(data.item.split(" "));
                var nameSplit = data.item.split(" ");
                console.log(nameSplit);
                let query = "delete from employeeTable where ? and ?"
                connection.query(query,
                    [{
                        first_name: nameSplit[0]
                    },
                    {
                        last_name: nameSplit[1]
                    }
                    ],
                    function (err, res) {
                        if (err) throw err;
                        console.log(res);
                    });
            });
    });
}

// insert into employeeTable set (sets new employee into table with first and last name)
// select title, department_id, salary from roleTable (displays title, department_id, salary)
// SELECT department from departmentTable (displays all departments)
// function runInit() {
//     inquirer
//         .prompt({
//             name: "action",
//             type: "list",
//             message: "What would you like to do?",
//             choices: [
//                 "Add employees",
//                 "Add roles",
//                 "Add departments",
//                 "View employee table",
//                 "View roles table",
//                 "View departments table"
//             ]
//         })
//         .then(function (answer) {
//             switch (answer.action) {
//                 case "Add employees":
//                     addEmployees();
//                     break;

//                 case "Add roles":
//                     addRoles();
//                     break;

//                 case "Add departments":
//                     addDepartments();
//                     break;

//                 case "View employee table":
//                     viewEmployees();
//                     break;

//                 case "View roles table":
//                     viewRoles();
//                     break;

//                 case "View departments table":
//                     viewDepartments();
//                     break;
//             }
//         });
// }