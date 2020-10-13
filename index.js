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
        { name: "View All Employees", value: "VIEW_EMPLOYEES" },
        { name: "View All Roles", value: "VIEW_ROLES" },
        { name: "View All Departments", value: "VIEW_DEPARTMENTS" },
        { name: "Exit" },
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
      } else {
        connection.end();
      }
    });
}

function viewEmployees() {
  connection.query(
    "SELECT * FROM employee INNER JOIN role ON employee.role_id = role.id",
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

// function viewDepartments() {
//   connection.query("SELECT * FROM department", function (err, results) {
//     if (err) throw err;
//     inquirer.prompt({
//       type: "rawlist",
//       name: "department",
//       message: "What is their new department?",
//       choices: function () {
//         let choiceArray = [];
//         for (let i = 0; i < results.length; i++) {
//           choiceArray.push(results[i].name);
//         }
//         return choiceArray;
//       },
//     });
//   });
// }
