const mysql = require("mysql2");
require("dotenv").config();

const db = mysql
	.createConnection({
		host: "localhost",
		user: "root",
		password: process.env.DB_PASSWORD,
		database: "project_demo",
	})
	.promise();

module.exports = db;
