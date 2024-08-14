const mysql = require('mysql2/promise');

const mySQLPool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'students_db',

})

module.exports = mySQLPool;