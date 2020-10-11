// Require Statements
const inquirer = require("inquirer");
const mysql = require("mysql");
const logo = require("asciiart-logo");
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
        { name: "View All Employees", value: "VIEW_EMPLOYEES" },
        { name: "View All Roles", value: "VIEW_ROLES" },
        { name: "View All Departments", value: "VIEW_DEPARTMENTS" },
      ],
    })
    .then(function (answer) {
      if (answer.choice === "VIEW_EMPLOYEES") {
        return viewEmployees();
      }
      if (answer.choice === "VIEW_ROLES") {
        return viewRoles();
      }
      if (answer.choice === "VIEW_DEPARTMENTS") {
        return viewDepartments();
      }
    });

  // Switch Statement
  // switch (choice) {
  //   case "VIEW_EMPLOYEES":
  //     return viewEmployees();
  // }
}

function viewEmployees() {
  connection.query(
    "SELECT * FROM employee INNER JOIN role ON employee.role_id = role.id",
    function (err, results) {
      if (err) throw err;
      inquirer
        .prompt({
          type: "rawlist",
          name: "employee",
          message: "Which employee would you like to update?",
          choices: function () {
            let choiceArray = [];
            for (let i = 0; i < results.length; i++) {
              choiceArray.push(
                "NAME: " +
                  results[i].first_name +
                  " " +
                  results[i].last_name +
                  " ROLE: " +
                  results[i].title
              );
            }
            return choiceArray;
          },
        })
        .then(function () {
          viewRoles();
        });
    }
  );
}

function viewRoles() {
  connection.query(
    "SELECT * FROM role INNER JOIN department ON role.department_id = department.id",
    function (err, results) {
      if (err) throw err;
      inquirer.prompt({
        type: "rawlist",
        name: "role",
        message: "What should their new role be?",
        choices: function () {
          let choiceArray = [];
          for (let i = 0; i < results.length; i++) {
            choiceArray.push(
              "TITLE: " + results[i].title + " DEPARTMENT: " + results[i].name
            );
          }
          return choiceArray;
        },
      });
    }
  );
}

function viewDepartments() {
  connection.query("SELECT * FROM department", function (err, results) {
    if (err) throw err;
    inquirer.prompt({
      type: "rawlist",
      name: "department",
      message: "What is their new department?",
      choices: function () {
        let choiceArray = [];
        for (let i = 0; i < results.length; i++) {
          choiceArray.push(results[i].name);
        }
        return choiceArray;
      },
    });
  });
}
