const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Brayan17!',
    database: 'brayan_db',
  });
  
  connection.connect(err => {
    if (err) throw err;
    console.log("Welcome to ETA (Employee Tracker App");
    startMenu();
  });

  const startMenu = () => {
    inquirer.prompt({
        message: 'What would you like to do today?',
        name: 'menu',
        type: 'list',
        choices: [
            'View all Departments',
            'View all Roles',
            'View all Employees',
            'Add a Department',
            'Add a Role',
            'Add an Employee',
            'Update Employee Role',
            'Exit'
        ],
    })
    .then(response => {
        switch (response.menu) {
        case 'View all Departments':
            viewDepartment();
            break;
        case 'View all Roles':
            viewRoles();
            break;
        case 'View all Employees':
            viewEmployees();
            break;
        case 'Add a Department':
            addDepartment();
            break;
        case 'Add a Role':
            addRole();
            break;
        case 'Add an Employee':
            addEmployee();
            break;
        case 'Update Employee Role':
            updateEmployee();
            break;
        case 'Exit':
            connection.end();
            break;
        default:
            connection.end();
        };
    });
  };

  const viewDepartment = () => {
    connection.query('SELECT * FROM department', function (err, res) {
        if (err) throw err;
        console.table(res);
        startMenu();
    });
  };

  const viewRoles = () => {
    connection.query('SELECT * FROM roles', function (err, res) {
        if (err) throw err;
        console.table(res);
        startMenu();
    });
  };

  const viewEmployees = () => {
    connection.query('SELECT employee.id, first_name, last_name, title, salary, dept_name, manager_id FROM ((department JOIN roles ON department.id = roles.department_id) JOIN employee ON roles.id = employee.job_id);', 
    function (err, res) {
        if (err) throw err;
        console.table(res);
        startMenu();
    });
  };

  const addDepartment = () => {
    inquirer.prompt([
        {
          name: 'department',
          type: 'input',
          message: 'What is the department name?',
        },
      ])
      .then(answer => {
        connection.query(
          'INSERT INTO department (dept_name) VALUES (?)',
          [answer.department],
          function (err, res) {
            if (err) throw err;
            console.log('Department added!');
            startMenu();
          }
        );
      });
  };

  const addRole = () => {
    inquirer.prompt([
        {
          name: 'roleTitle',
          type: 'input',
          message: 'What is the role title?',
        },
        {
          name: 'salary',
          type: 'input',
          message: 'What is the salary for this role?',
        },
        {
          name: 'deptId',
          type: 'input',
          message: 'What is the department ID number?',
        },
      ])
      .then(answer => {
        connection.query(
          'INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)',
          [answer.roleTitle, answer.salary, answer.deptId],
          function (err, res) {
            if (err) throw err;
            console.log('Role added!');
            startMenu();
          }
        );
      });
  };

  const addEmployee = () => {
    inquirer.prompt([
        {
          name: 'nameFirst',
          type: 'input',
          message: "What is the employee's first name?",
        },
        {
          name: 'nameLast',
          type: 'input',
          message: "What is the employee's last name?",
        },
        {
          name: 'roleId',
          type: 'input',
          message: "What is the employee's role id?",
        },
        {
          name: 'managerId',
          type: 'input',
          message: 'What is the manager Id?',
        },
      ])
      .then(answer => {
        connection.query(
          'INSERT INTO employee (first_name, last_name, job_id, manager_id) VALUES (?, ?, ?, ?)',
          [answer.nameFirst, answer.nameLast, answer.roleId, answer.managerId],
          function (err, res) {
            if (err) throw err;
            console.log('Employee added!');
            startMenu();
          }
        );
      });
  };

  const updateEmployee = () => {
    inquirer
      .prompt([
        {
          name: 'id',
          type: 'input',
          message: 'Enter employee id',
        },
        {
          name: 'roleId',
          type: 'input',
          message: 'Enter new role id',
        },
      ])
      .then(answer => {
        connection.query(
          'UPDATE employee SET job_id=? WHERE id=?',
          [answer.roleId, answer.id],
          function (err, res) {
            if (err) throw err;
            console.log('Employee updated!');
            startMenu();
          }
        );
      });
  };