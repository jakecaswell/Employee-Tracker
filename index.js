const cTable = require('console.table');
const inquirer = require('inquirer');
const connection = require('./db/connection');

// connect to the database
connection.connect(err => {
    if (err) throw err;
    console.log('Connected to the database')
    startApp();
});

const startApp = () => {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', "Update an employee's role"],
            name: "selection"
        }
    ])
}