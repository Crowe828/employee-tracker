// Require Statements
const inquirer = require("inquirer");
const mysql = require("mysql");
const logo = require("asciiart-logo");
const cTable = require("console.table");
// const dbFunctions = require("./db/dbFunctions");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Xgeuaot1!",
  database: "employees",
});

// connect to the mysql server and sql database
connection.connect(function (err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  init();
});

// Function init()
function init() {
  const logoText = logo({ name: "Employee Manager" }).render();
  console.log(logoText);
  // Load our Prmpts
  loadPrompts();
}

function loadPrompts() {
  inquirer
    .prompt({
      type: "list",
      name: "choice",
      message: "What would you like to do?",
      choices: [
        { name: "Update an employee's role", value: "UPDATE_EMPLOYEES" },
        { name: "Add an employee", value: "ADD_EMPLOYEES" },
        { name: "Add a role", value: "ADD_ROLES" },
        { name: "Add a department", value: "ADD_DEPARTMENTS" },
        { name: "Exit" },
      ],
    })
    .then(function (answer) {
      if (answer.choice === "UPDATE_EMPLOYEES") {
        return updateEmployees();
      }
      if (answer.choice === "ADD_EMPLOYEES") {
        return addEmployees();
      }
      if (answer.choice === "ADD_ROLES") {
        return addRoles();
      }
      if (answer.choice === "ADD_DEPARTMENTS") {
        return addDepartments();
      } else {
        connection.end();
      }
    });
}

function updateEmployees() {
  connection.query(
    "SELECT * FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id",
    function (err, results) {
      console.table(results);
      if (err) throw err;
      inquirer
        .prompt([
          {
            type: "rawlist",
            name: "employee",
            message: "Which employee would you like to update?",
            choices: function () {
              let choiceArray = [];
              for (let i = 0; i < results.length; i++) {
                choiceArray.push(results[i].first_name);
              }
              return choiceArray;
            },
          },
          {
            type: "input",
            name: "role",
            message: "What should their new role be?",
          },
        ])
        .then(function (answer) {
          var newRole;
          for (var i = 0; i < results.length; i++) {
            if (results[i].first_name === answer.employee) {
              newRole = results[i];
            }
          }
          connection.query(
            "UPDATE role SET ? WHERE ?",
            [
              {
                title: answer.role,
              },
              {
                id: newRole.role_id,
              },
            ],
            function (err) {
              if (err) throw err;
              console.log("Employee role successfully updated.");
              loadPrompts();
            }
          );
        });
    }
  );
}

function addEmployees() {
  connection.query(
    "SELECT * FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id",
    function (err, results) {
      console.table(results);
      if (err) throw err;
      inquirer
        .prompt([
          {
            type: "input",
            name: "newEmployeeFN",
            message: "What is their first name?",
          },
          {
            type: "input",
            name: "newEmployeeLN",
            message: "What is their last name?",
          },
          {
            type: "rawlist",
            name: "newEmployeeRole",
            message: "What is their title?",
            choices: function () {
              let choiceArray = [];
              for (let i = 0; i < results.length; i++) {
                choiceArray.push(results[i].title);
              }
              return choiceArray;
            },
          },
        ])
        .then(function (answer) {
          var newRole;
          for (var i = 0; i < results.length; i++) {
            if (results[i].title === answer.newEmployeeRole) {
              newRole = results[i];
            }
          }
          connection.query(
            "INSERT INTO employee SET ?",
            {
              first_name: answer.newEmployeeFN,
              last_name: answer.newEmployeeLN,
              role_id: newRole.role_id,
            },
            function (err) {
              if (err) throw err;
              console.log("New employee added!");
            }
          );
        });
    }
  );
}
