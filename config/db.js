//Mysql2 Config
const mysql = require('mysql2/promise');

//Import config
const { DB } = require('../config.js');
const pool = mysql.createPool({
    host: DB.host,
    user: DB.user,
    password: DB.password,
    database: DB.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;