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
  inquirer.prompt({
    type: "list",
    name: "choice",
    message: "What would you like to do?",
    choices: [
      { name: "View All Employees", value: "VIEW_EMPLOYEES" },
      { name: "View All Roles", value: "VIEW_ROLES" },
      { name: "View All Departments", value: "VIEW_DEPARTMENTS" },
    ],
  });

  // Switch Statement
  // switch (choice) {
  //   case "VIEW_EMPLOYEES":
  //     return viewEmployees();
  // }
}

// function viewEmployees() {
//   connection.query("SELECT * FROM employee");
// }

// viewAllEmployees();
