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
                "View departments table",
                "Remove employee"
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

                case "Remove employee":
                    removeEmployee();
                    break;
            }
        });
}

function viewEmployees() {
    let query = "select * from departmentTable inner join roleTable on roleTable.department_id = departmentTable.id inner join employeeTable on roleTable.id = employeeTable.role_id"; //not pulling new Hello World employees because no role id and department id to join on
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        // runInit();
    })
}

function viewDepartments() {
    let query = "SELECT department from departmentTable";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        runInit();
    })
};

function viewRoles() {
    let query = "select title, department_id, salary from roleTable ";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        runInit();
    })
};

function addEmployees() {
    connection.query("SELECT * FROM roleTable", function (err, results) {
        if (err) throw err;
        console.log(results);
        let employeeRoles = [];
        // let employeeDepartments = [];
        results.forEach(element => {
            employeeRoles.push(element.title); // + " " + element.department_id
        });
        // results.forEach(element => {
        //     employeeDepartments.push(element.department_id);
        // })
        employeeRoles.push("New role", "None");
        console.log(`Roles pulled from query ${employeeRoles}`);
        inquirer.prompt([{
            name: "firstLast",
            type: "input",
            message: "Please enter your employee's first name and last name",
        },
        {
            name: "role",
            type: "list",
            message: "Please choose your employee's role",
            choices: employeeRoles
        } 
        // {
        //     name: "salary",
        //     type: "input",
        //     message: "Please enter your employee's salary"
        // },
            // {
            //     name: "department",
            //     type: "choice",
            //     message: "Please choose your employee's department"
            // }
        ]).then(function (data) {
            if (data.role === "New role"){
                addRoles();
                //insert add new role function
            };
            console.log("Responses from prompts " + data);
            let nameSplit = data.firstLast.split(" ");
            console.log(nameSplit);
            let query1 = "select id, department_id from roleTable where title = ?";//where title = ${data.role}`
            connection.query(query1, data.role, function (err, res) {
                if (err) throw err;
                console.log("The role id is: " + res[0].id + " and the department id is: " + res[0].department_id);
                let query2 = `insert into employeeTable set ?`
                connection.query(query2,
                    {
                        first_name: nameSplit[0],
                        last_name: nameSplit[1],
                        role_id: res[0].id
                    }, function (err, res) {
                        if (err) throw err;
                        console.log(res);
                    });
            });
        });
        // let query2 = `insert into employeeTable where first_name = ? and last_name = ? and role_id = ?` //don't know why this doesn't work
        // (first_name, last_name, role_id) values (${nameSplit[0]}, ${nameSplit[1]}, ${res[0].id})
    });
};

function removeEmployee() {
    connection.query("SELECT * FROM employeeTable", function (err, res) {
        if (err) throw err;
        console.log(res);
        const firstAndLast = [];
        res.forEach(element => {
            firstAndLast.push(element.first_name + " " + element.last_name);
            console.log(firstAndLast);
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
                        // console.log(res);
                        runInit();
                    });
            });
    });
};

// insert into employeeTable set (sets new employee into table with first and last name)
// departmentTable.department, departmentTable.id, roleTable.title, roleTable.salary, roleTable.department_id, employeeTable.first_name, employeeTable.last_name, employeeTable.role_id (select all)
