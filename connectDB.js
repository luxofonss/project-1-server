let mysql = require("mysql2");

import dotenv from "dotenv";
dotenv.config();

let db = mysql.createPool({
  host: process.env.MYSQL_HOST,
  database: process.env.MYSQL_DATABASE,
  user: process.env.MYSQL_ROOT,
  password: process.env.MYSQL_PASSWORD,
  port: process.env.MYSQL_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = db;
