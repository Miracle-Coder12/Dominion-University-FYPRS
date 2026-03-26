const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

console.log(`Attempting DB connection to ${process.env.DB_HOST} with user ${process.env.DB_USER}...`);
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000
});

const promisePool = pool.promise();

// Test connection
pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'ER_BAD_DB_ERROR') {
            console.log('Database does not exist. Please create it manually or run the initialization script.');
        } else {
            console.error('Database connection failed: ' + err.stack);
        }
    } else {
        console.log('Connected to database as id ' + connection.threadId);
        connection.release();
    }
});

module.exports = promisePool;
