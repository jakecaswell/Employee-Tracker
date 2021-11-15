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
    console.log('You chose to view the departments!');
    // startApp();
}

const viewRoles = () => {
    console.log('You chose to view all the roles!');
}

const viewEmployees = () => {
    console.log('You chose to view all the employees!');
}

const addDepartment = () => {
    console.log('You chose to add a department!');
}

const addRole = () => {
    console.log('You chose to add another role!');
}

const addEmployee = () => {
    console.log('You chose to add a new employee!');
}

const updateRole = () => {
    console.log("You chose to update an employee's role!");
}