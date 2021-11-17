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
    const sql = `SELECT employee.first_name, employee.last_name, roles.title As title, roles.salary As salary, department_name As department, manager.first_name As manager 
                 FROM employeedb.employee
                 Left Join roles On employee.role_id = roles.id
                 Left Join department On roles.department_id = department.id
                 Left Join employee manager On employee.manager_id = manager.id`;
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
                console.table(res);
                startApp();
            }
        )
    })
}

const addRole = () => {
    console.log('\nYou chose to add another role!\n');
    inquirer.prompt([
        {
            name: 'role',
            type: 'input',
            message: 'What role are you adding?'
        }, 
        {
            name: 'salary',
            type: 'input',
            message: 'What is the salary for this position?'
        }
    ]).then(answer => {
        const sql = `Insert Into roles (roles.title, roles.salary)
                     Values (?,?)`;
        const params = [answer.role, answer.salary]
        connection.query(sql, params, (err, res) => {
            if (err) throw err;
            console.table(answer);
            startApp();
        } )
    })
}

// gets all the roles from the database into an array, allowing you to choose one when creating an employee
let roleArr = [];
const chooseRole = () => {
    const sql = `Select * From roles`;
    connection.query(sql, (err, res) => {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            roleArr.push(res[i].title)
        }
    })
    return roleArr;
}

// gets all the employees into an array, allowing you to choose one as manager when creating employee
let employeeArr = [];
const chooseManager = () => {
    const sql = `Select first_name, last_name From employee`;
    connection.query(sql, (err, res) => {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            employeeArr.push(res[i].first_name);
        }
    })
    return employeeArr;
}


const addEmployee = () => {
    console.log('\nYou chose to add a new employee!\n');
    inquirer.prompt([
        {
            name: 'firstName',
            type: 'input',
            message: 'What is your first name?'
        },
        {
            name: 'lastName',
            type: 'input',
            message: 'What is your last name?'
        },
        {
            name: 'role',
            type: 'list',
            choices: chooseRole(),
            message: 'What is your role here?'
        },
        {
            name: 'manager',
            type: 'list',
            message: 'Who is your manager?',
            choices: chooseManager()
        }
    ]).then(answer => {
        const roleId = chooseRole().indexOf(answer.role) + 1
        const managerId = chooseManager().indexOf(answer.manager) + 1
        const sql = `Insert Into employee (employee.first_name, employee.last_name, employee.role_id, employee.manager_id)
                     Values (?,?,?,?)`;
        const params = [answer.firstName, answer.lastName, roleId, managerId];
        connection.query(sql, params, (err, res) => {
            if (err) throw err;
            console.table(answer);
            startApp();
        })
    })
}

const updateRole = () => {
    console.log("\nYou chose to update an employee's role!\n");
    const sql = `Select employee.first_name, roles.title From employee
Left Join roles On employee.role_id = roles.id`;
    connection.query(sql, (err, res) => {
        if (err) throw err;
        console.log(res);
        inquirer.prompt([
            {
                name: 'employee',
                type: 'list',
                message: 'Who would you like to update?',
                choices: function() {
                    let updatedEmployee = [];
                    for (var i = 0; i < res.length; i++) {
                        updatedEmployee.push(res[i].first_name)
                    }
                    return updatedEmployee;
                }
            },
            {
                name: 'newrole',
                type: 'list',
                message: 'What role would you like to choose?',
                choices: chooseRole()
            }
        ]).then(answer => {
            const roleId = chooseRole().indexOf(answer.newrole) + 1;
            const sql = `Update employee Set role_id = ?
            Where first_name =?`;
            const params = [roleId, answer.employee]
            connection.query(sql, params, (err, res) => {
                if (err) throw err;
                console.table(answer);
                startApp();
            })
        })
    })
}