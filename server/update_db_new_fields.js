const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function updateDbFields() {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('Connected to database.');

        // Add full_name and matric_number to users table
        try {
            await connection.query('ALTER TABLE users ADD COLUMN full_name VARCHAR(255) AFTER username');
            console.log('Column full_name added.');
        } catch (err) {
            if (err.code === 'ER_DUP_COLUMNNAME') {
                console.log('Column full_name already exists.');
            } else {
                throw err;
            }
        }

        try {
            await connection.query('ALTER TABLE users ADD COLUMN matric_number VARCHAR(50) AFTER email');
            console.log('Column matric_number added.');
        } catch (err) {
            if (err.code === 'ER_DUP_COLUMNNAME') {
                console.log('Column matric_number already exists.');
            } else {
                throw err;
            }
        }

        console.log('Database update completed successfully.');

    } catch (error) {
        console.error('Database update failed:', error);
    } finally {
        if (connection) await connection.end();
    }
}

updateDbFields();
