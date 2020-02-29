var mysql = require("mysql");
var inquirer = require("inquirer");

// Establish a connection to mysql
var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "#De198033",
    database: "employee_DB"
});

connection.connect(function (err) {
    if (err) throw err;
    runInit(); 
});

// Initial function containing prompts to view, add, update and delete from the database table
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
                "Remove employee",
                "Update role"
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

                case "Update role":
                    updateRole();
                    break;
            }
        });
}

// Displays a master table with employee information including their salary, role, and department
function viewEmployees() {
    let query = "select * from departmentTable inner join roleTable on roleTable.department_id = departmentTable.id inner join employeeTable on roleTable.id = employeeTable.role_id"; //not pulling new Hello World employees because no role id and department id to join on
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        runInit();
    })
}

// Displays all departments
function viewDepartments() {
    let query = "SELECT department from departmentTable";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        runInit();
    })
};

// Displays all roles
function viewRoles() {
    let query = "select title, department_id, salary from roleTable ";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        runInit();
    })
};

// Takes user input from prompts to add a new employee
function addEmployees() {
    connection.query("SELECT * FROM roleTable", function (err, results) {
        if (err) throw err;
        let employeeRoles = [];
        results.forEach(element => {
            employeeRoles.push(element.title); 
        });
        employeeRoles.push("New role", "None");
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
        ]).then(function (data) {
            if (data.role === "New role") {
                addRoles();
            };
            let nameSplit = data.firstLast.split(" ");
            let query1 = "select id, department_id from roleTable where title = ?";
            connection.query(query1, data.role, function (err, res) {
                if (err) throw err;
                let query2 = `insert into employeeTable set ?`
                connection.query(query2,
                    {
                        first_name: nameSplit[0],
                        last_name: nameSplit[1],
                        role_id: res[0].id
                    }, function (err, res) {
                        if (err) throw err;
                        console.log(`Employee: ${data.firstLast} has been added!`);
                        runInit();
                    });
            });
        });
    });
};

// Allows the user to add a new role under a department 
function addRoles() {
    connection.query("select * from departmentTable", function (err, res) {
        if (err) throw err;
        let departments = [];
        res.forEach(element => {
            departments.push(element.department);
        });
        departments.push("New Department")
        inquirer.prompt([
            {
                type: 'list',
                message: 'Does the role fall into any of these departments? If not, please select the "New Department" option',
                name: `department`,
                choices: departments
            },
            {
                type: `input`,
                message: `Insert the role title here: `,
                name: `newRole`
            },
            {
                type: `input`,
                message: `What is the salary for this role? `,
                name: `salary`
            }
        ]).then(function (data) {
            if (data.department === "New Department") {
                addDepartments();
            };
            let query = `select id from departmentTable where department = ?`;
            connection.query(query, data.department, function (err, res) {
                if (err) throw err;
                let query2 = `insert into roleTable set?`;
                connection.query(query2,
                    {
                        title: data.newRole,
                        salary: data.salary,
                        department_id: res[0].id
                    }, function (err, res) {
                        if (err) throw err;
                        console.log(`The new role: ${data.newRole} has been added!`);
                        runInit();
                    });
            })
        })
    });
};

// Create new department
function addDepartments() {
    inquirer.prompt(
        {
            type: 'input',
            message: 'Please enter the new department',
            name: 'newDepartment'
        }
    ).then(function (data) {
        connection.query("insert into departmentTable set ?", { department: data.newDepartment }, function (err, res) {
            if (err) throw err;
            console.log(`The new department: ${data.newDepartment} has been added!`)
            runInit();
        });
    })
};

// Remove an employee
function removeEmployee() {
    connection.query("SELECT * FROM employeeTable", function (err, res) {
        if (err) throw err;
        const firstAndLast = [];
        res.forEach(element => {
            firstAndLast.push(element.first_name + " " + element.last_name);
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
                let nameSplit = data.item.split(" ");
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
                        runInit();
                    });
            });
    });
};

// Allows the role for a specific employee to be changed/updated
function updateRole() {
    connection.query("select * from employeeTable", function (err, res) {
        inquirer.prompt(
            {
                type: `list`,
                name: `employee`,
                message: `Select the employee to update: `,
                choices: function () {
                    let employees = []
                    res.forEach(element => {
                        employees.push(element.first_name + " " + element.last_name)
                    })
                    return employees;
                },
            }).then(function (data) {
                connection.query("select * from roleTable", function (err, res) {
                    inquirer.prompt(
                        {
                            type: `list`,
                            name: `role`,
                            message: `Select the new role: `,
                            choices: function () {
                                let roles = []
                                res.forEach(element => {
                                    roles.push(element.title)
                                });
                                return roles;
                            }
                        }).then(function (response) {
                            let nameSplit = data.employee.split(" ");
                            let query = "select id from roleTable where ? = title";
                            connection.query(query,
                                response.role,
                                function (err, res) {
                                    if (err) throw err;
                                    let query2 = "update employeeTable set ? where ? and ?";
                                    connection.query(query2,
                                        [{
                                            role_id: res[0].id
                                        },
                                        {
                                            first_name: nameSplit[0]
                                        },
                                        {
                                            last_name: nameSplit[1]
                                        }
                                        ], function (err, res) {
                                            if (err) throw err;
                                            console.log("Role successfully updated!");
                                            runInit();
                                        })
                                });
                        });
                });
            });
    });
};