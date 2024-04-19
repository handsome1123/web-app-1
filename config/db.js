const mysql = require("mysql2");

// Connect to database 
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'web_pro'
});

module.exports = con;