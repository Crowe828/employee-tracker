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
  connection.query("SELECT * FROM employee", function (err, results) {
    if (err) throw err;
    inquirer.prompt({
      type: "rawlist",
      name: "employee",
      message: "Which employee would you like to update?",
      choices: function () {
        let choiceArray = [];
        for (let i = 0; i < results.length; i++) {
          choiceArray.push(results[i].first_name + " " + results[i].last_name);
        }
        return choiceArray;
      },
    });
  });
}
function viewRoles() {
  connection.query("SELECT * FROM role", function (err, results) {
    if (err) throw err;
    inquirer.prompt({
      type: "rawlist",
      name: "role",
      message: "Which role would you like to update?",
      choices: function () {
        let choiceArray = [];
        for (let i = 0; i < results.length; i++) {
          choiceArray.push(results[i].title);
        }
        return choiceArray;
      },
    });
  });
}
function viewDepartments() {
  connection.query("SELECT * FROM department", function (err, results) {
    if (err) throw err;
    inquirer.prompt({
      type: "rawlist",
      name: "department",
      message: "Which department would you like to update?",
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

// viewAllEmployees();
