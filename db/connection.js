// Dependencies
const util = require("util");
var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Xgeuaot1!",
  database: "employees",
});

connection.connect();

// Use promises so we can use async/await instead pf callbacks
connection.query = util.promisify(connection.query);

module.exports = connection;
