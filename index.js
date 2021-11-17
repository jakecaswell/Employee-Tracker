const cTable = require('console.table');
const inquirer = require('inquirer');
const connection = require('./db/connection');

// connect to the database
connection.connect(err => {
    if (err) throw err;
    console.log('Connected to the database')
    startApp();
});

// function that will start the inquirer prompt for the app (asks what you would like to do)
const startApp = () => {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', "Update an employee's role"],
            name: "selection"
        }
    ]).then(answer => {
        if (answer.selection === 'View all departments') {
            viewDepartments();
        } else if (answer.selection === 'View all roles') {
            viewRoles();
        } else if (answer.selection === 'View all employees') {
            viewEmployees();
        } else if (answer.selection === 'Add a department') {
            addDepartment();
        } else if (answer.selection === 'Add a role') {
            addRole();
        } else if (answer.selection === 'Add an employee') {
            addEmployee();
        } else if (answer.selection === "Update an employee's role") {
            updateRole();
        }
    })
}

// THESE FUNCTIONS ARE THE ACTUAL FUNCTIONS FOR THE SELECTION YOU CHOOSE IN THE BEGINNING PROMPT

const viewDepartments = () => {
    console.log('\nYou chose to view the departments!\n');
    const sql = `Select * From employeedb.department`;
    connection.query(sql, (err, res) => {
        if (err) {
            throw err
        }
        console.table(res);
        startApp();
    });

}

const viewRoles = () => {
    console.log('\nYou chose to view all the roles!\n');
    const sql = `SELECT roles.id, roles.title, roles.salary, department.department_name As Department From roles
                 Left Join department On roles.department_id = department.id`;
    connection.query(sql, (err, res) => {
        if (err) {
            throw err
        }
        console.table(res);
        startApp();
    })
}

const viewEmployees = () => {
    console.log('\nYou chose to view all the employees!\n');
    const sql = `SELECT employee.first_name, employee.last_name, roles.title As title, roles.salary As salary, department_name As department, employee.manager_id As manager 
                 FROM employeedb.employee
                 Left Join roles On employee.role_id = roles.id
                 Left Join department On roles.department_id = department.id`;
    connection.query(sql, (err, res) => {
        if (err) {
            throw err;
        }
        console.table(res);
        startApp();
    })
}

const addDepartment = () => {
    console.log('\nYou chose to add a department!\n');
    inquirer.prompt([
        {
            name: 'name',
            type: 'input',
            message: 'What is the name of the department you would like to add?'
        }
    ]).then(res => {
        const sql = `Insert Into department (department_name)
                     Values (?)`;
        connection.query(sql, res.name,
            function(err) {
                if (err) throw err
                viewDepartments();
                startApp();
            }
        )
    })
}

const addRole = () => {
    console.log('\nYou chose to add another role!\n');
}

const addEmployee = () => {
    console.log('\nYou chose to add a new employee!\n');
}

const updateRole = () => {
    console.log("\nYou chose to update an employee's role!\n");
}