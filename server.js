// Dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");
const logo = require("asciiart-logo");
const cTable = require("console.table");
const connection = require("./db/config/connection");

// First thing that appears is a large logo
function init() {
  const logoText = logo({ name: "Employee Tracker" }).render();
  console.log(logoText);
  // Load our Prmpts
  loadPrompts();
}

// Main questions page
function loadPrompts() {
  inquirer
    .prompt({
      type: "list",
      name: "choice",
      message: "What would you like to do?",
      choices: [
        { name: "View all data", value: "VIEW_ALL" },
        { name: "Update an employee's role", value: "UPDATE_EMPLOYEES" },
        { name: "Add an employee", value: "ADD_EMPLOYEES" },
        { name: "Add a role", value: "ADD_ROLES" },
        { name: "Add a department", value: "ADD_DEPARTMENTS" },
        { name: "Exit" },
      ],
    })
    // .switch (answer) {
    //   case value:

    //     break;

    //   default:
    //     break;
    // }
    // Depending on their answer, call the corresponding function
    .then(function (answer) {
      if (answer.choice === "VIEW_ALL") {
        return viewAll();
      }
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

// Displays all of the data in the database
function viewAll() {
  // Joining all of the tables by their id
  connection.query(
    "SELECT * FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id",
    function (err, results) {
      // Display the data in a table
      console.table(results);
      if (err) throw err;
      // Return to the main prompt
      loadPrompts();
    }
  );
}

// Update an existing employee
function updateEmployees() {
  // Inner join employee and role tables by their id
  connection.query(
    "SELECT * FROM employee LEFT JOIN role ON employee.role_id = role.id",
    function (err, results) {
      // Display the data in a table
      console.table(results);
      if (err) throw err;
      inquirer
        .prompt([
          {
            type: "input",
            name: "employee",
            message: "Which employee would you like to update?",
            // validate: (answer) => {
            //   for (var i = 0; i < results.length; i++) {
            //     if (results[i].first_name === answer) {
            //       return true;
            //     }
            //     return "Please enter an employee's first name.";
            //   }
            // },
          },
          {
            type: "input",
            name: "role",
            message: "What should their new role be?",
            // validate: (answer) => {
            //   for (var i = 0; i < results.length; i++) {
            //     if (results[i].title === answer) {
            //       return true;
            //     }
            //     return "Please enter an existing role.";
            //   }
            // },
          },
        ])
        .then(function (answer) {
          // If the name entered isn't in the database, it cannot be updated.
          var newRole;
          for (var i = 0; i < results.length; i++) {
            if (results[i].title === answer.role) {
              newRole = results[i];
            }
          }
          // Update the selected employee's info
          connection.query(
            "UPDATE employee SET ? WHERE ?",
            [
              {
                role_id: newRole.role_id,
              },
              {
                first_name: answer.employee,
              },
            ],
            function (err) {
              if (err) throw err;
              // Let the user know it worked and send them back to the main prompt
              console.log("Employee role successfully updated.");
              loadPrompts();
            }
          );
        });
    }
  );
}

// Add a new employee
function addEmployees() {
  // Inner join all of the data from the three tables
  connection.query(
    "SELECT * FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id",
    function (err, results) {
      // Display the data in a table
      console.table(results);
      if (err) throw err;
      inquirer
        .prompt([
          {
            type: "input",
            name: "newEmployeeFN",
            message: "What is their first name?",
            validate: (answer) => {
              if (answer !== "") {
                return true;
              }
              return "Please enter a first name.";
            },
          },
          {
            type: "input",
            name: "newEmployeeLN",
            message: "What is their last name?",
            validate: (answer) => {
              if (answer !== "") {
                return true;
              }
              return "Please enter a last name.";
            },
          },
          {
            type: "rawlist",
            name: "newEmployeeRole",
            message: "What is their title?",
            // Must choose an existing title
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
          // Insert the new employee into the employee table
          connection.query(
            "INSERT INTO employee SET ?",
            {
              first_name: answer.newEmployeeFN,
              last_name: answer.newEmployeeLN,
              role_id: newRole.role_id,
            },
            function (err) {
              if (err) throw err;
              // Let the user know it worked and send them back to the main prompt
              console.log("New employee added!");
              loadPrompts();
            }
          );
        });
    }
  );
}

// Add a new role
function addRoles() {
  // Inner join role and department tables
  connection.query(
    "SELECT * FROM role INNER JOIN department ON role.department_id = department.id",
    function (err, results) {
      // Display the data in a table
      console.table(results);
      if (err) throw err;
      inquirer
        .prompt([
          {
            type: "input",
            name: "newRoleTitle",
            message: "What is the title of the new role?",
            validate: (answer) => {
              if (answer !== "") {
                return true;
              }
              return "Please enter a title.";
            },
          },
          {
            type: "input",
            name: "newRoleSalary",
            message: "How much does this new role pay?",
            validate: (answer) => {
              if (answer !== "") {
                return true;
              }
              return "Please enter a salary.";
            },
          },
          {
            type: "input",
            name: "newRoleDepartment",
            message: "What department is this role in?",
            validate: (answer) => {
              for (var i = 0; i < results.length; i++) {
                if (results[i].name === answer) {
                  return true;
                }
                return "Please enter an existing department.";
              }
            },
          },
        ])
        .then(function (answer) {
          var newRole;
          for (var i = 0; i < results.length; i++) {
            if (results[i].name === answer.newRoleDepartment) {
              newRole = results[i];
            }
          }
          connection.query(
            // Insert the new role into the role table
            "INSERT INTO role SET ?",
            {
              title: answer.newRoleTitle,
              salary: answer.newRoleSalary,
              department_id: newRole.id,
            },
            function (err) {
              if (err) throw err;
              // Let the user know it worked and send them back to the main prompt
              console.log("New role added!");
              loadPrompts();
            }
          );
        });
    }
  );
}

// Add a new department
function addDepartments() {
  // Only the table of departments needs to be shown
  connection.query("SELECT * FROM department", function (err, results) {
    // Display the data in a table
    console.table(results);
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "input",
          name: "newDepartment",
          message: "What is the name of the new department?",
          validate: (answer) => {
            if (answer !== "") {
              return true;
            }
            return "Please enter a department name.";
          },
        },
      ])
      .then(function (answer) {
        // Insert the new department into the department table
        connection.query(
          "INSERT INTO department SET ?",
          {
            name: answer.newDepartment,
          },
          function (err) {
            if (err) throw err;
            // Let the user know it worked and send them back to the main prompt
            console.log("New department added!");
            loadPrompts();
          }
        );
      });
  });
}

// Run the start function after the connection is made to prompt the user
init();

// BONUS:
// Update employee managers

// View employees by manager

// Delete departments, roles, and employees

// View the total utilized budget of a department
// ie the combined salaries of all employees in that department

// You may wish to have a separate file containing functions for performing
// specific SQL queries you'll need to use. Could a constructor function or
// a class be helpful for organizing these?
